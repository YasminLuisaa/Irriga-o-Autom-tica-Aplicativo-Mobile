import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import Header from '../components/Header';
import ConnectionStatus from '../components/ConnectionStatus';
import { HelpTooltip, HelpModal } from '../components/Help';
import { showToast } from '../components/Toast';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';

const screenWidth = Dimensions.get('window').width;

const HistoricoScreen = () => {
  const [filtro, setFiltro] = useState('24h');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [helpVisible, setHelpVisible] = useState(false);

  // Dados simulados de umidade ao longo do tempo
  const dados = {
    '24h': {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [
        {
          data: [45, 50, 65, 70, 65, 55],
          strokeWidth: 3,
          color: () => COLORS.primary,
          fillShadowGradient: COLORS.success,
          fillShadowGradientOpacity: 0.3,
        },
      ],
      stats: { max: 75, min: 45, media: 59, irrigacoes: 3 },
    },
    'semana': {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      datasets: [
        {
          data: [55, 62, 58, 68, 72, 65],
          strokeWidth: 3,
          color: () => COLORS.primary,
          fillShadowGradient: COLORS.success,
          fillShadowGradientOpacity: 0.3,
        },
      ],
      stats: { max: 78, min: 42, media: 63, irrigacoes: 12 },
    },
    'mes': {
      labels: ['Sem1', 'Sem2', 'Sem3', 'Sem4'],
      datasets: [
        {
          data: [60, 65, 62, 70],
          strokeWidth: 3,
          color: () => COLORS.primary,
          fillShadowGradient: COLORS.success,
          fillShadowGradientOpacity: 0.3,
        },
      ],
      stats: { max: 82, min: 40, media: 65, irrigacoes: 45 },
    },
  };

  const chartData = dados[filtro];
  const stats = chartData.stats;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Header 
          title="Histórico de Umidade 📊" 
          subtitle="Análise da tendência"
        />

        {/* Indicador de Status de Conexão */}
        <ConnectionStatus status={connectionStatus} />

        {/* Botões de Filtro */}
        <View style={styles.filterSection}>
          <View style={styles.filterTitleContainer}>
            <Text style={styles.filterTitle}>Período</Text>
            <HelpTooltip text="Selecione um período para visualizar os dados históricos. Cada período mostra estatísticas diferentes." />
          </View>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filtro === '24h' && styles.filterButtonActive,
              ]}
              onPress={() => setFiltro('24h')}
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={filtro === '24h' ? COLORS.white : COLORS.textLight}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  filtro === '24h' && styles.filterButtonTextActive,
                ]}
              >
                Últimas 24h
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                filtro === 'semana' && styles.filterButtonActive,
              ]}
              onPress={() => setFiltro('semana')}
            >
              <MaterialCommunityIcons
                name="calendar-week"
                size={16}
                color={filtro === 'semana' ? COLORS.white : COLORS.textLight}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  filtro === 'semana' && styles.filterButtonTextActive,
                ]}
              >
                Última Semana
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                filtro === 'mes' && styles.filterButtonActive,
              ]}
              onPress={() => setFiltro('mes')}
            >
              <MaterialCommunityIcons
                name="calendar-month"
                size={16}
                color={filtro === 'mes' ? COLORS.white : COLORS.textLight}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  filtro === 'mes' && styles.filterButtonTextActive,
                ]}
              >
                Último Mês
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Gráfico */}
        <View style={[styles.chartContainer, { ...SHADOWS.light }]}>
          <Text style={styles.chartTitle}>Variação da Umidade do Solo</Text>
          <LineChart
            data={chartData}
            width={screenWidth - SIZES.baseSpacing * 2}
            height={220}
            chartConfig={{
              backgroundColor: COLORS.white,
              backgroundGradientFrom: COLORS.white,
              backgroundGradientTo: COLORS.white,
              color: () => COLORS.primary,
              labelColor: () => COLORS.textLight,
              style: {
                borderRadius: SIZES.borderRadius,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: COLORS.primary,
              },
            }}
            bezier
            style={styles.chart}
          />
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.legendText}>Umidade do Solo</Text>
            </View>
          </View>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Estatísticas do Período</Text>

          <View style={[styles.statsGrid, { ...SHADOWS.light }]}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: COLORS.successLight }]}>
                <MaterialCommunityIcons
                  name="arrow-top-right"
                  size={20}
                  color={COLORS.success}
                />
              </View>
              <Text style={styles.statLabel}>Máxima</Text>
              <Text style={[styles.statValue, { color: COLORS.success }]}>
                {stats.max}%
              </Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: COLORS.dangerLight }]}>
                <MaterialCommunityIcons
                  name="arrow-bottom-left"
                  size={20}
                  color={COLORS.danger}
                />
              </View>
              <Text style={styles.statLabel}>Mínima</Text>
              <Text style={[styles.statValue, { color: COLORS.danger }]}>
                {stats.min}%
              </Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: COLORS.primaryLight }]}>
                <MaterialCommunityIcons
                  name="chart-line"
                  size={20}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.statLabel}>Média</Text>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>
                {stats.media}%
              </Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                <MaterialCommunityIcons
                  name="water-check"
                  size={20}
                  color={COLORS.success}
                />
              </View>
              <Text style={styles.statLabel}>Irrigações</Text>
              <Text style={[styles.statValue, { color: COLORS.success }]}>
                {stats.irrigacoes}x
              </Text>
            </View>
          </View>
        </View>

        {/* Nota */}
        <View style={[styles.noteBox, { ...SHADOWS.light }]}>
          <View style={styles.noteHeader}>
            <MaterialCommunityIcons
              name="lightbulb-on"
              size={20}
              color={COLORS.warning}
            />
            <Text style={styles.noteTitle}>Dica</Text>
          </View>
          <Text style={styles.noteText}>
            Monitore as tendências de umidade para ajustar melhor o intervalo de irrigação. Máximas próximas a 80% indicam solo bem hidratado.
          </Text>
        </View>
      </ScrollView>

      {/* Help Modal */}
      <HelpModal
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
        title="Ajuda - Histórico"
        sections={[
          {
            icon: 'chart-line',
            title: 'Gráfico de Umidade',
            description: 'O gráfico mostra a evolução da umidade ao longo do tempo.',
            tips: [
              'Linha azul = umidade do solo',
              'Quanto maior o valor, mais úmido o solo',
              'Picos para baixo indicam períodos secos',
            ],
          },
          {
            icon: 'information',
            title: 'Estatísticas',
            description: 'Resumo dos valores de umidade no período selecionado.',
            tips: [
              'Máxima: pico mais alto de umidade',
              'Mínima: valor mais baixo registrado',
              'Média: valor médio do período',
              'Irrigações: quantas vezes a bomba ligou',
            ],
          },
          {
            icon: 'alert-circle',
            title: 'Como Interpretar?',
            description: 'Entenda melhor os dados para melhorar a irrigação.',
            tips: [
              'Se máxima está abaixo de 60%, aumente a frequência de irrigação',
              'Se mínima está acima de 70%, diminua a frequência',
              'Valores estáveis indicam um bom sistema de irrigação',
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
  filterSection: {
    marginHorizontal: SIZES.baseSpacing,
    marginVertical: SIZES.baseSpacing,
  },
  filterTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
    marginBottom: SIZES.baseSpacing / 2,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: SIZES.baseSpacing / 2,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.baseSpacing / 2,
    paddingHorizontal: SIZES.baseSpacing / 2,
    borderRadius: SIZES.borderRadiusSmall,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    gap: SIZES.xs,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: '500',
    color: COLORS.textLight,
  },
  filterButtonTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    marginHorizontal: SIZES.baseSpacing,
    marginVertical: SIZES.baseSpacing,
    padding: SIZES.baseSpacing,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.baseSpacing,
  },
  chart: {
    borderRadius: SIZES.borderRadius,
    marginVertical: SIZES.baseSpacing / 2,
  },
  legendContainer: {
    marginTop: SIZES.baseSpacing / 2,
    paddingTop: SIZES.baseSpacing / 2,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SIZES.baseSpacing / 2,
  },
  legendText: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  statsSection: {
    marginHorizontal: SIZES.baseSpacing,
    marginVertical: SIZES.baseSpacing,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.baseSpacing,
  },
  statsGrid: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.baseSpacing,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.baseSpacing / 2,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: SIZES.baseSpacing / 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: SIZES.borderRadiusSmall,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.baseSpacing / 2,
  },
  statLabel: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.textLight,
    marginBottom: SIZES.xs,
  },
  statValue: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: '700',
  },
  noteBox: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    marginHorizontal: SIZES.baseSpacing,
    marginVertical: SIZES.baseSpacing,
    padding: SIZES.baseSpacing,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.baseSpacing / 2,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SIZES.baseSpacing / 2,
  },
  noteText: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 20,
    fontWeight: '500',
  },
});

export default HistoricoScreen;
