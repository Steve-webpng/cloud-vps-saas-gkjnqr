
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useVPSStore } from '@/stores/vpsStore';

export default function SettingsScreen() {
  const { userProfile, billingInfo } = useVPSStore();

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'This feature will allow you to edit your profile information');
  };

  const handleManageBilling = () => {
    Alert.alert('Manage Billing', 'View and manage your billing information and payment methods');
  };

  const handleAPIKeys = () => {
    Alert.alert('API Keys', 'Manage your API keys for programmatic access');
  };

  const handleSecurity = () => {
    Alert.alert('Security', 'Manage security settings including 2FA and SSH keys');
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'Configure notification preferences');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Contact our support team or view documentation');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout') },
      ]
    );
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.circle.fill" size={64} color={colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profileEmail}>{userProfile.email}</Text>
            {userProfile.company && (
              <Text style={styles.profileCompany}>{userProfile.company}</Text>
            )}
          </View>
          <Pressable onPress={handleEditProfile} style={styles.editButton}>
            <IconSymbol name="pencil" size={20} color={colors.primary} />
          </Pressable>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <Pressable style={styles.menuItem} onPress={handleManageBilling}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.success + '20' }]}>
                <IconSymbol name="creditcard.fill" size={20} color={colors.success} />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Billing & Payments</Text>
                <Text style={styles.menuItemSubtitle}>
                  Balance: ${billingInfo.currentBalance.toFixed(2)}
                </Text>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleAPIKeys}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.accent + '20' }]}>
                <IconSymbol name="key.fill" size={20} color={colors.accent} />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>API Keys</Text>
                <Text style={styles.menuItemSubtitle}>Manage programmatic access</Text>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleSecurity}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.warning + '20' }]}>
                <IconSymbol name="lock.fill" size={20} color={colors.warning} />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Security</Text>
                <Text style={styles.menuItemSubtitle}>2FA, SSH keys, passwords</Text>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <Pressable style={styles.menuItem} onPress={handleNotifications}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="bell.fill" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Notifications</Text>
                <Text style={styles.menuItemSubtitle}>Configure alerts and emails</Text>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <Pressable style={styles.menuItem} onPress={handleSupport}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.accent + '20' }]}>
                <IconSymbol name="questionmark.circle.fill" size={20} color={colors.accent} />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Help & Support</Text>
                <Text style={styles.menuItemSubtitle}>Documentation and contact</Text>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Logout Button */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <IconSymbol name="arrow.right.square.fill" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  profileCompany: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  editButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger + '20',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
  },
  versionText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
});
