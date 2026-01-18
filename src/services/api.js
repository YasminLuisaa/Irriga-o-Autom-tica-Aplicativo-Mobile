// ===== CONFIGURAÇÃO DO ESP32 =====
// ⚠️ OPÇÃO 1: Use mDNS (RECOMENDADO) - funciona com WiFi dinâmico
const USE_MDNS = false; // ← Mudado para false, usando IP direto
const MDNS_NAME = 'irrigacao.local';

// OPÇÃO 2: Use IP fixo - CONFIRMADO ✅ 192.168.0.6
const ESP32_IP = '192.168.0.6'; // ✅ IP do seu ESP32 confirmado
const PORT = 80;

// URL base - mDNS tem prioridade se ativado
const BASE_URL = USE_MDNS ? `http://${MDNS_NAME}` : `http://${ESP32_IP}:${PORT}`;
const TIMEOUT = 8000; // 8 segundos - aumentado para WiFi lento

console.log(`🔗 API Base URL: ${BASE_URL}`);
console.log(`🔗 IP ESP32: ${ESP32_IP}`);

// Função auxiliar para fazer requisições com timeout
const fetchWithTimeout = (url, options = {}) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout na requisição')), TIMEOUT)
    ),
  ]);
};

// Função para converter dados recebidos do ESP32
const converterDados = (dados) => {
  return {
    sensor1: dados.sensor1 || 0,
    sensor1Percent: dados.sensor1Percent || 0,
    sensor2: dados.sensor2 || 0,
    sensor2Percent: dados.sensor2Percent || 0,
    sensor3: dados.sensor3 || 0,
    sensor3Percent: dados.sensor3Percent || 0,
    media: dados.media || 0,
    mediaPercent: dados.mediaPercent || 0,  // USA DIRETO do ESP32
    statusSolo: dados.statusSolo || 'DESCONHECIDO',
    bombaLigada: dados.bombaLigada === true || dados.bombaLigada === 1,
    modoAutomatico: dados.modoAutomatico === true || dados.modoAutomatico === 1,
    limiteSeco: dados.limiteSeco || 2957,
    ip: dados.ip || ESP32_IP,
  };
};

const api = {
  // Buscar dados dos sensores
  async getDados() {
    try {
      console.log('Buscando dados...');
      const response = await fetchWithTimeout(`${BASE_URL}/dados`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const dadosConvertidos = converterDados(data);
      
      console.log('Dados recebidos:', dadosConvertidos);
      return dadosConvertidos;
    } catch (error) {
      console.error('Erro ao buscar dados:', error.message);
      throw error;
    }
  },

  // Controlar bomba (ligar/desligar)
  async controleBomba(ligada) {
    try {
      console.log('Enviando comando de bomba:', ligada);
      const response = await fetchWithTimeout(`${BASE_URL}/bomba`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          ligada: ligada === true || ligada === 1 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Resposta da bomba:', data);
      return data;
    } catch (error) {
      console.error('Erro ao controlar bomba:', error.message);
      throw error;
    }
  },

  // Configurar sistema
  async configurar(limiteSeco, modoAutomatico) {
    try {
      console.log('Enviando configuração:', { limiteSeco, modoAutomatico });
      const response = await fetchWithTimeout(`${BASE_URL}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          limiteSeco: parseInt(limiteSeco), 
          modoAutomatico: modoAutomatico === true || modoAutomatico === 1
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Configuração atualizada:', data);
      return data;
    } catch (error) {
      console.error('Erro ao configurar:', error.message);
      throw error;
    }
  },

  // Testar conexão com o ESP32
  async testarConexao() {
    try {
      console.log('Testando conexão com ESP32...');
      const response = await fetchWithTimeout(`${BASE_URL}/`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      });
      
      const sucesso = response.ok;
      console.log('Teste de conexão:', sucesso ? 'Conectado' : 'Falha');
      return sucesso;
    } catch (error) {
      console.error('Teste de conexão falhou:', error.message);
      return false;
    }
  },

  // Alterar IP do ESP32
  setESP32IP(ip) {
    global.ESP32_IP = ip;
    global.BASE_URL = `http://${ip}:${PORT}`;
    console.log(`IP do ESP32 alterado para: ${ip}`);
  },

  // Obter IP atual
  getESP32IP() {
    return ESP32_IP;
  },
};

export default api;