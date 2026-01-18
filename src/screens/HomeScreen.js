import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import ScreenHeader from '../components/ScreenHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import ConnectionStatus from '../components/ConnectionStatus';
import { HelpTooltip } from '../components/Help';
import { showToast } from '../components/Toast';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';
import api from '../services/api';
import { useApp } from '../contexts/AppContext';

// Firebase desabilitado

let notificarSoloSeco, notificarSoloUmido, notificarBombaAcionada;
try {
  const notificationService = require('../services/notificationService');
  notificarSoloSeco = notificationService.notificarSoloSeco;
  notificarSoloUmido = notificationService.notificarSoloUmido;
  notificarBombaAcionada = notificationService.notificarBombaAcionada;
} catch (error) {
  console.warn('Notification service not available:', error.message);
  notificarSoloSeco = async () => console.log('Notificações não configuradas');
  notificarSoloUmido = async () => console.log('Notificações não configuradas');
  notificarBombaAcionada = async () => console.log('Notificações não configuradas');
}

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const {
    sensor1,
    sensor2,
    sensor3,
    media,
    mediaPercent,
    bombaLigada,
    modoAutomatico,
    toggleBomba,
    connectionStatus,
    lastUpdate,
    loading,
    luminosity,
  } = useApp();

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statusAnterior, setStatusAnterior] = useState('UMIDO');

  // Função para determinar status segundo tabela de referência
  const determinarStatusDetalhado = (percentual) => {
    if (percentual >= 80) return { texto: 'Encharcado', emoji: '💦' };
    if (percentual >= 60) return { texto: 'Úmido', emoji: '✅' };
    if (percentual >= 40) return { texto: 'Quase seco', emoji: '⚠️' };
    if (percentual >= 20) return { texto: 'Seco', emoji: '❌' };
    return { texto: 'Muito seco', emoji: '🔴' };
  };

  // Refresh manual
  const onRefresh = async () => {
    setRefreshing(true);
    // O AppContext já busca dados automaticamente a cada 3 segundos
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleToggleBomba = () => {
    setConfirmVisible(true);
  };

  const confirmToggleBomba = async () => {
    setConfirmVisible(false);
    try {
      const novoEstado = !bombaLigada;
      const sucesso = await toggleBomba(novoEstado);
      
      if (sucesso) {
        showToast(
          novoEstado ? '💧 Bomba ligada com sucesso!' : '🛑 Bomba desligada',
          novoEstado ? 'success' : 'info',
          3000
        );
        console.log(`✅ Bomba ${novoEstado ? 'LIGADA' : 'DESLIGADA'}`);
      } else {
        showToast('❌ Erro ao controlar bomba', 'error');
      }
    } catch (error) {
      console.error('Erro:', error);
      showToast('❌ Erro ao controlar bomba', 'error');
    }
  };

  const formatarHora = (data) => {
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes} ${horas}:${minutos}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader currentScreen="HomeTab" navigation={navigation} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header 
          title="Irrigação Automática 🌿" 
          subtitle="Monitoramento em Tempo Real"
        />

        <ConnectionStatus status={connectionStatus} />

        <View style={[styles.card, styles.umidadeCard, { ...SHADOWS.medium }]}>
          <View style={styles.umidadeContent}>
            <View style={[styles.iconCircle, { backgroundColor: COLORS.primaryLight }]}>
              <MaterialCommunityIcons
                name="water-percent"
                size={44}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.labelWithHelp}>
              <Text style={styles.label}>Umidade Média</Text>
              <HelpTooltip text="Percentual médio de umidade do solo em tempo real." />
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{Math.round(media)}</Text>
              <Text style={styles.valueUnit}>%</Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: media >= 60 ? COLORS.success : media >= 40 ? COLORS.warning : COLORS.danger,
              ...SHADOWS.medium,
            },
          ]}
        >
          <View style={styles.statusContent}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <MaterialCommunityIcons
                name={media >= 60 ? 'leaf' : media >= 40 ? 'alert' : 'leaf-off'}
                size={44}
                color={COLORS.white}
              />
            </View>
            <Text style={styles.statusLabel}>Status do Solo</Text>
            <Text style={styles.statusValue}>{determinarStatusDetalhado(media).emoji} {determinarStatusDetalhado(media).texto}</Text>
          </View>
        </View>

        <View style={styles.controlSection}>
          <View style={styles.controlTitleContainer}>
            <Text style={styles.controlTitle}>Controle da Bomba</Text>
            <HelpTooltip text="Controle manual da bomba. Desativa o modo automático." />
          </View>
          
          {!modoAutomatico && (
            <View style={styles.modoManualBanner}>
              <MaterialCommunityIcons name="hand-back-right" size={16} color={COLORS.warning} />
              <Text style={styles.modoManualText}>Modo Manual Ativo</Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.bombaButton,
              {
                backgroundColor: bombaLigada ? COLORS.danger : COLORS.success,
              },
            ]}
            onPress={handleToggleBomba}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={bombaLigada ? 'pump' : 'water-off'}
              size={44}
              color={COLORS.white}
            />
            <Text style={styles.bombaButtonText}>
              {bombaLigada ? '💧 Desligar bomba' : '💧 Ligar bomba'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.hint}>
            {bombaLigada
              ? '✓ A bomba está irrigando o solo'
              : '→ Toque para ligar a bomba'}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Sensores Adicionais</Text>
          
          <View style={[styles.infoItem, { ...SHADOWS.light }]}>
            <View style={[styles.infoIcon, { backgroundColor: COLORS.warningLight }]}>
              <MaterialCommunityIcons
                name="thermometer"
                size={24}
                color={COLORS.warning}
              />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Temperatura</Text>
              <Text style={styles.infoValue}>28°C</Text>
            </View>
            <Text style={styles.infoStatus}>Normal</Text>
          </View>

          <View style={[styles.infoItem, { ...SHADOWS.light }]}>
            <View style={[styles.infoIcon, { backgroundColor: COLORS.primaryLight }]}>
              <MaterialCommunityIcons
                name="lightbulb"
                size={24}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Luminosidade</Text>
              <Text style={styles.infoValue}>{Math.round(luminosity)}%</Text>
            </View>
            <Text style={styles.infoStatus}>{luminosity > 70 ? 'Ótimo' : luminosity > 40 ? 'Bom' : 'Baixo'}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <MaterialCommunityIcons
          name="history"
          size={16}
          color={COLORS.textLight}
        />
        <Text style={styles.footerText}>
          Última atualização: {formatarHora(lastUpdate)}
        </Text>
      </View>

      <ConfirmDialog
        visible={confirmVisible}
        title={bombaLigada ? 'Desligar Bomba?' : 'Ligar Bomba?'}
        message={
          bombaLigada
            ? 'Tem certeza que deseja desligar a bomba de irrigação?'
            : 'Deseja iniciar a irrigação do solo agora?'
        }
        confirmText={bombaLigada ? 'Desligar' : 'Ligar'}
        cancelText="Cancelar"
        onConfirm={confirmToggleBomba}
        onCancel={() => setConfirmVisible(false)}
        destructive={bombaLigada}
        icon={bombaLigada ? 'alert-circle' : 'water'}
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
    paddingBottom: SIZES.lg * 2,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.md,
    padding: SIZES.lg,
    alignItems: 'center',
  },
  umidadeCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  umidadeContent: {
    alignItems: 'center',
    width: '100%',
  },
  statusContent: {
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  label: {
    fontSize: SIZES.fontSize.md,
    color: COLORS.textLight,
    marginBottom: SIZES.sm,
    fontWeight: '500',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: SIZES.fontSize.xxxl,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -1,
  },
  valueUnit: {
    fontSize: SIZES.fontSize.lg,
    color: COLORS.textLight,
    marginLeft: SIZES.xs,
    fontWeight: '600',
  },
  statusLabel: {
    fontSize: SIZES.fontSize.md,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: SIZES.sm,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  controlSection: {
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.md,
  },
  controlTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
    marginBottom: SIZES.md,
  },
  controlTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  labelWithHelp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.sm,
  },
  modoManualBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningLight,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.borderRadiusSmall,
    marginBottom: SIZES.md,
    gap: SIZES.sm,
  },
  modoManualText: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.warning,
    fontWeight: '600',
  },
  bombaButton: {
    borderRadius: SIZES.borderRadius,
    paddingVertical: SIZES.lg,
    paddingHorizontal: SIZES.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  bombaButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSize.lg,
    fontWeight: '700',
    marginTop: SIZES.sm,
    letterSpacing: 0.5,
  },
  hint: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: SIZES.fontSize.sm,
    marginTop: SIZES.md,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  infoSection: {
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.md,
  },
  sectionTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.md,
    letterSpacing: 0.3,
  },
  infoItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusMedium,
    padding: SIZES.md,
    marginVertical: SIZES.sm,
    alignItems: 'center',
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: SIZES.borderRadiusSmall,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.textLight,
    fontWeight: '500',
    marginBottom: SIZES.xs,
  },
  infoValue: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  infoStatus: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.success,
    fontWeight: '600',
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.sm,
    backgroundColor: COLORS.successLight,
    borderRadius: SIZES.borderRadiusSmall,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SIZES.sm,
  },
  footerText: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.textLight,
    fontWeight: '500',
  },
});

export default HomeScreen;