
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor?: string;
  subtitle?: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  iconColor = colors.primary,
  subtitle 
}: StatCardProps) {
  return (
    <View style={[commonStyles.card, styles.container]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <IconSymbol name={icon as any} size={24} color={iconColor} />
        </View>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 150,
  },
  header: {
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
