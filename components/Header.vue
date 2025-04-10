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

            <!-- Menu Khám Phá -->
            <div 
              class="dropdown h-full relative" 
              @mouseenter="openMenu('explore')"
              @mouseleave="closeMenu('explore')"
            >
              <button class="px-4 py-2 rounded-lg font-medium flex items-center h-full hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200">
                <span>Khám Phá</span>
                <font-awesome-icon 
                  :icon="['fas', 'chevron-down']" 
                  class="ml-1 text-xs transition-transform duration-200"
                  :class="{ 'rotate-180': activeMenu === 'explore' }"
                />
              </button>
              <div 
                class="dropdown-menu absolute top-full left-0 bg-white shadow-xl rounded-b-lg py-2 w-56 z-20 border border-gray-100"
                :class="{ 'block': activeMenu === 'explore', 'hidden': activeMenu !== 'explore' }"
              >
                <NuxtLink 
                  v-for="(item, i) in exploreItems" 
                  :key="i"
                  :to="item.path"
                  class="block px-4 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors duration-200 flex items-center"
                  active-class="bg-purple-50 text-purple-600"
                >
                  <font-awesome-icon :icon="item.icon" class="mr-3 w-4 text-center" />
                  <span>{{ item.name }}</span>
                </NuxtLink>
              </div>
            </div>

            <!-- Menu Công Cụ -->
            <div 
              class="dropdown h-full relative" 
              @mouseenter="openMenu('tools')"
              @mouseleave="closeMenu('tools')"
            >
              <button class="px-4 py-2 rounded-lg font-medium flex items-center h-full hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200">
                <span>Công Cụ</span>
                <font-awesome-icon 
                  :icon="['fas', 'chevron-down']" 
                  class="ml-1 text-xs transition-transform duration-200"
                  :class="{ 'rotate-180': activeMenu === 'tools' }"
                />
              </button>
              <div 
                class="dropdown-menu absolute top-full left-0 bg-white shadow-xl rounded-b-lg py-2 w-56 z-20 border border-gray-100"
                :class="{ 'block': activeMenu === 'tools', 'hidden': activeMenu !== 'tools' }"
              >
                <NuxtLink 
                  v-for="(item, i) in toolsItems" 
                  :key="i"
                  :to="item.path"
                  class="block px-4 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors duration-200 flex items-center"
                  active-class="bg-purple-50 text-purple-600"
                >
                  <font-awesome-icon :icon="item.icon" class="mr-3 w-4 text-center" />
                  <span>{{ item.name }}</span>
                </NuxtLink>
              </div>
            </div>

            <NuxtLink 
              to="/blog" 
              class="px-4 py-2 rounded-lg font-medium hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200 h-full flex items-center"
              active-class="text-purple-600 bg-purple-50 font-semibold"
            >
              Blog
            </NuxtLink>
          </div>
        </nav>

        <!-- Auth Buttons bên phải -->
        <div class="flex items-center space-x-4 ml-auto">
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
              class="dropdown-menu absolute top-full right-0 bg-white shadow-xl rounded-lg py-2 w-48 z-20 border border-gray-100 mt-1"
              :class="{ 'block': activeMenu === 'auth', 'hidden': activeMenu !== 'auth' }"
            >
              <NuxtLink 
                to="/dang-nhap"
                class="block px-4 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors duration-200"
              >
                Đăng nhập
              </NuxtLink>
              <NuxtLink 
                to="/dang-ky"
                class="block px-4 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors duration-200"
              >
                Đăng ký
              </NuxtLink>
              <div class="border-t border-gray-200 my-1"></div>
              <NuxtLink 
                to="/tai-khoan"
                class="block px-4 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors duration-200"
              >
                Tài khoản
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center ml-4">
          <button 
            @click="toggleMobileMenu" 
            class="p-2 rounded-full hover:bg-purple-50 transition-colors duration-200 focus:outline-none"
            aria-label="Menu"
          >
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
          class="md:hidden bg-white overflow-hidden"
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
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      mobileMenuOpen: false,
      activeMenu: null,
      isSticky: false,
      exploreItems: [
        { name: 'Số Đường Đời', path: '/duong-doi', icon: ['fas', 'route'] },
        { name: 'Số Linh Hồn', path: '/linh-hon', icon: ['fas', 'heart'] },
        { name: 'Số Nhân Cách', path: '/nhan-cach', icon: ['fas', 'user'] },
        { name: 'Số Sứ Mệnh', path: '/su-menh', icon: ['fas', 'bullseye'] }
      ],
      toolsItems: [
        { name: 'Tính Số Đường Đời', path: '/tinh-duong-doi', icon: ['fas', 'calculator'] },
        { name: 'Tính Số Ngày Sinh', path: '/tinh-ngay-sinh', icon: ['fas', 'birthday-cake'] },
        { name: 'Tên Theo Thần Số Học', path: '/ten-than-so-hoc', icon: ['fas', 'signature'] },
        { name: 'Biểu Đồ Ngày Sinh', path: '/bieu-do-ngay-sinh', icon: ['fas', 'chart-pie'] }
      ],
      mobileMenuItems: [
        { name: 'Trang Chủ', path: '/' },
        { name: 'Khám Phá', path: '/khám-phá' },
        { name: 'Công Cụ', path: '/công-cụ' },
        { name: 'Blog', path: '/blog' },
        { name: 'Liên Hệ', path: '/lien-he' }
      ]
    }
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    openMenu(menu) {
      this.activeMenu = menu
    },
    closeMenu() {
      this.activeMenu = null
    },
    handleScroll() {
      this.isSticky = window.scrollY > 10
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
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
    transform: translateY(-10px);
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
</style>