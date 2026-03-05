import React, { useEffect, useState } from 'react';
import { View, StatusBar as RNStatusBar, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { registrarNotificacoes, setupNotificationListener } from './src/services/notificationService';

// Telas
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import SensoresScreen from './src/screens/SensoresScreen';
import ConfigScreen from './src/screens/ConfigScreen';

// Componentes
import Toast from './src/components/Toast';
import { AppProvider } from './src/contexts/AppContext';

// Tema
import { COLORS } from './src/styles/theme';

const Stack = createStackNavigator();

const defaultScreenOptions = {
  headerShown: false,
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught:', error.toString());
    console.log('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: COLORS.background }}>
          <MaterialCommunityIcons name="alert-circle" size={60} color={COLORS.danger} />
          <Text style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold', color: COLORS.text, textAlign: 'center' }}>
            Erro ao renderizar aplicativo
          </Text>
          <Text style={{ marginTop: 10, fontSize: 14, color: COLORS.secondary, textAlign: 'center' }}>
            {this.state.error?.message || 'Erro desconhecido'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

// Navigation Stack Simples - O que funciona!
function AppNavigator({ onLogout }) {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen 
        name="HomeTab"
        component={HomeScreen}
        options={{ 
          title: 'Home',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="SensoresTab"
        component={SensoresScreen}
        options={{ 
          title: 'Sensores',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="ConfigTab"
        component={ConfigScreen}
        options={{ 
          title: 'Configurações',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="ProfileTab"
        options={{ 
          title: 'Perfil',
          headerShown: false,
        }}
      >
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// App Principal
export default function App() {
  const user = { name: 'Usuario Local' }; // Mock user
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Registra notificações com tratamento para SDK 53+
    try {
      registrarNotificacoes();
      setupNotificationListener((notification) => {
        console.log('Notificação recebida:', notification);
      });
    } catch (error) {
      // Push notifications may not be available in Expo Go SDK 53+
      console.log('Notificações não disponíveis neste ambiente:', error.message);
    }

    // Define status bar Android
    RNStatusBar.setBarStyle('light-content');
    RNStatusBar.setBackgroundColor(COLORS.primary);
  }, []);

  if (showSplash) {
    return (
      <ErrorBoundary>
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
          <SplashScreen onFinish={() => setShowSplash(false)} />
        </View>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <AppProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" translucent />
          {user ? (
            <>
              <AppNavigator onLogout={() => {
                /* setUser(null); */
              }} />
              <Toast />
            </>
          ) : (
            <Stack.Navigator screenOptions={defaultScreenOptions}>
              {/* Auth removed - using local user */}
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </AppProvider>
    </ErrorBoundary>
  );
}
