<template>
  <div class="login-container">
    <form @submit.prevent="props.isSignUp ? register() : login()">
      <h2>{{ props.isSignUp ? "Регистрация" : "Вход" }}</h2>

      <input v-if="props.isSignUp" v-model="name" placeholder="Имя" required />

      <input v-model="username" placeholder="Логин" required />

      <input type="password" v-model="password" placeholder="Пароль" required />

      <button type="submit">
        {{ props.isSignUp ? "Зарегистрироваться" : "Войти" }}
      </button>

      <div class="form-footer">
        <p v-if="error" class="error">{{ error }}</p>
      </div>
      <div v-show="!isSignUp" class="modal__form-group">
        <p>Нужно зарегистрироваться?</p>
        <RouterLink to="/signup" class="modal__link">
          Регистрируйтесь здесь
        </RouterLink>
      </div>

      <div v-show="isSignUp" class="modal__form-group">
        <p>Уже есть аккаунт?</p>
        <RouterLink to="/signin" class="modal__link">
          Войдите здесь
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  isSignUp: {
    type: Boolean,
    required: true, // Обязательный пропс без значения по умолчанию
  },
});

const name = ref("");
const username = ref("");
const password = ref("");
const error = ref("");

const login = () => {
  error.value = "";
  if (!username.value || !password.value) {
    error.value = "Пожалуйста, заполните все поля";
    return;
  }
  console.log("Логин:", username.value, "Пароль:", password.value);
};

const register = () => {
  error.value = "";
  if (!name.value || !username.value || !password.value) {
    error.value = "Пожалуйста, заполните все поля";
    return;
  }
  console.log(
    "Имя:",
    name.value,
    "Логин:",
    username.value,
    "Пароль:",
    password.value
  );
};
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
