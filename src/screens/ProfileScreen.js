import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { showToast } from '../components/Toast';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';

const ProfileScreen = ({ onLogout }) => {
  const [loading, setLoading] = useState(false);
  
  // Dados simulados (sem Firebase)
  const user = {
    displayName: 'Usuário Local',
    email: 'usuario@local.app',
    uid: 'local_user'
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirmar logout',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: async () => {
            try {
              setLoading(true);
              setTimeout(() => {
                showToast('✅ Logout realizado com sucesso!', 'success');
                onLogout();
              }, 500);
            } catch (error) {
              showToast('❌ Erro ao fazer logout', 'error');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Deletar Conta',
      'Essa ação é irreversível e deletará todos seus dados e histórico.',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              setLoading(true);
              setTimeout(() => {
                showToast('✅ Conta deletada com sucesso!', 'success');
                onLogout();
              }, 500);
            } catch (error) {
              showToast('❌ Erro ao deletar conta', 'error');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { ...SHADOWS.light }]}>
            <MaterialCommunityIcons
              name="account-circle"
              size={80}
              color={COLORS.primary}
            />
          </View>
        </View>

        {/* Informações do Usuário */}
        <View style={[styles.card, { ...SHADOWS.light }]}>
          <Text style={styles.sectionTitle}>Informações da Conta</Text>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="email"
              size={20}
              color={COLORS.primary}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || 'Não informado'}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="account"
              size={20}
              color={COLORS.primary}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>{user?.displayName || 'Não definido'}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="clock"
              size={20}
              color={COLORS.primary}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Conta Criada em</Text>
              <Text style={styles.infoValue}>15/01/2026</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="shield-check"
              size={20}
              color={COLORS.success}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email Verificado</Text>
              <Text style={[styles.infoValue, { 
                color: COLORS.success 
              }]}>
                ✓ Verificado
              </Text>
            </View>
          </View>
        </View>

        {/* Preferências */}
        <View style={[styles.card, { ...SHADOWS.light }]}>
          <Text style={styles.sectionTitle}>Preferências</Text>

          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons
              name="bell"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.menuText}>Notificações</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={COLORS.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons
              name="palette"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.menuText}>Tema</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={COLORS.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons
              name="language"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.menuText}>Idioma</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={COLORS.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Suporte */}
        <View style={[styles.card, { ...SHADOWS.light }]}>
          <Text style={styles.sectionTitle}>Suporte</Text>

          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons
              name="help-circle"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.menuText}>Ajuda e FAQ</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={COLORS.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons
              name="file-document"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.menuText}>Termos de Uso</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={COLORS.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons
              name="shield-account"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.menuText}>Privacidade</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={COLORS.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Ações */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <MaterialCommunityIcons
                name="logout"
                size={20}
                color={COLORS.white}
              />
              <Text style={styles.logoutText}>Fazer Logout</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
          disabled={loading}
        >
          <MaterialCommunityIcons
            name="delete"
            size={20}
            color={COLORS.white}
          />
          <Text style={styles.deleteText}>Deletar Conta</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Versão 1.0.0 • IFSP Irrigação Birigui</Text>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  avatarContainer: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 50,
    padding: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    gap: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.warning,
    borderRadius: SIZES.radius,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.danger,
    borderRadius: SIZES.radius,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
    gap: 8,
  },
  deleteText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.secondary,
    marginBottom: 16,
  },
});

export default ProfileScreen;
