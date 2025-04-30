<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-6">
      <!-- Tiêu đề -->
      <h2 class="text-2xl font-bold text-teal-800">Đỉnh Cao và Thử Thách Thần Số Học</h2>

      <!-- Biểu đồ SVG -->
      <transition name="fade-slide">
        <div v-if="peaksData && peaksData.length" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-bold text-teal-800 mb-4">Biểu đồ Đỉnh Cao và Thử Thách</h3>
          <svg width="800" height="800" viewBox="0 0 800 800">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#14B8A6" />
              </marker>
            </defs>

            <!-- Đường nối -->
            <!-- Ngày → Tháng -->
            <line class="line" x1="400" y1="100" x2="400" y2="200" />
            <!-- Tháng → Năm -->
            <line class="line" x1="400" y1="200" x2="400" y2="300" />
            <!-- Năm → Số đường đời -->
            <line class="line" x1="400" y1="300" x2="400" y2="400" />
            <!-- Số đường đời → Đỉnh cao -->
            <line class="line" v-for="(stage, index) in peaksData" :key="'peak-line-' + index" :x1="400" y1="400" :x2="250 + index * 100" y2="500" />
            <!-- Đỉnh cao → Thử thách -->
            <line class="line" v-for="(stage, index) in peaksData" :key="'challenge-line-' + index" :x1="250 + index * 100" y1="500" :x2="250 + index * 100" y2="600" />

            <!-- Node: Ngày sinh -->
            <g class="node" transform="translate(400,100)">
              <circle r="25" fill="#14B8A6" />
              <text y="6" class="node-number">{{ birthDigits.day }}</text>
              <text y="28" class="node-label">Ngày sinh</text>
            </g>

            <!-- Node: Tháng sinh -->
            <g class="node" transform="translate(400,200)">
              <circle r="25" fill="#14B8A6" />
              <text y="6" class="node-number">{{ birthDigits.month }}</text>
              <text y="28" class="node-label">Tháng sinh</text>
            </g>

            <!-- Node: Năm sinh -->
            <g class="node" transform="translate(400,300)">
              <circle r="25" fill="#14B8A6" />
              <text y="6" class="node-number">{{ birthDigits.year }}</text>
              <text y="28" class="node-label">Năm sinh</text>
            </g>

            <!-- Node: Số đường đời -->
            <g class="node" transform="translate(400,400)">
              <circle r="25" fill="#14B8A6" />
              <text y="6" class="node-number">{{ lifePath }}</text>
              <text y="28" class="node-label">Số đường đời</text>
            </g>

            <!-- Node: Đỉnh cao -->
            <g class="node" v-for="(stage, index) in peaksData" :key="'peak-' + index" :transform="`translate(${250 + index * 100},500)`">
              <circle r="25" fill="#14B8A6" />
              <text y="6" class="node-number">{{ stage.peak }}</text>
              <text y="28" class="node-label">{{ stage.age_range.split(' ')[0] }}</text>
              <text y="44" class="node-year">({{ stage.age_range.match(/\d{4}/g)[0]}})</text>
            </g>

            <!-- Node: Thử thách -->
            <g class="node" v-for="(stage, index) in peaksData" :key="'challenge-' + index" :transform="`translate(${250 + index * 100},600)`">
              <circle r="20" fill="#EF4444" />
              <text y="6" class="node-number">{{ stage.challenge }}</text>
              <text y="28" class="node-label">Thử thách</text>
            </g>
          </svg>
        </div>
        <div v-else-if="loading" class="text-center text-gray-600">Đang tải dữ liệu...</div>
        <div v-else class="text-center text-red-600">Không có dữ liệu đỉnh cao và thử thách.</div>
      </transition>

      <!-- Giải thích chi tiết -->
      <div v-if="peaksData && peaksData.length" class="space-y-6">
        <h3 class="text-xl font-bold text-teal-800">Giải Thích 4 Giai Đoạn Đỉnh Cao và Thử Thách</h3>
        <div v-for="(stage, index) in peaksData" :key="index" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div class="flex items-center mb-4">
            <span class="w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold mr-3">{{ stage.stage }}</span>
            <h4 class="text-lg font-semibold text-gray-800">Giai đoạn {{ stage.age_range }}</h4>
          </div>
          <div class="prose prose-teal max-w-none">
            <p class="text-gray-700"><strong>Đỉnh cao: {{ stage.peak }}</strong> - {{ getPeakDescription(stage.peak) }}</p>
            <p class="text-gray-700"><strong>Thử thách: {{ stage.challenge }}</strong> - {{ getChallengeDescription(stage.challenge) }}</p>
            <p class="text-gray-700">{{ stage.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { toast } from 'vue3-toastify';
import { calculateLifePathNumber } from '~/utils/numerology-calculations';
import peaksAndChallengesData from '~/data/PeaksandChallenges.json';

const props = defineProps({
  birthDate: {
    type: String,
    default: ''
  }
});

const peaksData = ref(null);
const loading = ref(false);
const lifePath = ref(null);
const birthDigits = ref({ day: null, month: null, year: null });

// Bảng ánh xạ mô tả
const getPeakDescription = (peak) => {
  const descriptions = {
    1: 'Khẳng định bản thân, độc lập và lãnh đạo.',
    2: 'Hợp tác, nhạy bén và xây dựng mối quan hệ.',
    3: 'Sáng tạo, biểu đạt và niềm vui.',
    4: 'Xây dựng nền tảng, kỷ luật và tổ chức.',
    5: 'Tự do, thay đổi và khám phá.',
    6: 'Trách nhiệm, gia đình và hài hòa.',
    7: 'Nội tâm, tri thức và tâm linh.',
    8: 'Thành công, quyền lực và quản lý.',
    9: 'Nhân đạo, lý tưởng và cống hiến.',
    11: 'Trực giác, cảm hứng và tâm linh.',
    22: 'Xây dựng lớn, thực tiễn và thành công.'
  };
  return descriptions[peak] || 'Đặc biệt';
};

const getChallengeDescription = (challenge) => {
  const descriptions = {
    0: 'Tiềm năng vô hạn, cần tìm hướng đi rõ ràng.',
    1: 'Vượt qua tự nghi ngờ, kiểm soát cái tôi.',
    2: 'Học cách hợp tác, kiểm soát cảm xúc.',
    3: 'Kiểm soát sự phân tán, thể hiện rõ ràng.',
    4: 'Duy trì kỷ luật, tránh cứng nhắc.',
    5: 'Thích nghi thay đổi, tránh bốc đồng.',
    6: 'Cân bằng trách nhiệm và tự do cá nhân.',
    7: 'Vượt qua cô lập, tin tưởng trực giác.',
    8: 'Quản lý tài chính, tránh tham vọng quá mức.',
    9: 'Cân bằng lý tưởng và thực tế.',
    11: 'Cân bằng trực giác và thực tế.',
    22: 'Cân bằng tầm nhìn lớn và chi tiết thực tiễn.'
  };
  return descriptions[challenge] || 'Đặc biệt';
};

// Tính số rút gọn
const reduceToSingleDigit = (number) => {
  if ([11, 22].includes(number)) return number;
  let sum = number;
  while (sum > 9) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum;
};

// Lấy và xử lý dữ liệu
const fetchPeaksAndChallenges = async () => {
  console.log('fetchPeaksAndChallenges called with birthDate:', props.birthDate);

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
  peaksData.value = null;

  try {
    // Tính số ngày, tháng, năm
    const daySum = reduceToSingleDigit(day);
    const monthSum = reduceToSingleDigit(month);
    const yearSum = reduceToSingleDigit(year.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0));
    birthDigits.value = { day: daySum, month: monthSum, year: yearSum };

    // Tính số đường đời
    lifePath.value = calculateLifePathNumber(props.birthDate);
    console.log('lifePath:', lifePath.value);
    const lifePathStr = lifePath.value === 22 ? '22/4' : lifePath.value.toString();

    // Lấy dữ liệu từ JSON
    const lifePathData = peaksAndChallengesData.numerology_peaks_and_challenges.life_paths.find(
      (path) => path.life_path.toString() === lifePathStr
    );

    if (!lifePathData) {
      throw new Error(`Không tìm thấy dữ liệu cho số đường đời ${lifePathStr}`);
    }

    // Điều chỉnh age_range
    const birthYear = year;
    const stages = lifePathData.stages.map((stage) => {
      const [startAge, endAge] = stage.age_range.match(/\d+/g).map(Number);
      const startYear = birthYear + startAge;
      const endYear = birthYear + endAge;
      return {
        ...stage,
        age_range: `${startAge}–${endAge} (${startYear}–${endYear})`
      };
    });

    peaksData.value = stages;
    console.log('Dữ liệu đỉnh cao và thử thách:', peaksData.value);
    toast.success('Tạo báo cáo đỉnh cao và thử thách hoàn tất!');
  } catch (err) {
    console.error('Lỗi trong fetchPeaksAndChallenges:', err);
    toast.error('Không thể lấy dữ liệu: ' + err.message);
    peaksData.value = [
      {
        stage: '5.1',
        age_range: '21–29 (2017–2025)',
        peak: 9,
        challenge: 5,
        description: 'Giai đoạn đỉnh cao đầu tiên. Đỉnh cao số 9 mang năng lượng nhân đạo. Thử thách số 5 yêu cầu kiểm soát bốc đồng.'
      },
      {
        stage: '5.2',
        age_range: '30–38 (2026–2034)',
        peak: 5,
        challenge: 0,
        description: 'Giai đoạn đỉnh cao thứ 2. Đỉnh cao số 5 thúc đẩy tự do. Thử thách số 0 đòi hỏi tìm hướng đi.'
      },
      {
        stage: '5.3',
        age_range: '39–47 (2035–2043)',
        peak: 5,
        challenge: 5,
        description: 'Giai đoạn đỉnh cao thứ 3. Đỉnh cao số 5 tiếp tục tự do. Thử thách số 5 yêu cầu tập trung.'
      },
      {
        stage: '5.4',
        age_range: '48–56 (2044–2052)',
        peak: 9,
        challenge: 5,
        description: 'Giai đoạn đỉnh cao 4. Đỉnh cao số 9 khuyến khích cống hiến. Thử thách số 5 đòi hỏi tập trung.'
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
    fetchPeaksAndChallenges();
  } else {
    console.log('birthDate không hợp lệ khi watch:', newValue);
  }
});

// Gọi khi mount
onMounted(() => {
  console.log('Component mounted, birthDate:', props.birthDate);
  if (props.birthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    fetchPeaksAndChallenges();
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
.line {
  stroke: #14B8A6;
  stroke-width: 2;
  marker-end: url(#arrow);
}
.node-number {
  fill: #fff;
  font-size: 14px;
  font-weight: bold;
  text-anchor: middle;
}
.node-label {
  fill: #4B5563;
  font-size: 12px;
  text-anchor: middle;
}
.node-year {
  fill: #4B5563;
  font-size: 10px;
  text-anchor: middle;
}
</style>