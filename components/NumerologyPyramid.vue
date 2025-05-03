<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-6">
      <!-- Tiêu đề -->
      <h2 class="text-2xl font-bold text-teal-800">Đỉnh Cao và Thử Thách Thần Số Học</h2>

      <!-- Biểu đồ SVG -->
      <transition name="fade-slide">
        <div v-if="peaksData && peaksData.length" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-bold text-teal-800 mb-4">Biểu đồ Đỉnh Cao và Thử Thách</h3>
          <svg width="700" height="600">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#003366" />
              </marker>
            </defs>

            <!-- Lines -->
            <line class="line" x1="350" y1="20" x2="100" y2="260"/>
            <line class="line" x1="350" y1="20" x2="600" y2="260"/>
            <line class="line" x1="350" y1="80" x2="250" y2="170"/>
            <line class="line" x1="350" y1="80" x2="450" y2="170"/>
            <line class="line" x1="250" y1="170" x2="100" y2="260"/>
            <line class="line" x1="450" y1="170" x2="600" y2="260"/>
            <line class="line" x1="250" y1="170" x2="350" y2="260"/>
            <line class="line" x1="450" y1="170" x2="350" y2="260"/>
            <line class="line" x1="100" y1="260" x2="250" y2="350"/>
            <line class="line" x1="600" y1="260" x2="450" y2="350"/>
            <line class="line" x1="350" y1="260" x2="250" y2="350"/>
            <line class="line" x1="350" y1="260" x2="450" y2="350"/>
            <line class="line" x1="250" y1="350" x2="350" y2="430"/>
            <line class="line" x1="450" y1="350" x2="350" y2="430"/>
            <line class="line" x1="350" y1="510" x2="100" y2="260"/>
            <line class="line" x1="350" y1="510" x2="600" y2="260"/>

            <!-- Nodes -->
            <!-- Topmost node (Life Path) -->
            <g class="node" transform="translate(350,20)">
              <circle r="20" fill="#b96cc4"/>
              <text y="5" text-anchor="middle" x="0">{{ lifePath }}</text>
            </g>

            <!-- Peak Stage 4 -->
            <g class="node" transform="translate(350,80)">
              <circle r="20" fill="#b96cc4"/>
              <text y="5" text-anchor="middle" x="0">{{ peaksData[3].peak }}</text>
              <text y="35" text-anchor="middle" x="0">{{ peaksData[3].age_range.split(' ')[0] }}</text>
              <text y="50" text-anchor="middle" x="0">({{ peaksData[3].age_range.match(/\d{4}–\d{4}/)[0]}})</text>
            </g>

            <!-- Peak Stage 3 -->
            <g class="node" transform="translate(250,170)">
              <circle r="20" fill="#b96cc4"/>
              <text y="5" text-anchor="middle" x="0">{{ peaksData[2].peak }}</text>
              <text y="35" text-anchor="middle" x="0">{{ peaksData[2].age_range.split(' ')[0] }}</text>
              <text y="50" text-anchor="middle" x="0">({{ peaksData[2].age_range.match(/\d{4}–\d{4}/)[0]}})</text>
            </g>

            <!-- Peak Stage 2 -->
            <g class="node" transform="translate(450,170)">
              <circle r="20" fill="#b96cc4"/>
              <text y="5" text-anchor="middle" x="0">{{ peaksData[1].peak }}</text>
              <text y="35" text-anchor="middle" x="0">{{ peaksData[1].age_range.split(' ')[0] }}</text>
              <text y="50" text-anchor="middle" x="0">({{ peaksData[1].age_range.match(/\d{4}–\d{4}/)[0]}})</text>
            </g>

            <!-- Birth Month -->
            <g class="node" transform="translate(100,260)">
              <circle r="20" fill="#c0e6f8"/>
              <text y="5" text-anchor="middle" x="0">{{ birthDigits.month }}</text>
              <text y="35" text-anchor="middle" x="0">Tháng 02</text>
            </g>

            <!-- Birth Day -->
            <g class="node" transform="translate(350,260)">
              <circle r="20" fill="#c0e6f8"/>
              <text y="5" text-anchor="middle" x="0">{{ birthDigits.day }}</text>
              <text y="35" text-anchor="middle" x="0">Ngày 07</text>
            </g>

            <!-- Birth Year -->
            <g class="node" transform="translate(600,260)">
              <circle r="20" fill="#c0e6f8"/>
              <text y="5" text-anchor="middle" x="0">{{ birthDigits.year }}</text>
              <text y="35" text-anchor="middle" x="0">1996</text>
            </g>

            <!-- Challenge Stage 1 -->
            <g class="node" transform="translate(250,350)">
              <circle r="20" fill="#b96cc4"/>
              <text y="5" text-anchor="middle" x="0">{{ peaksData[0].challenge }}</text>
            </g>

            <!-- Challenge Stage 2 -->
            <g class="node" transform="translate(450,350)">
              <circle r="20" fill="#b96cc4"/>
              <text y="5" text-anchor="middle" x="0">{{ peaksData[1].challenge }}</text>
            </g>

            <!-- Challenge Stage 3 -->
            <g class="node" transform="translate(350,430)">
              <circle r="20" fill="#b96cc4"/>
              <text y="5" text-anchor="middle" x="0">{{ peaksData[2].challenge }}</text>
            </g>

            <!-- Bottommost node (Life Path Challenge) -->
            <g class="node" transform="translate(350,510)">
              <circle r="20" fill="#b96cc4"/>
              <text y="5" text-anchor="middle" x="0">{{ peaksData[3].challenge }}</text>
            </g>
          </svg>
        </div>
        <div v-else-if="loading" class="text-center text-gray-600">Đang tải dữ liệu...</div>
        <div v-else class="text-center text-red-600">Không có dữ liệu đỉnh cao và thử thách.</div>
      </transition>

      <!-- Giải thích chi tiết -->
      <div v-if="peaksData && peaksData.length" class="space-y-8">
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-teal-700 mb-2">Giải Thích 4 Giai Đoạn Đỉnh Cao</h3>
          <div class="w-24 h-1 bg-teal-300 mx-auto rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="(stage, index) in peaksData" 
            :key="index" 
            class="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg"
            :style="`--i: ${index}`"
          >
            <!-- Header với số giai đoạn -->
            <div class="flex items-center px-6 pt-6 pb-4 border-b border-gray-100">
              <div class="flex-shrink-0 w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                {{ index + 1 }}
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-800">Giai đoạn {{ stage.age_range.split(' ')[0] }}</h4>
                <p class="text-sm text-gray-500 mt-1">{{ stage.age_range.match(/\(\d{4}–\d{4}\)/)[0] }}</p>
              </div>
            </div>
            
            <!-- Nội dung -->
            <div class="p-6 space-y-4">
              <!-- Đỉnh cao -->
              <div class="flex items-start">
                <div class="flex-shrink-0 mt-1">
                  <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold text-sm">
                    {{ stage.peak }}
                  </span>
                </div>
                <div class="ml-3">
                  <h5 class="font-medium text-gray-800">Đỉnh cao số {{ stage.peak }}</h5>
                  <p class="text-sm text-gray-600 mt-1 leading-relaxed">{{ getPeakDescription(stage.peak) }}</p>
                </div>
              </div>
              
              <!-- Thử thách -->
              <div class="flex items-start">
                <div class="flex-shrink-0 mt-1">
                  <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold text-sm">
                    {{ stage.challenge }}
                  </span>
                </div>
                <div class="ml-3">
                  <h5 class="font-medium text-gray-800">Thử thách số {{ stage.challenge }}</h5>
                  <p class="text-sm text-gray-600 mt-1 leading-relaxed">{{ getChallengeDescription(stage.challenge) }}</p>
                </div>
              </div>
              
              <!-- Mô tả -->
              <div class="pt-3 mt-3 border-t border-gray-100">
                <p class="text-gray-700 text-sm leading-relaxed">{{ stage.description }}</p>
              </div>
            </div>
            
            <!-- Góc trang trí -->
            <div class="absolute top-0 right-0 w-16 h-16 overflow-hidden">
              <div class="absolute top-0 right-0 w-full h-full bg-teal-50 transform translate-x-1/2 -translate-y-1/2 rotate-45 origin-bottom-left"></div>
            </div>
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