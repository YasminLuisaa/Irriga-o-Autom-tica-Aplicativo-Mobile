import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SensorCard from '../components/SensorCard';
import Header from '../components/Header';
import ConnectionStatus from '../components/ConnectionStatus';
import { HelpTooltip, HelpModal } from '../components/Help';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';

const { width } = Dimensions.get('window');

const SensoresScreen = () => {
  const [sensors, setSensors] = useState([
    { id: 1, name: 'Sensor 1 - Vaso 1 🌱', value: 75, status: 'ÚMIDO' },
    { id: 2, name: 'Sensor 2 - Vaso 2 🌱', value: 45, status: 'SECO' },
    { id: 3, name: 'Sensor 3 - Vaso 3 🌱', value: 65, status: 'ÚMIDO' },
  ]);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [helpVisible, setHelpVisible] = useState(false);

  // Simular atualização de sensores periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prevSensors =>
        prevSensors.map(sensor => ({
          ...sensor,
          value: Math.max(0, Math.min(100, sensor.value + (Math.random() - 0.5) * 10)),
          status: sensor.value >= 50 ? 'ÚMIDO' : 'SECO',
        }))
      );
    }, 5000); // Atualizar a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  // Calcular média
  const media = Math.round(sensors.reduce((acc, sensor) => acc + sensor.value, 0) / sensors.length);
  const mediaStatus = media >= 50 ? 'ÚMIDO' : 'SECO';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Header 
          title="Sensores de Umidade 💧" 
          subtitle="Monitoramento em tempo real"
        />

        {/* Indicador de Status de Conexão */}
        <ConnectionStatus status={connectionStatus} />
        <View style={styles.sensorsGrid}>
          {sensors.map((sensor) => (
            <View key={sensor.id} style={styles.sensorWrapper}>
              <View 
                style={[
                  styles.sensorCard,
                  { 
                    borderLeftWidth: 4,
                    borderLeftColor: sensor.status === 'ÚMIDO' ? COLORS.success : COLORS.danger,
                    ...SHADOWS.light 
                  }
                ]}
              >
                <View style={styles.sensorHeader}>
                  <View 
                    style={[
                      styles.sensorIcon, 
                      { 
                        backgroundColor: sensor.status === 'ÚMIDO' ? COLORS.successLight : COLORS.dangerLight 
                      }
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="water"
                      size={32}
                      color={sensor.status === 'ÚMIDO' ? COLORS.success : COLORS.danger}
                    />
                  </View>
                  <View style={styles.sensorInfo}>
                    <Text style={styles.sensorName}>{sensor.name}</Text>
                    <Text 
                      style={[
                        styles.sensorStatus,
                        { color: sensor.status === 'ÚMIDO' ? COLORS.success : COLORS.danger }
                      ]}
                    >
                      {sensor.status === 'ÚMIDO' ? '✓ Úmido' : '⚠ Seco'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.sensorValue}>
                  <Text style={styles.sensorValueText}>{Math.round(sensor.value)}</Text>
                  <Text style={styles.sensorValueUnit}>%</Text>
                </View>

                <View style={styles.sensorBar}>
                  <View
                    style={[
                      styles.sensorProgress,
                      { 
                        width: `${sensor.value}%`,
                        backgroundColor: sensor.status === 'ÚMIDO' ? COLORS.success : COLORS.danger
                      }
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Card de Média Geral */}
        <View style={[styles.averageCard, { ...SHADOWS.medium }]}>
          <View style={styles.averageHeader}>
            <View style={[styles.averageIcon, { backgroundColor: COLORS.primaryLight }]}>
              <MaterialCommunityIcons
                name="chart-line"
                size={32}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.averageInfo}>
              <Text style={styles.averageLabel}>Média Geral</Text>
              <Text 
                style={[
                  styles.averageStatus,
                  { color: mediaStatus === 'ÚMIDO' ? COLORS.success : COLORS.danger }
                ]}
              >
                {mediaStatus === 'ÚMIDO' ? '✓ Úmido' : '⚠ Seco'}
              </Text>
            </View>
          </View>
          
          <View style={styles.averageValue}>
            <Text style={styles.averageValueText}>{media}%</Text>
          </View>

          <View style={styles.averageBar}>
            <View
              style={[
                styles.averageProgress,
                { 
                  width: `${media}%`,
                  backgroundColor: mediaStatus === 'ÚMIDO' ? COLORS.success : COLORS.danger
                }
              ]}
            />
          </View>
        </View>

        {/* Info Box */}
        <View style={[styles.infoBox, { ...SHADOWS.light }]}>
          <View style={styles.infoHeader}>
            <MaterialCommunityIcons
              name="information"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.infoTitle}>Informações</Text>
            <HelpTooltip text="Use as legendas para entender o status dos sensores. Verde = úmido (bom), Vermelho = seco (precisa regar)." />
          </View>
          <Text style={styles.infoText}>
            {'\n🟢 Verde:'} Solo úmido (ideal para irrigação){'\n'}
            {'\n🔴 Vermelho:'} Solo seco (necessita irrigação){'\n'}
            {'\nOs valores são atualizados a cada 5 segundos'}
          </Text>
        </View>
      </ScrollView>

      {/* Help Modal */}
      <HelpModal
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
        title="Ajuda - Sensores"
        sections={[
          {
            icon: 'water',
            title: 'Leitura dos Sensores',
            description: 'Cada sensor mede a umidade do solo e exibe um valor de 0 a 100%.',
            tips: [
              'Valores acima de 50% indicam solo úmido',
              'Valores abaixo de 50% indicam solo seco',
              'A bomba liga automaticamente quando o solo fica muito seco',
            ],
          },
          {
            icon: 'chart-line',
            title: 'Média Geral',
            description: 'A média é calculada usando os valores de todos os 3 sensores.',
            tips: [
              'Ajuda a entender o estado geral da irrigação',
              'Atualiza automaticamente a cada 5 segundos',
            ],
          },
          {
            icon: 'alert-circle',
            title: 'O que Fazer se os Sensores Não Atualizam?',
            description: 'Se os valores não mudam, pode haver um problema de conexão.',
            tips: [
              'Verifique se o dispositivo está conectado à rede',
              'Tente fazer refresh da tela',
              'Reinicie o aplicativo se o problema persistir',
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
  sensorsGrid: {
    marginHorizontal: SIZES.baseSpacing,
    marginVertical: SIZES.baseSpacing,
  },
  sensorWrapper: {
    marginVertical: SIZES.baseSpacing / 2,
  },
  sensorCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.baseSpacing,
    ...SHADOWS.light,
  },
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.baseSpacing,
  },
  sensorIcon: {
    width: 56,
    height: 56,
    borderRadius: SIZES.borderRadiusMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.baseSpacing,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorName: {
    fontSize: SIZES.fontSize.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  sensorStatus: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '500',
  },
  sensorValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SIZES.baseSpacing,
  },
  sensorValueText: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  sensorValueUnit: {
    fontSize: SIZES.fontSize.lg,
    color: COLORS.textLight,
    marginLeft: SIZES.xs,
    fontWeight: '600',
  },
  sensorBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  sensorProgress: {
    height: '100%',
    borderRadius: 4,
  },
  averageCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    marginHorizontal: SIZES.baseSpacing,
    marginVertical: SIZES.baseSpacing,
    padding: SIZES.baseSpacing,
    borderTopWidth: 3,
    borderTopColor: COLORS.primary,
  },
  averageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.baseSpacing,
  },
  averageIcon: {
    width: 56,
    height: 56,
    borderRadius: SIZES.borderRadiusMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.baseSpacing,
  },
  averageInfo: {
    flex: 1,
  },
  averageLabel: {
    fontSize: SIZES.fontSize.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  averageStatus: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '500',
  },
  averageValue: {
    marginBottom: SIZES.baseSpacing,
  },
  averageValueText: {
    fontSize: 44,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -1,
  },
  averageBar: {
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  averageProgress: {
    height: '100%',
    borderRadius: 5,
  },
  infoBox: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    marginHorizontal: SIZES.baseSpacing,
    marginVertical: SIZES.baseSpacing,
    padding: SIZES.baseSpacing,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.baseSpacing / 2,
    gap: SIZES.sm,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 22,
    fontWeight: '500',
  },
});

export default SensoresScreen;
