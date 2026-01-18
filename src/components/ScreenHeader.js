import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';

const ScreenHeader = ({ currentScreen, navigation }) => {
  const screens = [
    { name: 'HomeTab', label: 'Home', icon: 'home' },
    { name: 'SensoresTab', label: 'Sensores', icon: 'water' },
    { name: 'HistoricoTab', label: 'Histórico', icon: 'chart-line' },
    { name: 'ConfigTab', label: 'Config', icon: 'cog' },
    { name: 'ProfileTab', label: 'Perfil', icon: 'account' },
  ];

  const handleNavigation = (screenName) => {
    // Se já está na tela, não navega
    if (currentScreen === screenName) return;
    
    // Navega para a tela
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {screens.map((screen) => (
          <TouchableOpacity
            key={screen.name}
            style={[
              styles.tabButton,
              currentScreen === screen.name && styles.tabButtonActive,
            ]}
            onPress={() => handleNavigation(screen.name)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={screen.icon}
              size={20}
              color={currentScreen === screen.name ? COLORS.primary : COLORS.textLight}
            />
            <Text
              style={[
                styles.tabLabel,
                currentScreen === screen.name && styles.tabLabelActive,
              ]}
            >
              {screen.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    ...SHADOWS.light,
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding / 2,
    paddingVertical: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: SIZES.radius,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primaryLight,
  },
  tabLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default ScreenHeader;
