<template>
  <div class="layout">
    <HeaderComponent />
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
import { authStore } from "@/store/authStore";
import { expensesStore } from "@/store/store";
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Создаем computed свойство для проверки авторизации
const isAuthenticated = computed(() => authStore.state.value.isAuthenticated);

onMounted(async () => {
  try {
    // Инициализируем хранилище аутентификации
    await authStore.init();

    // Проверяем авторизацию
    if (!isAuthenticated.value) {
      router.push('/signin');
      return;
    }

    // Получаем userId
    const userId = authStore.state.value.user?.id;
    if (!userId) {
      console.error('UserId не определен');
      router.push('/signin');
      return;
    }

    // Загружаем транзакции
    await expensesStore.getExpenses();
  } catch (error) {
    console.error('Ошибка при инициализации:', error);
    router.push('/signin');
  }
});
</script>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
}

.content {
  flex: 1;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }
}

@media (max-width: 992px) {
  .layout {
    background-color: #e0e0e0;
  }
}

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    align-items: center;
  }

  .content {
    width: 100%;
    max-width: 600px;
  }
}

@media (max-width: 480px) {
  .layout {
    padding: 10px;
  }

  .content {
    padding: 10px;
  }
}
</style>
