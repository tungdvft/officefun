<template>
  <div class="p-6 bg-white rounded-xl shadow-lg sm:p-4">
    <!-- Header với ngày sinh -->
    <div v-if="birthDate" class="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
      <h1 class="text-2xl font-bold text-indigo-700">Tổng quan về bạn</h1>
      <p class="text-indigo-600 mt-1">Ngày sinh: {{ birthDate }}</p>
    </div>

    <!-- Kết quả -->
    <div v-if="result" class="space-y-10">
      <div class="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-2xl border border-teal-100 shadow-sm text-center">
        <div class="flex flex-col items-center">
          <div class="relative">
            <!-- Background hình tròn với hiệu ứng glow -->
            <div
              :class="['w-40 h-40 rounded-full bg-cover bg-center animate-glow']"
              :style="{ backgroundImage: 'url(/numerology-background.jpg)' }"
            ></div>
            <!-- Number and Symbol display -->
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span :class="['text-6xl font-bold', numberTextColorClass]" style="text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);">{{ result.number }}</span>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-teal-800 mt-6">Số đường đời: {{ result.number }}</h3>
          <h3 class="text-2xl font-bold text-teal-800 mt-2">Biểu tượng: {{ numberSymbol }}</h3>
          <p class="text-gray-600 mt-2 max-w-lg">{{ result.meaning }}</p>
        </div>
      </div>

      <!-- Điểm mạnh và Điểm yếu (luôn hiển thị) -->
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
      </div>

      <!-- Phần nội dung được bảo vệ (từ Tình duyên trở đi) -->
      <div v-if="isLoading" class="flex justify-center">
        <svg
          class="animate-spin h-8 w-8 text-teal-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      <div v-else-if="errorMessage" class="text-red-600 text-center font-medium p-6">
        <template v-if="errorType === 'login'">
          Vui lòng <button @click="errorAction" class="action-button">Đăng Nhập</button> để sử dụng tính năng này.
        </template>
        <template v-else-if="errorType === 'topup'">
          Không đủ token cho tính năng này. Hãy <button @click="errorAction" class="action-button">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
        </template>
        <template v-else>
          {{ errorMessage }}
        </template>
      </div>
      <div v-else-if="isContentAccessible" class="space-y-10">
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

        <!-- Mối quan hệ tương thích -->
        <section class="p-6 bg-purple-50 rounded-xl">
          <h3 class="text-xl font-semibold text-purple-700 mb-4 flex items-center">
            <svg class="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
      <div v-else class="text-center p-6">
        <button
          v-if="hasSufficientTokens"
          @click="handleAction"
          class="action-button"
        >
          {{ isLoggedIn ? `Xem tiếp (Cần ${tokenCost} tokens)` : 'Đăng Nhập để xem tiếp' }}
        </button>
        <p v-else class="text-gray-600 mt-2">
          Không đủ token cho tính năng này. Hãy
          <button @click="errorAction" class="action-button">nạp thêm token</button>
          để trải nghiệm đầy đủ tính năng nhé!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useProtectedContent } from '~/composables/useProtectedContent';
import { useTokenStore } from '~/stores/token';

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
});

// Token configuration
const tokenCost = ref(10);
const description = 'Access to life path details';
const { isLoading, errorMessage, errorType, isContentAccessible, hasSufficientTokens, checkAuthAndAccess, errorAction } = useProtectedContent(tokenCost.value, description);

const tokenStore = useTokenStore();
const isLoggedIn = computed(() => tokenStore.isLoggedIn);
const handleAction = ref(async () => {
  if (!tokenStore.isLoggedIn) {
    await tokenStore.login();
  }
  await checkAuthAndAccess();
});

// Initialize authentication and token check
const initializeAuth = async () => {
  console.log('Initializing auth...');
  await tokenStore.initialize();
  await checkAuthAndAccess();
  console.log('Auth initialized, isLoggedIn:', tokenStore.isLoggedIn, 'tokenBalance:', tokenStore.tokenBalance);
};

// Run initialization on mount
initializeAuth();

// Dữ liệu lifePath với symbol, đã sửa lỗi cú pháp cho số 33
const lifePath = {
  1: { theme: "Người lãnh đạo", symbol: "♈", strengths: ["Độc lập", "Sáng tạo", "Quyết đoán"], weaknesses: ["Cứng đầu", "Thiếu kiên nhẫn", "Độc đoán"], careers: ["Doanh nhân", "Quản lý", "Nhà sáng chế"], romance: ["Năng động trong tình yêu", "Thích dẫn dắt"], compatibility: { best: [{ number: 3, description: "Sáng tạo và năng lượng cao" }, { number: 5, description: "Thích phiêu lưu" }], least: [{ number: 4, description: "Quá cứng nhắc" }] }, famousPeople: ["Steve Jobs", "Oprah Winfrey"] },
  2: { theme: "Người hòa giải", symbol: "♉", strengths: ["Nhạy cảm", "Hợp tác", "Kiên nhẫn"], weaknesses: ["Thiếu quyết đoán", "Dễ bị tổn thương", "Phụ thuộc"], careers: ["Nhà ngoại giao", "Tư vấn", "Giáo viên"], romance: ["Lãng mạn và chu đáo", "Tìm kiếm sự ổn định"], compatibility: { best: [{ number: 6, description: "Chăm sóc và yêu thương" }], least: [{ number: 8, description: "Quá tham vọng" }] }, famousPeople: ["Madonna", "Bill Clinton"] },
  3: { theme: "Người sáng tạo", symbol: "♊", strengths: ["Truyền cảm hứng", "Giao tiếp", "Lạc quan"], weaknesses: ["Thiếu tập trung", "Lãng phí tài năng", "Nông nổi"], careers: ["Nghệ sĩ", "Nhà văn", "Diễn giả"], romance: ["Yêu tự do", "Thích sự mới mẻ"], compatibility: { best: [{ number: 1, description: "Năng lượng tương đồng" }], least: [{ number: 7, description: "Quá nội tâm" }] }, famousPeople: ["J.K. Rowling", "Chris Hemsworth"] },
  4: { theme: "Người xây dựng", symbol: "♋", strengths: ["Thực tế", "Đáng tin cậy", "Kỷ luật"], weaknesses: ["Cứng nhắc", "Bảo thủ", "Thiếu linh hoạt"], careers: ["Kỹ sư", "Kiến trúc sư", "Kế toán"], romance: ["Trung thành và ổn định", "Tìm kiếm sự an toàn"], compatibility: { best: [{ number: 2, description: "Hòa hợp và hỗ trợ" }], least: [{ number: 5, description: "Quá tự do" }] }, famousPeople: ["Arnold Schwarzenegger", "Elon Musk"] },
  5: { theme: "Nhà thám hiểm", symbol: "♌", strengths: ["Linh hoạt", "Thích phiêu lưu", "Tiến bộ"], weaknesses: ["Bồn chồn", "Thiếu cam kết", "Nghiện ngập"], careers: ["Du lịch", "Phóng viên", "Kinh doanh"], romance: ["Đam mê và tự do", "Thích trải nghiệm mới"], compatibility: { best: [{ number: 3, description: "Sáng tạo và năng động" }], least: [{ number: 4, description: "Quá cứng nhắc" }] }, famousPeople: ["Angelina Jolie", "Mick Jagger"] },
  6: { theme: "Người nuôi dưỡng", symbol: "♍", strengths: ["Trách nhiệm", "Chăm sóc", "Cân bằng"], weaknesses: ["Can thiệp quá mức", "Hy sinh bản thân", "Kiểm soát"], careers: ["Y tế", "Giáo dục", "Tư vấn"], romance: ["Yêu thương và tận tâm", "Tìm kiếm sự bền vững"], compatibility: { best: [{ number: 2, description: "Hòa hợp và hỗ trợ" }], least: [{ number: 9, description: "Quá lý tưởng" }] }, famousPeople: ["John Lennon", "Meryl Streep"] },
  7: { theme: "Nhà hiền triết", symbol: "♎", strengths: ["Trí tuệ", "Trực giác", "Chiều sâu"], weaknesses: ["Xa cách", "Hoài nghi", "Lập dị"], careers: ["Nhà khoa học", "Nhà nghiên cứu", "Triết gia"], romance: ["Sâu sắc và tinh tế", "Cần không gian riêng"], compatibility: { best: [{ number: 9, description: "Chia sẻ lý tưởng" }], least: [{ number: 3, description: "Quá hướng ngoại" }] }, famousPeople: ["Leonardo da Vinci", "Stephen Hawking"] },
  8: { theme: "Nhà quản lý", symbol: "♏", strengths: ["Tổ chức", "Tham vọng", "Hiệu quả"], weaknesses: ["Thao túng", "Vật chất", "Lạm dụng quyền lực"], careers: ["Giám đốc", "Ngân hàng", "Luật sư"], romance: ["Mạnh mẽ và kiểm soát", "Tìm kiếm sự tôn trọng"], compatibility: { best: [{ number: 4, description: "Ổn định và thực tế" }], least: [{ number: 2, description: "Quá nhạy cảm" }] }, famousPeople: ["Barack Obama", "Hillary Clinton"] },
  9: { theme: "Nhà nhân đạo", symbol: "♐", strengths: ["Rộng lượng", "Sáng suốt", "Lý tưởng"], weaknesses: ["Mơ mộng", "Bi quan", "Hy sinh quá mức"], careers: ["Từ thiện", "Nghệ thuật", "Hoạt động xã hội"], romance: ["Lý tưởng và tận tâm", "Tìm kiếm ý nghĩa sâu sắc"], compatibility: { best: [{ number: 7, description: "Chia sẻ chiều sâu" }], least: [{ number: 6, description: "Quá kiểm soát" }] }, famousPeople: ["Mahatma Gandhi", "Mother Teresa"] },
  11: { theme: "Bậc thầy tâm linh", symbol: "⚡", strengths: ["Truyền cảm hứng", "Nhạy cảm", "Tầm nhìn"], weaknesses: ["Căng thẳng", "Nhạy cảm quá mức", "Khó thực tế"], careers: ["Nhà tâm linh", "Cố vấn", "Nghệ sĩ"], romance: ["Sâu sắc và tâm linh", "Cần sự kết nối tinh thần"], compatibility: { best: [{ number: 22, description: "Chia sẻ tầm nhìn lớn" }], least: [{ number: 8, description: "Quá vật chất" }] }, famousPeople: ["Albert Einstein", "Deepak Chopra"] },
  22: { theme: "Kiến trúc sư vĩ đại", symbol: "🏛️", strengths: ["Thực tế hóa", "Xây dựng", "Tầm nhìn lớn"], weaknesses: ["Áp lực", "Cầu toàn", "Quá tải"], careers: ["Kiến trúc sư", "Nhà quy hoạch", "Lãnh đạo"], romance: ["Ổn định và tận tâm", "Tìm kiếm mục tiêu chung"], compatibility: { best: [{ number: 11, description: "Chia sẻ tầm nhìn" }], least: [{ number: 5, description: "Quá tự do" }] }, famousPeople: ["Bill Gates", "Nikola Tesla"] },
  33: { 
    theme: "Bậc thầy giáo dục", 
    symbol: "🎓", 
    strengths: ["Yêu thương", "Sáng tạo", "Truyền cảm hứng"], 
    weaknesses: ["Quá lý tưởng", "Kiệt sức", "Khó thực tế"], 
    careers: ["Giáo viên", "Nhà trị liệu", "Nhà hoạt động xã hội"], 
    romance: ["Yêu thương và lý tưởng", "Tìm kiếm sự kết nối sâu sắc"], 
    compatibility: { 
      best: [{ number: 6, description: "Chia sẻ sự chăm sóc" }], 
      least: [{ number: 8, description: "Quá vật chất" }] 
    }, 
    famousPeople: ["Dalai Lama", "Nelson Mandela"] 
  }
};

// Computed property để lấy symbol dựa trên result.number
const numberSymbol = computed(() => {
  return lifePath[result?.number]?.symbol || '?';
});

// Computed property để gán màu chữ cho số đường đời
const numberTextColorClass = computed(() => {
  const colors = {
    1: 'text-red-500',
    2: 'text-orange-500',
    3: 'text-yellow-500',
    4: 'text-green-500',
    5: 'text-blue-500',
    6: 'text-pink-500',
    7: 'text-purple-500',
    8: 'text-indigo-900',
    9: 'text-cyan-500',
    11: 'text-purple-300',
    22: 'text-gray-400',
    33: 'text-pink-300'
  };
  return colors[result?.number] || 'text-teal-500';
});
</script>

<style scoped>
/* Animation glow nhẹ cho background hình tròn */
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  }
  50% {
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.4);
  }
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

/* Đảm bảo symbol hiển thị đẹp */
.symbol {
  display: inline-block;
  transition: transform 0.3s ease;
}
.symbol:hover {
  transform: scale(1.1);
}

/* Style cho nút hành động */
.action-button {
  @apply px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap mx-2;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .mx-auto {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>