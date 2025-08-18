<template>
  <header class="header">
    <div class="logo">
      <img src="../assets/logo.svg" alt="Логотип" />
    </div>

    <div class="nav-container">
      <nav class="nav">
        <router-link
          to="/expenses"
          class="nav-link"
          :class="{ active: $route.path === '/expenses' }"
        >
          Мои расходы
        </router-link>

        <router-link
          to="/analysis"
          class="nav-link"
          :class="{ active: $route.path === '/analysis' }"
        >
          Анализ расходов
        </router-link>
      </nav>

      <button class="logout-btn" @click="showLogoutMessage">Выйти</button>
    </div>
  </header>
</template>

<script setup>
const showLogoutMessage = () => {
  // Заглушка для демонстрации
  alert("Функция выхода будет реализована после подключения API");

  // Для тестирования перехода можно раскомментировать:
  // router.push('/login');
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
}

.logo img {
  height: 15px;
}

.nav-container {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-grow: 1;
  justify-content: flex-end;
}

.nav {
  display: flex;
  gap: 2rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  &-link {
    color: #333;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 400;
    transition: all 0.2s ease;
    position: relative;

    &:hover:not(.active) {
      color: #6d28d9;
      font-weight: 600;
    }

    &.active {
      color: #6d28d9;
      font-weight: 600;

      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -4px;
        width: 100%;
        height: 2px;
        background: #6d28d9;
      }
    }
  }
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-size: 1rem;
  font-weight: 400;
  padding: 0;
  transition: color 0.2s ease;
  margin-left: auto;

  &:hover {
    color: #6d28d9;
  }
}
</style>
