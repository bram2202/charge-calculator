<template>
  <div class="mb-6">
    <v-chip-group
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      mandatory
      selected-class="text-white"
      class="justify-center"
    >
      <v-chip
        value="EV"
        :color="modelValue === 'EV' ? 'blue' : 'grey-lighten-3'"
        size="large"
        class="mx-2"
      >
        <v-icon start>mdi-car-electric</v-icon>
        EV Mode
      </v-chip>
      <v-chip
        value="Hybrid"
        :color="modelValue === 'Hybrid' ? 'green' : 'grey-lighten-3'"
        size="large"
        class="mx-2"
      >
        <v-icon start>mdi-car</v-icon>
        Hybrid Mode
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
