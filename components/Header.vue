<template>
  <header class="bg-white text-gray-800 shadow-md">
    <div class="container mx-auto px-4 py-6">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <font-awesome-icon :icon="['fas', 'calculator']" class="text-2xl text-purple-600" />
          <h1 class="text-2xl font-bold whitespace-nowrap">Thần Số Học</h1>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button @click="toggleMobileMenu" class="text-gray-800 focus:outline-none">
            <font-awesome-icon :icon="['fas', 'bars']" class="text-xl" />
          </button>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-8 items-center">
          <NuxtLink to="/" class="hover:text-purple-600 font-medium whitespace-nowrap">Trang Chủ</NuxtLink>

          <div class="dropdown relative" @mouseover="showSubmenu('explore')" @mouseleave="hideSubmenu('explore')">
            <button class="hover:text-purple-600 font-medium flex items-center whitespace-nowrap">
              Khám Phá
              <font-awesome-icon :icon="['fas', 'chevron-down']" class="ml-1 text-xs" />
            </button>
            <div class="dropdown-menu absolute bg-white text-gray-800 mt-0 py-2 w-48 rounded shadow-lg z-10" :class="{ 'block': activeSubmenu === 'explore', 'hidden': activeSubmenu !== 'explore' }">
              <NuxtLink to="/duong-doi" class="block px-4 py-2 hover:bg-purple-100 whitespace-nowrap">Số Đường Đời</NuxtLink>
              <NuxtLink to="/linh-hon" class="block px-4 py-2 hover:bg-purple-100 whitespace-nowrap">Số Linh Hồn</NuxtLink>
              <NuxtLink to="/nhan-cach" class="block px-4 py-2 hover:bg-purple-100 whitespace-nowrap">Số Nhân Cách</NuxtLink>
              <NuxtLink to="/su-menh" class="block px-4 py-2 hover:bg-purple-100 whitespace-nowrap">Số Sứ Mệnh</NuxtLink>
            </div>
          </div>

          <div class="dropdown relative" @mouseover="showSubmenu('tools')" @mouseleave="hideSubmenu('tools')">
            <button class="hover:text-purple-600 font-medium flex items-center whitespace-nowrap">
              Công Cụ
              <font-awesome-icon :icon="['fas', 'chevron-down']" class="ml-1 text-xs" />
            </button>
            <div class="dropdown-menu absolute bg-white text-gray-800 mt-0 py-2 w-48 rounded shadow-lg z-10" :class="{ 'block': activeSubmenu === 'tools', 'hidden': activeSubmenu !== 'tools' }">
              <NuxtLink to="/tinh-duong-doi" class="block px-4 py-2 hover:bg-purple-100 whitespace-nowrap">Tính Số Đường Đời</NuxtLink>
              <NuxtLink to="/tinh-ngay-sinh" class="block px-4 py-2 hover:bg-purple-100 whitespace-nowrap">Tính Số Ngày Sinh</NuxtLink>
              <NuxtLink to="/ten-than-so-hoc" class="block px-4 py-2 hover:bg-purple-100 whitespace-nowrap">Tên Theo Thần Số Học</NuxtLink>
              <NuxtLink to="/bieu-do-ngay-sinh" class="block px-4 py-2 hover:bg-purple-100 whitespace-nowrap">Biểu Đồ Ngày Sinh</NuxtLink>
            </div>
          </div>

          <NuxtLink to="/blog" class="hover:text-purple-600 font-medium whitespace-nowrap">Blog</NuxtLink>
          <NuxtLink to="/lien-he" class="hover:text-purple-600 font-medium whitespace-nowrap">Liên Hệ</NuxtLink>

          <!-- Login/Register Button -->
          <div class="dropdown relative" @mouseover="showSubmenu('account')" @mouseleave="hideSubmenu('account')">
            <button class="bg-purple-600 text-white px-4 py-2 rounded-full font-medium hover:bg-purple-700 flex items-center whitespace-nowrap">
              <font-awesome-icon :icon="['fas', 'user-circle']" class="mr-2 text-lg" />
              Tài khoản
            </button>
            <div class="dropdown-menu absolute bg-white text-gray-800 mt-0 py-2 w-48 rounded shadow-lg z-10 right-0" :class="{ 'block': activeSubmenu === 'account', 'hidden': activeSubmenu !== 'account' }">
              <NuxtLink to="/dang-nhap" class="block px-4 py-2 hover:bg-purple-100 whitespace-nowrap flex items-center">
                <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="mr-2 text-sm" /> Đăng nhập
              </NuxtLink>
              <NuxtLink to="/dang-ky" class="block px-4 py-2 hover:bg-purple-100 whitespace-nowrap flex items-center">
                <font-awesome-icon :icon="['fas', 'user-plus']" class="mr-2 text-sm" /> Đăng ký
              </NuxtLink>
              <div class="border-t border-gray-200 my-1"></div>
              <NuxtLink to="/tai-khoan" class="block px-4 py-2 hover:bg-purple-100 whitespace-nowrap flex items-center">
                <font-awesome-icon :icon="['fas', 'cog']" class="mr-2 text-sm" /> Tài khoản
              </NuxtLink>
              <a href="#" class="block px-4 py-2 hover:bg-purple-100 whitespace-nowrap flex items-center">
                <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="mr-2 text-sm" /> Đăng xuất
              </a>
            </div>
          </div>
        </nav>
      </div>

      <!-- Mobile Menu -->
      <div id="mobile-menu" class="md:hidden bg-gray-50 px-4 pb-4 text-gray-800" :class="{ 'hidden': !mobileMenuOpen }">
        <NuxtLink to="/" class="block py-2 hover:bg-purple-100 px-2 rounded whitespace-nowrap">Trang Chủ</NuxtLink>

        <div class="py-2">
          <button @click="toggleExploreMenu" class="flex items-center justify-between w-full hover:bg-purple-100 px-2 rounded whitespace-nowrap">
            <span>Khám Phá</span>
            <font-awesome-icon :icon="['fas', 'chevron-down']" class="text-sm" :class="{ 'rotate-180': exploreMenuOpen }" />
          </button>
          <div class="pl-4" :class="{ 'hidden': !exploreMenuOpen }">
            <NuxtLink to="/duong-doi" class="block py-2 hover:bg-purple-100 px-2 rounded whitespace-nowrap">Số Đường Đời</NuxtLink>
            <NuxtLink to="/linh-hon" class="block py-2 hover:bg-purple-100 px-2 rounded whitespace-nowrap">Số Linh Hồn</NuxtLink>
            <NuxtLink to="/nhan-cach" class="block py-2 hover:bg-purple-100 px-2 rounded whitespace-nowrap">Số Nhân Cách</NuxtLink>
            <NuxtLink to="/su-menh" class="block py-2 hover:bg-purple-100 px-2 rounded whitespace-nowrap">Số Sứ Mệnh</NuxtLink>
          </div>
        </div>

        <div class="py-2">
          <button @click="toggleToolsMenu" class="flex items-center justify-between w-full hover:bg-purple-100 px-2 rounded whitespace-nowrap">
            <span>Công Cụ</span>
            <font-awesome-icon :icon="['fas', 'chevron-down']" class="text-sm" :class="{ 'rotate-180': toolsMenuOpen }" />
          </button>
          <div class="pl-4" :class="{ 'hidden': !toolsMenuOpen }">
            <NuxtLink to="/tinh-duong-doi" class="block py-2 hover:bg-purple-100 px-2 rounded whitespace-nowrap">Tính Số Đường Đời</NuxtLink>
            <NuxtLink to="/tinh-ngay-sinh" class="block py-2 hover:bg-purple-100 px-2 rounded whitespace-nowrap">Tính Số Ngày Sinh</NuxtLink>
            <NuxtLink to="/ten-than-so-hoc" class="block py-2 hover:bg-purple-100 px-2 rounded whitespace-nowrap">Tên Theo Thần Số Học</NuxtLink>
            <NuxtLink to="/bieu-do-ngay-sinh" class="block py-2 hover:bg-purple-100 px-2 rounded whitespace-nowrap">Biểu Đồ Ngày Sinh</NuxtLink>
          </div>
        </div>

        <NuxtLink to="/blog" class="block py-2 hover:bg-purple-100 px-2 rounded whitespace-nowrap">Blog</NuxtLink>
        <NuxtLink to="/lien-he" class="block py-2 hover:bg-purple-100 px-2 rounded whitespace-nowrap">Liên Hệ</NuxtLink>

        <div class="pt-4 mt-2 border-t border-gray-200">
          <NuxtLink to="/dang-nhap" class="block py-2 hover:bg-purple-100 px-2 rounded whitespace-nowrap flex items-center">
            <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="mr-2 text-sm" /> Đăng nhập
          </NuxtLink>
          <NuxtLink to="/dang-ky" class="block py-2 hover:bg-purple-100 px-2 rounded whitespace-nowrap flex items-center">
            <font-awesome-icon :icon="['fas', 'user-plus']" class="mr-2 text-sm" /> Đăng ký
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      mobileMenuOpen: false,
      exploreMenuOpen: false,
      toolsMenuOpen: false,
      activeSubmenu: null // Trạng thái submenu đang hiển thị
    }
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    toggleExploreMenu() {
      this.exploreMenuOpen = !this.exploreMenuOpen
    },
    toggleToolsMenu() {
      this.toolsMenuOpen = !this.toolsMenuOpen
    },
    showSubmenu(menu) {
      this.activeSubmenu = menu
    },
    hideSubmenu() {
      this.activeSubmenu = null
    }
  }
}
</script>

<style scoped>
header {
  /* background: #fff; */ /* Đã dùng class bg-white trong Tailwind */
}

/* Đảm bảo văn bản không xuống dòng */
button, a {
  white-space: nowrap;
}
</style>