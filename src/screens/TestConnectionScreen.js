import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';
import api from '../services/api';

const TestConnectionScreen = () => {
  const [logs, setLogs] = useState(['Teste de Conexão Iniciado...']);
  const [loading, setLoading] = useState(false);
  const [customIP, setCustomIP] = useState('192.168.0.6');

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const testarConexaoBasica = async () => {
    setLoading(true);
    addLog('🔍 Testando conexão básica...');

    try {
      const resultado = await api.testarConexao();
      if (resultado) {
        addLog('✅ Conexão básica: SUCESSO');
      } else {
        addLog('❌ Conexão básica: FALHA');
      }
    } catch (error) {
      addLog(`❌ Erro: ${error.message}`);
    }
    setLoading(false);
  };

  const testarDados = async () => {
    setLoading(true);
    addLog('📊 Buscando dados...');

    try {
      const dados = await api.getDados();
      addLog('✅ Dados recebidos:');
      addLog(`   Sensor 1: ${dados.sensor1}`);
      addLog(`   Sensor 2: ${dados.sensor2}`);
      addLog(`   Sensor 3: ${dados.sensor3}`);
      addLog(`   Média: ${dados.media} (${dados.mediaPercent}%)`);
      addLog(`   Status: ${dados.statusSolo}`);
      addLog(`   Bomba: ${dados.bombaLigada ? 'LIGADA' : 'DESLIGADA'}`);
      addLog(`   Modo: ${dados.modoAutomatico ? 'AUTOMÁTICO' : 'MANUAL'}`);
    } catch (error) {
      addLog(`❌ Erro ao buscar dados: ${error.message}`);
    }
    setLoading(false);
  };

  const testarBomba = async () => {
    setLoading(true);
    addLog('💧 Testando comando de bomba...');

    try {
      const resultado = await api.controleBomba(true);
      addLog('✅ Comando enviado:');
      addLog(`   Resposta: ${JSON.stringify(resultado)}`);
      
      // Desligar após 2 segundos
      setTimeout(async () => {
        await api.controleBomba(false);
        addLog('✅ Bomba desligada automaticamente');
      }, 2000);
    } catch (error) {
      addLog(`❌ Erro ao controlar bomba: ${error.message}`);
    }
    setLoading(false);
  };

  const testarConfig = async () => {
    setLoading(true);
    addLog('⚙️ Testando configuração...');

    try {
      const resultado = await api.configurar(2800, true);
      addLog('✅ Configuração enviada:');
      addLog(`   Resposta: ${JSON.stringify(resultado)}`);
    } catch (error) {
      addLog(`❌ Erro ao configurar: ${error.message}`);
    }
    setLoading(false);
  };

  const alterarIP = async () => {
    if (!customIP.trim()) {
      Alert.alert('Erro', 'Digite um IP válido');
      return;
    }
    api.setESP32IP(customIP);
    addLog(`✅ IP alterado para: ${customIP}`);
  };

  const limparLogs = () => {
    setLogs(['Logs apagados...']);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="console"
          size={32}
          color={COLORS.primary}
        />
        <Text style={styles.title}>Teste de Conexão</Text>
      </View>

      <View style={styles.configSection}>
        <Text style={styles.configLabel}>IP do ESP32:</Text>
        <View style={styles.configRow}>
          <TextInput
            style={styles.ipInput}
            value={customIP}
            onChangeText={setCustomIP}
            placeholder="192.168.0.6"
          />
          <TouchableOpacity
            style={[styles.button, styles.buttonSmall]}
            onPress={alterarIP}
          >
            <Text style={styles.buttonText}>Alterar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonGrid}>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={testarConexaoBasica}
          disabled={loading}
        >
          <MaterialCommunityIcons
            name="wifi"
            size={24}
            color={COLORS.white}
          />
          <Text style={styles.buttonText}>Conexão</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSuccess]}
          onPress={testarDados}
          disabled={loading}
        >
          <MaterialCommunityIcons
            name="database"
            size={24}
            color={COLORS.white}
          />
          <Text style={styles.buttonText}>Dados</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonWarning]}
          onPress={testarBomba}
          disabled={loading}
        >
          <MaterialCommunityIcons
            name="water-pump"
            size={24}
            color={COLORS.white}
          />
          <Text style={styles.buttonText}>Bomba</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonInfo]}
          onPress={testarConfig}
          disabled={loading}
        >
          <MaterialCommunityIcons
            name="cog"
            size={24}
            color={COLORS.white}
          />
          <Text style={styles.buttonText}>Config</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Processando...</Text>
        </View>
      )}

      <View style={styles.logsContainer}>
        <View style={styles.logsHeader}>
          <Text style={styles.logsTitle}>📋 Logs</Text>
          <TouchableOpacity onPress={limparLogs}>
            <MaterialCommunityIcons
              name="delete"
              size={20}
              color={COLORS.danger}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.logsList}>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logItem}>
              {log}
            </Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: SIZES.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    gap: SIZES.md,
  },
  title: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  configSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.md,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.borderRadius,
    ...SHADOWS.light,
  },
  configLabel: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.textLight,
    marginBottom: SIZES.sm,
    fontWeight: '600',
  },
  configRow: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  ipInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadiusSmall,
    paddingHorizontal: SIZES.sm,
    fontSize: SIZES.fontSize.sm,
    color: COLORS.text,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.md,
    gap: SIZES.sm,
  },
  button: {
    flex: 0.48,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.sm,
    ...SHADOWS.light,
  },
  buttonSmall: {
    paddingVertical: SIZES.sm,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSuccess: {
    backgroundColor: COLORS.success,
  },
  buttonWarning: {
    backgroundColor: COLORS.warning,
  },
  buttonInfo: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md,
    gap: SIZES.sm,
  },
  loadingText: {
    color: COLORS.textLight,
    fontSize: SIZES.fontSize.sm,
  },
  logsContainer: {
    flex: 1,
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.md,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    ...SHADOWS.light,
    overflow: 'hidden',
  },
  logsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logsTitle: {
    fontWeight: '600',
    color: COLORS.text,
    fontSize: SIZES.fontSize.sm,
  },
  logsList: {
    flex: 1,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.sm,
  },
  logItem: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.text,
    paddingVertical: SIZES.xs,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});

export default TestConnectionScreen;
