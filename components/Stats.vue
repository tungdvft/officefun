<template>
  <section class="py-16 cosmic-bg relative overflow-hidden">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-4xl font-bold mb-6 text-purple-900">Thần Số Học Hiện Đại</h2>
      <p class="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">Kết hợp tri thức cổ xưa và công nghệ hiện đại để mang lại những phân tích chính xác</p>

      <div class="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        <div class="bg-white p-6 rounded-xl shadow-lg border border-purple-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div class="count-up mb-4 text-5xl font-bold text-purple-600" ref="count1" data-target="10000">0</div>
          <h3 class="text-xl font-medium text-gray-700">Người Đã Phân Tích</h3>
          <p class="text-gray-500 mt-2">Hơn 10,000 hồ sơ được nghiên cứu chuyên sâu</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg border border-purple-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div class="count-up mb-4 text-5xl font-bold text-purple-600" ref="count2" data-target="9">0</div>
          <h3 class="text-xl font-medium text-gray-700">Con Số Cơ Bản</h3>
          <p class="text-gray-500 mt-2">9 con số chủ đạo trong hệ thống Pythagoras</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg border border-purple-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div class="count-up mb-4 text-5xl font-bold text-purple-600" ref="count3" data-target="27">0</div>
          <h3 class="text-xl font-medium text-gray-700">Chỉ Số Quan Trọng</h3>
          <p class="text-gray-500 mt-2">Phân tích đa chiều các khía cạnh cuộc sống</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg border border-purple-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div class="count-up mb-4 text-5xl font-bold text-purple-600" ref="count4" data-target="99">0<span>%</span></div>
          <h3 class="text-xl font-medium text-gray-700">Độ Chính Xác</h3>
          <p class="text-gray-500 mt-2">Theo đánh giá từ người dùng</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  mounted() {
    this.startCounting()
  },
  methods: {
    startCounting() {
      const counters = [
        { el: this.$refs.count1, target: 10000, duration: 2000 },
        { el: this.$refs.count2, target: 9, duration: 1000 },
        { el: this.$refs.count3, target: 17, duration: 1500 },
        { el: this.$refs.count4, target: 92, duration: 2500 }
      ]

      counters.forEach(counter => {
        const startTime = performance.now()
        
        const updateCounter = (timestamp) => {
          const progress = Math.min((timestamp - startTime) / counter.duration, 1)
          const value = Math.floor(progress * counter.target)
          
          counter.el.textContent = value + (counter.el === this.$refs.count4 ? '%' : '')
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter)
          }
        }

        requestAnimationFrame(updateCounter)
      })
    }
  }
}
</script>

<style scoped>
.cosmic-bg {
  background: radial-gradient(circle at center, #f9f5ff 0%, #e9d8fd 100%);
  position: relative;
}

/* Hiệu ứng tinh tế */
.cosmic-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(90deg, #9f7aea 0%, #6b46c1 100%);
}

/* Animation cho số đếm */
@keyframes countUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.count-up {
  animation: countUp 0.5s ease-out forwards;
}

/* Hiệu ứng hover tinh tế */
.transform {
  transition: all 0.3s ease;
}
</style>