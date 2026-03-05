import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurar notificações com tratamento de erro
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  console.log('✅ Notificações locais habilitadas');
} catch (error) {
  console.warn('⚠️ Erro ao configurar handler de notificações:', error.message);
}

// Função auxiliar para salvar notificações no histórico
const salvarNoHistorico = async (titulo, mensagem, tipo) => {
  try {
    const dados = await AsyncStorage.getItem('historicoNotificacoes');
    const historico = dados ? JSON.parse(dados) : [];
    
    historico.push({
      titulo,
      mensagem,
      tipo,
      timestamp: new Date().toISOString(),
    });
    
    // Manter apenas últimas 50 notificações
    if (historico.length > 50) {
      historico.shift();
    }
    
    await AsyncStorage.setItem('historicoNotificacoes', JSON.stringify(historico));
  } catch (error) {
    console.warn('⚠️ Erro ao salvar notificação no histórico:', error.message);
  }
};

// Registrar notificações locais
// Nota: Este app usa apenas notificações locais (não requer push remoto)
// Push notifications remotas necessitam de um development build
export const registrarNotificacoes = async () => {
  try {
    // Solicitar permissões para notificações locais
    let finalStatus = 'granted';
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      } else {
        finalStatus = existingStatus;
      }
    } catch (permError) {
      console.log('⚠️ Não foi possível solicitar permissões de notificação:', permError.message);
      finalStatus = 'granted';
    }

    if (finalStatus === 'denied') {
      console.log('⚠️ Permissão de notificação negada');
      return false;
    }

    // Configurar canal Android
    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
        console.log('✅ Canal de notificação Android configurado');
      } catch (channelError) {
        console.warn('⚠️ Erro ao configurar canal de notificação:', channelError.message);
      }
    }

    console.log('✅ Notificações locais habilitadas');
    return true;
  } catch (error) {
    console.warn('⚠️ Erro ao configurar notificações:', error.message);
    return false;
  }
};

// Notificar quando planta está seca
export const notificarSoloSeco = async (sensorInfo) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚨 Planta Seca!',
        body: `${sensorInfo} está com solo seco. Bomba acionada automaticamente!`,
        data: { tipo: 'solo-seco', info: sensorInfo },
        sound: 'default',
        badge: 1,
      },
      trigger: null, // Imediato
    });
    console.log('✅ Notificação enviada: Solo Seco');
  } catch (error) {
    console.error('❌ Erro ao enviar notificação:', error);
  }
};

// Notificar quando planta está úmida novamente
export const notificarSoloUmido = async (sensorInfo) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Solo Úmido',
        body: `${sensorInfo} está com solo úmido. Bomba desligada.`,
        data: { tipo: 'solo-umido', info: sensorInfo },
        sound: 'default',
        badge: 0,
      },
      trigger: null, // Imediato
    });
    console.log('✅ Notificação enviada: Solo Úmido');
  } catch (error) {
    console.error('❌ Erro ao enviar notificação:', error);
  }
};

// Notificar quando bomba é acionada manualmente
export const notificarBombaAcionada = async (ligada) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Bomba ' + (ligada ? 'Ligada' : 'Desligada'),
        body: `Modo manual: Bomba foi ${ligada ? 'ligada' : 'desligada'}.`,
        data: { tipo: 'bomba-manual', ligada },
        sound: 'default',
      },
      trigger: null, // Imediato
    });
    console.log(`✅ Notificação enviada: Bomba ${ligada ? 'Ligada' : 'Desligada'}`);
  } catch (error) {
    console.error('❌ Erro ao enviar notificação:', error);
  }
};

// Listener para notificações recebidas
export const setupNotificationListener = (callback) => {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      callback(response.notification.request.content.data);
    }
  );

  return subscription;
};
