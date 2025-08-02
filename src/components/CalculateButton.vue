<template>
  <div class="text-center my-6">
    <v-btn
      size="x-large"
      :color="mode === 'EV' ? 'blue' : 'green'"
      variant="elevated"
      class="px-8 py-2"
      @click="$emit('calculate')"
    >
      <v-icon start>mdi-calculator</v-icon>
      Calculate {{ mode === 'EV' ? 'Charging Cost' : 'Best Option' }}
    </v-btn>
  </div>
</template>

<script setup>
defineProps({
  mode: {
    type: String,
    required: true
  }
})

defineEmits(['calculate'])
</script>
