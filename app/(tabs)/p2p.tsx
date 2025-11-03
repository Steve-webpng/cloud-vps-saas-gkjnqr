
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
  Modal,
  ActivityIndicator,
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
    isConnectedAsReceiver,
    isDemoMode,
    totalEarnings,
    totalSpent,
    activeReceiverConnection,
    loading,
    toggleSharing,
    removeConnection,
    addConnection,
    updateBandwidthStats,
    connectAsReceiver,
    disconnectAsReceiver,
    updateConnection,
  } = useP2PStore();

  const [activeTab, setActiveTab] = useState<TabType>('sharing');
  const [refreshing, setRefreshing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Simulate real-time bandwidth updates
  useEffect(() => {
    if (!isSharing && !isConnectedAsReceiver) return;

    const interval = setInterval(() => {
      const randomUpload = Math.random() * 20 + 5;
      const randomDownload = Math.random() * 15 + 3;

      updateBandwidthStats({
        current: {
          upload: randomUpload,
          download: randomDownload,
        },
      });

      // Update receiver connection duration and cost
      if (isConnectedAsReceiver && activeReceiverConnection) {
        const newDuration = activeReceiverConnection.duration + 3;
        const dataUsed = (newDuration / 3600) * 0.5; // 0.5 GB per hour
        const currentCost = dataUsed * activeReceiverConnection.pricing.currentRate;

        updateConnection(activeReceiverConnection.id, {
          duration: newDuration,
          cost: currentCost,
          bandwidth: {
            ...activeReceiverConnection.bandwidth,
            total: dataUsed,
          },
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isSharing, isConnectedAsReceiver, activeReceiverConnection]);

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
    const connection = connections.find((c) => c.id === connectionId);
    
    if (connection?.connectionType === 'consumer') {
      Alert.alert(
        'Disconnect from Network',
        'Are you sure you want to disconnect? You will lose internet access.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disconnect',
            style: 'destructive',
            onPress: () => {
              disconnectAsReceiver();
              Alert.alert('Disconnected', 'You have been disconnected from the network.');
            },
          },
        ]
      );
    } else {
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
    }
  };

  const handleConnect = (nodeId: string) => {
    const node = availableNodes.find((n) => n.id === nodeId);
    if (!node) return;

    setSelectedNode(node);
    setShowPaymentModal(true);
  };

  const handleConfirmConnection = async () => {
    if (!selectedNode) return;

    setShowPaymentModal(false);

    try {
      await connectAsReceiver(selectedNode);
      
      Alert.alert(
        'Connected Successfully! 🎉',
        `You are now connected to ${selectedNode.name}.\n\n✓ Full internet access enabled\n✓ Browse any website\n✓ All app features activated\n✓ Demo restrictions removed\n\nYou will be charged $${selectedNode.price.toFixed(3)}/GB`,
        [
          {
            text: 'Start Browsing',
            onPress: () => router.push('/browser'),
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      Alert.alert('Connection Failed', 'Unable to connect to the network. Please try again.');
    }
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

  const handleBrowse = () => {
    if (isConnectedAsReceiver) {
      router.push('/browser');
    } else {
      Alert.alert(
        'Connect First',
        'Please connect to a network node to access the browser.',
        [
          {
            text: 'View Nodes',
            onPress: () => setActiveTab('discover'),
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    }
  };

  const activeConnections = connections.filter((c) => c.status === 'connected');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>P2P Network</Text>
          <Text style={styles.headerSubtitle}>
            {isConnectedAsReceiver
              ? '🌐 Connected - Full Access'
              : isDemoMode
              ? '⚠️ Demo Mode'
              : isSharing
              ? 'Sharing Active'
              : 'Sharing Inactive'}
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
        {/* Demo Mode Warning */}
        {isDemoMode && !isConnectedAsReceiver && (
          <View style={styles.demoWarning}>
            <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.warning} />
            <View style={styles.demoWarningText}>
              <Text style={styles.demoWarningTitle}>Demo Mode Active</Text>
              <Text style={styles.demoWarningSubtitle}>
                Connect to a network node to unlock full features and browse the internet
              </Text>
            </View>
          </View>
        )}

        {/* Connected Status Card */}
        {isConnectedAsReceiver && activeReceiverConnection && (
          <View style={styles.connectedCard}>
            <View style={styles.connectedHeader}>
              <IconSymbol name="checkmark.circle.fill" size={32} color={colors.success} />
              <View style={styles.connectedInfo}>
                <Text style={styles.connectedTitle}>Connected to Network</Text>
                <Text style={styles.connectedSubtitle}>{activeReceiverConnection.peerName}</Text>
              </View>
            </View>
            <View style={styles.connectedStats}>
              <View style={styles.connectedStat}>
                <Text style={styles.connectedStatLabel}>Data Used</Text>
                <Text style={styles.connectedStatValue}>
                  {activeReceiverConnection.bandwidth.total.toFixed(2)} GB
                </Text>
              </View>
              <View style={styles.connectedStat}>
                <Text style={styles.connectedStatLabel}>Current Cost</Text>
                <Text style={styles.connectedStatValue}>
                  ${(activeReceiverConnection.cost || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.connectedStat}>
                <Text style={styles.connectedStatLabel}>Duration</Text>
                <Text style={styles.connectedStatValue}>
                  {Math.floor(activeReceiverConnection.duration / 60)}m
                </Text>
              </View>
            </View>
            <Pressable style={styles.browseButton} onPress={handleBrowse}>
              <IconSymbol name="globe" size={18} color={colors.white} />
              <Text style={styles.browseButtonText}>Open Browser</Text>
            </Pressable>
          </View>
        )}

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
        {(isSharing || isConnectedAsReceiver) && (
          <BandwidthMonitor stats={bandwidthStats} isActive={isSharing || isConnectedAsReceiver} />
        )}

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
                  Start sharing to connect with nearby peers or connect to a node to receive internet
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

      {/* Payment Confirmation Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <IconSymbol name="wifi" size={48} color={colors.primary} />
              <Text style={styles.modalTitle}>Connect to Network</Text>
            </View>

            {selectedNode && (
              <View style={styles.modalBody}>
                <Text style={styles.modalNodeName}>{selectedNode.name}</Text>
                <Text style={styles.modalNodeAddress}>{selectedNode.location.address}</Text>

                <View style={styles.modalDetails}>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Speed:</Text>
                    <Text style={styles.modalDetailValue}>
                      {selectedNode.bandwidth.download} Mbps
                    </Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Price:</Text>
                    <Text style={styles.modalDetailValue}>
                      ${selectedNode.price.toFixed(3)}/GB
                    </Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Rating:</Text>
                    <Text style={styles.modalDetailValue}>
                      ⭐ {selectedNode.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalFeatures}>
                  <Text style={styles.modalFeaturesTitle}>What you&apos;ll get:</Text>
                  <Text style={styles.modalFeature}>✓ Full internet access</Text>
                  <Text style={styles.modalFeature}>✓ Browse any website</Text>
                  <Text style={styles.modalFeature}>✓ All app features unlocked</Text>
                  <Text style={styles.modalFeature}>✓ Secure VPN-like connection</Text>
                </View>

                <View style={styles.modalActions}>
                  <Pressable
                    style={styles.modalCancelButton}
                    onPress={() => setShowPaymentModal(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={styles.modalConnectButton}
                    onPress={handleConfirmConnection}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color={colors.white} />
                    ) : (
                      <>
                        <IconSymbol name="link" size={18} color={colors.white} />
                        <Text style={styles.modalConnectText}>Connect & Pay</Text>
                      </>
                    )}
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  demoWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  demoWarningText: {
    flex: 1,
    marginLeft: 12,
  },
  demoWarningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.warning,
    marginBottom: 4,
  },
  demoWarningSubtitle: {
    fontSize: 13,
    color: colors.warning,
  },
  connectedCard: {
    backgroundColor: colors.successLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.success,
  },
  connectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  connectedInfo: {
    marginLeft: 12,
    flex: 1,
  },
  connectedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.success,
    marginBottom: 2,
  },
  connectedSubtitle: {
    fontSize: 14,
    color: colors.success,
  },
  connectedStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.success,
  },
  connectedStat: {
    flex: 1,
    alignItems: 'center',
  },
  connectedStatLabel: {
    fontSize: 12,
    color: colors.success,
    marginBottom: 4,
  },
  connectedStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  browseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
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
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  modalBody: {
    padding: 24,
  },
  modalNodeName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalNodeAddress: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalDetails: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalDetailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  modalDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  modalFeatures: {
    marginBottom: 24,
  },
  modalFeaturesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  modalFeature: {
    fontSize: 14,
    color: colors.success,
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  modalConnectButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalConnectText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
