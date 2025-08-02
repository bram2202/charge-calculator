import { ref } from 'vue'
import { getConfig } from '../config/defaults.js'

// Get environment from Vite env variables or default to development
const environment = import.meta.env.VITE_APP_ENV || 'development'

// Load configuration
const config = getConfig(environment)

// Override with environment variables if they exist
const getEnvValue = (key, defaultValue, type = 'string') => {
  const envValue = import.meta.env[key]
  if (envValue === undefined) return defaultValue
  
  switch (type) {
    case 'number':
      return parseFloat(envValue) || defaultValue
    case 'boolean':
      return envValue === 'true'
    default:
      return envValue
  }
}

// Create reactive state with configuration values
export const useChargeCalculatorConfig = () => {
  // State variables initialized from config
  const mode = ref(getEnvValue('VITE_DEFAULT_MODE', config.mode))
  const batteryCapacity = ref(getEnvValue('VITE_DEFAULT_BATTERY_CAPACITY', config.batteryCapacity, 'number'))
  const pricePerKWh = ref(getEnvValue('VITE_DEFAULT_PRICE_PER_KWH', config.pricePerKWh, 'number'))
  const feeType = ref(getEnvValue('VITE_DEFAULT_FEE_TYPE', config.feeType))
  const startingFee = ref(getEnvValue('VITE_DEFAULT_STARTING_FEE', config.startingFee, 'number'))
  const transactionFeePercent = ref(getEnvValue('VITE_DEFAULT_TRANSACTION_FEE_PERCENT', config.transactionFeePercent, 'number'))
  
  // Hybrid mode specific
  const petrolPrice = ref(getEnvValue('VITE_DEFAULT_PETROL_PRICE', config.petrolPrice, 'number'))
  const petrolUsage = ref(getEnvValue('VITE_DEFAULT_PETROL_USAGE', config.petrolUsage, 'number'))
  const kwhUsage = ref(getEnvValue('VITE_DEFAULT_KWH_USAGE', config.kwhUsage, 'number'))

  // Reset to defaults function
  const resetToDefaults = () => {
    mode.value = config.mode
    batteryCapacity.value = config.batteryCapacity
    pricePerKWh.value = config.pricePerKWh
    feeType.value = config.feeType
    startingFee.value = config.startingFee
    transactionFeePercent.value = config.transactionFeePercent
    petrolPrice.value = config.petrolPrice
    petrolUsage.value = config.petrolUsage
    kwhUsage.value = config.kwhUsage
  }

  // Export current configuration
  const getCurrentConfig = () => ({
    mode: mode.value,
    batteryCapacity: batteryCapacity.value,
    pricePerKWh: pricePerKWh.value,
    feeType: feeType.value,
    startingFee: startingFee.value,
    transactionFeePercent: transactionFeePercent.value,
    petrolPrice: petrolPrice.value,
    petrolUsage: petrolUsage.value,
    kwhUsage: kwhUsage.value,
  })

  return {
    // State variables
    mode,
    batteryCapacity,
    pricePerKWh,
    feeType,
    startingFee,
    transactionFeePercent,
    petrolPrice,
    petrolUsage,
    kwhUsage,
    
    // Utility functions
    resetToDefaults,
    getCurrentConfig,
    
    // Raw config for reference
    config
  }
}
