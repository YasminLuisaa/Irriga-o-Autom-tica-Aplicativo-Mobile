import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, SHADOWS, TYPOGRAPHY } from '../styles/theme';

const Header = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <View style={styles.gradient}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.lg,
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.md,
    ...SHADOWS.medium,
  },
  gradient: {
    paddingVertical: SIZES.sm,
  },
  title: {
    fontSize: SIZES.fontSize.xxl,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SIZES.xs,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: SIZES.fontSize.md,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

export default Header;
