<script setup>
import { computed } from 'vue'
import { useChargeCalculatorConfig } from './composables/useChargeCalculatorConfig.js'
import ModeSelector from './components/ModeSelector.vue'
import ChargingDetailsCard from './components/ChargingDetailsCard.vue'
import PetrolComparisonCard from './components/PetrolComparisonCard.vue'
import UsageSettingsCard from './components/UsageSettingsCard.vue'
import CalculateButton from './components/CalculateButton.vue'
import ResultsCard from './components/ResultsCard.vue'

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
  resetToDefaults,
  getCurrentConfig
} = useChargeCalculatorConfig()

// Computed properties
const chargingCost = computed(() => {
  const energyCost = batteryCapacity.value * pricePerKWh.value
  const fee = feeType.value === 'fixed'
    ? startingFee.value
    : (energyCost * transactionFeePercent.value / 100)
  return energyCost + fee
})

const kmRange = computed(() => {
  return batteryCapacity.value / kwhUsage.value
})

const petrolCost = computed(() => {
  if (mode.value === 'Hybrid') {
    return (kmRange.value / petrolUsage.value) * petrolPrice.value
  }
  return 0
})

const isChargingCheaper = computed(() => {
  if (mode.value === 'Hybrid') {
    return chargingCost.value < petrolCost.value
  }
  return true
})

// // Event handlers
// const handleCalculate = () => {
//   console.log('Calculate button clicked')
//   console.log('Current config:', getCurrentConfig())
// }

const handleReset = () => {
  resetToDefaults()
  console.log('Reset to defaults')
}
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="max-w-4xl mx-auto py-8">
        <v-card class="mx-auto" max-width="800">
          <v-card-title class="text-center bg-gradient-to-r from-blue-500 to-green-500 text-white">
            <div class="flex items-center justify-center gap-3">
              <h1 class="text-3xl font-bold text-[#1e92d7]">EV Charge Calculator</h1>
            </div>
          </v-card-title>

          <v-card-text class="p-6">
            <!-- Mode Selection -->
            <ModeSelector v-model="mode" />

            <v-row>
              <!-- Basic EV Inputs -->
              <v-col cols="12" md="6">
                <ChargingDetailsCard v-model:batteryCapacity="batteryCapacity" v-model:pricePerKWh="pricePerKWh"
                  v-model:feeType="feeType" v-model:startingFee="startingFee"
                  v-model:transactionFeePercent="transactionFeePercent" />
              </v-col>

              <!-- Hybrid Mode Inputs -->
              <v-col v-if="mode === 'Hybrid'" cols="12" md="6">
                <PetrolComparisonCard v-model:petrolPrice="petrolPrice" v-model:petrolUsage="petrolUsage"
                  v-model:kwhUsage="kwhUsage" />
              </v-col>

              <!-- EV Mode Info Card -->
              <v-col v-if="mode === 'EV'" cols="12" md="6">
                <UsageSettingsCard v-model:kwhUsage="kwhUsage" :batteryCapacity="batteryCapacity" :kmRange="kmRange" />
              </v-col>
            </v-row>

            <!-- Calculate Button -->
            <!-- <CalculateButton :mode="mode" @calculate="handleCalculate" /> -->

            <!-- Reset Button -->
            <div class="text-center mb-4 px-8 py-2">
              <v-btn variant="outlined" color="grey" @click="handleReset">
                <v-icon start>mdi-refresh</v-icon>
                Reset to Defaults
              </v-btn>
            </div>

            <!-- Results -->
            <ResultsCard :mode="mode" :isChargingCheaper="isChargingCheaper" :chargingCost="chargingCost"
              :petrolCost="petrolCost" :kmRange="kmRange" />
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>
