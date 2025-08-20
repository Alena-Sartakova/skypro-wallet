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
          :exact-active-class="'active'"
        >
          Мои расходы
        </router-link>

        <router-link
          to="/analysis"
          class="nav-link"
          :exact-active-class="'active'"
        >
          Анализ расходов
        </router-link>
      </nav>

      <button 
        class="logout-btn" 
        @click="handleLogout"
        :disabled="isLoggingOut"
      >
        {{ isLoggingOut ? 'Выход...' : 'Выйти' }}
      </button>
    </div>
    <transition name="fade">
    <div v-if="logoutError" class="error-message">
      {{ logoutError }}
    </div>
  </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { authStore } from "@/store/authStore";
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoggingOut = ref(false);
const logoutError = ref(null);

const handleLogout = async () => {
  try {
    isLoggingOut.value = true;
    logoutError.value = null;
    
    // 1. Вызываем выход
    await authStore.logout();

    // 2. Принудительная проверка
    if (router.currentRoute.value.path !== '/signin') {
      router.replace('/signin').catch(() => {
        window.location.href = '/signin';
      });
    }
  } catch (error) {
    console.error("Ошибка при выходе:", error);
    logoutError.value = 'Не удалось выйти. Попробуйте еще раз.';
    setTimeout(() => {
      logoutError.value = null;
    }, 5000);
  } finally {
    isLoggingOut.value = false;
  }
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
.error-message {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px;
  background: #ffebee;
  color: #b71c1c;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
