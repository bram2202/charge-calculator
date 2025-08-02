// Default configuration values for the Charge Calculator
export const defaultConfig = {
  // Mode settings
  mode: 'EV', // 'EV' or 'Hybrid'
  
  // Charging settings
  batteryCapacity: 50, // kWh
  pricePerKWh: 0.25, // €/kWh
  feeType: 'fixed', // 'fixed' or 'percentage'
  startingFee: 0.5, // € (when feeType is 'fixed')
  transactionFeePercent: 5, // % (when feeType is 'percentage')
  
  // Electric usage
  kwhUsage: 0.2, // kWh/km
  
  // Hybrid mode specific settings
  petrolPrice: 1.65, // €/liter
  petrolUsage: 15, // km/l
}

// Environment-specific settings (can be overridden)
export const envConfig = {
  // Development settings
  development: {
    // Override any defaults for development
    // Example: different default values for testing
  },
  
  // Production settings
  production: {
    // Override any defaults for production
    // Example: different default prices based on region
  },
  
  // Test settings
  test: {
    // Override any defaults for testing
    batteryCapacity: 75,
    pricePerKWh: 0.30,
  }
}

// Get configuration based on environment
export const getConfig = (environment = 'development') => {
  return {
    ...defaultConfig,
    ...(envConfig[environment] || {})
  }
}

// Export individual config sections for better organization
export const chargingDefaults = {
  batteryCapacity: defaultConfig.batteryCapacity,
  pricePerKWh: defaultConfig.pricePerKWh,
  feeType: defaultConfig.feeType,
  startingFee: defaultConfig.startingFee,
  transactionFeePercent: defaultConfig.transactionFeePercent,
}

export const hybridDefaults = {
  petrolPrice: defaultConfig.petrolPrice,
  petrolUsage: defaultConfig.petrolUsage,
  kwhUsage: defaultConfig.kwhUsage,
}

export const appDefaults = {
  mode: defaultConfig.mode,
}
