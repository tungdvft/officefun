<template>
  <section class="container mx-auto mt-12 px-4">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold text-purple-900 mb-4">Các Con Số Cốt Lõi</h2>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">Khám phá ý nghĩa sâu sắc đằng sau những con số quan trọng nhất trong thần số học của bạn</p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      <NuxtLink 
        to="/duong-doi" 
        class="numerology-card group"
        @mouseenter="hoverCard('lifePath')"
        @mouseleave="resetAnimation"
      >
        <div class="relative overflow-hidden rounded-xl h-full">
          <!-- Gradient background -->
          <div class="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-50"></div>
          
          <!-- Animated circle -->
          <div 
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 transition-all duration-1000 ease-in-out"
            :class="{ 'scale-150 bg-purple-300': activeHover === 'lifePath' }"
          ></div>
          
          <!-- Content -->
          <div class="relative z-10 h-full flex flex-col p-8">
            <div class="mb-6">
              <div class="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">1</div>
              <h3 class="text-2xl font-bold text-purple-900 mb-2">Số Đường Đời</h3>
              <p class="text-gray-600">Mục đích sống và bài học cuộc đời bạn</p>
            </div>
            <div class="mt-auto">
              <div class="inline-flex items-center text-purple-600 font-medium group-hover:text-purple-900 transition-colors">
                <span>Khám phá ngay</span>
                <svg class="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink 
        to="/linh-hon" 
        class="numerology-card group"
        @mouseenter="hoverCard('soul')"
        @mouseleave="resetAnimation"
      >
        <div class="relative overflow-hidden rounded-xl h-full">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50"></div>
          <div 
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 transition-all duration-1000 ease-in-out"
            :class="{ 'scale-150 bg-blue-300': activeHover === 'soul' }"
          ></div>
          <div class="relative z-10 h-full flex flex-col p-8">
            <div class="mb-6">
              <div class="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">2</div>
              <h3 class="text-2xl font-bold text-blue-800 mb-2">Số Linh Hồn</h3>
              <p class="text-gray-600">Khát vọng sâu thẳm trong trái tim bạn</p>
            </div>
            <div class="mt-auto">
              <div class="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                <span>Khám phá ngay</span>
                <svg class="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink 
        to="/nhan-cach" 
        class="numerology-card group"
        @mouseenter="hoverCard('personality')"
        @mouseleave="resetAnimation"
      >
        <div class="relative overflow-hidden rounded-xl h-full">
          <div class="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50"></div>
          <div 
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 transition-all duration-1000 ease-in-out"
            :class="{ 'scale-150 bg-green-300': activeHover === 'personality' }"
          ></div>
          <div class="relative z-10 h-full flex flex-col p-8">
            <div class="mb-6">
              <div class="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">3</div>
              <h3 class="text-2xl font-bold text-green-800 mb-2">Số Nhân Cách</h3>
              <p class="text-gray-600">Cách bạn thể hiện ra thế giới bên ngoài</p>
            </div>
            <div class="mt-auto">
              <div class="inline-flex items-center text-green-600 font-medium group-hover:text-green-800 transition-colors">
                <span>Khám phá ngay</span>
                <svg class="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink 
        to="/su-menh" 
        class="numerology-card group"
        @mouseenter="hoverCard('destiny')"
        @mouseleave="resetAnimation"
      >
        <div class="relative overflow-hidden rounded-xl h-full">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-50"></div>
          <div 
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 transition-all duration-1000 ease-in-out"
            :class="{ 'scale-150 bg-indigo-300': activeHover === 'destiny' }"
          ></div>
          <div class="relative z-10 h-full flex flex-col p-8">
            <div class="mb-6">
              <div class="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">4</div>
              <h3 class="text-2xl font-bold text-indigo-800 mb-2">Số Sứ Mệnh</h3>
              <p class="text-gray-600">Tài năng bẩm sinh và cách bạn cống hiến</p>
            </div>
            <div class="mt-auto">
              <div class="inline-flex items-center text-indigo-600 font-medium group-hover:text-indigo-800 transition-colors">
                <span>Khám phá ngay</span>
                <svg class="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>
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
  @apply h-full transition-all duration-500 ease-in-out;
}

.numerology-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Animation for the number circles */
.numerology-card:hover .number-circle {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
}
</style>