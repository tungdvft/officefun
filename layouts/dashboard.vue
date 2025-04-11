<!-- layouts/dashboard.vue -->
<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <div 
      :class="{ 'w-16 md:w-72': !isSidebarOpen, 'w-72': isSidebarOpen }" 
      class="bg-purple-800 text-white flex flex-col fixed h-screen transition-all duration-300 ease-in-out z-20"
    >
      <!-- Header -->
      <div class="p-4 flex items-center justify-between">
        <div class="flex items-center">
          <svg width="32" height="32" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#5B21B6;stop-opacity:1"/>
                <stop offset="100%" style="stop-color:#A78BFA;stop-opacity:1"/>
              </linearGradient>
            </defs>
            <path d="M20 50 Q40 10 60 50 Q80 90 100 50 Q80 10 60 50 Q40 90 20 50" 
                  fill="none" stroke="url(#infinityGradient)" stroke-width="8" stroke-linecap="round">
              <animate attributeName="stroke-opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite"/>
            </path>
            <path d="M20 50 Q40 10 60 50 Q80 90 100 50 Q80 10 60 50 Q40 90 20 50" 
                  fill="none" stroke="#8B5CF6" stroke-width="12" stroke-linecap="round" opacity="0.3"/>
            <polygon points="60,45 62,50 67,50 63,53 64,58 60,55 56,58 57,53 53,50 58,50" 
                    fill="#FFFFFF" />
          </svg>
          <h1 v-if="isSidebarOpen || windowWidth >= 768" class="text-2xl font-bold ml-2">Thần số học</h1>
        </div>
        <!-- Nút mũi tên chỉ hiển thị trên mobile -->
        <button @click="toggleSidebar" class="text-white focus:outline-none md:hidden">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              :d="isSidebarOpen ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'" 
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            />
          </svg>
        </button>
      </div>
      <div v-if="isSidebarOpen || windowWidth >= 768" class="p-4 pt-0">
        <p class="text-sm opacity-75">Khám phá con số của bạn</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-2 space-y-2">
        <NuxtLink to="/dashboard" :class="{ 'justify-center': !isSidebarOpen && windowWidth < 768, 'justify-start': isSidebarOpen || windowWidth >= 768 }" class="flex items-center p-3 rounded-lg hover:bg-purple-700" exact-active-class="bg-purple-900">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span v-if="isSidebarOpen || windowWidth >= 768">Tổng quan</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/daily" :class="{ 'justify-center': !isSidebarOpen && windowWidth < 768, 'justify-start': isSidebarOpen || windowWidth >= 768 }" class="flex items-center p-3 rounded-lg hover:bg-purple-700" exact-active-class="bg-purple-900">
         <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
        </svg>
          <span v-if="isSidebarOpen || windowWidth >= 768">Thần số học mỗi ngày</span>
        </NuxtLink>
       <NuxtLink to="/dashboard/compatibility" :class="{ 'justify-center': !isSidebarOpen && windowWidth < 768, 'justify-start': isSidebarOpen || windowWidth >= 768 }" class="flex items-center p-3 rounded-lg hover:bg-purple-700" exact-active-class="bg-purple-900">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span v-if="isSidebarOpen || windowWidth >= 768">Kiểm tra mức độ hợp nhau</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/consult" :class="{ 'justify-center': !isSidebarOpen && windowWidth < 768, 'justify-start': isSidebarOpen || windowWidth >= 768 }" class="flex items-center p-3 rounded-lg hover:bg-purple-700" exact-active-class="bg-purple-900">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span v-if="isSidebarOpen || windowWidth >= 768">Giải đáp thắc mắc</span>
        </NuxtLink>
        
        <NuxtLink to="/dashboard/career" :class="{ 'justify-center': !isSidebarOpen && windowWidth < 768, 'justify-start': isSidebarOpen || windowWidth >= 768 }" class="flex items-center p-3 rounded-lg hover:bg-purple-700" exact-active-class="bg-purple-900">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span v-if="isSidebarOpen || windowWidth >= 768">Định hướng nghề nghiệp</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/wedding-date" :class="{ 'justify-center': !isSidebarOpen && windowWidth < 768, 'justify-start': isSidebarOpen || windowWidth >= 768 }" class="flex items-center p-3 rounded-lg hover:bg-purple-700" exact-active-class="bg-purple-900">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span v-if="isSidebarOpen || windowWidth >= 768">Chọn ngày cưới</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/child" :class="{ 'justify-center': !isSidebarOpen && windowWidth < 768, 'justify-start': isSidebarOpen || windowWidth >= 768 }" class="flex items-center p-3 rounded-lg hover:bg-purple-700" exact-active-class="bg-purple-900">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2c0 .738.402 1.378 1 1.723V15a1 1 0 001 1h2a1 1 0 001-1v-2.277c.598-.345 1-.985 1-1.723zm9 1c0-4.971-4.029-9-9-9s-9 4.029-9 9c0 2.232.811 4.275 2.156 5.854M12 3v1m5.657 1.343l-.707.707M21 12h-1m-1.343 5.657l-.707-.707M12 21v-1m-5.657-1.343l-.707.707" />
          </svg>
          <span v-if="isSidebarOpen || windowWidth >= 768">Thần số học cho trẻ</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/nick-name" :class="{ 'justify-center': !isSidebarOpen && windowWidth < 768, 'justify-start': isSidebarOpen || windowWidth >= 768 }" class="flex items-center p-3 rounded-lg hover:bg-purple-700" exact-active-class="bg-purple-900">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm10 0h-1m-1 0h-1m4 0h1m-1 4h-4m4 4h-4m4 4h-4" />
          </svg>
          <span v-if="isSidebarOpen || windowWidth >= 768">Đặt biệt danh</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/baby-name" :class="{ 'justify-center': !isSidebarOpen && windowWidth < 768, 'justify-start': isSidebarOpen || windowWidth >= 768 }" class="flex items-center p-3 rounded-lg hover:bg-purple-700" exact-active-class="bg-purple-900">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span v-if="isSidebarOpen || windowWidth >= 768">Đặt tên con</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/numerology-brand" :class="{ 'justify-center': !isSidebarOpen && windowWidth < 768, 'justify-start': isSidebarOpen || windowWidth >= 768 }" class="flex items-center p-3 rounded-lg hover:bg-purple-700" exact-active-class="bg-purple-900">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span v-if="isSidebarOpen || windowWidth >= 768">Đặt tên thương hiệu</span>
        </NuxtLink>

        <NuxtLink to="/dashboard/full" :class="{ 'justify-center': !isSidebarOpen && windowWidth < 768, 'justify-start': isSidebarOpen || windowWidth >= 768 }" class="flex items-center p-3 rounded-lg hover:bg-purple-700" exact-active-class="bg-purple-900">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span v-if="isSidebarOpen || windowWidth >= 768">Thần số học trọn đời</span>
        </NuxtLink>
        
    
      </nav>
      <div class="p-2 border-t border-purple-700">
        <button 
          @click="logout" 
          :class="{ 'justify-center': !isSidebarOpen && windowWidth < 768, 'justify-start': isSidebarOpen || windowWidth >= 768 }"
          class="flex items-center w-full p-3 rounded-lg hover:bg-purple-700"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span v-if="isSidebarOpen || windowWidth >= 768">Đăng xuất</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-6 bg-gray-100 ml-16 md:ml-72">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { navigateTo } from '#app';

const isSidebarOpen = ref(false);
const windowWidth = ref(0);

const toggleSidebar = () => {
  if (windowWidth.value < 768) {
    isSidebarOpen.value = !isSidebarOpen.value;
  }
};

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  updateWindowWidth();
  window.addEventListener('resize', updateWindowWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth);
});

const logout = () => {
  if (process.client) {
    localStorage.removeItem('username');
    navigateTo('/login');
  }
};
</script>

<style scoped>
.bg-purple-900 {
  background-color: #6b46c1;
}
</style>