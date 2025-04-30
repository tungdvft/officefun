<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-6">
      <!-- Nội dung chu kỳ vận số tháng -->
      <transition name="fade-slide">
        <div v-if="monthData && monthData.length" class="mt-6">
          <div class="space-y-6">
            <!-- Bảng chu kỳ tháng -->
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 class="text-xl font-bold text-teal-800 mb-4">Chu Kỳ Vận Số Tháng ({{ monthData[0].month }}/{{ monthData[0].year }}–{{ monthData[2].month }}/{{ monthData[2].year }})</h3>
              <table class="result w-full text-center">
                <tbody>
                  <tr v-for="(month, index) in monthData" :key="index">
                    <td class="tt py-2 px-4 border-b border-gray-200">Tháng {{ month.month }}/{{ month.year }}</td>
                    <td class="tn py-2 px-4 border-b border-gray-200 text-teal-600 font-bold">{{ month.number }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Luận giải chu kỳ tháng -->
            <div class="space-y-6">
              <h3 class="text-xl font-bold text-teal-800">Luận Giải Chu Kỳ Vận Số Tháng</h3>
              <div v-for="(month, index) in monthData" :key="index" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div class="flex items-center mb-4">
                  <span class="w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold mr-3">{{ month.month }}/{{ month.year }}</span>
                  <h4 class="text-lg font-semibold text-gray-800">Số {{ month.number }}</h4>
                </div>
                <div class="prose prose-teal max-w-none">
                  <p class="text-gray-700"><strong>Những gì có khả năng xảy ra:</strong> {{ month.events }}</p>
                  <p class="text-gray-700"><strong>Nên tập trung làm gì:</strong> {{ month.focus }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="loading" class="text-center text-gray-600">Đang tải dữ liệu...</div>
        <div v-else class="text-center text-red-600">Không có dữ liệu chu kỳ vận số tháng.</div>
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
.result {
  border-collapse: collapse;
}
.tt {
  font-weight: 500;
  color: #4B5563;
}
.tn {
  color: #14B8A6;
}
</style>