import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AppContext = createContext();

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
  const [limiteSeco, setLimiteSeco] = useState(2800);
  const [intervaloLeitura, setIntervaloLeitura] = useState(30);
  const [nomeDispositivo, setNomeDispositivo] = useState('Estufa 1');
  
  // UI
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Buscar dados do ESP32
  const buscarDados = async () => {
    try {
      setConnectionStatus('connecting');
      const dados = await api.getDados();
      
      // Se ESP32 ainda não foi atualizado, converte ADC para %
      let s1 = dados.sensor1Percent || 0;
      let s2 = dados.sensor2Percent || 0;
      let s3 = dados.sensor3Percent || 0;
      let media = dados.mediaPercent || dados.media || 0;
      
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
      if (media > 100 && dados.media) {
        media = Math.max(0, Math.min(100, Math.round((100 * (4095 - dados.media)) / 2995)));
      }
      
      // Atualizar estado global
      setSensor1(s1);
      setSensor2(s2);
      setSensor3(s3);
      setMedia(media);
      setMediaPercent(media);
      setLuminosity(dados.luminosidade || 0);
      setBombaLigada(dados.bombaLigada || false);
      setModoAutomatico(dados.modoAutomatico || true);
      setConnectionStatus('connected');
      setLastUpdate(new Date());
      
      console.log(`📊 Dados sincronizados: S1=${s1}% S2=${s2}% S3=${s3}% Media=${media}% Luz=${dados.luminosidade || 0}%`);
      
      return dados;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setConnectionStatus('disconnected');
      return null;
    }
  };

  // Controlar bomba
  const toggleBomba = async (ligada) => {
    try {
      setLoading(true);
      await api.controleBomba(ligada);
      setBombaLigada(ligada);
      setModoAutomatico(false);
      return true;
    } catch (error) {
      console.error('Erro ao controlar bomba:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar configurações
  const atualizarConfig = async (novasConfigs) => {
    try {
      setLoading(true);
      const response = await api.setConfig(novasConfigs);
      
      if (novasConfigs.limiteSeco) setLimiteSeco(novasConfigs.limiteSeco);
      if (novasConfigs.intervaloLeitura) setIntervaloLeitura(novasConfigs.intervaloLeitura);
      if (novasConfigs.nomeDispositivo) setNomeDispositivo(novasConfigs.nomeDispositivo);
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar config:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados periodicamente
  useEffect(() => {
    buscarDados();
    const interval = setInterval(buscarDados, 3000);
    return () => clearInterval(interval);
  }, []);

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
    toggleBomba,
    luminosity,
    
    // Configurações
    limiteSeco,
    intervaloLeitura,
    nomeDispositivo,
    atualizarConfig,
    
    // UI
    connectionStatus,
    loading,
    lastUpdate,
    buscarDados,
    setLimiteSeco,
    setIntervaloLeitura,
    setNomeDispositivo,
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
