<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-8">
      <!-- Header section -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-teal-700 mb-2">Chu Kỳ Vận Số Tháng</h2>
        <p class="text-gray-600">Dự đoán năng lượng và cơ hội trong 3 tháng tới</p>
      </div>

      <transition name="fade-slide">
        <!-- Main content -->
        <div v-if="monthData && monthData.length">
          <!-- Timeline overview -->
          <div class="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl border border-teal-100 shadow-sm mb-8">
            <h3 class="text-xl font-bold text-teal-800 mb-6 text-center">
              Chu Kỳ {{ monthData[0].month }}/{{ monthData[0].year }} – {{ monthData[2].month }}/{{ monthData[2].year }}
            </h3>
            
            <div class="flex flex-col md:flex-row justify-between items-center">
              <div v-for="(month, index) in monthData" :key="index" 
                   class="relative flex-1 flex flex-col items-center mb-4 md:mb-0">
                <!-- Timeline connector -->
                <div v-if="index < 2" class="hidden md:block absolute top-1/2 left-2/3 w-1/3 h-1 bg-teal-300"></div>
                
                <!-- Month card -->
                <div class="w-20 h-20 rounded-full bg-white border-4 flex items-center justify-center shadow-md"
                     :class="{
                       'border-teal-500': index === 0,
                       'border-purple-500': index === 1,
                       'border-amber-500': index === 2
                     }">
                  <div class="text-center">
                    <div class="text-2xl font-bold" 
                         :class="{
                           'text-teal-600': index === 0,
                           'text-purple-600': index === 1,
                           'text-amber-600': index === 2
                         }">
                      {{ month.number }}
                    </div>
                    <div class="text-xs text-gray-500">{{ month.month }}/{{ month.year }}</div>
                  </div>
                </div>
                
                <div class="mt-2 text-sm font-medium text-gray-700">
                  Tháng {{ month.month }}
                </div>
              </div>
            </div>
          </div>

          <!-- Detailed monthly analysis -->
          <div class="space-y-6">
            <h3 class="text-2xl font-bold text-teal-700 mb-2 text-center">Luận Giải Chi Tiết</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div v-for="(month, index) in monthData" :key="index" 
                   class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
                <!-- Month header -->
                <div class="px-6 py-4 border-b border-gray-100 flex items-center"
                     :class="{
                       'bg-teal-50': index === 0,
                       'bg-purple-50': index === 1,
                       'bg-amber-50': index === 2
                     }">
                  <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4"
                       :class="{
                         'bg-teal-500': index === 0,
                         'bg-purple-500': index === 1,
                         'bg-amber-500': index === 2
                       }">
                    {{ month.month }}
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-gray-800">Tháng {{ month.month }}/{{ month.year }}</h4>
                    <p class="text-sm text-gray-500">Số {{ month.number }}</p>
                  </div>
                </div>
                
                <!-- Month content -->
                <div class="p-6 space-y-4">
                  <div>
                    <div class="flex items-start">
                      <svg class="flex-shrink-0 w-5 h-5 mt-0.5 mr-2" 
                           :class="{
                             'text-teal-500': index === 0,
                             'text-purple-500': index === 1,
                             'text-amber-500': index === 2
                           }" 
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      <div>
                        <h5 class="font-medium text-gray-800 mb-1">Năng lượng chủ đạo</h5>
                        <p class="text-sm text-gray-600 leading-relaxed">{{ month.events }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="pt-3 border-t border-gray-100">
                    <div class="flex items-start">
                      <svg class="flex-shrink-0 w-5 h-5 mt-0.5 mr-2" 
                           :class="{
                             'text-teal-500': index === 0,
                             'text-purple-500': index === 1,
                             'text-amber-500': index === 2
                           }" 
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                      <div>
                        <h5 class="font-medium text-gray-800 mb-1">Lời khuyên</h5>
                        <p class="text-sm text-gray-600 leading-relaxed">{{ month.focus }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading state -->
        <div v-else-if="loading" class="text-center py-12">
          <div class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-600 text-lg">Đang phân tích chu kỳ tháng...</span>
          </div>
        </div>
        
        <!-- Error state -->
        <div v-else class="text-center py-12 bg-red-50 rounded-lg">
          <div class="inline-flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h4 class="text-red-600 font-medium text-lg mb-1">Không có dữ liệu</h4>
            <p class="text-gray-600">Vui lòng nhập ngày sinh để xem chu kỳ vận số tháng</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import personalMonthData from '~/data/PersonalMonthData.json'; // Giả định file JSON tháng

const props = defineProps({
  birthDate: { type: String, default: '' }
});

const monthData = ref([]);
const loading = ref(false);

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

// Tính số tháng cá nhân
const calculatePersonalMonth = (personalYear, month) => {
  const sum = personalYear + month;
  if ([11, 22].includes(sum)) return sum;
  let result = sum;
  while (result > 9) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result;
};

// Lấy dữ liệu chu kỳ vận số tháng
const fetchMonthData = async () => {
  console.log('fetchMonthData called with birthDate:', props.birthDate);

  if (!props.birthDate) {
    toast.error('Vui lòng nhập ngày sinh!');
    return;
  }

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    toast.error('Ngày sinh không đúng định dạng (DD/MM/YYYY)!');
    return;
  }

  const [day, month, year] = props.birthDate.split('/').map(Number);
  const dateObj = new Date(year, month - 1, day);
  if (
    dateObj.getDate() !== day ||
    dateObj.getMonth() + 1 !== month ||
    year < 1900 ||
    year > new Date().getFullYear()
  ) {
    toast.error('Ngày sinh không hợp lệ!');
    return;
  }

  loading.value = true;
  monthData.value = [];

  try {
    // Lấy năm và tháng hiện tại
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1–12
    console.log('Current year:', currentYear, 'Current month:', currentMonth);

    // Tính chu kỳ tháng
    const months = [];
    let year = currentYear;
    let month = currentMonth;
    for (let i = 0; i < 3; i++) {
      const personalYear = calculatePersonalYear(day, month, year);
      const personalMonth = calculatePersonalMonth(personalYear, month);
      const monthInfo = personalMonthData.personal_months.find((item) => item.number === personalMonth) || {
        events: `Tháng ${month}/${year} với số ${personalMonth}.`,
        focus: 'Tập trung vào mục tiêu ngắn hạn và duy trì sự cân bằng.'
      };
      months.push({
        year,
        month,
        number: personalMonth,
        events: monthInfo.events,
        focus: monthInfo.focus
      });
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }

    monthData.value = months;
    console.log('Dữ liệu chu kỳ vận số tháng:', monthData.value);
    toast.success('Tạo báo cáo chu kỳ vận số tháng hoàn tất!');
  } catch (err) {
    console.error('Lỗi trong fetchMonthData:', err);
    toast.warn('Không thể lấy dữ liệu, sử dụng dữ liệu mẫu!');
    // Dữ liệu mẫu (dựa trên 07/02/1996, 4/2025: 4, 5/2025: 5, 6/2025: 6)
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const months = [];
    const sampleMonthData = {
      '2025-4': {
        number: 4,
        events: 'Công việc ổn định hơn, cơ hội tổ chức và xây dựng nền tảng vững chắc. Có thể đối mặt với khối lượng công việc lớn hoặc cần sắp xếp lại cuộc sống.',
        focus: 'Lập kế hoạch chi tiết cho công việc và tài chính. Hoàn thành các nhiệm vụ đang dở. Tập trung vào kỷ luật và tổ chức.'
      },
      '2025-5': {
        number: 5,
        events: 'Thay đổi bất ngờ, cơ hội mới trong công việc hoặc mối quan hệ. Có thể xuất hiện cơ hội du lịch hoặc trải nghiệm mới.',
        focus: 'Thử nghiệm ý tưởng mới, linh hoạt với thay đổi. Tận dụng cơ hội để học hỏi và mở rộng mạng lưới quan hệ.'
      },
      '2025-6': {
        number: 6,
        events: 'Tập trung vào gia đình và các mối quan hệ. Có thể phải giải quyết trách nhiệm cá nhân hoặc hỗ trợ người thân.',
        focus: 'Chăm sóc người thân, tạo môi trường hài hòa. Dành thời gian xây dựng các mối quan hệ bền vững.'
      }
    };
    let year = currentYear;
    let month = currentMonth;
    for (let i = 0; i < 3; i++) {
      const key = `${year}-${month}`;
      const personalYear = calculatePersonalYear(day, month, year);
      const personalMonth = calculatePersonalMonth(personalYear, month);
      const monthInfo = sampleMonthData[key] || {
        number: personalMonth,
        events: `Tháng ${month}/${year} với số ${personalMonth}.`,
        focus: 'Tập trung vào mục tiêu ngắn hạn và duy trì sự cân bằng.'
      };
      months.push({
        year,
        month,
        number: monthInfo.number,
        events: monthInfo.events,
        focus: monthInfo.focus
      });
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }
    monthData.value = months;
  } finally {
    loading.value = false;
  }
};

// Theo dõi birthDate để gọi dữ liệu
watch(() => props.birthDate, (newValue) => {
  console.log('watch birthDate triggered:', newValue);
  if (newValue && /^\d{2}\/\d{2}\/\d{4}$/.test(newValue)) {
    fetchMonthData();
  }
});

// Gọi khi component mount
onMounted(() => {
  console.log('Component mounted, birthDate:', props.birthDate);
  if (props.birthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    fetchMonthData();
  }
});
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

/* Animation for cards */
.card-enter-active {
  transition: all 0.3s ease;
  transition-delay: calc(0.1s * var(--i));
}
.card-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>