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
import { COLORS, SIZES, FONTS } from '../styles/theme';

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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.xl,
    padding: SIZES.lg,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.sm,
    textAlign: 'center',
  },
  message: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginBottom: SIZES.lg,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SIZES.md,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.border,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    ...FONTS.button,
    color: COLORS.text,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  confirmButtonText: {
    ...FONTS.button,
    color: COLORS.white,
  },
});

export default ConfirmDialog;
