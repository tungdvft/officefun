<template>
  <div>
    <footer class="bg-gradient-to-b from-gray-800 to-gray-900 text-white pt-16 pb-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-10">
          <!-- Column 1: Brand Info -->
          <div class="md:col-span-3">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                <font-awesome-icon :icon="['fas', 'calculator']" class="text-white text-lg" />
              </div>
              <span class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Thần Số Học</span>
            </div>
            <p class="text-gray-400 mb-4 leading-relaxed">
              Khám phá bản thân qua sức mạnh của các con số. Giải mã ý nghĩa cuộc đời thông qua thần số học Pitago.
            </p>
          </div>

          <!-- Column 2: Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-5 pb-2 border-b border-gray-700 flex items-center">
              <span class="text-white">Liên Kết</span>
            </h3>
            <ul class="space-y-3">
              <li><NuxtLink to="/" class="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center">
                Trang Chủ
              </NuxtLink></li>
              <li><NuxtLink to="/gioi-thieu" class="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center">
                Về Chúng Tôi
              </NuxtLink></li>
              <li><NuxtLink to="/blog" class="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center">
                Blog
              </NuxtLink></li>
            </ul>
          </div>

          <!-- Column 3: Thông tin chung -->
          <div>
            <h3 class="text-lg font-semibold mb-5 pb-2 border-b border-gray-700 flex items-center">
              <span class="text-white">Thông tin chung</span>
            </h3>
            <ul class="space-y-3">
              <li><NuxtLink to="/chinh-sach-bao-mat" class="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center">
                Chính sách bảo mật
              </NuxtLink></li>
              <li><NuxtLink to="/dieu-khoan-su-dung" class="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center">
                Điều khoản sử dụng
              </NuxtLink></li>
            </ul>
          </div>
        </div>

        <!-- Copyright -->
        <div class="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 mb-4 md:mb-0">
            © 2025 <span class="text-purple-400">Thần Số Học</span>. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>

    <!-- Back to Top Button -->
    <button
      v-if="showBackToTop"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-teal-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none z-50"
      aria-label="Quay lại đầu trang"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// State cho nút Back to Top
const showBackToTop = ref(false);

// Hàm cuộn lên đầu trang
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Theo dõi sự kiện cuộn
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 200;
};

// Thêm và xóa sự kiện cuộn
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* Hiệu ứng hover cho các link */
a:hover {
  transform: translateX(3px);
  transition: all 0.3s ease;
}

/* Gradient background cho footer */
footer {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}

/* Hiệu ứng cho nút Back to Top */
button {
  opacity: 0.9;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

button:hover {
  opacity: 1;
}

@media (max-width: 640px) {
  button {
    padding: 0.5rem;
  }
  button svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}
</style>