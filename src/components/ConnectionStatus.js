import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../styles/theme';

const ConnectionStatus = ({ status = 'connected', message = null }) => {
  const [animatedValue] = useState(new Animated.Value(1));

  useEffect(() => {
    if (status === 'connecting') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      animatedValue.setValue(1);
    }
  }, [status, animatedValue]);

  const getStatusConfig = () => {
    const configs = {
      connected: {
        backgroundColor: COLORS.successLight,
        borderColor: COLORS.success,
        textColor: COLORS.success,
        icon: 'wifi',
        label: 'Conectado',
      },
      connecting: {
        backgroundColor: COLORS.warningLight,
        borderColor: COLORS.warning,
        textColor: COLORS.warning,
        icon: 'wifi-strength-2',
        label: 'Conectando...',
      },
      disconnected: {
        backgroundColor: COLORS.dangerLight,
        borderColor: COLORS.danger,
        textColor: COLORS.danger,
        icon: 'wifi-off',
        label: 'Desconectado',
      },
      error: {
        backgroundColor: COLORS.dangerLight,
        borderColor: COLORS.danger,
        textColor: COLORS.danger,
        icon: 'alert-circle',
        label: 'Erro de conexão',
      },
    };

    return configs[status] || configs.disconnected;
  };

  const config = getStatusConfig();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          opacity: status === 'connecting' ? animatedValue : 1,
        },
      ]}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons
          name={config.icon}
          size={16}
          color={config.textColor}
          style={{ marginRight: SIZES.sm }}
        />
        <Text style={[styles.label, { color: config.textColor }]}>
          {message || config.label}
        </Text>
      </View>

      {/* Ponto de status animado */}
      <View style={[styles.statusDot, { backgroundColor: config.textColor }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.borderRadiusSmall,
    borderWidth: 1,
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '500',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: SIZES.md,
  },
});

export default ConnectionStatus;
