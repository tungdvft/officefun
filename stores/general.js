import { defineStore } from 'pinia'
import { useTokenDeduction } from '~/composables/useTokenDeduction'

export const useUserStore = defineStore('user', {
  state: () => ({
    // Thông tin người dùng
    id: null,
    username: '',
    email: '',
    fullname: '',
    birthdate: null,
    
    // Numerology
    numerologyData: null,
    
    // Tokens
    tokens: 0,
    
    // Trạng thái
    isLoading: false,
    error: null,
    isAuthenticated: false
  }),

  getters: {
    hasTokens: (state) => state.tokens > 0,
    userInfo: (state) => ({
      id: state.id,
      username: state.username,
      email: state.email,
      fullname: state.fullname,
      birthdate: state.birthdate,
      tokens: state.tokens,
      isAuthenticated: state.isAuthenticated
    })
  },

  actions: {
    // Khởi tạo từ localStorage
    initialize() {
      if (process.client) {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          this.$patch({
            id: userData.id || null,
            username: userData.username || '',
            email: userData.email || '',
            fullname: userData.fullname || '',
            birthdate: userData.birthdate || null,
            tokens: userData.tokens || 0,
            isAuthenticated: userData.isAuthenticated || false
          })
        }
      }
    },

    // Đăng nhập bằng Google
    async googleLogin(userData) {
      this.isLoading = true
      this.error = null

      try {
        // Cập nhật state với dữ liệu từ Google
        this.$patch({
          id: userData.id || null,
          email: userData.email || '',
          fullname: userData.displayName || userData.name || '',
          isAuthenticated: true
        })

        // Đồng bộ với server
        const response = await $fetch('/api/user/sync', {
          method: 'POST',
          body: {
            id: this.id,
            email: this.email,
            displayName: this.fullname,
            birthdate: userData.birthdate || null
          }
        })

        // Kiểm tra response từ API
        if (response.success && response.user) {
          // Cập nhật lại state với dữ liệu từ backend
          this.$patch({
            id: response.user.id,
            email: response.user.email,
            fullname: response.user.displayName || '',
            birthdate: response.user.birthdate || null
          })

          // Lấy số dư token
          await this.fetchUserTokens()

          // Lưu vào localStorage
          this.saveToLocalStorage()
          return true // Đăng nhập thành công
        } else {
          this.error = 'Phản hồi API không hợp lệ: Thiếu success hoặc user'
          return false
        }
      } catch (error) {
        console.error('Google login error:', error)
        this.error = error.message || 'Đăng nhập thất bại'
        this.isAuthenticated = false
        return false
      } finally {
        this.isLoading = false
      }
    },

    // Lấy số dư token từ backend
    async fetchUserTokens() {
      if (!this.id) {
        this.error = 'Không có ID người dùng để lấy token'
        console.error(this.error)
        return
      }

      try {
        const response = await $fetch('/api/tokens', {
          method: 'GET',
          query: { user_id: this.id }
        })

        if (response && typeof response.balance === 'number') {
          this.tokens = response.balance
          this.saveToLocalStorage()
        } else {
          this.error = 'Không thể lấy số dư token: Phản hồi không hợp lệ'
          console.error(this.error)
        }
      } catch (error) {
        console.error('Fetch tokens error:', error)
        this.error = error.message || 'Lỗi khi lấy số dư token'
      }
    },

    // Lấy thông tin Numerology và trừ token
     async fetchNumerology({ fullname, birthdate }) {
      this.isLoading = true;
      this.error = null;
      this.numerologyData = null;
      try {
        // Lưu thông tin người dùng
        this.fullname = fullname;
        this.birthdate = birthdate;
        
        // Gọi API
        const response = await fetch("/api/overview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fullname.trim(),
            birthDate: birthdate.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error(`API trả về lỗi: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        if (data) {
          this.numerologyData = data;
        } else {
          throw new Error("Response rỗng hoặc không hợp lệ");
        }
      } catch (err) {
        this.error = err.message || "Có lỗi xảy ra khi gọi API. Vui lòng thử lại.";
        console.error("Lỗi:", err);
      } finally {
        this.isLoading = false;
      }
    },

    // Lưu vào localStorage
    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('user', JSON.stringify({
          id: this.id,
          username: this.username,
          email: this.email,
          fullname: this.fullname,
          birthdate: this.birthdate,
          tokens: this.tokens,
          isAuthenticated: this.isAuthenticated
        }))
      }
    },

    // Đăng xuất
    logout() {
      this.$reset()
      if (process.client) {
        localStorage.removeItem('user')
      }
    },

    // Cập nhật tokens
    updateTokens(amount) {
      this.tokens = Math.max(0, this.tokens + amount) // Đảm bảo token không âm
      this.saveToLocalStorage()
    },

    // Xóa thông tin Numerology
    clearNumerologyData() {
      this.numerologyData = null
      this.error = null
    }
  }
})