import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Telas
import HomeScreen from './src/screens/HomeScreen';
import SensoresScreen from './src/screens/SensoresScreen';
import HistoricoScreen from './src/screens/HistoricoScreen';
import ConfigScreen from './src/screens/ConfigScreen';

// Componentes
import Toast from './src/components/Toast';

// Tema
import { COLORS } from './src/styles/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const defaultScreenOptions = {
  headerShown: false,
};

// Stacks
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="HomeStack" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function SensoresStack() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="SensoresStack" component={SensoresScreen} />
    </Stack.Navigator>
  );
}

function HistoricoStack() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="HistoricoStack" component={HistoricoScreen} />
    </Stack.Navigator>
  );
}

function ConfigStack() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="ConfigStack" component={ConfigScreen} />
    </Stack.Navigator>
  );
}

// Bottom Tabs Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 4,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Sensores') {
            iconName = 'water';
          } else if (route.name === 'Historico') {
            iconName = 'chart-line';
          } else if (route.name === 'Config') {
            iconName = 'cog';
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Sensores"
        component={SensoresStack}
        options={{ tabBarLabel: 'Sensores' }}
      />
      <Tab.Screen
        name="Historico"
        component={HistoricoStack}
        options={{ tabBarLabel: 'Histórico' }}
      />
      <Tab.Screen
        name="Config"
        component={ConfigStack}
        options={{ tabBarLabel: 'Config' }}
      />
    </Tab.Navigator>
  );
}

// App Principal
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <TabNavigator />
      <Toast />
    </NavigationContainer>
  );
}
