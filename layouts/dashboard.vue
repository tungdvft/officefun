<!-- layouts/dashboard.vue -->
<template>
  <div class="min-h-screen flex">
    <!-- Sidebar (giữ nguyên như cũ) -->
    <div class="w-64 bg-purple-800 text-white flex flex-col fixed h-screen">
      <div class="p-6">
        <h1 class="text-2xl font-bold">Thần số học</h1>
        <p class="text-sm opacity-75">Khám phá con số của bạn</p>
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <!-- <NuxtLink to="/" class="flex items-center p-3 rounded-lg hover:bg-purple-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18M3 6h18M3 18h18" />
          </svg>
          Tổng quan
        </NuxtLink> -->
        <NuxtLink to="/dashboard/baby-name" class="flex items-center p-3 rounded-lg hover:bg-purple-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Đặt tên con
        </NuxtLink>
        <NuxtLink to="/dashboard/numerology-brand" class="flex items-center p-3 rounded-lg hover:bg-purple-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Đặt tên thương hiệu
        </NuxtLink>
        <NuxtLink to="/dashboard/career" class="flex items-center p-3 rounded-lg hover:bg-purple-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Định hướng nghề nghiệp
        </NuxtLink>
        <NuxtLink to="/dashboard/full-numerology" class="flex items-center p-3 rounded-lg hover:bg-purple-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Thần số học trọn đời
        </NuxtLink>
        <NuxtLink to="/dashboard/compatibility" class="flex items-center p-3 rounded-lg hover:bg-purple-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Kiểm tra mức độ hợp nhau
        </NuxtLink>
        <NuxtLink to="/dashboard/fengshui" class="flex items-center p-3 rounded-lg hover:bg-purple-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Số học phong thuỷ
        </NuxtLink>
      </nav>
      <div class="p-4 border-t border-purple-700">
        <button @click="logout" class="w-full text-left p-3 rounded-lg hover:bg-purple-700 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Đăng xuất
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 ml-64 p-6 bg-gray-100">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { navigateTo } from '#app';

// const logout = () => {
//   if (process.client) {
//     localStorage.removeItem('username');
//     navigateTo('/login');
//   }
// };
</script>