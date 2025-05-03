<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-6">
      <!-- Nội dung chu kỳ vận số -->
      <transition name="fade-slide">
        <div v-if="numerologyData && Object.keys(numerologyData.cycles).length" class="mt-6">
          <div class="space-y-8">
            <!-- Biểu đồ chu kỳ vận số -->
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h3 class="text-xl font-bold text-teal-800">Biểu đồ chu kỳ vận số</h3>
                <div class="mt-2 md:mt-0 flex items-center text-sm text-gray-600">
                  <span class="inline-block w-3 h-3 rounded-full bg-teal-500 mr-1"></span>
                  <span>Mức năng lượng (1-9)</span>
                </div>
              </div>
              <ClientOnly>
                <div class="relative h-80">
                  <canvas ref="cycleChart"></canvas>
                </div>
              </ClientOnly>
              <div class="mt-4 text-sm text-gray-500">
                <p>Biểu đồ thể hiện mức năng lượng và xu hướng của từng năm cá nhân trong chu kỳ 10 năm.</p>
              </div>
            </div>

            <!-- Danh sách các năm -->
            <div v-for="(yearData, year) in sortedCycles" :key="year" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div class="flex items-center mb-3 sm:mb-0">
                  <span class="w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold mr-3">{{ year }}</span>
                  <div>
                    <h4 class="text-lg font-semibold text-gray-800">Năm {{ year }}</h4>
                    <div class="flex items-center mt-1">
                      <span class="text-sm font-medium px-2 py-1 rounded" 
                            :class="getNumberClass(yearData.number)">
                        Số {{ yearData.number }}
                      </span>
                      <span class="ml-2 text-sm text-gray-500">
                        Năng lượng: {{ yearData.energyLevel }}/9
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-teal-500" 
                         :style="{ width: `${(yearData.energyLevel / 9) * 100}%` }"></div>
                  </div>
                </div>
              </div>

              <div class="prose prose-teal max-w-none">
                <p class="text-gray-700 mb-4">{{ yearData.description }}</p>
                
                <div class="grid md:grid-cols-2 gap-6">
                  <!-- Điểm mạnh -->
                  <div class="bg-green-50 p-4 rounded-lg">
                    <h5 class="font-semibold text-green-700 flex items-center mb-2">
                      <svg class="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Điểm mạnh
                    </h5>
                    <ul class="space-y-2 text-gray-700">
                      <li v-for="(strength, index) in yearData.strengths" :key="index" class="flex items-start">
                        <span class="text-green-500 mr-2 mt-1">•</span>
                        <span>{{ strength }}</span>
                      </li>
                    </ul>
                  </div>

                  <!-- Điểm yếu -->
                  <div class="bg-amber-50 p-4 rounded-lg">
                    <h5 class="font-semibold text-amber-700 flex items-center mb-2">
                      <svg class="w-4 h-4 mr-1 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                      </svg>
                      Điểm yếu
                    </h5>
                    <ul class="space-y-2 text-gray-700">
                      <li v-for="(weakness, index) in yearData.weaknesses" :key="index" class="flex items-start">
                        <span class="text-amber-500 mr-2 mt-1">•</span>
                        <span>{{ weakness }}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Lời khuyên -->
                <div class="mt-6 bg-blue-50 p-4 rounded-lg">
                  <h5 class="font-semibold text-blue-700 flex items-center mb-2">
                    <svg class="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                    Lời khuyên năm {{ year }}
                  </h5>
                  <ul class="space-y-2 text-gray-700">
                    <li v-for="(advice, index) in yearData.advice" :key="index" class="flex items-start">
                      <span class="text-blue-500 mr-2 mt-1">•</span>
                      <span>{{ advice }}</span>
                    </li>
                  </ul>
                </div>
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
            Đang tải dữ liệu chu kỳ vận số...
          </div>
        </div>
        <div v-else class="text-center py-10">
          <div class="inline-flex flex-col items-center px-6 py-4 bg-red-50 rounded-lg">
            <svg class="h-8 w-8 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <p class="text-red-600 font-medium">Không có dữ liệu chu kỳ vận số.</p>
            <p class="text-gray-600 text-sm mt-1">Vui lòng kiểm tra lại ngày sinh hoặc thử lại sau.</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Chart from 'chart.js/auto';

// Bảng ánh xạ số năm cá nhân sang mức năng lượng (đã điều chỉnh)
const energyLevelMap = {
  1: 3,  // Khởi đầu - năng lượng trung bình (tăng từ 1 lên 3)
  2: 5,  // Hợp tác - năng lượng cao hơn
  3: 7,  // Sáng tạo - năng lượng rất cao
  4: 4,  // Ổn định - năng lượng trung bình
  5: 6,  // Thay đổi - năng lượng cao
  6: 5,  // Gia đình - năng lượng trung bình cao
  7: 3,  // Nội tâm - năng lượng thấp
  8: 8,  // Thành công - năng lượng rất cao
  9: 4,  // Hoàn thiện - năng lượng trung bình
  11: 6, // Trực giác - năng lượng cao
  22: 9  // Vượt trội - năng lượng cao nhất
};

const props = defineProps({
  birthDate: {
    type: String,
    default: ''
  }
});

const numerologyData = ref(null);
const loading = ref(false);
const cycleChart = ref(null);
let chartInstance = null;

// Sắp xếp các năm theo thứ tự tăng dần
const sortedCycles = computed(() => {
  if (!numerologyData.value?.cycles) return {};
  
  return Object.entries(numerologyData.value.cycles)
    .sort(([yearA], [yearB]) => parseInt(yearA) - parseInt(yearB))
    .reduce((acc, [year, data]) => {
      acc[year] = data;
      return acc;
    }, {});
});

// Class màu sắc cho từng số
const getNumberClass = (number) => {
  const classes = {
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
  return classes[number] || 'bg-gray-100 text-gray-800';
};

// Tạo biểu đồ chu kỳ vận số
const createCycleChart = () => {
  if (!process.client || !numerologyData.value || !cycleChart.value || !numerologyData.value.cycles) {
    return;
  }

  if (chartInstance) chartInstance.destroy();

  const years = Object.keys(sortedCycles.value).map(Number);
  const energyLevels = years.map(year => sortedCycles.value[year].energyLevel);
  const numbers = years.map(year => sortedCycles.value[year].number);

  // Tạo gradient cho biểu đồ
  const ctx = cycleChart.value.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(20, 184, 166, 0.8)');
  gradient.addColorStop(1, 'rgba(20, 184, 166, 0.1)');

  chartInstance = new Chart(cycleChart.value, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Mức năng lượng',
          data: energyLevels,
          borderColor: '#0d9488',
          backgroundColor: gradient,
          fill: true,
          tension: 0.3,
          borderWidth: 3,
          pointBackgroundColor: (context) => {
            const number = numbers[context.dataIndex];
            return getPointColor(number);
          },
          pointBorderColor: '#fff',
          pointHoverRadius: 7,
          pointRadius: 5,
          pointHitRadius: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#f3f4f6',
          bodyColor: '#e5e7eb',
          borderColor: '#374151',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: (context) => {
              const year = context.label;
              const number = numbers[context.dataIndex];
              const description = sortedCycles.value[year].description.split('.')[0];
              return [
                `Năm ${year} - Số ${number}`,
                `Mức năng lượng: ${context.raw}/9`,
                `${description}`
              ];
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 1,
          max: 9,
          ticks: {
            stepSize: 1,
            callback: (value) => {
              const labels = {
                1: 'Rất thấp',
                3: 'Thấp',
                5: 'Trung bình',
                7: 'Cao',
                9: 'Rất cao'
              };
              return labels[value] || value;
            }
          },
          title: { 
            display: true, 
            text: 'Mức năng lượng',
            color: '#4b5563'
          },
          grid: {
            color: '#e5e7eb',
          }
        },
        x: {
          title: { 
            display: true, 
            text: 'Năm cá nhân',
            color: '#4b5563'
          },
          grid: {
            display: false
          }
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
    },
  });
};

// Màu sắc cho điểm trên biểu đồ theo số
const getPointColor = (number) => {
  const colors = {
    1: '#8b5cf6', // purple
    2: '#3b82f6', // blue
    3: '#10b981', // green
    4: '#f59e0b', // yellow
    5: '#ef4444', // red
    6: '#ec4899', // pink
    7: '#6366f1', // indigo
    8: '#0d9488', // teal
    9: '#f97316', // orange
    11: '#06b6d4', // cyan
    22: '#f59e0b' // amber
  };
  return colors[number] || '#6b7280'; // gray
};

// Gọi API để lấy dữ liệu chu kỳ vận số
const fetchNumerologyData = async () => {
  if (!props.birthDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    return;
  }

  loading.value = true;
  numerologyData.value = null;

  try {
    // Giả lập API call với dữ liệu mẫu
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Tạo dữ liệu mẫu cho 9 năm tiếp theo từ năm hiện tại
    const currentYear = new Date().getFullYear();
    const cycles = {};
    
    for (let i = 0; i < 9; i++) {
      const year = currentYear + i;
      const number = (i % 9) + 1; // Chu kỳ 1-9
      const energyLevel = energyLevelMap[number];
      
      cycles[year] = generateYearData(year, number, energyLevel);
    }
    
    // Thêm năm đặc biệt (Master Number)
    cycles[currentYear + 9] = generateYearData(currentYear + 9, 22, energyLevelMap[22]);
    
    numerologyData.value = { cycles };
    
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu:', err);
  } finally {
    loading.value = false;
  }
};

// Hàm tạo dữ liệu mẫu cho từng năm
const generateYearData = (year, number, energyLevel) => {
  const descriptions = {
    1: `Năm ${year} với số 1 mang năng lượng khởi đầu. Đây là thời điểm bắt đầu dự án mới và tự tin tiến lên.`,
    2: `Năm ${year} với số 2 tập trung vào hợp tác. Hãy xây dựng mối quan hệ và tìm sự cân bằng.`,
    3: `Năm ${year} với số 3 tràn đầy sáng tạo. Hãy thể hiện bản thân và tận hưởng niềm vui.`,
    4: `Năm ${year} với số 4 là xây dựng nền tảng. Làm việc chăm chỉ để đạt sự ổn định.`,
    5: `Năm ${year} với số 5 mang đến thay đổi. Khám phá cơ hội mới và sống năng động.`,
    6: `Năm ${year} với số 6 nhấn mạnh gia đình. Chăm sóc người thân và tạo sự hài hòa.`,
    7: `Năm ${year} với số 7 khuyến khích nội tâm. Suy ngẫm và học hỏi sẽ mang lại giá trị.`,
    8: `Năm ${year} với số 8 là năm thành công. Tận dụng tham vọng để đạt mục tiêu lớn.`,
    9: `Năm ${year} với số 9 đánh dấu hoàn thiện. Chia sẻ kinh nghiệm và chuẩn bị khởi đầu mới.`,
    11: `Năm ${year} với số 11 mang năng lượng tâm linh. Đây là thời điểm phát triển trực giác và sự sáng tạo.`,
    22: `Năm ${year} với số 22 mang năng lượng xây dựng lớn. Đây là thời điểm thực hiện các dự án tầm cỡ.`
  };

  const strengths = {
    1: ['Tinh thần tiên phong', 'Sự quyết đoán', 'Năng lượng sáng tạo'],
    2: ['Khả năng hợp tác', 'Nhạy bén trong giao tiếp', 'Sự kiên nhẫn'],
    3: ['Khả năng biểu đạt', 'Năng lượng tích cực', 'Sự lạc quan'],
    4: ['Tính kỷ luật', 'Khả năng tổ chức', 'Sự kiên trì'],
    5: ['Tính linh hoạt', 'Tinh thần phiêu lưu', 'Khả năng thích nghi'],
    6: ['Trách nhiệm', 'Sự yêu thương', 'Khả năng chăm sóc'],
    7: ['Trực giác mạnh', 'Khả năng phân tích', 'Sự sâu sắc'],
    8: ['Tham vọng', 'Khả năng lãnh đạo', 'Tư duy kinh doanh'],
    9: ['Lòng nhân ái', 'Tầm nhìn rộng', 'Sự bao dung'],
    11: ['Trực giác cao', 'Sự sáng tạo', 'Cảm hứng nghệ thuật'],
    22: ['Tầm nhìn chiến lược', 'Khả năng xây dựng', 'Năng lượng bền bỉ']
  };

  const weaknesses = {
    1: ['Thiếu kiên nhẫn', 'Tính độc đoán', 'Thiếu linh hoạt'],
    2: ['Dễ bị ảnh hưởng', 'Thiếu quyết đoán', 'Nhạy cảm quá mức'],
    3: ['Dễ phân tâm', 'Thiếu tập trung', 'Nói nhiều hơn làm'],
    4: ['Cứng nhắc', 'Thiếu linh hoạt', 'Bảo thủ'],
    5: ['Thiếu kiên định', 'Bốc đồng', 'Khó gắn bó'],
    6: ['Hy sinh quá mức', 'Lo lắng thái quá', 'Dễ bị lợi dụng'],
    7: ['Cô lập bản thân', 'Hoài nghi', 'Quá phân tích'],
    8: ['Áp lực cao', 'Tham vọng quá mức', 'Coi trọng vật chất'],
    9: ['Dễ xúc động', 'Khó buông bỏ', 'Mơ mộng viển vông'],
    11: ['Nhạy cảm quá mức', 'Dễ bị tổn thương', 'Thiếu thực tế'],
    22: ['Áp lực lớn', 'Cầu toàn', 'Dễ kiệt sức']
  };

  const advice = {
    1: ['Tập trung vào mục tiêu dài hạn', 'Học cách lắng nghe', 'Kiên nhẫn với tiến độ'],
    2: ['Phát triển mối quan hệ', 'Tin tưởng vào trực giác', 'Tìm kiếm sự cân bằng'],
    3: ['Tận dụng sáng tạo', 'Chia sẻ tài năng', 'Giữ kỷ luật'],
    4: ['Xây dựng nền tảng', 'Lập kế hoạch chi tiết', 'Duy trì sự kiên trì'],
    5: ['Đón nhận thay đổi', 'Kiểm soát rủi ro', 'Giữ vững mục tiêu'],
    6: ['Cân bằng bản thân và gia đình', 'Đặt ranh giới rõ ràng', 'Chăm sóc sức khỏe'],
    7: ['Dành thời gian tĩnh lặng', 'Phát triển tâm linh', 'Chia sẻ suy nghĩ'],
    8: ['Tập trung vào mục tiêu lớn', 'Quản lý căng thẳng', 'Cân bằng vật chất và tinh thần'],
    9: ['Chia sẻ kiến thức', 'Buông bỏ quá khứ', 'Chuẩn bị cho giai đoạn mới'],
    11: ['Phát triển trực giác', 'Thể hiện sáng tạo', 'Kết nối tâm linh'],
    22: ['Tập trung vào dự án lớn', 'Quản lý năng lượng', 'Tìm kiếm hỗ trợ']
  };

  return {
    number,
    description: descriptions[number] || `Năm ${year} với số ${number}`,
    energyLevel,
    strengths: strengths[number] || [],
    weaknesses: weaknesses[number] || [],
    advice: advice[number] || []
  };
};

// Theo dõi birthDate để gọi API
watch(() => props.birthDate, fetchNumerologyData);

// Gọi API khi component mount
onMounted(fetchNumerologyData);

// Theo dõi numerologyData để vẽ biểu đồ
watch(numerologyData, () => {
  if (numerologyData.value?.cycles) {
    nextTick(() => createCycleChart());
  }
}, { deep: true });
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Tùy chỉnh scrollbar cho các list */
.prose ul {
  @apply max-h-64 overflow-y-auto;
}
.prose ul::-webkit-scrollbar {
  @apply w-1.5;
}
.prose ul::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded;
}
.prose ul::-webkit-scrollbar-thumb {
  @apply bg-teal-300 rounded;
}
.prose ul::-webkit-scrollbar-thumb:hover {
  @apply bg-teal-400;
}
</style>