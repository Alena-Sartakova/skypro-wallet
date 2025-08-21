<template>
  <div class="container">
    <h1>Анализ расходов</h1>
    <div class="content-wrapper">
      <!-- Календарь -->
      <CalendarComponent
        @date-selected="handleDateSelection"
        :selected-start="selectedStartDate"
        :selected-end="selectedEndDate"
      />

      <!-- График  -->
      <ChartComponent
        :start-date="formattedStartDate"
        :end-date="formattedEndDate"
        :expenses="filteredExpenses"
        :categories="categories"
      />
    </div>
  </div>
</template>

<script setup>
import { expensesStore } from "@/store/store";
import CalendarComponent from "./CalendarComponent.vue";
import ChartComponent from "./ChartComponent.vue";
import { computed, ref } from "vue";


const categories = [
  "Еда",
  "Транспорт",
  "Жилье",
  "Развлечения",
  "Образование",
  "Другое",
];

const selectedStartDate = ref(null);
const selectedEndDate = ref(null);

const expenses = computed(() => expensesStore.getExpenses());

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

const filteredExpenses = computed(() => {
  if (!selectedStartDate.value || !selectedEndDate.value) return [];

  return expenses.value.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate >= selectedStartDate.value &&
      expenseDate <= selectedEndDate.value
    );
  });
});

const handleDateSelection = (start, end) => {
  try {
    if (start && !(start instanceof Date)) {
      throw new Error("Invalid start date type");
    }
    if (end && !(end instanceof Date)) {
      throw new Error("Invalid end date type");
    }

    selectedStartDate.value = start || null;
    selectedEndDate.value = end || null;
  } catch (error) {
    console.error("Date handling error:", error);
    selectedStartDate.value = null;
    selectedEndDate.value = null;
  }
};
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
