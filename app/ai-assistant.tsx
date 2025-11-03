
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { aiAssistantService, AIAssistantMessage } from '@/services/aiAssistantService';

export default function AIAssistantScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<AIAssistantMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    'How can I optimize my network?',
    'What are the best pricing strategies?',
    'How do I improve connection quality?',
  ]);

  useEffect(() => {
    // Load conversation history
    setMessages(aiAssistantService.getHistory());
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) {
      return;
    }

    const userMessage = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      const response = await aiAssistantService.sendMessage(userMessage);
      setMessages(aiAssistantService.getHistory());

      // Get new suggestions
      const newSuggestions = await aiAssistantService.getQuickSuggestions(response.content);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

  const handleClearHistory = () => {
    aiAssistantService.clearHistory();
    setMessages([]);
    setSuggestions([
      'How can I optimize my network?',
      'What are the best pricing strategies?',
      'How do I improve connection quality?',
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.primary} />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <IconSymbol name="sparkles" size={24} color={colors.primary} />
          <Text style={styles.headerTitle}>AI Assistant</Text>
        </View>
        <Pressable style={styles.clearButton} onPress={handleClearHistory}>
          <IconSymbol name="trash" size={20} color={colors.error} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="sparkles" size={64} color={colors.primary} />
              <Text style={styles.emptyTitle}>AI-Powered Assistant</Text>
              <Text style={styles.emptyText}>
                Ask me anything about network optimization, pricing strategies, VPS configuration, or troubleshooting.
              </Text>
              <View style={styles.featuresContainer}>
                <View style={styles.featureItem}>
                  <IconSymbol name="chart.line.uptrend.xyaxis" size={20} color={colors.success} />
                  <Text style={styles.featureText}>Network Optimization</Text>
                </View>
                <View style={styles.featureItem}>
                  <IconSymbol name="dollarsign.circle" size={20} color={colors.success} />
                  <Text style={styles.featureText}>Pricing Recommendations</Text>
                </View>
                <View style={styles.featureItem}>
                  <IconSymbol name="server.rack" size={20} color={colors.success} />
                  <Text style={styles.featureText}>VPS Configuration</Text>
                </View>
              </View>
            </View>
          ) : (
            messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                {message.role === 'assistant' && (
                  <View style={styles.assistantIcon}>
                    <IconSymbol name="sparkles" size={16} color={colors.primary} />
                  </View>
                )}
                <Text
                  style={[
                    styles.messageText,
                    message.role === 'user' ? styles.userText : styles.assistantText,
                  ]}
                >
                  {message.content}
                </Text>
              </View>
            ))
          )}

          {isLoading && (
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              <View style={styles.assistantIcon}>
                <IconSymbol name="sparkles" size={16} color={colors.primary} />
              </View>
              <ActivityIndicator color={colors.primary} />
            </View>
          )}
        </ScrollView>

        {/* Quick Suggestions */}
        {!isLoading && messages.length > 0 && (
          <ScrollView
            horizontal
            style={styles.suggestionsContainer}
            contentContainerStyle={styles.suggestionsContent}
            showsHorizontalScrollIndicator={false}
          >
            {suggestions.map((suggestion, index) => (
              <Pressable
                key={index}
                style={styles.suggestionChip}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything..."
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <Pressable
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <IconSymbol
              name="arrow.up.circle.fill"
              size={32}
              color={inputText.trim() && !isLoading ? colors.primary : colors.textSecondary}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 40,
    marginBottom: 32,
  },
  featuresContainer: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.cardBackground,
    flexDirection: 'row',
    gap: 12,
  },
  assistantIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: colors.white,
  },
  assistantText: {
    color: colors.text,
    flex: 1,
  },
  suggestionsContainer: {
    maxHeight: 50,
    marginBottom: 8,
  },
  suggestionsContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    marginBottom: 2,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
