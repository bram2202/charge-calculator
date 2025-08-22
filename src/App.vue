<script setup>
import { computed } from 'vue'
import { useChargeCalculatorConfig } from '@/composables/useChargeCalculatorConfig'
import { ChargeCalculationService } from '@/services/ChargeCalculationService'
import ModeSelector from './components/ModeSelector.vue'
import ChargingDetailsCard from './components/ChargingDetailsCard.vue'
import ChargingConfigCard from './components/ChargingConfigCard.vue'
import PetrolComparisonCard from './components/PetrolComparisonCard.vue'
import UsageSettingsCard from './components/UsageSettingsCard.vue'
import CalculateButton from './components/CalculateButton.vue'
import ResultsCard from './components/ResultsCard.vue'

// App version
const appVersion = computed(() => {
  return __APP_VERSION__ || 'x.x.x'
})

// Get configuration and state from composable
const {
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
  carPhases,
  chargingPower,
  isChargingSettingsExpanded,
  isUsageSettingsExpanded,
  isPetrolComparisonExpanded,
  resetToDefaults,
  getCurrentConfig
} = useChargeCalculatorConfig()

// Computed properties using the calculation service
const chargingCost = computed(() => {
  try {
    return ChargeCalculationService.calculateChargingCost({
      batteryCapacity: batteryCapacity.value,
      pricePerKWh: pricePerKWh.value,
      feeType: feeType.value,
      startingFee: startingFee.value,
      transactionFeePercent: transactionFeePercent.value
    })
  } catch (error) {
    console.warn('Error calculating charging cost:', error.message)
    return 0
  }
})

const kmRange = computed(() => {
  try {
    return ChargeCalculationService.calculateKmRange({
      batteryCapacity: batteryCapacity.value,
      kwhUsage: kwhUsage.value
    })
  } catch (error) {
    console.warn('Error calculating km range:', error.message)
    return 0
  }
})

const petrolCost = computed(() => {
  if (mode.value === 'Hybrid') {
    try {
      return ChargeCalculationService.calculatePetrolCost({
        kmRange: kmRange.value,
        petrolUsage: petrolUsage.value,
        petrolPrice: petrolPrice.value
      })
    } catch (error) {
      console.warn('Error calculating petrol cost:', error.message)
      return 0
    }
  }
  return 0
})

const isChargingCheaper = computed(() => {
  if (mode.value === 'Hybrid') {
    try {
      const comparison = ChargeCalculationService.compareChargingWithPetrolCost({
        chargingCost: chargingCost.value,
        petrolCost: petrolCost.value
      })
      return comparison.isChargingCheaper
    } catch (error) {
      console.warn('Error comparing costs:', error.message)
      return true
    }
  }
  return true
})

const chargeTime = computed(() => {
  try {
    return ChargeCalculationService.calculateChargeTime({
      batteryCapacity: batteryCapacity.value,
      carPhases: carPhases.value,
      chargingPower: chargingPower.value
    })
  } catch (error) {
    console.warn('Error calculating charge time:', error.message)
    return {
      chargeTimeHours: 0,
      chargeTimeMinutes: 0,
      actualChargingPower: 0,
      formattedTime: '0m'
    }
  }
})

const handleReset = () => {
  resetToDefaults()
  console.log('Reset to defaults')
}
</script>

<template>
  <v-app>
    <v-main class="main-background">
      <v-container class="max-w-6xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-4xl mx-auto">
          <!-- Header -->
          <div class="text-center mb-6 sm:mb-8">
            <div class="inline-flex items-center justify-center gap-2 sm:gap-3 mb-4">
              <v-icon icon="mdi-ev-station" size="32" class="text-blue-600 sm:text-4xl" />
              <h1
                class="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                EV Charge Calculator
              </h1>
            </div>
            <p class="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-4">
              Calculate and compare charging costs for your electric or hybrid vehicle
            </p>
          </div>

          <!-- Main Card -->
          <v-card class="mx-auto shadow-xl border-0 rounded-xl sm:rounded-2xl overflow-hidden">
            <v-card-text class="p-4 sm:p-6 lg:p-8">
              <!-- Mode Selection -->
              <div class="mb-6 sm:mb-8">
                <ModeSelector v-model="mode" />
              </div>

              <!-- Input Cards Grid -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <!-- Basic EV Inputs -->
                <div class="w-full">
                  <ChargingDetailsCard v-model:batteryCapacity="batteryCapacity" v-model:pricePerKWh="pricePerKWh"
                    v-model:feeType="feeType" v-model:startingFee="startingFee"
                    v-model:transactionFeePercent="transactionFeePercent" />
                </div>

                <!-- Charging Configuration -->
                <div class="w-full">
                  <ChargingConfigCard v-model:carPhases="carPhases" v-model:chargingPower="chargingPower" 
                    v-model:isExpanded="isChargingSettingsExpanded" />
                </div>
              </div>

              <!-- Secondary Grid for Mode-specific Cards -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <!-- Hybrid Mode Inputs -->
                <div v-if="mode === 'Hybrid'" class="w-full">
                  <PetrolComparisonCard v-model:petrolPrice="petrolPrice" v-model:petrolUsage="petrolUsage"
                    v-model:kwhUsage="kwhUsage" v-model:useLitersPer100km="useLitersPer100km" 
                    v-model:isExpanded="isPetrolComparisonExpanded" />
                </div>

                <!-- EV Mode Info Card -->
                <div v-if="mode === 'EV'" class="w-full">
                  <UsageSettingsCard v-model:kwhUsage="kwhUsage" :batteryCapacity="batteryCapacity"
                    :kmRange="kmRange" v-model:isExpanded="isUsageSettingsExpanded" />
                </div>
              </div>

              <!-- Reset Button -->
              <div class="text-center mb-6 sm:mb-8">
                <v-btn variant="outlined" color="grey-darken-1" @click="handleReset" class="px-6 py-2 rounded-xl"
                  size="large">
                  <v-icon start>mdi-refresh</v-icon>
                  Reset to Defaults
                </v-btn>
              </div>

              <!-- Results -->
              <ResultsCard :mode="mode" :isChargingCheaper="isChargingCheaper" :chargingCost="chargingCost"
                :petrolCost="petrolCost" :kmRange="kmRange" :chargeTime="chargeTime" />
            </v-card-text>
          </v-card>

          <!-- Footer -->
          <div class="text-center mt-8 mb-4">
            <div class="text-gray-500 text-sm">
              <p class="mb-2">
                Made by
                <a href="https://bram-dev.nl" target="_blank" rel="noopener noreferrer" class="text-blue-600">
                  Bram van Deventer
                </a>
              </p>
              <p class="text-xs text-gray-400">
                © {{ new Date().getFullYear() }} - EV Charge Calculator | v{{ appVersion }}
              </p>
            </div>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.main-background {
  min-height: 100vh;
  background: linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #f0fdf4 100%);
  background-attachment: fixed;
}

/* Ensure the gradient text works */
.bg-gradient-to-r {
  background: linear-gradient(to right, #2563eb, #16a34a);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
