<!-- components/charts/LineChart.vue -->
<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale)

const props = defineProps({
  chartData: Object
})
</script>

<template>
  <Line 
    :data="chartData" 
    :options="{ responsive: true, maintainAspectRatio: false }" 
  />
</template>