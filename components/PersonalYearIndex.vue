<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-6">
      <!-- Tiêu đề -->
      <h2 class="text-2xl font-bold text-teal-800">Chu Kỳ Vận Số Cá Nhân</h2>

      <!-- Bảng chỉ số năm -->
      <transition name="fade-slide">
        <div v-if="yearData && yearData.length" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-bold text-teal-800 mb-4">Chỉ Số Năm ({{ yearData[0].year }}–{{ yearData[2].year }})</h3>
          <table class="result w-full text-center">
            <tbody>
              <tr v-for="(year, index) in yearData" :key="index">
                <td class="tt py-2 px-4 border-b border-gray-200">{{ year.year }}</td>
                <td class="tn py-2 px-4 border-b border-gray-200 text-teal-600 font-bold">{{ year.number }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="loading" class="text-center text-gray-600">Đang tải dữ liệu...</div>
        <div v-else class="text-center text-red-600">Không có dữ liệu chu kỳ vận số.</div>
      </transition>

      <!-- Giải thích chi tiết -->
      <div v-if="yearData && yearData.length" class="space-y-6">
        <h3 class="text-xl font-bold text-teal-800">Luận Giải Chu Kỳ Vận Số (VIP)</h3>
        <div v-for="(year, index) in yearData" :key="index" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div class="flex items-center mb-4">
            <span class="w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold mr-3">{{ year.year }}</span>
            <h4 class="text-lg font-semibold text-gray-800">Số {{ year.number }}</h4>
          </div>
          <div class="prose prose-teal max-w-none">
            <p class="text-gray-700"><strong>Ý nghĩa:</strong> {{ year.meaning }}</p>
            <p class="text-gray-700"><strong>Cơ hội:</strong> {{ year.opportunities }}</p>
            <p class="text-gray-700"><strong>Thách thức:</strong> {{ year.challenges }}</p>
            <p class="text-gray-700"><strong>Đi theo hướng nào:</strong> {{ year.direction }}</p>
            <p class="text-gray-700"><strong>Lời khuyên:</strong> {{ year.advice }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import personalYearData from '~/data/PersonalYearData.json'; // Giả định file JSON

const props = defineProps({
  birthDate: {
    type: String,
    default: ''
  }
});

const yearData = ref(null);
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

// Lấy và xử lý dữ liệu chu kỳ vận số
const fetchPersonalYearData = async () => {
  console.log('fetchPersonalYearData called with birthDate:', props.birthDate);

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
    year > 2025
  ) {
    toast.error('Ngày sinh không hợp lệ!');
    return;
  }

  loading.value = true;
  yearData.value = null;

  try {
    // Lấy năm hiện tại
    const currentYear = new Date().getFullYear();
    console.log('Current year:', currentYear);

    // Tính số năm cá nhân cho 3 năm từ năm hiện tại
    const years = [];
    for (let y = currentYear; y < currentYear + 3; y++) {
      const number = calculatePersonalYear(day, month, y);
      const yearInfo = personalYearData.personal_years.find((item) => item.number === number);
      if (!yearInfo) {
        throw new Error(`Không tìm thấy dữ liệu cho số năm ${number}`);
      }
      years.push({
        year: y,
        number,
        ...yearInfo
      });
    }

    yearData.value = years;
    console.log('Dữ liệu chu kỳ vận số:', yearData.value);
    toast.success('Tạo báo cáo chu kỳ vận số hoàn tất!');
  } catch (err) {
    console.error('Lỗi trong fetchPersonalYearData:', err);
    toast.error('Không thể lấy dữ liệu: ' + err.message);
    // Dữ liệu mẫu (dựa trên 07/02/1996, giả lập năm hiện tại là 2025)
    yearData.value = [
      {
        year: 2025,
        number: 9,
        meaning: 'Kết thúc chu kỳ, nhân đạo, cống hiến.',
        opportunities: 'Giúp đỡ cộng đồng, hoàn thiện bản thân, buông bỏ quá khứ.',
        challenges: 'Cảm giác mất mát, khó buông tay.',
        advice: 'Chấp nhận kết thúc, cống hiến cho điều lớn lao hơn, chuẩn bị cho chu kỳ mới.',
        direction: 'Hoàn thành các dự án dang dở, tham gia hoạt động từ thiện hoặc cộng đồng, viết nhật ký để nhìn lại và buông bỏ những gì không còn phù hợp.'
      },
      {
        year: 2026,
        number: 1,
        meaning: 'Bắt đầu chu kỳ mới, độc lập, lãnh đạo.',
        opportunities: 'Khởi đầu dự án mới, phát triển cá nhân, khẳng định bản thân.',
        challenges: 'Đối mặt với sự nghi ngờ bản thân, áp lực phải dẫn đầu.',
        advice: 'Tập trung vào mục tiêu cá nhân, dám bước ra khỏi vùng an toàn, tin vào khả năng lãnh đạo của bạn.',
        direction: 'Lập kế hoạch khởi nghiệp hoặc dự án cá nhân, tham gia khóa học kỹ năng mới (như lãnh đạo, marketing), thử sức ở một lĩnh vực chưa từng làm.'
      },
      {
        year: 2027,
        number: 2,
        meaning: 'Hợp tác, nhạy bén, cân bằng.',
        opportunities: 'Xây dựng mối quan hệ, làm việc nhóm, phát triển trực giác.',
        challenges: 'Cảm xúc dễ dao động, khó đưa ra quyết định.',
        advice: 'Lắng nghe trực giác, học cách kiên nhẫn, ưu tiên hòa hợp trong các mối quan hệ.',
        direction: 'Tham gia nhóm làm việc hoặc dự án cộng tác, tìm đối tác kinh doanh, học kỹ năng giao tiếp hoặc đàm phán để xây dựng mạng lưới quan hệ.'
      }
    ];
  } finally {
    loading.value = false;
  }
};

// Theo dõi birthDate
watch(() => props.birthDate, (newValue) => {
  console.log('watch birthDate triggered:', newValue);
  if (newValue && /^\d{2}\/\d{2}\/\d{4}$/.test(newValue)) {
    fetchPersonalYearData();
  } else {
    console.log('birthDate không hợp lệ khi watch:', newValue);
  }
});

// Gọi khi mount
onMounted(() => {
  console.log('Component mounted, birthDate:', props.birthDate);
  if (props.birthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    fetchPersonalYearData();
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