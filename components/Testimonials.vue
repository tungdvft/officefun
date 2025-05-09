<template>
  <section class="py-16">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <span class="inline-block px-4 py-1 bg-purple-100 text-purple-900 rounded-full text-sm font-semibold mb-4">Ý KIẾN KHÁCH HÀNG</span>
        <h2 class="text-3xl md:text-4xl font-bold text-purple-900">
          Khách Hàng <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Nói Gì</span> Về Chúng Tôi
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto mt-4">
          Lắng nghe trải nghiệm thực tế từ những người đã sử dụng dịch vụ thần số học của chúng tôi
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        <!-- Đánh giá 1 -->
        <div class="bg-white rounded-xl shadow-xl border border-purple-200 p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
          <div class="flex items-center mb-6 justify-center">
            <div>
              <h4 class="text-lg font-bold text-gray-800">Trần Ngọc</h4>
              <p class="text-sm text-gray-500">Nhà thiết kế - Hà Nội</p>
              <div class="flex mt-1">
                <StarRating :rating="5" />
              </div>
            </div>
          </div>
          <p class="text-gray-600 italic relative pl-6 before:text-4xl before:text-purple-200 before:absolute before:left-0 before:top-0">
            "Báo cáo thần số học đã giúp tôi hiểu rõ bản thân và định hướng nghề nghiệp chính xác. 
            Những phân tích về con số đường đời 5 của tôi hoàn toàn đúng với tính cách thích tự do và sáng tạo."
          </p>
        </div>

        <!-- Đánh giá 2 -->
        <div class="bg-white rounded-xl shadow-xl border border-purple-200 p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
          <div class="flex items-center mb-6 justify-center">
            <div>
              <h4 class="text-lg font-bold text-gray-800">Lê Minh</h4>
              <p class="text-sm text-gray-500">Doanh nhân - TP.HCM</p>
              <div class="flex mt-1">
                <StarRating :rating="5" />
              </div>
            </div>
          </div>
          <p class="text-gray-600 italic relative pl-6 before:text-4xl before:text-purple-200 before:absolute before:left-0 before:top-0">
            "Tôi đã thử nhiều dịch vụ thần số học nhưng ở đây cho kết quả chi tiết nhất. 
            Phân tích về số 8 trong biểu đồ ngày sinh đã giúp tôi tận dụng tốt hơn khả năng quản lý tài chính của mình."
          </p>
        </div>

        <!-- Đánh giá 3 -->
        <div class="bg-white rounded-xl shadow-xl border border-purple-200 p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
          <div class="flex items-center mb-6 justify-center">
            <div>
              <h4 class="text-lg font-bold text-gray-800">Phạm Hương</h4>
              <p class="text-sm text-gray-500">Giáo viên - Đà Nẵng</p>
              <div class="flex mt-1">
                <StarRating :rating="4" />
              </div>
            </div>
          </div>
          <p class="text-gray-600 italic relative pl-6 before:text-4xl before:text-purple-200 before:absolute before:left-0 before:top-0">
            "Nhờ phân tích số linh hồn 2, tôi đã cải thiện được các mối quan hệ gia đình. 
            Dịch vụ tư vấn rất tận tâm, chỉ mong có thêm nhiều case study thực tế hơn."
          </p>
        </div>
      </div>

      <!-- <div class="text-center mt-12">
        <nuxt-link 
          to="/danh-gia" 
          class="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <span>Xem thêm 127 đánh giá</span>
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </nuxt-link>
      </div> -->
    </div>
  </section>
</template>

<script>
import StarRating from './StarRating.vue'

export default {
  components: {
    StarRating
  }
}
</script>

<style scoped>
/* Tùy chỉnh animation nếu cần */
.transition-all {
  transition: all 0.3s ease;
}
</style>