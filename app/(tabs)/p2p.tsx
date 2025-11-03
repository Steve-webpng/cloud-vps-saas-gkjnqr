
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
import { useP2PStore } from '@/stores/p2pStore';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import ConnectionCard from '@/components/ConnectionCard';
import BandwidthMonitor from '@/components/BandwidthMonitor';
import NetworkNodeCard from '@/components/NetworkNodeCard';
import { geminiService } from '@/services/geminiService';

type TabType = 'sharing' | 'receiving';

export default function P2PScreen() {
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
    toggleSharing,
    connectAsReceiver,
    disconnectAsReceiver,
    removeConnection,
    setLoading,
    loading,
  } = useP2PStore();

  const [activeTab, setActiveTab] = useState<TabType>('sharing');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [aiOptimization, setAiOptimization] = useState<string>('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isSharing || isConnectedAsReceiver) {
      console.log('P2P active - Demo mode:', isDemoMode);
    }
  }, [isSharing, isConnectedAsReceiver, isDemoMode]);

  const handleToggleSharing = () => {
    if (isSharing) {
      Alert.alert(
        'Stop Sharing',
        'Are you sure you want to stop sharing your internet?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Stop', style: 'destructive', onPress: toggleSharing },
        ]
      );
    } else {
      toggleSharing();
    }
  };

  const handleDisconnect = (connectionId: string) => {
    Alert.alert(
      'Disconnect',
      'Are you sure you want to disconnect?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            if (activeReceiverConnection?.id === connectionId) {
              disconnectAsReceiver();
            } else {
              removeConnection(connectionId);
            }
          },
        },
      ]
    );
  };

  const handleConnect = (nodeId: string) => {
    const node = availableNodes.find(n => n.id === nodeId);
    if (node && node.available) {
      setSelectedNode(node);
      setShowConnectionModal(true);
    }
  };

  const handleConfirmConnection = async () => {
    if (!selectedNode) {
      return;
    }

    setShowConnectionModal(false);
    await connectAsReceiver(selectedNode);
    setSelectedNode(null);
    setActiveTab('receiving');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleSettings = () => {
    router.push('/p2p-settings');
  };

  const handlePayment = () => {
    router.push('/payment');
  };

  const handleBrowse = () => {
    if (isDemoMode) {
      Alert.alert(
        'Demo Mode',
        'Connect to a P2P network to unlock the browser and all features.',
        [{ text: 'OK' }]
      );
    } else {
      router.push('/browser');
    }
  };

  const handleAiOptimization = async () => {
    setLoadingAi(true);
    setShowAiModal(true);

    try {
      const response = await geminiService.getNetworkOptimization({
        upload: bandwidthStats.current.upload,
        download: bandwidthStats.current.download,
        connections: connections.length,
      });

      if (response.success) {
        setAiOptimization(response.text);
      } else {
        setAiOptimization('Unable to generate optimization suggestions at this time. Please try again later.');
      }
    } catch (error) {
      console.error('AI optimization error:', error);
      setAiOptimization('An error occurred while generating suggestions.');
    } finally {
      setLoadingAi(false);
    }
  };

  const providerConnections = connections.filter(c => c.connectionType === 'provider');
  const consumerConnections = connections.filter(c => c.connectionType === 'consumer');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>P2P Network</Text>
          <Text style={styles.headerSubtitle}>
            {isSharing ? 'Sharing Active' : 'Not Sharing'} • {isConnectedAsReceiver ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.aiButton} onPress={handleAiOptimization}>
            <IconSymbol name="sparkles" size={20} color={colors.primary} />
          </Pressable>
          <Pressable style={styles.settingsButton} onPress={handleSettings}>
            <IconSymbol name="gearshape.fill" size={20} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      {isDemoMode && (
        <View style={styles.demoBanner}>
          <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.warning} />
          <Text style={styles.demoText}>
            Demo Mode - Connect to unlock all features
          </Text>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol name="dollarsign.circle.fill" size={32} color={colors.success} />
            <Text style={styles.statValue}>${totalEarnings.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="arrow.down.circle.fill" size={32} color={colors.error} />
            <Text style={styles.statValue}>${totalSpent.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>

        {/* Bandwidth Monitor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bandwidth Monitor</Text>
          <BandwidthMonitor stats={bandwidthStats} isActive={isSharing || isConnectedAsReceiver} />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={handlePayment}
          >
            <IconSymbol name="creditcard.fill" size={24} color={colors.white} />
            <Text style={styles.actionButtonText}>Payments</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={handleBrowse}
          >
            <IconSymbol name="globe" size={24} color={colors.primary} />
            <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
              Browse
            </Text>
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'sharing' && styles.tabActive]}
            onPress={() => setActiveTab('sharing')}
          >
            <Text style={[styles.tabText, activeTab === 'sharing' && styles.tabTextActive]}>
              Sharing ({providerConnections.length})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'receiving' && styles.tabActive]}
            onPress={() => setActiveTab('receiving')}
          >
            <Text style={[styles.tabText, activeTab === 'receiving' && styles.tabTextActive]}>
              Receiving
            </Text>
          </Pressable>
        </View>

        {/* Sharing Tab */}
        {activeTab === 'sharing' && (
          <View style={styles.tabContent}>
            <View style={styles.sharingHeader}>
              <Text style={styles.sectionTitle}>Internet Sharing</Text>
              <Pressable
                style={[styles.toggleButton, isSharing && styles.toggleButtonActive]}
                onPress={handleToggleSharing}
              >
                <Text style={[styles.toggleText, isSharing && styles.toggleTextActive]}>
                  {isSharing ? 'Stop Sharing' : 'Start Sharing'}
                </Text>
              </Pressable>
            </View>

            {providerConnections.length > 0 ? (
              providerConnections.map(connection => (
                <ConnectionCard
                  key={connection.id}
                  connection={connection}
                  onDisconnect={handleDisconnect}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <IconSymbol name="wifi.slash" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>
                  {isSharing ? 'Waiting for connections...' : 'Start sharing to earn'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Receiving Tab */}
        {activeTab === 'receiving' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Available Networks</Text>

            {isConnectedAsReceiver && activeReceiverConnection && (
              <View style={styles.connectedSection}>
                <View style={styles.connectedBadge}>
                  <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                  <Text style={styles.connectedText}>Connected</Text>
                </View>
                <ConnectionCard
                  connection={activeReceiverConnection}
                  onDisconnect={handleDisconnect}
                />
              </View>
            )}

            {availableNodes.map(node => (
              <NetworkNodeCard
                key={node.id}
                node={node}
                onConnect={handleConnect}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Connection Confirmation Modal */}
      <Modal
        visible={showConnectionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConnectionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Connect to Network</Text>
            {selectedNode && (
              <>
                <Text style={styles.modalText}>
                  Connect to {selectedNode.name}?
                </Text>
                <View style={styles.modalDetails}>
                  <Text style={styles.modalDetailText}>
                    Price: ${selectedNode.price}/GB
                  </Text>
                  <Text style={styles.modalDetailText}>
                    Distance: {selectedNode.distance} km
                  </Text>
                  <Text style={styles.modalDetailText}>
                    Rating: {selectedNode.rating} ⭐
                  </Text>
                </View>
              </>
            )}
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowConnectionModal(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleConfirmConnection}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.modalButtonText}>Connect</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* AI Optimization Modal */}
      <Modal
        visible={showAiModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAiModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.aiModalHeader}>
              <IconSymbol name="sparkles" size={24} color={colors.primary} />
              <Text style={styles.modalTitle}>AI Optimization</Text>
            </View>
            {loadingAi ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Analyzing your network...</Text>
              </View>
            ) : (
              <ScrollView style={styles.aiContent}>
                <Text style={styles.aiText}>{aiOptimization}</Text>
              </ScrollView>
            )}
            <Pressable
              style={[styles.modalButton, styles.modalButtonConfirm, styles.fullWidth]}
              onPress={() => setShowAiModal(false)}
              disabled={loadingAi}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
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
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  aiButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  demoText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.warning,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
  },
  actionButtonSecondary: {
    backgroundColor: colors.cardBackground,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  actionButtonTextSecondary: {
    color: colors.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
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
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
  },
  tabContent: {
    marginBottom: 24,
  },
  sharingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  toggleTextActive: {
    color: colors.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  connectedSection: {
    marginBottom: 24,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
    gap: 6,
  },
  connectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
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
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  modalDetails: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  modalDetailText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.background,
  },
  modalButtonConfirm: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  aiModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  aiContent: {
    maxHeight: 300,
    marginBottom: 20,
  },
  aiText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  fullWidth: {
    width: '100%',
  },
});
