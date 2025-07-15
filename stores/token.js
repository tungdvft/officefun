import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: ref(false),
    tokenBalance: ref(10), // Khởi tạo với 10 token
  }),
  actions: {
    // Khởi tạo trạng thái người dùng (giả lập kiểm tra đăng nhập)
    async initialize() {
      console.log('Initializing user store...');
      // Giả lập: Kiểm tra trạng thái đăng nhập từ localStorage hoặc API
      this.isLoggedIn = !!localStorage.getItem('authToken');
      this.tokenBalance = this.isLoggedIn ? 10 : 0; // Reset token nếu đăng nhập
      console.log('User store initialized, isLoggedIn:', this.isLoggedIn, 'tokenBalance:', this.tokenBalance);
    },
    // Trừ token khi truy cập nội dung
    deductTokens(amount) {
      if (this.tokenBalance >= amount) {
        this.tokenBalance -= amount;
        console.log(`Deducted ${amount} tokens. New balance: ${this.tokenBalance}`);
        return true;
      }
      console.log('Insufficient tokens:', this.tokenBalance);
      return false;
    },
    // Nạp thêm token (giả lập)
    topupTokens(amount) {
      this.tokenBalance += amount;
      console.log(`Topped up ${amount} tokens. New balance: ${this.tokenBalance}`);
    },
    // Đăng nhập (giả lập)
    login() {
      this.isLoggedIn = true;
      this.tokenBalance = 10; // Reset token khi đăng nhập
      localStorage.setItem('authToken', 'sample-token');
      console.log('User logged in, tokenBalance:', this.tokenBalance);
    },
    // Đăng xuất
    logout() {
      this.isLoggedIn = false;
      this.tokenBalance = 0;
      localStorage.removeItem('authToken');
      console.log('User logged out');
    },
  },
});