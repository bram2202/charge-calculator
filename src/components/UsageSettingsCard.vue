<template>
  <v-card variant="outlined" class="h-100">
    <v-card-title class="bg-purple-50 text-purple-800">
      <v-icon start>mdi-information</v-icon>
      Usage Settings
    </v-card-title>
    <v-card-text class="space-y-4">
      <v-text-field
        :model-value="kwhUsage"
        @update:model-value="$emit('update:kwhUsage', $event)"
        label="Electric Usage"
        suffix="kWh/km"
        type="number"
        step="0.001"
        variant="outlined"
        color="purple"
        hint="Used to calculate estimated range"
      />
      
      <v-alert
        type="info"
        variant="tonal"
        class="mt-3 text-left"
      >
        <template #title>Estimated Range</template>
        With {{ batteryCapacity }} kWh, you can drive approximately <b>{{ kmRange.toFixed(0) }} km</b>
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
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
