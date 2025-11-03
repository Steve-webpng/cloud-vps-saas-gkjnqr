
import { create } from 'zustand';
import { VPSInstance, BillingInfo, UserProfile, DashboardStats } from '@/types/vps';

interface VPSStore {
  instances: VPSInstance[];
  billingInfo: BillingInfo;
  userProfile: UserProfile;
  dashboardStats: DashboardStats;
  loading: boolean;
  
  // Actions
  setInstances: (instances: VPSInstance[]) => void;
  updateInstanceStatus: (id: string, status: VPSInstance['status']) => void;
  setBillingInfo: (info: BillingInfo) => void;
  setUserProfile: (profile: UserProfile) => void;
  setDashboardStats: (stats: DashboardStats) => void;
  setLoading: (loading: boolean) => void;
}

// Mock data
const mockInstances: VPSInstance[] = [
  {
    id: '1',
    name: 'Production Server',
    status: 'running',
    region: 'us-east-1',
    ipAddress: '192.168.1.100',
    cpu: 4,
    ram: 8,
    storage: 100,
    os: 'Ubuntu 22.04',
    createdAt: '2024-01-15',
    domain: 'api.example.com',
  },
  {
    id: '2',
    name: 'Development Server',
    status: 'running',
    region: 'us-west-2',
    ipAddress: '192.168.1.101',
    cpu: 2,
    ram: 4,
    storage: 50,
    os: 'Ubuntu 22.04',
    createdAt: '2024-02-01',
    domain: 'dev.example.com',
  },
  {
    id: '3',
    name: 'Staging Server',
    status: 'stopped',
    region: 'eu-west-1',
    ipAddress: '192.168.1.102',
    cpu: 2,
    ram: 4,
    storage: 50,
    os: 'Debian 11',
    createdAt: '2024-02-10',
  },
];

const mockBillingInfo: BillingInfo = {
  currentBalance: 250.00,
  monthlySpend: 89.99,
  nextBillingDate: '2024-03-01',
  paymentMethod: 'Visa •••• 4242',
};

const mockUserProfile: UserProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  company: 'Tech Startup Inc.',
  phone: '+1 (555) 123-4567',
};

const mockDashboardStats: DashboardStats = {
  totalInstances: 3,
  runningInstances: 2,
  totalBandwidth: 1250,
  monthlySpend: 89.99,
};

export const useVPSStore = create<VPSStore>((set) => ({
  instances: mockInstances,
  billingInfo: mockBillingInfo,
  userProfile: mockUserProfile,
  dashboardStats: mockDashboardStats,
  loading: false,

  setInstances: (instances) => set({ instances }),
  
  updateInstanceStatus: (id, status) =>
    set((state) => ({
      instances: state.instances.map((instance) =>
        instance.id === id ? { ...instance, status } : instance
      ),
    })),

  setBillingInfo: (info) => set({ billingInfo: info }),
  
  setUserProfile: (profile) => set({ userProfile: profile }),
  
  setDashboardStats: (stats) => set({ dashboardStats: stats }),
  
  setLoading: (loading) => set({ loading }),
}));
