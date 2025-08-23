<template>
  <div class="calendar-container">
    <h2>Выбор периода</h2>
    <div class="calendar-wrapper">
      <div class="calendar-header">
        <div
          v-for="day in ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']"
          :key="day"
          class="day-header"
        >
          {{ day }}
        </div>
      </div>

      <div class="calendar-scroll">
        <div
          v-for="(monthGroup, index) in groupedDates"
          :key="index"
          class="month-group"
        >
          <div class="month-header">
            {{ formatMonth(monthGroup.month, monthGroup.year) }}
          </div>

          <div class="month-days">
            <div
              v-for="(date, di) in monthGroup.dates"
              :key="di"
              class="day-cell"
              :class="{
                empty: !date,
                selected: isDateSelected(date),
                'in-range': isDateInRange(date),
                'single-day': isSingleDay && isDateSelected(date),
              }"
              @click="date && selectDate(date)"
            >
              {{ date ? date.getDate() : "" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  selectedStart: Date,
  selectedEnd: Date,
});

const emit = defineEmits(["date-selected"]);

// Локальное состояние дат
const startDate = ref(null);
const endDate = ref(null);
const currentDate = new Date();

// Нормализация даты (без времени)
const normalizeDate = (date) =>
  date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : null;

// Основная логика выбора даты
const selectDate = (clickedDate) => {
  const normalized = normalizeDate(clickedDate);
  if (!normalized) return;




  // Логика выбора
  if (!startDate.value) {
    // Первый выбор
    startDate.value = normalized;


  } else if (!endDate.value) {
    // Второй выбор
    if (normalized.getTime() === startDate.value.getTime()) {
      // Сброс при клике на ту же дату
      resetSelection();
    } else {
      endDate.value = normalized;
      // Сортировка если end < start
      if (endDate.value < startDate.value) {
        [startDate.value, endDate.value] = [endDate.value, startDate.value];

        console.log('[Calendar] Dates swapped:', formatLogRange());

      }
      // Валидация периода
      if (!validatePeriod(startDate.value, endDate.value)) {
        console.warn('Некорректный период');
        resetSelection();
      }
    }
  } else {
    // Третий выбор - сброс
    resetSelection();
    startDate.value = normalized;
  }

  emitSelection();
};

// Сброс выбора
const resetSelection = () => {
  startDate.value = null;
  endDate.value = null;
};

// Валидация периода
const validatePeriod = (start, end) => {
  if (!start || !end) return true;
  const maxPeriod = 365 * 24 * 60 * 60 * 1000; // 1 год
  return (end - start) <= maxPeriod;
};

// Вспомогательные функции для логирования
const formatLogDate = (date) => 
  date ? date.toLocaleDateString('ru-RU') : 'null';

const formatLogRange = () => 
  `${formatLogDate(startDate.value)} — ${formatLogDate(endDate.value)}`;

const emitSelection = () => {

  emit("date-selected", startDate.value, endDate.value);
};


// Состояния для стилизации
const isSingleDay = computed(() => 
startDate.value?.getTime() === endDate.value?.getTime()
);

const isDateSelected = (date) =>
date &&
((startDate.value && date.getTime() === startDate.value.getTime()) ||
 (endDate.value && date.getTime() === endDate.value.getTime()));

const isDateInRange = (date) =>
date &&
startDate.value &&
endDate.value &&
date > startDate.value &&
date < endDate.value;

// Генерация данных календаря
const groupedDates = computed(() => {
  const result = [];
  for (let m = 0; m < 3; m++) {
    const monthDate = new Date();
    monthDate.setMonth(currentDate.getMonth() + m);

    result.push({
      month: monthDate.getMonth(),
      year: monthDate.getFullYear(),
      dates: generateMonthDates(monthDate),
    });
  }
  return result;
});

// Генерация дней месяца
function generateMonthDates(monthDate) {
  const dates = [];
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Пустые ячейки для начала недели
  const startDay = (firstDay.getDay() + 6) % 7;
  for (let i = 0; i < startDay; i++) dates.push(null);

  // Заполнение дней месяца
  for (let d = 1; d <= lastDay.getDate(); d++) {
    dates.push(new Date(year, month, d));
  }

  return dates;
}

// Форматирование названия месяца
const formatMonth = (monthIndex, year) => {
  const monthName = new Date(year, monthIndex).toLocaleString("ru-RU", {
    month: "long",
  });
  return `${monthName[0].toUpperCase()}${monthName.slice(1)} ${year}`;
};

// Синхронизация с внешними пропсами
watch(
  () => [props.selectedStart, props.selectedEnd],
  ([newStart, newEnd]) => {
    startDate.value = normalizeDate(newStart);
    endDate.value = normalizeDate(newEnd);
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.calendar-container {
  flex: 0 0 400px;
  background: white;
  border-radius: 12px;
  padding: 25px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
h2 {
  font-size: 20px;
  color: #2d3748;
  margin-bottom: 20px;
}
.calendar-wrapper {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  height: 500px;
  overflow: hidden;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f8fafc;
  padding: 10px 0;
  position: sticky;
  top: 0;
  z-index: 2;
  border-bottom: 1px solid #e2e8f0;
}

.calendar-scroll {
  height: calc(100% - 40px);
  overflow-y: auto;
}

.month-group {
  padding: 0 8px;
}

.month-header {
  padding: 16px 8px;
  font-weight: 500;
  color: #2d3748;
  background: white;
  top: 40px;
  z-index: 1;
  box-shadow: 0 2px 4px -2px rgba(0, 0, 0, 0.05);
}

.month-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding-bottom: 12px;
}

.day-header {
  text-align: center;
  font-size: 12px;
  color: #4a5568;
  padding: 8px;
  width: 36px; // Синхронизируем размер с ячейками
  margin: 0 auto; // Центрирование
}

.day-cell {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  margin: 2px auto;
  background: transparent;

  /* Стили для дней из других месяцев */
  &:not(.current-month) {
    background: #f8fafc;
    color: #a0aec0;
  }

  /* Стили при наведении */
  &:hover:not(.empty) {
    background: #f3f4f6;
  }

  /* Выбранные даты */
  &.selected {
    background: #6d28d9;
    color: white;
    font-weight: 500;
    transform: scale(1.1);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

    &[data-single="true"] {
      background: #8b5cf6;
      animation: pulse 1s ease-in-out infinite;
    }
  }

  /* Даты в диапазоне */
  &.in-range {
    background: #ede9fe;
    color: #6d28d9;
    transform: scale(1.05);
  }

  /* Пустые ячейки */
  &.empty {
    visibility: hidden;
    pointer-events: none;
  }

  /* Новый класс для одиночного дня */
  &.single-day {
    background: #6d28d9 !important;
    color: white !important;
    font-weight: bold;
    animation: pulse 0.5s ease-in-out infinite;
  }

  /* Класс для конечной даты диапазона */
  &.selected-end {
    background: #4c1d95 !important;
    color: white !important;
    transform: scale(1.08);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}
</style>
