<template>
  <div class="w-full">
    <h2 class="text-lg sm:text-xl font-semibold text-gray-800 text-center mb-4">
      Select Vehicle Type
    </h2>
    <v-chip-group
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      mandatory
      selected-class="text-white"
      class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
    >
      <v-chip
        value="EV"
        :color="modelValue === 'EV' ? 'blue' : 'grey-lighten-3'"
        size="large"
        class="w-full sm:w-auto min-h-[56px] text-base font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
      >
        <v-icon start size="24">mdi-car-electric</v-icon>
        Pure Electric (EV)
      </v-chip>
      <v-chip
        value="Hybrid"
        :color="modelValue === 'Hybrid' ? 'green' : 'grey-lighten-3'"
        size="large"
        class="w-full sm:w-auto min-h-[56px] text-base font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
      >
        <v-icon start size="24">mdi-car</v-icon>
        Hybrid Vehicle
      </v-chip>
    </v-chip-group>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>
