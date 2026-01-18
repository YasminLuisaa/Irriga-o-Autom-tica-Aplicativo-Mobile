import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SensorCard from '../components/SensorCard';
import Header from '../components/Header';
import ConnectionStatus from '../components/ConnectionStatus';
import { HelpTooltip, HelpModal } from '../components/Help';
import { showToast } from '../components/Toast';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';
import api from '../services/api';
import { useApp } from '../contexts/AppContext';

const { width } = Dimensions.get('window');

const SensoresScreen = () => {
  const {
    sensor1,
    sensor2,
    sensor3,
    mediaPercent,
    connectionStatus,
  } = useApp();

  const [helpVisible, setHelpVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Função para determinar status segundo tabela de referência
  // 80-100%: Encharcado | 60-79%: Úmido | 40-59%: Quase seco | 20-39%: Seco | 0-19%: Muito seco
  const determinarStatus = (percentual) => {
    if (percentual >= 80) return 'Encharcado';
    if (percentual >= 60) return 'Úmido';
    if (percentual >= 40) return 'Quase seco';
    if (percentual >= 20) return 'Seco';
    return 'Muito seco';
  };

  // Função para determinar cor baseada em percentual
  const getCor = (percentual) => {
    if (percentual >= 60) return COLORS.success;      // Verde - Úmido
    if (percentual >= 40) return COLORS.warning;      // Laranja - Quase seco
    return COLORS.danger;                              // Vermelho - Seco
  };

  const getCorLight = (percentual) => {
    if (percentual >= 60) return COLORS.successLight;
    if (percentual >= 40) return COLORS.warningLight;
    return COLORS.dangerLight;
  };

  // Buscar dados do ESP32
  const buscarDados = async () => {
    // O AppContext já busca dados automaticamente a cada 3 segundos
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  // Refresh manual
  const onRefresh = async () => {
    setRefreshing(true);
    await buscarDados();
    setRefreshing(false);
  };

  // Nota: media vem diretamente do ESP32 (dados.mediaPercent)

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header 
          title="Sensores de Umidade 💧" 
          subtitle="Monitoramento em tempo real"
        />

        {/* Indicador de Status de Conexão */}
        <ConnectionStatus status={connectionStatus} />

        {/* Sensor 1 */}
        <View style={[
          styles.sensorCard,
          { 
            borderLeftWidth: 4,
            borderLeftColor: getCor(sensor1),
            ...SHADOWS.light 
          }
        ]}>
          <View style={styles.sensorHeader}>
            <View 
              style={[
                styles.sensorIcon, 
                { 
                  backgroundColor: getCorLight(sensor1)
                }
              ]}
            >
              <MaterialCommunityIcons
                name="water"
                size={32}
                color={getCor(sensor1)}
              />
            </View>
            <View style={styles.sensorInfo}>
              <Text style={styles.sensorName}>Sensor 1 - Vaso 1 🌱</Text>
              <Text 
                style={[
                  styles.sensorStatus,
                  { color: getCor(sensor1) }
                ]}
              >
                {determinarStatus(sensor1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.sensorValue}>
            <Text style={styles.sensorValueText}>{sensor1}</Text>
            <Text style={styles.sensorValueUnit}>%</Text>
          </View>

          <View style={styles.sensorBar}>
            <View
              style={[
                styles.sensorProgress,
                { 
                  width: `${sensor1}%`,
                  backgroundColor: getCor(sensor1)
                }
              ]}
            />
          </View>
        </View>

        {/* Sensor 2 */}
        <View style={[
          styles.sensorCard,
          { 
            borderLeftWidth: 4,
            borderLeftColor: getCor(sensor2),
            ...SHADOWS.light 
          }
        ]}>
          <View style={styles.sensorHeader}>
            <View 
              style={[
                styles.sensorIcon, 
                { 
                  backgroundColor: getCorLight(sensor2)
                }
              ]}
            >
              <MaterialCommunityIcons
                name="water"
                size={32}
                color={getCor(sensor2)}
              />
            </View>
            <View style={styles.sensorInfo}>
              <Text style={styles.sensorName}>Sensor 2 - Vaso 2 🌱</Text>
              <Text 
                style={[
                  styles.sensorStatus,
                  { color: getCor(sensor2) }
                ]}
              >
                {determinarStatus(sensor2)}
              </Text>
            </View>
          </View>
          
          <View style={styles.sensorValue}>
            <Text style={styles.sensorValueText}>{sensor2}</Text>
            <Text style={styles.sensorValueUnit}>%</Text>
          </View>

          <View style={styles.sensorBar}>
            <View
              style={[
                styles.sensorProgress,
                { 
                  width: `${sensor2}%`,
                  backgroundColor: getCor(sensor2)
                }
              ]}
            />
          </View>
        </View>

        {/* Sensor 3 */}
        <View style={[
          styles.sensorCard,
          { 
            borderLeftWidth: 4,
            borderLeftColor: getCor(sensor3),
            ...SHADOWS.light 
          }
        ]}>
          <View style={styles.sensorHeader}>
            <View 
              style={[
                styles.sensorIcon, 
                { 
                  backgroundColor: getCorLight(sensor3)
                }
              ]}
            >
              <MaterialCommunityIcons
                name="water"
                size={32}
                color={getCor(sensor3)}
              />
            </View>
            <View style={styles.sensorInfo}>
              <Text style={styles.sensorName}>Sensor 3 - Vaso 3 🌱</Text>
              <Text 
                style={[
                  styles.sensorStatus,
                  { color: getCor(sensor3) }
                ]}
              >
                {determinarStatus(sensor3)}
              </Text>
            </View>
          </View>
          
          <View style={styles.sensorValue}>
            <Text style={styles.sensorValueText}>{sensor3}</Text>
            <Text style={styles.sensorValueUnit}>%</Text>
          </View>

          <View style={styles.sensorBar}>
            <View
              style={[
                styles.sensorProgress,
                { 
                  width: `${sensor3}%`,
                  backgroundColor: getCor(sensor3)
                }
              ]}
            />
          </View>
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
                  { color: mediaPercent >= 60 ? COLORS.success : mediaPercent >= 40 ? COLORS.warning : COLORS.danger }
                ]}
              >
                {determinarStatus(mediaPercent)}
              </Text>
            </View>
          </View>
          
          <View style={styles.averageValue}>
            <Text style={styles.averageValueText}>{mediaPercent}%</Text>
          </View>

          <View style={styles.averageBar}>
            <View
              style={[
                styles.averageProgress,
                { 
                  width: `${mediaPercent}%`,
                  backgroundColor: mediaPercent >= 60 ? COLORS.success : mediaPercent >= 40 ? COLORS.warning : COLORS.danger
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
            {'\n🟢 Verde:'} Solo úmido (não necessita de irrigação){'\n'}
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
    marginHorizontal: SIZES.baseSpacing,
    marginVertical: SIZES.baseSpacing / 2,
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
    marginBottom: SIZES.baseSpacing / 2,
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
  rawValue: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.textLight,
    marginBottom: SIZES.baseSpacing / 2,
    fontStyle: 'italic',
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
