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

      <div class="space-y-3">
        <v-radio-group 
          :model-value="feeType" 
          @update:model-value="$emit('update:feeType', $event)"
          class="radio-group-mobile"
        >
          <template #label>
            <span class="text-sm sm:text-base font-medium text-gray-700">Fee Type</span>
          </template>
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <v-radio 
              label="Fixed Starting Fee" 
              value="fixed" 
              color="blue"
              class="radio-mobile"
            />
            <v-radio 
              label="Transaction Fee %" 
              value="percentage" 
              color="blue"
              class="radio-mobile"
            />
          </div>
        </v-radio-group>

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
      </div>
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

.radio-group-mobile :deep(.v-selection-control-group) {
  gap: 0.5rem;
}

.radio-mobile :deep(.v-label) {
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .text-field-mobile :deep(.v-field__input) {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
</style>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
