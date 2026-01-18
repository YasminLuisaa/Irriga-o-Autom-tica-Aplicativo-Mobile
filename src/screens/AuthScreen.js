import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { showToast } from '../components/Toast';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';

const AuthScreen = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuthenticate = async () => {
    if (!email || !password) {
      showToast('❌ Preencha email e senha', 'error');
      return;
    }

    if (!isLogin && password !== passwordConfirm) {
      showToast('❌ Senhas não conferem', 'error');
      return;
    }

    setLoading(true);
    try {
      // Simulação de autenticação local (sem Firebase)
      setTimeout(() => {
        if (email && password.length >= 6) {
          showToast('✅ Acesso liberado!', 'success');
          onLoginSuccess();
        } else {
          showToast('❌ Erro na autenticação', 'error');
        }
        setLoading(false);
      }, 1000);
    } catch (error) {
      showToast('❌ Erro ao autenticar', 'error');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons
            name="water-percent"
            size={80}
            color={COLORS.primary}
          />
          <Text style={styles.appName}>IFSP Irrigação</Text>
          <Text style={styles.appSubtitle}>Birigui</Text>
        </View>

        {/* Formulário */}
        <View style={[styles.card, { ...SHADOWS.medium }]}>
          <Text style={styles.title}>
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </Text>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="email"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
          </View>

          {/* Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="lock"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={!password}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmar Senha (Cadastro) */}
          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="lock-check"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirme a senha"
                  value={passwordConfirm}
                  onChangeText={setPasswordConfirm}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
              </View>
            </View>
          )}

          {/* Botão Principal */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: loading ? COLORS.secondary : COLORS.primary }
            ]}
            onPress={handleAuthenticate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} size="large" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name={isLogin ? 'login' : 'account-plus'}
                  size={24}
                  color={COLORS.white}
                />
                <Text style={styles.buttonText}>
                  {isLogin ? 'Entrar' : 'Cadastrar'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Toggle Login/Cadastro */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsLogin(!isLogin);
                setEmail('');
                setPassword('');
                setPasswordConfirm('');
              }}
              disabled={loading}
            >
              <Text style={styles.toggleLink}>
                {isLogin ? 'Cadastrar' : 'Entrar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Informações */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons
            name="information"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.infoText}>
            Seus dados são seguros. Senha mínima de 6 caracteres.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: SIZES.padding,
    justifyContent: 'center',
    minHeight: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 16,
  },
  appSubtitle: {
    fontSize: 16,
    color: COLORS.secondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radius - 2,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  toggleText: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  toggleLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.radius,
    padding: 12,
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.primary,
  },
});

export default AuthScreen;
