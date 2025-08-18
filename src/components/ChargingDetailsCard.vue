<template>
  <v-card variant="outlined" class="h-full rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border-gray-200">
    <v-card-title class="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 py-4 px-4 sm:px-6 rounded-t-xl">
      <div class="flex items-center gap-2">
        <v-icon icon="mdi-battery-charging" size="24" />
        <span class="text-lg sm:text-xl font-semibold">Charging Details</span>
      </div>
    </v-card-title>
    <v-card-text class="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <v-text-field
        :model-value="batteryCapacity"
        @update:model-value="$emit('update:batteryCapacity', parseFloat($event) || 0)"
        label="Battery Capacity"
        suffix="kWh"
        type="number"
        step="0.1"
        variant="outlined"
        color="blue"
        class="text-field-mobile"
        density="comfortable"
      />
      
      <v-text-field
        :model-value="pricePerKWh"
        @update:model-value="$emit('update:pricePerKWh', parseFloat($event) || 0)"
        label="Price per kWh"
        prefix="€"
        type="number"
        step="0.01"
        variant="outlined"
        color="blue"
        class="text-field-mobile"
        density="comfortable"
      />

      <!-- Fee Type Chips -->
      <div class="mb-4">
        <label class="text-sm font-medium text-gray-500 mb-2 block">Fee Type</label>
        <div class="flex chip-gap">
          <v-chip
            :color="feeType === 'fixed' ? 'blue' : 'grey-lighten-1'"
            :variant="feeType === 'fixed' ? 'flat' : 'outlined'"
            @click="$emit('update:feeType', 'fixed')"
            clickable
            class="flex-1 justify-center"
            :class="{ 'text-gray-500': feeType !== 'fixed' }"
          >
            Fixed Starting Fee
          </v-chip>
          <v-chip
            :color="feeType === 'percentage' ? 'blue' : 'grey-lighten-1'"
            :variant="feeType === 'percentage' ? 'flat' : 'outlined'"
            @click="$emit('update:feeType', 'percentage')"
            clickable
            class="flex-1 justify-center"
            :class="{ 'text-gray-500': feeType !== 'percentage' }"
          >
            Transaction Fee %
          </v-chip>
        </div>
      </div>

      <v-text-field
        v-if="feeType === 'fixed'"
        :model-value="startingFee"
        @update:model-value="$emit('update:startingFee', parseFloat($event) || 0)"
        label="Starting Fee"
        prefix="€"
        type="number"
        step="0.01"
        variant="outlined"
        color="blue"
        class="text-field-mobile"
        density="comfortable"
      />

      <v-text-field
        v-if="feeType === 'percentage'"
        :model-value="transactionFeePercent"
        @update:model-value="$emit('update:transactionFeePercent', parseFloat($event) || 0)"
        label="Transaction Fee"
        suffix="%"
        type="number"
        step="0.1"
        variant="outlined"
        color="blue"
        class="text-field-mobile"
        density="comfortable"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  batteryCapacity: {
    type: Number,
    required: true
  },
  pricePerKWh: {
    type: Number,
    required: true
  },
  feeType: {
    type: String,
    required: true
  },
  startingFee: {
    type: Number,
    required: true
  },
  transactionFeePercent: {
    type: Number,
    required: true
  }
})

defineEmits([
  'update:batteryCapacity',
  'update:pricePerKWh',
  'update:feeType',
  'update:startingFee',
  'update:transactionFeePercent'
])
</script>

<style scoped>
.v-card--variant-outlined {
  border-color: #e5e7eb !important;
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

.radio-group-mobile :deep(.v-selection-control-group) {
  gap: 0.5rem;
}

.radio-mobile :deep(.v-label) {
  font-size: 0.875rem;
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

.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
