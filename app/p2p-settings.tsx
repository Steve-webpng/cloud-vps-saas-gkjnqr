
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useP2PStore } from '@/stores/p2pStore';
import { useRouter } from 'expo-router';

export default function P2PSettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings, pricingConfig } = useP2PStore();

  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    Alert.alert('Settings Saved', 'Your P2P settings have been updated successfully.');
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const updateLocalSetting = (key: keyof typeof localSettings, value: any) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleNetworkType = (type: 'wifi' | 'cellular' | 'ethernet') => {
    const current = localSettings.allowedNetworkTypes;
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    updateLocalSetting('allowedNetworkTypes', updated);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleCancel}>
          <IconSymbol name="chevron.left" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>P2P Settings</Text>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto Connect</Text>
              <Text style={styles.settingDescription}>
                Automatically connect to nearby nodes
              </Text>
            </View>
            <Switch
              value={localSettings.autoConnect}
              onValueChange={(value) => updateLocalSetting('autoConnect', value)}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={localSettings.autoConnect ? colors.primary : colors.textSecondary}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Max Connections</Text>
              <Text style={styles.settingDescription}>
                Maximum number of simultaneous connections
              </Text>
            </View>
            <TextInput
              style={styles.input}
              value={localSettings.maxConnections.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || 1;
                updateLocalSetting('maxConnections', Math.max(1, Math.min(10, num)));
              }}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Max Bandwidth (Mbps)</Text>
              <Text style={styles.settingDescription}>
                Maximum bandwidth to share
              </Text>
            </View>
            <TextInput
              style={styles.input}
              value={localSettings.maxBandwidth.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || 10;
                updateLocalSetting('maxBandwidth', Math.max(10, Math.min(1000, num)));
              }}
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Share Radius (km)</Text>
              <Text style={styles.settingDescription}>
                Maximum distance to share internet
              </Text>
            </View>
            <TextInput
              style={styles.input}
              value={localSettings.shareRadius.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || 1;
                updateLocalSetting('shareRadius', Math.max(1, Math.min(50, num)));
              }}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
        </View>

        {/* Pricing Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Minimum Price ($/GB)</Text>
              <Text style={styles.settingDescription}>
                Minimum price per gigabyte
              </Text>
            </View>
            <TextInput
              style={styles.input}
              value={localSettings.minPrice.toFixed(2)}
              onChangeText={(text) => {
                const num = parseFloat(text) || 0.01;
                updateLocalSetting('minPrice', Math.max(0.01, Math.min(1, num)));
              }}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Maximum Price ($/GB)</Text>
              <Text style={styles.settingDescription}>
                Maximum price per gigabyte
              </Text>
            </View>
            <TextInput
              style={styles.input}
              value={localSettings.maxPrice.toFixed(2)}
              onChangeText={(text) => {
                const num = parseFloat(text) || 0.05;
                updateLocalSetting('maxPrice', Math.max(0.05, Math.min(5, num)));
              }}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.infoCard}>
            <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Base rate: ${pricingConfig.baseRate.toFixed(3)}/GB. Final price is calculated
              based on demand and distance.
            </Text>
          </View>
        </View>

        {/* Network Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allowed Networks</Text>
          <Text style={styles.sectionDescription}>
            Select which network types can be used for sharing
          </Text>

          <Pressable
            style={styles.networkOption}
            onPress={() => toggleNetworkType('wifi')}
          >
            <View style={styles.networkInfo}>
              <IconSymbol name="wifi" size={24} color={colors.primary} />
              <Text style={styles.networkLabel}>Wi-Fi</Text>
            </View>
            <View
              style={[
                styles.checkbox,
                localSettings.allowedNetworkTypes.includes('wifi') && styles.checkboxActive,
              ]}
            >
              {localSettings.allowedNetworkTypes.includes('wifi') && (
                <IconSymbol name="checkmark" size={16} color={colors.white} />
              )}
            </View>
          </Pressable>

          <Pressable
            style={styles.networkOption}
            onPress={() => toggleNetworkType('cellular')}
          >
            <View style={styles.networkInfo}>
              <IconSymbol name="antenna.radiowaves.left.and.right" size={24} color={colors.success} />
              <Text style={styles.networkLabel}>Cellular</Text>
            </View>
            <View
              style={[
                styles.checkbox,
                localSettings.allowedNetworkTypes.includes('cellular') && styles.checkboxActive,
              ]}
            >
              {localSettings.allowedNetworkTypes.includes('cellular') && (
                <IconSymbol name="checkmark" size={16} color={colors.white} />
              )}
            </View>
          </Pressable>

          <Pressable
            style={styles.networkOption}
            onPress={() => toggleNetworkType('ethernet')}
          >
            <View style={styles.networkInfo}>
              <IconSymbol name="cable.connector" size={24} color={colors.warning} />
              <Text style={styles.networkLabel}>Ethernet</Text>
            </View>
            <View
              style={[
                styles.checkbox,
                localSettings.allowedNetworkTypes.includes('ethernet') && styles.checkboxActive,
              ]}
            >
              {localSettings.allowedNetworkTypes.includes('ethernet') && (
                <IconSymbol name="checkmark" size={16} color={colors.white} />
              )}
            </View>
          </Pressable>
        </View>

        {/* Security Notice */}
        <View style={styles.securityCard}>
          <IconSymbol name="lock.shield.fill" size={32} color={colors.success} />
          <Text style={styles.securityTitle}>Secure & Decentralized</Text>
          <Text style={styles.securityText}>
            All connections are encrypted end-to-end using blockchain-based authentication.
            Your data is never stored on centralized servers.
          </Text>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  input: {
    width: 80,
    height: 40,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.primary,
    marginLeft: 12,
    lineHeight: 18,
  },
  networkOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  securityCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
