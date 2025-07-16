import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTokenStore = defineStore('token', {
  state: () => ({
    isLoggedIn: ref(false),
    tokenBalance: ref(10), // Khởi tạo với 10 token
  }),
  actions: {
    async initialize() {
      console.log('Initializing token store...');
      this.isLoggedIn = !!localStorage.getItem('authToken');
      this.tokenBalance = this.isLoggedIn ? 10 : 0;
      console.log('Token store initialized, isLoggedIn:', this.isLoggedIn, 'tokenBalance:', this.tokenBalance);
    },
    deductTokens(amount) {
      if (this.tokenBalance >= amount) {
        this.tokenBalance -= amount;
        console.log(`Deducted ${amount} tokens. New balance: ${this.tokenBalance}`);
        return true;
      }
      console.log('Insufficient tokens:', this.tokenBalance);
      return false;
    },
    topupTokens(amount) {
      this.tokenBalance += amount;
      console.log(`Topped up ${amount} tokens. New balance: ${this.tokenBalance}`);
    },
    login() {
      this.isLoggedIn = true;
      this.tokenBalance = 10;
      localStorage.setItem('authToken', 'sample-token');
      console.log('User logged in, tokenBalance:', this.tokenBalance);
    },
    logout() {
      this.isLoggedIn = false;
      this.tokenBalance = 0;
      localStorage.removeItem('authToken');
      console.log('User logged out');
    },
  },
});