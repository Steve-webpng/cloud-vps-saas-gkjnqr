
import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import StatusBadge from './StatusBadge';
import { VPSInstance } from '@/types/vps';
import { useRouter } from 'expo-router';

interface VPSCardProps {
  instance: VPSInstance;
  onAction?: (action: 'start' | 'stop' | 'restart', id: string) => void;
}

export default function VPSCard({ instance, onAction }: VPSCardProps) {
  const router = useRouter();

  const handleAction = (action: 'start' | 'stop' | 'restart') => {
    if (onAction) {
      onAction(action, instance.id);
    } else {
      Alert.alert('Action', `${action} ${instance.name}`);
    }
  };

  const handlePress = () => {
    console.log('Navigate to VPS details:', instance.id);
    Alert.alert('VPS Details', `View details for ${instance.name}`);
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={commonStyles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{instance.name}</Text>
            <StatusBadge status={instance.status} />
          </View>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <IconSymbol name="globe" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>{instance.region}</Text>
          </View>
          <View style={styles.infoItem}>
            <IconSymbol name="network" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>{instance.ipAddress}</Text>
          </View>
        </View>

        {instance.domain && (
          <View style={styles.domainRow}>
            <IconSymbol name="link" size={16} color={colors.accent} />
            <Text style={styles.domainText}>{instance.domain}</Text>
          </View>
        )}

        <View style={styles.specsRow}>
          <View style={styles.specItem}>
            <Text style={styles.specValue}>{instance.cpu}</Text>
            <Text style={styles.specLabel}>vCPU</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specValue}>{instance.ram}GB</Text>
            <Text style={styles.specLabel}>RAM</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specValue}>{instance.storage}GB</Text>
            <Text style={styles.specLabel}>Storage</Text>
          </View>
        </View>

        <View style={styles.actions}>
          {instance.status === 'stopped' ? (
            <Pressable 
              style={[styles.actionButton, { backgroundColor: colors.success + '20' }]}
              onPress={() => handleAction('start')}
            >
              <IconSymbol name="play.fill" size={16} color={colors.success} />
              <Text style={[styles.actionText, { color: colors.success }]}>Start</Text>
            </Pressable>
          ) : (
            <Pressable 
              style={[styles.actionButton, { backgroundColor: colors.danger + '20' }]}
              onPress={() => handleAction('stop')}
            >
              <IconSymbol name="stop.fill" size={16} color={colors.danger} />
              <Text style={[styles.actionText, { color: colors.danger }]}>Stop</Text>
            </Pressable>
          )}
          
          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.warning + '20' }]}
            onPress={() => handleAction('restart')}
            disabled={instance.status === 'stopped'}
          >
            <IconSymbol name="arrow.clockwise" size={16} color={colors.warning} />
            <Text style={[styles.actionText, { color: colors.warning }]}>Restart</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.highlight,
    borderRadius: 8,
  },
  domainText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '500',
  },
  specsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  specItem: {
    alignItems: 'center',
  },
  specValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  specLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
