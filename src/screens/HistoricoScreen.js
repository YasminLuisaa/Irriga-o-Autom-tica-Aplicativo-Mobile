import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';
import { showToast } from '../components/Toast';

// Firebase desabilitado - dados locais apenas

const { width } = Dimensions.get('window');

const HistoricoScreen = () => {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('todos'); // 'todos', 'sensor', 'bomba'

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = () => {
    setLoading(true);
    try {
      // Sem dados do Firebase - array vazio
      setHistorico([]);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      showToast('❌ Histórico não disponível', 'info');
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    carregarHistorico();
  };

  const historicoFiltrado = historico.filter((item) => {
    if (filtroTipo === 'todos') return true;
    return item.tipo === filtroTipo;
  });

  const formatarData = (timestamp) => {
    const data = new Date(timestamp);
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const renderizarItemSensor = (item) => (
    <View style={[styles.itemCard, { ...SHADOWS.light }]}>
      <View style={styles.itemHeader}>
        <View style={[styles.iconBox, { backgroundColor: COLORS.primaryLight }]}>
          <MaterialCommunityIcons
            name="water-percent"
            size={24}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>Leitura de Sensores</Text>
          <Text style={styles.itemTime}>{formatarData(item.timestamp)}</Text>
        </View>
      </View>

      <View style={styles.itemContent}>
        <View style={styles.sensorRow}>
          <Text style={styles.sensorLabel}>Sensor 1:</Text>
          <Text style={[styles.sensorValue, { color: item.sensor1 >= 60 ? COLORS.success : item.sensor1 >= 40 ? COLORS.warning : COLORS.danger }]}>
            {item.sensor1}%
          </Text>
        </View>
        <View style={styles.sensorRow}>
          <Text style={styles.sensorLabel}>Sensor 2:</Text>
          <Text style={[styles.sensorValue, { color: item.sensor2 >= 60 ? COLORS.success : item.sensor2 >= 40 ? COLORS.warning : COLORS.danger }]}>
            {item.sensor2}%
          </Text>
        </View>
        <View style={styles.sensorRow}>
          <Text style={styles.sensorLabel}>Sensor 3:</Text>
          <Text style={[styles.sensorValue, { color: item.sensor3 >= 60 ? COLORS.success : item.sensor3 >= 40 ? COLORS.warning : COLORS.danger }]}>
            {item.sensor3}%
          </Text>
        </View>
        <View style={[styles.sensorRow, { borderTopWidth: 1, borderTopColor: COLORS.lightGray, paddingTop: 8, marginTop: 8 }]}>
          <Text style={styles.sensorLabel}>Média:</Text>
          <Text style={[styles.sensorValue, { fontWeight: 'bold', color: item.media >= 60 ? COLORS.success : item.media >= 40 ? COLORS.warning : COLORS.danger }]}>
            {item.media}%
          </Text>
        </View>
      </View>
    </View>
  );

  const renderizarItemBomba = (item) => (
    <View style={[styles.itemCard, { ...SHADOWS.light }]}>
      <View style={styles.itemHeader}>
        <View style={[styles.iconBox, { backgroundColor: item.ligada ? COLORS.dangerLight : COLORS.successLight }]}>
          <MaterialCommunityIcons
            name="pump"
            size={24}
            color={item.ligada ? COLORS.danger : COLORS.success}
          />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>
            Bomba {item.ligada ? 'Ligada' : 'Desligada'}
          </Text>
          <Text style={styles.itemTime}>{formatarData(item.timestamp)}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: item.ligada ? COLORS.danger : COLORS.success }]}>
          <Text style={styles.badgeText}>
            {item.ligada ? 'ON' : 'OFF'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    if (item.tipo === 'sensor') {
      return renderizarItemSensor(item);
    } else if (item.tipo === 'bomba') {
      return renderizarItemBomba(item);
    }
    return null;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando histórico...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={historicoFiltrado}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <>
            <Header
              title="Histórico de Eventos 📋"
              subtitle="Todas as ações registradas"
            />

            {/* Filtros */}
            <View style={styles.filterContainer}>
              <View style={styles.filterButtons}>
                {[
                  { id: 'todos', label: 'Todos', icon: 'all-inclusive' },
                  { id: 'sensor', label: 'Sensores', icon: 'water' },
                  { id: 'bomba', label: 'Bomba', icon: 'pump' },
                ].map((filtro) => (
                  <TouchableOpacity
                    key={filtro.id}
                    style={[
                      styles.filterButton,
                      filtroTipo === filtro.id && styles.filterButtonActive,
                    ]}
                    onPress={() => setFiltroTipo(filtro.id)}
                  >
                    <MaterialCommunityIcons
                      name={filtro.icon}
                      size={16}
                      color={
                        filtroTipo === filtro.id ? COLORS.white : COLORS.primary
                      }
                    />
                    <Text
                      style={[
                        styles.filterButtonText,
                        filtroTipo === filtro.id && styles.filterButtonTextActive,
                      ]}
                    >
                      {filtro.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Info */}
            <View style={[styles.infoBox, { ...SHADOWS.light }]}>
              <MaterialCommunityIcons
                name="information"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.infoText}>
                Total de {historicoFiltrado.length} evento(s)
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="inbox"
              size={60}
              color={COLORS.lightGray}
            />
            <Text style={styles.emptyText}>Nenhum evento registrado</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
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
    padding: SIZES.padding,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.secondary,
  },
  filterContainer: {
    marginVertical: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radius - 2,
    backgroundColor: COLORS.white,
    gap: 4,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.radius,
    padding: 12,
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  itemCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  itemTime: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  itemContent: {
    marginTop: 12,
  },
  sensorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  sensorLabel: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  sensorValue: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.secondary,
    marginTop: 12,
  },
});

export default HistoricoScreen;
