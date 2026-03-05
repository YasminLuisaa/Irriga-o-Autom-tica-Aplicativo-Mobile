import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
  TextInput,
  TouchableOpacity,
  Picker,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import ScreenHeader from '../components/ScreenHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import ConnectionStatus from '../components/ConnectionStatus';
import { HelpTooltip, HelpModal } from '../components/Help';
import { showToast } from '../components/Toast';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';
import { useApp } from '../contexts/AppContext';
import api from '../services/api';

const ConfigScreen = ({ navigation }) => {
  const {
    limiteSeco,
    limiteSecoMinimo,
    limiteSecoMaximo,
    intervaloLeitura,
    connectionStatus,
    atualizarConfig,
    mqttEnabled,
    mqttConnected,
    mqttBroker,
    tentarConectarMqtt,
    desabilitarMqtt,
    atualizarConfigMqtt,
    alertasSonoros,
    setAlertasSonoros,
    modoAutomatico,
    setModoAutomatico,
  } = useApp();

  const [limiteMin, setLimiteMin] = useState(String(limiteSecoMinimo));
  const [limiteMax, setLimiteMax] = useState(String(limiteSecoMaximo));
  const [intervalo, setIntervalo] = useState(String(intervaloLeitura));
  const [helpVisible, setHelpVisible] = useState(false);
  const [limiteErro, setLimiteErro] = useState(null);
  const [ultimaSincronizacao, setUltimaSincronizacao] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [alteracoesPendentes, setAlteracoesPendentes] = useState(false);
  const [conectandoMqtt, setConectandoMqtt] = useState(false);
  const [mqttEnabledLocal, setMqttEnabledLocal] = useState(mqttEnabled);

  // Carregar configurações salvas ao montar
  useEffect(() => {
    carregarConfiguracoes();
  }, []); // ✅ Dependência vazia para executar apenas uma vez

  // ✅ Sincronizar limites quando vêm do contexto
  useEffect(() => {
    setLimiteMin(String(limiteSecoMinimo));
    setLimiteMax(String(limiteSecoMaximo));
  }, [limiteSecoMinimo, limiteSecoMaximo]);

  // Rastrear se já estamos enviando para evitar loops infinitos
  const isSendingRef = useRef(false);
  const previousConfigRef = useRef({ alertasSonoros, modoAutomatico });

  // Detectar alterações nos limites
  useEffect(() => {
    const temAlteracoes = 
      limiteMin !== String(limiteSecoMinimo) || 
      limiteMax !== String(limiteSecoMaximo) || 
      intervalo !== String(intervaloLeitura);
    setAlteracoesPendentes(temAlteracoes);
  }, [limiteMin, limiteMax, intervalo]);

  // ✅ Auto-salvar configurações quando limites ou intervalo mudam
  useEffect(() => {
    if (!alteracoesPendentes) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      if (!validateLimites(limiteMin, limiteMax)) {
        return;
      }

      try {
        console.log('💾 Auto-salvando configurações');
        console.log('  Limite Mínimo:', limiteMin);
        console.log('  Limite Máximo:', limiteMax);
        console.log('  Intervalo Leitura:', intervalo);

        // Salvar no AsyncStorage
        await Promise.all([
          AsyncStorage.setItem('limiteSecoMinimo', limiteMin),
          AsyncStorage.setItem('limiteSecoMaximo', limiteMax),
          AsyncStorage.setItem('intervaloLeitura', intervalo),
          AsyncStorage.setItem('ultimaSincronizacao', new Date().toISOString()),
        ]);

        // Atualizar context
        await atualizarConfig({
          limiteSecoMinimo: parseInt(limiteMin),
          limiteSecoMaximo: parseInt(limiteMax),
          intervaloLeitura: parseInt(intervalo),
        });

        setUltimaSincronizacao(new Date());
        setAlteracoesPendentes(false);
        console.log('✅ Configurações auto-salvas com sucesso!');
        showToast('✅ Configurações salvas', 'success', 2000);
      } catch (error) {
        console.error('Erro ao auto-salvar:', error);
        showToast('⚠️ Erro ao salvar configurações', 'warning');
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [alteracoesPendentes]);

  // ✅ NOVO: Enviar configuração ao ESP32 quando alertasSonoros ou modoAutomatico mudam
  // MAS apenas se realmente mudaram (não enviar novamente se já enviou)
  useEffect(() => {
    // Verificar se os valores realmente mudaram
    const configMudou = 
      previousConfigRef.current.alertasSonoros !== alertasSonoros ||
      previousConfigRef.current.modoAutomatico !== modoAutomatico;

    if (!configMudou || isSendingRef.current) {
      return; // Não fazer nada se nada mudou ou já estamos enviando
    }

    const enviarConfiguracao = async () => {
      try {
        isSendingRef.current = true;
        
        console.log('🔧 Enviando configuração ao ESP32:', {
          alertasSonoros,
          modoAutomatico,
        });
        
        await atualizarConfig({
          alertasSonoros,
          modoAutomatico,
        });
        
        // Atualizar referência após envio bem-sucedido
        previousConfigRef.current = { alertasSonoros, modoAutomatico };
        
        console.log('✅ Configuração enviada com sucesso');
      } catch (error) {
        console.error('❌ Erro ao enviar configuração:', error);
      } finally {
        isSendingRef.current = false;
      }
    };

    enviarConfiguracao();
  }, [alertasSonoros, modoAutomatico]);

  const carregarConfiguracoes = async () => {
    try {
      const [
        limiteMinConfig,
        limiteMaxConfig,
        intervaloConfig,
        sincConfig
      ] = await Promise.all([
        AsyncStorage.getItem('limiteSecoMinimo'),
        AsyncStorage.getItem('limiteSecoMaximo'),
        AsyncStorage.getItem('intervaloLeitura'),
        AsyncStorage.getItem('ultimaSincronizacao'),
      ]);

      if (limiteMinConfig) setLimiteMin(limiteMinConfig);
      if (limiteMaxConfig) setLimiteMax(limiteMaxConfig);
      if (intervaloConfig) setIntervalo(intervaloConfig);
      if (sincConfig) setUltimaSincronizacao(new Date(sincConfig));
    } catch (error) {
      console.warn('Erro ao carregar configurações:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await carregarConfiguracoes();
      showToast('✅ Configurações recarregadas', 'success');
    } catch (error) {
      showToast('Erro ao recarregar', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const validateLimites = (min) => {
    const minVal = parseInt(min);
    
    if (isNaN(minVal)) {
      setLimiteErro('Valor deve ser numérico');
      return false;
    }
    if (minVal < 0 || minVal > 100) {
      setLimiteErro('Valor deve estar entre 0 e 100%');
      return false;
    }
    
    setLimiteErro(null);
    return true;
  };

  const testarAlertaSonoro = async () => {
    try {
      console.log('🔔 ConfigScreen: Iniciando teste de buzzer...');
      showToast('🔊 Testando alerta sonoro no hardware...', 'info');
      
      const resultado = await api.testarAlerytaSonoro(500);
      console.log('🔔 ConfigScreen: Resultado =', resultado);
      
      showToast('✅ Alerta sonoro acionado!', 'success');
    } catch (error) {
      console.error('🔔 ConfigScreen: Erro ao testar alerta:', error);
      console.error('Detalhes:', error.message);
      showToast('⚠️ Não conseguiu acionar alerta (ESP32 offline?)', 'warning');
    }
  };

  const handleSaveConfig = () => {
    if (!validateLimite(limite)) {
      showToast('Verifique o limite de umidade', 'error');
      return;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header screenName="Configurações" currentScreen="ConfigTab" navigation={navigation} />
      <ScreenHeader currentScreen="ConfigTab" navigation={navigation} />
      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Indicador de Status de Conexão */}
        <ConnectionStatus status={connectionStatus} />

        {/* ========== SEÇÃO: AUTOMAÇÃO ========== */}
        {/* ========== SEÇÃO: MODO AUTOMÁTICO ========== */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>AUTOMAÇÃO</Text>
          
          {/* Modo Automático */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: COLORS.successLight }]}>
                <MaterialCommunityIcons name="robot" size={18} color={COLORS.success} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Modo Automático</Text>
                <Text style={styles.settingSubtitle}>Irrigação com base na umidade</Text>
              </View>
            </View>
            <View style={styles.settingRight}>
              <Switch
                value={modoAutomatico}
                onValueChange={setModoAutomatico}
                trackColor={{ false: COLORS.border, true: COLORS.success }}
                thumbColor={COLORS.white}
              />
              <HelpTooltip text="Ativa controle automático da bomba" />
            </View>
          </View>
        </View>

        {/* ========== SEÇÃO: LIMITE DA BOMBA ========== */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>LIMITE DA BOMBA</Text>

          {/* Limite de Umidade - Simples */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: COLORS.primaryLight }]}>
                <MaterialCommunityIcons name="water-percent" size={18} color={COLORS.primary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Quando Irrigar</Text>
                <Text style={styles.settingSubtitle}>Percentual de umidade do solo</Text>
              </View>
            </View>
            <HelpTooltip text="Percentual de umidade para ligar a bomba" />
          </View>

          {limiteErro && (
            <View style={styles.errorBanner}>
              <MaterialCommunityIcons name="alert-circle" size={16} color={COLORS.danger} />
              <Text style={styles.errorBannerText}>{limiteErro}</Text>
            </View>
          )}

          <View style={styles.limiteButtonsContainer}>
            {['20', '30', '40', '50'].map((valor) => (
              <TouchableOpacity
                key={valor}
                style={[
                  styles.limiteButton,
                  limiteMin === valor && styles.limiteButtonActive,
                ]}
                onPress={() => {
                  setLimiteMin(valor);
                  setLimiteMax(String(Math.min(100, parseInt(valor) + 30)));
                  setLimiteErro(null);
                }}
              >
                <Text
                  style={[
                    styles.limiteButtonText,
                    limiteMin === valor && styles.limiteButtonTextActive,
                  ]}
                >
                  {valor}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ========== SEÇÃO: FREQUÊNCIA DE LEITURA ========== */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>FREQUÊNCIA DE LEITURA</Text>

          {/* Intervalo de Leitura */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: COLORS.warningLight }]}>
                <MaterialCommunityIcons name="clock" size={18} color={COLORS.warning} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Intervalo</Text>
                <Text style={styles.settingSubtitle}>Entre cada verificação de sensor</Text>
              </View>
            </View>
            <HelpTooltip text="Tempo entre leituras dos sensores" />
          </View>

          <View style={styles.intervalButtonsContainer}>
            {['5', '10', '30', '60'].map((valor) => (
              <TouchableOpacity
                key={valor}
                style={[
                  styles.intervalButton,
                  intervalo === valor && styles.intervalButtonActive,
                ]}
                onPress={() => setIntervalo(valor)}
              >
                <Text
                  style={[
                    styles.intervalButtonText,
                    intervalo === valor && styles.intervalButtonTextActive,
                  ]}
                >
                  {valor}s
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.intervalHint}>
            5s = Preciso | 30s = Recomendado | 60s = Economia
          </Text>
        </View>

        {/* ========== SEÇÃO: NOTIFICAÇÕES ========== */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>NOTIFICAÇÕES</Text>

          {/* Alertas Sonoros */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: COLORS.warningLight }]}>
                <MaterialCommunityIcons 
                  name={alertasSonoros ? 'volume-high' : 'volume-off'} 
                  size={18} 
                  color={COLORS.warning} 
                />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Alertas Sonoros</Text>
                <Text style={styles.settingSubtitle}>Quando solo fica muito seco</Text>
              </View>
            </View>
            <View style={styles.settingRight}>
              <Switch
                value={alertasSonoros}
                onValueChange={setAlertasSonoros}
                trackColor={{ false: COLORS.border, true: COLORS.success }}
                thumbColor={COLORS.white}
              />
              <HelpTooltip text="Som de alerta no dispositivo" />
            </View>
          </View>

          {alertasSonoros && (
            <TouchableOpacity
              style={styles.testButton}
              onPress={testarAlertaSonoro}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="play-circle" size={16} color={COLORS.white} />
              <Text style={styles.testButtonText}>Testar Som</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ========== SEÇÃO: CONTROLE REMOTO ========== */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>CONECTIVIDADE</Text>

          {/* MQTT */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: COLORS.successLight }]}>
                <MaterialCommunityIcons 
                  name={mqttConnected ? 'cloud-check' : conectandoMqtt ? 'cloud-sync' : 'cloud-off-outline'} 
                  size={18} 
                  color={mqttConnected ? COLORS.success : conectandoMqtt ? COLORS.warning : COLORS.danger} 
                />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Controle Remoto (MQTT)</Text>
                <Text style={styles.settingSubtitle}>
                  {conectandoMqtt ? '⏳ Ligando...' : mqttConnected ? ' Ativo' : ' Inativo'}
                </Text>
              </View>
            </View>
            <View style={styles.settingRight}>
              <Switch
                value={mqttEnabledLocal}
                onValueChange={(valor) => {
                  setMqttEnabledLocal(valor);
                  if (valor) {
                    setConectandoMqtt(true);
                    tentarConectarMqtt(mqttBroker).finally(() => {
                      setConectandoMqtt(false);
                    });
                  } else {
                    desabilitarMqtt();
                  }
                }}
                trackColor={{ false: COLORS.border, true: COLORS.success }}
                thumbColor={COLORS.white}
                disabled={conectandoMqtt}
              />
              <HelpTooltip text="Controle de qualquer lugar" />
            </View>
          </View>

          {mqttEnabled && (
            <>
              <View style={styles.settingInputContainer}>
                <Text style={styles.inputLabel}>Endereço do Broker</Text>
                <TextInput
                  style={styles.brokerInput}
                  value={mqttBroker}
                  onChangeText={atualizarConfigMqtt}
                  placeholder="ws://broker.emqx.io:8083"
                  placeholderTextColor={COLORS.border}
                />
              </View>
            </>
          )}
        </View>

        {/* ========== SEÇÃO: INFORMAÇÕES ========== 
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>SISTEMA</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardLabel}>Versão</Text>
              <Text style={styles.infoCardValue}>1.0.0</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardLabel}>Plataforma</Text>
              <Text style={styles.infoCardValue}>React Native</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardLabel}>Sincronização</Text>
              <Text style={styles.infoCardValue}>☁️ Ativa</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardLabel}>Atualizado</Text>
              <Text style={styles.infoCardValue}>
                {ultimaSincronizacao.toLocaleTimeString('pt-BR')}
              </Text>
            </View>
          </View>
        </View> */}

        <View style={{ height: SIZES.baseSpacing }} />
      </ScrollView>

      {/* Help Modal */}
      <HelpModal
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
        title="Ajuda - Configurações"
        sections={[
          {
            icon: 'devices',
            title: 'Nome do Dispositivo',
            description: 'Escolha um nome único para identificar seu sistema de irrigação facilmente.',
            tips: [
              'Use nomes descritivos como "Estufa 1" ou "Jardim"',
              'Máximo de 20 caracteres',
              'Não deixe em branco',
            ],
          },
          {
            icon: 'robot',
            title: 'Modo Automático',
            description: 'Ativa ou desativa o controle automático da bomba.',
            tips: [
              'Ligado: Bomba opera dentro dos limites configurados',
              'Desligado: Controle apenas manual pela tela Home',
              'Recomendado manter ligado durante períodos sem monitoramento',
            ],
          },
          {
            icon: 'clock',
            title: 'Intervalo de Leitura',
            description: 'Tempo entre cada leitura dos sensores de umidade.',
            tips: [
              '5s: Máxima precisão (consome mais energia)',
              '30s: Balanceado (recomendado)',
              '60s: Economia de energia (menos responsivo)',
            ],
          },
          {
            icon: 'water-percent',
            title: 'Limites de Umidade',
            description: 'Defina quando a bomba deve ligar e desligar automaticamente.',
            tips: [
              'Mínimo: Quando a bomba deve ligar (ex: 40%)',
              'Máximo: Quando a bomba deve desligar (ex: 75%)',
              'Diferença recomendada: 30-35%',
              'Deve estar entre 0 e 100%',
            ],
          },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    paddingBottom: SIZES.baseSpacing * 2,
  },

  /* ========== SEÇÕES ========== */
  sectionGroup: {
    backgroundColor: COLORS.white,
    marginVertical: SIZES.baseSpacing,
    paddingVertical: 0,
    borderRadius: 8,
    marginHorizontal: SIZES.baseSpacing,
    ...SHADOWS.small,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textLight,
    paddingHorizontal: SIZES.baseSpacing,
    paddingTop: SIZES.baseSpacing + 4,
    paddingBottom: SIZES.baseSpacing - 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  /* ========== ITEM DE CONFIGURAÇÃO ========== */
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.baseSpacing,
    paddingVertical: SIZES.baseSpacing + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.baseSpacing + 4,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '400',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.baseSpacing / 2,
    marginLeft: SIZES.baseSpacing,
  },

  /* ========== INPUTS ========== */
  settingInputContainer: {
    paddingHorizontal: SIZES.baseSpacing,
    paddingVertical: SIZES.baseSpacing,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: COLORS.white,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.baseSpacing / 2,
  },
  limitInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadiusSmall,
    paddingHorizontal: SIZES.baseSpacing / 2,
    paddingVertical: SIZES.baseSpacing / 3,
    fontSize: 16,
    color: COLORS.text,
    width: 60,
    textAlign: 'center',
    fontWeight: '700',
    backgroundColor: COLORS.white,
  },
  limitUnit: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: SIZES.baseSpacing / 4,
  },
  inputHint: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: SIZES.baseSpacing / 3,
    fontWeight: '400',
  },
  brokerInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    paddingHorizontal: SIZES.baseSpacing,
    paddingVertical: SIZES.baseSpacing / 2 + 2,
    fontSize: 13,
    color: COLORS.text,
    backgroundColor: '#F5F5F5',
  },

  /* ========== BOTÕES INTERVALO ========== */
  intervalButtonsContainer: {
    flexDirection: 'row',
    gap: SIZES.baseSpacing,
    paddingHorizontal: SIZES.baseSpacing,
    paddingVertical: SIZES.baseSpacing,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  intervalButton: {
    flex: 1,
    paddingVertical: SIZES.baseSpacing - 2,
    borderRadius: 6,
    borderWidth: 0,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  intervalButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  intervalButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textLight,
  },
  intervalButtonTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  intervalHint: {
    fontSize: 12,
    color: COLORS.textLight,
    paddingHorizontal: SIZES.baseSpacing,
    paddingBottom: SIZES.baseSpacing,
    fontWeight: '400',
  },

  /* ========== BOTÕES DE AÇÃO ========== */
  testButton: {
    marginHorizontal: SIZES.baseSpacing,
    marginVertical: SIZES.baseSpacing,
    paddingVertical: SIZES.baseSpacing,
    paddingHorizontal: SIZES.baseSpacing,
    borderRadius: 6,
    backgroundColor: COLORS.warning,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.baseSpacing / 2,
    ...SHADOWS.small,
  },
  testButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },

  /* ========== ERROS ========== */
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerLight,
    borderLeftWidth: 0,
    paddingHorizontal: SIZES.baseSpacing,
    paddingVertical: SIZES.baseSpacing,
    marginHorizontal: SIZES.baseSpacing,
    marginVertical: SIZES.baseSpacing / 2,
    borderRadius: 6,
    gap: SIZES.baseSpacing / 2,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.danger,
    fontWeight: '500',
  },

  /* ========== INFORMAÇÕES DO SISTEMA ========== */
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.baseSpacing,
    paddingVertical: SIZES.baseSpacing,
    gap: SIZES.baseSpacing / 2,
  },
  infoCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    padding: SIZES.baseSpacing,
    borderWidth: 0,
    alignItems: 'center',
  },
  infoCardLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '600',
    marginBottom: SIZES.baseSpacing / 3,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoCardValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },

  /* ========== LIMITE DE UMIDADE - SLIDER ========== */
  limiteContainer: {
    paddingHorizontal: SIZES.baseSpacing,
    paddingVertical: SIZES.baseSpacing,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EB',
    backgroundColor: '#F8F9FA',
  },
  limiteValueDisplay: {
    alignItems: 'center',
    marginBottom: SIZES.baseSpacing,
  },
  limiteValueNumber: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SIZES.baseSpacing / 4,
  },
  limiteValueLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },

  sliderContainer: {
    marginVertical: SIZES.baseSpacing,
    position: 'relative',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#E4E6EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: SIZES.baseSpacing,
  },
  sliderFill: {
    height: '100%',
    borderRadius: 3,
  },
  sliderTouchable: {
    height: 50,
    justifyContent: 'center',
    marginVertical: -22,
  },
  sliderThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: COLORS.white,
    marginLeft: -9,
  },

  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.baseSpacing / 4,
  },
  sliderLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '600',
  },

  presetButtons: {
    flexDirection: 'row',
    gap: SIZES.baseSpacing / 2,
    marginTop: SIZES.baseSpacing,
    marginBottom: SIZES.baseSpacing,
  },
  presetButton: {
    flex: 1,
    paddingVertical: SIZES.baseSpacing / 1.8,
    borderRadius: SIZES.borderRadiusSmall,
    borderWidth: 1.5,
    borderColor: '#E4E6EB',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  presetButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  presetButtonTextActive: {
    color: COLORS.white,
  },

  manualInputSection: {
    marginTop: SIZES.baseSpacing,
    paddingTop: SIZES.baseSpacing,
    borderTopWidth: 1,
    borderTopColor: '#E4E6EB',
  },
  manualInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: SIZES.baseSpacing / 2,
  },
  manualInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.baseSpacing / 2,
  },
  manualInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadiusSmall,
    paddingHorizontal: SIZES.baseSpacing / 2,
    paddingVertical: SIZES.baseSpacing / 3,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '700',
    backgroundColor: COLORS.white,
  },
  manualInputUnit: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },

  /* ========== LIMITE DE UMIDADE SIMPLES ========== */
  limiteButtonsContainer: {
    flexDirection: 'row',
    gap: SIZES.baseSpacing,
    paddingHorizontal: SIZES.baseSpacing,
    paddingVertical: SIZES.baseSpacing,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  limiteButton: {
    flex: 1,
    paddingVertical: SIZES.baseSpacing - 2,
    borderRadius: 6,
    borderWidth: 0,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  limiteButtonActive: {
    backgroundColor: COLORS.primary,
  },
  limiteButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textLight,
  },
  limiteButtonTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  limiteHint: {
    fontSize: 12,
    color: COLORS.textLight,
    paddingHorizontal: SIZES.baseSpacing,
    paddingBottom: SIZES.baseSpacing,
    fontWeight: '400',
  },
});

export default ConfigScreen;
