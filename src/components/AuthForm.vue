<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin">
      <h2>Вход</h2>

      <input v-model="username" placeholder="Email" required />

      <input type="password" v-model="password" placeholder="Пароль" required />

      <button type="submit" :disabled="authStore.state.value.isLoading">
        <span v-if="!authStore.state.value.isLoading"> Войти </span>
        <span v-else>Обработка...</span>
      </button>

      <div class="form-footer">
        <p
          v-if="authStore.state.value.error"
          class="error"
          v-html="formattedError"
        ></p>
      </div>

      <div class="modal__form-group">
        <p>Нет аккаунта?</p>
        <RouterLink to="/signup" class="modal__link">
          Зарегистрироваться
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { authStore } from "@/store/authStore";
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    const { success } = await authStore.login({
      email: username.value,
      password: password.value
    });
    
    if (success) {
      router.push('/expenses');
    }
    password.value = ""; // Всегда очищаем пароль
  } catch (error) {
    console.error("Ошибка входа:", error);
    password.value = "";
  }
};

const formattedError = computed(() => {
  if (!authStore.state.value.error) return '';
  
  // Обрабатываем разные форматы ошибок
  const messages = authStore.state.value.error.messages || 
                   [authStore.state.value.error];
  
  return messages
    .flatMap(msg => msg.split('\n')) // Разбиваем сообщения с переносами
    .filter(msg => msg.trim())       // Убираем пустые строки
    .join('<br>');                   // Объединяем с HTML-переносами
});

</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f0f0f0;
  padding: 20px;
}

form {
  width: 380px;
  border: 1px solid #e0e0e0;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: white;
  box-sizing: border-box;

  h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 24px;
    color: #333;
  }
}

input,
button {
  width: 100%;
  padding: 12px 10px;
  margin-bottom: 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

button {
  background-color: #6a11cb;
  color: white;
  border: none;
  margin-bottom: 20px;

  &:hover {
    background-color: #4a008f;
  }
}

button:hover {
  background-color: #4a008f; /* Более темный оттенок фиолетового */
}

.error {
  color: red;
  margin-top: 10px;
}

.logo img {
  width: 100px;
  height: auto;
  margin-bottom: 20px;
}

p {
  margin: 10px 0;
}

button[type="button"] {
  background-color: #6c757d;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button[type="button"]:hover {
  background-color: #495057;
}

.toggle-btn {
  display: inline-block;
  background: none;
  border: none;
  color: #6a11cb;
  padding: 0;
  margin-left: 5px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s;
}

.toggle-btn:hover {
  text-decoration: underline;
  background-color: transparent;
}

.toggle-text {
  color: #666;
  font-size: 14px;
  margin: 15px 0 0;
}

input[required] {
  border-left: 3px solid #6a11cb; /* Сопоставление с цветом кнопки */
}

input:focus {
  outline: 2px solid #6a11cb;
  border-color: transparent;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
}

.toggle-btn:hover {
  color: #4a008f;
  text-decoration: underline;
}

.error {
  margin: 10px 0;
}

.modal__form-group {
  text-align: center;
  margin-top: 15px;
}

.modal__form-group p,
.modal__form-group a {
  color: rgba(148, 166, 190, 0.4);
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: -0.14px;
}
.modal__form-group a {
  text-decoration: underline;
}

.modal__link {
  color: #6a11cb;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    text-decoration: underline;
    color: #4a008f;
  }
}
/* Адаптивный дизайн */
@media (max-width: 768px) {
  form {
    width: 90%;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }
  input {
    margin-bottom: 12px;
  }
}
</style>
