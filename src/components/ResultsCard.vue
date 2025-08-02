<template>
  <div class="w-full">
    <v-card 
      :color="mode === 'Hybrid' ? (isChargingCheaper ? 'success' : 'warning') : 'info'" 
      variant="tonal"
      class="text-center rounded-xl shadow-lg"
    >
      <v-card-text class="p-4 sm:p-6 lg:p-8">
        <div class="flex flex-col items-center">
          <v-icon
            :icon="mode === 'EV' ? 'mdi-lightning-bolt' : (isChargingCheaper ? 'mdi-battery-charging' : 'mdi-gas-station')"
            size="48" 
            class="mb-4 sm:mb-6" 
          />
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4">
            {{ mode === 'EV' ? 'Charging Cost' : 'Cost Comparison' }}
          </h2>
          <h3 class="text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 px-2">
            {{ recommendationText }}
          </h3>
          <p class="text-sm sm:text-base text-opacity-80 px-2">
            {{ recommendationComparisonText }}
          </p>

          <div v-if="mode === 'Hybrid'" class="mt-6 sm:mt-8 w-full max-w-2xl">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <v-card 
                variant="outlined" 
                :class="[
                  'rounded-xl shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm mb-2',
                  !isChargingCheaper ? 'border-red-300 bg-red-100/70' : 'border-gray-200 bg-white/80'
                ]"
              >
                <v-card-text class="text-center p-4 sm:p-6">
                  <v-icon icon="mdi-battery-charging" size="32" color="blue" class="mb-3" />
                  <div class="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                    Electric Charging
                  </div>
                  <div class="text-xl sm:text-2xl font-bold text-blue-600">
                    €{{ chargingCost.toFixed(2) }}
                  </div>
                  <div class="text-xs sm:text-sm text-gray-500 mt-1">
                    per full charge
                  </div>
                </v-card-text>
              </v-card>

              <v-card 
                variant="outlined" 
                :class="[
                  'rounded-xl shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm',
                  isChargingCheaper ? 'border-red-300 bg-red-100/70' : 'border-gray-200 bg-white/80'
                ]"
              >
                <v-card-text class="text-center p-4 sm:p-6">
                  <v-icon icon="mdi-gas-station" size="32" color="orange" class="mb-3" />
                  <div class="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                    Petrol Equivalent
                  </div>
                  <div class="text-xl sm:text-2xl font-bold text-orange-600">
                    €{{ petrolCost.toFixed(2) }}
                  </div>
                  <div class="text-xs sm:text-sm text-gray-500 mt-1">
                    same distance
                  </div>
                </v-card-text>
              </v-card>
            </div>
        
          </div>

          <!-- EV Mode additional info -->
          <div v-if="mode === 'EV'" class="mt-6 sm:mt-8 w-full max-w-md">
            <v-card 
              variant="outlined" 
              class="rounded-xl shadow-sm bg-white/80 backdrop-blur-sm"
            >
              <v-card-text class="text-center p-4 sm:p-6">
                <v-icon icon="mdi-map-marker-distance" size="32" color="purple" class="mb-3" />
                <div class="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                  Estimated Range
                </div>
                <div class="text-xl sm:text-2xl font-bold text-purple-600">
                  {{ kmRange.toFixed(0) }} km
                </div>
                <div class="text-xs sm:text-sm text-gray-500 mt-1">
                  per full charge
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    mode: {
        type: String,
        required: true
    },
    isChargingCheaper: {
        type: Boolean,
        required: true
    },
    chargingCost: {
        type: Number,
        required: true
    },
    petrolCost: {
        type: Number,
        required: true
    },
    kmRange: {
        type: Number,
        required: true
    }
})

// Generate recommendation text based on mode
const recommendationText = computed(() => {
    if (props.mode === 'EV') {
        return `Total charging cost: €${props.chargingCost.toFixed(2)} for ${props.kmRange.toFixed(0)} km range`
    } else {
        const savings = Math.abs(props.chargingCost - props.petrolCost)
        if (props.isChargingCheaper) {
            return `Charging is cheaper! Save €${savings.toFixed(2)}`
        } else {
            return `Petrol is cheaper! Save €${savings.toFixed(2)}`
        }
    }
})

const recommendationComparisonText = computed(() => {
    if (props.mode === 'Hybrid') {
        const savings = Math.abs(props.chargingCost - props.petrolCost)
        if (props.isChargingCheaper) {
            return `(Charging: €${props.chargingCost.toFixed(2)} vs Petrol: €${props.petrolCost.toFixed(2)})`
        } else {
            return `(Petrol: €${props.petrolCost.toFixed(2)} vs Charging: €${props.chargingCost.toFixed(2)})`
        }
    }
})
</script>

<style scoped>
.border-red-300 {
  border-color: #fca5a5 !important;
  border-width: 2px !important;
}

.bg-red-100\/70 {
  background-color: rgba(254, 226, 226, 0.8) !important;
}

.border-gray-200 {
  border-color: #e5e7eb !important;
}

.bg-white\/80 {
  background-color: rgba(255, 255, 255, 0.8) !important;
}
</style>
