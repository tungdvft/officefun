<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header với gradient -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-white bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">Thần số học chu kỳ vận số</h2>
          <p class="text-teal-100 mt-1">Khám phá chu kỳ vận số tương lai của bạn</p>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Form nhập liệu -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="name" class="form-label">Họ và tên</label>
          <input v-model="formData.name" type="text" id="name" placeholder="Nguyễn Văn A" class="form-input" />
        </div>
        <div>
          <label for="birthdate" class="form-label">Ngày sinh (dd/mm/yyyy)</label>
          <div class="relative">
            <input v-model="formData.birthdate" type="text" id="birthdate" placeholder="15/03/1995" class="form-input pl-10" />
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Giới tính</label>
        <div class="flex space-x-6">
          <label class="radio-option">
            <input type="radio" v-model="formData.gender" value="male" class="radio-input" />
            <span class="radio-label">Nam</span>
          </label>
          <label class="radio-option">
            <input type="radio" v-model="formData.gender" value="female" class="radio-input" />
            <span class="radio-label">Nữ</span>
          </label>
        </div>
      </div>

      <button @click="generateReport" :disabled="loading" class="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none">
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang phân tích...
        </span>
        <span v-else>Xem báo cáo chu kỳ vận số</span>
      </button>

      <!-- Nội dung chu kỳ vận số -->
      <transition name="fade-slide">
        <div v-if="numerologyData" class="mt-6">
          <div class="space-y-6">
            <!-- Biểu đồ chu kỳ vận số -->
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 class="text-xl font-bold text-teal-800 mb-4">Biểu đồ chu kỳ vận số</h3>
              <ClientOnly>
                <canvas ref="cycleChart"></canvas>
              </ClientOnly>
            </div>
            <!-- Danh sách các năm -->
            <div v-for="focus in numerologyData.focusAreas" :key="focus.year" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div class="flex items-center mb-4">
                <span class="w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold mr-3">{{ focus.year }}</span>
                <h4 class="text-lg font-semibold text-gray-800">Năm {{ focus.year }}</h4>
              </div>
              <div class="prose prose-teal max-w-none">
                <p class="text-gray-700">{{ numerologyData.cycles[focus.year].description }}</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p class="font-medium text-teal-700">Trọng tâm:</p>
                    <p class="text-gray-700">{{ focus.focus }}</p>
                  </div>
                  <div>
                    <p class="font-medium text-teal-700">Từ khóa:</p>
                    <p class="text-gray-700">{{ focus.keyword }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { toast } from 'vue3-toastify';
import Chart from 'chart.js/auto';

const formData = ref({
  name: '',
  birthdate: '',
  gender: 'male'
});
const numerologyData = ref(null);
const loading = ref(false);
const cycleChart = ref(null);
let chartInstance = null;

// Tạo biểu đồ chu kỳ vận số
const createCycleChart = () => {
  if (!process.client || !numerologyData.value || !cycleChart.value || !numerologyData.value.cycles) return;

  if (chartInstance) chartInstance.destroy();

  const years = Object.keys(numerologyData.value.cycles);
  const numbers = years.map(year => numerologyData.value.cycles[year].number);

  chartInstance = new Chart(cycleChart.value, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Số cá nhân',
          data: numbers,
          borderColor: '#14B8A6',
          backgroundColor: 'rgba(20, 184, 166, 0.2)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#14B8A6',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#14B8A6'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `Số ${context.raw}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 11,
          title: { display: true, text: 'Số cá nhân' }
        },
        x: {
          title: { display: true, text: 'Năm' }
        }
      }
    }
  });
};

// Theo dõi khi dữ liệu thay đổi để vẽ biểu đồ
watch(numerologyData, () => {
  if (numerologyData.value && numerologyData.value.cycles) {
    setTimeout(() => createCycleChart(), 100); // Đợi DOM render
  }
});

// Hàm format ngày sinh từ "dd-mm-yyyy" sang "dd/mm/yyyy"
const formatBirthdate = (birthdate) => {
  if (!birthdate) return '';
  return birthdate.replace(/-/g, '/');
};

const generateReport = async () => {
  if (!formData.value.name) {
    toast.error('Vui lòng nhập họ và tên!');
    return;
  }
  if (!formData.value.birthdate) {
    toast.error('Vui lòng nhập ngày sinh!');
    return;
  }
  if (!formData.value.gender) {
    toast.error('Vui lòng chọn giới tính!');
    return;
  }

  const formattedBirthdate = formatBirthdate(formData.value.birthdate);

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formattedBirthdate)) {
    toast.error('Ngày sinh không đúng định dạng (dd/mm/yyyy)!');
    return;
  }

  loading.value = true;
  try {
    const response = await $fetch('/api/numerology/full', {
      method: 'POST',
      body: { name: formData.value.name, birthdate: formattedBirthdate, gender: formData.value.gender }
    });

    numerologyData.value = response.numerology;
    toast.success('Tạo báo cáo chu kỳ vận số hoàn tất!');
  } catch (error) {
    console.error('Error fetching numerology data:', error);
    toast.error('Không thể tạo báo cáo từ API, sử dụng dữ liệu mẫu!');
    numerologyData.value = {
      cycles: {
        2025: { number: 1, description: 'Năm 2025 mang chủ đề khởi đầu mới. Đây là thời điểm để bạn bắt đầu các dự án mới, thử nghiệm ý tưởng sáng tạo và khẳng định sự độc lập của mình. Năng lượng của năm này khuyến khích sự tự tin và hành động quyết đoán.', focus: ['Khởi đầu', 'Sáng tạo', 'Độc lập'], keywords: ['Bắt đầu', 'Đổi mới', 'Lãnh đạo', 'Tự tin', 'Cơ hội'] },
        2026: { number: 2, description: 'Năm 2026 tập trung vào hợp tác và cân bằng. Đây là thời gian để xây dựng mối quan hệ, lắng nghe trực giác và duy trì sự hài hòa trong cuộc sống. Bạn sẽ học cách kiên nhẫn và làm việc nhóm hiệu quả.', focus: ['Hợp tác', 'Cân bằng', 'Kiên nhẫn'], keywords: ['Hài hòa', 'Đồng đội', 'Nhạy cảm', 'Kiên trì', 'Hỗ trợ'] },
        2027: { number: 3, description: 'Năm 2027 là năm của sự sáng tạo và giao tiếp. Bạn sẽ tìm thấy niềm vui trong việc thể hiện bản thân qua nghệ thuật, viết lách hoặc các hoạt động xã hội. Đây là thời điểm để tận hưởng sự năng động và kết nối.', focus: ['Sáng tạo', 'Giao tiếp', 'Vui vẻ'], keywords: ['Biểu đạt', 'Năng động', 'Vui vẻ', 'Tưởng tượng', 'Kết nối'] },
        2028: { number: 4, description: 'Năm 2028 tập trung vào xây dựng nền tảng vững chắc. Bạn sẽ làm việc chăm chỉ để tổ chức cuộc sống, thiết lập cấu trúc và đạt được sự ổn định trong sự nghiệp hoặc gia đình.', focus: ['Ổn định', 'Kỷ luật', 'Công việc'], keywords: ['Cấu trúc', 'Kiên trì', 'Thực tế', 'Tổ chức', 'Thành công'] },
        2029: { number: 5, description: 'Năm 2029 mang năng lượng thay đổi và tự do. Đây là thời gian để bạn khám phá những cơ hội mới, chấp nhận rủi ro và trải nghiệm sự linh hoạt trong cuộc sống.', focus: ['Thay đổi', 'Tự do', 'Phiêu lưu'], keywords: ['Linh hoạt', 'Khám phá', 'Tự do', 'Đa dạng', 'Năng động'] },
        2030: { number: 6, description: 'Năm 2030 là năm của trách nhiệm và gia đình. Bạn sẽ tập trung vào việc chăm sóc người thân yêu, xây dựng sự hài hòa và đảm nhận vai trò lãnh đạo trong cộng đồng.', focus: ['Gia đình', 'Trách nhiệm', 'Chăm sóc'], keywords: ['Yêu thương', 'Hài hòa', 'Trách nhiệm', 'Chăm sóc', 'Cân bằng'] },
        2031: { number: 7, description: 'Năm 2031 khuyến khích tìm kiếm sự thật và nội tâm. Đây là thời điểm để bạn suy ngẫm, học hỏi và phát triển trực giác, tập trung vào sự phát triển tâm linh hoặc tri thức.', focus: ['Nội tâm', 'Tìm kiếm', 'Học hỏi'], keywords: ['Suy ngẫm', 'Trực giác', 'Tâm linh', 'Hiểu biết', 'Tĩnh lặng'] },
        2032: { number: 8, description: 'Năm 2032 là năm của thành công và quyền lực. Bạn sẽ có cơ hội đạt được những mục tiêu lớn, quản lý tài chính hiệu quả và khẳng định vị thế trong công việc.', focus: ['Thành công', 'Quyền lực', 'Tài chính'], keywords: ['Tham vọng', 'Thành tựu', 'Quyền lực', 'Tự tin', 'Tổ chức'] },
        2033: { number: 9, description: 'Năm 2033 đánh dấu sự hoàn thiện và vị tha. Đây là thời gian để bạn chia sẻ kinh nghiệm, kết thúc một chu kỳ và chuẩn bị cho sự khởi đầu mới với tinh thần nhân đạo.', focus: ['Hoàn thiện', 'Vị tha', 'Chia sẻ'], keywords: ['Nhân đạo', 'Kết thúc', 'Vị tha', 'Chia sẻ', 'Tâm linh'] },
        2034: { number: 1, description: 'Năm 2034 khởi đầu chu kỳ mới với năng lượng sáng tạo. Bạn sẽ cảm thấy tràn đầy động lực để bắt đầu lại, thử nghiệm ý tưởng mới và dẫn dắt bản thân theo hướng đi riêng.', focus: ['Khởi đầu', 'Sáng tạo', 'Độc lập'], keywords: ['Bắt đầu', 'Đổi mới', 'Lãnh đạo', 'Tự tin', 'Cơ hội'] }
      },
      focusAreas: [
        { year: '2025', focus: 'Khởi đầu', keyword: 'Bắt đầu' },
        { year: '2026', focus: 'Hợp tác', keyword: 'Hài hòa' },
        { year: '2027', focus: 'Sáng tạo', keyword: 'Biểu đạt' },
        { year: '2028', focus: 'Ổn định', keyword: 'Cấu trúc' },
        { year: '2029', focus: 'Thay đổi', keyword: 'Linh hoạt' },
        { year: '2030', focus: 'Gia đình', keyword: 'Yêu thương' },
        { year: '2031', focus: 'Nội tâm', keyword: 'Suy ngẫm' },
        { year: '2032', focus: 'Thành công', keyword: 'Tham vọng' },
        { year: '2033', focus: 'Hoàn thiện', keyword: 'Nhân đạo' },
        { year: '2034', focus: 'Khởi đầu', keyword: 'Bắt đầu' }
      ]
    };
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.form-label {
  @apply block text-gray-700 font-medium mb-2;
}
.form-input {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors;
}
.form-group {
  @apply space-y-2;
}
.radio-option {
  @apply flex items-center;
}
.radio-input {
  @apply mr-2;
}
.radio-label {
  @apply text-gray-700;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>