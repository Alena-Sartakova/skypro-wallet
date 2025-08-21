import { ref } from 'vue'; 

export const expensesStore = {
  state: ref(JSON.parse(localStorage.getItem('expenses')) || []), 

  getExpenses() {
    return this.state.value; 
  },

  addExpense(newExpense) {
    const id = this.state.value.length 
      ? Math.max(...this.state.value.map(e => e.id)) + 1 
      : 1;
    
    const expense = {
      ...newExpense,
      id,
      date: new Date(newExpense.date).toISOString().split('T')[0] // Нормализация даты
    };
    
    this.state.value = [...this.state.value, expense]; 
    this.saveToLocalStorage();
  },

  deleteExpense(id) {
    this.state.value = this.state.value.filter(expense => expense.id !== id);
    this.saveToLocalStorage();
  },

  saveToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(this.state.value)); 
  },

  clearExpenses() {
    this.state.value = [];
    this.saveToLocalStorage();
  }
};
