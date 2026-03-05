#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <ESPmDNS.h>
#include <PubSubClient.h>
#include "driver/ledc.h"
#include <LiquidCrystal_I2C.h>


// ====== Configuração WiFi ======
const char* ssid = "GuieYas";           
const char* password = "guiyas2025";    


// ====== Configuração MQTT ======
const char* mqtt_broker = "broker.emqx.io";
const int mqtt_port = 1883;

// ===== CONTROLES (Comando/Estado Separados) =====
const char* mqtt_topic_bomba_set = "irrigacao-automatica/bomba/set";       // Recebe comandos (sem retain)
const char* mqtt_topic_bomba_state = "irrigacao-automatica/bomba/state";   // Publica estado (com retain)
const char* mqtt_topic_config_set = "irrigacao-automatica/config/set";     // Recebe configurações (sem retain)
const char* mqtt_topic_config_state = "irrigacao-automatica/config/state"; // Publica configurações (com retain)

// ===== LEITURA (apenas publicação) =====
const char* mqtt_topic_status = "irrigacao-automatica/status";             // Publica sensores (sem retain)

WiFiClient espClient;
PubSubClient mqtt_client(espClient);    


// ====== Definição dos pinos ======
const int sensor1 = 33;
const int sensor2 = 32;
const int sensor3 = 35;
const int ldr = 34;
const int ledVermelho = 26;
const int ledVerde = 27;
const int buzzer = 14;
const int releBomba = 23;


// ====== Configuração do LCD 20x4 I2C ======
LiquidCrystal_I2C lcd(0x27, 20, 4);  // Endereco I2C 0x27, LCD 20x4


// ====== Configuração do Sistema ======
int limiteSecoMinimo = 30;    // Bomba liga quando umidade cai abaixo disto
int limiteSecoMaximo = 70;    // Bomba desliga quando umidade sobe acima disto
bool bombaLigadaManual = false;
bool modoAutomatico = true;
bool estadoAnteriorBomba = false;
bool alertasSonoros = true;

// ====== Controle de Buzzer Não-Bloqueante ======
bool buzzerAtivo = false;
unsigned long buzzerTempoInicio = 0;
int buzzerDuracaoDesejada = 0;


// ====== Servidor Web e Variáveis ======
WebServer server(80);
int valor1 = 0, valor2 = 0, valor3 = 0, media = 0;
int ldrValor = 0;
String statusSolo = "UMIDO";
unsigned long ultimaLeitura = 0;


// ====== Protótipos ======
void handleRoot();
void handleDados();
void handleBomba();
void handleConfig();
void handleBuzzer();
void lerSensores();
void controlarIrrigacao();
void adicionarHeadersCORS();
void atualizarLCD();
void acionarAlertyaSonoro(int duracao);
void conectarMQTT();
void callbackMQTT(char* topic, byte* payload, unsigned int length);


// ====== Função: Conectar ao Broker MQTT ======
void conectarMQTT() {
  mqtt_client.setServer(mqtt_broker, mqtt_port);
  mqtt_client.setCallback(callbackMQTT);
  
  int tentativas = 0;
  while (!mqtt_client.connected() && tentativas < 10) {
    Serial.print("🌐 MQTT: Conectando ao broker...");
    
    String clientId = "ESP32_Irrigacao_" + String(random(0xffff), HEX);
    if (mqtt_client.connect(clientId.c_str())) {
      Serial.println(" ✅ Conectado!");
      
      // Se inscrever nos tópicos de COMANDO (sem retain)
      mqtt_client.subscribe(mqtt_topic_bomba_set);
      mqtt_client.subscribe(mqtt_topic_config_set);
      
      // Publicar status inicial
      String statusJson = "{\"status\":\"online\",\"ip\":\"" + WiFi.localIP().toString() + "\"}";
      mqtt_client.publish(mqtt_topic_status, statusJson.c_str());    } else {
      Serial.print(" ❌ Falhou. Tentativa ");
      Serial.print(tentativas + 1);
      Serial.println("/10");
      delay(2000);
      tentativas++;
    }
  }
}


// ====== Callback MQTT ======
void callbackMQTT(char* topic, byte* payload, unsigned int length) {
  String topicStr = String(topic);
  String payloadStr = "";
  
  for (unsigned int i = 0; i < length; i++) {
    payloadStr += (char)payload[i];
  }
  
  Serial.println("📨 MQTT recebido:");
  Serial.print("   Tópico: ");
  Serial.println(topicStr);
  Serial.print("   Payload: ");
  Serial.println(payloadStr);
  
  // ===== Controlar Bomba via MQTT (apenas /set) =====
  // IMPORTANTE: Escuta APENAS irrigacao-automatica/bomba/set
  // Evita que mensagens retidas causem loop ligue/desligue
  if (topicStr == mqtt_topic_bomba_set) {
    StaticJsonDocument<256> doc;
    DeserializationError error = deserializeJson(doc, payloadStr);
    
    if (!error) {
      bool novoBomba = false;
      bool comandoRecebido = false;
      
      // Aceita formato: {"bomba": true}
      if (doc.containsKey("bomba")) {
        novoBomba = doc["bomba"];
        comandoRecebido = true;
      }
      // Aceita formato: {"estado": true}
      else if (doc.containsKey("estado")) {
        novoBomba = doc["estado"];
        comandoRecebido = true;
      }
      
      if (comandoRecebido) {
        // Atualizar estado manual
        bombaLigadaManual = novoBomba;
        
        // ⚡ CORREÇÃO CRÍTICA: Desativar modo automático ao receber comando manual
        // Evita que controlarIrrigacao() sobrescreva o estado manual
        modoAutomatico = false;
        
        Serial.print("🔄 Bomba alterada via MQTT: ");
        Serial.println(novoBomba ? "LIGADA" : "DESLIGADA");
        Serial.println("   ⚙️ Modo Automático DESATIVADO (controle manual)");
        
        // Acionar o relé
        digitalWrite(releBomba, novoBomba ? HIGH : LOW);
        
        // Publicar novo estado com RETAIN em /state
        // IMPORTANTE: retain=true evita perder o estado em caso de reconexão
        String stateJson = "{\"estado\":" + String(novoBomba ? "true" : "false") + "}";
        mqtt_client.publish(mqtt_topic_bomba_state, stateJson.c_str(), true);
        
        Serial.print("✅ Estado publicado em /state: ");
        Serial.println(stateJson);
      } else {
        Serial.println("❌ Comando inválido - esperado 'bomba' ou 'estado'");
      }
    } else {
      Serial.println("❌ Erro ao desserializar JSON");
    }
  }
  
  // ===== Configurações via MQTT =====
  if (topicStr == mqtt_topic_config_set) {
    StaticJsonDocument<256> doc;
    DeserializationError error = deserializeJson(doc, payloadStr);
    
    if (!error) {
      bool configAlterada = false;
      
      if (doc.containsKey("limiteSecoMinimo")) {
        limiteSecoMinimo = doc["limiteSecoMinimo"];
        Serial.print("✅ Limite Seco Mínimo atualizado: ");
        Serial.println(limiteSecoMinimo);
        configAlterada = true;
      }
      if (doc.containsKey("limiteSecoMaximo")) {
        limiteSecoMaximo = doc["limiteSecoMaximo"];
        Serial.print("✅ Limite Seco Máximo atualizado: ");
        Serial.println(limiteSecoMaximo);
        configAlterada = true;
      }
      // Backward compatibility: se receber limiteSeco antigo, converter para novo
      if (doc.containsKey("limiteSeco")) {
        int limiteAntigo = doc["limiteSeco"].as<int>();
        limiteSecoMinimo = limiteAntigo - 10;
        limiteSecoMaximo = limiteAntigo + 30;
        Serial.print("✅ [COMPAT] Convertendo limiteSeco para: ");
        Serial.print(limiteSecoMinimo);
        Serial.print(" - ");
        Serial.println(limiteSecoMaximo);
        configAlterada = true;
      }
      if (doc.containsKey("modoAutomatico")) {
        modoAutomatico = doc["modoAutomatico"];
        Serial.print("✅ Modo Automático: ");
        Serial.println(modoAutomatico ? "ATIVADO" : "DESATIVADO");
        configAlterada = true;
      }
      if (doc.containsKey("alertasSonoros")) {
        alertasSonoros = doc["alertasSonoros"];
        Serial.print("✅ Alertas Sonoros: ");
        Serial.println(alertasSonoros ? "ATIVADOS" : "DESATIVADOS");
        configAlterada = true;
      }
      
      // Se alguma config foi alterada, publicar novo estado com retain
      if (configAlterada) {
        StaticJsonDocument<256> configState;
        configState["limiteSecoMinimo"] = limiteSecoMinimo;
        configState["limiteSecoMaximo"] = limiteSecoMaximo;
        configState["modoAutomatico"] = modoAutomatico;
        configState["alertasSonoros"] = alertasSonoros;
        
        String configJson;
        serializeJson(configState, configJson);
        mqtt_client.publish(mqtt_topic_config_state, configJson.c_str(), true);
        
        Serial.print("✅ Configuração publicada em /state: ");
        Serial.println(configJson);
      }
    }
  }
}

// ====== Setup ======
void setup() {
  Serial.begin(115200);
  delay(1000);


  // ====== Configuração de pinos ======
  pinMode(ledVerde, OUTPUT);
  pinMode(ledVermelho, OUTPUT);
  pinMode(releBomba, OUTPUT);


  // ====== Inicialização do LCD ======
  lcd.init();
  lcd.backlight();
  lcd.print("Irrigacao ESP32");
  lcd.setCursor(0, 1);
  lcd.print("Inicializando...");
  delay(2000);
  lcd.clear();


  // ====== Configuração do PWM do buzzer (ESP32 core 3.3.5) ======
  ledc_timer_config_t ledc_timer = {
    .speed_mode = LEDC_LOW_SPEED_MODE,
    .duty_resolution = LEDC_TIMER_8_BIT,
    .timer_num = LEDC_TIMER_0,
    .freq_hz = 1000,
    .clk_cfg = LEDC_AUTO_CLK
  };
  ledc_timer_config(&ledc_timer);


  ledc_channel_config_t ledc_channel = {
    .gpio_num = buzzer,
    .speed_mode = LEDC_LOW_SPEED_MODE,
    .channel = LEDC_CHANNEL_0,
    .timer_sel = LEDC_TIMER_0,
    .duty = 0,
    .hpoint = 0
  };
  ledc_channel_config(&ledc_channel);


  // ====== Estado inicial ======
  digitalWrite(ledVerde, LOW);
  digitalWrite(ledVermelho, LOW);
  digitalWrite(releBomba, LOW);
  ledc_set_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0, 0);
  ledc_update_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0);


  // ====== Teste de Hardware ======
  Serial.println("\n=== TESTE DE HARDWARE ===");


  Serial.println("Testando LED Vermelho...");
  digitalWrite(ledVermelho, HIGH);
  delay(500);
  digitalWrite(ledVermelho, LOW);
  delay(500);


  Serial.println("Testando LED Verde...");
  digitalWrite(ledVerde, HIGH);
  delay(500);
  digitalWrite(ledVerde, LOW);
  delay(500);


  Serial.println("Testando Buzzer...");
  ledc_set_freq(LEDC_LOW_SPEED_MODE, LEDC_TIMER_0, 1000);
  ledc_set_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0, 128);
  ledc_update_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0);
  delay(500);
  ledc_set_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0, 0);
  ledc_update_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0);
  delay(500);


  Serial.println("Teste concluído!");
  Serial.println("======================\n");


  // ====== Conexão WiFi ======
  Serial.println("\n=== Sistema de Irrigacao ESP32 ===");
  WiFi.begin(ssid, password);


  Serial.print("Conectando ao WiFi");
  int tentativas = 0;
  while (WiFi.status() != WL_CONNECTED && tentativas < 20) {
    delay(500);
    Serial.print(".");
    tentativas++;
  }


  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi conectado!");
    Serial.print("Endereco IP: ");
    Serial.println(WiFi.localIP());

    if (MDNS.begin("irrigacao")) {
      Serial.println("mDNS iniciado: http://irrigacao.local");
    }
    
    // ====== Conectar ao MQTT ======
    delay(1000);
    conectarMQTT();
  } else {
    Serial.println("\nFalha ao conectar WiFi!");
  }


  // ====== Rotas do servidor ======
  server.on("/", HTTP_GET, handleRoot);
  server.on("/dados", HTTP_GET, handleDados);
  server.on("/bomba", HTTP_POST, handleBomba);
  server.on("/config", HTTP_POST, handleConfig);
  server.on("/buzzer", HTTP_POST, handleBuzzer);
  server.on("/teste-buzzer", HTTP_GET, []() {
    adicionarHeadersCORS();
    Serial.println("🔔 Teste de buzzer acionado via GET");
    acionarAlertyaSonoro(1000);
    server.send(200, "application/json", "{\"success\":true,\"message\":\"Buzzer testado\"}");
  });

  server.on("/buzzer", HTTP_OPTIONS, []() {
    adicionarHeadersCORS();
    server.send(200);
  });


  server.on("/dados", HTTP_OPTIONS, []() {
    adicionarHeadersCORS();
    server.send(200);
  });
  server.on("/bomba", HTTP_OPTIONS, []() {
    adicionarHeadersCORS();
    server.send(200);
  });
  server.on("/config", HTTP_OPTIONS, []() {
    adicionarHeadersCORS();
    server.send(200);
  });


  server.begin();
  Serial.println("Servidor HTTP iniciado na porta 80!");
  Serial.println("-------------------------------------");
}


// ====== Loop principal ======
void loop() {
  server.handleClient();
  
  // ===== Manter MQTT conectado =====
  if (!mqtt_client.connected()) {
    if (WiFi.status() == WL_CONNECTED) {
      conectarMQTT();
    }
  } else {
    mqtt_client.loop();
  }

  // ===== Controle do buzzer não-bloqueante =====
  if (buzzerAtivo) {
    if (millis() - buzzerTempoInicio >= buzzerDuracaoDesejada) {
      ledc_set_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0, 0);
      ledc_update_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0);
      buzzerAtivo = false;
      Serial.println("🔊 Buzzer OFF");
    }
  }

  if (millis() - ultimaLeitura >= 2000) {
    lerSensores();
    controlarIrrigacao();
    atualizarLCD();
    ultimaLeitura = millis();
  }
}


// ====== Headers CORS ======
void adicionarHeadersCORS() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}


// ====== Leitura dos sensores ======
void lerSensores() {
  int adc1 = analogRead(sensor1);
  int adc2 = analogRead(sensor2);
  int adc3 = analogRead(sensor3);


  int percent1 = (100 * (4095 - adc1)) / 2995;
  int percent2 = (100 * (4095 - adc2)) / 2995;
  int percent3 = (100 * (4095 - adc3)) / 2995;


  percent1 = constrain(percent1, 0, 100);
  percent2 = constrain(percent2, 0, 100);
  percent3 = constrain(percent3, 0, 100);


  int ldrADC = analogRead(ldr);
  ldrValor = (ldrADC / 4095.0) * 100;
  ldrValor = constrain(ldrValor, 0, 100);


  int mediaPercent = (percent1 + percent2 + percent3) / 3;
  statusSolo = (mediaPercent < 40) ? "SECO" : "UMIDO";


  valor1 = adc1;
  valor2 = adc2;
  valor3 = adc3;
  media = mediaPercent;


  Serial.printf("S1:%d%% S2:%d%% S3:%d%% | Media:%d%% | LDR:%d%% | %s\n", 
    percent1, percent2, percent3, media, ldrValor, statusSolo.c_str());
}


// ====== Controle da irrigação ======
void controlarIrrigacao() {
  bool bombaLigadaAgora = false;
  
  // ✅ HISTERESE: Bomba com dois limiares
  // Liga quando umidade CAIR ABAIXO de limiteSecoMinimo
  // Desliga quando umidade SUBIR ACIMA de limiteSecoMaximo
  // Evita oscilação em valores intermediários
  
  bool soloMuitoSeco = (media < limiteSecoMinimo);      // Ligar
  bool soloUmidoSuficiente = (media > limiteSecoMaximo); // Desligar

  Serial.printf("DEBUG: media=%d, min=%d, max=%d | Muito seco=%d, Úmido suficiente=%d\n", 
                media, limiteSecoMinimo, limiteSecoMaximo, soloMuitoSeco, soloUmidoSuficiente);

  if (modoAutomatico) {
    // Se estava desligada e ficou muito seca, liga
    if (soloMuitoSeco) {
      bombaLigadaAgora = true;
    }
    // Se estava ligada e ficou úmida o suficiente, desliga
    else if (soloUmidoSuficiente) {
      bombaLigadaAgora = false;
    }
    // Se está entre os limites, mantém estado anterior
    else {
      bombaLigadaAgora = estadoAnteriorBomba;
    }
  } else {
    bombaLigadaAgora = bombaLigadaManual;
  }

  // Indicadores visuais
  if (soloMuitoSeco) {
    Serial.println("🔴 SOLO MUITO SECO - LED Vermelho ON");
    digitalWrite(ledVermelho, HIGH);
    digitalWrite(ledVerde, LOW);

    // ✅ Respeitar flag alertasSonoros
    if (alertasSonoros) {
      ledc_set_freq(LEDC_LOW_SPEED_MODE, LEDC_TIMER_0, 1000);
      ledc_set_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0, 128);
      ledc_update_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0);
      Serial.println("Buzzer ON (alertas ativados)");
    } else {
      ledc_set_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0, 0);
      ledc_update_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0);
      Serial.println("Buzzer OFF (alertas desativados)");
    }
  } else if (soloUmidoSuficiente) {
    Serial.println("💧 SOLO ÚMIDO O SUFICIENTE - LED Azul ON");
    digitalWrite(ledVermelho, LOW);
    digitalWrite(ledVerde, HIGH);
    
    ledc_set_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0, 0);
    ledc_update_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0);
  } else {
    Serial.println("🟢 SOLO NA ZONA SEGURA - LED Verde ON, Buzzer OFF");
    digitalWrite(ledVermelho, LOW);
    digitalWrite(ledVerde, HIGH);
    
    ledc_set_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0, 0);
    ledc_update_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0);
  }

  digitalWrite(releBomba, bombaLigadaAgora ? HIGH : LOW);

  if (bombaLigadaAgora != estadoAnteriorBomba) {
    estadoAnteriorBomba = bombaLigadaAgora;
    Serial.println(bombaLigadaAgora ? "💧 Bomba LIGADA" : "🛑 Bomba DESLIGADA");
  }
}


// ====== Handlers HTTP ======
void handleRoot() {
  adicionarHeadersCORS();
  String html = "<html><body><h1>Irrigacao ESP32 Online</h1>";
  html += "<p>IP: " + WiFi.localIP().toString() + "</p>";
  html += "<p>Status: " + statusSolo + "</p>";
  html += "<p><a href='/dados'>Ver JSON de dados</a></p></body></html>";
  server.send(200, "text/html", html);
}


void handleDados() {
  adicionarHeadersCORS();
  
  // Fazer leitura novamente para ter valores frescos
  int adc1 = analogRead(sensor1);
  int adc2 = analogRead(sensor2);
  int adc3 = analogRead(sensor3);
  
  int percent1 = constrain((100 * (4095 - adc1)) / 2995, 0, 100);
  int percent2 = constrain((100 * (4095 - adc2)) / 2995, 0, 100);
  int percent3 = constrain((100 * (4095 - adc3)) / 2995, 0, 100);
  
  StaticJsonDocument<512> doc;
  doc["sensor1"] = adc1;
  doc["sensor1Percent"] = percent1;
  doc["sensor2"] = adc2;
  doc["sensor2Percent"] = percent2;
  doc["sensor3"] = adc3;
  doc["sensor3Percent"] = percent3;
  doc["media"] = media;
  doc["mediaPercent"] = media;
  doc["luminosidade"] = ldrValor;
  doc["statusSolo"] = statusSolo;
  doc["bombaLigada"] = (digitalRead(releBomba) == HIGH);
  doc["modoAutomatico"] = modoAutomatico;
  doc["limiteSecoMinimo"] = limiteSecoMinimo;
  doc["limiteSecoMaximo"] = limiteSecoMaximo;
  doc["limiteSeco"] = limiteSecoMinimo; // Backward compat
  doc["ip"] = WiFi.localIP().toString();

  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}


void handleBomba() {
  adicionarHeadersCORS();

  if (server.hasArg("plain")) {
    StaticJsonDocument<200> doc;
    if (deserializeJson(doc, server.arg("plain"))) {
      server.send(400, "application/json", "{\"error\":\"JSON invalido\"}");
      return;
    }

    if (doc.containsKey("ligada")) {
      bombaLigadaManual = doc["ligada"].as<bool>();
      modoAutomatico = false;
      Serial.println("Bomba manual: " + String(bombaLigadaManual ? "ON" : "OFF"));
      
      // Acionar o relé
      digitalWrite(releBomba, bombaLigadaManual ? HIGH : LOW);
      
      // 📡 Publicar confirmação no tópico MQTT de estado (com retain)
      if (mqtt_client.connected()) {
        String stateJson = "{\"estado\":" + String(bombaLigadaManual ? "true" : "false") + "}";
        mqtt_client.publish(mqtt_topic_bomba_state, stateJson.c_str(), true);
        Serial.println("✅ Estado publicado em /bomba/state (retain)");
      }
      
      server.send(200, "application/json", "{\"success\":true}");
      return;
    }
  }
  server.send(400, "application/json", "{\"error\":\"Bad Request\"}");
}


void handleConfig() {
  adicionarHeadersCORS();

  Serial.println("\n🔧 [CONFIG] Requisição recebida");

  if (server.hasArg("plain")) {
    Serial.println("   ✅ Corpo JSON detectado");
    StaticJsonDocument<200> doc;
    if (deserializeJson(doc, server.arg("plain"))) {
      Serial.println("   ❌ Erro ao parsear JSON");
      server.send(400, "application/json", "{\"error\":\"JSON invalido\"}");
      return;
    }

    Serial.println("   ✅ JSON parseado com sucesso");

    if (doc.containsKey("limiteSecoMinimo")) {
      limiteSecoMinimo = doc["limiteSecoMinimo"].as<int>();
      Serial.print("   📝 Limite Seco Mínimo atualizado para: ");
      Serial.println(limiteSecoMinimo);
    }
    if (doc.containsKey("limiteSecoMaximo")) {
      limiteSecoMaximo = doc["limiteSecoMaximo"].as<int>();
      Serial.print("   📝 Limite Seco Máximo atualizado para: ");
      Serial.println(limiteSecoMaximo);
    }
    // Backward compatibility: se receber limiteSeco antigo, converter para novo
    if (doc.containsKey("limiteSeco")) {
      int limiteAntigo = doc["limiteSeco"].as<int>();
      limiteSecoMinimo = limiteAntigo - 10;
      limiteSecoMaximo = limiteAntigo + 30;
      Serial.print("   ⚠️ [COMPATIBILIDADE] Convertendo limiteSeco antigo para novo: ");
      Serial.print(limiteSecoMinimo);
      Serial.print(" - ");
      Serial.println(limiteSecoMaximo);
    }
    if (doc.containsKey("modoAutomatico")) {
      modoAutomatico = doc["modoAutomatico"].as<bool>();
      Serial.print("   📝 Modo: ");
      Serial.println(modoAutomatico ? "AUTO" : "MANUAL");
    }
    if (doc.containsKey("alertasSonoros")) {
      alertasSonoros = doc["alertasSonoros"].as<bool>();
      Serial.print("   📝 Alertas Sonoros: ");
      Serial.println(alertasSonoros ? "ON" : "OFF");
    }

    Serial.println("   ✅ Configuração recebida com sucesso\n");
    server.send(200, "application/json", "{\"success\":true}");
    return;
  }
  Serial.println("   ⚠️ Nenhum corpo JSON");
  server.send(400, "application/json", "{\"error\":\"Bad Request\"}");
}


// ====== Handler para controlar buzzer ======
void handleBuzzer() {
  adicionarHeadersCORS();

  Serial.println("\n🔔 [HANDLER BUZZER] Requisição recebida!");
  Serial.print("   Método: ");
  Serial.println(server.method() == HTTP_POST ? "POST" : "OUTRO");
  Serial.print("   URI: ");
  Serial.println(server.uri());
  
  int duracao = 500;  // Padrão: 500ms
  
  // Tentar ler do corpo JSON
  if (server.hasArg("plain")) {
    Serial.println("   ✅ Corpo JSON detectado");
    String json = server.arg("plain");
    Serial.print("   JSON recebido: ");
    Serial.println(json);
    
    StaticJsonDocument<100> doc;
    DeserializationError error = deserializeJson(doc, json);
    
    if (error) {
      Serial.print("   ❌ Erro ao parsear JSON: ");
      Serial.println(error.c_str());
    } else {
      Serial.println("   ✅ JSON parseado com sucesso");
      if (doc.containsKey("duracao")) {
        duracao = doc["duracao"].as<int>();
        Serial.print("   Duração extraída: ");
        Serial.println(duracao);
      }
    }
  } else {
    Serial.println("   ⚠️ Nenhum corpo JSON, usando duração padrão");
  }

  Serial.print("   Acionando buzzer por ");
  Serial.print(duracao);
  Serial.println("ms");
  acionarAlertyaSonoro(duracao);
  
  server.send(200, "application/json", "{\"success\":true,\"duracao\":" + String(duracao) + "}");
  Serial.println("   ✅ Resposta enviada\n");
}


// ====== Função para acionar alerta sonoro ======
void acionarAlertyaSonoro(int duracao) {
  if (!alertasSonoros) {
    Serial.println("⚠️ Alertas sonoros desativados");
    return;
  }

  Serial.println("🔊 Iniciando buzzer (não-bloqueante)...");
  
  ledc_set_freq(LEDC_LOW_SPEED_MODE, LEDC_TIMER_0, 1000);
  ledc_set_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0, 128);
  ledc_update_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0);
  
  buzzerAtivo = true;
  buzzerTempoInicio = millis();
  buzzerDuracaoDesejada = duracao;
  
  Serial.print("🔊 Buzzer ON por ");
  Serial.print(duracao);
  Serial.println("ms");
}


// ====== Atualizar LCD ======
void atualizarLCD() {
  lcd.clear();
  
  // Linha 1: S1:XX% S2:XX%
  lcd.setCursor(0, 0);
  int percent1 = (100 * (4095 - valor1)) / 2995;
  int percent2 = (100 * (4095 - valor2)) / 2995;
  percent1 = constrain(percent1, 0, 100);
  percent2 = constrain(percent2, 0, 100);
  lcd.print("S1:");
  lcd.print(percent1);
  lcd.print("% S2:");
  lcd.print(percent2);
  lcd.print("%");
  
  // Linha 2: S3:XX% LDR:XX%
  lcd.setCursor(0, 1);
  int percent3 = (100 * (4095 - valor3)) / 2995;
  percent3 = constrain(percent3, 0, 100);
  lcd.print("S3:");
  lcd.print(percent3);
  lcd.print("% LDR:");
  lcd.print(ldrValor);
  lcd.print("%");
  
  // Linha 3: Media: XX% | Status
  lcd.setCursor(0, 2);
  lcd.print("Media:");
  lcd.print(media);
  lcd.print("% ");
  lcd.print(statusSolo);
  
  // Linha 4: Bomba: ON/OFF | Modo
  lcd.setCursor(0, 3);
  lcd.print("Bomba:");
  lcd.print(digitalRead(releBomba) == HIGH ? "ON" : "OFF");
  lcd.print(" Modo:");
  lcd.print(modoAutomatico ? "AUTO" : "MAN");
}
