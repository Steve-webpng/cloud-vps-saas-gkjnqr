
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { P2PConnection } from '@/types/p2p';
import { IconSymbol } from './IconSymbol';
import StatusBadge from './StatusBadge';

interface ConnectionCardProps {
  connection: P2PConnection;
  onDisconnect?: (id: string) => void;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection, onDisconnect }) => {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return colors.success;
      case 'good':
        return colors.primary;
      case 'fair':
        return colors.warning;
      case 'poor':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.peerInfo}>
          <View style={styles.avatar}>
            <IconSymbol name="person.fill" size={20} color={colors.primary} />
          </View>
          <View style={styles.peerDetails}>
            <Text style={styles.peerName}>{connection.peerName}</Text>
            <Text style={styles.peerLocation}>
              {connection.peerLocation.distance.toFixed(1)} km away
            </Text>
          </View>
        </View>
        <StatusBadge status={connection.status} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <IconSymbol name="arrow.up.circle.fill" size={16} color={colors.primary} />
          <Text style={styles.statLabel}>Upload</Text>
          <Text style={styles.statValue}>{connection.bandwidth.upload.toFixed(1)} Mbps</Text>
        </View>
        <View style={styles.statItem}>
          <IconSymbol name="arrow.down.circle.fill" size={16} color={colors.success} />
          <Text style={styles.statLabel}>Download</Text>
          <Text style={styles.statValue}>{connection.bandwidth.download.toFixed(1)} Mbps</Text>
        </View>
        <View style={styles.statItem}>
          <IconSymbol name="chart.bar.fill" size={16} color={colors.warning} />
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{connection.bandwidth.total.toFixed(2)} GB</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Duration:</Text>
          <Text style={styles.infoValue}>{formatDuration(connection.duration)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Quality:</Text>
          <Text style={[styles.infoValue, { color: getQualityColor(connection.quality) }]}>
            {connection.quality.charAt(0).toUpperCase() + connection.quality.slice(1)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rate:</Text>
          <Text style={styles.infoValue}>${connection.pricing.currentRate.toFixed(3)}/GB</Text>
        </View>
        {connection.earnings !== undefined && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Earnings:</Text>
            <Text style={[styles.infoValue, styles.earnings]}>
              ${connection.earnings.toFixed(2)}
            </Text>
          </View>
        )}
        {connection.cost !== undefined && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cost:</Text>
            <Text style={[styles.infoValue, styles.cost]}>
              ${connection.cost.toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      {onDisconnect && connection.status === 'connected' && (
        <Pressable
          style={styles.disconnectButton}
          onPress={() => onDisconnect(connection.id)}
        >
          <IconSymbol name="xmark.circle.fill" size={18} color={colors.error} />
          <Text style={styles.disconnectText}>Disconnect</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  peerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  peerDetails: {
    flex: 1,
  },
  peerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  peerLocation: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  infoContainer: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  earnings: {
    color: colors.success,
    fontWeight: '600',
  },
  cost: {
    color: colors.error,
    fontWeight: '600',
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.errorLight,
    borderRadius: 10,
    marginTop: 4,
  },
  disconnectText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 6,
  },
});

export default ConnectionCard;
