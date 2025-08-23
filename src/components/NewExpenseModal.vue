<template>
  <div class="new-expense-modal">
    <h2>Новый расход</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Описание:</label>
        <input
          v-model="formData.description"
          type="text"
          placeholder="Введите описание"
          required
        />
      </div>

      <div class="form-group">
        <label>Категория:</label>
        <div class="category-grid">
          <div
            v-for="category in categories"
            :key="category.name"
            class="category-card"
            :class="{ active: formData.category === category.name }"
            @click="formData.category = category.name"
          >
            <component :is="category.icon" class="category-icon" />
            <span class="category-name">{{ category.name }}</span>
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Дата:</label>
          <input v-model="formData.date" type="date" required />
        </div>

        <div class="form-group">
          <label>Сумма (₽):</label>
          <input
            v-model.number="formData.amount"
            type="number"
            min="1"
            placeholder="0"
            required
          />
        </div>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit" class="submit-button">Добавить расход</button>
    </form>
  </div>
</template>

<script setup>
import { expensesStore } from "@/store/store";
import { ref, defineAsyncComponent } from "vue";

// Инициализация данных формы
const formData = ref({
  description: "",
  category: "Еда",
  date: "",
  amount: null,
});

const error = ref("");


// Список категорий с иконками
const categories = [
  {
    name: "Еда",
    icon: defineAsyncComponent(() => import("@/assets/icons/meal.svg")),
  },
  {
    name: "Транспорт",
    icon: defineAsyncComponent(() => import("@/assets/icons/transport.svg")),
  },
  {
    name: "Жилье",
    icon: defineAsyncComponent(() => import("@/assets/icons/house.svg")),
  },
  {
    name: "Развлечения",
    icon: defineAsyncComponent(() =>
      import("@/assets/icons/entertainment.svg")
    ),
  },
  {
    name: "Образование",
    icon: defineAsyncComponent(() => import("@/assets/icons/education.svg")),
  },
  {
    name: "Другое",
    icon: defineAsyncComponent(() => import("@/assets/icons/other.svg")),
  },
];

const categoryMapping = {
  Еда: "food",
  Транспорт: "transport",
  Жилье: "housing",
  Развлечения: "joy",
  Образование: "education",
  Другое: "others",
};

// Валидация формы
const validateForm = () => {
  const amount = formData.value.amount;
  return (
  formData.value.description.trim() &&
  formData.value.date &&
  typeof amount === 'number' &&
  amount > 0
  );
 };

// Обработчик отправки формы
const handleSubmit = async () => {
  try {
    if (!validateForm()) {
      error.value = "Пожалуйста, заполните все обязательные поля корректно";
      return;
    }

    try {
      await expensesStore.addExpense({
        description: formData.value.description.trim(),
        category: categoryMapping[formData.value.category],
        date: formData.value.date,
        sum: formData.value.amount,
      });

      resetForm();
      error.value = "";
      alert("Расход успешно добавлен!");
    } catch (err) {
      if (err.response && err.response.data) {
        error.value = err.response.data.message || "Произошла ошибка";
      } else {
        error.value = err.message || "Произошла ошибка при сохранении расхода";
      }
    }
  } catch {
    error.value = "Ошибка авторизации";
  }
};

// Сброс формы
const resetForm = () => {
  formData.value = {
    description: "",
    category: "Еда",
    date: "",
    amount: null,
  };
  error.value = "";
};
</script>

<style lang="scss" scoped>
.new-expense-modal {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-width: 500px;
  width: 100%;

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #222222;
  }
}

.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #666666;
  }

  input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.2s;

    &:focus {
      border-color: #6366f1;
      outline: none;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
  }
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-start;
}

.category-card {
  position: relative;
  display: inline-flex;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  margin-right: 12px;
  margin-bottom: 12px;
  height: auto;
  &:hover {
    border-radius: 15px;
    background: #f1f3f5;
    transform: none;

    .category-name {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &.active {
    border-radius: 45px;
    background: transparent;
    border-color: #7334ea;
    background: rgba(115, 52, 234, 0.1);
    box-shadow: none;

    .category-icon {
      color: #7334ea;
    }
  }
}

.category-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(svg) {
    width: 1.5em;
    height: 1.5em;
    min-width: 24px;
    min-height: 24px;
  }
}

.category-name {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 4px;
  font-size: 0.8em;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: 0.2s;
}

.category-card.active {
  box-shadow: 0 0 4px rgba(115, 52, 234, 0.5);
}

.form-row {
  display: block;
}

.submit-button {
  width: 100%;
  padding: 10px 20px;
  background: #7334ea;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

input,
.category-card,
.submit-button {
  height: 48px;
  box-sizing: border-box;
}
</style>
