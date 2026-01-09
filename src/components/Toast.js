import React, { useState, useEffect } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../styles/theme';

// Singleton para gerenciar toasts globalmente
let toastCallbacks = [];

export const showToast = (message, type = 'info', duration = 3000) => {
  const toastId = Math.random();
  const toastData = { message, type, duration, id: toastId };
  
  toastCallbacks.forEach(cb => cb(toastData));
  
  return toastId;
};

export const hideToast = (toastId) => {
  // Implementar se necessário
};

const Toast = () => {
  const [toasts, setToasts] = useState([]);
  const [animatedValues] = useState({});

  useEffect(() => {
    const handleShowToast = (toastData) => {
      const { id, duration } = toastData;
      const animValue = new Animated.Value(0);
      animatedValues[id] = animValue;

      // Fade in
      Animated.timing(animValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Adicionar toast à lista
      setToasts(prev => [...prev, toastData]);

      // Auto-dismiss
      if (duration > 0) {
        setTimeout(() => {
          Animated.timing(animValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
            delete animatedValues[id];
          });
        }, duration);
      }
    };

    toastCallbacks.push(handleShowToast);

    return () => {
      toastCallbacks = toastCallbacks.filter(cb => cb !== handleShowToast);
    };
  }, [animatedValues]);

  return (
    <>
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          {...toast}
          animatedValue={animatedValues[toast.id]}
          onClose={() => {
            setToasts(prev => prev.filter(t => t.id !== toast.id));
            delete animatedValues[toast.id];
          }}
        />
      ))}
    </>
  );
};

const ToastNotification = ({ message, type, id, animatedValue, onClose }) => {
  const getTypeConfig = () => {
    const configs = {
      success: {
        backgroundColor: COLORS.success,
        icon: 'check-circle',
        borderColor: COLORS.success,
      },
      error: {
        backgroundColor: COLORS.danger,
        icon: 'alert-circle',
        borderColor: COLORS.danger,
      },
      warning: {
        backgroundColor: COLORS.warning,
        icon: 'alert',
        borderColor: COLORS.warning,
      },
      info: {
        backgroundColor: COLORS.primary,
        icon: 'information',
        borderColor: COLORS.primary,
      },
    };

    return configs[type] || configs.info;
  };

  const config = getTypeConfig();
  const screenHeight = Dimensions.get('window').height;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
        },
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        style={[
          styles.toast,
          {
            backgroundColor: config.backgroundColor,
            borderLeftColor: config.borderColor,
          },
        ]}
        activeOpacity={0.8}
        onPress={onClose}
      >
        <MaterialCommunityIcons
          name={config.icon}
          size={24}
          color={COLORS.white}
          style={{ marginRight: SIZES.md }}
        />
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <MaterialCommunityIcons
            name="close"
            size={20}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.md,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.borderRadiusSmall,
    borderLeftWidth: 4,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    flex: 1,
    fontSize: SIZES.fontSize.md,
    color: COLORS.white,
    fontWeight: '500',
  },
  closeButton: {
    padding: SIZES.sm,
    marginLeft: SIZES.sm,
  },
});

export default Toast;
