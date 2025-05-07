<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top Navigation -->
    <header class="bg-purple-800 text-white shadow-lg sticky top-0 z-20">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/xem" class="flex items-center hover:opacity-90 transition-opacity">
            <svg width="32" height="32" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" class="mr-2">
              <defs>
                <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#5B21B6;stop-opacity:1"/>
                  <stop offset="100%" style="stop-color:#A78BFA;stop-opacity:1"/>
                </linearGradient>
              </defs>
              <path d="M20 50 Q40 10 60 50 Q80 90 100 50 Q80 10 60 50 Q40 90 20 50" 
                    fill="none" stroke="url(#infinityGradient)" stroke-width="8" stroke-linecap="round">
                <animate attributeName="stroke-opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite"/>
              </path>
              <path d="M20 50 Q40 10 60 50 Q80 90 100 50 Q80 10 60 50 Q40 90 20 50" 
                    fill="none" stroke="#8B5CF6" stroke-width="12" stroke-linecap="round" opacity="0.3"/>
              <polygon points="60,45 62,50 67,50 63,53 64,58 60,55 56,58 57,53 53,50 58,50" 
                      fill="#FFFFFF" />
            </svg>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-1">
            <div 
              class="relative h-full group"
              v-for="(item, index) in mainMenu" 
              :key="index"
            >
              <button 
                class="flex items-center h-full px-4 hover:bg-purple-700 transition-colors duration-200 rounded-t-lg"
              >
                <span>{{ item.title }}</span>
                <svg 
                  class="w-4 h-4 ml-1 transition-transform duration-200" 
                  :class="{ 'rotate-180': activeDropdown === index }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Dropdown Menu -->
              <div 
                class="absolute left-0 top-full w-56 bg-white rounded-b-lg rounded-tl-lg shadow-xl z-30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1"
              >
                <div class="py-1">
                  <NuxtLink 
                    v-for="(subItem, subIndex) in item.children" 
                    :key="subIndex"
                    :to="subItem.path"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-900 transition-colors duration-150"
                    active-class="bg-purple-100 text-purple-900 font-medium"
                  >
                    {{ subItem.title }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <template v-if="!userStore.isAuthenticated">
              <NuxtLink 
                to="/dang-nhap"
                class="flex items-center text-sm rounded-full px-4 py-2 text-white hover:bg-purple-700 transition-colors duration-200"
              >
                <span>Đăng nhập</span>
              </NuxtLink>
            </template>
            <template v-else>
              <div class="relative group">
                <button class="flex items-center space-x-2 focus:outline-none rounded-full px-4 py-2 hover:bg-purple-700 transition-colors duration-200">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="hidden md:inline">{{ userStore.fullname || 'Tài khoản' }}</span>
                </button>
                <div class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl py-2 z-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1">
                  <NuxtLink 
                    to="/tai-khoan"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-900 transition-colors duration-150"
                  >
                    Tài khoản
                  </NuxtLink>
                  <button
                    @click="logout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-900 transition-colors duration-150"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </template>
            
            <!-- Mobile menu button -->
            <button 
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="md:hidden text-white focus:outline-none p-1 rounded-full hover:bg-purple-700 transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  :d="isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-show="isMobileMenuOpen" class="md:hidden bg-purple-700 pb-4 transition-all duration-300 ease-in-out">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <div v-for="(item, index) in mainMenu" :key="index">
            <button 
              @click="toggleMobileDropdown(index)"
              class="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-600 transition-colors duration-200"
            >
              <span>{{ item.title }}</span>
              <svg 
                class="w-4 h-4 ml-auto transition-transform duration-200" 
                :class="{ 'rotate-180': activeMobileDropdown === index }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div 
              v-show="activeMobileDropdown === index"
              class="pl-8 pr-2 py-2 space-y-1 transition-all duration-300 ease-in-out"
            >
              <NuxtLink 
                v-for="(subItem, subIndex) in item.children" 
                :key="subIndex"
                :to="subItem.path"
                class="block px-3 py-2 rounded-md text-sm font-medium text-purple-100 hover:bg-purple-600 hover:text-white transition-colors duration-200"
                active-class="bg-purple-800 text-white font-semibold"
                @click="isMobileMenuOpen = false"
              >
                {{ subItem.title }}
              </NuxtLink>
            </div>
          </div>
          <!-- Mobile Auth Menu -->
          <div class="pt-2 border-t border-purple-600">
            <template v-if="!userStore.isAuthenticated">
              <NuxtLink 
                to="/dang-nhap"
                class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-600 transition-colors duration-200"
                @click="isMobileMenuOpen = false"
              >
                Đăng nhập
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink 
                to="/tai-khoan"
                class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-600 transition-colors duration-200"
                @click="isMobileMenuOpen = false"
              >
                Tài khoản
              </NuxtLink>
              <button
                @click="logout"
                class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-600 transition-colors duration-200"
              >
                Đăng xuất
              </button>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 bg-gray-100 p-6">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { navigateTo } from '#app'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
onMounted(() => {
  if (process.client) {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        // Kiểm tra xem có đủ thông tin để coi là đã đăng nhập
        if (userData.id && userData.isAuthenticated === true) {
          userStore.$patch({
            id: userData.id,
            fullname: userData.fullname || '',
            email: userData.email || '',
            isAuthenticated: true
          })
        }
      } catch (e) {
        console.error('Lỗi khi parse user data từ localStorage:', e)
      }
    }
  }
})
const mainMenu = [
  {
    title: "Cá nhân",
    children: [
      { title: "Thần số học mỗi ngày", path: "/xem" },
      { title: "Tổng quan", path: "/xem/tong-quan" },
      { title: "Giải đáp thắc mắc", path: "/xem/giai-dap-thac-mac" },
      { title: "Đặt danh xưng quốc tế", path: "/xem/danh-xung" }
    ]
  },
  {
    title: "Mối quan hệ",
    children: [
      { title: "Kiểm tra hợp nhau", path: "/xem/kiem-tra-hop-nhau" },
      { title: "Chọn ngày cưới", path: "/xem/wedding-date" }
    ]
  },
  {
    title: "Nghề nghiệp",
    children: [
      { title: "Định hướng nghề", path: "/xem/career" },
      { title: "Tên thương hiệu", path: "/xem/ten-thuong-hieu" }
    ]
  },
  {
    title: "Gia đình",
    children: [
      { title: "Thần số học trẻ em", path: "/xem/child" },
      { title: "Đặt tên con", path: "/xem/dat-ten-con" }
    ]
  }
]

const isMobileMenuOpen = ref(false)
const activeMobileDropdown = ref(null)

const toggleMobileDropdown = (index) => {
  activeMobileDropdown.value = activeMobileDropdown.value === index ? null : index
}

const logout = async () => {
  try {
    await userStore.logout()
    isMobileMenuOpen.value = false
    await navigateTo('/dang-nhap')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<style scoped>
.router-link-active.router-link-exact-active {
  @apply bg-purple-100 text-purple-900 font-medium;
}

/* Smooth transitions for dropdowns */
.group:hover .group-hover\:translate-y-0 {
  transform: translateY(0);
}
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
.group:hover .group-hover\:visible {
  visibility: visible;
}
</style>