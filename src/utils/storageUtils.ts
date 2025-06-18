
/**
 * Utility functions for managing application storage
 */

// Keys that should be preserved during logout (e.g., theme preferences)
const PRESERVED_KEYS = ['theme'];

export const clearAllStorage = () => {
  console.log('🧹 Clearing all storage data...');
  
  // Clear sessionStorage completely
  sessionStorage.clear();
  
  // Clear localStorage but preserve certain keys
  const preservedData: Record<string, string> = {};
  
  // Save preserved keys
  PRESERVED_KEYS.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      preservedData[key] = value;
    }
  });
  
  // Clear all localStorage
  localStorage.clear();
  
  // Restore preserved keys
  Object.entries(preservedData).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
  
  console.log('✅ Storage cleared, preserved keys:', Object.keys(preservedData));
};

export const clearAuthStorage = () => {
  console.log('🔐 Clearing authentication storage...');
  
  // Clear auth-related sessionStorage items
  const authSessionKeys = [
    'access_token',
    'refresh_token',
    'user',
    'userId',
    'post_refresh_path',
    'scrollY'
  ];
  
  authSessionKeys.forEach(key => {
    sessionStorage.removeItem(key);
  });
  
  // Clear auth-related localStorage items
  const authLocalKeys = [
    'userBusinessListings'
  ];
  
  authLocalKeys.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log('✅ Authentication storage cleared');
};

export const isStorageAvailable = (type: 'localStorage' | 'sessionStorage'): boolean => {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn(`${type} is not available:`, e);
    return false;
  }
};
