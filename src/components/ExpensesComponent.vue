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

  @media (max-width: 768px) {
    padding: 20px 15px;
  }

  @media (max-width: 480px) {
    padding: 15px 10px;
  }
}

h1 {
  font-size: 28px;
  color: #2d3748;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 26px;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
    margin-bottom: 20px;
    text-align: center;
  }
}

.content-wrapper {
  display: flex;
  gap: 30px;
  align-items: flex-start;

  @media (max-width: 1024px) {
    gap: 20px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
  }

  @media (max-width: 480px) {
    gap: 25px;
  }
}
</style>

