<template>
  <div class="container">
    <h1>Мои расходы</h1>
    <div class="content-wrapper">
      <ExpensesTable />

      <NewExpenseModal />
    </div>
  </div>
</template>

<script setup>
import ExpensesTable from "./ExpensesTable.vue";
import NewExpenseModal from "./NewExpenseModal.vue";
</script>

<style lang="scss" scoped>
.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 30px;
}

h1 {
  font-size: 28px;
  color: #2d3748;
  margin-bottom: 30px;
}

.content-wrapper {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}
</style>
