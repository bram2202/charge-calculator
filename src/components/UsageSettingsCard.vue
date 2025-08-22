<template>
  <v-card variant="outlined" class="h-full rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border-gray-200">
    <v-card-title class="bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 py-4 px-4 sm:px-6 rounded-t-xl cursor-pointer" @click="$emit('update:isExpanded', !isExpanded)">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-2">
          <v-icon icon="mdi-information" size="24" />
          <span class="text-lg sm:text-xl font-semibold">Usage Settings</span>
        </div>
        <v-icon 
          :icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" 
          size="24" 
          class="transition-transform duration-200"
        />
      </div>
    </v-card-title>
    <v-card-text v-show="isExpanded" class="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div class="space-y-3">
        <!-- Electric Usage Unit Chips -->
        <div class="mb-4">
          <label class="text-sm font-medium text-gray-500 mb-2 block">Electric Usage Unit</label>
          <div class="flex chip-gap">
            <v-chip
              :color="usageUnit === 'kwh' ? 'purple' : 'grey-lighten-1'"
              :variant="usageUnit === 'kwh' ? 'flat' : 'outlined'"
              @click="handleUnitChange('kwh')"
              clickable
              class="flex-1 justify-center"
              :class="{ 'text-gray-500': usageUnit !== 'kwh' }"
            >
              kWh/km
            </v-chip>
            <v-chip
              :color="usageUnit === 'wh' ? 'purple' : 'grey-lighten-1'"
              :variant="usageUnit === 'wh' ? 'flat' : 'outlined'"
              @click="handleUnitChange('wh')"
              clickable
              class="flex-1 justify-center"
              :class="{ 'text-gray-500': usageUnit !== 'wh' }"
            >
              Wh/km
            </v-chip>
          </div>
        </div>
        
        <v-text-field
          :model-value="displayValue"
          @update:model-value="handleValueChange"
          :label="`Electric Usage (${usageUnit === 'kwh' ? 'kWh/km' : 'Wh/km'})`"
          :suffix="usageUnit === 'kwh' ? 'kWh/km' : 'Wh/km'"
          type="number"
          :step="usageUnit === 'kwh' ? '0.001' : '1'"
          variant="outlined"
          color="purple"
          hint="Used to calculate estimated range"
          class="text-field-mobile"
          density="comfortable"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  kwhUsage: {
    type: Number,
    required: true
  },
  batteryCapacity: {
    type: Number,
    required: true
  },
  kmRange: {
    type: Number,
    required: true
  },
  isExpanded: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:kwhUsage', 'update:isExpanded'])

const usageUnit = ref('kwh')

// Convert between kWh/km and Wh/km
const displayValue = computed(() => {
  if (usageUnit.value === 'kwh') {
    return props.kwhUsage
  } else {
    return Math.round(props.kwhUsage * 1000)
  }
})

const handleUnitChange = (newUnit) => {
  usageUnit.value = newUnit
}

const handleValueChange = (value) => {
  const numericValue = parseFloat(value) || 0
  
  if (usageUnit.value === 'kwh') {
    emit('update:kwhUsage', numericValue)
  } else {
    // Convert Wh/km to kWh/km
    emit('update:kwhUsage', numericValue / 1000)
  }
}
</script>

<style scoped>
.v-card--variant-outlined {
  border-color: #e5e7eb !important;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.text-field-mobile :deep(.v-field) {
  border-radius: 12px;
}

.text-field-mobile :deep(.v-field__input) {
  outline: none !important;
}

.text-field-mobile :deep(.v-field):focus-within {
  outline: none !important;
  box-shadow: none !important;
}

.text-field-mobile :deep(.v-field__outline) {
  outline: none !important;
}

/* Remove blue focus ring/outline from the entire field */
.text-field-mobile :deep(.v-field--focused) {
  outline: none !important;
  box-shadow: none !important;
}

.text-field-mobile :deep(.v-field__field) {
  outline: none !important;
}

.text-field-mobile :deep(.v-input__details) {
  outline: none !important;
}

.text-field-mobile:focus-within {
  outline: none !important;
  box-shadow: none !important;
}

/* Chip gap styling */
.chip-gap {
  gap: 0.75rem !important;
}

@media (max-width: 640px) {
  .text-field-mobile :deep(.v-field__input) {
    font-size: 16px; /* Prevents zoom on iOS */
    outline: none !important;
  }
}
</style>
