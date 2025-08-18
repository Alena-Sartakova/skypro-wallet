<template>
  <div class="chart-container">
    <div class="chart-title">
      <h2>{{ periodLabel }}</h2>
      <p>Общая сумма расходов: {{ totalExpenses }} ₽</p>
    </div>
    <div class="chart">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  categories: {
    type: Array,
    default: () => ['Еда', 'Транспорт', 'Жилье', 'Развлечения', 'Образование', 'Другое']
  },
  expenses: {
    type: Array,
    default: () => [0, 0, 0, 0, 0, 0]
  },
  startDate: String,
  endDate: String
});

const chartCanvas = ref(null);
let chartInstance = null;

const chartData = computed(() => {
  const data = new Array(props.categories.length).fill(0);
  props.expenses.forEach(({ category, amount }) => {
    const index = props.categories.indexOf(category);
    if (index !== -1) data[index] += amount;
  });
  return data;
});

const totalExpenses = computed(() => 
  chartData.value.reduce((acc, val) => acc + val, 0)
);

const periodLabel = ref(`${props.startDate} — ${props.endDate}`);



const initChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  if (!chartCanvas.value) return;

  const ctx = chartCanvas.value.getContext('2d');
  
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: props.categories,
      datasets: [{
        label: 'Расходы по категориям',
        data: chartData.value, // Используем вычисляемые данные
        backgroundColor: [
          '#6d28d9', '#f6c177', '#4ecdc4', 
          '#ff6b6b', '#457b9d', '#e17055'
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 400,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: props.expenses.length > 0,
          backgroundColor: '#2d3748',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          displayColors: false,
          callbacks: {
            title: (items) => items[0].label || 'Категория',
            label: (context) => `${context.parsed.y} ₽`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#e2e8f0',
            drawTicks: false
          },
          ticks: {
            color: '#4a5568',
            callback: (value) => `${value} ₽`,
            padding: 10,
            maxTicksLimit: 6
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#4a5568',
            font: {
              weight: 500
            },
            maxRotation: 0,
            autoSkip: false
          }
        }
      }
    }
  });
};

onMounted(initChart);

watch([chartData, periodLabel], () => {
  if (chartInstance) {
    chartInstance.data.datasets[0].data = chartData.value;
    chartInstance.update();
  }
});
</script>

<style lang="scss" scoped>
.chart-container {
  flex: 1;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.chart-title {
  margin-bottom: 20px;

  h2 {
    font-size: 20px;
    color: #2d3748;
    margin-bottom: 4px;
  }

  p {
    font-size: 14px;
    color: #4a5568;
  }
}

.chart {
  height: 400px;
  position: relative;

  canvas {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
