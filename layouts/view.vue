<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top Navigation -->
    <header class="bg-white text-purple-800 shadow-md sticky top-0 z-20 border-b">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center">
            <img src="/logo.png" alt="Thần Số Học Logo" class="h-10 w-auto" />
          </NuxtLink>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex justify-center items-center w-full space-x-4">
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
              <span>{{ item.title }}</span>
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
import { ref, computed } from 'vue';

definePageMeta({
  middleware: []
});

const mainMenu = [
  {
    title: 'Cá nhân',
    children: [
      { title: 'Tổng quan', path: '/xem' },
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
  return mainMenu; // Only include mainMenu, excluding user menu
});

const isMobileMenuOpen = ref(false);
const activeDropdown = ref(null);
const activeMobileDropdown = ref(null);

const toggleDropdown = (index) => {
  activeDropdown.value = activeDropdown.value === index ? null : index;
};

const toggleMobileDropdown = (index) => {
  activeMobileDropdown.value = activeMobileDropdown.value === index ? null : index;
};
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