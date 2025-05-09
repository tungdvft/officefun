<template>
  <div class="mx-auto p-6 bg-white rounded-xl shadow-lg">
    <!-- Header với ngày sinh -->
    <div v-if="birthDate" class="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
      <h1 class="text-2xl font-bold text-indigo-700">Kết quả thần số học</h1>
      <p class="text-indigo-600 mt-1">Ngày sinh: {{ birthDate }}</p>
    </div>

    <!-- Kết quả -->
    <div v-if="result" class="space-y-10">
      <div class="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-2xl border border-teal-100 shadow-sm text-center">
        <div class="flex flex-col items-center">
          <div class="relative">
            <!-- Animated circle background -->
            <svg class="w-32 h-32" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" stroke-width="8"/>
              <circle cx="50" cy="50" r="45" fill="none" stroke="#0d9488" stroke-width="8" stroke-dasharray="283" 
                      stroke-dashoffset="283" stroke-linecap="round">
                <animate attributeName="stroke-dashoffset" dur="1.5s" from="283" to="0" fill="freeze" calcMode="spline" keySplines="0.3 0 0.7 1"/>
              </circle>
            </svg>
            <!-- Number and Symbol display -->
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              
              <span class="text-5xl font-bold text-teal-700">{{ result.number }}</span>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-teal-800 mt-6">Số đường đời : {{ result.number }}</h3>
          <h3 class="text-2xl font-bold text-teal-800 mt-2"> Biểu tượng : {{ numberSymbol }}</h3>

          <p class="text-gray-600 mt-2 max-w-lg">{{ result.meaning }}</p>
        </div>
      </div>

      <!-- Grid layout cho các phần thông tin -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Điểm mạnh -->
        <section class="p-5 bg-green-50 rounded-lg">
          <div class="flex items-center mb-3">
            <svg class="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <h3 class="text-xl font-semibold text-green-700">Điểm mạnh</h3>
          </div>
          <ul class="space-y-3 text-gray-700">
            <li v-for="(strength, index) in result.strengths" :key="index" class="flex items-start">
              <span class="text-green-500 mr-2">•</span>
              <span>{{ strength }}</span>
            </li>
          </ul>
        </section>

        <!-- Điểm yếu -->
        <section class="p-5 bg-amber-50 rounded-lg">
          <div class="flex items-center mb-3">
            <svg class="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 class="text-xl font-semibold text-amber-700">Điểm yếu</h3>
          </div>
          <ul class="space-y-3 text-gray-700">
            <li v-for="(weakness, index) in result.weaknesses" :key="index" class="flex items-start">
              <span class="text-amber-500 mr-2">•</span>
              <span>{{ weakness }}</span>
            </li>
          </ul>
        </section>

        <!-- Tình duyên -->
        <section class="p-5 bg-pink-50 rounded-lg">
          <div class="flex items-center mb-3">
            <svg class="h-5 w-5 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 class="text-xl font-semibold text-pink-700">Tình duyên</h3>
          </div>
          <ul class="space-y-3 text-gray-700">
            <li v-for="(romance, index) in result.romance" :key="index" class="flex items-start">
              <span class="text-pink-500 mr-2">•</span>
              <span>{{ romance }}</span>
            </li>
          </ul>
        </section>

        <!-- Nghề nghiệp phù hợp -->
        <section class="p-5 bg-blue-50 rounded-lg">
          <div class="flex items-center mb-3">
            <svg class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 class="text-xl font-semibold text-blue-700">Nghề nghiệp phù hợp</h3>
          </div>
          <ul class="space-y-3 text-gray-700">
            <li v-for="(career, index) in result.careers" :key="index" class="flex items-start">
              <span class="text-blue-500 mr-2">•</span>
              <span>{{ career }}</span>
            </li>
          </ul>
        </section>
      </div>

      <!-- Mối quan hệ tương thích -->
      <section class="p-6 bg-purple-50 rounded-xl">
        <h3 class="text-xl font-semibold text-purple-700 mb-4 flex items-center">
          <svg class="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Mối quan hệ tương thích
        </h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-green-600 mb-2 flex items-center">
              <svg class="h-5 w-5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Tương thích nhất
            </h4>
            <ul class="space-y-3">
              <li v-for="(compat, index) in result.compatibility.best" :key="index" class="text-gray-700">
                <span class="font-medium text-purple-600">Số {{ compat.number }}:</span> {{ compat.description }}
              </li>
            </ul>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-amber-600 mb-2 flex items-center">
              <svg class="h-5 w-5 text-amber-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Ít tương thích
            </h4>
            <ul class="space-y-3">
              <li v-for="(compat, index) in result.compatibility.least" :key="index" class="text-gray-700">
                <span class="font-medium text-purple-600">Số {{ compat.number }}:</span> {{ compat.description }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Người nổi tiếng -->
      <section v-if="result.famousPeople && result.famousPeople.length" class="p-6 bg-amber-50 rounded-xl">
        <h3 class="text-xl font-semibold text-amber-700 mb-4 flex items-center">
          <svg class="h-6 w-6 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Người nổi tiếng
        </h3>
        <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="(person, index) in result.famousPeople" :key="index" class="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <p class="text-gray-700">{{ person }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Define props
const { birthDate, result } = defineProps({
  birthDate: {
    type: String,
    required: true
  },
  result: {
    type: Object,
    default: null
  }
})

// Dữ liệu lifePath với symbol
const lifePath = {
  1: { theme: "Người lãnh đạo", symbol: "♈", strengths: ["Độc lập", "Sáng tạo", "Quyết đoán"], challenges: ["Cứng đầu", "Thiếu kiên nhẫn", "Độc đoán"], careers: ["Doanh nhân", "Quản lý", "Nhà sáng chế"], advice: "Học cách lắng nghe và hợp tác với người khác", purpose: "Khởi xướng những ý tưởng mới và dẫn dắt người khác" },
  2: { theme: "Người hòa giải", symbol: "♉", strengths: ["Nhạy cảm", "Hợp tác", "Kiên nhẫn"], challenges: ["Thiếu quyết đoán", "Dễ bị tổn thương", "Phụ thuộc"], careers: ["Nhà ngoại giao", "Tư vấn", "Giáo viên"], advice: "Phát triển sự tự tin và khả năng đặt ranh giới", purpose: "Mang mọi người lại gần nhau và tạo sự hòa hợp" },
  3: { theme: "Người sáng tạo", symbol: "♊", strengths: ["Truyền cảm hứng", "Giao tiếp", "Lạc quan"], challenges: ["Thiếu tập trung", "Lãng phí tài năng", "Nông nổi"], careers: ["Nghệ sĩ", "Nhà văn", "Diễn giả"], advice: "Rèn luyện tính kỷ luật trong sáng tạo", purpose: "Truyền tải ý tưởng và cảm hứng thông qua nghệ thuật" },
  4: { theme: "Người xây dựng", symbol: "♋", strengths: ["Thực tế", "Đáng tin cậy", "Kỷ luật"], challenges: ["Cứng nhắc", "Bảo thủ", "Thiếu linh hoạt"], careers: ["Kỹ sư", "Kiến trúc sư", "Kế toán"], advice: "Học cách thích nghi với sự thay đổi", purpose: "Tạo dựng nền tảng vững chắc cho xã hội" },
  5: { theme: "Nhà thám hiểm", symbol: "♌", strengths: ["Linh hoạt", "Thích phiêu lưu", "Tiến bộ"], challenges: ["Bồn chồn", "Thiếu cam kết", "Nghiện ngập"], careers: ["Du lịch", "Phóng viên", "Kinh doanh"], advice: "Phát triển tính kiên định và trách nhiệm", purpose: "Trải nghiệm và khám phá thế giới đa dạng" },
  6: { theme: "Người nuôi dưỡng", symbol: "♍", strengths: ["Trách nhiệm", "Chăm sóc", "Cân bằng"], challenges: ["Can thiệp quá mức", "Hy sinh bản thân", "Kiểm soát"], careers: ["Y tế", "Giáo dục", "Tư vấn"], advice: "Học cách chăm sóc bản thân trước khi giúp đỡ người khác", purpose: "Chữa lành và nuôi dưỡng cộng đồng" },
  7: { theme: "Nhà hiền triết", symbol: "♎", strengths: ["Trí tuệ", "Trực giác", "Chiều sâu"], challenges: ["Xa cách", "Hoài nghi", "Lập dị"], careers: ["Nhà khoa học", "Nhà nghiên cứu", "Triết gia"], advice: "Kết nối nhiều hơn với thế giới thực tế", purpose: "Khám phá chân lý và truyền đạt tri thức" },
  8: { theme: "Nhà quản lý", symbol: "♏", strengths: ["Tổ chức", "Tham vọng", "Hiệu quả"], challenges: ["Thao túng", "Vật chất", "Lạm dụng quyền lực"], careers: ["Giám đốc", "Ngân hàng", "Luật sư"], advice: "Cân bằng giữa vật chất và tinh thần", purpose: "Tạo ra của cải và quản lý nguồn lực hiệu quả" },
  9: { theme: "Nhà nhân đạo", symbol: "♐", strengths: ["Rộng lượng", "Sáng suốt", "Lý tưởng"], challenges: ["Mơ mộng", "Bi quan", "Hy sinh quá mức"], careers: ["Từ thiện", "Nghệ thuật", "Hoạt động xã hội"], advice: "Thực tế hóa các lý tưởng cao đẹp", purpose: "Phục vụ nhân loại và cống hiến vì cộng đồng" },
  11: { theme: "Bậc thầy tâm linh", symbol: "⚡", strengths: ["Truyền cảm hứng", "Nhạy cảm", "Tầm nhìn"], challenges: ["Căng thẳng", "Nhạy cảm quá mức", "Khó thực tế"], careers: ["Nhà tâm linh", "Cố vấn", "Nghệ sĩ"], advice: "Chăm sóc sức khỏe tinh thần và thể chất", purpose: "Khai sáng và nâng cao nhận thức cộng đồng" },
  22: { theme: "Kiến trúc sư vĩ đại", symbol: "🏛️", strengths: ["Thực tế hóa", "Xây dựng", "Tầm nhìn lớn"], challenges: ["Áp lực", "Cầu toàn", "Quá tải"], careers: ["Kiến trúc sư", "Nhà quy hoạch", "Lãnh đạo"], advice: "Học cách ủy quyền và chia nhỏ mục tiêu", purpose: "Hiện thực hóa những ý tưởng vĩ đại phục vụ nhân loại" },
  33: { theme: "Bậc thầy giáo dục", symbol: "🎓", strengths: ["Yêu thương", "Sáng tạo", "Truyền cảm hứng"], challenges: ["Quá lý tưởng", "Kiệt sức", "Khó thực tế"], careers: ["Giáo viên", "Nhà trị liệu", "Nhà hoạt động xã hội"], advice: "Cân bằng giữa cho đi và nhận lại", purpose: "Nâng đỡ và giáo dục thế hệ tương lai" }
}

// Computed property để lấy symbol dựa trên result.number
const numberSymbol = computed(() => {
  return lifePath[result?.number]?.symbol || '?'
})
</script>

<style scoped>
/* Đảm bảo symbol hiển thị đẹp */
.symbol {
  display: inline-block;
  transition: transform 0.3s ease;
}
.symbol:hover {
  transform: scale(1.1);
}
</style>