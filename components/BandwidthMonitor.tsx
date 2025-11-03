
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { BandwidthStats } from '@/types/p2p';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

interface BandwidthMonitorProps {
  stats: BandwidthStats;
  isActive?: boolean;
}

const BandwidthMonitor: React.FC<BandwidthMonitorProps> = ({ stats, isActive = true }) => {
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      pulseScale.value = withRepeat(
        withSequence(
          withSpring(1.05, { damping: 2 }),
          withSpring(1, { damping: 2 })
        ),
        -1,
        false
      );
    } else {
      pulseScale.value = withSpring(1);
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const getBarWidth = (value: number, max: number) => {
    return `${Math.min((value / max) * 100, 100)}%`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bandwidth Monitor</Text>
        {isActive && (
          <Animated.View style={[styles.statusIndicator, animatedStyle]} />
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <View style={styles.statLabel}>
            <Text style={styles.labelText}>Upload</Text>
            <Text style={styles.valueText}>{stats.current.upload.toFixed(1)} Mbps</Text>
          </View>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                styles.uploadBar,
                { width: getBarWidth(stats.current.upload, stats.peak.upload) },
              ]}
            />
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statLabel}>
            <Text style={styles.labelText}>Download</Text>
            <Text style={styles.valueText}>{stats.current.download.toFixed(1)} Mbps</Text>
          </View>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                styles.downloadBar,
                { width: getBarWidth(stats.current.download, stats.peak.download) },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Peak Upload</Text>
          <Text style={styles.summaryValue}>{stats.peak.upload.toFixed(1)} Mbps</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Peak Download</Text>
          <Text style={styles.summaryValue}>{stats.peak.download.toFixed(1)} Mbps</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Data</Text>
          <Text style={styles.summaryValue}>{stats.total.toFixed(2)} GB</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statRow: {
    marginBottom: 16,
  },
  statLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  barContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  uploadBar: {
    backgroundColor: colors.primary,
  },
  downloadBar: {
    backgroundColor: colors.success,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});

export default BandwidthMonitor;
