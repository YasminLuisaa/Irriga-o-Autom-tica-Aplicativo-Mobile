import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence, connectAuthEmulator } from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ IMPORTANTE: Substitua com suas credenciais do Firebase
// Obtenha em: https://console.firebase.google.com/
// Clique em ⚙️ Settings → Project Settings → Web
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDU1234567890123456789012345678901",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "irrigacao-teste.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "irrigacao-teste",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "irrigacao-teste.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890",
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || "https://irrigacao-teste.firebaseio.com"
};

// Inicializa Firebase
let app;
const apps = getApps();

if (apps.length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}

// Inicializa serviços com tratamento de erro
let auth;
let database;

try {
  // Tenta inicializar com persistência
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  console.log('✅ Auth inicializado com AsyncStorage');
} catch (error) {
  // Se falhar (ex: já foi inicializado), usa getAuth
  try {
    auth = getAuth(app);
    console.log('✅ Auth inicializado com getAuth');
  } catch (fallbackError) {
    console.error('❌ Erro ao inicializar Auth:', fallbackError);
    auth = null;
  }
}

try {
  database = getDatabase(app);
  // Usar emulador em desenvolvimento (comentar em produção)
  // if (__DEV__) {
  //   connectDatabaseEmulator(database, 'localhost', 9000);
  // }
} catch (error) {
  console.error('Erro ao inicializar Database:', error);
}

export { auth, database };
export default app;
