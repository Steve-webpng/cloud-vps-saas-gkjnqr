
/**
 * Gemini AI Service
 * 
 * Provides AI-powered features for the VPS hosting platform:
 * - Network optimization suggestions
 * - Bandwidth prediction
 * - Pricing recommendations
 * - Connection quality analysis
 * - Customer support chatbot
 */

import { API_CONFIG } from '@/config/apiConfig';

export interface GeminiRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
}

export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

class GeminiService {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = API_CONFIG.gemini.apiKey;
    this.baseUrl = API_CONFIG.gemini.baseUrl;
    this.model = API_CONFIG.gemini.model;
  }

  /**
   * Generate content using Gemini AI
   */
  async generateContent(request: GeminiRequest): Promise<GeminiResponse> {
    try {
      console.log('Gemini API: Generating content...');

      const response = await fetch(
        `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: request.context 
                      ? `${request.context}\n\n${request.prompt}` 
                      : request.prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: request.maxTokens || 1000,
              temperature: 0.7,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to generate content');
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      console.log('Gemini API: Content generated successfully');

      return {
        text,
        success: true,
      };
    } catch (error) {
      console.error('Gemini Service Error:', error);
      return {
        text: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get network optimization suggestions
   */
  async getNetworkOptimization(currentStats: {
    upload: number;
    download: number;
    connections: number;
  }): Promise<GeminiResponse> {
    const prompt = `As a network optimization expert, analyze these P2P network statistics and provide 3 specific optimization suggestions:

Current Stats:
- Upload Speed: ${currentStats.upload} Mbps
- Download Speed: ${currentStats.download} Mbps
- Active Connections: ${currentStats.connections}

Provide actionable recommendations to improve performance and earnings.`;

    return this.generateContent({ prompt, maxTokens: 500 });
  }

  /**
   * Predict optimal pricing based on demand and location
   */
  async predictOptimalPricing(data: {
    currentPrice: number;
    demand: string;
    distance: number;
    timeOfDay: string;
  }): Promise<GeminiResponse> {
    const prompt = `As a pricing optimization AI, suggest the optimal price per GB for P2P internet sharing:

Current Conditions:
- Current Price: $${data.currentPrice}/GB
- Demand Level: ${data.demand}
- Distance: ${data.distance} km
- Time: ${data.timeOfDay}

Provide a recommended price and brief explanation (2-3 sentences).`;

    return this.generateContent({ prompt, maxTokens: 300 });
  }

  /**
   * Analyze connection quality and suggest improvements
   */
  async analyzeConnectionQuality(quality: {
    latency: number;
    packetLoss: number;
    jitter: number;
  }): Promise<GeminiResponse> {
    const prompt = `Analyze this network connection quality and provide improvement suggestions:

Metrics:
- Latency: ${quality.latency}ms
- Packet Loss: ${quality.packetLoss}%
- Jitter: ${quality.jitter}ms

Rate the quality (excellent/good/fair/poor) and suggest 2-3 improvements.`;

    return this.generateContent({ prompt, maxTokens: 400 });
  }

  /**
   * Generate VPS configuration recommendations
   */
  async getVPSRecommendations(requirements: {
    purpose: string;
    expectedTraffic: string;
    budget: number;
  }): Promise<GeminiResponse> {
    const prompt = `As a VPS configuration expert, recommend optimal server specifications:

Requirements:
- Purpose: ${requirements.purpose}
- Expected Traffic: ${requirements.expectedTraffic}
- Budget: $${requirements.budget}/month

Suggest vCPU, RAM, storage, and region. Keep response concise (3-4 sentences).`;

    return this.generateContent({ prompt, maxTokens: 400 });
  }

  /**
   * Customer support chatbot
   */
  async getChatResponse(userMessage: string, conversationHistory?: string): Promise<GeminiResponse> {
    const context = `You are a helpful customer support assistant for a VPS hosting and P2P internet sharing platform. 
Be concise, friendly, and technical when needed. Focus on VPS management, P2P networking, billing, and troubleshooting.

${conversationHistory ? `Previous conversation:\n${conversationHistory}\n` : ''}`;

    return this.generateContent({ 
      prompt: userMessage, 
      context,
      maxTokens: 600,
    });
  }

  /**
   * Generate bandwidth usage forecast
   */
  async forecastBandwidth(historicalData: {
    dates: string[];
    usage: number[];
  }): Promise<GeminiResponse> {
    const prompt = `Based on this bandwidth usage history, predict usage for the next 7 days:

Historical Data:
${historicalData.dates.map((date, i) => `${date}: ${historicalData.usage[i]} GB`).join('\n')}

Provide a brief forecast with daily predictions and trend analysis (4-5 sentences).`;

    return this.generateContent({ prompt, maxTokens: 500 });
  }
}

export const geminiService = new GeminiService();
