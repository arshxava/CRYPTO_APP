import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    newProducts: boolean;
  };
  privacy: {
    analytics: boolean;
    marketing: boolean;
    personalization: boolean;
  };
  display: {
    showPrices: boolean;
    showStock: boolean;
    gridColumns: 2 | 3;
    sortBy: 'name' | 'price' | 'date' | 'popularity';
    sortOrder: 'asc' | 'desc';
  };
  security: {
    biometric: boolean;
    twoFactor: boolean;
    sessionTimeout: number; // in minutes
  };
  app: {
    autoUpdate: boolean;
    crashReporting: boolean;
    beta: boolean;
    cacheSize: number; // in MB
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  theme: 'light',
  language: 'en',
  currency: 'USD',
  notifications: {
    push: true,
    email: true,
    sms: false,
    orderUpdates: true,
    promotions: true,
    newProducts: false,
  },
  privacy: {
    analytics: true,
    marketing: false,
    personalization: true,
  },
  display: {
    showPrices: true,
    showStock: true,
    gridColumns: 2,
    sortBy: 'name',
    sortOrder: 'asc',
  },
  security: {
    biometric: false,
    twoFactor: false,
    sessionTimeout: 30,
  },
  app: {
    autoUpdate: true,
    crashReporting: true,
    beta: false,
    cacheSize: 100,
  },
  isLoading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Theme settings
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    
    // Language settings
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    
    // Currency settings
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    
    // Notification settings
    updateNotificationSettings: (state, action: PayloadAction<Partial<SettingsState['notifications']>>) => {
      state.notifications = {...state.notifications, ...action.payload};
    },
    
    toggleNotification: (state, action: PayloadAction<keyof SettingsState['notifications']>) => {
      const key = action.payload;
      state.notifications[key] = !state.notifications[key];
    },
    
    // Privacy settings
    updatePrivacySettings: (state, action: PayloadAction<Partial<SettingsState['privacy']>>) => {
      state.privacy = {...state.privacy, ...action.payload};
    },
    
    togglePrivacySetting: (state, action: PayloadAction<keyof SettingsState['privacy']>) => {
      const key = action.payload;
      state.privacy[key] = !state.privacy[key];
    },
    
    // Display settings
    updateDisplaySettings: (state, action: PayloadAction<Partial<SettingsState['display']>>) => {
      state.display = {...state.display, ...action.payload};
    },
    
    setGridColumns: (state, action: PayloadAction<2 | 3>) => {
      state.display.gridColumns = action.payload;
    },
    
    setSortBy: (state, action: PayloadAction<'name' | 'price' | 'date' | 'popularity'>) => {
      state.display.sortBy = action.payload;
    },
    
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.display.sortOrder = action.payload;
    },
    
    toggleShowPrices: (state) => {
      state.display.showPrices = !state.display.showPrices;
    },
    
    toggleShowStock: (state) => {
      state.display.showStock = !state.display.showStock;
    },
    
    // Security settings
    updateSecuritySettings: (state, action: PayloadAction<Partial<SettingsState['security']>>) => {
      state.security = {...state.security, ...action.payload};
    },
    
    toggleBiometric: (state) => {
      state.security.biometric = !state.security.biometric;
    },
    
    toggleTwoFactor: (state) => {
      state.security.twoFactor = !state.security.twoFactor;
    },
    
    setSessionTimeout: (state, action: PayloadAction<number>) => {
      state.security.sessionTimeout = action.payload;
    },
    
    // App settings
    updateAppSettings: (state, action: PayloadAction<Partial<SettingsState['app']>>) => {
      state.app = {...state.app, ...action.payload};
    },
    
    toggleAutoUpdate: (state) => {
      state.app.autoUpdate = !state.app.autoUpdate;
    },
    
    toggleCrashReporting: (state) => {
      state.app.crashReporting = !state.app.crashReporting;
    },
    
    toggleBeta: (state) => {
      state.app.beta = !state.app.beta;
    },
    
    setCacheSize: (state, action: PayloadAction<number>) => {
      state.app.cacheSize = action.payload;
    },
    
    // Bulk settings update
    updateAllSettings: (state, action: PayloadAction<Partial<Omit<SettingsState, 'isLoading' | 'error'>>>) => {
      const {isLoading, error, ...settings} = action.payload as any;
      Object.assign(state, settings);
    },
    
    // Reset settings
    resetSettings: (state) => {
      const {isLoading, error} = state;
      Object.assign(state, initialState, {isLoading, error});
    },
    
    resetNotificationSettings: (state) => {
      state.notifications = initialState.notifications;
    },
    
    resetPrivacySettings: (state) => {
      state.privacy = initialState.privacy;
    },
    
    resetDisplaySettings: (state) => {
      state.display = initialState.display;
    },
    
    resetSecuritySettings: (state) => {
      state.security = initialState.security;
    },
    
    resetAppSettings: (state) => {
      state.app = initialState.app;
    },
    
    // Loading and error states
    setSettingsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setSettingsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearSettingsError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setTheme,
  setLanguage,
  setCurrency,
  updateNotificationSettings,
  toggleNotification,
  updatePrivacySettings,
  togglePrivacySetting,
  updateDisplaySettings,
  setGridColumns,
  setSortBy,
  setSortOrder,
  toggleShowPrices,
  toggleShowStock,
  updateSecuritySettings,
  toggleBiometric,
  toggleTwoFactor,
  setSessionTimeout,
  updateAppSettings,
  toggleAutoUpdate,
  toggleCrashReporting,
  toggleBeta,
  setCacheSize,
  updateAllSettings,
  resetSettings,
  resetNotificationSettings,
  resetPrivacySettings,
  resetDisplaySettings,
  resetSecuritySettings,
  resetAppSettings,
  setSettingsLoading,
  setSettingsError,
  clearSettingsError,
} = settingsSlice.actions;

export default settingsSlice.reducer;