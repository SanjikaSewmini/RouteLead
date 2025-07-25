import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Base configuration
// For React Native, we need to use the actual IP address instead of localhost
const getApiBaseUrl = () => {
  if (Platform.OS === 'android') {
    // For Android emulator and physical device, use the host machine's IP address
    // 10.0.2.2 often doesn't work, so we use the actual IP address
    return 'http://192.168.8.144:8080/api';
  } else if (Platform.OS === 'ios') {
    // For iOS simulator, localhost should work
    // For physical iOS device, use your machine's IP address
    return 'http://192.168.8.144:8080/api';
  } else {
    // For web/other platforms
    return 'http://localhost:8080/api';
  }
};

// Use actual IP address for all platforms to ensure connectivity
const API_BASE_URL = 'https://528069faa0ff.ngrok-free.app/api';

// Debug log to show which API URL is being used
console.log('API Base URL:', API_BASE_URL);

// Test function for debugging API connectivity
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection to:', API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/earnings/history?driverId=797c6f16-a06a-46b4-ae9f-9ded8aa4ab27`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('API Test Response status:', response.status);
    const data = await response.json();
    console.log('API Test Response data:', data);
    return { success: true, data };
  } catch (error) {
    console.error('API Test Error:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};

// Types for API responses
export interface EarningsSummary {
  driverId: string;
  todayEarnings: number;
  weeklyEarnings: number;
  availableBalance: number;
  pendingAmount: number;
  totalEarnings: number;
  pendingBidsCount: number;
}

export interface EarningsHistory {
  id: string;
  driverId: string;
  bidId: string;
  grossAmount: number;
  appFee: number;
  netAmount: number;
  status: 'PENDING' | 'AVAILABLE' | 'WITHDRAWN';
  earnedAt: string;
  updatedAt?: string;
  customerName?: string;
  customerPhone?: string;
  routeDescription?: string;
  // API returns these as coordinates from routes table
  originLocation?: string;
  destinationLocation?: string;
  // Legacy fields for backward compatibility
  fromLocation?: string;
  toLocation?: string;
  fromLatitude?: number;
  fromLongitude?: number;
  toLatitude?: number;
  toLongitude?: number;
  // Additional fields from API response
  routeId?: string;
  offeredPrice?: number;
  parcelDescription?: string;
}

export interface PendingBid {
  id: string;
  routeId: string;
  customerId: string;
  customerName: string;
  fromLocation: string;
  toLocation: string;
  amount: number;
  status: string;
  createdAt: string;
}

// API utility functions
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }
  return response.json();
};

// API Service
export class ApiService {
  
  // Earnings API
  static async getEarningsSummary(driverId: string): Promise<EarningsSummary> {
    console.log(`Fetching earnings summary from: ${API_BASE_URL}/earnings/summary?driverId=${driverId}`);
    const response = await fetch(
      `${API_BASE_URL}/earnings/summary?driverId=${driverId}`,
      {
        method: 'GET',
        headers: await getAuthHeaders(),
      }
    );
    console.log('Earnings summary response status:', response.status);
    const json = await handleApiResponse(response);
    return json.data;
  }

  static async getEarningsHistory(
    driverId: string, 
    status?: 'PENDING' | 'AVAILABLE' | 'WITHDRAWN'
  ): Promise<EarningsHistory[]> {
    let url = `${API_BASE_URL}/earnings/history?driverId=${driverId}`;
    if (status) {
      url += `&status=${status}`;
    }
    
    console.log(`Fetching earnings history from: ${url}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });
    console.log('Earnings history response status:', response.status);
    const json = await handleApiResponse(response);
    return json.data || [];
  }

  static async updateEarningsStatus(earningsId: string, status: 'PENDING' | 'AVAILABLE' | 'WITHDRAWN'): Promise<EarningsHistory> {
    const response = await fetch(
      `${API_BASE_URL}/earnings/${earningsId}/status`,
      {
        method: 'PATCH',
        headers: await getAuthHeaders(),
        body: JSON.stringify({ status }),
      }
    );
    const json = await handleApiResponse(response);
    return json.data;
  }

  // Bids API (mock for now)
  static async getPendingBids(driverId: string): Promise<PendingBid[]> {
    try {
      // This would be replaced with actual API call when bids endpoint is ready
      // const response = await fetch(`${API_BASE_URL}/bids/pending?driverId=${driverId}`, ...);
      
      // Mock data for now
      return [
        {
          id: 'bid-1',
          routeId: 'route-1',
          customerId: 'customer-1',
          customerName: 'Alice Johnson',
          fromLocation: 'Kandy',
          toLocation: 'Jaffna',
          amount: 1200.00,
          status: 'PENDING',
          createdAt: '2025-07-08T10:00:00Z',
        },
        {
          id: 'bid-2',
          routeId: 'route-2',
          customerId: 'customer-2',
          customerName: 'Bob Wilson',
          fromLocation: 'Galle',
          toLocation: 'Trincomalee',
          amount: 950.00,
          status: 'PENDING',
          createdAt: '2025-07-08T09:30:00Z',
        },
      ];
    } catch (error) {
      console.error('Error fetching pending bids:', error);
      return [];
    }
  }

  // Routes API
  static async getCompletedRoutesCount(driverId: string): Promise<number> {
    try {
      // For now, we'll return a mock count since we don't have the routes endpoint yet
      // When the routes API is ready, this would be:
      // const response = await fetch(`${API_BASE_URL}/routes/completed-count?driverId=${driverId}`, ...);
      
      // Mock data - return a realistic number based on the driver
      return 8; // Example: driver has completed 8 routes
    } catch (error) {
      console.error('Error fetching completed routes count:', error);
      return 0;
    }
  }
};

// Utility functions for formatting
export const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'LKR 0.00';
  }
  return `LKR ${amount.toFixed(2)}`;
};

export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn('Invalid date string for formatDate:', dateString);
    return 'Invalid Date';
  }
  return date.toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string | undefined | null): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn('Invalid date string for formatDateTime:', dateString);
    return 'Invalid Date';
  }
  return date.toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Utility function to format location from coordinates or text
export const formatLocation = async (locationString: string | undefined | null): Promise<string> => {
  if (!locationString) return 'Unknown Location';
  
  // Check if it's coordinates in format "lat, lng"
  const coordMatch = locationString.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);
    
    // Import geocoding service dynamically to avoid circular dependencies
    const { reverseGeocode } = await import('./geocodingService');
    return reverseGeocode(lat, lng);
  }
  
  return locationString;
};

// Synchronous version for immediate display (shows better formatted coordinates first, then updates)
export const formatLocationSync = (locationString: string | undefined | null): string => {
  if (!locationString) return 'Unknown Location';
  
  // Check if it's coordinates in format "lat, lng"
  const coordMatch = locationString.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);
    
    // Provide better immediate display for Sri Lankan coordinates
    if (lat >= 5.9 && lat <= 9.9 && lng >= 79.5 && lng <= 81.9) {
      return `Location in Sri Lanka (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
    }
    
    return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }
  
  return locationString;
};

// Function to get route description from earnings history (synchronous version)
export const getRouteDescription = (earning: EarningsHistory): string => {
  // First priority: show pickup and dropoff locations
  const fromLoc = earning.fromLocation || earning.originLocation;
  const toLoc = earning.toLocation || earning.destinationLocation;
  
  if (fromLoc && toLoc) {
    return `${formatLocationSync(fromLoc)} → ${formatLocationSync(toLoc)}`;
  }
  
  // Second priority: route description if no locations
  if (earning.routeDescription) {
    return earning.routeDescription;
  }
  
  // Third priority: parcel description with customer info
  if (earning.parcelDescription && earning.customerName) {
    return `${earning.customerName}: ${earning.parcelDescription}`;
  }
  
  // Fourth priority: just parcel description
  if (earning.parcelDescription) {
    return `Delivery: ${earning.parcelDescription}`;
  }
  
  // Fallback: customer name or generic
  if (earning.customerName) {
    return `Delivery for ${earning.customerName}`;
  }
  
  return 'Package Delivery';
};

// Async version that resolves place names
export const getRouteDescriptionAsync = async (earning: EarningsHistory): Promise<string> => {
  // First priority: show pickup and dropoff locations
  const fromLoc = earning.fromLocation || earning.originLocation;
  const toLoc = earning.toLocation || earning.destinationLocation;
  
  if (fromLoc && toLoc) {
    const [fromPlace, toPlace] = await Promise.all([
      formatLocation(fromLoc),
      formatLocation(toLoc)
    ]);
    return `${fromPlace} → ${toPlace}`;
  }
  
  // Second priority: route description if no locations
  if (earning.routeDescription) {
    return earning.routeDescription;
  }
  
  // Third priority: parcel description with customer info
  if (earning.parcelDescription && earning.customerName) {
    return `${earning.customerName}: ${earning.parcelDescription}`;
  }
  
  // Fourth priority: just parcel description
  if (earning.parcelDescription) {
    return `Delivery: ${earning.parcelDescription}`;
  }
  
  // Fallback: customer name or generic
  if (earning.customerName) {
    return `Delivery for ${earning.customerName}`;
  }
  
  return 'Package Delivery';
};
