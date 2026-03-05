import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../components/Toast';
import api from '../services/api';
import mqttService from '../services/mqttService';
import { notificarBombaAcionada } from '../services/notificationService';

const AppContext = createContext();

// ⚡ CONFIGURAÇÃO DOS INTERVALOS DE ATUALIZAÇÃO
const CONFIG_OTIMIZADO = {
  INTERVALO_BUSCA_MS: 10000, // 10s entre leituras de sensores
  MAX_REGISTROS_HISTORICO: 1000, // Manter até 1000 registros no cache
  USAR_CACHE_LOCAL: true, // Cache com AsyncStorage
};

export const AppProvider = ({ children }) => {
  // Estado dos sensores
  const [sensor1, setSensor1] = useState(0);
  const [sensor2, setSensor2] = useState(0);
  const [sensor3, setSensor3] = useState(0);
  const [media, setMedia] = useState(0);
  const [mediaPercent, setMediaPercent] = useState(0);
  const [luminosity, setLuminosity] = useState(0);
  
  // Estado da bomba
  const [bombaLigada, setBombaLigada] = useState(false);
  const [modoAutomatico, setModoAutomatico] = useState(true);
  
  // Configurações
  const [limiteSecoMinimo, setLimiteSecoMinimo] = useState(30);
  const [limiteSecoMaximo, setLimiteSecoMaximo] = useState(70);
  const [limiteSeco, setLimiteSeco] = useState(40); // Keep for backward compatibility
  const [intervaloLeitura, setIntervaloLeitura] = useState(30);
  const [nomeDispositivo, setNomeDispositivo] = useState('Estufa 1');
  const [alertasSonoros, setAlertasSonoros] = useState(true);
  
  // MQTT
  const [mqttEnabled, setMqttEnabled] = useState(false);
  const [mqttBroker, setMqttBroker] = useState('ws://broker.emqx.io:8083');
  const [mqttConnected, setMqttConnected] = useState(false);
  
  // UI
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // ⚡ CONTROLES DE OTIMIZAÇÃO PARA GRATUITO
  const [ultimaBusca, setUltimaBusca] = useState(0);

  // ✅ Flag persistente para evitar múltiplas tentativas MQTT simultâneas
  const isConnectingMqttRef = useRef(false);

  // ✅ Flag para evitar sobrescrever bombaLigada logo após toggleBomba
  // Problema: buscarDados() sincroniza com ESP32 e sobrescreve estado local
  // Solução: Marcar quando bomba foi modificada manualmente
  const bombaModificadaRef = useRef(false);
  const timeoutBombaRef = useRef(null);
  const estadoEsperadoBombaRef = useRef(null); // Guarda qual estado o usuário CLICOU
  const DELAY_APOS_TOGGLE_MS = 2500; // 2.5 segundos

  // Buscar dados do ESP32
  const buscarDados = async () => {
    try {
      const agora = Date.now();
      
      // ⚡ OTIMIZAÇÃO: Não buscar tão frequentemente (10s em vez de 3s)
      if (agora - ultimaBusca < CONFIG_OTIMIZADO.INTERVALO_BUSCA_MS) {
        // console.log('⏭️ Pulando busca (próxima em', Math.round((CONFIG_OTIMIZADO.INTERVALO_BUSCA_MS - (agora - ultimaBusca)) / 1000), 's)');
        return null;
      }
      
      setConnectionStatus('connecting');
      setUltimaBusca(agora);
      
      const dados = await api.getDados();
      
      // Se ESP32 ainda não foi atualizado, converte ADC para %
      let s1 = dados.sensor1Percent || 0;
      let s2 = dados.sensor2Percent || 0;
      let s3 = dados.sensor3Percent || 0;
      
      // Fallback: se recebeu valores ADC brutos (> 100), converte para %
      if (s1 > 100 && dados.sensor1) {
        s1 = Math.max(0, Math.min(100, Math.round((100 * (4095 - dados.sensor1)) / 2995)));
      }
      if (s2 > 100 && dados.sensor2) {
        s2 = Math.max(0, Math.min(100, Math.round((100 * (4095 - dados.sensor2)) / 2995)));
      }
      if (s3 > 100 && dados.sensor3) {
        s3 = Math.max(0, Math.min(100, Math.round((100 * (4095 - dados.sensor3)) / 2995)));
      }
      
      // Calcular a média com base nos sensores atuais
      // Não usar dados.mediaPercent que pode ter valor padrão incorreto
      const media = Math.round((s1 + s2 + s3) / 3);
      
      // Atualizar estado global
      setSensor1(s1);
      setSensor2(s2);
      setSensor3(s3);
      setMedia(media);
      setMediaPercent(media);
      setLuminosity(dados.luminosidade || 0);
      
      // ✅ NÃO sobrescrever bombaLigada se foi alterada manualmente
      // Isso evita oscilação ON→OFF→ON ao sincronizar com ESP32
      if (!bombaModificadaRef.current) {
        // Seguro sincronizar com ESP32 agora
        console.log(`📊 Sincronizando bomba com ESP32: ${dados.bombaLigada ? 'LIGADA' : 'DESLIGADA'}`);
        setBombaLigada(dados.bombaLigada || false);
        estadoEsperadoBombaRef.current = null; // Limpar expectativa
      } else {
        // Bomba foi modificada manualmente, IGNORAR sincronização completamente
        // e manter o estado que o usuário clicou
        const estadoEsperado = estadoEsperadoBombaRef.current;
        console.log(`🔒 Bloqueio ATIVO: Ignorando sync bomba. Esperado=${estadoEsperado}, ESP32=${dados.bombaLigada}`);
      }
      
      // ✅ NÃO restaurar modoAutomatico e alertasSonoros do ESP32
      // Esses valores são gerenciados apenas pela app/user
      // O ESP32 os recebe via HTTP quando o usuário muda
      setConnectionStatus('connected');
      setLastUpdate(new Date());
      
      console.log(`📊 Dados sincronizados: S1=${s1}% S2=${s2}% S3=${s3}% Media=${media}% Luz=${dados.luminosidade || 0}%`);
      
      // ✅ Conectado com sucesso
      setConnectionStatus('connected');
      
      return dados;
    } catch (error) {
      console.error('❌ Erro ao buscar dados:', error);
      
      // ⚠️ Avisar quando perder conexão
      if (connectionStatus === 'connected') {
        console.warn('⚠️ PERDA DE CONEXÃO COM ESP32!');
        showToast('⚠️ Perdeu conexão com ESP32. Usando modo offline...', 'warning', 5000);
      }
      
      // Mostrar como desconectado mas continuar tentando
      setConnectionStatus('disconnected');
      return null;
    }
  };

  // Controlar bomba
  const toggleBomba = async (ligada) => {
    try {
      setLoading(true);
      
      // ✅ BLOQUEAR sincronização imediatamente
      bombaModificadaRef.current = true;
      estadoEsperadoBombaRef.current = ligada; // Guarda qual estado o usuário clicou
      console.log(`🔒 BLOQUEIO ATIVADO: Bomba será ${ligada ? 'LIGADA' : 'DESLIGADA'} (bloqueio por ${DELAY_APOS_TOGGLE_MS}ms)`);
      
      // Limpar timeout anterior se existir
      if (timeoutBombaRef.current) {
        clearTimeout(timeoutBombaRef.current);
      }
      
      // Atualizar estado LOCAL imediatamente (sem aguardar API)
      setBombaLigada(ligada);
      console.log(`✅ Estado local atualizado: ${ligada ? 'LIGADA' : 'DESLIGADA'}`);
      
      // Enviar comando ao ESP32 (em background)
      try {
        await api.controleBomba(ligada);
        console.log(`📤 Comando HTTP enviado ao ESP32: ${ligada ? 'LIGAR' : 'DESLIGAR'}`);
      } catch (apiError) {
        console.error(`❌ Erro ao enviar comando ao ESP32:`, apiError);
      }
      
      setModoAutomatico(false);
      
      // Publicar comando via MQTT se conectado
      if (mqttConnected && mqttService) {
        try {
          mqttService.publishBombaCommand(ligada, 'manual');
          console.log(`📤 MQTT: Comando de bomba publicado - ${ligada ? 'LIGADA' : 'DESLIGADA'}`);
        } catch (mqttError) {
          console.warn('⚠️ MQTT: Erro ao publicar comando:', mqttError);
        }
      }
      
      // Reabilitar sincronização após o delay
      timeoutBombaRef.current = setTimeout(() => {
        bombaModificadaRef.current = false;
        estadoEsperadoBombaRef.current = null;
        console.log(`✅ Bloqueio REMOVIDO: Próxima sincronização normal`);
      }, DELAY_APOS_TOGGLE_MS);
      
      // ✅ Notificar quando bomba é acionada
      if (notificarBombaAcionada) {
        await notificarBombaAcionada(ligada);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao controlar bomba:', error);
      // Remover bloqueio em caso de erro
      bombaModificadaRef.current = false;
      estadoEsperadoBombaRef.current = null;
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar configurações
  const atualizarConfig = async (novasConfigs) => {
    try {
      setLoading(true);
      
      console.log('🔧 AppContext: Atualizando configurações');
      console.log('   Configurações recebidas:', novasConfigs);
      
      // Atualizar no ESP32 (se disponível)
      try {
        console.log('   📤 Enviando ao ESP32...');
        await api.setConfig(novasConfigs);
        console.log('   ✅ ESP32 recebeu a configuração');
      } catch (espError) {
        console.warn('⚠️ ESP32 indisponível, salvando apenas localmente:', espError.message);
      }
      
      // Atualizar estado local
      if (novasConfigs.limiteSeco !== undefined) {
        console.log('   📝 Atualizando limiteSeco:', novasConfigs.limiteSeco);
        setLimiteSeco(novasConfigs.limiteSeco);
      }
      if (novasConfigs.intervaloLeitura !== undefined) {
        console.log('   📝 Atualizando intervaloLeitura:', novasConfigs.intervaloLeitura);
        setIntervaloLeitura(novasConfigs.intervaloLeitura);
      }
      if (novasConfigs.nomeDispositivo) {
        console.log('   📝 Atualizando nomeDispositivo:', novasConfigs.nomeDispositivo);
        setNomeDispositivo(novasConfigs.nomeDispositivo);
      }
      if (novasConfigs.modoAutomatico !== undefined) {
        console.log('   📝 Atualizando modoAutomatico:', novasConfigs.modoAutomatico);
        setModoAutomatico(novasConfigs.modoAutomatico);
      }
      if (novasConfigs.alertasSonoros !== undefined) {
        console.log('   📝 Atualizando alertasSonoros:', novasConfigs.alertasSonoros);
        setAlertasSonoros(novasConfigs.alertasSonoros);
      }
      
      console.log('✅ Configurações atualizadas localmente:', novasConfigs);
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar config:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados periodicamente
  useEffect(() => {
    console.log(`⚡ Iniciando sincronização (intervalo: ${CONFIG_OTIMIZADO.INTERVALO_BUSCA_MS}ms = ${CONFIG_OTIMIZADO.INTERVALO_BUSCA_MS / 1000}s)`);
    
    buscarDados();
    // ⚡ OTIMIZAÇÃO: Intervalo de 10s em vez de 3s = 67% menos requisições
    const interval = setInterval(buscarDados, CONFIG_OTIMIZADO.INTERVALO_BUSCA_MS);
    return () => clearInterval(interval);
  }, []);

  // Carregar configurações do usuário quando fizer login
  useEffect(() => {
    console.log('⏱️ AppContext: iniciando useEffect');
    let unsubscribeAuth = null;
    let unsubscribeConfig = null;
    let isMounted = true;

    // ✅ NOVO: Carregar configurações MQTT
    const carregarConfigsMqtt = async () => {
      try {
        // Verificar se já há tentativa em andamento
        if (isConnectingMqttRef.current) {
          console.log('⏭️ MQTT: Já há tentativa em andamento, ignorando nova tentativa');
          return;
        }

        const enabledMqtt = await AsyncStorage.getItem('mqttEnabled');
        let brokerMqtt = await AsyncStorage.getItem('mqttBroker');
        
        console.log(`📦 MQTT: Configurações carregadas`);
        console.log(`   enabledMqtt: ${enabledMqtt}`);
        console.log(`   brokerMqtt: ${brokerMqtt}`);
        
        // ✅ Normalizar URL: converter mqtt:// para wss://
        if (brokerMqtt && brokerMqtt.startsWith('mqtt://')) {
          console.log(`🔧 MQTT: Normalizando URL de ${brokerMqtt}`);
          brokerMqtt = brokerMqtt.replace('mqtt://', 'wss://');
          console.log(`🔧 MQTT: URL normalizada para ${brokerMqtt}`);
          await AsyncStorage.setItem('mqttBroker', brokerMqtt);
        }
        
        // ✅ Garantir que inicia desligado
        setMqttEnabled(false);
        setMqttConnected(false);
        
        if (enabledMqtt === 'true') {
          console.log('📡 MQTT: Tentando reconectar (estava habilitado anteriormente)');
          isConnectingMqttRef.current = true;
          if (brokerMqtt) setMqttBroker(brokerMqtt);
          
          try {
            // Conectar automaticamente
            await tentarConectarMqtt(brokerMqtt || 'ws://broker.emqx.io:8083');
            // ✅ Se chegou aqui, conectou com sucesso
            console.log('✅ MQTT: Reconectado com sucesso na inicialização');
          } catch (error) {
            console.error('❌ Falha ao reconectar MQTT na inicialização:', error);
            // Falhou, deixar como desligado
            setMqttEnabled(false);
            setMqttConnected(false);
          } finally {
            isConnectingMqttRef.current = false;
          }
        } else {
          console.log('📡 MQTT: Iniciando desligado (não estava habilitado anteriormente)');
        }
      } catch (error) {
        console.warn('⚠️ Erro ao carregar configs MQTT:', error);
        isConnectingMqttRef.current = false;
      }
    };

    const setupAuthListener = async () => {
      try {
        console.log('✅ Configurando aplicação...');
        
        // ✅ Carregar MQTT configs
        await carregarConfigsMqtt();
      } catch (error) {
        console.error('❌ Erro ao configurar listener de auth:', error);
      }
    };

    // Chamar a função async
    setupAuthListener();

    // ✅ Cleanup function
    return () => {
      isMounted = false;
      console.log('🧹 Limpando listeners...');
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeConfig) unsubscribeConfig();
      // Limpar timeout da bomba
      if (timeoutBombaRef.current) {
        clearTimeout(timeoutBombaRef.current);
      }
      // Desconectar MQTT ao desmontar
      if (mqttEnabled) {
        mqttService.disconnect();
      }
    };
  }, []);

  // ✅ NOVO: Configurar listeners MQTT quando conectar
  useEffect(() => {
    if (!mqttConnected || !mqttService) {
      return;
    }

    console.log('📡 MQTT: Configurando listeners para feedback de estado...');

    // Listener para status da bomba via MQTT
    const handleBombaStatus = (data) => {
      console.log('📨 MQTT: Status da bomba recebido:', data);
      
      if (data && data.ligada !== undefined) {
        // Só atualizar se a bomba não foi modificada manualmente recentemente
        if (!bombaModificadaRef.current) {
          console.log(`✅ MQTT: Atualizando estado da bomba: ${data.ligada ? 'LIGADA' : 'DESLIGADA'}`);
          setBombaLigada(data.ligada);
        } else {
          const esperado = estadoEsperadoBombaRef.current;
          console.log(`🔒 MQTT: Bloqueio ATIVO - ignorando update (esperado=${esperado}, recebido=${data.ligada})`);
        }
      }
    };

    // Inscrever ao tópico de status da bomba
    try {
      mqttService.subscribe('esp32-irrigacao-01/bomba/status', handleBombaStatus);
      console.log('✅ Listener de status da bomba configurado');
    } catch (error) {
      console.warn('⚠️ Erro ao configurar listener de bomba:', error);
    }

    // Cleanup: desinscrever quando desconectar
    return () => {
      try {
        mqttService.unsubscribe('esp32-irrigacao-01/bomba/status');
        console.log('✅ Listener de bomba removido');
      } catch (error) {
        console.warn('⚠️ Erro ao desinscrever:', error);
      }
    };
  }, [mqttConnected]);

  // ✅ NOVO: Conectar ao MQTT (com proteção contra múltiplas tentativas)
  const tentarConectarMqtt = async (brokerUrl) => {
    // Evitar múltiplas tentativas simultâneas
    if (isConnectingMqttRef.current) {
      console.warn('⏭️ MQTT: Já há uma tentativa em andamento');
      return;
    }

    isConnectingMqttRef.current = true;
    
    try {
      // ✅ Normalizar URL se ainda estiver com mqtt://
      let urlFinal = brokerUrl;
      if (urlFinal.startsWith('mqtt://')) {
        console.log(`🔧 MQTT: Normalizando URL passada para tentarConectarMqtt: ${urlFinal}`);
        urlFinal = urlFinal.replace('mqtt://', 'wss://');
        console.log(`🔧 MQTT: URL normalizada para: ${urlFinal}`);
      }

      console.log('🔌 MQTT: Tentando conectar');
      console.log('   Broker:', urlFinal);
      console.log('   Timestamp:', new Date().toISOString());
      
      await mqttService.connect(urlFinal);
      
      console.log('✅ MQTT: Conectado com sucesso!');
      setMqttConnected(true);
      setMqttEnabled(true);
      await AsyncStorage.setItem('mqttEnabled', 'true');
      await AsyncStorage.setItem('mqttBroker', urlFinal);
      showToast('✅ Conectado ao MQTT!', 'success');
      
      // Publicar status inicial
      if (sensor1 !== 0 || sensor2 !== 0 || sensor3 !== 0) {
        console.log('📤 MQTT: Publicando status inicial dos sensores');
        mqttService.publishSensorStatus(sensor1, sensor2, sensor3, media);
      }
    } catch (error) {
      console.error('❌ MQTT: Erro ao conectar');
      console.error('   Broker tentado:', brokerUrl);
      console.error('   Erro:', error.message);
      console.error('   Timestamp:', new Date().toISOString());
      setMqttConnected(false);
      setMqttEnabled(false);
      showToast('❌ Erro ao conectar MQTT: ' + error.message, 'error');
    } finally {
      isConnectingMqttRef.current = false;
    }
  };

  // ✅ NOVO: Desabilitar MQTT
  const desabilitarMqtt = async () => {
    try {
      console.log('🔌 MQTT: Desconectando...');
      mqttService.disconnect();
      setMqttEnabled(false);
      setMqttConnected(false);
      await AsyncStorage.setItem('mqttEnabled', 'false');
      console.log('✅ MQTT: Desconectado');
      showToast('✅ MQTT desabilitado', 'success');
    } catch (error) {
      console.error('❌ MQTT: Erro ao desconectar:', error);
    }
  };

  // ✅ NOVO: Atualizar configuração MQTT
  const atualizarConfigMqtt = async (broker) => {
    try {
      console.log('🔌 MQTT: Atualizando broker');
      console.log('   Novo broker:', broker);
      
      await AsyncStorage.setItem('mqttBroker', broker);
      setMqttBroker(broker);
      
      // Reconectar com novo broker
      if (mqttEnabled) {
        console.log('🔌 MQTT: Reconectando com novo broker...');
        mqttService.disconnect();
        await tentarConectarMqtt(broker);
      }
      
      showToast('✅ Broker MQTT atualizado', 'success');
    } catch (error) {
      console.error('❌ Erro ao atualizar broker MQTT:', error);
      showToast('❌ Erro ao atualizar broker', 'error');
    }
  };

  const value = {
    // Sensores
    sensor1,
    sensor2,
    sensor3,
    media,
    mediaPercent,
    
    // Bomba
    bombaLigada,
    modoAutomatico,
    setModoAutomatico,
    toggleBomba,
    luminosity,
    
    // Configurações
    limiteSeco,
    limiteSecoMinimo,
    limiteSecoMaximo,
    intervaloLeitura,
    nomeDispositivo,
    alertasSonoros,
    atualizarConfig,
    
    // MQTT
    mqttEnabled,
    mqttConnected,
    mqttBroker,
    tentarConectarMqtt,
    desabilitarMqtt,
    atualizarConfigMqtt,
    
    // UI
    connectionStatus,
    loading,
    lastUpdate,
    buscarDados,
    setLimiteSeco,
    setLimiteSecoMinimo,
    setLimiteSecoMaximo,
    setIntervaloLeitura,
    setNomeDispositivo,
    setAlertasSonoros,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
};

export default AppContext;
