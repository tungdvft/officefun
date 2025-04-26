import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)

  // Khởi tạo từ localStorage khi tạo store
  const initialize = () => {
    if (process.client) {
      const savedAuth = localStorage.getItem('auth')
      if (savedAuth) {
        const authData = JSON.parse(savedAuth)
        user.value = {
          id: authData.id,
          email: authData.email,
          fullname: authData.fullname,
          birthdate: authData.birthdate,
          avatar: authData.avatar
        }
        token.value = authData.token
        isAuthenticated.value = authData.isAuthenticated
      }
    }
  }

  // Lưu thông tin user
  const setUser = (data) => {
    user.value = {
      id: data.id,
      email: data.email,
      fullname: data.fullname,
      birthdate: data.birthdate,
      avatar: data.avatar
    }
    token.value = data.token
    isAuthenticated.value = true
  }

  // Xóa thông tin user
  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    if (process.client) {
      localStorage.removeItem('auth')
    }
  }

  // Gọi initialize khi tạo store
  initialize()

  return { 
    user,
    token,
    isAuthenticated,
    setUser,
    logout
  }
})