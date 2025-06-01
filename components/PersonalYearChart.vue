<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-4 space-y-6 md:p-6">
      <!-- Nội dung chu kỳ vận số -->
      <transition name="fade-slide">
        <div v-if="numerologyData && Object.keys(numerologyData.cycles).length" class="mt-6">
          <div class="space-y-8">
            <!-- Biểu đồ chu kỳ vận số -->
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-teal-700 mb-3">Biểu đồ chu kỳ vận số</h2>
              <div class="w-24 h-1 bg-teal-500 mx-auto mb-4 rounded-full"></div>
              <p class="text-base text-gray-600 max-w-2xl mx-auto">
                Khám phá hành trình cuộc đời qua các chu kỳ số, từ những giai đoạn thịnh vượng đến thử thách.
              </p>
              <div class="text-sm text-gray-600 mt-2">
                <p>Năm cá nhân được tính từ ngày sinh và năm hiện tại, thể hiện chu kỳ năng lượng riêng.</p>
              </div>
            </div>
            <div class="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div class="mt-2 md:mt-0 flex items-center text-sm text-gray-600">
                  <span class="inline-block w-3 h-3 rounded-full bg-teal-500 mr-1"></span>
                  <span>Mức năng lượng (1-10)</span>
                </div>
              </div>
              <ClientOnly>
                <div class="relative h-80 sm:h-96">
                  <canvas ref="cycleChart"></canvas>
                </div>
              </ClientOnly>
              <div class="mt-4 text-sm text-gray-500">
                <p>Biểu đồ thể hiện mức năng lượng và xu hướng của từng năm cá nhân trong chu kỳ 15 năm.</p>
              </div>
              <!-- Thông tin chi tiết khi click -->
              <div v-if="selectedYear" class="mt-4 bg-teal-50 p-4 rounded-lg">
                <h5 class="font-semibold text-teal-700 mb-2">Chi tiết năm {{ selectedYear }}</h5>
                <p class="text-gray-700 mb-2">{{ numerologyData.cycles[selectedYear].description }}</p>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <h6 class="font-semibold text-green-700">Điểm mạnh</h6>
                    <ul class="list-disc pl-5 text-gray-700">
                      <li v-for="(strength, index) in numerologyData.cycles[selectedYear].strengths" :key="index">{{ strength }}</li>
                    </ul>
                  </div>
                  <div>
                    <h6 class="font-semibold text-amber-700">Điểm yếu</h6>
                    <ul class="list-disc pl-5 text-gray-700">
                      <li v-for="(weakness, index) in numerologyData.cycles[selectedYear].weaknesses" :key="index">{{ weakness }}</li>
                    </ul>
                  </div>
                </div>
                <div class="mt-4">
                  <h6 class="font-semibold text-blue-700">Lời khuyên</h6>
                  <ul class="list-disc pl-5 text-gray-700">
                    <li v-for="(advice, index) in numerologyData.cycles[selectedYear].advice" :key="index">{{ advice }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Danh sách các năm -->
            <div v-for="(yearData, year) in sortedCycles" :key="year"
                 class="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm"
                 :class="{ 'ring-2 ring-teal-500': highlightedYear === year }">
              <!-- Tiêu đề accordion (chỉ trên mobile) -->
              <div class="flex justify-between items-center sm:hidden cursor-pointer"
                   @click="toggleYear(year)">
                <div class="flex items-center">
                  <span class="w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold mr-3">{{ year }}</span>
                  <div>
                    <h4 class="text-lg font-semibold text-gray-800">Năm {{ year }}</h4>
                    <div class="flex items-center mt-1">
                      <span class="text-sm font-medium px-2 py-1 rounded"
                            :class="getNumberClass(yearData.number)">
                        Số {{ yearData.number }}
                      </span>
                      <span class="ml-2 text-sm text-gray-500">
                        Năng lượng: {{ yearData.energyLevel }}/10
                      </span>
                    </div>
                  </div>
                </div>
                <svg :class="{ 'rotate-180': expandedYears.includes(year) }"
                     class="w-5 h-5 text-gray-500 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <!-- Nội dung chi tiết -->
              <transition name="accordion-slide">
                <div v-if="expandedYears.includes(year) || !isMobile" class="mt-4 sm:mt-0">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:block"
                       :class="{ 'hidden': !isMobile }">
                    <div class="flex items-center mb-3 sm:mb-0 sm:hidden">
                      <span class="w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold mr-3">{{ year }}</span>
                      <div>
                        <h4 class="text-lg font-semibold text-gray-800">Năm {{ year }}</h4>
                        <div class="flex items-center mt-1">
                          <span class="text-sm font-medium px-2 py-1 rounded"
                                :class="getNumberClass(yearData.number)">
                            Số {{ yearData.number }}
                          </span>
                          <span class="ml-2 text-sm text-gray-500">
                            Năng lượng: {{ yearData.energyLevel }}/10
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center sm:mt-2">
                      <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-teal-500"
                             :style="{ width: `${(yearData.energyLevel / 10) * 100}%` }"></div>
                      </div>
                    </div>
                  </div>
                  <div class="prose prose-teal max-w-none">
                    <p class="text-gray-700 mb-4">{{ yearData.description }}</p>
                    <div class="grid md:grid-cols-2 gap-6">
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
              </transition>
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import Chart from 'chart.js/auto';
import { nextTick } from 'vue';

// Đảm bảo plugin annotation được tải
import 'chartjs-plugin-annotation';

// Bảng ánh xạ số năm cá nhân sang mức năng lượng
const energyLevelMap = {
  1: 7,  // Khởi đầu
  2: 4,  // Hợp tác
  3: 6,  // Sáng tạo
  4: 5,  // Ổn định
  5: 8,  // Thay đổi
  6: 5,  // Gia đình
  7: 7,  // Nội tâm
  8: 9,  // Thành công
  9: 4,  // Hoàn thiện
  11: 8, // Trực giác (Master)
  22: 10 // Vượt trội (Master)
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
const selectedYear = ref(null);
const highlightedYear = ref(null);
const expandedYears = ref([]);
const isMobile = ref(window.innerWidth < 640);
let chartInstance = null;

// Xử lý resize để cập nhật isMobile
const handleResize = () => {
  isMobile.value = window.innerWidth < 640;
};

// Toggle trạng thái accordion
const toggleYear = (year) => {
  if (expandedYears.value.includes(year)) {
    expandedYears.value = expandedYears.value.filter(y => y !== year);
  } else {
    expandedYears.value = [year]; // Chỉ mở một năm tại một thời điểm
  }
};

// Giảm số về một chữ số, giữ Master Numbers
const reduceToSingleDigit = (num) => {
  if (num === 11 || num === 22) return num;
  while (num > 9) {
    num = String(num).split('').reduce((sum, digit) => sum + Number(digit), 0);
  }
  return num || 9;
};

// Tính năm cá nhân
const calculatePersonalYear = (day, month, targetYear) => {
  const dayMonthSum = reduceToSingleDigit(day + month);
  const yearSum = reduceToSingleDigit(targetYear);
  return reduceToSingleDigit(dayMonthSum + yearSum);
};

// Sắp xếp chu kỳ theo năm
const sortedCycles = computed(() => {
  if (!numerologyData.value?.cycles) return {};
  return Object.entries(numerologyData.value.cycles)
    .sort(([yearA], [yearB]) => Number(yearA) - Number(yearB))
    .reduce((acc, [year, data]) => {
      acc[year] = data;
      return acc;
    }, {});
});

// Class màu sắc cho số
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

// Màu sắc cho điểm trên biểu đồ
const getPointColor = (number) => {
  const colors = {
    1: '#8b5cf6', // purple-500
    2: '#3b82f6', // blue-500
    3: '#10b981', // green-500
    4: '#f59e0b', // yellow-500
    5: '#ef4444', // red-500
    6: '#ec4899', // pink-500
    7: '#6366f1', // indigo-500
    8: '#0d9488', // teal-500
    9: '#f97316', // orange-500
    11: '#06b6d4', // cyan-500
    22: '#f59e0b' // amber-500
  };
  return colors[number] || '#6b7280'; // gray-500
};

// Tạo biểu đồ
const createCycleChart = () => {
  if (!cycleChart.value || !numerologyData.value?.cycles) return;
  if (chartInstance) chartInstance.destroy();

  const years = Object.keys(sortedCycles.value).map(Number);
  const energyLevels = years.map(year => sortedCycles.value[year].energyLevel);
  const numbers = years.map(year => sortedCycles.value[year].number);

  const ctx = cycleChart.value.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(20, 184, 166, 0.8)');
  gradient.addColorStop(1, 'rgba(20, 184, 166, 0.1)');

  chartInstance = new Chart(cycleChart.value, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'Mức năng lượng',
        data: energyLevels,
        borderColor: '#0d9488',
        backgroundColor: gradient,
        fill: true,
        tension: 0.3,
        borderWidth: 3,
        pointBackgroundColor: (context) => getPointColor(numbers[context.dataIndex]),
        pointBorderColor: '#fff',
        pointHoverRadius: 8,
        pointRadius: 5,
        pointHitRadius: 10
      }]
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
                `Năng lượng: ${context.raw}/10`,
                description
              ];
            }
          }
        },
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              yMin: 5,
              yMax: 5,
              borderColor: '#6b7280',
              borderWidth: 2,
              borderDash: [5, 5],
              label: {
                content: 'Trung bình (5)',
                enabled: true,
                position: 'end',
                backgroundColor: '#6b7280',
                color: '#fff'
              }
            },
            lowBand: {
              type: 'box',
              yMin: 1,
              yMax: 4,
              backgroundColor: 'rgba(255, 99, 132, 0.1)',
              borderColor: 'rgba(255, 99, 132, 0.3)',
              borderWidth: 1
            },
            mediumBand: {
              type: 'box',
              yMin: 4,
              yMax: 7,
              backgroundColor: 'rgba(255, 206, 86, 0.1)',
              borderColor: 'rgba(255, 206, 86, 0.3)',
              borderWidth: 1
            },
            highBand: {
              type: 'box',
              yMin: 7,
              yMax: 10,
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              borderColor: 'rgba(75, 192, 192, 0.3)',
              borderWidth: 1
            }
          }
        }
      },
      scales: {
        y: {
          min: 1,
          max: 10,
          ticks: {
            stepSize: 1,
            callback: (value) => {
              const labels = {
                1: 'Rất thấp',
                4: 'Trung bình thấp',
                5: 'Trung bình',
                7: 'Cao',
                8: 'Rất cao',
                10: 'Cực cao'
              };
              return labels[value] || value;
            }
          },
          title: {
            display: true,
            text: 'Mức năng lượng',
            color: '#4b5563'
          },
          grid: { color: '#e5e7eb' }
        },
        x: {
          title: {
            display: true,
            text: 'Năm cá nhân',
            color: '#4b5563'
          },
          grid: { display: false },
          ticks: {
            maxTicksLimit: 16,
            rotation: 45
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      onHover: (event, chartElement) => {
        highlightedYear.value = chartElement.length ? years[chartElement[0].index] : null;
      },
      onClick: (event, chartElement) => {
        if (chartElement.length) {
          const year = years[chartElement[0].index];
          selectedYear.value = year;
          if (isMobile.value) expandedYears.value = [year];
        }
      }
    }
  });
};

// Gọi API lấy dữ liệu
const fetchNumerologyData = async () => {
  if (!props.birthDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) return;
  loading.value = true;
  numerologyData.value = null;

  try {
    // Giả lập API
    await new Promise(resolve => setTimeout(resolve, 800));
    const [day, month] = props.birthDate.split('/').map(Number);
    const currentYear = new Date().getFullYear();
    const cycles = {};

    for (let i = -3; i <= 12; i++) {
      const year = currentYear + i;
      const number = calculatePersonalYear(day, month, year);
      const energyLevel = energyLevelMap[number] || 5;
      cycles[year] = generateYearData(year, number, energyLevel);
    }

    numerologyData.value = { cycles };
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu:', err);
  } finally {
    loading.value = false;
  }
};

// Tạo dữ liệu mẫu cho năm
const generateYearData = (year, number, energyLevel) => {
  const descriptions = {
    1: `Năm ${year} mang năng lượng khởi đầu mạnh mẽ, lý tưởng để bắt đầu dự án mới.`,
    2: `Năm ${year} tập trung vào hợp tác và xây dựng mối quan hệ bền vững.`,
    3: `Năm ${year} tràn đầy sáng tạo, khuyến khích thể hiện bản thân.`,
    4: `Năm ${year} xây dựng nền tảng vững chắc thông qua làm việc chăm chỉ.`,
    5: `Năm ${year} mang đến thay đổi, mở ra cơ hội mới và năng động.`,
    6: `Năm ${year} nhấn mạnh gia đình và trách nhiệm, tạo sự hài hòa.`,
    7: `Năm ${year} khuyến khích nội tâm, suy ngẫm và phát triển tâm linh.`,
    8: `Năm ${year} là thời điểm thành công, tận dụng tham vọng để đạt mục tiêu.`,
    9: `Năm ${year} đánh dấu hoàn thiện, chia sẻ và chuẩn bị cho chu kỳ mới.`,
    11: `Năm ${year} mang năng lượng tâm linh, phát triển trực giác và sáng tạo.`,
    22: `Năm ${year} lý tưởng cho các dự án lớn, xây dựng tầm vóc.`
  };

  const strengths = {
    1: ['Tinh thần tiên phong', 'Quyết đoán', 'Sáng tạo'],
    2: ['Hợp tác tốt', 'Nhạy bén giao tiếp', 'Kiên nhẫn'],
    3: ['Biểu đạt tốt', 'Tích cực', 'Lạc quan'],
    4: ['Kỷ luật', 'Tổ chức tốt', 'Kiên trì'],
    5: ['Linh hoạt', 'Phiêu lưu', 'Thích nghi nhanh'],
    6: ['Trách nhiệm', 'Yêu thương', 'Chăm sóc'],
    7: ['Trực giác mạnh', 'Phân tích sâu', 'Sâu sắc'],
    8: ['Tham vọng', 'Lãnh đạo', 'Tư duy kinh doanh'],
    9: ['Nhân ái', 'Tầm nhìn rộng', 'Bao dung'],
    11: ['Trực giác cao', 'Sáng tạo', 'Cảm hứng'],
    22: ['Tầm nhìn chiến lược', 'Xây dựng tốt', 'Bền bỉ']
  };

  const weaknesses = {
    1: ['Thiếu kiên nhẫn', 'Độc đoán', 'Cứng nhắc'],
    2: ['Dễ bị ảnh hưởng', 'Thiếu quyết đoán', 'Nhạy cảm quá'],
    3: ['Dễ phân tâm', 'Thiếu tập trung', 'Nói nhiều hơn làm'],
    4: ['Cứng nhắc', 'Bảo thủ', 'Thiếu linh hoạt'],
    5: ['Bốc đồng', 'Thiếu kiên định', 'Khó gắn bó'],
    6: ['Hy sinh quá mức', 'Lo lắng nhiều', 'Dễ bị lợi dụng'],
    7: ['Cô lập', 'Hoài nghi', 'Quá phân tích'],
    8: ['Áp lực cao', 'Tham vọng quá', 'Coi trọng vật chất'],
    9: ['Dễ xúc động', 'Khó buông bỏ', 'Mơ mộng viển vông'],
    11: ['Nhạy cảm quá', 'Dễ tổn thương', 'Thiếu thực tế'],
    22: ['Áp lực lớn', 'Cầu toàn', 'Dễ kiệt sức']
  };

  const advice = {
    1: ['Tập trung mục tiêu dài hạn', 'Lắng nghe ý kiến', 'Kiên nhẫn'],
    2: ['Phát triển mối quan hệ', 'Tin trực giác', 'Cân bằng cảm xúc'],
    3: ['Tận dụng sáng tạo', 'Chia sẻ tài năng', 'Giữ kỷ luật'],
    4: ['Xây dựng nền tảng', 'Lập kế hoạch', 'Kiên trì'],
    5: ['Đón nhận thay đổi', 'Kiểm soát rủi ro', 'Giữ mục tiêu'],
    6: ['Cân bằng gia đình', 'Đặt ranh giới', 'Chăm sóc bản thân'],
    7: ['Tĩnh lặng suy ngẫm', 'Phát triển tâm linh', 'Chia sẻ ý tưởng'],
    8: ['Tập trung mục tiêu lớn', 'Quản lý căng thẳng', 'Cân bằng vật chất'],
    9: ['Chia sẻ kinh nghiệm', 'Buông bỏ quá khứ', 'Chuẩn bị mới'],
    11: ['Phát triển trực giác', 'Thể hiện sáng tạo', 'Kết nối tâm linh'],
    22: ['Tập trung dự án lớn', 'Quản lý năng lượng', 'Tìm hỗ trợ']
  };

  return {
    number,
    description: descriptions[number] || `Năm ${year} với số ${number}.`,
    energyLevel,
    strengths: strengths[number] || [],
    weaknesses: weaknesses[number] || [],
    advice: advice[number] || []
  };
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', handleResize);
  fetchNumerologyData();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (chartInstance) chartInstance.destroy();
});

// Theo dõi birthDate
watch(() => props.birthDate, fetchNumerologyData);

// Theo dõi numerologyData để vẽ biểu đồ
watch(numerologyData, () => {
  if (numerologyData.value?.cycles) {
    nextTick(createCycleChart);
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

.accordion-slide-enter-active,
.accordion-slide-leave-active {
  transition: all 0.3s ease;
}
.accordion-slide-enter-from,
.accordion-slide-leave-to {
  height: 0;
  opacity: 0;
  overflow: hidden;
}

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

@media (max-width: 640px) {
  .p-6 {
    padding: 1rem;
  }
  .text-3xl {
    font-size: 1.5rem;
  }
}
</style>
