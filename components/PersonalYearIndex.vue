```vue
<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-8">
      <!-- Header (không bảo vệ) -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-teal-700 mb-2">Các chỉ số năm</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Dự báo chi tiết vận trình 3 năm tới dựa trên thần số học
        </p>
      </div>

      <!-- Bảng chỉ số năm (không bảo vệ) -->
      <transition name="fade">
        <div v-if="yearData && yearData.length" class="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl border border-teal-100 shadow-sm">
          <div class="flex flex-col md:flex-row justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-teal-800 mb-2 md:mb-0">
              Chỉ Số Năm ({{ yearData[0].year }}–{{ yearData[yearData.length - 1].year }})
            </h3>
            <div class="flex items-center text-sm text-teal-600 bg-teal-100 px-3 py-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mỗi năm có năng lượng và bài học riêng
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              v-for="(year, index) in yearData" 
              :key="index"
              class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-lg font-bold text-gray-800">{{ year.year }}</span>
                <span class="text-xs font-semibold px-2 py-1 rounded-full" 
                      :class="yearBadgeClass(year.number)">
                  Số {{ year.number }}
                </span>
              </div>
              <div class="text-sm text-gray-600 mb-3">
                {{ year.shortMeaning || year.meaning }}
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5">
                <div class="h-1.5 rounded-full" :class="yearProgressClass(year.number)" 
                     :style="{ width: `${year.energyLevel || 70}%` }"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="loading" class="text-center py-10">
          <div class="inline-flex items-center px-4 py-2 text-sm font-medium text-teal-700 bg-teal-100 rounded-md">
            <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang phân tích chu kỳ vận số...
          </div>
        </div>
        
        <div v-else class="text-center py-10">
          <div class="inline-flex flex-col items-center px-6 py-4 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="text-gray-500">Vui lòng nhập ngày sinh để xem phân tích</p>
          </div>
        </div>
      </transition>

      <!-- Giải thích chi tiết - Bảo vệ -->
      <transition name="fade">
        <div v-if="isLoading" class="text-center py-10">
          <div class="inline-flex items-center px-4 py-2 text-sm font-medium text-teal-700 bg-teal-100 rounded-md">
            <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang kiểm tra quyền truy cập...
          </div>
        </div>
        <div v-else-if="errorMessage" class="text-center py-10 bg-red-50 rounded-lg">
          <svg class="h-8 w-8 mx-auto text-red-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p class="text-red-600 font-medium">{{ errorMessage }}</p>
          <p v-if="hasSufficientTokens === false" class="text-gray-600 text-sm mt-1">Bạn không có đủ token. Vui lòng nạp thêm.</p>
        </div>
        <div v-else-if="yearData && yearData.length">
          <div v-if="isContentAccessible" class="space-y-8">
            <h3 class="text-xl font-bold text-teal-800">Luận Giải Chi Tiết</h3>
            
            <div v-for="(year, index) in yearData" :key="index" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div class="flex flex-col md:flex-row md:items-center mb-6">
                <div class="flex items-center mb-4 md:mb-0 md:mr-6">
                  <span class="text-4xl font-bold mr-3" :class="yearTextClass(year.number)">
                    {{ year.number }}
                  </span>
                  <div>
                    <h4 class="text-lg font-semibold text-gray-800">{{ year.year }}</h4>
                    <p class="text-sm text-gray-500">{{ year.phase }}</p>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-gray-700 italic">"{{ year.meaning }}"</p>
                </div>
              </div>
              
              <div class="grid md:grid-cols-2 gap-6">
                <!-- Cột 1 -->
                <div class="space-y-4">
                  <div class="p-4 bg-blue-50 rounded-lg">
                    <h4 class="font-semibold text-blue-700 flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Cơ Hội Nổi Bật
                    </h4>
                    <ul class="text-gray-700 space-y-2">
                      <li v-for="(item, i) in year.opportunities.split('\n')" :key="i" class="flex items-start">
                        <span class="text-blue-500 mr-2 mt-1">•</span>
                        <span>{{ item }}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div class="p-4 bg-purple-50 rounded-lg">
                    <h4 class="font-semibold text-purple-700 flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Định Hướng Phát Triển
                    </h4>
                    <p class="text-gray-700">{{ year.direction }}</p>
                  </div>
                </div>
                
                <!-- Cột 2 -->
                <div class="space-y-4">
                  <div class="p-4 bg-amber-50 rounded-lg">
                    <h4 class="font-semibold text-amber-700 flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Thách Thức Cần Vượt Qua
                    </h4>
                    <ul class="text-gray-700 space-y-2">
                      <li v-for="(item, i) in year.challenges.split('\n')" :key="i" class="flex items-start">
                        <span class="text-amber-500 mr-2 mt-1">•</span>
                        <span>{{ item }}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div class="p-4 bg-green-50 rounded-lg">
                    <h4 class="font-semibold text-green-700 flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Lời Khuyên Chuyên Gia
                    </h4>
                    <p class="text-gray-700">{{ year.advice }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="!isContentAccessible" class="text-center p-6">
            <button
              @click="handleAction"
              class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap"
              :disabled="isLoading"
            >
              {{ isLoggedIn ? `Xem tiếp (Cần ${tokenCost} tokens)` : 'Đăng nhập để xem tiếp' }}
            </button>
          </div>
        </div>
        <div v-else class="text-center py-10">
          <div class="inline-flex flex-col items-center px-6 py-4 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="text-gray-500">Vui lòng nhập ngày sinh để xem phân tích chi tiết</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useProtectedContent } from '~/composables/useProtectedContent';

const props = defineProps({
  birthDate: {
    type: String,
    default: ''
  }
});

const yearData = ref(null);
const loading = ref(false);
const tokenCost = ref(10);
const description = 'Access to detailed yearly numerology predictions';
const { isLoading, errorMessage, isContentAccessible, hasSufficientTokens, checkAuthAndAccess } = useProtectedContent(tokenCost.value, description);
const isLoggedIn = ref(false);
let handleAction = () => {};
const isInitialLoad = ref(true);

// Màu sắc theo số năm
const yearBadgeClass = (number) => {
  const colors = {
    1: 'bg-purple-100 text-purple-800',
    2: 'bg-blue-100 text-blue-800',
    3: 'bg-green-100 text-green-800',
    4: 'bg-yellow-100 text-yellow-800',
    5: 'bg-red-100 text-red-800',
    6: 'bg-pink-100 text-pink-800',
    7: 'bg-indigo-100 text-indigo-800',
    8: 'bg-teal-100 text-teal-800',
    9: 'bg-orange-100 text-orange-800',
    11: 'bg-cyan-100 text-cyan-800',
    22: 'bg-amber-100 text-amber-800'
  };
  return colors[number] || 'bg-gray-100 text-gray-800';
};

const yearProgressClass = (number) => {
  const colors = {
    1: 'bg-purple-500',
    2: 'bg-blue-500',
    3: 'bg-green-500',
    4: 'bg-yellow-500',
    5: 'bg-red-500',
    6: 'bg-pink-500',
    7: 'bg-indigo-500',
    8: 'bg-teal-500',
    9: 'bg-orange-500',
    11: 'bg-cyan-500',
    22: 'bg-amber-500'
  };
  return colors[number] || 'bg-gray-500';
};

const yearTextClass = (number) => {
  const colors = {
    1: 'text-purple-600',
    2: 'text-blue-600',
    3: 'text-green-600',
    4: 'text-yellow-600',
    5: 'text-red-600',
    6: 'text-pink-600',
    7: 'text-indigo-600',
    8: 'text-teal-600',
    9: 'text-orange-600',
    11: 'text-cyan-600',
    22: 'text-amber-600'
  };
  return colors[number] || 'text-gray-600';
};

// Tính số năm cá nhân
const calculatePersonalYear = (day, month, year) => {
  const sum = day.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0) +
              month.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0) +
              year.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  if ([11, 22].includes(sum)) return sum;
  let result = sum;
  while (result > 9) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result;
};

// Lấy và xử lý dữ liệu
const fetchPersonalYearData = async () => {
  if (!props.birthDate) {
    return;
  }

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    return;
  }

  const [day, month, year] = props.birthDate.split('/').map(Number);
  const dateObj = new Date(year, month - 1, day);
  if (dateObj.getDate() !== day || dateObj.getMonth() + 1 !== month || year < 1900 || year > 2025) {
    return;
  }

  loading.value = true;
  yearData.value = null;

  try {
    // Giả lập API call với timeout
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Tính toán dữ liệu mẫu
    const currentYear = new Date().getFullYear();
    const sampleData = [
      {
        year: currentYear,
        number: calculatePersonalYear(day, month, currentYear),
        phase: "Giai đoạn hoàn thiện",
        meaning: "Năm của sự kết thúc và chuẩn bị cho chu kỳ mới",
        opportunities: "Hoàn thành dự án\nGiúp đỡ cộng đồng\nBuông bỏ quá khứ",
        challenges: "Cảm giác mất mát\nKhó buông bỏ\nThiếu động lực mới",
        advice: "Tập trung hoàn thành những việc dang dở, chuẩn bị tinh thần cho khởi đầu mới",
        direction: "Tham gia hoạt động xã hội, viết nhật ký để nhìn lại hành trình, lập kế hoạch cho chu kỳ tiếp theo",
        energyLevel: 75,
        shortMeaning: "Kết thúc chu kỳ, nhân đạo, cống hiến"
      },
      {
        year: currentYear + 1,
        number: calculatePersonalYear(day, month, currentYear + 1),
        phase: "Giai đoạn khởi đầu",
        meaning: "Năm của sự mới mẻ và độc lập",
        opportunities: "Khởi đầu dự án mới\nPhát triển cá nhân\nKhẳng định bản thân",
        challenges: "Sợ thất bại\nÁp lực dẫn đầu\nThiếu kinh nghiệm",
        advice: "Dám bước ra khỏi vùng an toàn, tin vào bản thân, tập trung vào mục tiêu cá nhân",
        direction: "Học kỹ năng mới, khởi nghiệp hoặc bắt đầu dự án cá nhân, thể hiện cá tính",
        energyLevel: 90,
        shortMeaning: "Khởi đầu mới, độc lập, sáng tạo"
      },
      {
        year: currentYear + 2,
        number: calculatePersonalYear(day, month, currentYear + 2),
        phase: "Giai đoạn phát triển",
        meaning: "Năm của sự hợp tác và cân bằng",
        opportunities: "Xây dựng mối quan hệ\nLàm việc nhóm\nPhát triển trực giác",
        challenges: "Cảm xúc dao động\nKhó quyết định\nPhụ thuộc vào người khác",
        advice: "Lắng nghe trực giác, kiên nhẫn, ưu tiên sự hòa hợp trong các mối quan hệ",
        direction: "Tìm đối tác kinh doanh, tham gia nhóm làm việc, học kỹ năng giao tiếp",
        energyLevel: 65,
        shortMeaning: "Hợp tác, nhạy bén, cân bằng"
      }
    ];

    yearData.value = sampleData;
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu:', err);
  } finally {
    loading.value = false;
  }
};

// Khởi tạo trạng thái đăng nhập và hành động
const initializeAuth = async () => {
  const { isLoggedIn: authStatus, action } = await checkAuthAndAccess();
  isLoggedIn.value = authStatus;
  handleAction = action;
};

// Theo dõi props.birthDate
watch(() => props.birthDate, (newVal) => {
  if (newVal && /^\d{2}\/\d{2}\/\d{4}$/.test(newVal)) {
    fetchPersonalYearData();
    if (isInitialLoad.value) {
      initializeAuth();
      isInitialLoad.value = false;
    }
  }
}, { immediate: false });

// Gọi khi mount
onMounted(() => {
  if (props.birthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    fetchPersonalYearData();
    initializeAuth();
    isInitialLoad.value = false;
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Hiệu ứng khi hover vào card năm */
.hover\:shadow-md {
  transition: all 0.3s ease;
}
.hover\:shadow-md:hover {
  transform: translateY(-2px);
}
</style>
```