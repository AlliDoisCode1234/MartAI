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
      
      // Helper function to refresh token (defined later in component)
      const doRefresh = async (): Promise<string | null> => {
        const refreshToken = authStorage.getRefreshToken();
        if (!refreshToken) return null;

        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          const data = await response.json();

          if (!response.ok) {
            authStorage.clear();
            setUser(null);
            setToken(null);
            return null;
          }

          if (data.token) {
            authStorage.setToken(data.token);
            if (data.user) {
              authStorage.setUser(data.user);
              setUser(data.user);
            }
            setToken(data.token);
            return data.token;
          }

          return null;
        } catch (error) {
          console.error('Token refresh error:', error);
          return null;
        }
      };

      // Verify token is still valid
      fetch('/api/auth/me', {
        headers: getAuthHeaders(),
      })
        .then(async res => {
          if (res.status === 401) {
            // Token expired, try to refresh
            const newToken = await doRefresh();
            if (newToken) {
              // Retry with new token
              const retryRes = await fetch('/api/auth/me', {
                headers: { Authorization: `Bearer ${newToken}` },
              });
              const retryData = await retryRes.json();
              if (retryData.user) {
                setUser(retryData.user);
                authStorage.setUser(retryData.user);
              }
            } else {
              // Refresh failed, clear auth
              authStorage.clear();
              setUser(null);
              setToken(null);
            }
          } else {
            const data = await res.json();
            if (data.user) {
              setUser(data.user);
              authStorage.setUser(data.user);
            } else {
              authStorage.clear();
              setUser(null);
              setToken(null);
            }
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
      if (data.refreshToken) {
        authStorage.setRefreshToken(data.refreshToken);
      }
      authStorage.setUser(data.user);
      setToken(data.token);
      setUser(data.user);
    }

    return data;
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Refresh token invalid, clear auth
        authStorage.clear();
        setUser(null);
        setToken(null);
        return null;
      }

      if (data.token) {
        authStorage.setToken(data.token);
        if (data.user) {
          authStorage.setUser(data.user);
          setUser(data.user);
        }
        setToken(data.token);
        return data.token;
      }

      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
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
      if (data.refreshToken) {
        authStorage.setRefreshToken(data.refreshToken);
      }
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
    refreshAccessToken,
    isAuthenticated: !!user && !!token,
  };
}

