<template>
  <section class="bg-purple-800 text-white py-12">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl font-bold mb-4">Đăng Ký Nhận Báo Cáo Miễn Phí</h2>
      <p class="text-xl mb-8 max-w-2xl mx-auto">Nhận ngay báo cáo thần số học cơ bản và các bài viết chuyên sâu...</p>
      <form @submit.prevent="subscribe" class="max-w-md mx-auto flex">
        <input type="email" v-model="email" placeholder="Email của bạn" class="flex-grow px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none">
        <button type="submit" class="bg-purple-600 text-white font-bold px-6 rounded-r-lg hover:bg-purple-700 transition duration-300">
          Đăng ký <i class="fas fa-paper-plane ml-2"></i>
        </button>
      </form>
      <p class="text-sm mt-4 text-purple-200">Chúng tôi cam kết không spam...</p>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      email: ''
    }
  },
  methods: {
    subscribe() {
      alert(`Cảm ơn bạn đã đăng ký với email: ${this.email}!`)
      this.email = ''
    }
  }
}
</script>