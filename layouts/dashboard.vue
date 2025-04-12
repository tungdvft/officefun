<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top Navigation -->
    <header class="bg-purple-800 text-white shadow-lg sticky top-0 z-20">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/xem">
            <div class="flex items-center">
              <svg width="32" height="32" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" class="mr-2">
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
            
            </div>
          </NuxtLink>
          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-1">
            <div 
              class="relative h-full"
              v-for="(item, index) in mainMenu" 
              :key="index"
              @mouseenter="activeDropdown = index"
              @mouseleave="activeDropdown = null"
            >
              <button 
                class="flex items-center h-full px-4 hover:bg-purple-700 transition-colors"
                
              >
                <component :is="item.icon" class="w-5 h-5 mr-2" />
                <span>{{ item.title }}</span>
                <svg 
                  class="w-4 h-4 ml-1 transition-transform" 
                  :class="{ 'rotate-180': activeDropdown === index }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Dropdown Menu -->
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div 
                  v-show="activeDropdown === index"
                  class="absolute left-0 mt-0 w-56 origin-top-left bg-white rounded-b-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30"
                  @mouseenter="activeDropdown = index"
                  @mouseleave="activeDropdown = null"
                >
                  <div class="py-1">
                    <NuxtLink 
                      v-for="(subItem, subIndex) in item.children" 
                      :key="subIndex"
                      :to="subItem.path"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-900"
                      active-class="bg-purple-100 text-purple-900"
                    >
                      <div class="flex items-center">
                        <component :is="subItem.icon" class="w-4 h-4 mr-3 text-purple-500" />
                        {{ subItem.title }}
                      </div>
                    </NuxtLink>
                  </div>
                </div>
              </transition>
            </div>
          </nav>

          <!-- User & Mobile Menu Button -->
          <div class="flex items-center space-x-4">
            <button 
              @click="logout"
              class="flex items-center text-sm rounded-full focus:outline-none"
            >
              <span class="hidden md:inline mr-2">Đăng xuất</span>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            
            <!-- Mobile menu button -->
            <button 
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="md:hidden text-white focus:outline-none"
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
      <div v-show="isMobileMenuOpen" class="md:hidden bg-purple-700 pb-4">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <div v-for="(item, index) in mainMenu" :key="index">
            <button 
              @click="toggleMobileDropdown(index)"
              class="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-600"
            >
              <component :is="item.icon" class="w-5 h-5 mr-2" />
              <span>{{ item.title }}</span>
              <svg 
                class="w-4 h-4 ml-auto transition-transform" 
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
              class="pl-8 pr-2 py-2 space-y-1"
            >
              <NuxtLink 
                v-for="(subItem, subIndex) in item.children" 
                :key="subIndex"
                :to="subItem.path"
                class="block px-3 py-2 rounded-md text-sm font-medium text-purple-100 hover:bg-purple-600"
                active-class="bg-purple-800 text-white"
                @click="isMobileMenuOpen = false"
              >
                <div class="flex items-center">
                  <component :is="subItem.icon" class="w-4 h-4 mr-3" />
                  {{ subItem.title }}
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 bg-gray-100 p-6">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { navigateTo } from '#app';

// Icons components (giữ nguyên như trước)
// Icons components
const HomeIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>`
};

const StarIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
  </svg>`
};

const HeartIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>`
};

const QuestionIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`
};

const BriefcaseIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>`
};

const ChildIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2c0 .738.402 1.378 1 1.723V15a1 1 0 001 1h2a1 1 0 001-1v-2.277c.598-.345 1-.985 1-1.723zm9 1c0-4.971-4.029-9-9-9s-9 4.029-9 9c0 2.232.811 4.275 2.156 5.854M12 3v1m5.657 1.343l-.707.707M21 12h-1m-1.343 5.657l-.707-.707M12 21v-1m-5.657-1.343l-.707.707" />
  </svg>`
};

const UserIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>`
};

const ClockIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`
};

const BuildingIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>`
};

const CalendarIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>`
};

const UsersIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>`
};

const mainMenu = [
  {
    title: "Cá nhân",
   
    children: [
      { title: "Tổng quan", path: "/xem"},
      { title: "Thần số học mỗi ngày", path: "/xem/daily", icon: StarIcon },
      { title: "Thần số học trọn đời", path: "/xem/full", icon: ClockIcon },
      { title: "Giải đáp thắc mắc", path: "/xem/consult", icon: QuestionIcon },
      { title: "Đặt biệt danh", path: "/xem/nick-name", icon: UserIcon }
    ]
  },
  {
    title: "Mối quan hệ",
   
    children: [
      { title: "Kiểm tra hợp nhau", path: "/xem/compatibility", icon: HeartIcon },
      { title: "Chọn ngày cưới", path: "/xem/wedding-date", icon: CalendarIcon }
    ]
  },
  {
    title: "Nghề nghiệp",
    children: [
      { title: "Định hướng nghề", path: "/xem/career", icon: BriefcaseIcon },
      { title: "Tên thương hiệu", path: "/xem/numerology-brand", icon: BuildingIcon }
    ]
  },
  {
    title: "Gia đình",
    children: [
      { title: "Thần số học trẻ em", path: "/xem/child", icon: ChildIcon },
      { title: "Đặt tên con", path: "/xem/baby-name", icon: UsersIcon },
     
    ]
  },
];

const isMobileMenuOpen = ref(false);
const activeDropdown = ref(null);
const activeMobileDropdown = ref(null);

// Kiểm tra xem có item con nào đang active không
const isActive = (children) => {
  return children.some(child => {
    const route = useRoute();
    return route.path.startsWith(child.path);
  });
};

const toggleMobileDropdown = (index) => {
  activeMobileDropdown.value = activeMobileDropdown.value === index ? null : index;
};

const logout = () => {
  if (process.client) {
    localStorage.removeItem('username');
    navigateTo('/login');
  }
};
</script>

<style scoped>

.rotate-180 {
  transform: rotate(180deg);
}

/* Smooth transitions */
.bg-purple-900 {
  background-color: #6b46c1;
}

/* Đảm bảo dropdown không bị ẩn khi di chuột qua */
.group:hover .dropdown-content {
  display: block;
}

.dropdown-content {
  display: none;
}

.group:hover .dropdown-content {
  display: block;
}
</style>