// Importar Firebase com verificação
let ref, push, query, limitToLast, onValue, onAuthStateChanged;
let database, auth;

try {
  const firebaseDb = require('firebase/database');
  ref = firebaseDb.ref;
  push = firebaseDb.push;
  query = firebaseDb.query;
  limitToLast = firebaseDb.limitToLast;
  onValue = firebaseDb.onValue;
  
  const firebaseAuth = require('firebase/auth');
  onAuthStateChanged = firebaseAuth.onAuthStateChanged;
  
  const firebaseConfig = require('../config/firebase');
  database = firebaseConfig.database;
  auth = firebaseConfig.auth;
} catch (error) {
  console.warn('Firebase services not available:', error.message);
}

// Salvar leitura de sensor no histórico
export const salvarLeituraSensor = async (sensor1, sensor2, sensor3, media) => {
  try {
    if (!database || !auth) {
      console.log('Firebase não configurado');
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.log('Usuário não autenticado - leitura não será salva');
      return;
    }

    const timestamp = new Date().toISOString();
    const historico = {
      tipo: 'sensor',
      sensor1,
      sensor2,
      sensor3,
      media,
      timestamp,
    };

    await push(ref(database, `usuarios/${userId}/historico`), historico);
    console.log('✅ Leitura salva com sucesso');
  } catch (error) {
    console.error('❌ Erro ao salvar leitura:', error);
  }
};

// Salvar acionamento de bomba no histórico
export const salvarAcionamentoBomba = async (ligada) => {
  try {
    if (!database || !auth) {
      console.log('Firebase não configurado');
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');

    const timestamp = new Date().toISOString();
    const historico = {
      tipo: 'bomba',
      ligada,
      timestamp,
    };

    await push(ref(database, `usuarios/${userId}/historico`), historico);
    console.log(`✅ Bomba ${ligada ? 'ligada' : 'desligada'} salva no histórico`);
  } catch (error) {
    console.error('❌ Erro ao salvar acionamento:', error);
  }
};

// Buscar últimas N leituras do histórico
export const buscarHistorico = (callback, limite = 50) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');

    const q = query(
      ref(database, `usuarios/${userId}/historico`),
      limitToLast(limite)
    );

    return onValue(q, (snapshot) => {
      if (snapshot.exists()) {
        const dados = [];
        snapshot.forEach((child) => {
          dados.unshift(child.val()); // Adiciona no início para manter ordem
        });
        callback(dados);
      } else {
        callback([]);
      }
    });
  } catch (error) {
    console.error('❌ Erro ao buscar histórico:', error);
    callback([]);
  }
};

// Salvar configurações do usuário
export const salvarConfiguracoes = async (config) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');

    await push(ref(database, `usuarios/${userId}/configuracoes`), {
      ...config,
      dataSalva: new Date().toISOString(),
    });
    console.log('✅ Configurações salvas');
  } catch (error) {
    console.error('❌ Erro ao salvar configurações:', error);
  }
};

// Deletar usuário e dados
export const deletarConta = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');

    // Deletar dados do Firebase
    await ref(database, `usuarios/${userId}`).remove();
    
    // Deletar conta do Auth
    await auth.currentUser.delete();
    
    console.log('✅ Conta deletada com sucesso');
  } catch (error) {
    console.error('❌ Erro ao deletar conta:', error);
    throw error;
  }
};

// Listener para mudanças de estado de autenticação
export const subscribeToAuthState = (callback) => {
  if (!auth || !onAuthStateChanged) {
    console.warn('Firebase Auth not available');
    callback(null);
    return () => {};
  }

  try {
    return onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? `User: ${user.uid}` : 'No user');
      callback(user);
    });
  } catch (error) {
    console.error('❌ Erro ao se inscrever em mudanças de Auth:', error);
    callback(null);
    return () => {};
  }
};
