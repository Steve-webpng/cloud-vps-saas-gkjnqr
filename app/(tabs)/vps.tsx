
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useVPSStore } from '@/stores/vpsStore';
import VPSCard from '@/components/VPSCard';

export default function VPSScreen() {
  const { instances, updateInstanceStatus } = useVPSStore();
  const [filter, setFilter] = useState<'all' | 'running' | 'stopped'>('all');

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
    Alert.alert('Create VPS', 'This feature will allow you to create a new VPS instance with custom configuration');
  };

  const filteredInstances = instances.filter((instance) => {
    if (filter === 'all') return true;
    return instance.status === filter;
  });

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VPS Instances</Text>
        <Pressable onPress={handleCreateVPS} style={styles.createButton}>
          <IconSymbol name="plus.circle.fill" size={28} color={colors.primary} />
        </Pressable>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <Pressable
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All ({instances.length})
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.filterTab, filter === 'running' && styles.filterTabActive]}
          onPress={() => setFilter('running')}
        >
          <Text style={[styles.filterText, filter === 'running' && styles.filterTextActive]}>
            Running ({instances.filter(i => i.status === 'running').length})
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.filterTab, filter === 'stopped' && styles.filterTabActive]}
          onPress={() => setFilter('stopped')}
        >
          <Text style={[styles.filterText, filter === 'stopped' && styles.filterTextActive]}>
            Stopped ({instances.filter(i => i.status === 'stopped').length})
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredInstances.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="server.rack" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateTitle}>No instances found</Text>
            <Text style={styles.emptyStateText}>
              {filter === 'all' 
                ? 'Create your first VPS instance to get started'
                : `No ${filter} instances at the moment`}
            </Text>
            {filter === 'all' && (
              <Pressable style={styles.emptyStateButton} onPress={handleCreateVPS}>
                <Text style={styles.emptyStateButtonText}>Create Instance</Text>
              </Pressable>
            )}
          </View>
        ) : (
          filteredInstances.map((instance) => (
            <VPSCard
              key={instance.id}
              instance={instance}
              onAction={handleVPSAction}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  createButton: {
    padding: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.card,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
});
