import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configurar notificações com tratamento de erro
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
} catch (error) {
  console.warn('Erro ao configurar handler de notificações:', error.message);
}

// Registrar push notifications com suporte para SDK 53+
export const registrarNotificacoes = async () => {
  try {
    // Em Expo Go SDK 53+, push notifications remotas não são suportadas
    // Esta função continuará funcionando mas com limitações
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permissão de notificação negada');
      return;
    }

    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      } catch (channelError) {
        console.log('Erro ao criar canal de notificação (esperado em Expo Go):', channelError.message);
      }
    }

    console.log('✅ Notificações registradas');
  } catch (error) {
    // Push notifications may not be fully available in Expo Go SDK 53+
    console.log('⚠️ Limitação de notificações em Expo Go:', error.message);
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
