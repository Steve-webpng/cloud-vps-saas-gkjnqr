
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useVPSStore } from '@/stores/vpsStore';
import { useRouter } from 'expo-router';
import { isGeminiConfigured, isStripeConfigured } from '@/config/apiConfig';

export default function SettingsScreen() {
  const { user } = useVPSStore();
  const router = useRouter();

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing coming soon!');
  };

  const handleManageBilling = () => {
    Alert.alert('Manage Billing', 'Billing management coming soon!');
  };

  const handleAPIKeys = () => {
    const geminiStatus = isGeminiConfigured() ? '✓ Connected' : '✗ Not configured';
    const stripeStatus = isStripeConfigured() ? '✓ Connected' : '✗ Not configured';
    
    Alert.alert(
      'API Configuration',
      `Gemini AI: ${geminiStatus}\nStripe Payments: ${stripeStatus}`,
      [{ text: 'OK' }]
    );
  };

  const handleSecurity = () => {
    Alert.alert('Security', 'Security settings coming soon!');
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'Notification settings coming soon!');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Contact support at support@vpsplatform.com');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logged out') },
      ]
    );
  };

  const handleAIAssistant = () => {
    router.push('/ai-assistant');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <IconSymbol name="person.circle.fill" size={64} color={colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
            <Pressable style={styles.editButton} onPress={handleEditProfile}>
              <IconSymbol name="pencil" size={20} color={colors.primary} />
            </Pressable>
          </View>
        </View>

        {/* AI Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Features</Text>
          
          <Pressable style={styles.settingItem} onPress={handleAIAssistant}>
            <View style={styles.settingIcon}>
              <IconSymbol name="sparkles" size={24} color={colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>AI Assistant</Text>
              <Text style={styles.settingDescription}>
                Get AI-powered help and recommendations
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          {isGeminiConfigured() && (
            <View style={styles.statusBadge}>
              <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
              <Text style={styles.statusText}>Gemini AI Active</Text>
            </View>
          )}
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <Pressable style={styles.settingItem} onPress={handleManageBilling}>
            <View style={styles.settingIcon}>
              <IconSymbol name="creditcard.fill" size={24} color={colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Billing & Payments</Text>
              <Text style={styles.settingDescription}>
                Manage payment methods and invoices
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          {isStripeConfigured() && (
            <View style={styles.statusBadge}>
              <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
              <Text style={styles.statusText}>Stripe Connected</Text>
            </View>
          )}

          <Pressable style={styles.settingItem} onPress={handleAPIKeys}>
            <View style={styles.settingIcon}>
              <IconSymbol name="key.fill" size={24} color={colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>API Configuration</Text>
              <Text style={styles.settingDescription}>
                View API connection status
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.settingItem} onPress={handleSecurity}>
            <View style={styles.settingIcon}>
              <IconSymbol name="lock.shield.fill" size={24} color={colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Security</Text>
              <Text style={styles.settingDescription}>
                Password, 2FA, and security settings
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <Pressable style={styles.settingItem} onPress={handleNotifications}>
            <View style={styles.settingIcon}>
              <IconSymbol name="bell.fill" size={24} color={colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Manage notification preferences
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <Pressable style={styles.settingItem} onPress={handleSupport}>
            <View style={styles.settingIcon}>
              <IconSymbol name="questionmark.circle.fill" size={24} color={colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingDescription}>
                Get help and contact support
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Logout Button */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <IconSymbol name="arrow.right.square.fill" size={24} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        {/* Version Info */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  avatarContainer: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginTop: -6,
    marginBottom: 12,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.errorLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
  },
  versionText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
});
