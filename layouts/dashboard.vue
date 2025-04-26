<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 w-64 bg-purple-800 text-white transition-all duration-300 z-30"
      :class="{ '-ml-64': !sidebarOpen }">
      <div class="flex items-center justify-center h-16 px-4 border-b border-purple-700">
        <h1 class="text-xl font-bold">Admin Dashboard</h1>
      </div>
      <nav class="mt-5">
        <NuxtLink to="/dashboard" class="flex items-center px-4 py-3 hover:bg-purple-700 transition-colors duration-200">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          General
        </NuxtLink>
        <NuxtLink to="/dashboard/users" class="flex items-center px-4 py-3 bg-purple-700 hover:bg-purple-600 transition-colors duration-200">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          User Management
        </NuxtLink>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="ml-64 transition-all duration-300" :class="{ 'ml-0': !sidebarOpen }">
      <!-- Top Navigation -->
      <header class="bg-white shadow-sm">
        <div class="flex items-center justify-between h-16 px-4">
          <button @click="sidebarOpen = !sidebarOpen" class="text-gray-500 focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <button @click="userDropdownOpen = !userDropdownOpen" class="flex items-center space-x-2 focus:outline-none">
                <span class="text-gray-700">{{ userStore.fullname || 'Admin' }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-show="userDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const sidebarOpen = ref(true)
const userDropdownOpen = ref(false)

const logout = async () => {
  await userStore.logout()
  navigateTo('/dang-nhap')
}

// Close dropdown when clicking outside

</script>

<style scoped>
.router-link-active {
  @apply bg-purple-700;
}
</style>