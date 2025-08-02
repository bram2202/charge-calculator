<template>
  <div class="text-center my-6 sm:my-8">
    <v-btn
      size="x-large"
      :color="mode === 'EV' ? 'blue' : 'green'"
      variant="elevated"
      class="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-2 rounded-xl text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 min-h-[56px]"
      @click="$emit('calculate')"
    >
      <v-icon start size="24">mdi-calculator</v-icon>
      <span class="ml-2">
        Calculate {{ mode === 'EV' ? 'Charging Cost' : 'Best Option' }}
      </span>
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
