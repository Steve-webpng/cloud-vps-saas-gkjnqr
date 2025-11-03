
import { create } from 'zustand';
import {
  P2PConnection,
  BandwidthStats,
  PricingConfig,
  PaymentTransaction,
  NetworkNode,
  P2PSettings,
} from '@/types/p2p';

interface P2PStore {
  // State
  connections: P2PConnection[];
  availableNodes: NetworkNode[];
  bandwidthStats: BandwidthStats;
  pricingConfig: PricingConfig;
  transactions: PaymentTransaction[];
  settings: P2PSettings;
  isSharing: boolean;
  totalEarnings: number;
  totalSpent: number;
  loading: boolean;

  // Actions
  setConnections: (connections: P2PConnection[]) => void;
  addConnection: (connection: P2PConnection) => void;
  updateConnection: (id: string, updates: Partial<P2PConnection>) => void;
  removeConnection: (id: string) => void;
  setAvailableNodes: (nodes: NetworkNode[]) => void;
  updateBandwidthStats: (stats: Partial<BandwidthStats>) => void;
  setPricingConfig: (config: PricingConfig) => void;
  addTransaction: (transaction: PaymentTransaction) => void;
  updateSettings: (settings: Partial<P2PSettings>) => void;
  toggleSharing: () => void;
  setLoading: (loading: boolean) => void;
  calculateDynamicPrice: (distance: number, demand: 'low' | 'medium' | 'high') => number;
}

// Mock data
const mockPricingConfig: PricingConfig = {
  baseRate: 0.05, // $0.05 per GB
  demandFactors: {
    low: 1.0,
    medium: 1.5,
    high: 2.5,
  },
  locationFactors: {
    near: 1.0,
    medium: 1.3,
    far: 1.8,
  },
};

const mockSettings: P2PSettings = {
  autoConnect: false,
  maxConnections: 5,
  maxBandwidth: 100,
  minPrice: 0.03,
  maxPrice: 0.20,
  shareRadius: 10,
  allowedNetworkTypes: ['wifi', 'ethernet'],
};

const mockBandwidthStats: BandwidthStats = {
  current: {
    upload: 12.5,
    download: 8.3,
  },
  peak: {
    upload: 45.2,
    download: 38.7,
  },
  average: {
    upload: 18.4,
    download: 15.2,
  },
  total: 125.8,
};

const mockConnections: P2PConnection[] = [
  {
    id: '1',
    peerId: 'peer-001',
    peerName: 'Alice Johnson',
    peerLocation: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: '123 Market St, San Francisco, CA',
      distance: 2.3,
    },
    status: 'connected',
    connectionType: 'provider',
    bandwidth: {
      upload: 15.2,
      download: 0,
      total: 8.5,
    },
    pricing: {
      baseRate: 0.05,
      demandMultiplier: 1.5,
      locationMultiplier: 1.3,
      currentRate: 0.0975,
    },
    earnings: 0.83,
    startTime: new Date(Date.now() - 3600000).toISOString(),
    duration: 3600,
    quality: 'excellent',
  },
  {
    id: '2',
    peerId: 'peer-002',
    peerName: 'Bob Smith',
    peerLocation: {
      latitude: 37.7849,
      longitude: -122.4094,
      address: '456 Mission St, San Francisco, CA',
      distance: 5.7,
    },
    status: 'connected',
    connectionType: 'provider',
    bandwidth: {
      upload: 8.7,
      download: 0,
      total: 3.2,
    },
    pricing: {
      baseRate: 0.05,
      demandMultiplier: 2.0,
      locationMultiplier: 1.8,
      currentRate: 0.18,
    },
    earnings: 0.58,
    startTime: new Date(Date.now() - 1800000).toISOString(),
    duration: 1800,
    quality: 'good',
  },
];

const mockAvailableNodes: NetworkNode[] = [
  {
    id: 'node-001',
    name: 'FastNet Hub',
    location: {
      latitude: 37.7649,
      longitude: -122.4294,
      address: '789 Valencia St, San Francisco, CA',
    },
    available: true,
    bandwidth: {
      upload: 100,
      download: 100,
    },
    rating: 4.8,
    totalShared: 1250.5,
    price: 0.08,
    distance: 1.2,
  },
  {
    id: 'node-002',
    name: 'CloudShare Point',
    location: {
      latitude: 37.7949,
      longitude: -122.3994,
      address: '321 Howard St, San Francisco, CA',
    },
    available: true,
    bandwidth: {
      upload: 50,
      download: 50,
    },
    rating: 4.5,
    totalShared: 850.2,
    price: 0.06,
    distance: 3.8,
  },
  {
    id: 'node-003',
    name: 'MegaSpeed Network',
    location: {
      latitude: 37.8049,
      longitude: -122.4394,
      address: '555 Folsom St, San Francisco, CA',
    },
    available: true,
    bandwidth: {
      upload: 200,
      download: 200,
    },
    rating: 4.9,
    totalShared: 2100.8,
    price: 0.12,
    distance: 6.5,
  },
  {
    id: 'node-004',
    name: 'QuickLink Station',
    location: {
      latitude: 37.7549,
      longitude: -122.4494,
      address: '888 Bryant St, San Francisco, CA',
    },
    available: false,
    bandwidth: {
      upload: 75,
      download: 75,
    },
    rating: 4.3,
    totalShared: 620.3,
    price: 0.07,
    distance: 2.9,
  },
];

const mockTransactions: PaymentTransaction[] = [
  {
    id: 'txn-001',
    type: 'earning',
    amount: 0.83,
    currency: 'USD',
    status: 'completed',
    connectionId: '1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    stripePaymentId: 'pi_1234567890',
  },
  {
    id: 'txn-002',
    type: 'earning',
    amount: 0.58,
    currency: 'USD',
    status: 'completed',
    connectionId: '2',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    stripePaymentId: 'pi_0987654321',
  },
];

export const useP2PStore = create<P2PStore>((set, get) => ({
  connections: mockConnections,
  availableNodes: mockAvailableNodes,
  bandwidthStats: mockBandwidthStats,
  pricingConfig: mockPricingConfig,
  transactions: mockTransactions,
  settings: mockSettings,
  isSharing: true,
  totalEarnings: 1.41,
  totalSpent: 0,
  loading: false,

  setConnections: (connections) => set({ connections }),

  addConnection: (connection) =>
    set((state) => ({
      connections: [...state.connections, connection],
    })),

  updateConnection: (id, updates) =>
    set((state) => ({
      connections: state.connections.map((conn) =>
        conn.id === id ? { ...conn, ...updates } : conn
      ),
    })),

  removeConnection: (id) =>
    set((state) => ({
      connections: state.connections.filter((conn) => conn.id !== id),
    })),

  setAvailableNodes: (nodes) => set({ availableNodes: nodes }),

  updateBandwidthStats: (stats) =>
    set((state) => ({
      bandwidthStats: { ...state.bandwidthStats, ...stats },
    })),

  setPricingConfig: (config) => set({ pricingConfig: config }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
      totalEarnings:
        transaction.type === 'earning'
          ? state.totalEarnings + transaction.amount
          : state.totalEarnings,
      totalSpent:
        transaction.type === 'payment'
          ? state.totalSpent + transaction.amount
          : state.totalSpent,
    })),

  updateSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),

  toggleSharing: () =>
    set((state) => {
      console.log('Toggling sharing:', !state.isSharing);
      return { isSharing: !state.isSharing };
    }),

  setLoading: (loading) => set({ loading }),

  calculateDynamicPrice: (distance, demand) => {
    const { pricingConfig } = get();
    const { baseRate, demandFactors, locationFactors } = pricingConfig;

    let locationMultiplier = locationFactors.near;
    if (distance > 5) {
      locationMultiplier = locationFactors.far;
    } else if (distance > 1) {
      locationMultiplier = locationFactors.medium;
    }

    const demandMultiplier = demandFactors[demand];
    const finalPrice = baseRate * demandMultiplier * locationMultiplier;

    return Math.round(finalPrice * 1000) / 1000; // Round to 3 decimal places
  },
}));
