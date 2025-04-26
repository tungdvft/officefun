<template>
  <header 
    ref="header" 
    class="bg-white text-gray-800 border-b border-gray-100 sticky top-0 z-50 transition-all duration-300"
    :class="{ 'shadow-sm': isSticky }"
  >
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo bên trái -->
        <NuxtLink to="/" class="flex items-center space-x-2 group shrink-0">
          <div class="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
            <font-awesome-icon :icon="['fas', 'calculator']" class="text-lg text-purple-600" />
          </div>
          <h1 class="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Thần Số Học
          </h1>
        </NuxtLink>

        <!-- Main Menu căn giữa -->
        <nav class="hidden md:flex items-center h-full absolute left-1/2 transform -translate-x-1/2">
          <div class="flex items-center h-full space-x-1">
            <NuxtLink 
              to="/" 
              class="px-4 py-2 rounded-lg font-medium hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200 h-full flex items-center"
              active-class="text-purple-600 bg-purple-50 font-semibold"
            >
              Trang Chủ
            </NuxtLink>
            <NuxtLink 
              to="/gioi-thieu" 
              class="px-4 py-2 rounded-lg font-medium hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200 h-full flex items-center"
              active-class="text-purple-600 bg-purple-50 font-semibold"
            >
              Về chúng tôi
            </NuxtLink>
            <NuxtLink 
              to="/kien-thuc" 
              class="px-4 py-2 rounded-lg font-medium hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200 h-full flex items-center"
              active-class="text-purple-600 bg-purple-50 font-semibold"
            >
              Kiến thức
            </NuxtLink>
            <NuxtLink 
              to="/blog" 
              class="px-4 py-2 rounded-lg font-medium hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200 h-full flex items-center"
              active-class="text-purple-600 bg-purple-50 font-semibold"
            >
              Blog
            </NuxtLink>
          </div>
        </nav>

        <!-- Auth Buttons bên phải - Ẩn trên mobile -->
        <div class="hidden md:flex items-center space-x-4 ml-auto">
          <template v-if="!userStore.isAuthenticated">
            <NuxtLink 
              to="/dang-nhap"
              class="block px-4 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              Đăng nhập
            </NuxtLink>
          </template>
          <template v-else>
            <div 
              class="dropdown relative"
              @mouseenter="openMenu('auth')"
              @mouseleave="closeMenu('auth')"
            >
              <button class="flex items-center space-x-2 focus:outline-none group">
                <div class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-purple-100 transition-colors duration-300">
                  <font-awesome-icon :icon="['fas', 'user']" class="text-gray-600 group-hover:text-purple-600" />
                </div>
              </button>
              <div 
                class="dropdown-menu absolute top-full right-0 bg-white shadow-xl rounded-lg py-2 w-48 z-30 border border-gray-100"
                :class="{ 'block': activeMenu === 'auth', 'hidden': activeMenu !== 'auth' }"
              >
                <NuxtLink 
                  to="/tai-khoan"
                  class="block px-4 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                >
                  Tài khoản
                </NuxtLink>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center ml-4">
          <button 
            @click="toggleMobileMenu" 
            class="p-2 rounded-full hover:bg-purple-50 transition-colors duration-200 focus:outline-none"
            aria-label="Menu"
          >
            <!-- Icon sẽ thay đổi giữa bars và times dựa trên mobileMenuOpen -->
            <font-awesome-icon 
              :icon="['fas', mobileMenuOpen ? 'times' : 'bars']" 
              class="text-xl text-purple-600" 
            />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-screen"
        leave-from-class="opacity-100 max-h-screen"
        leave-to-class="opacity-0 max-h-0"
      >
        <div 
         v-show="mobileMenuOpen"
      class="md:hidden fixed inset-x-0 top-16 bg-white shadow-lg z-40 overflow-y-auto"
      style="max-height: calc(100vh - 64px)"
        >
          <div class="px-2 py-3 space-y-1">
            <NuxtLink 
              v-for="(item, index) in mobileMenuItems"
              :key="index"
              :to="item.path"
              @click="mobileMenuOpen = false"
              class="block px-4 py-3 rounded-lg font-medium hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
              active-class="bg-purple-50 text-purple-600"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
          <div class="px-4 py-3 border-t border-gray-100">
            <template v-if="!userStore.isAuthenticated">
              <NuxtLink 
                to="/dang-nhap"
                @click="mobileMenuOpen = false"
                class="block w-full px-4 py-2 text-center rounded-lg font-medium bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors duration-200 mb-2"
              >
                Đăng nhập
              </NuxtLink>
              <NuxtLink 
                to="/dang-ky"
                @click="mobileMenuOpen = false"
                class="block w-full px-4 py-2 text-center rounded-lg font-medium bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 transition-all duration-300 shadow"
              >
                Đăng ký
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink 
                to="/tai-khoan"
                @click="mobileMenuOpen = false"
                class="block w-full px-4 py-2 text-center rounded-lg font-medium bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors duration-200 mb-2"
              >
                Tài khoản
              </NuxtLink>
              <button
                @click="logout"
                class="block w-full px-4 py-2 text-center rounded-lg font-medium bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 transition-all duration-300 shadow"
              >
                Đăng xuất
              </button>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { useUserStore } from '~/stores/user'
import { ref, onMounted, onUnmounted } from 'vue'

// Khởi tạo userStore
const userStore = useUserStore()

// Khởi tạo dữ liệu
const mobileMenuOpen = ref(false)
const activeMenu = ref(null)
const isSticky = ref(false)
const header = ref(null)
const menuTimeout = ref(null)

const exploreItems = [
  { name: 'Số Đường Đời', path: '/duong-doi', icon: ['fas', 'route'] },
  { name: 'Số Linh Hồn', path: '/linh-hon', icon: ['fas', 'heart'] },
  { name: 'Số Nhân Cách', path: '/nhan-cach', icon: ['fas', 'user'] },
  { name: 'Số Sứ Mệnh', path: '/su-menh', icon: ['fas', 'bullseye'] }
]
const toolsItems = [
  { name: 'Tính Số Đường Đời', path: '/tinh-duong-doi', icon: ['fas', 'calculator'] },
  { name: 'Tính Số Ngày Sinh', path: '/tinh-ngay-sinh', icon: ['fas', 'birthday-cake'] },
  { name: 'Tên Theo Thần Số Học', path: '/ten-than-so-hoc', icon: ['fas', 'signature'] },
  { name: 'Biểu Đồ Ngày Sinh', path: '/bieu-do-ngay-sinh', icon: ['fas', 'chart-pie'] }
]
const mobileMenuItems = [
  { name: 'Trang Chủ', path: '/' },
  { name: 'Về chúng tôi', path: '/gioi-thieu' },
  { name: 'Kiến thức', path: '/kien-thuc' },
  { name: 'Blog', path: '/blog' }
]

// Hàm xử lý
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
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
  }, 200) // Delay 200ms để chuột di chuyển sang submenu
}

const handleScroll = () => {
  isSticky.value = window.scrollY > 10
}

const logout = async () => {
  try {
    await userStore.logout()
    mobileMenuOpen.value = false
    activeMenu.value = null
    await navigateTo('/dang-nhap')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  clearTimeout(menuTimeout.value)
})
</script>

<style scoped>
/* Tối ưu dropdown menu */
.dropdown-menu {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform-origin: top center;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px); /* Giảm translateY để gần button hơn */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Đảm bảo header không bị giật khi sticky */
header {
  will-change: transform;
}

/* Căn giữa main menu */
nav {
  left: 50%;
  transform: translateX(-50%);
}

/* Loại bỏ khoảng trống giữa button và submenu */
.dropdown {
  position: relative;
}

.dropdown-menu {
  top: 100%; /* Đặt ngay sát dưới button */
  margin-top: 0; /* Xóa margin-top */
}
.fixed {
  position: fixed;
}

.inset-x-0 {
  left: 0;
  right: 0;
}

.top-16 {
  top: 4rem; /* 64px - chiều cao header */
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.z-40 {
  z-index: 40;
}

.overflow-y-auto {
  overflow-y: auto;
}

/* Đảm bảo header có z-index cao hơn */
header {
  z-index: 50;
}
</style>