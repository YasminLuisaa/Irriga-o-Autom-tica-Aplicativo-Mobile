import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';

const SensorCard = ({ name, value, status, icon = 'water' }) => {
  const isWet = status === 'ÚMIDO';
  const statusColor = isWet ? COLORS.success : COLORS.danger;
  const statusBgColor = isWet ? COLORS.successLight : COLORS.dangerLight;
  
  return (
    <View style={[styles.container, { ...SHADOWS.light }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: statusBgColor }]}>
          <MaterialCommunityIcons 
            name={icon} 
            size={28} 
            color={statusColor}
          />
        </View>
        <Text style={styles.name}>{name}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.value}>{value}%</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <MaterialCommunityIcons
            name={isWet ? 'check-circle' : 'alert-circle'}
            size={14}
            color={COLORS.white}
            style={{ marginRight: SIZES.xs }}
          />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.md,
    marginVertical: SIZES.sm,
    marginHorizontal: SIZES.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: SIZES.borderRadiusMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  name: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  content: {
    alignItems: 'flex-start',
  },
  value: {
    fontSize: SIZES.fontSize.xxxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.sm,
    letterSpacing: -0.5,
  },
  statusBadge: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.borderRadiusSmall,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: COLORS.white,
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
  },
});

export default SensorCard;
