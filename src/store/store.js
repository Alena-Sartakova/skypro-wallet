import http from '@/api/http';
import { ref } from 'vue'; 
import { authStore } from './authStore';

export const expensesStore = {
  state: ref([]),

  async getExpenses() {
    try {
      await authStore.init();
      
      const userId = authStore.state.value.user?._id;
      if (!userId) {
        console.error('UserId не определен:', authStore.state.value);
        throw new Error('Не определен пользователь');
      }
      
      const response = await http.get('/transactions', {
        params: { userId }
      });
      console.log('Полученные транзакции:', response.data);
      this.state.value = response.data.map(expense => ({
        id: expense._id,
        description: expense.description,
        category: expense.category,
        date: expense.date.split('T')[0],
        amount: expense.sum,
        userId: expense.userId
      }));
    } catch (error) {
      console.error('Ошибка получения транзакций:', error);
      throw error;
    }
  },

  async addExpense(newExpense) {
    try {
      // Валидация данных
      const errors = this.validateExpense(newExpense);
      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      // Форматирование данных для API
      const requestData = {
        description: newExpense.description.trim(),
        sum: Number(newExpense.sum),
        category: newExpense.category,
        date: this.formatDate(newExpense.date)
      };

      console.log('Отправка данных:', requestData);
      
      const response = await http.post('/transactions', requestData);
      
      if (response.status === 201) {
        console.log('Ответ сервера:', response.data);
        this.state.value = response.data.transactions.map(t => ({
          id: t._id,
          description: t.description,
          category: t.category,
          date: t.date,
          amount: t.sum
        }));
        return true;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error('Ошибка:', {
        request: newExpense,
        response: error.response?.data,
        error: errorMessage
      });
      throw new Error(errorMessage);
    }
  },

  validateExpense(expense) {
    const errors = [];
    const validCategories = ['food', 'transport', 'housing', 'joy', 'education', 'others'];

    // Проверка описания
    if (!expense.description || expense.description.trim().length < 4) {
      errors.push('Описание должно содержать минимум 4 символа');
    }

    // Проверка суммы
    if (isNaN(expense.sum) || Number(expense.sum) <= 0) {
      errors.push('Сумма должна быть положительным числом');
    }

    // Проверка категории
    if (!validCategories.includes(expense.category)) {
      errors.push(`Недопустимая категория. Допустимые значения: ${validCategories.join(', ')}`);
    }

    // Проверка даты
    if (!this.isValidDate(expense.date)) {
      errors.push('Некорректный формат даты');
    }

    return errors;
  },

  formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
  },

  isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  },


  async deleteExpense(id) {
    try {
      const response = await http.delete(`/transactions/${id}`);
      
      if (response.status === 201) {
        // Проверяем, есть ли поле transactions в ответе
        if (response.data && response.data.transactions) {
          this.state.value = response.data.transactions.map(expense => ({
            id: expense._id,
            description: expense.description,
            category: expense.category,
            date: new Date(expense.date).toLocaleDateString('ru-RU'),
            amount: expense.sum
          }));
        } else {
          // Если transactions нет, получаем список заново
          await this.getExpenses();
        }
      }
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('Транзакция уже удалена');
      }
      throw error;
    }
  }
  
   ,
  

};
