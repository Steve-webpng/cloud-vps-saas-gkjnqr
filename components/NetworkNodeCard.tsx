
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { NetworkNode } from '@/types/p2p';
import { IconSymbol } from './IconSymbol';

interface NetworkNodeCardProps {
  node: NetworkNode;
  onConnect?: (nodeId: string) => void;
}

const NetworkNodeCard: React.FC<NetworkNodeCardProps> = ({ node, onConnect }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <IconSymbol key={`full-${i}`} name="star.fill" size={12} color={colors.warning} />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <IconSymbol key="half" name="star.leadinghalf.filled" size={12} color={colors.warning} />
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <IconSymbol key={`empty-${i}`} name="star" size={12} color={colors.textSecondary} />
      );
    }
    return stars;
  };

  return (
    <View style={[styles.container, !node.available && styles.unavailable]}>
      <View style={styles.header}>
        <View style={styles.nodeInfo}>
          <View style={styles.iconContainer}>
            <IconSymbol name="wifi" size={24} color={node.available ? colors.primary : colors.textSecondary} />
          </View>
          <View style={styles.nodeDetails}>
            <Text style={styles.nodeName}>{node.name}</Text>
            <View style={styles.ratingContainer}>
              {renderStars(node.rating)}
              <Text style={styles.ratingText}>{node.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
        {!node.available && (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Offline</Text>
          </View>
        )}
      </View>

      <View style={styles.locationContainer}>
        <IconSymbol name="location.fill" size={14} color={colors.textSecondary} />
        <Text style={styles.locationText} numberOfLines={1}>
          {node.location.address}
        </Text>
      </View>

      {node.distance !== undefined && (
        <View style={styles.distanceContainer}>
          <IconSymbol name="map.fill" size={14} color={colors.primary} />
          <Text style={styles.distanceText}>{node.distance.toFixed(1)} km away</Text>
        </View>
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <IconSymbol name="arrow.up.arrow.down" size={16} color={colors.primary} />
          <Text style={styles.statLabel}>Bandwidth</Text>
          <Text style={styles.statValue}>
            {node.bandwidth.upload}/{node.bandwidth.download} Mbps
          </Text>
        </View>
        <View style={styles.statItem}>
          <IconSymbol name="chart.line.uptrend.xyaxis" size={16} color={colors.success} />
          <Text style={styles.statLabel}>Shared</Text>
          <Text style={styles.statValue}>{node.totalShared.toFixed(1)} GB</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price:</Text>
          <Text style={styles.priceValue}>${node.price.toFixed(3)}/GB</Text>
        </View>
        {node.available && onConnect && (
          <Pressable
            style={styles.connectButton}
            onPress={() => onConnect(node.id)}
          >
            <IconSymbol name="link" size={16} color={colors.white} />
            <Text style={styles.connectText}>Connect</Text>
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
  unavailable: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nodeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nodeDetails: {
    flex: 1,
  },
  nodeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  unavailableBadge: {
    backgroundColor: colors.errorLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unavailableText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.error,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  distanceText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 10,
    gap: 6,
  },
  connectText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});

export default NetworkNodeCard;
