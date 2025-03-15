<template>
  <header class="bg-white shadow-md py-4 px-6 sticky top-0 z-10">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center">
        <svg class="w-8 h-8 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span class="text-xl font-bold text-gray-800">OfficeFun</span>
      </div>

      <!-- Menu -->
      <nav class="hidden md:flex space-x-6">
        <NuxtLink to="/about" class="text-gray-600 hover:text-blue-500 transition">About</NuxtLink>
        <NuxtLink to="/contact" class="text-gray-600 hover:text-blue-500 transition">Contact</NuxtLink>
      </nav>

      <!-- Profile Dropdown -->
      <div class="relative">
        <button @click="toggleDropdown" class="flex items-center space-x-2 focus:outline-none">
          <span class="text-gray-700">{{ username || 'Guest' }}</span>
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
          <NuxtLink to="/settings" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</NuxtLink>
          <button @click="logout" class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const username = ref(null)
const isDropdownOpen = ref(false)

// Lấy username từ localStorage (chỉ chạy ở client)
if (process.client) {
  username.value = localStorage.getItem('username')
}

// Toggle dropdown
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

// Xử lý logout
function logout() {
  if (process.client) {
    localStorage.removeItem('username')
    navigateTo('/')
  }
  isDropdownOpen.value = false
}
</script>

<style scoped>
/* Không cần CSS vì đã dùng Tailwind */
</style>