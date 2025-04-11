<template>
  <footer class="bg-gradient-to-b from-gray-800 to-gray-900 text-white pt-16 pb-8">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10">
        <!-- Column 1: Brand Info -->
        <div class="md:col-span-2 lg:col-span-2">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
              <font-awesome-icon :icon="['fas', 'calculator']" class="text-white text-lg" />
            </div>
            <span class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Thần Số Học</span>
          </div>
          <p class="text-gray-400 mb-4 leading-relaxed">
            Khám phá bản thân qua sức mạnh của các con số. Giải mã ý nghĩa cuộc đời thông qua thần số học Pitago.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="w-10 h-10 rounded-full bg-gray-700 hover:bg-purple-600 flex items-center justify-center transition-colors duration-300">
              <font-awesome-icon :icon="['fab', 'facebook-f']" class="text-white" />
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-400 flex items-center justify-center transition-colors duration-300">
              <font-awesome-icon :icon="['fab', 'twitter']" class="text-white" />
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-gray-700 hover:bg-pink-600 flex items-center justify-center transition-colors duration-300">
              <font-awesome-icon :icon="['fab', 'instagram']" class="text-white" />
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-gray-700 hover:bg-red-500 flex items-center justify-center transition-colors duration-300">
              <font-awesome-icon :icon="['fab', 'youtube']" class="text-white" />
            </a>
          </div>
        </div>

        <!-- Column 2: Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-5 pb-2 border-b border-gray-700 flex items-center">
            <font-awesome-icon :icon="['fas', 'link']" class="mr-2 text-purple-400" />
            <span class="text-white">Liên Kết</span>
          </h3>
          <ul class="space-y-3">
            <li><NuxtLink to="/" class="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center">
              <font-awesome-icon :icon="['fas', 'chevron-right']" class="mr-2 text-xs text-purple-400" />
              Trang Chủ
            </NuxtLink></li>
            <li><NuxtLink to="/ve-chung-toi" class="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center">
              <font-awesome-icon :icon="['fas', 'chevron-right']" class="mr-2 text-xs text-purple-400" />
              Về Chúng Tôi
            </NuxtLink></li>
            <li><NuxtLink to="/blog" class="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center">
              <font-awesome-icon :icon="['fas', 'chevron-right']" class="mr-2 text-xs text-purple-400" />
              Blog
            </NuxtLink></li>
            <li><NuxtLink to="/lien-he" class="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center">
              <font-awesome-icon :icon="['fas', 'chevron-right']" class="mr-2 text-xs text-purple-400" />
              Liên Hệ
            </NuxtLink></li>
          </ul>
        </div>

        <!-- Column 3: Tools -->
        <div>
          <h3 class="text-lg font-semibold mb-5 pb-2 border-b border-gray-700 flex items-center">
            <font-awesome-icon :icon="['fas', 'tools']" class="mr-2 text-blue-400" />
            <span class="text-white">Công Cụ</span>
          </h3>
          <ul class="space-y-3">
            <li><NuxtLink to="/tinh-duong-doi" class="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center">
              <font-awesome-icon :icon="['fas', 'calculator']" class="mr-2 text-xs text-blue-400" />
              Tính Số Đường Đời
            </NuxtLink></li>
            <li><NuxtLink to="/tinh-ngay-sinh" class="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center">
              <font-awesome-icon :icon="['fas', 'calendar-alt']" class="mr-2 text-xs text-blue-400" />
              Tính Số Ngày Sinh
            </NuxtLink></li>
            <li><NuxtLink to="/bieu-do-ngay-sinh" class="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center">
              <font-awesome-icon :icon="['fas', 'chart-pie']" class="mr-2 text-xs text-blue-400" />
              Biểu Đồ Ngày Sinh
            </NuxtLink></li>
            <li><NuxtLink to="/ten-than-so-hoc" class="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center">
              <font-awesome-icon :icon="['fas', 'signature']" class="mr-2 text-xs text-blue-400" />
              Đặt Tên Theo Số
            </NuxtLink></li>
          </ul>
        </div>

        <!-- Column 4: Newsletter -->
        <div>
          <h3 class="text-lg font-semibold mb-5 pb-2 border-b border-gray-700 flex items-center">
            <font-awesome-icon :icon="['fas', 'envelope']" class="mr-2 text-pink-400" />
            <span class="text-white">Nhận Bản Tin</span>
          </h3>
          <p class="text-gray-400 mb-4">
            Đăng ký để nhận thông tin mới nhất về thần số học và các ưu đãi đặc biệt.
          </p>
          <!-- <form @submit.prevent="subscribeFooter" class="space-y-3">
            <input 
              type="email" 
              v-model="email" 
              placeholder="Email của bạn" 
              required
              class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
            >
            <button 
              type="submit" 
              class="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-600 transition duration-300 flex items-center justify-center"
            >
              <font-awesome-icon :icon="['fas', 'paper-plane']" class="mr-2" />
              Đăng Ký Ngay
            </button>
          </form> -->
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-400 mb-4 md:mb-0">
          © 2023 <span class="text-purple-400">Thần Số Học</span>. Tất cả quyền được bảo lưu.
        </p>
        <div class="flex space-x-6">
          <NuxtLink to="/dieu-khoan" class="text-gray-400 hover:text-white transition-colors duration-300">Điều Khoản</NuxtLink>
          <NuxtLink to="/bao-mat" class="text-gray-400 hover:text-white transition-colors duration-300">Bảo Mật</NuxtLink>
          <NuxtLink to="/faq" class="text-gray-400 hover:text-white transition-colors duration-300">FAQ</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      email: ''
    }
  },
  methods: {
    subscribeFooter() {
      this.$toast.success(`Cảm ơn bạn đã đăng ký với email: ${this.email}!`)
      this.email = ''
    }
  }
}
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
</style>