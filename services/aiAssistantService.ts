
/**
 * AI Assistant Service
 * 
 * Provides AI-powered assistance throughout the app using Gemini API
 */

import { geminiService } from './geminiService';

export interface AIAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

class AIAssistantService {
  private conversationHistory: AIAssistantMessage[] = [];

  /**
   * Send a message to the AI assistant
   */
  async sendMessage(userMessage: string): Promise<AIAssistantMessage> {
    // Add user message to history
    const userMsg: AIAssistantMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    this.conversationHistory.push(userMsg);

    // Build conversation context
    const context = this.conversationHistory
      .slice(-6) // Last 3 exchanges
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    // Get AI response
    const response = await geminiService.getChatResponse(userMessage, context);

    // Add assistant message to history
    const assistantMsg: AIAssistantMessage = {
      id: `msg_${Date.now()}_assistant`,
      role: 'assistant',
      content: response.success ? response.text : 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date().toISOString(),
    };

    this.conversationHistory.push(assistantMsg);

    return assistantMsg;
  }

  /**
   * Get conversation history
   */
  getHistory(): AIAssistantMessage[] {
    return this.conversationHistory;
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get quick suggestions based on current context
   */
  async getQuickSuggestions(context: string): Promise<string[]> {
    const prompt = `Based on this context: "${context}", provide 3 short question suggestions (max 8 words each) that a user might ask. Format as a simple list, one per line.`;

    const response = await geminiService.generateContent({ prompt, maxTokens: 150 });

    if (response.success) {
      return response.text
        .split('\n')
        .filter(line => line.trim().length > 0)
        .slice(0, 3);
    }

    return [
      'How can I optimize my network?',
      'What are the best pricing strategies?',
      'How do I improve connection quality?',
    ];
  }
}

export const aiAssistantService = new AIAssistantService();
