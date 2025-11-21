'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authStorage, getAuthHeaders } from '@/lib/storage';
import type { UserSnapshot } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<UserSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get token and user from centralized storage
    const storedToken = authStorage.getToken();
    const storedUser = authStorage.getUser<UserSnapshot>();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      
      // Verify token is still valid
      fetch('/api/auth/me', {
        headers: getAuthHeaders(),
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
            // Update stored user with latest data
            authStorage.setUser(data.user);
          } else {
            // Token invalid, clear storage
            authStorage.clear();
            setUser(null);
            setToken(null);
          }
        })
        .catch(() => {
          // API not available, use stored user
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    if (data.token && data.user) {
      authStorage.setToken(data.token);
      authStorage.setUser(data.user);
      setToken(data.token);
      setUser(data.user);
    }

    return data;
  };

  const signup = async (email: string, password: string, name?: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    if (data.token && data.user) {
      authStorage.setToken(data.token);
      authStorage.setUser(data.user);
      setToken(data.token);
      setUser(data.user);
    }

    return data;
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: getAuthHeaders(),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    authStorage.clear();
    setUser(null);
    setToken(null);
    router.push('/auth/login');
  };

  const updateProfile = async (updates: Partial<UserSnapshot>) => {
    if (!token) throw new Error('Not authenticated');
    
    const response = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update profile');
    }

    if (data.user) {
      setUser(data.user);
      authStorage.setUser(data.user);
    }

    return data;
  };

  return {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user && !!token,
  };
}

