
export interface VPSInstance {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'starting' | 'stopping' | 'error';
  region: string;
  ipAddress: string;
  cpu: number;
  ram: number;
  storage: number;
  os: string;
  createdAt: string;
  domain?: string;
}

export interface BillingInfo {
  currentBalance: number;
  monthlySpend: number;
  nextBillingDate: string;
  paymentMethod: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  avatar?: string;
}

export interface DashboardStats {
  totalInstances: number;
  runningInstances: number;
  totalBandwidth: number;
  monthlySpend: number;
}
