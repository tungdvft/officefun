<!-- layouts/dashboard.vue -->
<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <div class="w-100 bg-purple-800 text-white flex flex-col fixed h-screen">
      <div class="p-6">
        <h1 class="text-2xl font-bold">Thần số học</h1>
        <p class="text-sm opacity-75">Khám phá con số của bạn</p>
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <NuxtLink to="/dashboard" class="flex items-center p-3 rounded-lg hover:bg-purple-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Tổng quan
        </NuxtLink>
        <NuxtLink to="/dashboard/success-map" class="flex items-center p-3 rounded-lg hover:bg-purple-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553-2.276A1 1 0 0021 13.382V6.618a1 1 0 00-1.447-.894L15 8m0 9V4m0 13l-6-3" />
          </svg>
          Bản đồ thành công
        </NuxtLink>
        <NuxtLink to="/dashboard/baby-name" class="flex items-center p-3 rounded-lg hover:bg-purple-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Đặt tên con
        </NuxtLink>
        <NuxtLink to="/dashboard/numerology-brand" class="flex items-center p-3 rounded-lg hover:bg-purple-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Đặt tên thương hiệu
        </NuxtLink>
        <NuxtLink to="/dashboard/career" class="flex items-center p-3 rounded-lg hover:bg-purple-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Định hướng nghề nghiệp
        </NuxtLink>
        <NuxtLink to="/dashboard/full" class="flex items-center p-3 rounded-lg hover:bg-purple-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
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