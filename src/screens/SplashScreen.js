import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../styles/theme';

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    // Animar durante 2.5 segundos antes de ir para a próxima tela
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* Gradiente de fundo */}
      <View style={styles.background} />
      
      {/* Logo com animação */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons
            name="water-percent"
            size={80}
            color={COLORS.primary}
          />
        </View>
      </View>

      {/* Texto principal */}
      <Text style={styles.appName}>IFSP Irrigação</Text>
      <Text style={styles.appSubtitle}>Birigui</Text>

      {/* Frase descritiva */}
      <Text style={styles.tagline}>Irrigação Automática Inteligente</Text>

      {/* Loading indicator */}
      <View style={styles.loadingContainer}>
        <View style={[styles.loadingBar, { width: '0%' }]} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>IFSP Campus Birigui</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: 18,
    color: COLORS.secondary,
    marginBottom: 20,
    fontWeight: '600',
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 60,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  loadingContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 60,
  },
  loadingBar: {
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginBottom: 12,
    width: '60%',
  },
  loadingText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    fontSize: 12,
    color: COLORS.textLight,
  },
});

export default SplashScreen;
