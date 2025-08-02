<template>
  <v-card variant="outlined" class="h-100">
    <v-card-title class="bg-blue-50 text-blue-800">
      <v-icon start>mdi-battery-charging</v-icon>
      Charging Details
    </v-card-title>
    <v-card-text class="space-y-4">
      <v-text-field
        :model-value="batteryCapacity"
        @update:model-value="$emit('update:batteryCapacity', $event)"
        label="Battery Capacity"
        suffix="kWh"
        type="number"
        step="0.1"
        variant="outlined"
        color="blue"
      />
      
      <v-text-field
        :model-value="pricePerKWh"
        @update:model-value="$emit('update:pricePerKWh', $event)"
        label="Price per kWh"
        prefix="€"
        type="number"
        step="0.01"
        variant="outlined"
        color="blue"
      />

      <v-radio-group 
        :model-value="feeType" 
        @update:model-value="$emit('update:feeType', $event)"
        inline
      >
        <template #label>
          <span class="text-sm font-medium">Fee Type</span>
        </template>
        <v-radio label="Fixed Starting Fee" value="fixed" color="blue" />
        <v-radio label="Transaction Fee %" value="percentage" color="blue" />
      </v-radio-group>

      <v-text-field
        v-if="feeType === 'fixed'"
        :model-value="startingFee"
        @update:model-value="$emit('update:startingFee', $event)"
        label="Starting Fee"
        prefix="€"
        type="number"
        step="0.01"
        variant="outlined"
        color="blue"
      />

      <v-text-field
        v-if="feeType === 'percentage'"
        :model-value="transactionFeePercent"
        @update:model-value="$emit('update:transactionFeePercent', $event)"
        label="Transaction Fee"
        suffix="%"
        type="number"
        step="0.1"
        variant="outlined"
        color="blue"
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
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
