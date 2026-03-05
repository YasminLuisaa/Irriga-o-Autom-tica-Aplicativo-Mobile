import mqtt from 'mqtt';

// Configuração do MQTT
const MQTT_CONFIG = {
  // Lista de brokers para testar (WebSocket)
  BROKERS: [
    'ws://broker.emqx.io:8083',           // EMQX WebSocket (público - recomendado)
    'wss://broker.emqx.io:8084',          // EMQX WebSocket Secure
    'wss://test.mosquitto.org:8081',      // Mosquitto WebSocket Secure
    'ws://192.168.0.5:1883',              // ESP32 local (fallback)
  ],
  DEFAULT_BROKER: 'ws://broker.emqx.io:8083',
  
  // Topics base
  TOPIC_PREFIX: 'irrigacao-automatica',
};

class MQTTService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.deviceId = 'esp32-irrigacao-01';
    this.listeners = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
  }

  /**
   * Conectar ao broker MQTT com retry automático
   */
  async connect(brokerUrl = MQTT_CONFIG.DEFAULT_BROKER) {
    return new Promise((resolve, reject) => {
      if (this.isConnecting) {
        console.warn('🔌 MQTT: Já está tentando conectar');
        return reject(new Error('Conexão já em andamento'));
      }

      this.isConnecting = true;
      this.reconnectAttempts = 0;
      
      const tentarConectar = (brokerIndex = 0) => {
        if (brokerIndex >= MQTT_CONFIG.BROKERS.length) {
          const erro = new Error('Nenhum broker disponível');
          console.error('❌ MQTT: ' + erro.message);
          this.isConnecting = false;
          return reject(erro);
        }

        const broker = brokerIndex === 0 ? brokerUrl : MQTT_CONFIG.BROKERS[brokerIndex];
        
        console.log(`🔌 MQTT: Tentativa de conexão (broker ${brokerIndex + 1})`);
        console.log(`   URL: ${broker}`);
        console.log(`   Timeout: 15s`);

        const timeout = setTimeout(() => {
          console.warn(`⏱️ MQTT: Timeout ao conectar em ${broker}`);
          if (this.client) {
            this.client.end();
            this.client = null;
          }
          // Tentar próximo broker
          tentarConectar(brokerIndex + 1);
        }, 15000);

        try {
          this.client = mqtt.connect(broker, {
            clientId: `app-${this.deviceId}-${Date.now()}`,
            clean: true,
            reconnectPeriod: 0,  // Desabilitar reconnect automático para controlar manualmente
            connectTimeout: 10000,
            keepalive: 60,
            protocolVersion: 4,
            rejectUnauthorized: false,
          });

          this.client.on('connect', () => {
            clearTimeout(timeout);
            console.log(`✅ MQTT: Conectado com sucesso!`);
            console.log(`   Broker: ${broker}`);
            console.log(`   Timestamp: ${new Date().toISOString()}`);
            this.isConnected = true;
            this.isConnecting = false;
            this.reconnectAttempts = 0;
            this.subscribeToDeviceTopic();
            resolve();
          });

          this.client.on('error', (error) => {
            clearTimeout(timeout);
            console.error(`❌ MQTT: Erro de conexão`);
            console.error(`   Broker: ${broker}`);
            console.error(`   Mensagem: ${error?.message || 'Sem detalhes'}`);
            console.error(`   Código: ${error?.code || 'N/A'}`);
            console.error(`   Timestamp: ${new Date().toISOString()}`);
            this.isConnected = false;
            
            // Tentar próximo broker
            if (this.client) {
              this.client.end();
              this.client = null;
            }
            tentarConectar(brokerIndex + 1);
          });

          this.client.on('disconnect', () => {
            clearTimeout(timeout);
            console.warn('⚠️ MQTT: Desconectado');
            this.isConnected = false;
          });

          this.client.on('offline', () => {
            console.warn('⚠️ MQTT: Offline');
            this.isConnected = false;
          });

          this.client.on('message', (topic, message) => {
            this.handleMessage(topic, message);
          });
        } catch (error) {
          clearTimeout(timeout);
          console.error(`❌ MQTT: Exceção ao conectar`);
          console.error(`   Erro: ${error.message}`);
          if (this.client) {
            this.client.end();
            this.client = null;
          }
          tentarConectar(brokerIndex + 1);
        }
      };

      tentarConectar(0);
    });
  }

  /**
   * Desconectar do MQTT
   */
  disconnect() {
    console.log('🔌 MQTT: Desconectando...');
    if (this.client) {
      this.client.end(true);
      this.client = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
    console.log('✅ MQTT: Desconectado');
  }

  /**
   * Publicar mensagem no MQTT
   */
  publish(topic, payload) {
    if (!this.isConnected) {
      console.warn('⚠️ MQTT não conectado');
      return false;
    }

    try {
      const fullTopic = `${MQTT_CONFIG.TOPIC_PREFIX}/${topic}`;
      const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
      
      this.client.publish(fullTopic, message, { qos: 1 }, (error) => {
        if (error) {
          console.error('❌ Erro ao publicar:', error);
        } else {
          console.log(`✅ Publicado em ${fullTopic}:`, message);
        }
      });
      return true;
    } catch (error) {
      console.error('❌ Erro ao publicar:', error);
      return false;
    }
  }

  /**
   * Subscrever a um tópico
   */
  subscribe(topic, callback) {
    if (!this.isConnected) {
      console.warn('⚠️ MQTT não conectado');
      return;
    }

    const fullTopic = `${MQTT_CONFIG.TOPIC_PREFIX}/${topic}`;
    
    try {
      this.client.subscribe(fullTopic, (error) => {
        if (error) {
          console.error('❌ Erro ao subscrever:', error);
        } else {
          console.log(`✅ Subscrito em ${fullTopic}`);
          this.listeners[fullTopic] = callback;
        }
      });
    } catch (error) {
      console.error('❌ Erro ao subscrever:', error);
    }
  }

  /**
   * Desinscrever de um tópico
   */
  unsubscribe(topic) {
    // Verificar se o cliente está conectado
    if (!this.client) {
      console.warn('⚠️ Cliente MQTT não está conectado');
      return;
    }

    const fullTopic = `${MQTT_CONFIG.TOPIC_PREFIX}/${topic}`;
    
    try {
      this.client.unsubscribe(fullTopic, (error) => {
        if (error) {
          console.error('❌ Erro ao desinscrever:', error);
        } else {
          console.log(`✅ Desincrito de ${fullTopic}`);
          delete this.listeners[fullTopic];
        }
      });
    } catch (error) {
      console.error('❌ Erro ao desinscrever:', error);
    }
  }

  /**
   * Subscrever ao tópico do dispositivo automaticamente
   */
  subscribeToDeviceTopic() {
    // Subscrever aos comandos do dispositivo
    this.subscribe(`${this.deviceId}/commands`, (message) => {
      console.log('📨 Comando recebido:', message);
    });

    // Subscrever aos status do dispositivo
    this.subscribe(`${this.deviceId}/status`, (message) => {
      console.log('📊 Status recebido:', message);
    });
  }

  /**
   * Processar mensagem recebida
   */
  handleMessage(topic, message) {
    try {
      const payload = message.toString();
      console.log(`📨 Mensagem em ${topic}:`, payload);

      // Executar callback se existir
      if (this.listeners[topic]) {
        try {
          const data = JSON.parse(payload);
          this.listeners[topic](data);
        } catch {
          this.listeners[topic](payload);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao processar mensagem:', error);
    }
  }

  /**
   * Publicar status do sensor
   */
  publishSensorStatus(sensor1, sensor2, sensor3, media) {
    this.publish(`${this.deviceId}/sensors`, {
      sensor1,
      sensor2,
      sensor3,
      media,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Publicar comando da bomba
   */
  publishBombaCommand(ligada, modo = 'manual') {
    this.publish(`${this.deviceId}/bomba/command`, {
      ligada,
      modo,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Publicar configurações
   */
  publishConfig(limiteSeco, intervaloLeitura, modoAutomatico) {
    this.publish(`${this.deviceId}/config`, {
      limiteSeco,
      intervaloLeitura,
      modoAutomatico,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Verificar se está conectado
   */
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Instância global
const mqttService = new MQTTService();

export default mqttService;
