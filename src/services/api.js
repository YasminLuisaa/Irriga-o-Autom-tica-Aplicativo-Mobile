// ===== CONFIGURAÇÃO DO ESP32 =====
// ⚠️ IMPORTANTE: mDNS (irrigacao.local) NÃO funciona em Expo/React Native
// Usar IP FIXO que foi testado e funciona (ping e Invoke-WebRequest OK)
const USE_MDNS = false; // ← DESATIVADO: Expo não suporta mDNS
const ESP32_IP = '192.168.0.4'; // ✅ IP testado e confirmado funcionando
const PORT = 80;

// URL base - SEMPRE usa IP direto (sem mDNS)
const BASE_URL = `http://${ESP32_IP}:${PORT}`;
const TIMEOUT = 8000; // 8 segundos
const MAX_RETRIES = 2; // Número máximo de tentativas

console.log(`🔗 API Base URL: ${BASE_URL}`);

// Função auxiliar para fazer requisições com timeout
const fetchWithTimeout = (url, options = {}) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout na requisição')), TIMEOUT)
    ),
  ]);
};

// Função auxiliar com retry logic
const fetchWithRetry = async (url, options = {}, retries = MAX_RETRIES) => {
  try {
    return await fetchWithTimeout(url, options);
  } catch (error) {
    if (retries > 0) {
      console.log(`⚠️ Tentativa falhou, retentando... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar 1 segundo antes de retentar
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};

// ⚠️ REMOVIDO: Função gerarDadosMock() - somente dados reais do hardware

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
    luminosidade: dados.luminosidade || 0,
    ip: dados.ip || ESP32_IP,
  };
};

const api = {
  // Buscar dados dos sensores
  // ⚠️ APENAS DADOS REAIS DO ESP32 - SEM FALLBACK
  async getDados() {
    try {
      console.log('🔗 [API] Buscando dados reais do ESP32 em', BASE_URL);
      const response = await fetchWithRetry(`${BASE_URL}/dados`, {
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
      
      console.log('✅ [API] Dados REAIS recebidos do ESP32:', dadosConvertidos);
      return dadosConvertidos;
    } catch (error) {
      console.error('❌ [API] Erro ao buscar dados do ESP32:', error.message);
      throw error; // Propagar erro - sem fallback para mock
    }
  },

  // ⚠️ APENAS CONTROLE REAL - SEM FALLBACK
  async controleBomba(ligada) {
    try {
      console.log('🔗 [BOMBA] Enviando comando REAL ao ESP32');
      console.log(`   URL: ${BASE_URL}/bomba`);
      console.log(`   Ação: ${ligada ? 'LIGAR' : 'DESLIGAR'}`);
      
      const payload = { ligada: ligada === true || ligada === 1 };
      console.log(`   Payload: ${JSON.stringify(payload)}`);
      
      const response = await fetchWithRetry(`${BASE_URL}/bomba`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log(`   Status HTTP: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Bomba controlada com sucesso:', data);
      return { sucesso: true, bombaLigada: ligada };
    } catch (error) {
      console.error('❌ Erro ao controlar bomba:', error.message);
      throw error; // Propagar erro - sem fallback
    }
  },

  // ⚠️ APENAS CONFIGURAÇÃO REAL - SEM FALLBACK
  async configurar(limiteSeco, modoAutomatico) {
    try {
      console.log('🔧 Enviando configuração REAL ao ESP32:', { limiteSeco, modoAutomatico });
      const response = await fetchWithRetry(`${BASE_URL}/config`, {
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
      console.log('✅ Configuração atualizada no ESP32:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao configurar:', error.message);
      throw error; // Propagar erro - sem fallback
    }
  },

  // ⚠️ APENAS SETCONFIG REAL - SEM FALLBACK
  async setConfig(novasConfigs) {
    try {
      const payload = {
        limiteSecoMinimo: novasConfigs.limiteSecoMinimo ? parseInt(novasConfigs.limiteSecoMinimo) : undefined,
        limiteSecoMaximo: novasConfigs.limiteSecoMaximo ? parseInt(novasConfigs.limiteSecoMaximo) : undefined,
        limiteSeco: novasConfigs.limiteSeco ? parseInt(novasConfigs.limiteSeco) : undefined, // Backward compat
        modoAutomatico: novasConfigs.modoAutomatico !== undefined ? (novasConfigs.modoAutomatico === true || novasConfigs.modoAutomatico === 1) : undefined,
        alertasSonoros: novasConfigs.alertasSonoros !== undefined ? (novasConfigs.alertasSonoros === true || novasConfigs.alertasSonoros === 1) : undefined,
        intervaloLeitura: novasConfigs.intervaloLeitura ? parseInt(novasConfigs.intervaloLeitura) : undefined,
      };

      // Remover campos undefined
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

      console.log('🔧 Enviando configuração REAL ao ESP32:', payload);
      const response = await fetchWithRetry(`${BASE_URL}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Configuração atualizada no ESP32:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao setConfig:', error.message);
      throw error; // Propagar erro - sem fallback
    }
  },

  // Testar conexão com o ESP32
  async testarConexao() {
    try {
      console.log('Testando conexão com ESP32...');
      const response = await fetchWithRetry(`${BASE_URL}/`, {
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

  // ⚠️ APENAS BUZZER REAL - SEM FALLBACK PARA MOCK
  async testarAlerytaSonoro(duracao = 500) {
    try {
      const payload = { duracao: parseInt(duracao) };
      const url = `${BASE_URL}/buzzer`;
      
      console.log('🔊 [BUZZER] Acionando buzzer REAL do ESP32...');
      console.log('   URL:', url);
      console.log('   Método: POST');
      console.log('   Payload:', JSON.stringify(payload));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('   Status HTTP:', response.status);
      
      if (!response.ok) {
        console.error('   ❌ Erro HTTP:', response.status, response.statusText);
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Buzzer acionado com sucesso no ESP32:', data);
      return data;
    } catch (error) {
      console.error('❌ ERRO AO ACIONAR BUZZER:');
      console.error('   Mensagem:', error.message);
      console.error('   URL:', `${BASE_URL}/buzzer`);
      throw error; // Propagar erro - sem fallback
    }
  },
};

export default api;