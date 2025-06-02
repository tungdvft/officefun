<template>
  <div class="relative">
    <canvas :id="chartId" ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  scores: {
    type: Object,
    required: true,
    validator: (scores) => ['D', 'I', 'S', 'C'].every(key => key in scores)
  }
});

const chartCanvas = ref(null);
const chartId = `radar-chart-${Math.random().toString(36).substr(2, 9)}`;
let chartInstance = ref(null);

const createChart = () => {
  if (!chartCanvas.value) {
    console.error('Chart canvas not found');
    return;
  }

  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  console.log('Creating chart with scores:', props.scores);

  const ctx = chartCanvas.value.getContext('2d');
  chartInstance.value = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Thống trị (D)', 'Ảnh hưởng (I)', 'Ổn định (S)', 'Tuân thủ (C)'],
      datasets: [{
        label: 'Phân tích DISC',
        data: [props.scores.D, props.scores.I, props.scores.S, props.scores.C],
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(124, 58, 237, 1)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20,
            font: {
              size: 12
            }
          },
          pointLabels: {
            font: {
              size: 14
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 14
            }
          }
        }
      }
    }
  });
};

onMounted(() => {
  console.log('RadarChart mounted, initializing chart');
  createChart();
});

watch(() => props.scores, (newScores) => {
  console.log('Scores updated:', newScores);
  createChart();
}, { deep: true });

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    console.log('Chart destroyed on unmount');
  }
});
</script>

<style scoped>
.relative {
  max-height: 300px;
  width: 100%;
}
canvas {
  max-height: 300px !important;
  width: 100% !important;
}
</style>
