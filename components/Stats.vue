<template>
  <section class="py-16 mystical-bg relative overflow-hidden">
    <div class="stars"></div>
    <div class="container mx-auto px-4 text-center relative z-10">
      <h2 class="text-3xl font-bold mb-12 text-purple-300">Thần Số Học Trong Cuộc Sống</h2>

      <div class="grid md:grid-cols-4 gap-8">
        <div class="bg-white/5 p-6 rounded-xl backdrop-filter backdrop-blur-sm border border-purple-300/20">
          <div class="count-up mb-2 text-4xl font-bold text-white" ref="count1" data-target="10000">0</div>
          <h3 class="text-xl font-medium text-purple-300">Người Đã Phân Tích</h3>
        </div>

        <div class="bg-white/5 p-6 rounded-xl backdrop-filter backdrop-blur-sm border border-purple-300/20">
          <div class="count-up mb-2 text-4xl font-bold text-white" ref="count2" data-target="9">0</div>
          <h3 class="text-xl font-medium text-purple-300">Con Số Cơ Bản</h3>
        </div>

        <div class="bg-white/5 p-6 rounded-xl backdrop-filter backdrop-blur-sm border border-purple-300/20">
          <div class="count-up mb-2 text-4xl font-bold text-white" ref="count3" data-target="27">0</div>
          <h3 class="text-xl font-medium text-purple-300">Chỉ Số Quan Trọng</h3>
        </div>

        <div class="bg-white/5 p-6 rounded-xl backdrop-filter backdrop-blur-sm border border-purple-300/20">
          <div class="count-up mb-2 text-4xl font-bold text-white" ref="count4" data-target="99">0<span>%</span></div>
          <h3 class="text-xl font-medium text-purple-300">Độ Chính Xác</h3>
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
        { el: this.$refs.count1, target: 10000 },
        { el: this.$refs.count2, target: 9 },
        { el: this.$refs.count3, target: 27 },
        { el: this.$refs.count4, target: 99 }
      ]

      counters.forEach(counter => {
        const updateCounter = () => {
          const target = parseInt(counter.el.getAttribute('data-target'))
          const current = parseInt(counter.el.textContent.replace('%', '')) // Loại bỏ ký hiệu % để tính toán
          const increment = target / 100 // Tốc độ đếm (có thể điều chỉnh)

          if (current < target) {
            counter.el.textContent = Math.ceil(current + increment) + (counter.el === this.$refs.count4 ? '%' : '')
            requestAnimationFrame(updateCounter)
          } else {
            counter.el.textContent = target + (counter.el === this.$refs.count4 ? '%' : '')
          }
        }

        // Bắt đầu đếm khi component được mount
        updateCounter()
      })
    }
  }
}
</script>

<style scoped>
/* Nền huyền bí với hiệu ứng sao */
.mystical-bg {
    background: radial-gradient(circle at center, #2a1053 0%, #0d041f 100%);
}
/* Hiệu ứng sao */
.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  animation: twinkle 5s infinite;
  z-index: 0;
  pointer-events: none;
}

/* Tạo hiệu ứng nhấp nháy sao bằng pseudo-elements */
.stars::before,
.stars::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  box-shadow: 
    100px 50px 1px #fff,
    200px 150px 2px #fff,
    300px 100px 1px #fff,
    400px 200px 2px #fff,
    500px 50px 1px #fff,
    600px 180px 2px #fff,
    700px 120px 1px #fff,
    800px 90px 2px #fff;
  animation: twinkle 3s infinite alternate;
}

.stars::after {
  box-shadow: 
    150px 80px 1px #fff,
    250px 130px 2px #fff,
    350px 170px 1px #fff,
    450px 110px 2px #fff,
    550px 70px 1px #fff,
    650px 140px 2px #fff,
    750px 160px 1px #fff,
    850px 60px 2px #fff;
}

@keyframes twinkle {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>