
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface StatusBadgeProps {
  status: 'running' | 'stopped' | 'starting' | 'stopping' | 'error';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return colors.success;
      case 'stopped':
        return colors.secondary;
      case 'starting':
      case 'stopping':
        return colors.warning;
      case 'error':
        return colors.danger;
      default:
        return colors.secondary;
    }
  };

  const getStatusText = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor() + '20' }]}>
      <View style={[styles.dot, { backgroundColor: getStatusColor() }]} />
      <Text style={[styles.text, { color: getStatusColor() }]}>
        {getStatusText()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
