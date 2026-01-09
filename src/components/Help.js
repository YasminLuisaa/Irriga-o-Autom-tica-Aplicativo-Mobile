import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';

const HelpTooltip = ({ text, position = 'top' }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => setVisible(true)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialCommunityIcons
          name="water"
          size={18}
          color={COLORS.textLight}
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={[styles.tooltip, SHADOWS.medium]}>
            <View style={styles.tooltipHeader}>
              <Text style={styles.tooltipTitle}>Informação</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color={COLORS.text}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.tooltipText}>{text}</Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const HelpModal = ({ visible, onClose, title, sections }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, SHADOWS.light]}>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {sections.map((section, index) => (
            <View key={index} style={styles.section}>
              {section.icon && (
                <View style={styles.sectionIconContainer}>
                  <MaterialCommunityIcons
                    name={section.icon}
                    size={32}
                    color={COLORS.primary}
                  />
                </View>
              )}

              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionDescription}>
                {section.description}
              </Text>

              {section.tips && (
                <View style={styles.tipsList}>
                  {section.tips.map((tip, tipIndex) => (
                    <View key={tipIndex} style={styles.tipItem}>
                      <View style={styles.tipDot} />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Footer com informações */}
        <View style={[styles.footer, SHADOWS.light]}>
          <MaterialCommunityIcons
            name="lightbulb-on"
            size={20}
            color={COLORS.warning}
          />
          <Text style={styles.footerText}>
            Dica: Toque em ícones com gota de água para mais informações
          </Text>
        </View>
      </View>
    </Modal>
  );
};

// Componente para input com validação
const ValidatedInput = ({
  label,
  value,
  onChangeText,
  error,
  help,
  placeholder,
  keyboardType = 'default',
}) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {help && (
          <TouchableOpacity onPress={() => setShowHelp(!showHelp)}>
            <MaterialCommunityIcons
              name="help-circle-outline"
              size={16}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        )}
      </View>

      {showHelp && help && (
        <View style={styles.helpBox}>
          <MaterialCommunityIcons
            name="information"
            size={16}
            color={COLORS.primary}
          />
          <Text style={styles.helpText}>{help}</Text>
        </View>
      )}

      <View
        style={[
          styles.inputBox,
          {
            borderColor: error ? COLORS.danger : COLORS.border,
            backgroundColor: error ? COLORS.dangerLight : COLORS.white,
          },
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor={COLORS.textLighter}
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={14}
            color={COLORS.danger}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

// Estado do sistema com ícone
const SystemStatus = ({ label, value, icon, color = COLORS.primary }) => (
  <View style={styles.statusItem}>
    <View style={[styles.statusIcon, { backgroundColor: `${color}20` }]}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
    </View>
    <View style={styles.statusInfo}>
      <Text style={styles.statusLabel}>{label}</Text>
      <Text style={styles.statusValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  // HelpTooltip styles
  helpButton: {
    padding: SIZES.sm,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltip: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusMedium,
    marginHorizontal: SIZES.lg,
    padding: SIZES.md,
    maxWidth: 300,
  },
  tooltipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  tooltipTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  tooltipText: {
    fontSize: SIZES.fontSize.md,
    color: COLORS.textLight,
    lineHeight: 20,
  },

  // HelpModal styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    padding: SIZES.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  section: {
    marginBottom: SIZES.xl,
  },
  sectionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  sectionDescription: {
    fontSize: SIZES.fontSize.md,
    color: COLORS.textLight,
    lineHeight: 22,
    marginBottom: SIZES.md,
  },
  tipsList: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.borderRadiusSmall,
    padding: SIZES.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.sm,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 8,
    marginRight: SIZES.md,
  },
  tipText: {
    flex: 1,
    fontSize: SIZES.fontSize.sm,
    color: COLORS.text,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SIZES.md,
  },
  footerText: {
    flex: 1,
    fontSize: SIZES.fontSize.sm,
    color: COLORS.textLight,
    fontWeight: '500',
  },

  // ValidatedInput styles
  inputContainer: {
    marginBottom: SIZES.lg,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  label: {
    fontSize: SIZES.fontSize.md,
    fontWeight: '500',
    color: COLORS.text,
  },
  helpBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.borderRadiusSmall,
    marginBottom: SIZES.sm,
    gap: SIZES.sm,
  },
  helpText: {
    flex: 1,
    fontSize: SIZES.fontSize.sm,
    color: COLORS.primary,
    lineHeight: 18,
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: SIZES.borderRadiusSmall,
    paddingHorizontal: SIZES.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: SIZES.md,
    fontSize: SIZES.fontSize.md,
    color: COLORS.text,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.sm,
    gap: SIZES.sm,
  },
  errorText: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.danger,
    fontWeight: '500',
  },

  // SystemStatus styles
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusSmall,
    marginBottom: SIZES.md,
    gap: SIZES.md,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: SIZES.fontSize.lg,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: SIZES.xs,
  },
});

export { HelpTooltip, HelpModal, ValidatedInput, SystemStatus };
