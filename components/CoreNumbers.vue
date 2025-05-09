<template>
  <section class="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <span class="inline-block px-4 py-1 bg-purple-100 text-purple-900 rounded-full text-sm font-semibold mb-4">CÁC SỐ CỐT LÕI</span>
        <h2 class="text-3xl md:text-4xl font-bold text-purple-900">
          Nắm Vững Các <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Chỉ Số</span> Cơ Bản Của Bạn
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto mt-4">
          Ý nghĩa sâu sắc đằng sau những con số quan trọng nhất trong thần số học của bạn
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <NuxtLink 
          to="/duong-doi" 
          class="numerology-card group"
          @mouseenter="hoverCard('lifePath')"
          @mouseleave="resetAnimation"
        >
          <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-white hover:border-purple-200 flex flex-col items-center text-center">
            <div class="w-14 h-14 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-purple-900 mb-3">Số Đường Đời</h3>
            <p class="text-gray-600 mb-6">Mục đích sống và bài học cuộc đời bạn</p>
          </div>
        </NuxtLink>

        <NuxtLink 
          to="/linh-hon" 
          class="numerology-card group"
          @mouseenter="hoverCard('soul')"
          @mouseleave="resetAnimation"
        >
          <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-white hover:border-purple-200 flex flex-col items-center text-center">
            <div class="w-14 h-14 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-purple-900 mb-3">Số Linh Hồn</h3>
            <p class="text-gray-600 mb-6">Khát vọng sâu thẳm trong trái tim bạn</p>
          </div>
        </NuxtLink>

        <NuxtLink 
          to="/nhan-cach" 
          class="numerology-card group"
          @mouseenter="hoverCard('personality')"
          @mouseleave="resetAnimation"
        >
          <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-white hover:border-purple-200 flex flex-col items-center text-center">
            <div class="w-14 h-14 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-purple-900 mb-3">Số Nhân Cách</h3>
            <p class="text-gray-600 mb-6">Cách bạn thể hiện ra thế giới bên ngoài</p>
          </div>
        </NuxtLink>

        <NuxtLink 
          to="/su-menh" 
          class="numerology-card group"
          @mouseenter="hoverCard('destiny')"
          @mouseleave="resetAnimation"
        >
          <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-white hover:border-purple-200 flex flex-col items-center text-center">
            <div class="w-14 h-14 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-purple-900 mb-3">Số Sứ Mệnh</h3>
            <p class="text-gray-600 mb-6">Tài năng bẩm sinh và cách bạn cống hiến</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      activeHover: null
    }
  },
  methods: {
    hoverCard(type) {
      this.activeHover = type
    },
    resetAnimation() {
      this.activeHover = null
    }
  }
}
</script>

<style scoped>
.numerology-card {
  @apply h-full transition-all duration-300 ease-in-out;
}

.numerology-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>