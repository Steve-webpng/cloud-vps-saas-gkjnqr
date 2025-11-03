
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useP2PStore } from '@/stores/p2pStore';
import BandwidthMonitor from '@/components/BandwidthMonitor';
import ConnectionCard from '@/components/ConnectionCard';
import NetworkNodeCard from '@/components/NetworkNodeCard';
import { useRouter } from 'expo-router';

type TabType = 'sharing' | 'discover';

export default function P2PScreen() {
  const router = useRouter();
  const {
    connections,
    availableNodes,
    bandwidthStats,
    isSharing,
    totalEarnings,
    totalSpent,
    toggleSharing,
    removeConnection,
    addConnection,
    updateBandwidthStats,
  } = useP2PStore();

  const [activeTab, setActiveTab] = useState<TabType>('sharing');
  const [refreshing, setRefreshing] = useState(false);

  // Simulate real-time bandwidth updates
  useEffect(() => {
    if (!isSharing) return;

    const interval = setInterval(() => {
      const randomUpload = Math.random() * 20 + 5;
      const randomDownload = Math.random() * 15 + 3;

      updateBandwidthStats({
        current: {
          upload: randomUpload,
          download: randomDownload,
        },
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isSharing]);

  const handleToggleSharing = () => {
    toggleSharing();
    Alert.alert(
      isSharing ? 'Sharing Stopped' : 'Sharing Started',
      isSharing
        ? 'You have stopped sharing your internet connection.'
        : 'You are now sharing your internet connection with nearby peers.'
    );
  };

  const handleDisconnect = (connectionId: string) => {
    Alert.alert(
      'Disconnect Peer',
      'Are you sure you want to disconnect from this peer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            removeConnection(connectionId);
            Alert.alert('Disconnected', 'Peer has been disconnected successfully.');
          },
        },
      ]
    );
  };

  const handleConnect = (nodeId: string) => {
    const node = availableNodes.find((n) => n.id === nodeId);
    if (!node) return;

    Alert.alert(
      'Connect to Node',
      `Connect to ${node.name} at $${node.price.toFixed(3)}/GB?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect',
          onPress: () => {
            console.log('Connecting to node:', nodeId);
            Alert.alert('Connected', `Successfully connected to ${node.name}`);
          },
        },
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate network refresh
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleSettings = () => {
    router.push('/p2p-settings');
  };

  const handlePayment = () => {
    router.push('/payment');
  };

  const activeConnections = connections.filter((c) => c.status === 'connected');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>P2P Network</Text>
          <Text style={styles.headerSubtitle}>
            {isSharing ? 'Sharing Active' : 'Sharing Inactive'}
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <Pressable
            style={styles.infoButton}
            onPress={() => router.push('/p2p-info')}
          >
            <IconSymbol name="info.circle" size={24} color={colors.text} />
          </Pressable>
          <Pressable style={styles.settingsButton} onPress={handleSettings}>
            <IconSymbol name="gear" size={24} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusInfo}>
              <IconSymbol
                name={isSharing ? 'wifi' : 'wifi.slash'}
                size={32}
                color={isSharing ? colors.success : colors.textSecondary}
              />
              <View style={styles.statusText}>
                <Text style={styles.statusTitle}>
                  {isSharing ? 'Sharing Internet' : 'Not Sharing'}
                </Text>
                <Text style={styles.statusSubtitle}>
                  {activeConnections.length} active connection{activeConnections.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
            <Pressable
              style={[styles.toggleButton, isSharing && styles.toggleButtonActive]}
              onPress={handleToggleSharing}
            >
              <Text style={[styles.toggleText, isSharing && styles.toggleTextActive]}>
                {isSharing ? 'Stop' : 'Start'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.earningsContainer}>
            <View style={styles.earningItem}>
              <Text style={styles.earningLabel}>Total Earnings</Text>
              <Text style={styles.earningValue}>${totalEarnings.toFixed(2)}</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningLabel}>Total Spent</Text>
              <Text style={styles.earningValue}>${totalSpent.toFixed(2)}</Text>
            </View>
          </View>

          <Pressable style={styles.paymentButton} onPress={handlePayment}>
            <IconSymbol name="creditcard.fill" size={18} color={colors.white} />
            <Text style={styles.paymentButtonText}>Manage Payments</Text>
          </Pressable>
        </View>

        {/* Bandwidth Monitor */}
        {isSharing && <BandwidthMonitor stats={bandwidthStats} isActive={isSharing} />}

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'sharing' && styles.tabActive]}
            onPress={() => setActiveTab('sharing')}
          >
            <Text style={[styles.tabText, activeTab === 'sharing' && styles.tabTextActive]}>
              My Connections
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'discover' && styles.tabActive]}
            onPress={() => setActiveTab('discover')}
          >
            <Text style={[styles.tabText, activeTab === 'discover' && styles.tabTextActive]}>
              Discover Nodes
            </Text>
          </Pressable>
        </View>

        {/* Content */}
        {activeTab === 'sharing' ? (
          <View style={styles.content}>
            {connections.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol name="link.circle" size={64} color={colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Active Connections</Text>
                <Text style={styles.emptySubtitle}>
                  Start sharing to connect with nearby peers
                </Text>
              </View>
            ) : (
              connections.map((connection) => (
                <ConnectionCard
                  key={connection.id}
                  connection={connection}
                  onDisconnect={handleDisconnect}
                />
              ))
            )}
          </View>
        ) : (
          <View style={styles.content}>
            {availableNodes.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol name="wifi.slash" size={64} color={colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Nodes Available</Text>
                <Text style={styles.emptySubtitle}>
                  No network nodes found in your area
                </Text>
              </View>
            ) : (
              availableNodes.map((node) => (
                <NetworkNodeCard
                  key={node.id}
                  node={node}
                  onConnect={handleConnect}
                />
              ))
            )}
          </View>
        )}
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  infoButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  statusCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusText: {
    marginLeft: 16,
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  toggleButtonActive: {
    backgroundColor: colors.error,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  toggleTextActive: {
    color: colors.white,
  },
  earningsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  earningItem: {
    flex: 1,
    alignItems: 'center',
  },
  earningLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  earningValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 16,
    gap: 8,
  },
  paymentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
