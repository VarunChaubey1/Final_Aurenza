import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  createShopifyCustomer,
  loginShopifyCustomer,
  getShopifyCustomerDetails,
} from '../services/shopify';

const TOKEN_KEY = 'aurenza_shopify_customer_token';
const TOKEN_EXPIRY_KEY = 'aurenza_shopify_customer_token_expires';

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OrderHistoryItem {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number; image?: string }[];
  totalAmount: number;
  status: string;
  statusUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: UserAddress;
  orders: OrderHistoryItem[];
}

type AuthResult = { success: boolean; message?: string };

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authTab: 'login' | 'signup' | 'account';
  openAuthModal: (tab?: 'login' | 'signup' | 'account') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (input: { name: string; email: string; phone?: string; password: string }) => Promise<AuthResult>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapShopifyCustomerToUser(c: any): User {
  const name = [c.firstName, c.lastName].filter(Boolean).join(' ') || c.email?.split('@')[0] || 'Customer';

  const address: UserAddress | undefined = c.defaultAddress
    ? {
        street: [c.defaultAddress.address1, c.defaultAddress.address2].filter(Boolean).join(', '),
        city: c.defaultAddress.city || '',
        state: c.defaultAddress.province || '',
        pincode: c.defaultAddress.zip || '',
        country: c.defaultAddress.country || 'India',
      }
    : undefined;

  const orders: OrderHistoryItem[] = (c.orders?.edges || []).map((edge: any) => {
    const node = edge.node;
    const items = (node.lineItems?.edges || []).map((li: any) => ({
      name: li.node.title,
      quantity: li.node.quantity,
      price: parseFloat(li.node.variant?.price?.amount || '0'),
      image: li.node.variant?.image?.url,
    }));
    const fulfillment = String(node.fulfillmentStatus || '').toLowerCase();
    const status =
      fulfillment === 'fulfilled' ? 'Delivered' : fulfillment === 'partially_fulfilled' ? 'Shipped' : 'Processing';

    return {
      id: `#${node.orderNumber || node.id}`,
      date: node.processedAt
        ? new Date(node.processedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : '',
      items,
      totalAmount: parseFloat(node.totalPrice?.amount || '0'),
      status,
      statusUrl: node.statusUrl,
    };
  });

  return { id: c.id, name, email: c.email || '', phone: c.phone || undefined, address, orders };
}

function storeToken(token: string, expiresAt?: string) {
  localStorage.setItem(TOKEN_KEY, token);
  if (expiresAt) localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt);
}

function readToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const expires = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!token) return null;
  if (expires && new Date(expires).getTime() < Date.now()) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    return null;
  }
  return token;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup' | 'account'>('login');

  const loadUserFromToken = useCallback(async (token: string): Promise<boolean> => {
    const customer = await getShopifyCustomerDetails(token);
    if (!customer) return false;
    setUser(mapShopifyCustomerToUser(customer));
    return true;
  }, []);

  // Restore session from a still-valid Shopify customer access token.
  useEffect(() => {
    (async () => {
      try {
        const token = readToken();
        if (token) {
          const ok = await loadUserFromToken(token);
          if (!ok) localStorage.removeItem(TOKEN_KEY);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [loadUserFromToken]);

  const openAuthModal = (tab?: 'login' | 'signup' | 'account') => {
    setAuthTab(user ? 'account' : tab || 'login');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const res = await loginShopifyCustomer(email.trim(), password);
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Invalid email or password.' };
    }
    storeToken(res.data.accessToken, res.data.expiresAt);
    const ok = await loadUserFromToken(res.data.accessToken);
    return ok
      ? { success: true, message: 'Welcome back!' }
      : { success: false, message: 'Logged in, but could not load your profile. Please try again.' };
  };

  const signup = async (input: { name: string; email: string; phone?: string; password: string }): Promise<AuthResult> => {
    const [firstName, ...rest] = input.name.trim().split(/\s+/);
    const created = await createShopifyCustomer({
      email: input.email.trim(),
      password: input.password,
      firstName: firstName || undefined,
      lastName: rest.join(' ') || undefined,
      phone: input.phone,
    });
    if (!created.success) {
      return { success: false, message: created.message || 'Could not create account.' };
    }
    // Shopify may require email verification before login succeeds.
    const loginRes = await login(input.email, input.password);
    if (!loginRes.success) {
      return {
        success: true,
        message: 'Account created. Please check your email to activate it, then log in.',
      };
    }
    return { success: true, message: 'Account created — welcome to Aurenza!' };
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    setUser(null);
    setIsAuthModalOpen(false);
  };

  const refreshUser = async () => {
    const token = readToken();
    if (token) await loadUserFromToken(token);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthModalOpen, authTab, openAuthModal, closeAuthModal, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
