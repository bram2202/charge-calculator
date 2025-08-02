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
        @update:model-value="$emit('update:petrolPrice', $event)"
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
      
      <v-text-field
        :model-value="petrolUsage"
        @update:model-value="$emit('update:petrolUsage', $event)"
        label="Petrol Usage"
        suffix="km/l"
        type="number"
        step="0.1"
        variant="outlined"
        color="green"
        class="text-field-mobile"
        density="comfortable"
      />

      <v-text-field
        :model-value="kwhUsage"
        @update:model-value="$emit('update:kwhUsage', $event)"
        label="Electric Usage"
        suffix="kWh/km"
        type="number"
        step="0.01"
        variant="outlined"
        color="green"
        class="text-field-mobile"
        density="comfortable"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
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
  }
})

defineEmits([
  'update:petrolPrice',
  'update:petrolUsage',
  'update:kwhUsage'
])
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

@media (max-width: 640px) {
  .text-field-mobile :deep(.v-field__input) {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
</style>
