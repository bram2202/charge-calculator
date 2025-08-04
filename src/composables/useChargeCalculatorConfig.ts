import { ref, watch, type Ref } from 'vue'
import { getConfig, type AppConfig } from '@/config/defaults'
import type { FeeType } from '@/services/ChargeCalculationService'

// Get environment from Vite env variables or default to development
const environment = (import.meta.env.VITE_APP_ENV as keyof typeof import('@/config/defaults').envConfig) || 'development'

// Load configuration
const config = getConfig(environment)

// Local storage utilities
const STORAGE_KEY = 'ev-charge-calculator-settings'

interface StoredSettings {
  mode?: 'EV' | 'Hybrid'
  batteryCapacity?: number
  pricePerKWh?: number
  feeType?: FeeType
  startingFee?: number
  transactionFeePercent?: number
  petrolPrice?: number
  petrolUsage?: number
  kwhUsage?: number
  useLitersPer100km?: boolean
}

const saveToLocalStorage = (data: StoredSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

const loadFromLocalStorage = (): StoredSettings | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    
    return JSON.parse(stored) as StoredSettings
  } catch (error) {
    console.warn('Failed to load from localStorage:', error)
    localStorage.removeItem(STORAGE_KEY) // Clean up corrupted data
    return null
  }
}

// Override with environment variables if they exist
const getEnvValue = <T>(key: string, defaultValue: T, type: 'string' | 'number' | 'boolean' = 'string'): T => {
  const envValue = import.meta.env[key]
  if (envValue === undefined) return defaultValue
  
  switch (type) {
    case 'number':
      return (parseFloat(envValue) || defaultValue) as T
    case 'boolean':
      return (envValue === 'true') as T
    default:
      return envValue as T
  }
}

export interface ChargeCalculatorComposable {
  // State variables
  mode: Ref<'EV' | 'Hybrid'>
  batteryCapacity: Ref<number>
  pricePerKWh: Ref<number>
  feeType: Ref<FeeType>
  startingFee: Ref<number>
  transactionFeePercent: Ref<number>
  petrolPrice: Ref<number>
  petrolUsage: Ref<number>
  kwhUsage: Ref<number>
  useLitersPer100km: Ref<boolean>
  
  // Utility functions
  resetToDefaults: () => void
  getCurrentConfig: () => AppConfig
  clearStoredSettings: () => void
  
  // Raw config for reference
  config: AppConfig
}

// Create reactive state with configuration values
export const useChargeCalculatorConfig = (): ChargeCalculatorComposable => {
  // Try to load saved settings first
  const savedSettings = loadFromLocalStorage()
  
  // Initialize values with saved settings or defaults
  const getInitialValue = <T>(key: keyof StoredSettings, defaultValue: T, type: 'string' | 'number' | 'boolean' = 'string'): T => {
    // First check saved settings
    if (savedSettings && savedSettings[key] !== undefined) {
      return savedSettings[key] as T
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
  const useLitersPer100km = ref(getInitialValue('useLitersPer100km', false, 'boolean'))

  // Watch for changes and save to localStorage
  const saveCurrentSettings = (): void => {
    const currentSettings: StoredSettings = {
      mode: mode.value,
      batteryCapacity: batteryCapacity.value,
      pricePerKWh: pricePerKWh.value,
      feeType: feeType.value,
      startingFee: startingFee.value,
      transactionFeePercent: transactionFeePercent.value,
      petrolPrice: petrolPrice.value,
      petrolUsage: petrolUsage.value,
      kwhUsage: kwhUsage.value,
      useLitersPer100km: useLitersPer100km.value,
    }
    saveToLocalStorage(currentSettings)
  }

  // Set up watchers for all reactive values
  watch([mode, batteryCapacity, pricePerKWh, feeType, startingFee, transactionFeePercent, petrolPrice, petrolUsage, kwhUsage, useLitersPer100km], () => {
    saveCurrentSettings()
  }, { deep: true })

  // Reset to defaults function
  const resetToDefaults = (): void => {
    mode.value = config.mode
    batteryCapacity.value = config.batteryCapacity
    pricePerKWh.value = config.pricePerKWh
    feeType.value = config.feeType
    startingFee.value = config.startingFee
    transactionFeePercent.value = config.transactionFeePercent
    petrolPrice.value = config.petrolPrice
    petrolUsage.value = config.petrolUsage
    kwhUsage.value = config.kwhUsage
    useLitersPer100km.value = false
    
    // Clear localStorage when resetting
    localStorage.removeItem(STORAGE_KEY)
  }

  // Export current configuration
  const getCurrentConfig = (): AppConfig => ({
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
  const clearStoredSettings = (): void => {
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
    useLitersPer100km,
    
    // Utility functions
    resetToDefaults,
    getCurrentConfig,
    clearStoredSettings,
    
    // Raw config for reference
    config
  }
}
