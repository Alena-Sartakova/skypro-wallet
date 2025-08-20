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
        <tr v-for="expense in expenses" :key="expense.id">
          <td>{{ expense.description }}</td>
          <td>{{ expense.category }}</td>
          <td>{{ expense.date }}</td>
          <td>{{ expense.amount }} ₽</td>
          <td>
            <img 
              src="../assets/icons/bag.svg" 
              alt="Удалить" 
              class="delete-icon"
              @click="handleDeleteExpense(expense.id)"
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { expensesStore } from '@/store/store.js';

const expenses = computed(() => expensesStore.getExpenses());

const handleDeleteExpense = (id) => {
  if (confirm('Вы уверены, что хотите удалить эту запись?')) {
    expensesStore.deleteExpense(id);
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

  table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      padding: 14px 16px;
      border-bottom: 1px solid #e2e8f0;
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
}

.delete-icon:hover {
  opacity: 0.7;
}

th:last-child, td:last-child {
  width: 40px;
  text-align: center;
}

</style>