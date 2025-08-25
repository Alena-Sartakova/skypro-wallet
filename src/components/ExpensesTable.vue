<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Описание</th>
          <th>Категория</th>
          <th>Дата</th>
          <th>Сумма</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="expense in processedExpenses" :key="expense.id">
          <td>{{ expense.description }}</td>
          <td>{{ expense.translatedCategory }}</td>
          <td>{{ expense.formattedDate }}</td>
          <td>{{ expense.amount.toLocaleString() }} ₽</td>
          <td>
            <img
              src="../assets/icons/bag.svg"
              alt="Удалить"
              class="delete-icon"
              @click="handleDeleteExpense(expense.id)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { expensesStore } from "@/store/store.js";

// Словарь перевода категорий
const categoryTranslations = {
  food: "Еда",
  transport: "Транспорт",
  housing: "Жилье",
  entertainment: "Развлечения",
  education: "Образование",
  other: "Другое",
};

// Форматирование даты
const formatDate = (isoDate) => {
  try {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    };
    return new Date(isoDate).toLocaleDateString("ru-RU", options);
  } catch {
    return isoDate;
  }
};

// Обработанные данные
const processedExpenses = computed(() => {
  return [...expensesStore.state.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((expense) => ({
      ...expense,
      translatedCategory:
        categoryTranslations[expense.category] || expense.category,
      formattedDate: formatDate(expense.date),
    }));
});

onMounted(() => {
  expensesStore.getExpenses();
});

const handleDeleteExpense = async (id) => {
  if (confirm("Вы уверены, что хотите удалить эту запись?")) {
    try {
      await expensesStore.deleteExpense(id);
    } catch (err) {
      if (err.message === "Транзакция уже удалена") {
        alert("Эта транзакция уже была удалена");
      } else {
        alert("Произошла ошибка при удалении");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.table-container {
  flex: 1;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-x: auto; 

  table {
    width: 100%;
    min-width: 379px;
    border-collapse: collapse;

    thead {
      border-bottom: 1px solid #e2e8f0;
    }

    th,
    td {
      padding: 12px 16px;
      vertical-align: middle;
      text-align: left;
      white-space: nowrap; // Запрет переноса текста
    }

    th {
      background-color: #f7fafc;
      color: #4a5568;
      font-weight: 600;
    }

    tr:last-child td {
      border-bottom: none;
    }
  }
}

.delete-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: opacity 0.3s;
  min-width: 20px; // Фиксированный размер иконки

  &:hover {
    opacity: 0.7;
  }
}

th:last-child,
td:last-child {
  width: 40px;
  text-align: center;
  padding-right: 8px;
}

// Адаптация для мобильных
@media (max-width: 480px) {
  .table-container {
    padding: 12px;
    border-radius: 8px;
    
    table {
      th,
      td {
        padding: 10px 12px;
        font-size: 14px;
      }
    }
  }
  
  .delete-icon {
    width: 24px;
    height: 24px;
  }
}
</style>


