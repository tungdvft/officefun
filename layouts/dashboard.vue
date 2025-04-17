<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top Navigation -->
    <header class="bg-purple-800 text-white shadow-lg sticky top-0 z-20">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/xem">
            <div class="flex items-center">
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
            </div>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-1">
            <div 
              class="relative h-full"
              v-for="(item, index) in mainMenu" 
              :key="index"
              @mouseenter="openMenu(index)"
              @mouseleave="closeMenu(index)"
            >
              <button 
                class="flex items-center h-full px-4 hover:bg-purple-700 transition-colors"
              >
                <span>{{ item.title }}</span>
                <svg 
                  class="w-4 h-4 ml-1 transition-transform" 
                  :class="{ 'rotate-180': activeDropdown === index }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Dropdown Menu -->
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div 
                  v-show="activeDropdown === index"
                  class="absolute left-0 top-full w-56 bg-white rounded-b-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30"
                  @mouseenter="openMenu(index)"
                  @mouseleave="closeMenu(index)"
                >
                  <div class="py-1">
                    <NuxtLink 
                      v-for="(subItem, subIndex) in item.children" 
                      :key="subIndex"
                      :to="subItem.path"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-900"
                      active-class="bg-purple-100 text-purple-900"
                    >
                      {{ subItem.title }}
                    </NuxtLink>
                  </div>
                </div>
              </transition>
            </div>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <template v-if="!userStore.isAuthenticated">
              <NuxtLink 
                to="/login"
                class="flex items-center text-sm rounded-full px-4 py-2 text-white hover:bg-purple-700 transition-colors"
              >
                <span>Đăng nhập</span>
              </NuxtLink>
            </template>
            <template v-else>
              <div 
                class="dropdown relative"
                @mouseenter="openMenu('auth')"
                @mouseleave="closeMenu('auth')"
              >
                <button class="flex items-center space-x-2 focus:outline-none rounded-full px-4 py-2 hover:bg-purple-700 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="hidden md:inline">{{ userStore.fullname || 'Tài khoản' }}</span>
                </button>
                <div 
                  class="absolute top-full right-0 bg-white rounded-lg shadow-lg py-2 w-48 z-40 ring-1 ring-black ring-opacity-5"
                  :class="{ 'block': activeMenu === 'auth', 'hidden': activeMenu !== 'auth' }"
                  @mouseenter="openMenu('auth')"
                  @mouseleave="closeMenu('auth')"
                >
                  <NuxtLink 
                    to="/tai-khoan"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-900"
                  >
                    Tài khoản
                  </NuxtLink>
                  <button
                    @click="logout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-900"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </template>
            
            <!-- Mobile menu button -->
            <button 
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="md:hidden text-white focus:outline-none"
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
      <div v-show="isMobileMenuOpen" class="md:hidden bg-purple-700 pb-4">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <div v-for="(item, index) in mainMenu" :key="index">
            <button 
              @click="toggleMobileDropdown(index)"
              class="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-600"
            >
              <span>{{ item.title }}</span>
              <svg 
                class="w-4 h-4 ml-auto transition-transform" 
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
              class="pl-8 pr-2 py-2 space-y-1"
            >
              <NuxtLink 
                v-for="(subItem, subIndex) in item.children" 
                :key="subIndex"
                :to="subItem.path"
                class="block px-3 py-2 rounded-md text-sm font-medium text-purple-100 hover:bg-purple-600"
                active-class="bg-purple-800 text-white"
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
                to="/login"
                class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-600"
                @click="isMobileMenuOpen = false"
              >
                Đăng nhập
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink 
                to="/tai-khoan"
                class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-600"
                @click="isMobileMenuOpen = false"
              >
                Tài khoản
              </NuxtLink>
              <button
                @click="logout"
                class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-600"
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
import { ref, onMounted, onUnmounted } from 'vue'
import { navigateTo } from '#app'
import { useUserStore } from '~/stores/general'

const userStore = useUserStore()

const mainMenu = [
  {
    title: "Cá nhân",
    children: [
      { title: "Tổng quan", path: "/xem" },
      { title: "Thần số học mỗi ngày", path: "/xem/daily" },
      { title: "Chu kỳ vận số", path: "/xem/full" },
      { title: "Giải đáp thắc mắc", path: "/xem/consult" },
      { title: "Đặt danh xưng quốc tế", path: "/xem/nick-name" }
    ]
  },
  {
    title: "Mối quan hệ",
    children: [
      { title: "Kiểm tra hợp nhau", path: "/xem/compatibility" },
      { title: "Chọn ngày cưới", path: "/xem/wedding-date" }
    ]
  },
  {
    title: "Nghề nghiệp",
    children: [
      { title: "Định hướng nghề", path: "/xem/career" },
      { title: "Tên thương hiệu", path: "/xem/numerology-brand" }
    ]
  },
  {
    title: "Gia đình",
    children: [
      { title: "Thần số học trẻ em", path: "/xem/child" },
      { title: "Đặt tên con", path: "/xem/baby-name" }
    ]
  }
]

const isMobileMenuOpen = ref(false)
const activeDropdown = ref(null)
const activeMobileDropdown = ref(null)
const activeMenu = ref(null)
const menuTimeout = ref(null)

const toggleMobileDropdown = (index) => {
  activeMobileDropdown.value = activeMobileDropdown.value === index ? null : index
}

const openMenu = (menu) => {
  clearTimeout(menuTimeout.value)
  activeMenu.value = menu
}

const closeMenu = (menu) => {
  menuTimeout.value = setTimeout(() => {
    if (activeMenu.value === menu) {
      activeMenu.value = null
    }
  }, 200)
}

const logout = async () => {
  try {
    await userStore.logout()
    isMobileMenuOpen.value = false
    activeMenu.value = null
    await navigateTo('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

onMounted(() => {
  userStore.initialize()
})

onUnmounted(() => {
  clearTimeout(menuTimeout.value)
})
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  top: 100%;
  margin-top: 0;
  z-index: 40;
}

.dropdown-menu {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform-origin: top center;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>