import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../styles/theme';

const { width } = Dimensions.get('window');

const ConfirmDialog = ({
  visible,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  icon = 'alert-circle',
  type = 'warning', // 'warning', 'error', 'info', 'success'
  destructive = false,
}) => {
  const getIconColor = () => {
    if (destructive) return COLORS.danger;
    switch (type) {
      case 'error':
        return COLORS.danger;
      case 'success':
        return COLORS.success;
      case 'info':
        return COLORS.primary;
      default:
        return COLORS.warning;
    }
  };

  const getConfirmButtonColor = () => {
    return destructive ? COLORS.danger : COLORS.primary;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: `${getIconColor()}15` }]}>
            <MaterialCommunityIcons
              name={icon}
              size={48}
              color={getIconColor()}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: getConfirmButtonColor() },
              ]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
  },
  container: {
    width: '100%',
    maxWidth: width * 0.88,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusExtraLarge,
    padding: SIZES.xl,
    alignItems: 'center',
    ...SHADOWS.xl,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  title: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.sm,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  message: {
    fontSize: SIZES.fontSize.md,
    color: COLORS.textMuted,
    marginBottom: SIZES.xl,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SIZES.md,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: SIZES.lg,
    borderRadius: SIZES.borderRadiusLarge,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.borderLight,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: SIZES.fontSize.md,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSize.md,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default ConfirmDialog;
