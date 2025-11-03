
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
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
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

  const isConsumer = connection.connectionType === 'consumer';

  return (
    <View style={[styles.container, isConsumer && styles.consumerContainer]}>
      <View style={styles.header}>
        <View style={styles.peerInfo}>
          <View style={[styles.iconContainer, isConsumer && styles.iconContainerConsumer]}>
            <IconSymbol
              name={isConsumer ? 'arrow.down.circle.fill' : 'arrow.up.circle.fill'}
              size={24}
              color={isConsumer ? colors.primary : colors.success}
            />
          </View>
          <View style={styles.peerDetails}>
            <Text style={styles.peerName}>{connection.peerName}</Text>
            <Text style={styles.peerType}>
              {isConsumer ? '📥 Receiving Internet' : '📤 Providing Internet'}
            </Text>
          </View>
        </View>
        <StatusBadge status={connection.status} />
      </View>

      <View style={styles.locationContainer}>
        <IconSymbol name="location.fill" size={14} color={colors.textSecondary} />
        <Text style={styles.locationText} numberOfLines={1}>
          {connection.peerLocation.address}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <IconSymbol
            name={isConsumer ? 'arrow.down' : 'arrow.up'}
            size={16}
            color={isConsumer ? colors.primary : colors.success}
          />
          <Text style={styles.statLabel}>
            {isConsumer ? 'Download' : 'Upload'}
          </Text>
          <Text style={styles.statValue}>
            {isConsumer
              ? `${connection.bandwidth.download.toFixed(1)} Mbps`
              : `${connection.bandwidth.upload.toFixed(1)} Mbps`}
          </Text>
        </View>
        <View style={styles.statItem}>
          <IconSymbol name="chart.bar.fill" size={16} color={colors.primary} />
          <Text style={styles.statLabel}>Data</Text>
          <Text style={styles.statValue}>{connection.bandwidth.total.toFixed(2)} GB</Text>
        </View>
        <View style={styles.statItem}>
          <IconSymbol name="clock.fill" size={16} color={colors.warning} />
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>{formatDuration(connection.duration)}</Text>
        </View>
      </View>

      <View style={styles.qualityContainer}>
        <View style={styles.qualityIndicator}>
          <View
            style={[
              styles.qualityDot,
              { backgroundColor: getQualityColor(connection.quality) },
            ]}
          />
          <Text style={styles.qualityText}>
            {connection.quality.charAt(0).toUpperCase() + connection.quality.slice(1)} Quality
          </Text>
        </View>
        <View style={styles.rateContainer}>
          <Text style={styles.rateLabel}>Rate:</Text>
          <Text style={styles.rateValue}>
            ${connection.pricing.currentRate.toFixed(3)}/GB
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.earningsContainer}>
          {isConsumer ? (
            <>
              <IconSymbol name="dollarsign.circle.fill" size={20} color={colors.error} />
              <View style={styles.earningsInfo}>
                <Text style={styles.earningsLabel}>Current Cost</Text>
                <Text style={[styles.earningsValue, styles.costValue]}>
                  ${(connection.cost || 0).toFixed(2)}
                </Text>
              </View>
            </>
          ) : (
            <>
              <IconSymbol name="dollarsign.circle.fill" size={20} color={colors.success} />
              <View style={styles.earningsInfo}>
                <Text style={styles.earningsLabel}>Earnings</Text>
                <Text style={[styles.earningsValue, styles.earningValue]}>
                  ${(connection.earnings || 0).toFixed(2)}
                </Text>
              </View>
            </>
          )}
        </View>
        {onDisconnect && (
          <Pressable
            style={[styles.disconnectButton, isConsumer && styles.disconnectButtonConsumer]}
            onPress={() => onDisconnect(connection.id)}
          >
            <IconSymbol name="xmark.circle.fill" size={16} color={colors.white} />
            <Text style={styles.disconnectText}>Disconnect</Text>
          </Pressable>
        )}
      </View>
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
  consumerContainer: {
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  peerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconContainerConsumer: {
    backgroundColor: colors.primaryLight,
  },
  peerDetails: {
    flex: 1,
  },
  peerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  peerType: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  qualityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  qualityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qualityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  qualityText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rateLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  rateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  earningsInfo: {
    marginLeft: 8,
  },
  earningsLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  earningsValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  earningValue: {
    color: colors.success,
  },
  costValue: {
    color: colors.error,
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.error,
    borderRadius: 10,
    gap: 6,
  },
  disconnectButtonConsumer: {
    backgroundColor: colors.primary,
  },
  disconnectText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});

export default ConnectionCard;
