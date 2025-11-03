
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useVPSStore } from '@/stores/vpsStore';
import StatCard from '@/components/StatCard';
import VPSCard from '@/components/VPSCard';

export default function HomeScreen() {
  const { instances, dashboardStats, billingInfo, updateInstanceStatus } = useVPSStore();

  const handleVPSAction = (action: 'start' | 'stop' | 'restart', id: string) => {
    console.log(`${action} VPS ${id}`);
    
    if (action === 'start') {
      updateInstanceStatus(id, 'starting');
      setTimeout(() => updateInstanceStatus(id, 'running'), 2000);
      Alert.alert('Success', 'VPS instance is starting...');
    } else if (action === 'stop') {
      updateInstanceStatus(id, 'stopping');
      setTimeout(() => updateInstanceStatus(id, 'stopped'), 2000);
      Alert.alert('Success', 'VPS instance is stopping...');
    } else if (action === 'restart') {
      updateInstanceStatus(id, 'stopping');
      setTimeout(() => {
        updateInstanceStatus(id, 'starting');
        setTimeout(() => updateInstanceStatus(id, 'running'), 2000);
      }, 2000);
      Alert.alert('Success', 'VPS instance is restarting...');
    }
  };

  const handleCreateVPS = () => {
    Alert.alert('Create VPS', 'This feature will allow you to create a new VPS instance');
  };

  const renderHeaderRight = () => (
    <Pressable onPress={handleCreateVPS} style={styles.headerButton}>
      <IconSymbol name="plus.circle.fill" color={colors.primary} size={28} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Dashboard',
            headerRight: renderHeaderRight,
          }}
        />
      )}
      <View style={commonStyles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            Platform.OS !== 'ios' && styles.contentContainerWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome back! 👋</Text>
            <Text style={styles.welcomeSubtitle}>
              Manage your VPS instances and monitor your infrastructure
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Instances"
              value={dashboardStats.totalInstances}
              icon="server.rack"
              iconColor={colors.primary}
            />
            <StatCard
              title="Running"
              value={dashboardStats.runningInstances}
              icon="checkmark.circle.fill"
              iconColor={colors.success}
            />
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              title="Bandwidth"
              value={`${dashboardStats.totalBandwidth}GB`}
              icon="arrow.up.arrow.down"
              iconColor={colors.accent}
            />
            <StatCard
              title="Monthly Spend"
              value={`$${dashboardStats.monthlySpend}`}
              icon="dollarsign.circle.fill"
              iconColor={colors.warning}
            />
          </View>

          {/* Billing Alert */}
          <View style={styles.billingAlert}>
            <View style={styles.billingAlertIcon}>
              <IconSymbol name="creditcard.fill" size={20} color={colors.primary} />
            </View>
            <View style={styles.billingAlertContent}>
              <Text style={styles.billingAlertTitle}>Next billing date</Text>
              <Text style={styles.billingAlertText}>
                {billingInfo.nextBillingDate} • {billingInfo.paymentMethod}
              </Text>
            </View>
          </View>

          {/* VPS Instances Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Instances</Text>
              <Pressable onPress={handleCreateVPS}>
                <Text style={styles.sectionLink}>Create New</Text>
              </Pressable>
            </View>

            {instances.map((instance) => (
              <VPSCard
                key={instance.id}
                instance={instance}
                onAction={handleVPSAction}
              />
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <Pressable 
                style={styles.quickActionButton}
                onPress={() => Alert.alert('API Keys', 'Manage your API keys')}
              >
                <IconSymbol name="key.fill" size={24} color={colors.primary} />
                <Text style={styles.quickActionText}>API Keys</Text>
              </Pressable>
              
              <Pressable 
                style={styles.quickActionButton}
                onPress={() => Alert.alert('Domains', 'Manage your domains')}
              >
                <IconSymbol name="globe" size={24} color={colors.accent} />
                <Text style={styles.quickActionText}>Domains</Text>
              </Pressable>
              
              <Pressable 
                style={styles.quickActionButton}
                onPress={() => Alert.alert('Billing', 'View billing details')}
              >
                <IconSymbol name="chart.bar.fill" size={24} color={colors.success} />
                <Text style={styles.quickActionText}>Billing</Text>
              </Pressable>
              
              <Pressable 
                style={styles.quickActionButton}
                onPress={() => Alert.alert('Support', 'Contact support')}
              >
                <IconSymbol name="questionmark.circle.fill" size={24} color={colors.warning} />
                <Text style={styles.quickActionText}>Support</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  billingAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  billingAlertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billingAlertContent: {
    flex: 1,
  },
  billingAlertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  billingAlertText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  sectionLink: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  headerButton: {
    padding: 4,
  },
});
