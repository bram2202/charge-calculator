<template>
  <v-card variant="outlined" class="h-full rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border-gray-200">
    <v-card-title class="bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 py-4 px-4 sm:px-6 rounded-t-xl">
      <div class="flex items-center gap-2">
        <v-icon icon="mdi-information" size="24" />
        <span class="text-lg sm:text-xl font-semibold">Usage Settings</span>
      </div>
    </v-card-title>
    <v-card-text class="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <v-text-field
        :model-value="kwhUsage"
        @update:model-value="$emit('update:kwhUsage', parseFloat($event) || 0)"
        label="Electric Usage"
        suffix="kWh/km"
        type="number"
        step="0.001"
        variant="outlined"
        color="purple"
        hint="Used to calculate estimated range"
        class="text-field-mobile"
        density="comfortable"
      />
      
      <v-alert
        type="info"
        variant="tonal"
        class="mt-3 text-left rounded-xl"
        color="purple"
      >
        <template #title>
          <span class="text-base sm:text-lg font-semibold">Estimated Range</span>
        </template>
        <div class="mt-2 text-sm sm:text-base">
          With <strong>{{ batteryCapacity }} kWh</strong>, you can drive approximately 
          <strong class="text-purple-700">{{ kmRange.toFixed(0) }} km</strong>
        </div>
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
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
  }
})

defineEmits(['update:kwhUsage'])
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
