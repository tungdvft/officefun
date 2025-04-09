<template>
  <footer class="bg-gray-800 text-white py-12">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-xl font-bold mb-4">Thần Số Học</h3>
          <p class="text-gray-400">Khám phá bản thân qua sức mạnh của các con số...</p>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-4">Liên Kết Nhanh</h3>
          <ul class="space-y-2">
            <li><nuxt-link to="#" class="text-gray-400 hover:text-white">Trang Chủ</nuxt-link></li>
            <li><nuxt-link to="#" class="text-gray-400 hover:text-white">Tính Số Đường Đời</nuxt-link></li>
            <!-- Thêm liên kết khác -->
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-4">Công Cụ</h3>
          <ul class="space-y-2">
            <li><nuxt-link to="#" class="text-gray-400 hover:text-white">Tính Số Ngày Sinh</nuxt-link></li>
            <!-- Thêm công cụ khác -->
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-4">Kết Nối</h3>
          <div class="flex space-x-4 mb-4">
            <nuxt-link to="#" class="text-gray-400 hover:text-white text-2xl"><i class="fab fa-facebook"></i></nuxt-link>
            <!-- Thêm mạng xã hội khác -->
          </div>
          <form @submit.prevent="subscribeFooter" class="mt-2 flex">
            <input type="email" v-model="email" placeholder="Email của bạn" class="px-3 py-2 text-gray-800 rounded-l w-full">
            <button type="submit" class="bg-purple-600 px-4 rounded-r hover:bg-purple-700">
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>© 2023 Thần Số Học. Tất cả quyền được bảo lưu.</p>
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
      alert(`Cảm ơn bạn đã đăng ký với email: ${this.email}!`)
      this.email = ''
    }
  }
}
</script>