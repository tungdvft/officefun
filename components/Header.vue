<template>
  <header class="bg-white shadow-md py-4 sm:px-6 lg:px-8 sticky top-0 z-10">
    <div class="container mx-auto flex items-center justify-between px-4 md:px-6">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center space-x-3">
        <div class="flex items-center justify-center">
          <svg class="w-8 h-8 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span
            class="text-xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
          >
            Offitify
          </span>
        </div>
      </NuxtLink>

      <!-- Menu desktop (căn giữa, ẩn trên mobile) -->
      <nav class="hidden md:flex space-x-6 flex-1 justify-center">
        <NuxtLink
          to="/"
          class="text-gray-600 hover:text-blue-500 transition-colors font-medium"
          :class="{ 'text-blue-600 border-b-2 border-blue-500 pb-1': $route.path === '/' }"
        >
          Trang Chủ
        </NuxtLink>
        <NuxtLink
          to="/premium"
          class="text-gray-600 hover:text-blue-500 transition-colors font-medium"
          :class="{ 'text-blue-600 border-b-2 border-blue-500 pb-1': $route.path === '/premium' }"
        >
          Premium Member
        </NuxtLink>
        <NuxtLink
          to="/about"
          class="text-gray-600 hover:text-blue-500 transition-colors font-medium"
          :class="{ 'text-blue-600 border-b-2 border-blue-500 pb-1': $route.path === '/about' }"
        >
          Về Offitify
        </NuxtLink>
        <NuxtLink
          to="/contact"
          class="text-gray-600 hover:text-blue-500 transition-colors font-medium"
          :class="{ 'text-blue-600 border-b-2 border-blue-500 pb-1': $route.path === '/contact' }"
        >
          Liên hệ
        </NuxtLink>
      </nav>

      <!-- Nút Hamburger cho mobile + User menu desktop -->
      <div class="flex items-center space-x-6">
        <!-- User menu desktop (ẩn trên mobile) -->
        <div class="hidden md:block relative">
          <button @click="toggleDropdown" class="flex items-center space-x-2 focus:outline-none">
            <div class="user-avatar w-8 h-8 relative">
              <div
                class="face bg-blue-200 rounded-full w-full h-full flex items-center justify-center text-white font-bold text-lg"
              >
                {{ initial }}
              </div>
            </div>
            <span class="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text font-semibold">
              {{ displayName || username || 'Guest' }}
            </span>
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200"
          >
            <NuxtLink
              to="/profile"
              class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              Profile
            </NuxtLink>
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <!-- Nút Hamburger cho mobile -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden text-gray-600 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!isMobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Menu mobile (gồm cả navigation và user menu) -->
      <div v-if="isMobileMenuOpen" class="absolute top-full left-0 w-full bg-white shadow-md md:hidden z-20">
        <div class="flex flex-col space-y-4 p-4">
          <NuxtLink
            to="/"
            class="text-gray-600 hover:text-blue-500 transition-colors font-medium"
            :class="{ 'text-blue-600': $route.path === '/' }"
            @click="toggleMobileMenu"
          >
            Trang Chủ
          </NuxtLink>
          <NuxtLink
            to="/premium"
            class="text-gray-600 hover:text-blue-500 transition-colors font-medium"
            :class="{ 'text-blue-600': $route.path === '/premium' }"
            @click="toggleMobileMenu"
          >
            Premium Member
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="text-gray-600 hover:text-blue-500 transition-colors font-medium"
            :class="{ 'text-blue-600': $route.path === '/about' }"
            @click="toggleMobileMenu"
          >
            Về Offitify
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="text-gray-600 hover:text-blue-500 transition-colors font-medium"
            :class="{ 'text-blue-600': $route.path === '/contact' }"
            @click="toggleMobileMenu"
          >
            Liên hệ
          </NuxtLink>
          <div class="border-t border-gray-200 pt-4">
            <div class="flex items-center space-x-2 mb-4">
              <div class="user-avatar w-8 h-8 relative">
                <div
                  class="face bg-blue-200 rounded-full w-full h-full flex items-center justify-center text-white font-bold text-lg"
                >
                  {{ initial }}
                </div>
              </div>
              <span class="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text font-semibold">
                {{ displayName || username || 'Guest' }}
              </span>
            </div>
            <NuxtLink
              to="/profile"
              class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              @click="toggleMobileMenu"
            >
              Profile
            </NuxtLink>
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { toast } from 'vue3-toastify';
import { useRoute } from 'vue-router';

const username = ref(null);
const displayName = ref(null);
const isDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);
const route = useRoute();

const initial = computed(() => {
  const name = displayName.value || username.value || 'G';
  return name.charAt(0).toUpperCase();
});

onMounted(async () => {
  if (process.client) {
    username.value = localStorage.getItem('username') || 'Guest';
    if (username.value === 'Guest') return;

    try {
      const userResponse = await $fetch('/api/user', {
        method: 'GET',
        query: { username: username.value },
      });
      if (userResponse && !userResponse.error) {
        username.value = userResponse.username;
        displayName.value = userResponse.displayName || userResponse.username;
      } else if (userResponse?.error === 'User not found') {
        toast.warn('Tài khoản chưa đồng bộ với server, vẫn dùng được tạm thời.', { position: 'top-center' });
      } else {
        toast.warn('Dữ liệu user không hợp lệ, dùng thông tin tạm thời.', { position: 'top-center' });
      }
    } catch (error) {
      console.error('Header.vue - Error fetching user data:', error);
      toast.warn('Không thể kết nối server, dùng username tạm thời.', { position: 'top-center' });
    }
  }
});

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) isDropdownOpen.value = false;
}

function logout() {
  if (process.client) {
    localStorage.removeItem('username');
    localStorage.removeItem(`displayName_${username.value}`);
    navigateTo('/login');
  }
  isMobileMenuOpen.value = false;
}
</script>

<style scoped>
.bg-brown-600 { background-color: #8B4513; }
.avatar { position: relative; }
.face { position: relative; overflow: hidden; }
.eyes { transform: translateY(-2px); }
.user-avatar { position: relative; }
.user-avatar .face { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
</style>