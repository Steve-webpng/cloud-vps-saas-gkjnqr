
export interface P2PConnection {
  id: string;
  peerId: string;
  peerName: string;
  peerLocation: {
    latitude: number;
    longitude: number;
    address: string;
    distance: number; // in km
  };
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  connectionType: 'provider' | 'consumer'; // Are we sharing or receiving?
  bandwidth: {
    upload: number; // Mbps
    download: number; // Mbps
    total: number; // GB transferred
  };
  pricing: {
    baseRate: number; // per GB
    demandMultiplier: number; // 1.0 - 3.0
    locationMultiplier: number; // 1.0 - 2.0
    currentRate: number; // calculated rate
  };
  earnings?: number; // if provider
  cost?: number; // if consumer
  startTime: string;
  duration: number; // in seconds
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface BandwidthStats {
  current: {
    upload: number;
    download: number;
  };
  peak: {
    upload: number;
    download: number;
  };
  average: {
    upload: number;
    download: number;
  };
  total: number; // GB
}

export interface PricingConfig {
  baseRate: number; // per GB
  demandFactors: {
    low: number;
    medium: number;
    high: number;
  };
  locationFactors: {
    near: number; // < 1km
    medium: number; // 1-5km
    far: number; // > 5km
  };
}

export interface PaymentTransaction {
  id: string;
  type: 'earning' | 'payment';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  connectionId: string;
  timestamp: string;
  stripePaymentId?: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  available: boolean;
  bandwidth: {
    upload: number;
    download: number;
  };
  rating: number;
  totalShared: number; // GB
  price: number; // per GB
  distance?: number; // calculated
}

export interface P2PSettings {
  autoConnect: boolean;
  maxConnections: number;
  maxBandwidth: number; // Mbps
  minPrice: number;
  maxPrice: number;
  shareRadius: number; // km
  allowedNetworkTypes: ('wifi' | 'cellular' | 'ethernet')[];
}
