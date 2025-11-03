
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';

export default function P2PInfoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>About P2P Network</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <IconSymbol name="wifi" size={64} color={colors.primary} />
          <Text style={styles.heroTitle}>Share Internet, Earn Money</Text>
          <Text style={styles.heroSubtitle}>
            Connect with people in far locations and share your internet connection securely
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol name="lock.shield.fill" size={28} color={colors.success} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Secure & Decentralized</Text>
              <Text style={styles.featureText}>
                All connections are encrypted end-to-end using blockchain-based authentication. 
                Your data never passes through centralized servers.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={28} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Real-time Monitoring</Text>
              <Text style={styles.featureText}>
                Track bandwidth usage, connection quality, and earnings in real-time with 
                detailed analytics and performance metrics.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol name="dollarsign.circle.fill" size={28} color={colors.warning} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Dynamic Pricing</Text>
              <Text style={styles.featureText}>
                Prices automatically adjust based on demand and distance. Earn more during 
                peak hours and in high-demand areas.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol name="creditcard.fill" size={28} color={colors.success} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Stripe Integration</Text>
              <Text style={styles.featureText}>
                Seamless payments powered by Stripe. Withdraw your earnings instantly to 
                your bank account or card.
              </Text>
            </View>
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Enable Sharing</Text>
              <Text style={styles.stepText}>
                Turn on internet sharing in the P2P tab. Set your preferences for 
                bandwidth limits and pricing.
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Connect with Peers</Text>
              <Text style={styles.stepText}>
                Nearby users looking for internet will discover your node. They can 
                connect automatically based on your settings.
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Monitor & Earn</Text>
              <Text style={styles.stepText}>
                Watch real-time bandwidth usage and earnings. Disconnect peers anytime 
                or adjust your settings.
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Get Paid</Text>
              <Text style={styles.stepText}>
                Withdraw your earnings via Stripe once you reach the minimum threshold 
                of $10.00.
              </Text>
            </View>
          </View>
        </View>

        {/* Pricing Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing Model</Text>

          <View style={styles.pricingCard}>
            <Text style={styles.pricingTitle}>Base Rate</Text>
            <Text style={styles.pricingValue}>$0.05 per GB</Text>
            <Text style={styles.pricingDescription}>
              Starting price for data transfer
            </Text>
          </View>

          <View style={styles.pricingCard}>
            <Text style={styles.pricingTitle}>Demand Multiplier</Text>
            <Text style={styles.pricingValue}>1.0x - 2.5x</Text>
            <Text style={styles.pricingDescription}>
              Increases during high demand periods
            </Text>
          </View>

          <View style={styles.pricingCard}>
            <Text style={styles.pricingTitle}>Distance Multiplier</Text>
            <Text style={styles.pricingValue}>1.0x - 1.8x</Text>
            <Text style={styles.pricingDescription}>
              Higher rates for longer distances
            </Text>
          </View>

          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>Example Calculation</Text>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabel}>Base Rate:</Text>
              <Text style={styles.exampleValue}>$0.05/GB</Text>
            </View>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabel}>Demand (High):</Text>
              <Text style={styles.exampleValue}>× 2.0</Text>
            </View>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabel}>Distance (Far):</Text>
              <Text style={styles.exampleValue}>× 1.8</Text>
            </View>
            <View style={[styles.exampleRow, styles.exampleTotal]}>
              <Text style={styles.exampleTotalLabel}>Final Rate:</Text>
              <Text style={styles.exampleTotalValue}>$0.18/GB</Text>
            </View>
          </View>
        </View>

        {/* Safety & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety & Security</Text>

          <View style={styles.safetyCard}>
            <IconSymbol name="checkmark.shield.fill" size={24} color={colors.success} />
            <Text style={styles.safetyText}>
              End-to-end encryption for all data transfers
            </Text>
          </View>

          <View style={styles.safetyCard}>
            <IconSymbol name="checkmark.shield.fill" size={24} color={colors.success} />
            <Text style={styles.safetyText}>
              Blockchain-based identity verification
            </Text>
          </View>

          <View style={styles.safetyCard}>
            <IconSymbol name="checkmark.shield.fill" size={24} color={colors.success} />
            <Text style={styles.safetyText}>
              No centralized data storage or logging
            </Text>
          </View>

          <View style={styles.safetyCard}>
            <IconSymbol name="checkmark.shield.fill" size={24} color={colors.success} />
            <Text style={styles.safetyText}>
              Automatic bandwidth throttling and limits
            </Text>
          </View>

          <View style={styles.safetyCard}>
            <IconSymbol name="checkmark.shield.fill" size={24} color={colors.success} />
            <Text style={styles.safetyText}>
              Secure payment processing via Stripe
            </Text>
          </View>
        </View>

        {/* Get Started Button */}
        <Pressable
          style={styles.getStartedButton}
          onPress={() => router.push('/(tabs)/p2p')}
        >
          <IconSymbol name="wifi" size={20} color={colors.white} />
          <Text style={styles.getStartedText}>Get Started</Text>
        </Pressable>
      </ScrollView>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  stepText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  pricingCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  pricingTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  pricingValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  pricingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  exampleCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exampleLabel: {
    fontSize: 14,
    color: colors.primary,
  },
  exampleValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  exampleTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  exampleTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  exampleTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  safetyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  safetyText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
    gap: 10,
    boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.3)',
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
});
