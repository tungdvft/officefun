
<template>
  <header 
    ref="header" 
    class="bg-white text-gray-800 border-b border-gray-100 sticky top-0 z-50 transition-all duration-300"
    :class="{ 'shadow-sm bg-white/95 backdrop-blur-sm': isSticky }"
  >
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16 lg:h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center shrink-0">
          <img src="/logo.png" alt="Logo" class="h-10 lg:h-12 w-auto transition-all duration-300" />
        </NuxtLink>

        <!-- Desktop Menu -->
        <nav class="hidden lg:flex items-center h-full justify-center w-full">
          <div class="flex items-center h-full space-x-1">
            <NuxtLink 
              v-for="(item, index) in navItems"
              :key="index"
              :to="item.path" 
              class="relative px-4 py-2 rounded-lg font-medium text-sm lg:text-base hover:text-purple-600 transition-colors duration-200 h-full flex items-center group"
              :class="{ 'text-purple-600': route.path === item.path || (item.submenu && activeTestMenu) }"
              @mouseenter="item.submenu ? openMenu(item.name) : null"
              @mouseleave="item.submenu ? closeMenu(item.name) : null"
            >
              {{ item.name }}
              <font-awesome-icon 
                v-if="item.submenu"
                :icon="['fas', 'chevron-down']" 
                class="ml-1 w-3 h-3 text-purple-600 group-hover:text-purple-600 transition-all duration-200"
                :class="{ 'rotate-180': activeMenu === item.name }"
              />
              <span 
                v-if="route.path === item.path || (item.submenu && activeTestMenu)"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
              ></span>
              <span 
                v-else
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 group-hover:w-10"
              ></span>
              <div 
                v-if="item.submenu"
                class="dropdown-menu absolute top-full left-0 bg-white shadow-xl rounded-xl py-2 w-48 z-30 border border-gray-100"
                :class="{ 'block': activeMenu === item.name, 'hidden': activeMenu !== item.name }"
              >
                <NuxtLink 
                  v-for="(test, idx) in item.submenu"
                  :key="idx"
                  :to="test.path"
                  class="block px-4 py-2 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors duration-200 text-sm"
                  :class="{ 'text-purple-600': route.path === test.path }"
                >
                  {{ test.name }}
                </NuxtLink>
              </div>
            </NuxtLink>
          </div>
        </nav>

        <!-- Auth Buttons Desktop -->
        <div v-if="userStore.isStoreInitialized" class="hidden lg:flex items-center space-x-3 ml-4">
          <template v-if="!userStore.user">
            <NuxtLink 
              to="/dang-nhap"
              class="px-4 py-2 rounded-lg font-medium text-sm text-gray-700 hover:text-purple-600 transition-colors duration-200 whitespace-nowrap"
            >
              Đăng nhập
            </NuxtLink>
            <NuxtLink 
              to="/dang-ky"
              class="px-4 py-2.5 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap"
            >
              Đăng ký
            </NuxtLink>
          </template>
          <template v-else>
            <div class="relative">
              <button 
                @click="toggleUserMenu"
                class="flex flex-col items-center space-y-1 focus:outline-none group"
                aria-label="User menu"
              >
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-700 group-hover:text-purple-600 transition-colors duration-200">
                    {{ getFirstName(userStore.user.fullname) }}
                  </span>
                  <font-awesome-icon 
                    :icon="['fas', 'chevron-down']" 
                    class="w-3 h-3 text-purple-600 group-hover:text-purple-600 transition-transform duration-200"
                    :class="{ 'rotate-180': userMenuOpen }"
                  />
                </div>
                <div class="px-2 py-1 border border-gray-300 rounded-lg bg-purple-50 text-purple-600 font-medium text-xs whitespace-nowrap">
                  {{ userStore.user.tokens ?? '0' }} Tokens
                </div>
              </button>
              <div 
                class="dropdown-menu absolute top-full right-0 bg-white shadow-xl rounded-xl py-2 w-48 z-30 border border-gray-100 mt-1"
                :class="{ 'block': userMenuOpen, 'hidden': !userMenuOpen }"
              >
                <NuxtLink 
                  to="/tai-khoan"
                  class="block px-4 py-2 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors duration-200 text-sm"
                >
                  <font-awesome-icon :icon="['fas', 'user']" class="mr-2" />
                  Tài khoản
                </NuxtLink>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors duration-200 text-sm"
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
          class="lg:hidden p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200 focus:outline-none"
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
          class="lg:hidden fixed inset-x-0 top-16 bg-white/95 backdrop-blur-sm shadow-lg z-40 overflow-y-auto"
          style="max-height: calc(100vh - 64px)"
        >
          <div class="px-2 pt-2 pb-4 space-y-1">
            <!-- Main menu items -->
            <div 
              v-for="(item, index) in navItems"
              :key="index"
              class="relative"
            >
              <button 
                v-if="item.submenu"
                @click="toggleMobileSubmenu(item.name)"
                class="w-full flex justify-between items-center px-4 py-3 rounded-lg font-medium text-sm hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                :class="{ 'text-purple-600 bg-purple-50': route.path === item.path || (item.submenu && mobileSubmenuOpen[item.name]) }"
              >
                <div class="flex items-center">
                  <span class="w-2 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3" :class="{ 'opacity-0': !(route.path === item.path || mobileSubmenuOpen[item.name]) }"></span>
                  <span>{{ item.name }}</span>
                </div>
                <font-awesome-icon 
                  :icon="['fas', mobileSubmenuOpen[item.name] ? 'chevron-up' : 'chevron-down']" 
                  class="w-3 h-3 text-purple-600 transition-all duration-200"
                />
              </button>
              <NuxtLink 
                v-else
                :to="item.path"
                @click="mobileMenuOpen = false"
                class="block px-4 py-3 rounded-lg font-medium text-sm hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 flex items-center"
                :class="{ 'text-purple-600 bg-purple-50': route.path === item.path }"
              >
                <span class="w-2 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3" :class="{ 'opacity-0': route.path !== item.path }"></span>
                {{ item.name }}
              </NuxtLink>
              <transition
                v-if="item.submenu"
                enter-active-class="transition-all duration-200 ease-out"
                leave-active-class="transition-all duration-150 ease-in"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-40"
                leave-from-class="opacity-100 max-h-40"
                leave-to-class="opacity-0 max-h-0"
              >
                <div v-show="mobileSubmenuOpen[item.name]" class="pl-6 mt-1 space-y-1">
                  <NuxtLink 
                    v-for="(test, idx) in item.submenu"
                    :key="idx"
                    :to="test.path"
                    @click="mobileMenuOpen = false"
                    class="block px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 flex items-center"
                    :class="{ 'text-purple-600 bg-purple-50': route.path === test.path }"
                  >
                    <span class="w-2 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3" :class="{ 'opacity-0': route.path !== test.path }"></span>
                    {{ test.name }}
                  </NuxtLink>
                </div>
              </transition>
            </div>
          </div>

          <!-- Auth Buttons Mobile -->
          <div v-if="userStore.isStoreInitialized" class="px-4 py-3 border-t border-gray-100">
            <template v-if="!userStore.user">
              <NuxtLink 
                to="/dang-nhap"
                @click="mobileMenuOpen = false"
                class="block w-full px-4 py-2.5 mb-2 text-center rounded-lg font-medium text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 whitespace-nowrap"
              >
                Đăng nhập
              </NuxtLink>
              <NuxtLink 
                to="/dang-ky"
                @click="mobileMenuOpen = false"
                class="block w-full px-4 py-2.5 text-center rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap"
              >
                Đăng ký
              </NuxtLink>
            </template>
            <template v-else>
              <div class="relative">
                <button 
                  @click="toggleUserMenu"
                  class="flex flex-col items-start space-y-1 focus:outline-none group w-full"
                  aria-label="User menu"
                >
                  <div class="flex items-center justify-start space-x-2">
                    <span class="font-medium text-gray-700 group-hover:text-purple-600 transition-colors duration-200">
                      {{ getFirstName(userStore.user.fullname) }}
                    </span>
                    <font-awesome-icon 
                      :icon="['fas', 'chevron-down']" 
                      class="w-3 h-3 text-purple-600 group-hover:text-purple-600 transition-transform duration-200"
                      :class="{ 'rotate-180': userMenuOpen }"
                    />
                  </div>
                  <div class="px-2 py-1 border border-gray-300 rounded-lg bg-purple-50 text-purple-600 font-medium text-xs whitespace-nowrap">
                    {{ userStore.user.tokens ?? '0' }} Tokens
                  </div>
                </button>
                <div 
                  class="dropdown-menu absolute top-full left-0 py-2 w-48 z-30 mt-1"
                  :class="{ 'block': userMenuOpen, 'hidden': !userMenuOpen }"
                >
                  <NuxtLink 
                    to="/tai-khoan"
                    @click="mobileMenuOpen = false; userMenuOpen = false"
                    class="block px-4 py-2 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors duration-200 text-sm border border-gray-200"
                  >
                    Tài khoản
                  </NuxtLink>
                  <button
                    @click="logout"
                    class="block w-full text-left px-4 py-2 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors duration-200 text-sm"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { useUserStore } from '~/stores/user';
import { useRoute, navigateTo } from '#app';
import { ref, computed, onBeforeMount, onUnmounted, watch } from 'vue';
import { toast } from 'vue3-toastify';

// Data-learn
const navItems = [
  { name: 'Trang Chủ', path: '/' },
  {
    name: 'Trắc nghiệm',
    path: '/#',
    submenu: [
      { name: 'Trắc nghiệm DISC', path: '/disc' },
      { name: 'Trắc nghiệm MBTI', path: '/mbti' }
    ]
  },
  { name: 'Về chúng tôi', path: '/gioi-thieu' },
  { name: 'Kiến thức', path: '/kien-thuc' },
  { name: 'Blog', path: '/blog' }
];

// State
const mobileMenuOpen = ref(false);
const mobileSubmenuOpen = ref({});
const userMenuOpen = ref(false);
const activeMenu = ref(null);
const isSticky = ref(false);
const header = ref(null);
const menuTimeout = ref(null);
const userStore = useUserStore();
const route = useRoute();

// Computed
const activeTestMenu = computed(() => {
  return navItems
    .find(item => item.name === 'Trắc nghiệm')
    ?.submenu.some(subItem => route.path === subItem.path) || route.path === '/trac-nghiem';
});

// Methods
const getFirstName = (fullname) => {
  if (!fullname || typeof fullname !== 'string' || !fullname.trim()) return 'User';
  const parts = fullname.trim().split(' ');
  return parts[parts.length - 1];
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (!mobileMenuOpen.value) {
    mobileSubmenuOpen.value = {};
    userMenuOpen.value = false;
  }
};

const toggleMobileSubmenu = (menuName) => {
  mobileSubmenuOpen.value = {
    ...mobileSubmenuOpen.value,
    [menuName]: !mobileSubmenuOpen.value[menuName]
  };
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
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

const getInitialLetter = (fullname) => {
  if (!fullname || typeof fullname !== 'string' || !fullname.trim()) return 'U';
  return fullname.trim().charAt(0).toUpperCase();
};

const logout = async () => {
  try {
    await userStore.logout();
    mobileMenuOpen.value = false;
    userMenuOpen.value = false;
    await navigateTo('/dang-nhap');
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Đăng xuất thất bại. Vui lòng thử lại.', {
      position: 'top-center',
      theme: 'colored'
    });
  }
};

const handleScroll = () => {
  isSticky.value = window.scrollY > 10;
};

// Làm mới token từ API nếu chưa có
const refreshUserData = async () => {
  if (userStore.isAuthenticated && userStore.user?.id) {
    try {
      const response = await $fetch(`/api/users/${String(userStore.user.id)}`, { method: 'GET' });
      await userStore.updateTokens(response.user.tokens);
      toast.success('Đã làm mới dữ liệu người dùng', {
        position: 'top-center',
        theme: 'colored'
      });
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      toast.error('Không thể tải dữ liệu người dùng. Vui lòng thử lại.', {
        position: 'top-center',
        theme: 'colored'
      });
      await userStore.logout();
      await navigateTo('/dang-nhap');
    }
  }
};

// Lifecycle
onBeforeMount(() => {
  if (process.client) {
    userStore.initialize();
    refreshUserData();
    window.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', handleScroll);
  }
});

// Theo dõi thay đổi token
watch(
  () => userStore.user?.tokens,
  (newTokens) => {
    if (newTokens !== undefined && newTokens !== null) {
      console.log('Tokens updated:', newTokens);
    }
  }
);
</script>

<style scoped>
.dropdown-menu {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.router-link-active {
  font-weight: 500;
}

.font-awesome-icon {
  transition: transform 0.2s ease;
}

nav .flex.items-center button > div {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
