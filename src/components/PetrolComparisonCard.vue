<template>
  <v-card variant="outlined" class="h-full rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border-gray-200">
    <v-card-title class="bg-gradient-to-r from-green-50 to-green-100 text-green-800 py-4 px-4 sm:px-6 rounded-t-xl">
      <div class="flex items-center gap-2">
        <v-icon icon="mdi-gas-station" size="24" />
        <span class="text-lg sm:text-xl font-semibold">Petrol Comparison</span>
      </div>
    </v-card-title>
    <v-card-text class="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <v-text-field
        :model-value="petrolPrice"
        @update:model-value="$emit('update:petrolPrice', parseFloat($event) || 0)"
        label="Petrol Price"
        prefix="€"
        suffix="per liter"
        type="number"
        step="0.01"
        variant="outlined"
        color="green"
        class="text-field-mobile"
        density="comfortable"
      />
      
      <!-- Petrol Usage Unit Chips -->
      <div class="mb-4">
        <label class="text-sm font-medium text-gray-500 mb-2 block">Petrol Usage Unit</label>
        <div class="flex chip-gap">
          <v-chip
            :color="!useLitersPer100km ? 'green' : 'grey-lighten-1'"
            :variant="!useLitersPer100km ? 'flat' : 'outlined'"
            @click="$emit('update:useLitersPer100km', false)"
            clickable
            class="flex-1 justify-center"
            :class="{ 'text-gray-500': useLitersPer100km }"
          >
            km/l
          </v-chip>
          <v-chip
            :color="useLitersPer100km ? 'green' : 'grey-lighten-1'"
            :variant="useLitersPer100km ? 'flat' : 'outlined'"
            @click="$emit('update:useLitersPer100km', true)"
            clickable
            class="flex-1 justify-center"
            :class="{ 'text-gray-500': !useLitersPer100km }"
          >
            l/100km
          </v-chip>
        </div>
      </div>
      
      <v-text-field
        :model-value="displayPetrolUsage"
        @update:model-value="handlePetrolUsageChange"
        :label="useLitersPer100km ? 'Petrol Usage (l/100km)' : 'Petrol Usage (km/l)'"
        :suffix="useLitersPer100km ? 'l/100km' : 'km/l'"
        type="number"
        step="any"
        variant="outlined"
        color="green"
        class="text-field-mobile"
        density="comfortable"
        @blur="handleBlur"
      />

      <v-text-field
        :model-value="kwhUsage.toFixed(3)"
        @update:model-value="$emit('update:kwhUsage', parseFloat($event) || 0)"
        label="Electric Usage"
        suffix="kWh/km"
        type="number"
        step="0.001"
        variant="outlined"
        color="green"
        class="text-field-mobile"
        density="comfortable"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  petrolPrice: {
    type: Number,
    required: true
  },
  petrolUsage: {
    type: Number,
    required: true
  },
  kwhUsage: {
    type: Number,
    required: true
  },
  useLitersPer100km: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:petrolPrice',
  'update:petrolUsage',
  'update:kwhUsage',
  'update:useLitersPer100km'
])

// Track if user is currently editing
const isEditing = ref(false)
const inputValue = ref('')

// Convert between km/l and l/100km
const convertKmPerLiterToLitersPer100km = (kmPerL) => {
  if (kmPerL === 0) return 0
  return 100 / kmPerL
}

const convertLitersPer100kmToKmPerLiter = (litersPer100km) => {
  if (litersPer100km === 0) return 0
  return 100 / litersPer100km
}

// Display the petrol usage in the selected unit
const displayPetrolUsage = computed(() => {
  // If user is actively editing, show the raw input value
  if (isEditing.value && inputValue.value !== '') {
    return inputValue.value
  }
  
  if (props.useLitersPer100km) {
    const converted = convertKmPerLiterToLitersPer100km(props.petrolUsage)
    return converted % 1 === 0 ? converted.toString() : converted.toFixed(1)
  }
  return props.petrolUsage % 1 === 0 ? props.petrolUsage.toString() : props.petrolUsage.toFixed(1)
})

// Watch for unit changes and update display
watch(() => props.useLitersPer100km, () => {
  isEditing.value = false
  inputValue.value = ''
})

// Handle petrol usage input
const handlePetrolUsageChange = (value) => {
  isEditing.value = true
  inputValue.value = value
  
  // Handle empty input
  if (value === '' || value === null || value === undefined) {
    return
  }

  const numValue = parseFloat(value)
  
  // Handle NaN case - don't update the prop
  if (isNaN(numValue)) {
    return
  }
  
  if (props.useLitersPer100km) {
    // Convert from l/100km to km/l
    const kmPerL = convertLitersPer100kmToKmPerLiter(numValue)
    emit('update:petrolUsage', kmPerL)
  } else {
    // Already in km/l
    emit('update:petrolUsage', numValue)
  }
}

// Handle when user finishes editing
const handleBlur = () => {
  isEditing.value = false
  inputValue.value = ''
  
  // Ensure we have a valid value
  if (props.petrolUsage === 0) {
    emit('update:petrolUsage', 0)
  }
}
</script>

<style scoped>
.v-card--variant-outlined {
  border-color: #e5e7eb !important;
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
