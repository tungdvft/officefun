<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-6">
      <!-- Nội dung chu kỳ vận số -->
      <transition name="fade-slide">
        <div v-if="numerologyData && Object.keys(numerologyData.cycles).length" class="mt-6">
          <div class="space-y-6">
            <!-- Biểu đồ chu kỳ vận số -->
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 class="text-xl font-bold text-teal-800 mb-4">Biểu đồ chu kỳ vận số</h3>
              <ClientOnly>
                <canvas ref="cycleChart"></canvas>
              </ClientOnly>
            </div>
            <!-- Danh sách các năm -->
            <div v-for="year in Object.keys(numerologyData.cycles)" :key="year" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div class="flex items-center mb-4">
                <span class="w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold mr-3">{{ year }}</span>
                <h4 class="text-lg font-semibold text-gray-800">Năm {{ year }}</h4>
              </div>
              <div class="prose prose-teal max-w-none">
                <p class="text-gray-700"><strong>Số cá nhân: {{ numerologyData.cycles[year].number }}</strong></p>
                <p class="text-gray-700">{{ numerologyData.cycles[year].description }}</p>
                <p class="text-gray-700"><strong>Điểm mạnh:</strong></p>
                <ul>
                  <li v-for="(strength, index) in numerologyData.cycles[year].strengths" :key="index">{{ strength }}</li>
                </ul>
                <p class="text-gray-700"><strong>Điểm yếu:</strong></p>
                <ul>
                  <li v-for="(weakness, index) in numerologyData.cycles[year].weaknesses" :key="index">{{ weakness }}</li>
                </ul>
                <p class="text-gray-700"><strong>Lời khuyên:</strong></p>
                <ul>
                  <li v-for="(advice, index) in numerologyData.cycles[year].advice" :key="index">{{ advice }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="loading" class="text-center text-gray-600">Đang tải dữ liệu...</div>
        <div v-else class="text-center text-red-600">Không có dữ liệu chu kỳ vận số.</div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import Chart from 'chart.js/auto';
import { calculateLifePathNumber } from '~/utils/numerology-calculations';

// Bảng ánh xạ số năm cá nhân sang mức năng lượng
const energyLevelMap = {
  1: 1,  // Thấp nhất, khởi đầu
  2: 3,  // Tăng, hợp tác
  3: 5,  // Tăng, sáng tạo
  4: 4,  // Ổn định, hơi giảm
  5: 7,  // Cao, đỉnh giữa chu kỳ
  6: 6,  // Giảm, gia đình
  7: 3,  // Thấp, nội tâm
  8: 6,  // Tăng, tham vọng
  9: 5,  // Trung bình cao, hoàn thiện
  11: 8, // Cao, trực giác
  22: 9  // Cao nhất, đỉnh cao
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

// Tạo biểu đồ chu kỳ vận số
const createCycleChart = () => {
  if (!process.client || !numerologyData.value || !cycleChart.value || !numerologyData.value.cycles) {
    console.log('Không thể tạo biểu đồ: Thiếu dữ liệu hoặc không phải môi trường client');
    return;
  }

  if (chartInstance) chartInstance.destroy();

  const years = Object.keys(numerologyData.value.cycles).map(Number).sort();
  const energyLevels = years.map((year) => numerologyData.value.cycles[year].energyLevel);
  const numbers = years.map((year) => numerologyData.value.cycles[year].number);

  if (!years.length || !energyLevels.length || !numbers.length) {
    console.error('Dữ liệu biểu đồ không hợp lệ:', { years, energyLevels, numbers });
    return;
  }

  console.log('Energy levels for chart:', energyLevels); // Debug log

  chartInstance = new Chart(cycleChart.value, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Mức năng lượng',
          data: energyLevels,
          borderColor: '#14B8A6',
          backgroundColor: 'rgba(20, 184, 166, 0.2)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#14B8A6',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#14B8A6',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const year = context.label;
              const number = numbers[context.dataIndex];
              const description = numerologyData.value.cycles[year].description.split('.')[0];
              return `Số ${number} - Năng lượng: ${context.raw}/9 - ${description}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 9,
          title: { display: true, text: 'Mức năng lượng' },
        },
        x: {
          title: { display: true, text: 'Năm' },
        },
      },
    },
  });
};

// Gọi API để lấy dữ liệu chu kỳ vận số
const fetchNumerologyData = async () => {
  console.log('fetchNumerologyData called with birthDate:', props.birthDate);

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
  numerologyData.value = null;

  try {
    const lifePath = calculateLifePathNumber(props.birthDate);
    console.log('lifePath:', lifePath);
    const lifePathStr = [11, 22].includes(lifePath) ? lifePath.toString() : lifePath.toString();

    const { data, error } = await useFetch(`/api/personal-year-cycle/${lifePathStr}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      query: { birthDate: props.birthDate }
    });

    if (error.value) {
      console.error('Lỗi API Chu Kỳ Vận Số:', error.value);
      throw new Error('Lỗi khi lấy dữ liệu chu kỳ vận số.');
    }

    if (!data.value || !Array.isArray(data.value)) {
      throw new Error('Dữ liệu chu kỳ vận số không hợp lệ hoặc không tìm thấy.');
    }

    // Chuyển đổi mảng API thành object cycles
    const cycles = {};
    data.value.forEach((item) => {
      cycles[item.year] = {
        number: item.number,
        description: item.meaning,
        energyLevel: energyLevelMap[item.number] || 5, // Ánh xạ số năm cá nhân sang năng lượng
        strengths: item.strengths,
        weaknesses: item.weaknesses,
        advice: item.advice
      };
    });

    numerologyData.value = { cycles };
    console.log('Dữ liệu chu kỳ vận số:', numerologyData.value);
    toast.success('Tạo báo cáo chu kỳ vận số hoàn tất!');
  } catch (err) {
    console.error('Lỗi trong fetchNumerologyData:', err);
    toast.warn('Không thể lấy dữ liệu từ API, sử dụng dữ liệu mẫu!');
    // Dữ liệu mẫu
    numerologyData.value = {
      cycles: {
        2025: {
          number: 1,
          description: 'Năm 2025 với số 1 mang năng lượng khởi đầu. Đây là thời điểm bắt đầu dự án mới và tự tin tiến lên.',
          energyLevel: 1,
          strengths: [
            'Tinh thần tiên phong giúp bạn dẫn đầu và khởi xướng các dự án mới.',
            'Sự quyết đoán và độc lập cho phép bạn đưa ra quyết định nhanh chóng.',
            'Năng lượng sáng tạo thúc đẩy bạn tìm ra giải pháp độc đáo.'
          ],
          weaknesses: [
            'Có thể trở nên quá tập trung vào bản thân, bỏ qua nhu cầu của người khác.',
            'Thiếu kiên nhẫn khi mọi thứ không diễn ra nhanh như mong đợi.',
            'Nguy cơ tự cao hoặc không lắng nghe ý kiến khác.'
          ],
          advice: [
            'Tập trung vào mục tiêu dài hạn và lập kế hoạch rõ ràng.',
            'Học cách cộng tác với người khác để đạt kết quả tốt hơn.',
            'Giữ sự kiên nhẫn và linh hoạt khi đối mặt với thử thách.'
          ]
        },
        2026: {
          number: 2,
          description: 'Năm 2026 với số 2 tập trung vào hợp tác. Hãy xây dựng mối quan hệ và tìm sự cân bằng.',
          energyLevel: 3,
          strengths: ['Tăng cường khả năng giao tiếp và hợp tác.', 'Nhạy bén trong việc xây dựng mối quan hệ.'],
          weaknesses: ['Dễ bị ảnh hưởng bởi cảm xúc.', 'Thiếu quyết đoán trong một số tình huống.'],
          advice: ['Lắng nghe trực giác của bạn.', 'Tìm kiếm sự cân bằng trong các mối quan hệ.']
        },
        2027: {
          number: 3,
          description: 'Năm 2027 với số 3 tràn đầy sáng tạo. Hãy thể hiện bản thân và tận hưởng niềm vui.',
          energyLevel: 5,
          strengths: ['Sáng tạo và biểu đạt tốt.', 'Năng lượng tích cực lan tỏa.'],
          weaknesses: ['Dễ phân tâm.', 'Thiếu tập trung vào mục tiêu dài hạn.'],
          advice: ['Tận dụng năng lượng sáng tạo.', 'Giữ kỷ luật để hoàn thành dự án.']
        },
        2028: {
          number: 4,
          description: 'Năm 2028 với số 4 là xây dựng nền tảng. Làm việc chăm chỉ để đạt sự ổn định.',
          energyLevel: 4,
          strengths: ['Kỷ luật và tổ chức tốt.', 'Khả năng xây dựng nền tảng vững chắc.'],
          weaknesses: ['Cảm giác bị hạn chế.', 'Quá cứng nhắc.'],
          advice: ['Lập kế hoạch chi tiết.', 'Duy trì sự linh hoạt.']
        },
        2029: {
          number: 5,
          description: 'Năm 2029 với số 5 mang đến thay đổi. Khám phá cơ hội mới và sống năng động.',
          energyLevel: 7,
          strengths: ['Linh hoạt và thích nghi tốt.', 'Tò mò và sẵn sàng khám phá.'],
          weaknesses: ['Dễ bốc đồng.', 'Thiếu ổn định.'],
          advice: ['Tận hưởng tự do nhưng giữ mục tiêu.', 'Kiểm soát rủi ro.']
        },
        2030: {
          number: 6,
          description: 'Năm 2030 với số 6 nhấn mạnh gia đình. Chăm sóc người thân và tạo sự hài hòa.',
          energyLevel: 6,
          strengths: ['Trách nhiệm và yêu thương.', 'Tạo môi trường hài hòa.'],
          weaknesses: ['Dễ hy sinh bản thân.', 'Quá lo lắng cho người khác.'],
          advice: ['Cân bằng giữa bản thân và người khác.', 'Tập trung vào sức khỏe tinh thần.']
        },
        2031: {
          number: 7,
          description: 'Năm 2031 với số 7 khuyến khích nội tâm. Suy ngẫm và học hỏi sẽ mang lại giá trị.',
          energyLevel: 3,
          strengths: ['Sâu sắc và trực giác mạnh.', 'Khả năng học hỏi cao.'],
          weaknesses: ['Dễ cô lập bản thân.', 'Quá phân tích.'],
          advice: ['Tìm kiếm sự tĩnh lặng.', 'Chia sẻ suy nghĩ với người thân cận.']
        },
        2032: {
          number: 8,
          description: 'Năm 2032 với số 8 là năm thành công. Tận dụng tham vọng để đạt mục tiêu lớn.',
          energyLevel: 6,
          strengths: ['Tham vọng và quyết đoán.', 'Khả năng quản lý tài chính tốt.'],
          weaknesses: ['Dễ bị áp lực.', 'Quá tập trung vào vật chất.'],
          advice: ['Tập trung vào mục tiêu lớn.', 'Giữ sự cân bằng tinh thần.']
        },
        2033: {
          number: 9,
          description: 'Năm 2033 với số 9 đánh dấu hoàn thiện. Chia sẻ kinh nghiệm và chuẩn bị khởi đầu mới.',
          energyLevel: 5,
          strengths: ['Nhân ái và bao dung.', 'Tầm nhìn rộng lớn.'],
          weaknesses: ['Dễ bị cảm xúc chi phối.', 'Khó buông bỏ quá khứ.'],
          advice: ['Chia sẻ kiến thức.', 'Chuẩn bị cho chu kỳ mới.']
        },
        2034: {
          number: 22,
          description: 'Năm 2034 với số 22 mang năng lượng xây dựng lớn. Đây là thời điểm thực hiện các dự án tầm cỡ và đạt thành công vượt bậc.',
          energyLevel: 9,
          strengths: ['Tầm nhìn chiến lược.', 'Khả năng biến ý tưởng thành hiện thực.'],
          weaknesses: ['Áp lực từ kỳ vọng lớn.', 'Dễ bị quá tải.'],
          advice: ['Tập trung vào mục tiêu dài hạn.', 'Quản lý căng thẳng hiệu quả.']
        }
      },
    };
  } finally {
    loading.value = false;
  }
};

// Theo dõi birthDate để gọi API
watch(() => props.birthDate, (newValue) => {
  console.log('watch birthDate triggered:', newValue);
  if (newValue && /^\d{2}\/\d{2}\/\d{4}$/.test(newValue)) {
    fetchNumerologyData();
  } else {
    console.log('birthDate không hợp lệ khi watch:', newValue);
  }
});

// Gọi API khi component mount nếu birthDate hợp lệ
onMounted(() => {
  console.log('Component mounted, birthDate:', props.birthDate);
  if (props.birthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    fetchNumerologyData();
  } else {
    console.log('birthDate không hợp lệ khi mount:', props.birthDate);
  }
});

// Theo dõi numerologyData để vẽ biểu đồ
watch(numerologyData, () => {
  console.log('watch numerologyData triggered:', numerologyData.value);
  if (numerologyData.value && numerologyData.value.cycles && Object.keys(numerologyData.value.cycles).length) {
    setTimeout(() => createCycleChart(), 100); // Đợi DOM render
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
</style>