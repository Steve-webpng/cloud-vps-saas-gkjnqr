
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';
import { useP2PStore } from '@/stores/p2pStore';

export default function PaymentScreen() {
  const router = useRouter();
  const { totalEarnings, transactions } = useP2PStore();

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handleWithdraw = async () => {
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }

    if (totalEarnings < 10) {
      Alert.alert('Minimum Withdrawal', 'Minimum withdrawal amount is $10.00');
      return;
    }

    setIsProcessing(true);

    // Simulate Stripe payment processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Withdrawal Successful',
        `$${totalEarnings.toFixed(2)} has been transferred to your card ending in ${cardNumber.slice(-4)}`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 2000);
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Payment & Earnings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Earnings Card */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <IconSymbol name="dollarsign.circle.fill" size={48} color={colors.success} />
            <View style={styles.earningsInfo}>
              <Text style={styles.earningsLabel}>Available Balance</Text>
              <Text style={styles.earningsAmount}>${totalEarnings.toFixed(2)}</Text>
            </View>
          </View>
          <Text style={styles.earningsNote}>
            Minimum withdrawal: $10.00
          </Text>
        </View>

        {/* Stripe Integration Notice */}
        <View style={styles.stripeCard}>
          <IconSymbol name="creditcard.fill" size={24} color={colors.primary} />
          <View style={styles.stripeInfo}>
            <Text style={styles.stripeTitle}>Powered by Stripe</Text>
            <Text style={styles.stripeText}>
              Secure payment processing with industry-leading encryption
            </Text>
          </View>
        </View>

        {/* Card Details Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Withdrawal Method</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              value={cardholderName}
              onChangeText={setCardholderName}
              placeholder="John Doe"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.input}
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              maxLength={19}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                placeholder="MM/YY"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                value={cvv}
                onChangeText={(text) => setCvv(text.replace(/\D/g, '').substring(0, 3))}
                placeholder="123"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>

          <Pressable
            style={[styles.withdrawButton, (isProcessing || totalEarnings < 10) && styles.withdrawButtonDisabled]}
            onPress={handleWithdraw}
            disabled={isProcessing || totalEarnings < 10}
          >
            {isProcessing ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <IconSymbol name="arrow.down.circle.fill" size={20} color={colors.white} />
                <Text style={styles.withdrawText}>
                  Withdraw ${totalEarnings.toFixed(2)}
                </Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="doc.text" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          ) : (
            recentTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionIcon}>
                  <IconSymbol
                    name={transaction.type === 'earning' ? 'arrow.down.circle.fill' : 'arrow.up.circle.fill'}
                    size={24}
                    color={transaction.type === 'earning' ? colors.success : colors.error}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionType}>
                    {transaction.type === 'earning' ? 'Earning' : 'Payment'}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text
                    style={[
                      styles.transactionValue,
                      transaction.type === 'earning' ? styles.transactionEarning : styles.transactionPayment,
                    ]}
                  >
                    {transaction.type === 'earning' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      transaction.status === 'completed' && styles.statusCompleted,
                      transaction.status === 'pending' && styles.statusPending,
                      transaction.status === 'failed' && styles.statusFailed,
                    ]}
                  >
                    <Text style={styles.statusText}>{transaction.status}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Security Notice */}
        <View style={styles.securityCard}>
          <IconSymbol name="lock.shield.fill" size={24} color={colors.success} />
          <Text style={styles.securityText}>
            Your payment information is encrypted and secure. We never store your full card details.
          </Text>
        </View>
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
  earningsCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  earningsInfo: {
    marginLeft: 16,
    flex: 1,
  },
  earningsLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.success,
  },
  earningsNote: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  stripeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  stripeInfo: {
    marginLeft: 12,
    flex: 1,
  },
  stripeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  stripeText: {
    fontSize: 13,
    color: colors.primary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    gap: 8,
  },
  withdrawButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  withdrawText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  transactionEarning: {
    color: colors.success,
  },
  transactionPayment: {
    color: colors.error,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusCompleted: {
    backgroundColor: colors.successLight,
  },
  statusPending: {
    backgroundColor: colors.warningLight,
  },
  statusFailed: {
    backgroundColor: colors.errorLight,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    borderRadius: 12,
    padding: 16,
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: colors.success,
    marginLeft: 12,
    lineHeight: 18,
  },
});
