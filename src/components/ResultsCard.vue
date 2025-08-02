<template>
    <div class="mt-8">
        <v-card :color="mode === 'Hybrid' ? (isChargingCheaper ? 'success' : 'warning') : 'info'" variant="tonal"
            class="text-center">
            <v-card-text>
                <v-icon
                    :icon="mode === 'EV' ? 'mdi-lightning-bolt' : (isChargingCheaper ? 'mdi-battery-charging' : 'mdi-gas-station')"
                    size="48" class="mb-4" />
                <h2 class="text-2xl font-bold mb-2">Result</h2>
                <h3 class="mb-2">{{ recommendationText }}</h3>
                <p class="">{{ recommendationComparisonText }}</p>

                <div v-if="mode === 'Hybrid'" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <v-card variant="outlined">
                        <v-card-text class="text-center">
                            <v-icon icon="mdi-battery-charging" size="32" color="blue" class="mb-2" />
                            <div class="text-lg font-semibold">Charging</div>
                            <div class="text-xl text-blue-600">€{{ chargingCost.toFixed(2) }}</div>
                        </v-card-text>
                    </v-card>

                    <v-card variant="outlined">
                        <v-card-text class="text-center">
                            <v-icon icon="mdi-gas-station" size="32" color="orange" class="mb-2" />
                            <div class="text-lg font-semibold">Petrol</div>
                            <div class="text-xl text-orange-600">€{{ petrolCost.toFixed(2) }}</div>
                        </v-card-text>
                    </v-card>
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    mode: {
        type: String,
        required: true
    },
    isChargingCheaper: {
        type: Boolean,
        required: true
    },
    chargingCost: {
        type: Number,
        required: true
    },
    petrolCost: {
        type: Number,
        required: true
    },
    kmRange: {
        type: Number,
        required: true
    }
})

// Generate recommendation text based on mode
const recommendationText = computed(() => {
    if (props.mode === 'EV') {
        return `Total charging cost: €${props.chargingCost.toFixed(2)} for ${props.kmRange.toFixed(0)} km range`
    } else {
        const savings = Math.abs(props.chargingCost - props.petrolCost)
        if (props.isChargingCheaper) {
            return `Charging is cheaper! Save €${savings.toFixed(2)}`
        } else {
            return `Petrol is cheaper! Save €${savings.toFixed(2)}`
        }
    }
})

const recommendationComparisonText = computed(() => {
    if (props.mode === 'Hybrid') {
        const savings = Math.abs(props.chargingCost - props.petrolCost)
        if (props.isChargingCheaper) {
            return `(Charging: €${props.chargingCost.toFixed(2)} vs Petrol: €${props.petrolCost.toFixed(2)})`
        } else {
            return `(Petrol: €${props.petrolCost.toFixed(2)} vs Charging: €${props.chargingCost.toFixed(2)})`
        }
    }
})
</script>
