/**
 * Centralized localStorage and sessionStorage utilities
 * Provides type-safe, consistent storage access across the app
 */

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  CURRENT_PROJECT_ID: 'currentProjectId',
  PROJECT_ID: 'projectId',
  SEO_ANALYSIS: 'seoAnalysis',
} as const;

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

/**
 * Safe localStorage getter with error handling
 */
function getLocalStorage(key: StorageKey): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to read localStorage key "${key}":`, error);
    return null;
  }
}

/**
 * Safe localStorage setter with error handling
 */
function setLocalStorage(key: StorageKey, value: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Failed to write localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Safe localStorage remover with error handling
 */
function removeLocalStorage(key: StorageKey): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Safe sessionStorage getter
 */
function getSessionStorage(key: StorageKey): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to read sessionStorage key "${key}":`, error);
    return null;
  }
}

/**
 * Safe sessionStorage setter
 */
function setSessionStorage(key: StorageKey, value: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    sessionStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Failed to write sessionStorage key "${key}":`, error);
    return false;
  }
}

// ============================================================================
// Auth Storage
// ============================================================================

export const authStorage = {
  getToken: () => getLocalStorage(STORAGE_KEYS.AUTH_TOKEN),
  setToken: (token: string) => setLocalStorage(STORAGE_KEYS.AUTH_TOKEN, token),
  removeToken: () => removeLocalStorage(STORAGE_KEYS.AUTH_TOKEN),
  
  getUser: <T = any>(): T | null => {
    const userStr = getLocalStorage(STORAGE_KEYS.USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as T;
    } catch {
      return null;
    }
  },
  setUser: <T>(user: T): boolean => {
    try {
      return setLocalStorage(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {
      return false;
    }
  },
  removeUser: () => removeLocalStorage(STORAGE_KEYS.USER),
  
  clear: () => {
    authStorage.removeToken();
    authStorage.removeUser();
  },
};

// ============================================================================
// Project Storage
// ============================================================================

export const projectStorage = {
  getCurrentProjectId: () => getLocalStorage(STORAGE_KEYS.CURRENT_PROJECT_ID),
  setCurrentProjectId: (projectId: string) => 
    setLocalStorage(STORAGE_KEYS.CURRENT_PROJECT_ID, projectId),
  removeCurrentProjectId: () => removeLocalStorage(STORAGE_KEYS.CURRENT_PROJECT_ID),
  
  getProjectId: () => getLocalStorage(STORAGE_KEYS.PROJECT_ID),
  setProjectId: (projectId: string) => 
    setLocalStorage(STORAGE_KEYS.PROJECT_ID, projectId),
  removeProjectId: () => removeLocalStorage(STORAGE_KEYS.PROJECT_ID),
};

// ============================================================================
// Session Storage (temporary data)
// ============================================================================

export const sessionStorageUtil = {
  getSeoAnalysis: <T = any>(): T | null => {
    const analysisStr = getSessionStorage(STORAGE_KEYS.SEO_ANALYSIS);
    if (!analysisStr) return null;
    try {
      return JSON.parse(analysisStr) as T;
    } catch {
      return null;
    }
  },
  setSeoAnalysis: <T>(analysis: T): boolean => {
    try {
      return setSessionStorage(STORAGE_KEYS.SEO_ANALYSIS, JSON.stringify(analysis));
    } catch {
      return false;
    }
  },
  removeSeoAnalysis: () => {
    if (typeof window === 'undefined') return false;
    try {
      window.sessionStorage.removeItem(STORAGE_KEYS.SEO_ANALYSIS);
      return true;
    } catch {
      return false;
    }
  },
};

// ============================================================================
// Utility: Get auth headers
// ============================================================================

export function getAuthHeaders(): HeadersInit {
  const token = authStorage.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

