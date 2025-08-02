<template>
  <v-card variant="outlined" class="h-100">
    <v-card-title class="bg-green-50 text-green-800">
      <v-icon start>mdi-gas-station</v-icon>
      Petrol Comparison
    </v-card-title>
    <v-card-text class="space-y-4">
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
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
