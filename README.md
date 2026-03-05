# � Sistema de Irrigação Automática - Irrigação

Um sistema inteligente de irrigação automática para plantas usando ESP32, React Native e MQTT. Monitora umidade do solo em tempo real, controla a bomba automaticamente e oferece controle remoto via aplicativo mobile.

## 📚 Índice

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Especificações de Hardware](#especificações-de-hardware)
- [API REST Endpoints](#api-rest-endpoints)
- [Configuração MQTT](#configuração-mqtt)
- [Troubleshooting](#troubleshooting)
- [Contribuindo](#contribuindo)

## ✨ Características

- **Monitoramento em Tempo Real**: Leitura contínua de 3 sensores de umidade do solo a cada 10 segundos
- **Controle Automático**: Sistema de hysteresis com dois limites para evitar oscilação da bomba
- **Controle Manual**: Ativar/desativar a bomba manualmente a qualquer momento
- **Interface Intuitiva**: Aplicativo React Native com design moderno e responsivo
- **Controle Remoto MQTT**: Controlar o sistema de qualquer lugar via MQTT
- **Alertas Sonoros**: Buzzer não-bloqueante para avisos do sistema
- **Display LCD**: Visualização em tempo real do status no display LCD 20x4
- **Sincronização Automática**: Sincronização constante entre app e ESP32

## 🛠️ Stack Tecnológico

### Frontend (Mobile)
- **React Native** v0.79.6 - Framework multiplataforma
- **Expo** v54.0.0 - Plataforma de desenvolvimento
- **@react-navigation/stack** v7.6.16 - Navegação entre telas
- **MQTT** v5.14.1 - Comunicação por publicador/subscritor
- **AsyncStorage** v1.23.0 - Armazenamento local
- **expo-notifications** v0.32.0 - Notificações push
- **@expo/vector-icons** v15.0.3 - Ícones Material Design

### Backend/Firmware
- **ESP32** - Microcontrolador WiFi principal
- **Arduino IDE** - Ambiente de desenvolvimento
- **WebServer Library** - Servidor HTTP nativo do ESP32
- **MQTT** - Comunicação remota opcional (broker.emqx.io)

### Hardware
- **3x Sensores de Umidade do Solo** (Capacitativos/Resistivos)
- **1x Sensor de Luz (LDR)**
- **1x Relé para Controle de Bomba**
- **1x Buzzer PWM**
- **2x LEDs de Status** (Vermelho e Verde)
- **1x Display LCD 20x4 I2C**

## 📂 Estrutura do Projeto

```
Irrigacao/
├── src/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── ConfirmDialog.js
│   │   ├── ConnectionStatus.js
│   │   ├── Header.js
│   │   ├── Help.js
│   │   ├── ScreenHeader.js
│   │   ├── SensorCard.js
│   │   └── Toast.js
│   ├── contexts/             # Context API para estado global
│   │   └── AppContext.js     # Estado principal da aplicação
│   ├── screens/              # Telas da aplicação
│   │   ├── HomeScreen.js     # Dashboard principal
│   │   ├── ConfigScreen.js   # Configurações
│   │   ├── SensoresScreen.js # Detalhes dos sensores
│   │   ├── ProfileScreen.js  # Perfil/Sobre
│   │   └── SplashScreen.js   # Tela de carregamento
│   ├── services/             # Serviços de integração
│   │   ├── api.js            # Cliente HTTP do ESP32
│   │   ├── mqttService.js    # Cliente MQTT
│   │   └── notificationService.js
│   ├── styles/               # Estilos globais
│   │   └── theme.js          # Tema da aplicação
│   └── config/               # Configurações
├── ESP32_Arduino/
│   └── Irrigacao_ESP32.ino   # Firmware do ESP32
├── assets/
│   └── fonts/                # Fontes personalizadas
├── android/                  # Build Android
├── App.js                    # Ponto de entrada
├── app.json                  # Configuração Expo
├── package.json              # Dependências Node
├── metro.config.js           # Configuração Metro Bundler
├── babel.config.js           # Configuração Babel
└── README.md                 # Este arquivo
```

## 📋 Pré-requisitos

### Para Desenvolver/Testar

**Sistema Operacional**: Windows, macOS ou Linux

**Software Necessário**:
- [Node.js](https://nodejs.org/) v18+ e npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli`
- [Arduino IDE](https://www.arduino.cc/en/software) v1.8.19+ (para firmware do ESP32)
- [USB CH340 Driver](https://github.com/nodemcu/ch340g-ch341g-serial-driver) (para upload ao ESP32)

**Hardware Necessário**:
- 1x ESP32 (com WiFi integrado)
- 3x Sensores de Umidade do Solo (capacitativos recomendados)
- 1x Sensor LDR (Light Dependent Resistor)
- 1x Relé 5V (para controlar bomba)
- 1x Buzzer 5V
- 2x LEDs (vermelho e verde)
- 1x Display LCD 20x4 com módulo I2C
- 1x Bomba de água 5-12V
- Resistores, fios, protoboard e fonte 5V

**Rede**:
- WiFi 2.4GHz (5GHz não suportado pelo ESP32)
- Conexão de internet (para MQTT remoto, opcional)

## ⚙️ Instalação

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/Irrigacao.git
cd Irrigacao
```

### 2. Instalar Dependências do App

```bash
npm install
```

### 3. Configurar e Fazer Upload do Firmware no ESP32

#### Passo 3.1: Instalar Board do ESP32 na Arduino IDE

1. Abra Arduino IDE
2. Vá para `File` → `Preferences`
3. Em "Additional Board Manager URLs", adicione:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Vá para `Tools` → `Boards Manager`
5. Procure por "esp32" e instale a versão mais recente
6. Selecione `Tools` → `Board` → `ESP32` → `ESP32 Dev Module`

#### Passo 3.2: Fazer Upload do Firmware

1. Abra `ESP32_Arduino/Irrigacao_ESP32.ino` na Arduino IDE
2. Conecte o ESP32 via USB
3. Selecione a porta COM em `Tools` → `Port`
4. Clique em `Upload` (→)
5. Aguarde a mensagem "Hard resetting via RTS pin..."

#### Passo 3.3: Configurar WiFi (Primeira Execução)

O ESP32 iniciará em modo AP (ponto de acesso):
1. Nos seus dispositivos WiFi, procure por rede: `ESP32_Config`
2. Conecte (sem senha)
3. Abra navegador em `http://192.168.4.1`
4. Insira suas credenciais WiFi (SSID e senha)
5. ESP32 reinicia e conecta à sua rede

### 4. Descobrir IP do ESP32

```bash
# Em Windows PowerShell
arp -a

# Procure por um dispositivo ESP32 na rede
# Geralmente no formato 192.168.x.x
```

Ou use [Angry IP Scanner](https://angryip.org/)

### 5. Atualizar IP na Aplicação

Edite [src/services/api.js](src/services/api.js):

```javascript
const ESP32_IP = '192.168.0.X'; // ← Coloque o IP do seu ESP32
```

### 6. Executar a Aplicação

```bash
# Inicie o Expo
npm start

# No terminal, digite:
# 'i' para iOS
# 'a' para Android
# 'w' para web

# Ou escaneie o QR Code com:
# - Expo Go (iOS/Android)
# - Câmera do dispositivo (iOS)
```

## 🔧 Configuração

### Limites de Umidade

Na tela **Configurações** > **Limite da Bomba**:

- **Limite Mínimo** (padrão: 30%): Quando ativar a bomba
- **Limite Máximo** (padrão: 70%): Quando desativar a bomba

Presets rápidos: 20%, 30%, 40%, 50%

### Frequência de Leitura

Na tela **Configurações** > **Frequência de Leitura**:

- Padrão: 10 segundos
- Intervalo mínimo recomendado: 5 segundos
- Intervalo máximo recomendado: 60 segundos

### MQTT (Opcional)

Para controle remoto, configure em **Configurações**:

```javascript
// Padrão
Broker: broker.emqx.io
Port: 8883 (TLS)
Topics:
  Controle: irrigacao/controle
  Status: irrigacao/status
```

## 📱 Como Usar

### Tela Inicial (Home)

1. **Cards de Sensores**: Exibem leitura em % e valor bruto de cada sensor
2. **Média de Umidade**: Valor agregado dos 3 sensores
3. **Status da Bomba**: Ícone verde (ligada) ou vermelho (desligada)
4. **Botão Manual**: Ligar/desligar bomba manualmente

### Configurações

1. **Modo Automático**: Ativar/desativar controle automático
2. **Limite da Bomba**: Ajustar thresholds de ativação/desativação
3. **Frequência de Leitura**: Definir intervalo entre leituras
4. **Notificações**: Ativar/desativar alertas
5. **MQTT**: Configurar conexão remota

### Sensores

Tela detalhada com:
- Valores individuais de cada sensor
- Média móvel
- Status individual de cada ponto

### Profile

- Informações do sistema
- Versão do firmware
- Status de conexão
- IP e dados de rede

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────┐
│         React Native App (Expo)                    │
│  ┌─────────────────────────────────────────────┐   │
│  │ HomeScreen │ ConfigScreen │ SensoresScreen  │   │
│  └──────────────────┬──────────────────────────┘   │
│                     │                              │
│         AppContext.js (Global State)               │
│                     │                              │
│         ┌───────────┴────────────┐                 │
│         ▼                        ▼                 │
│     api.js (HTTP)           mqttService.js (MQTT) │
└─────────┬────────────────────────┬─────────────────┘
          │                        │
    HTTP GET/POST            MQTT Pub/Sub
          │                        │
          └────────────┬───────────┘
                       │
              (WiFi 192.168.0.x)
                       │
         ┌─────────────▼─────────────┐
         │  ESP32 WebServer (Port 80)│
         │  ────────────────────────│
         │  - GET /dados             │
         │  - POST /bomba            │
         │  - POST /config           │
         │  - GET /                  │
         └──────────────┬────────────┘
                        │
         ┌──────────────┴──────────────┐
         │                             │
    ┌────▼───────┐        ┌───────────▼────┐
    │ I/O Control │        │  MQTT Client   │
    │ ────────── │        │ (Optional)     │
    │ • Pump Relay        │ Broker:        │
    │ • Buzzer           │ broker.emqx.io │
    │ • LEDs             │ Port: 8883     │
    │ • LCD Display      │                │
    └────┬───────┘        └─────────┬─────┘
         │                         │
    ┌────▼───────────────────────┬─┘
    │  Sensors & Actuators       │
    │ ───────────────────────    │
    │ • 3x Soil Moisture (ADC)   │
    │ • Light Sensor LDR (ADC)   │
    │ • Pump (GPIO 23 Relay)     │
    │ • LEDs (GPIO 26, 27)       │
    │ • Buzzer (GPIO 14 PWM)     │
    │ • LCD 20x4 (I2C 0x27)      │
    └────────────────────────────┘
```

## ⚙️ Especificações de Hardware

### Pinagem do ESP32

| Componente | GPIO/ADC | Descrição |
|-----------|----------|-----------|
| Sensor 1 | ADC 33 | Umidade do Solo - Ponto 1 |
| Sensor 2 | ADC 32 | Umidade do Solo - Ponto 2 |
| Sensor 3 | ADC 35 | Umidade do Solo - Ponto 3 |
| LDR | ADC 34 | Sensor de Luminosidade |
| Relé Bomba | GPIO 23 | Controle da Bomba (HIGH=ON) |
| LED Vermelho | GPIO 26 | Alerta/Solo Seco |
| LED Verde | GPIO 27 | Status OK |
| Buzzer | GPIO 14 | PWM 1000Hz |
| LCD SDA | GPIO 21 | Linha de Dados I2C |
| LCD SCL | GPIO 22 | Linha de Clock I2C |

### Configuração dos Sensores

**Posicionamento no Vaso**:
- 3 sensores enterrados no mesmo vaso
- Profundidade: 10 cm (constante para todos)
- Distribuição: Lateral em 3 pontos diferentes
- Objetivo: Medir variações laterais de umidade no mesmo volume de solo

**Calibração**:
- Sensor seco (ar): ~4095 (ou valor máximo)
- Sensor saturado (água): ~0 (ou valor mínimo)
- Percentual: `(4095 - valor_lido) / 4095 * 100`

### Esquema de Fiação (Resumido)

```
ESP32 (3.3V GND) ──┬─→ 3x Sensores Umidade (ADC)
                   ├─→ LDR (ADC 34)
                   ├─→ Relé (GPIO 23) ──→ Bomba 5V
                   ├─→ LEDs (GPIO 26, 27)
                   ├─→ Buzzer (GPIO 14)
                   └─→ LCD I2C (SDA/SCL)
```

Para esquema completo, consulte [SETUP_ESP32.md](SETUP_ESP32.md)

## 🔌 API REST Endpoints

### GET `/dados` - Obter Dados dos Sensores

Retorna leitura atual de todos os sensores.

**Resposta (JSON)**:
```json
{
  "sensor1": 1024,
  "sensor1Percent": 75,
  "sensor2": 1050,
  "sensor2Percent": 74,
  "sensor3": 999,
  "sensor3Percent": 76,
  "media": 1024,
  "mediaPercent": 75,
  "statusSolo": "ÚMIDO",
  "bombaLigada": false,
  "modoAutomatico": true,
  "limiteSeco": 2957,
  "limiteSecoMinimo": 1229,
  "limiteSecoMaximo": 2867,
  "luminosidade": 2048,
  "ip": "192.168.0.4"
}
```

### POST `/bomba` - Controlar Bomba

Liga ou desliga a bomba manualmente.

**Request (JSON)**:
```json
{
  "ligada": true  // true = ligar, false = desligar
}
```

**Resposta**:
```json
{
  "sucesso": true,
  "bombaLigada": true,
  "mensagem": "Bomba ligada com sucesso"
}
```

### POST `/config` - Atualizar Configuração

Define novos valores de limites e modo automático.

**Request (JSON)**:
```json
{
  "limiteSecoMinimo": 1500,
  "limiteSecoMaximo": 2500,
  "modoAutomatico": true,
  "alertasSonoros": true,
  "intervaloLeitura": 10
}
```

**Resposta**:
```json
{
  "sucesso": true,
  "limiteSecoMinimo": 1500,
  "limiteSecoMaximo": 2500,
  "modoAutomatico": true
}
```

### GET `/` - Status do Servidor

Verifica se o ESP32 está online.

**Resposta**: Página HTML status

## 📡 Configuração MQTT

### Tópicos Publicados pelo ESP32

```
irrigacao/status/sensor1        → Valor Sensor 1 (%)
irrigacao/status/sensor2        → Valor Sensor 2 (%)
irrigacao/status/sensor3        → Valor Sensor 3 (%)
irrigacao/status/media          → Média Umidade (%)
irrigacao/status/bomba          → Estado da Bomba (true/false)
irrigacao/status/modo           → Modo Automático (true/false)
irrigacao/status/temperatura    → Temperatura (°C)
```

### Tópicos Subscritos pelo ESP32

```
irrigacao/comando/bomba         → Ligar/Desligar Bomba (true/false)
irrigacao/comando/modo          → Ativar/Desativar Automático (true/false)
irrigacao/comando/limite        → Atualizar Limite (JSON)
irrigacao/comando/reboot        → Reiniciar ESP32
```

### Exemplo de Publicação (MQTT)

```javascript
// Subscribir ao status
mqttClient.subscribe('irrigacao/status/+');

mqttClient.on('message', (topic, message) => {
  console.log(`${topic}: ${message.toString()}`);
  // irrigacao/status/media: 75
});

// Publicar comando
mqttClient.publish('irrigacao/comando/bomba', 'true');
```

## 🐛 Troubleshooting

### Problema: "Não Consigo Conectar ao ESP32"

**Solução**:
1. Verifique se ESP32 está na mesma rede WiFi
2. Confirme o IP com `arp -a` no Windows
3. Teste a conexão: `ping 192.168.0.X`
4. Se não responder, reinicie o ESP32

### Problema: "Conexão HTTP Timeout"

**Solução**:
1. Aumente o timeout em [src/services/api.js](src/services/api.js): `const TIMEOUT = 15000;`
2. Verifique se ESP32 não está sobrecarregado
3. Reduza frequência de leitura em Configurações

### Problema: "Display LCD Mostra Caracteres Corrutos"

**Solução**:
✅ **Já Corrigido**: Sistema agora usa buzzer não-bloqueante
- Versões anteriores tinham `delay()` bloqueando a LCD
- Versão atual usa `millis()` com state machine para buzzer

### Problema: "Bomba não Liga no Limite Definido"

**Solução**:
1. Verifique se **Modo Automático** está ativado
2. Confirme limites em Configurações (padrão: 30%-70%)
3. Teste **Controle Manual** - se funcionar, é configuração
4. Se manual também não funciona, verifique relé e fiação

### Problema: "Arduino IDE: 'limiteSeco' não declarado"

**Solução**:
✅ **Já Corrigido**: Versão atual usa `limiteSecoMinimo` e `limiteSecoMaximo`
- Backward compatible com `limiteSeco` antigo
- Se erro persiste, faça upload novamente

### Problema: "App Congela ao Buscar Dados"

**Solução**:
1. Verifique conexão WiFi do telefone
2. Reinicie app e ESP32
3. Aumente timeout em [src/services/api.js](src/services/api.js)
4. Reduza frequência de polling em Configurações

### Problema: "Sensores Mostram 0% ou 100% Sempre"

**Solução**:
1. Verifique conexão dos sensores aos pinos ADC
2. Teste com `analogRead()` no Serial Monitor:
   ```cpp
   Serial.println(analogRead(33));  // Sensor 1
   ```
3. Calibre valores min/max no código
4. Se sensores não responderem, verifique alimentação (3.3V)

## 📚 Documentação Adicional

- [Documentação do Firmware](ESP32_Arduino/README.md)
- [Guia de Configuração do ESP32](SETUP_ESP32.md)
- [Referência MQTT](https://mqtt.org/mqtt-specification)
- [Documentação Expo](https://docs.expo.dev)
- [Documentação React Native](https://reactnative.dev)

## 🚀 Melhorias Futuras

- [ ] Gráficos históricos com Chart.js ou similar
- [ ] Exportar dados em CSV/PDF
- [ ] Múltiplos vasos com diferentes configurações
- [ ] Dashboard web (Node.js + Express)
- [ ] Integração com Home Assistant
- [ ] Sensores de temperatura e umidade do ar
- [ ] Previsão de chuva com API OpenWeather
- [ ] Histórico em banco de dados (SQLite/Firebase)
- [ ] Modo offline com cache de dados
- [ ] Automação customizável (regras avançadas)

## 📄 Licença

Este projeto está sob licença [MIT](LICENSE).

## 👤 Autor

Desenvolvido para controle de irrigação automática de plantas.

---

**Última atualização**: 2025
**Versão**: 1.0.0
