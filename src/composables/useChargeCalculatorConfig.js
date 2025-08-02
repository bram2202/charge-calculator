import { ref, watch } from 'vue'
import { getConfig } from '../config/defaults.js'

// Get environment from Vite env variables or default to development
const environment = import.meta.env.VITE_APP_ENV || 'development'

// Load configuration
const config = getConfig(environment)

// Local storage utilities
const STORAGE_KEY = 'ev-charge-calculator-settings'

const saveToLocalStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

const loadFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    
    return JSON.parse(stored)
  } catch (error) {
    console.warn('Failed to load from localStorage:', error)
    localStorage.removeItem(STORAGE_KEY) // Clean up corrupted data
    return null
  }
}

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
  // Try to load saved settings first
  const savedSettings = loadFromLocalStorage()
  
  // Initialize values with saved settings or defaults
  const getInitialValue = (key, defaultValue, type = 'string') => {
    // First check saved settings
    if (savedSettings && savedSettings[key] !== undefined) {
      return savedSettings[key]
    }
    // Then check environment variables
    return getEnvValue(`VITE_DEFAULT_${key.toUpperCase()}`, defaultValue, type)
  }

  // State variables initialized from saved settings, env, or config
  const mode = ref(getInitialValue('mode', config.mode))
  const batteryCapacity = ref(getInitialValue('batteryCapacity', config.batteryCapacity, 'number'))
  const pricePerKWh = ref(getInitialValue('pricePerKWh', config.pricePerKWh, 'number'))
  const feeType = ref(getInitialValue('feeType', config.feeType))
  const startingFee = ref(getInitialValue('startingFee', config.startingFee, 'number'))
  const transactionFeePercent = ref(getInitialValue('transactionFeePercent', config.transactionFeePercent, 'number'))
  
  // Hybrid mode specific
  const petrolPrice = ref(getInitialValue('petrolPrice', config.petrolPrice, 'number'))
  const petrolUsage = ref(getInitialValue('petrolUsage', config.petrolUsage, 'number'))
  const kwhUsage = ref(getInitialValue('kwhUsage', config.kwhUsage, 'number'))

  // Watch for changes and save to localStorage
  const saveCurrentSettings = () => {
    const currentSettings = {
      mode: mode.value,
      batteryCapacity: batteryCapacity.value,
      pricePerKWh: pricePerKWh.value,
      feeType: feeType.value,
      startingFee: startingFee.value,
      transactionFeePercent: transactionFeePercent.value,
      petrolPrice: petrolPrice.value,
      petrolUsage: petrolUsage.value,
      kwhUsage: kwhUsage.value,
    }
    saveToLocalStorage(currentSettings)
  }

  // Set up watchers for all reactive values
  watch([mode, batteryCapacity, pricePerKWh, feeType, startingFee, transactionFeePercent, petrolPrice, petrolUsage, kwhUsage], () => {
    saveCurrentSettings()
  }, { deep: true })

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
    
    // Clear localStorage when resetting
    localStorage.removeItem(STORAGE_KEY)
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

  // Clear stored settings (useful for debugging or user preference)
  const clearStoredSettings = () => {
    localStorage.removeItem(STORAGE_KEY)
  }

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
    clearStoredSettings,
    
    // Raw config for reference
    config
  }
}
