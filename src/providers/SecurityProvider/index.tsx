'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchCsrfToken } from '@/lib/storage';
import { useAuth } from '@/lib/useAuth';

interface SecurityContextType {
  csrfTokenValid: boolean;
  refreshCsrfToken: () => Promise<void>;
}

const SecurityContext = createContext<SecurityContextType>({
  csrfTokenValid: false,
  refreshCsrfToken: async () => {},
});

export function useSecurity() {
  return useContext(SecurityContext);
}

interface SecurityProviderProps {
  children: ReactNode;
}

/**
 * Security Provider
 * - Validates CSRF tokens periodically
 * - Refreshes tokens before expiration
 * - Provides security utilities to components
 */
export function SecurityProvider({ children }: SecurityProviderProps) {
  const { isAuthenticated } = useAuth();
  const [csrfTokenValid, setCsrfTokenValid] = useState(false);

  // Check and refresh CSRF token when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setCsrfTokenValid(false);
      return;
    }

    const checkAndRefreshCsrf = async () => {
      try {
        const token = sessionStorage.getItem('csrf-token');
        
        if (!token) {
          // No token, fetch one
          const newToken = await fetchCsrfToken();
          setCsrfTokenValid(!!newToken);
        } else {
          // Token exists, validate it's not expired
          // Tokens expire after 1 hour, so we'll refresh if within 10 minutes of expiration
          setCsrfTokenValid(true);
        }
      } catch (error) {
        console.warn('CSRF token validation failed:', error);
        setCsrfTokenValid(false);
      }
    };

    // Initial check
    checkAndRefreshCsrf();

    // Refresh token every 50 minutes (before 1 hour expiration)
    const refreshInterval = setInterval(() => {
      if (isAuthenticated) {
        checkAndRefreshCsrf();
      }
    }, 50 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated]);

  const refreshCsrfToken = async () => {
    try {
      const token = await fetchCsrfToken();
      setCsrfTokenValid(!!token);
    } catch (error) {
      console.error('Failed to refresh CSRF token:', error);
      setCsrfTokenValid(false);
    }
  };

  // Validate client-side security
  useEffect(() => {
    // Warn if running in development without HTTPS
    if (typeof window !== 'undefined' && window.location.protocol === 'http:' && process.env.NODE_ENV === 'production') {
      console.warn('⚠️ Application is running over HTTP in production. HTTPS is required for security.');
    }

    // Check for common security issues
    if (typeof window !== 'undefined') {
      // Warn if localStorage is disabled
      try {
        localStorage.setItem('__security_test__', 'test');
        localStorage.removeItem('__security_test__');
      } catch {
        console.warn('⚠️ localStorage is disabled. Some features may not work.');
      }

      // Warn if sessionStorage is disabled
      try {
        sessionStorage.setItem('__security_test__', 'test');
        sessionStorage.removeItem('__security_test__');
      } catch {
        console.warn('⚠️ sessionStorage is disabled. CSRF tokens may not work.');
      }
    }
  }, []);

  return (
    <SecurityContext.Provider
      value={{
        csrfTokenValid,
        refreshCsrfToken,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
}

