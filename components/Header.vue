<template>
  <header 
    ref="header" 
    class="bg-white text-gray-800 border-b border-gray-100 sticky top-0 z-50 transition-all duration-300"
    :class="{ 'shadow-sm bg-white/95 backdrop-blur-sm': isSticky }"
  >
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16 md:h-20">
        <!-- Logo bên trái -->
        <NuxtLink to="/" class="flex items-center shrink-0">
          <img src="/logo.png" alt="Thần Số Học Logo" class="h-10 md:h-12 w-auto transition-all duration-300" />
        </NuxtLink>

        <!-- Main Menu căn giữa -->
        <nav class="hidden md:flex items-center h-full absolute left-1/2 transform -translate-x-1/2">
          <div class="flex items-center h-full space-x-1">
            <!-- Trang Chủ -->
            <NuxtLink 
              v-for="(item, index) in navItems.slice(0, 1)"
              :key="index"
              :to="item.path" 
              class="relative px-5 py-2 rounded-lg font-medium hover:text-purple-600 transition-colors duration-200 h-full flex items-center group"
              :class="{ 'text-purple-600': route.path === item.path }"
            >
              {{ item.name }}
              <span 
                v-if="route.path === item.path"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
              ></span>
              <span 
                v-else
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 group-hover:w-14"
              ></span>
            </NuxtLink>
            <!-- Dropdown Trắc nghiệm -->
             <div 
              class="relative"
              @mouseenter="openMenu('trac-nghiem')"
              @mouseleave="closeMenu('trac-nghiem')"
            >
              <button 
                class="relative px-5 py-2 rounded-lg font-medium hover:text-purple-600 transition-colors duration-200 h-full flex items-center group whitespace-nowrap"
                :class="{ 'text-purple-600': ['/disc', '/mbti'].includes(route.path) }"
              >
                Trắc nghiệm
                <font-awesome-icon 
                  :icon="['fas', 'chevron-down']" 
                  class="ml-2 text-sm text-purple-600 group-hover:text-purple-600 transition-colors duration-200"
                />
                <span 
                  v-if="['/disc', '/mbti'].includes(route.path)"
                  class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                ></span>
                <span 
                  v-else
                  class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 group-hover:w-14"
                ></span>
              </button>
              <div 
                class="dropdown-menu absolute top-full left-0 bg-white shadow-xl rounded-xl py-2 w-48 z-30 border border-gray-100"
                :class="{ 'block': activeMenu === 'trac-nghiem', 'hidden': activeMenu !== 'trac-nghiem' }"
              >
                <NuxtLink 
                  to="/disc"
                  class="block px-4 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                >
                  Trắc nghiệm DISC
                </NuxtLink>
                <NuxtLink 
                  to="/mbti"
                  class="block px-4 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                >
                  Trắc nghiệm MBTI
                </NuxtLink>
              </div>
            </div>
            <!-- Các mục còn lại -->
            <NuxtLink 
              v-for="(item, index) in navItems.slice(1)"
              :key="index + 1"
              :to="item.path" 
              class="relative px-5 py-2 rounded-lg font-medium hover:text-purple-600 transition-colors duration-200 h-full flex items-center group"
              :class="{ 'text-purple-600': route.path === item.path }"
            >
              {{ item.name }}
              <span 
                v-if="route.path === item.path"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
              ></span>
              <span 
                v-else
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 group-hover:w-14"
              ></span>
            </NuxtLink>
          </div>
        </nav>

        <!-- Auth Buttons bên phải -->
        <div v-if="userStore.isStoreInitialized" class="hidden md:flex items-center space-x-4 ml-auto">
          <template v-if="!userStore.user || Object.keys(userStore.user).length === 0">
            <NuxtLink 
              to="/dang-nhap"
              class="px-5 py-2 rounded-lg font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              Đăng nhập
            </NuxtLink>
            <NuxtLink 
              to="/dang-ky"
              class="px-5 py-2.5 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md"
            >
              Đăng ký
            </NuxtLink>
          </template>
          <template v-else>
            <div 
              class="dropdown relative"
              @mouseenter="openMenu('auth')"
              @mouseleave="closeMenu('auth')"
            >
              <button class="flex items-center space-x-2 focus:outline-none group">
                <div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                  <span class="text-white text-lg font-bold">
                    {{ getInitialLetter(userStore.user.fullname) }}
                  </span>
                </div>
              </button>
              <div 
                class="dropdown-menu absolute top-full right-0 bg-white shadow-xl rounded-xl py-2 w-48 z-30 border border-gray-100"
                :class="{ 'block': activeMenu === 'auth', 'hidden': activeMenu !== 'auth' }"
              >
                <NuxtLink 
                  to="/tai-khoan"
                  class="block px-4 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                >
                  <font-awesome-icon :icon="['fas', 'user']" class="mr-2" />
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
        <button 
          @click="toggleMobileMenu" 
          class="md:hidden p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200 focus:outline-none"
          aria-label="Menu"
        >
          <font-awesome-icon 
            :icon="['fas', mobileMenuOpen ? 'times' : 'bars']" 
            class="text-xl text-purple-600" 
          />
        </button>
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
          class="md-hidden fixed inset-x-0 top-16 bg-white/95 backdrop-blur-sm shadow-lg z-40 overflow-y-auto"
          style="max-height: calc(100vh - 64px)"
        >
          <div class="px-2 py-3 space-y-1">
            <!-- Trang Chủ -->
            <NuxtLink 
              v-for="(item, index) in navItems.slice(0, 1)"
              :key="index"
              :to="item.path"
              @click="mobileMenuOpen = false"
              class="block px-4 py-3 rounded-lg font-medium hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 flex items-center"
              :class="{ 'text-purple-600': route.path === item.path }"
            >
              <span class="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3" :class="{ 'opacity-0': route.path !== item.path }"></span>
              {{ item.name }}
            </NuxtLink>
            <!-- Mobile Trắc nghiệm -->
            <div class="px-4 py-3">
              <div class="font-medium text-gray-700 mb-2">Trắc nghiệm</div>
              <NuxtLink 
                to="/disc"
                @click="mobileMenuOpen = false"
                class="block px-4 py-3 rounded-lg font-medium hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 flex items-center"
                :class="{ 'text-purple-600': route.path === '/disc' }"
              >
                <span class="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3" :class="{ 'opacity-0': route.path !== '/disc' }"></span>
                Trắc nghiệm DISC
              </NuxtLink>
              <NuxtLink 
                to="/mbti"
                @click="mobileMenuOpen = false"
                class="block px-4 py-3 rounded-lg font-medium hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 flex items-center"
                :class="{ 'text-purple-600': route.path === '/mbti' }"
              >
                <span class="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3" :class="{ 'opacity-0': route.path !== '/mbti' }"></span>
                Trắc nghiệm MBTI
              </NuxtLink>
            </div>
            <!-- Các mục còn lại -->
            <NuxtLink 
              v-for="(item, index) in navItems.slice(1)"
              :key="index + 1"
              :to="item.path"
              @click="mobileMenuOpen = false"
              class="block px-4 py-3 rounded-lg font-medium hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 flex items-center"
              :class="{ 'text-purple-600': route.path === item.path }"
            >
              <span class="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3" :class="{ 'opacity-0': route.path !== item.path }"></span>
              {{ item.name }}
            </NuxtLink>
          </div>
          <div v-if="userStore.isStoreInitialized" class="px-4 py-3 border-t border-gray-100">
            <template v-if="!userStore.user || Object.keys(userStore.user).length === 0">
              <NuxtLink 
                to="/dang-nhap"
                @click="mobileMenuOpen = false"
                class="block w-full px-4 py-3 text-center rounded-lg font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 mb-2"
              >
                Đăng nhập
              </NuxtLink>
              <NuxtLink 
                to="/dang-ky"
                @click="mobileMenuOpen = false"
                class="block w-full px-4 py-3 text-center rounded-lg font-medium bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md"
              >
                Đăng ký
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink 
                to="/tai-khoan"
                @click="mobileMenuOpen = false"
                class="block w-full px-4 py-3 text-center rounded-lg font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 mb-2"
              >
                Tài khoản
              </NuxtLink>
              <button
                @click="logout"
                class="block w-full px-4 py-3 text-center rounded-lg font-medium bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md"
              >
                Đăng xuất
              </button>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </header>
  <slot />
</template>

<script setup>
import { useUserStore } from '~/stores/user';
import { useRoute } from '#app';
import { ref, onBeforeMount, onUnmounted } from 'vue';
import { navigateTo } from '#app';

const userStore = useUserStore();
const route = useRoute();
const mobileMenuOpen = ref(false);
const activeMenu = ref(null);
const isSticky = ref(false);
const header = ref(null);
const menuTimeout = ref(null);

const navItems = [
  { name: 'Trang Chủ', path: '/' },
  { name: 'Về chúng tôi', path: '/gioi-thieu' },
  { name: 'Kiến thức', path: '/kien-thuc' },
  { name: 'Blog', path: '/blog' }
];

const getInitialLetter = (fullname) => {
  if (!fullname || typeof fullname !== 'string' || !fullname.trim()) {
    return 'U';
  }
  return fullname.trim().charAt(0).toUpperCase();
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const openMenu = (menu) => {
  clearTimeout(menuTimeout.value);
  activeMenu.value = menu;
};

const closeMenu = (menu) => {
  menuTimeout.value = setTimeout(() => {
    if (activeMenu.value === menu) {
      activeMenu.value = null;
    }
  }, 200);
};

const handleScroll = () => {
  isSticky.value = window.scrollY > 10;
};

const logout = async () => {
  try {
    await userStore.logout();
    mobileMenuOpen.value = false;
    activeMenu.value = null;
    await navigateTo('/dang-nhap');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

onBeforeMount(() => {
  if (process.client) {
    userStore.initialize();
    window.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(menuTimeout.value);
  }
});
</script>

<style scoped>
/* Dropdown animation */
.dropdown-menu {
  animation: fadeIn 0.3s ease-in-out;
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

/* Smooth transitions */
nav a, nav button {
  transition: all 0.3s ease;
}

nav button span {
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hiệu ứng khi hover */
.group:hover span {
  transition-duration: 0.3s;
}
</style>