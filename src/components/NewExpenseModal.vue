<template>
  <div class="new-expense-modal">
    <h2>Новый расход</h2>
    <form @submit.prevent="handleSubmit">
      <!-- Описание -->
      <div class="form-group">
        <label>Описание:</label>
        <input
          v-model="formData.description"
          type="text"
          placeholder="Введите описание"
          required
          :class="{ 
            invalid: errors.description 
          }"
          @blur="validateField('description')"
        />
      </div>

      <!-- Категории -->
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

      <!-- Дата и сумма -->
      <div class="form-row">
        <div class="form-group">
          <label>Дата:</label>
          <input
            v-model="formData.date"
            type="date"
            required
            :class="{ invalid: errors.date }"
            @blur="validateField('date')"
          />
        </div>

        <div class="form-group">
          <label>Сумма (₽):</label>
          <input
            v-model.number="formData.amount"
            type="number"
            min="1"
            placeholder="0"
            required
            :class="{ invalid: errors.amount }"
            @blur="validateField('amount')"
          />
        </div>
      </div>

      <!-- Сообщение об ошибке -->
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

const errors = ref({
  description: false,
  date: false,
  amount: false
});


// Список категорий с иконками
const categories = [
  {
    name: "Еда",
    icon: defineAsyncComponent(() => import("@/assets/icons/bag.svg")),
  },
  {
    name: "Транспорт",
    icon: defineAsyncComponent(() => import("@/assets/icons/car.svg")),
  },
  {
    name: "Жилье",
    icon: defineAsyncComponent(() => import("@/assets/icons/house.svg")),
  },
  {
    name: "Развлечения",
    icon: defineAsyncComponent(() => import("@/assets/icons/gameboy.svg")),
  },
  {
    name: "Образование",
    icon: defineAsyncComponent(() => import("@/assets/icons/teacher.svg")),
  },
  {
    name: "Другое",
    icon: defineAsyncComponent(() => import("@/assets/icons/message-text.svg")),
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


const validateField = (field) => {
  switch(field) {
    case 'description':
      const descValue = formData.value.description.trim();
      errors.value.description = !descValue || descValue.length < 4;
      break;
    
    case 'amount':
      const amountValue = formData.value.amount;
      errors.value.amount = !amountValue || amountValue <= 0 || isNaN(amountValue);
      break;
    
    case 'date':
      errors.value.date = !formData.value.date;
      break;
  }
};

const validateForm = () => {
  // Проверяем все поля перед отправкой
  validateField('description');
  validateField('amount');
  validateField('date');
  
  return Object.values(errors.value).every(error => !error);
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
  
  // Сбрасываем все ошибки
  errors.value = {
    description: false,
    date: false,
    amount: false
  };
};
</script>

<style lang="scss" scoped>
.new-expense-modal {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-width: 500px;
  width: 379px;

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

    &.valid {
      background: #f3ebff; 
      border-color: #7334ea; 
      box-shadow: 0 0 0 1px #7334ea; 
    }

    // Для кастомного выделения при фокусе в валидном состоянии
    &.valid:focus {
      border-color: #7334ea;
      box-shadow: 0 0 0 2px rgba(115, 52, 234, 0.2);
    }
  }
  input.invalid {
    border-color: #dc2626;
    background: #fef2f2;
    animation: shake 0.4s ease-in-out;

    &:focus {
      box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
    }
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-3px); }
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-start;
}

.category-card {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  height: 31px;
  min-width: 60px; 
  padding: 8px 20px;
  background: #f4f5f6;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;

  // Граница только для активного состояния
  border: 1px solid transparent;

  &:hover {
    .category-icon {
      color: #7334ea;
    }
  }

  &.active {
    background: rgba(115, 52, 234, 0.1);
    border-color: #7334ea;

    .category-icon,
    .category-name {
      color: #7334ea !important;
    }

    :deep(svg) {
      fill: currentColor !important;
    }
  }
}

.category-icon {
  flex-shrink: 0; 
  display: flex;
  align-items: center;
  color: #333;
  transition: color 0.2s;

  :deep(svg) {
    width: 1.5em;
    height: 1.5em;
    min-width: 24px;
    min-height: 24px;
  }
}

.category-name {
  font-size: 14px;
  color: #333;
  white-space: nowrap; 
  transition: color 0.2s;
}

.category-card:hover,
.category-card.active {
  border-color: transparent;

  box-shadow: none;
  transform: none;
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
