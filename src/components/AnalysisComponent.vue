<template>
  <div class="container">
    <h1>Анализ расходов</h1>
    <div class="content-wrapper">
      <!-- Календарь -->
      <CalendarComponent @date-selected="logDates" />

      <!-- График  -->
      <ChartComponent
        :expenses="chartReadyData"
        :is-loading="isLoading"
        :start-date="formattedStartDate"
        :end-date="formattedEndDate"
      />
    </div>
    <!-- Блок с информацией о периоде -->
    <div v-if="selectedStartDate" class="period-info">
      <template v-if="isSingleDay">
        {{ formattedStartDate }}
      </template>
      <template v-else>
        {{ formattedStartDate }} — {{ formattedEndDate }}
        <span class="days-count">({{ periodDays }} дней)</span>
      </template>
    </div>
    <div v-if="errorMessage" class="error-status">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { expensesStore } from "@/store/store";
import CalendarComponent from "./CalendarComponent.vue";
import ChartComponent from "./ChartComponent.vue";


// Состояния дат
const selectedStartDate = ref(null);
const selectedEndDate = ref(null);
const isLoading = ref(false);
const errorMessage = ref(null);
const chartReadyData = ref([]); 

// Вычисляемые свойства
const hasSelectedPeriod = computed(
  () => !!selectedStartDate.value && !!selectedEndDate.value
);

const isSingleDay = computed(
  () => selectedStartDate.value?.getTime() === selectedEndDate.value?.getTime()
);

const periodDays = computed(() => {
  if (!selectedStartDate.value || !selectedEndDate.value) return 0;
  const diff = selectedEndDate.value - selectedStartDate.value;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
});

const logDates = (start, end) => {


  selectedStartDate.value = start;
  selectedEndDate.value = end;
};

// Загрузка данных с API
const loadExpenses = async () => {
  try {
    if (!hasSelectedPeriod.value || isLoading.value) return;

    isLoading.value = true;
    chartReadyData.value = []; // Сбрасываем предыдущие данные

    console.log("⌛ Запрос к API:", {
      start: selectedStartDate.value.toISOString(),
      end: selectedEndDate.value.toISOString(),
    });

    const result = await expensesStore.getPeriodExpenses(
      selectedStartDate.value,
      selectedEndDate.value
    );

    // Устанавливаем данные только после успешного ответа
    chartReadyData.value = result.filter(e => 
      e?.category && typeof e.amount === 'number'
    );

    console.log("✅ Успешный ответ:", {
      count: chartReadyData.value.length,
      sample: chartReadyData.value.slice(0, 3),
    });

  } catch (error) {
    handleError("Ошибка загрузки", error);
  } finally {
    isLoading.value = false;
  }
};

// Обработчик ошибок
const handleError = (context, error) => {
  const errorDetails = {
    message: error.message,
    response: error.response?.data,
    period: {
      start: selectedStartDate.value,
      end: selectedEndDate.value,
    },
  };

  console.error(context, errorDetails);
  errorMessage.value = errorDetails.message;
};

// Форматированные даты
const formattedStartDate = computed(
  () =>
    selectedStartDate.value?.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
    }) || ""
);

const formattedEndDate = computed(
  () =>
    selectedEndDate.value?.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
    }) || ""
);


// Автоматическая загрузка при изменении дат
watch(
  [selectedStartDate, selectedEndDate],
  ([newStart, newEnd], [oldStart, oldEnd]) => {
    if (
      newStart?.getTime() !== oldStart?.getTime() ||
      newEnd?.getTime() !== oldEnd?.getTime()
    ) {
      loadExpenses();
    }
  }
);


watch(chartReadyData, (newData) => {
  if (newData.length > 0) {
    console.log('📤 Данные для графика:', {
      count: newData.length,
      sample: newData.slice(0, 3),
      categories: [...new Set(newData.map(e => e.category))]
    });
  }
}, { deep: true });
</script>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
}

h1 {
  font-size: 28px;
  color: #2d3748;
  margin-bottom: 30px;

  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: 20px;
  }
}

.content-wrapper {
  display: flex;
  gap: 30px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
  }
}

h2 {
  font-size: 20px;
  color: #2d3748;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    font-size: 18px;
  }
}
</style>
