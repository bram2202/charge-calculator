<template>
  <v-card variant="outlined" class="h-full rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border-gray-200 mt-3 sm:mt-6">
    <v-card-title class="bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 py-4 px-4 sm:px-6 rounded-t-xl cursor-pointer" @click="$emit('update:isExpanded', !isExpanded)">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-2">
          <v-icon icon="mdi-ev-plug-type2" size="24" />
          <span class="text-lg sm:text-xl font-semibold">Charging Settings</span>
        </div>
        <v-icon 
          :icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" 
          size="24" 
          class="transition-transform duration-200"
        />
      </div>
    </v-card-title>
    <v-card-text v-show="isExpanded" class="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <!-- Car Phases -->
      <div class="mb-4">
        <label class="text-sm font-medium text-gray-500 mb-2 block">Car Type</label>
        <div class="flex chip-gap">
          <v-chip
            :color="localCarPhases === 1 ? 'purple' : 'grey-lighten-1'"
            :variant="localCarPhases === 1 ? 'flat' : 'outlined'"
            @click="localCarPhases = 1"
            clickable
            class="flex-1 justify-center"
            :class="{ 'text-gray-500': localCarPhases !== 1 }"
          >
            1-Phase Car
          </v-chip>
          <v-chip
            :color="localCarPhases === 3 ? 'purple' : 'grey-lighten-1'"
            :variant="localCarPhases === 3 ? 'flat' : 'outlined'"
            @click="localCarPhases = 3"
            clickable
            class="flex-1 justify-center"
            :class="{ 'text-gray-500': localCarPhases !== 3 }"
          >
            3-Phase Car
          </v-chip>
        </div>
      </div>

      <!-- Charging Power -->
      <div class="mb-4">
        <label class="text-sm font-medium text-gray-500 mb-2 block">Charging Station Power</label>
        <div class="flex chip-gap">
          <v-chip
            :color="localChargingPower === 11 ? 'purple' : 'grey-lighten-1'"
            :variant="localChargingPower === 11 ? 'flat' : 'outlined'"
            @click="localChargingPower = 11"
            clickable
            class="flex-1 justify-center"
            :class="{ 'text-gray-500': localChargingPower !== 11 }"
          >
            11 kW
          </v-chip>
          <v-chip
            :color="localChargingPower === 22 ? 'purple' : 'grey-lighten-1'"
            :variant="localChargingPower === 22 ? 'flat' : 'outlined'"
            @click="localChargingPower = 22"
            clickable
            class="flex-1 justify-center"
            :class="{ 'text-gray-500': localChargingPower !== 22 }"
          >
            22 kW
          </v-chip>
        </div>
      </div>

    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, toRefs } from 'vue'

const props = defineProps({
  carPhases: {
    type: Number,
    required: true
  },
  chargingPower: {
    type: Number,
    required: true
  },
  isExpanded: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:carPhases', 'update:chargingPower', 'update:isExpanded'])

const { carPhases, chargingPower, isExpanded } = toRefs(props)

const localCarPhases = computed({
  get: () => carPhases.value,
  set: (value) => emit('update:carPhases', value)
})

const localChargingPower = computed({
  get: () => chargingPower.value,
  set: (value) => emit('update:chargingPower', value)
})

const actualPower = computed(() => {
  return localCarPhases.value === 1 ? localChargingPower.value / 3 : localChargingPower.value
})
</script>

<style scoped>
/* Mobile-optimized radio groups */
:deep(.radio-group-mobile .v-selection-control-group) {
  gap: 0.5rem;
}

:deep(.radio-mobile .v-selection-control) {
  min-height: 40px;
}

:deep(.radio-mobile .v-label) {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

/* Chip gap styling */
.chip-gap {
  gap: 0.75rem !important;
}

/* Responsive design */
@media (max-width: 640px) {
  :deep(.radio-group-mobile .v-selection-control-group) {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  :deep(.radio-mobile) {
    width: 100%;
  }
}

/* Ensure consistent spacing */
:deep(.v-radio-group) {
  margin-top: 0;
}

:deep(.v-radio-group .v-input__details) {
  display: none;
}
</style>
