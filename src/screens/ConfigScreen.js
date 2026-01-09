import React, { useState } from 'react';
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
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import ConfirmDialog from '../components/ConfirmDialog';
import ConnectionStatus from '../components/ConnectionStatus';
import { HelpTooltip, HelpModal } from '../components/Help';
import { showToast } from '../components/Toast';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';

const ConfigScreen = () => {
  const [nomeDispositivo, setNomeDispositivo] = useState('Estufa 1');
  const [modoAutomatico, setModoAutomatico] = useState(true);
  const [intervaloLeitura, setIntervaloLeitura] = useState('30');
  const [alertasSonoros, setAlertasSonoros] = useState(true);
  const [limiteMinimo, setLimiteMinimo] = useState('40');
  const [limiteMaximo, setLimiteMaximo] = useState('75');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [helpVisible, setHelpVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [nomeErro, setNomeErro] = useState(null);
  const [limiteErro, setLimiteErro] = useState(null);

  const validateLimites = (min, max) => {
    const minVal = parseInt(min);
    const maxVal = parseInt(max);
    
    if (isNaN(minVal) || isNaN(maxVal)) {
      setLimiteErro('Valores devem ser numéricos');
      return false;
    }
    if (minVal < 0 || maxVal > 100) {
      setLimiteErro('Valores devem estar entre 0 e 100%');
      return false;
    }
    if (minVal >= maxVal) {
      setLimiteErro('Mínimo deve ser menor que o máximo');
      return false;
    }
    setLimiteErro(null);
    return true;
  };

  const handleSaveConfig = () => {
    if (!nomeDispositivo.trim()) {
      showToast('Nome do dispositivo não pode estar vazio', 'error');
      return;
    }
    if (!validateLimites(limiteMinimo, limiteMaximo)) {
      showToast('Verifique os limites de umidade', 'error');
      return;
    }
    setConfirmVisible(true);
  };

  const confirmSaveConfig = () => {
    setConfirmVisible(false);
    showToast('✓ Configurações salvas com sucesso!', 'success', 3000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Header 
          title="Configurações ⚙️" 
          subtitle="Personalize seu sistema"
        />

        {/* Indicador de Status de Conexão */}
        <ConnectionStatus status={connectionStatus} />

        {/* Seção: Nome do Dispositivo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBg, { backgroundColor: COLORS.primaryLight }]}>
              <MaterialCommunityIcons
                name="devices"
                size={20}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.sectionTitle}>Dispositivo</Text>
            <HelpTooltip text="Configure o nome do seu dispositivo para identificação fácil." />
          </View>

          <View style={[styles.card, { ...SHADOWS.light }]}>
            <Text style={styles.label}>Nome do Dispositivo</Text>
            <TextInput
              style={[
                styles.input,
                nomeErro && { borderColor: COLORS.danger, borderWidth: 1 }
              ]}
              value={nomeDispositivo}
              onChangeText={(text) => {
                setNomeDispositivo(text);
                setNomeErro(text.trim() ? null : 'Nome não pode estar vazio');
              }}
              placeholder="Ex: Estufa 1"
              placeholderTextColor={COLORS.border}
            />
            {nomeErro && (
              <Text style={styles.errorText}>
                <MaterialCommunityIcons name="alert-circle" size={12} /> {nomeErro}
              </Text>
            )}
            <Text style={styles.hint}>
              Usado para identificar seu sistema de irrigação
            </Text>
          </View>
        </View>

        {/* Seção: Modo de Operação */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBg, { backgroundColor: COLORS.successLight }]}>
              <MaterialCommunityIcons
                name="robot"
                size={20}
                color={COLORS.success}
              />
            </View>
            <Text style={styles.sectionTitle}>Modo de Operação</Text>
          </View>

          <View style={[styles.card, { ...SHADOWS.light }]}>
            <View style={styles.switchContainer}>
              <View style={styles.switchTextContainer}>
                <View style={styles.modeBadge}>
                  <Text style={styles.modeBadgeText}>
                    {modoAutomatico ? '🔵' : '🔴'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.switchLabel}>Modo Automático</Text>
                  <Text style={styles.switchDescription}>
                    Irrigação automática baseada na umidade
                  </Text>
                </View>
              </View>
              <Switch
                value={modoAutomatico}
                onValueChange={setModoAutomatico}
                trackColor={{ false: COLORS.border, true: COLORS.success }}
                thumbColor={COLORS.white}
              />
            </View>
          </View>

          {!modoAutomatico && (
            <View style={[styles.card, { ...SHADOWS.light, backgroundColor: COLORS.dangerLight }]}>
              <View style={styles.manualModeInfo}>
                <MaterialCommunityIcons
                  name="lock-open"
                  size={20}
                  color={COLORS.danger}
                  style={{ marginRight: SIZES.baseSpacing / 2 }}
                />
                <Text style={[styles.manualModeText, { color: COLORS.danger }]}>
                  Modo Manual ativado - Você pode controlar a bomba manualmente
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Seção: Alertas Sonoros */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBg, { backgroundColor: '#FFF3E0' }]}>
              <MaterialCommunityIcons
                name="bell"
                size={20}
                color={COLORS.warning}
              />
            </View>
            <Text style={styles.sectionTitle}>Notificações</Text>
          </View>

          <View style={[styles.card, { ...SHADOWS.light }]}>
            <View style={styles.switchContainer}>
              <View style={styles.switchTextContainer}>
                <View style={styles.alertIcon}>
                  <MaterialCommunityIcons
                    name={alertasSonoros ? 'volume-high' : 'volume-off'}
                    size={24}
                    color={COLORS.warning}
                  />
                </View>
                <View>
                  <Text style={styles.switchLabel}>Alertas Sonoros</Text>
                  <Text style={styles.switchDescription}>
                    Sons quando solo fica muito seco
                  </Text>
                </View>
              </View>
              <Switch
                value={alertasSonoros}
                onValueChange={setAlertasSonoros}
                trackColor={{ false: COLORS.border, true: COLORS.success }}
                thumbColor={COLORS.white}
              />
            </View>
          </View>
        </View>

        {/* Seção: Leituras */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBg, { backgroundColor: COLORS.primaryLight }]}>
              <MaterialCommunityIcons
                name="clock"
                size={20}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.sectionTitle}>Intervalo de Leitura</Text>
          </View>

          <View style={[styles.card, { ...SHADOWS.light }]}>
            <Text style={styles.label}>Frequência de Leitura (segundos)</Text>
            <View style={styles.intervalButtons}>
              {['5', '10', '30', '60'].map((valor) => (
                <TouchableOpacity
                  key={valor}
                  style={[
                    styles.intervalButton,
                    intervaloLeitura === valor && styles.intervalButtonActive,
                  ]}
                  onPress={() => setIntervaloLeitura(valor)}
                >
                  <Text
                    style={[
                      styles.intervalButtonText,
                      intervaloLeitura === valor && styles.intervalButtonTextActive,
                    ]}
                  >
                    {valor}s
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.hint}>
              Tempo entre cada leitura dos sensores
            </Text>
          </View>
        </View>

        {/* Seção: Limites */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBg, { backgroundColor: COLORS.successLight }]}>
              <MaterialCommunityIcons
                name="water-percent"
                size={20}
                color={COLORS.success}
              />
            </View>
            <Text style={styles.sectionTitle}>Limites de Umidade</Text>
            <HelpTooltip text="Defina os limites mínimo e máximo para controlar automaticamente quando a bomba liga e desliga." />
          </View>

          {limiteErro && (
            <View style={styles.errorBanner}>
              <MaterialCommunityIcons name="alert-circle" size={20} color={COLORS.danger} />
              <Text style={styles.errorBannerText}>{limiteErro}</Text>
            </View>
          )}

          <View style={[styles.card, { ...SHADOWS.light }]}>
            <View style={styles.limitItem}>
              <View>
                <Text style={styles.limitLabel}>Limite Mínimo</Text>
                <Text style={styles.limitDescription}>Bomba liga automaticamente</Text>
              </View>
              <TextInput
                style={[
                  styles.limitInput,
                  limiteErro && { borderColor: COLORS.danger, borderWidth: 1 }
                ]}
                value={limiteMinimo}
                onChangeText={(text) => {
                  setLimiteMinimo(text);
                  validateLimites(text, limiteMaximo);
                }}
                placeholder="40"
                placeholderTextColor={COLORS.border}
                keyboardType="numeric"
                maxLength={3}
              />
              <Text style={styles.limitUnit}>%</Text>
            </View>
          </View>

          <View style={[styles.card, { ...SHADOWS.light }]}>
            <View style={styles.limitItem}>
              <View>
                <Text style={styles.limitLabel}>Limite Máximo</Text>
                <Text style={styles.limitDescription}>Bomba desliga automaticamente</Text>
              </View>
              <TextInput
                style={[
                  styles.limitInput,
                  limiteErro && { borderColor: COLORS.danger, borderWidth: 1 }
                ]}
                value={limiteMaximo}
                onChangeText={(text) => {
                  setLimiteMaximo(text);
                  validateLimites(limiteMinimo, text);
                }}
                placeholder="75"
                placeholderTextColor={COLORS.border}
                keyboardType="numeric"
                maxLength={3}
              />
              <Text style={styles.limitUnit}>%</Text>
            </View>
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          style={[styles.saveButton, { ...SHADOWS.medium }]}
          onPress={handleSaveConfig}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="content-save"
            size={24}
            color={COLORS.white}
            style={{ marginRight: SIZES.baseSpacing / 2 }}
          />
          <Text style={styles.saveButtonText}>Salvar Configurações</Text>
        </TouchableOpacity>

        {/* Seção de Informações do Sistema */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <MaterialCommunityIcons
              name="information"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.infoTitle}>Informações do Sistema</Text>
          </View>
          <View style={[styles.infoItem, { borderBottomWidth: 1, borderBottomColor: COLORS.border }]}>
            <Text style={styles.infoLabel}>Versão do App</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={[styles.infoItem, { borderBottomWidth: 1, borderBottomColor: COLORS.border }]}>
            <Text style={styles.infoLabel}>Plataforma</Text>
            <Text style={styles.infoValue}>React Native</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Último Sincronismo</Text>
            <Text style={styles.infoValue}>Agora</Text>
          </View>
        </View>
      </ScrollView>

      {/* Diálogo de Confirmação */}
      <ConfirmDialog
        visible={confirmVisible}
        title="Salvar Configurações?"
        message="Todas as mudanças serão aplicadas ao sistema. Tem certeza que deseja continuar?"
        confirmText="Salvar"
        cancelText="Cancelar"
        onConfirm={confirmSaveConfig}
        onCancel={() => setConfirmVisible(false)}
        icon="content-save"
      />

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
    backgroundColor: COLORS.background,
  },
  container: {
    paddingBottom: SIZES.baseSpacing * 2,
  },
  section: {
    marginVertical: SIZES.baseSpacing / 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.baseSpacing,
    marginBottom: SIZES.baseSpacing,
    marginTop: SIZES.baseSpacing / 2,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: SIZES.borderRadiusSmall,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.baseSpacing / 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    marginHorizontal: SIZES.baseSpacing,
    padding: SIZES.baseSpacing,
    marginVertical: SIZES.baseSpacing / 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.baseSpacing / 2,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadiusSmall,
    paddingHorizontal: SIZES.baseSpacing,
    paddingVertical: SIZES.baseSpacing / 2,
    fontSize: 14,
    color: COLORS.text,
    marginVertical: SIZES.baseSpacing / 2,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: SIZES.xs,
    fontWeight: '500',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerLight,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.sm,
    borderRadius: SIZES.borderRadiusSmall,
    gap: SIZES.md,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: '500',
  },
  hint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: SIZES.baseSpacing / 2,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SIZES.baseSpacing,
  },
  switchTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.baseSpacing / 2,
  },
  modeBadge: {
    fontSize: 24,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  switchDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: SIZES.borderRadiusSmall,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  manualModeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.baseSpacing / 2,
    paddingTop: SIZES.baseSpacing / 2,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  manualModeText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: SIZES.baseSpacing / 2,
    flex: 1,
    fontWeight: '500',
  },
  intervalButtons: {
    flexDirection: 'row',
    gap: SIZES.baseSpacing / 2,
    marginVertical: SIZES.baseSpacing / 2,
  },
  intervalButton: {
    flex: 1,
    paddingVertical: SIZES.baseSpacing / 2,
    borderRadius: SIZES.borderRadiusSmall,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  intervalButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  intervalButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  intervalButtonTextActive: {
    color: COLORS.white,
  },
  limitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.baseSpacing / 2,
  },
  limitLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  limitDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: SIZES.xs,
    fontWeight: '500',
  },
  limitInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadiusSmall,
    paddingHorizontal: SIZES.baseSpacing / 2,
    paddingVertical: SIZES.baseSpacing / 4,
    fontSize: 14,
    color: COLORS.text,
    width: 60,
    textAlign: 'center',
    fontWeight: '700',
  },
  limitUnit: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: SIZES.xs,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SIZES.baseSpacing,
    marginVertical: SIZES.baseSpacing,
    paddingVertical: SIZES.baseSpacing,
    borderRadius: SIZES.borderRadius,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.baseSpacing,
    marginVertical: SIZES.baseSpacing,
    paddingHorizontal: SIZES.baseSpacing,
    paddingVertical: SIZES.baseSpacing,
    borderRadius: SIZES.borderRadius,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.baseSpacing,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SIZES.md,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.baseSpacing / 2,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
});

export default ConfigScreen;
