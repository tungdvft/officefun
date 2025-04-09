<template>
  <section class="container mx-auto mb-16">
    <h2 class="text-3xl font-bold text-center mb-8 text-purple-800">Khách Hàng Nói Gì Về Chúng Tôi</h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="testimonial-card p-6 rounded-xl shadow-md">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-purple-800 font-bold mr-4">TN</div>
          <div>
            <h4 class="font-bold">Trần Ngọc</h4>
            <div class="flex text-yellow-400">
              <i class="fas fa-star" v-for="n in 5" :key="n"></i>
            </div>
          </div>
        </div>
        <p class="text-gray-600 italic">"Phân tích thần số học của tôi rất chính xác..."</p>
      </div>
      <!-- Thêm 2 đánh giá khác tương tự -->
    </div>
    <div class="text-center mt-8">
      <nuxt-link to="#" class="inline-block bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition duration-300">
        Xem thêm đánh giá <i class="fas fa-arrow-right ml-2"></i>
      </nuxt-link>
    </div>
  </section>
</template>

<script>
export default {}
</script>