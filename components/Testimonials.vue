<template>
  <section class="container mx-auto mt-16 px-4">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-purple-900 mb-4">Khách Hàng Nói Gì Về Chúng Tôi</h2>
      <div class="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Đánh giá 1 -->
      <div class="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
        <div class="flex items-center mb-6">
          <div class="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mr-4 overflow-hidden">
            <!-- <img src="~/assets/svg/user1.svg" alt="Khách hàng Trần Ngọc" class="w-full h-full object-cover"> -->
          </div>
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
      <div class="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
        <div class="flex items-center mb-6">
          <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4 overflow-hidden">
            <!-- <img src="~/assets/svg/user2.svg" alt="Khách hàng Lê Minh" class="w-full h-full object-cover"> -->
          </div>
          <div>
            <h4 class="text-lg font-bold text-gray-800">Lê Minh</h4>
            <p class="text-sm text-gray-500">Doanh nhân - TP.HCM</p>
            <div class="flex mt-1">
              <StarRating :rating="5" />
            </div>
          </div>
        </div>
        <p class="text-gray-600 italic relative pl-6 before:text-4xl before:text-blue-200 before:absolute before:left-0 before:top-0">
          "Tôi đã thử nhiều dịch vụ thần số học nhưng ở đây cho kết quả chi tiết nhất. 
          Phân tích về số 8 trong biểu đồ ngày sinh đã giúp tôi tận dụng tốt hơn khả năng quản lý tài chính của mình."
        </p>
      </div>

      <!-- Đánh giá 3 -->
      <div class="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
        <div class="flex items-center mb-6">
          <div class="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mr-4 overflow-hidden">
            <!-- <img src="~/assets/svg/user3.svg" alt="Khách hàng Phạm Hương" class="w-full h-full object-cover"> -->
          </div>
          <div>
            <h4 class="text-lg font-bold text-gray-800">Phạm Hương</h4>
            <p class="text-sm text-gray-500">Giáo viên - Đà Nẵng</p>
            <div class="flex mt-1">
              <StarRating :rating="4" />
            </div>
          </div>
        </div>
        <p class="text-gray-600 italic relative pl-6  before:text-4xl before:text-pink-200 before:absolute before:left-0 before:top-0">
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