<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top Navigation -->
    <header class="bg-white text-purple-800 shadow-md sticky top-0 z-20 border-b">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/xem" class="flex items-center">
            <img src="/logo.png" alt="Thần Số Học Logo" class="h-10 w-auto" />
          </NuxtLink>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-4">
            <div 
              class="relative h-full group"
              v-for="(item, index) in mainMenu" 
              :key="index"
            >
              <button 
                class="flex items-center h-full px-4 py-2 hover:bg-purple-50 transition-colors duration-200 rounded-lg text-purple-800 font-medium"
                @click="toggleDropdown(index)"
              >
                <span>{{ item.title }}</span>
                <svg 
                  class="w-4 h-4 ml-2 transition-transform duration-200" 
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
                class="absolute left-0 top-full w-56 bg-white rounded-lg shadow-xl z-30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 border border-gray-100"
              >
                <div class="py-1">
                  <NuxtLink 
                    v-for="(subItem, subIndex) in item.children" 
                    :key="subIndex"
                    :to="subItem.path"
                    class="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 hover:text-purple-900 transition-colors duration-150"
                    active-class="bg-purple-50 text-purple-900 font-medium"
                  >
                    {{ subItem.title }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </nav>

          <!-- User Menu -->
          <div v-if="userStore.isStoreInitialized" class="flex items-center space-x-3">
            <template v-if="!userStore.user || Object.keys(userStore.user).length === 0">
              <NuxtLink 
                to="/dang-nhap"
                class="hidden md:flex px-3 py-1.5 rounded-lg font-medium text-purple-700 hover:bg-purple-50 transition-colors duration-200 text-sm"
              >
                Đăng nhập
              </NuxtLink>
              <NuxtLink 
                to="/dang-ky"
                class="hidden md:flex px-3 py-1.5 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 transition-all duration-300 shadow text-sm"
              >
                Đăng ký
              </NuxtLink>
            </template>
            <template v-else>
              <div 
                class="dropdown relative hidden md:block"
                @mouseenter="openMenu('auth')"
                @mouseleave="closeMenu('auth')"
              >
                <button class="flex flex-col items-center space-y-1 focus:outline-none group">
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                      <span class="text-white text-sm font-bold">
                        {{ getInitialLetter(userStore.user.fullname) }}
                      </span>
                    </div>
                    <svg 
                      class="w-4 h-4 transition-transform duration-200" 
                      :class="{ 'rotate-180': activeMenu === 'auth' }"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div class="px-2 py-1 border border-gray-300 rounded-lg bg-purple-50 text-purple-600 font-medium text-xs whitespace-nowrap">
                    {{ userStore.user.tokens ?? '0' }} Tokens
                  </div>
                </button>
                <div 
                  class="dropdown-menu absolute top-full right-0 bg-white shadow-xl rounded-lg py-2 w-48 z-30 border border-gray-100"
                  :class="{ 'block': activeMenu === 'auth', 'hidden': activeMenu !== 'auth' }"
                >
                  <NuxtLink 
                    to="/tai-khoan"
                    class="block px-4 py-2 hover:bg-purple-50 text-purple-700 hover:text-purple-900 transition-colors duration-200 text-sm border border-gray-200"
                  >
                    Tài khoản
                  </NuxtLink>
                  <button
                    @click="logout"
                    class="block w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-700 hover:text-purple-900 transition-colors duration-200 text-sm"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </template>
            
            <!-- Mobile menu button -->
            <button 
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="md:hidden text-purple-800 focus:outline-none p-2 rounded-full hover:bg-purple-50 transition-colors duration-200"
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
          <!-- Placeholder khi store chưa khởi tạo -->
          <div v-else class="flex items-center space-x-3">
            <div class="hidden md:block w-20 h-6 bg-gray-200 rounded-lg animate-pulse"></div>
            <button 
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="md:hidden text-purple-800 focus:outline-none p-2 rounded-full hover:bg-purple-50 transition-colors duration-200"
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
      <div v-show="isMobileMenuOpen" class="md:hidden bg-white pb-4 transition-all duration-300 ease-in-out border-b">
        <div class="px-4 pt-2 pb-3 space-y-2">
          <div v-for="(item, index) in computedMenu" :key="index">
            <button 
              @click="toggleMobileDropdown(index)"
              class="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-purple-800 hover:bg-purple-50 transition-colors duration-200"
            >
              <template v-if="item.isUserMenu && userStore.isStoreInitialized && userStore.user && Object.keys(userStore.user).length > 0">
                <div class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                  <span class="text-white text-sm font-bold">
                    {{ getInitialLetter(userStore.user.fullname) }}
                  </span>
                </div>
              </template>
              <template v-else>
                <span>{{ item.title }}</span>
              </template>
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
              <template v-if="item.isUserMenu && userStore.isStoreInitialized && userStore.user && Object.keys(userStore.user).length > 0">
                <NuxtLink 
                  to="/tai-khoan"
                  class="block px-3 py-2 rounded-md text-sm font-medium text-purple-700 hover:bg-purple-50 hover:text-purple-900 transition-colors duration-200 border border-gray-200"
                  @click="isMobileMenuOpen = false"
                >
                  Tài khoản
                </NuxtLink>
                <div class="px-2 py-1 border border-gray-300 rounded-lg bg-purple-50 text-purple-600 font-medium text-xs whitespace-nowrap">
                  {{ userStore.user.tokens ?? '0' }} Tokens
                </div>
                <button
                  @click="logout"
                  class="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-purple-700 hover:bg-purple-50 hover:text-purple-900 transition-colors duration-200"
                >
                  Đăng xuất
                </button>
              </template>
              <template v-else-if="item.isUserMenu">
                <NuxtLink 
                  to="/dang-nhap"
                  class="block px-3 py-2 rounded-md text-sm font-medium text-purple-700 hover:bg-purple-50 hover:text-purple-900 transition-colors duration-200"
                  @click="isMobileMenuOpen = false"
                >
                  Đăng nhập
                </NuxtLink>
                <NuxtLink 
                  to="/dang-ky"
                  class="block px-3 py-2 rounded-md text-sm font-medium text-purple-700 hover:bg-purple-50 hover:text-purple-900 transition-colors duration-200"
                  @click="isMobileMenuOpen = false"
                >
                  Đăng ký
                </NuxtLink>
              </template>
              <template v-else>
                <NuxtLink 
                  v-for="(subItem, subIndex) in item.children" 
                  :key="subIndex"
                  :to="subItem.path"
                  class="block px-3 py-2 rounded-md text-sm font-medium text-purple-700 hover:bg-purple-50 hover:text-purple-900 transition-colors duration-200"
                  active-class="bg-purple-50 text-purple-900 font-semibold"
                  @click="isMobileMenuOpen = false"
                >
                  {{ subItem.title }}
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 bg-gray-100">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { navigateTo } from '#app';
import { useUserStore } from '~/stores/user';
import { toast } from 'vue3-toastify';

const userStore = useUserStore();

definePageMeta({
  middleware: ['auth']
});

// Hàm lấy chữ cái đầu hợp lệ
const getInitialLetter = (fullname) => {
  if (!fullname || typeof fullname !== 'string' || !fullname.trim()) {
    return 'U';
  }
  const firstChar = fullname.trim().charAt(0);
  return /[a-zA-Z\u00C0-\u1EF9]/.test(firstChar) ? firstChar.toUpperCase() : 'U';
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

onMounted(() => {
  if (process.client) {
    userStore.initialize();
    refreshUserData();
  }
});

const mainMenu = [
  {
    title: 'Cá nhân',
    children: [
      { title: 'Thần số học mỗi ngày', path: '/xem/than-so-hoc-moi-ngay' },
      { title: 'Giải đáp thắc mắc', path: '/xem/giai-dap-thac-mac' },
      { title: 'Đặt danh xưng quốc tế', path: '/xem/danh-xung' },
    ],
  },
  {
    title: 'Mối quan hệ',
    children: [
      { title: 'Kiểm tra hợp nhau', path: '/xem/kiem-tra-hop-nhau' },
      { title: 'Chọn ngày cưới', path: '/xem/chon-ngay-cuoi' },
    ],
  },
  {
    title: 'Nghề nghiệp',
    children: [
      { title: 'Định hướng nghề', path: '/xem/dinh-huong-nghe-nghiep' },
      { title: 'Tên thương hiệu', path: '/xem/ten-thuong-hieu' },
    ],
  },
  {
    title: 'Gia đình',
    children: [
      { title: 'Thần số học trẻ em', path: '/xem/than-so-hoc-tre-em' },
      { title: 'Đặt tên con', path: '/xem/dat-ten-con' },
    ],
  },
];

const computedMenu = computed(() => {
  const menu = [...mainMenu];
  if (userStore.isStoreInitialized) {
    menu.push({
      title: 'Tài khoản người dùng',
      isUserMenu: true,
      children: userStore.user && Object.keys(userStore.user).length > 0 
        ? [
            { title: 'Tài khoản', path: '/tai-khoan' },
            { title: 'Số token', isToken: true },
            { title: 'Đăng xuất', isLogout: true }
          ] 
        : [
            { title: 'Đăng nhập', path: '/dang-nhap' },
            { title: 'Đăng ký', path: '/dang-ky' }
          ]
    });
  }
  return menu;
});

const isMobileMenuOpen = ref(false);
const activeDropdown = ref(null);
const activeMobileDropdown = ref(null);
const activeMenu = ref(null);
const menuTimeout = ref(null);

const toggleDropdown = (index) => {
  activeDropdown.value = activeDropdown.value === index ? null : index;
};

const toggleMobileDropdown = (index) => {
  activeMobileDropdown.value = activeMobileDropdown.value === index ? null : index;
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

const logout = async () => {
  try {
    await userStore.logout();
    isMobileMenuOpen.value = false;
    activeMenu.value = null;
    activeMobileDropdown.value = null;
    toast.success('Đăng xuất thành công!', {
      position: 'top-center',
      theme: 'colored',
    });
    await navigateTo('/dang-nhap');
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Đăng xuất thất bại. Vui lòng thử lại.', {
      position: 'top-center',
      theme: 'colored',
    });
  }
};

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

/* Tối ưu dropdown menu */
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

/* Đảm bảo dropdown không bị giật */
.dropdown {
  position: relative;
}

.dropdown-menu {
  top: 100%;
  margin-top: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
