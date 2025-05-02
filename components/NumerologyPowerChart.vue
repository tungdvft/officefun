<template>
  <div class="numerology-power-chart max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm font-inter">
    <!-- Tiêu đề và mô tả -->
    <h3 class="text-center text-2xl font-bold text-teal-800 mb-2">
      {{ chartData.chartTypes.pythagorean.name }}
    </h3>
    <p class="text-center text-gray-600 mb-6">{{ chartData.chartTypes.pythagorean.description }}</p>

    <!-- Trạng thái loading -->
    <div v-if="loading" class="p-4 text-center text-gray-600">
      <div class="animate-pulse">Đang tải biểu đồ sức mạnh...</div>
    </div>

    <!-- Trạng thái lỗi -->
    <div v-else-if="error" class="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <!-- Bảng biểu đồ -->
    <div v-else class="chart-container flex justify-center mb-6">
      <table class="m-auto text-center font-bold border-collapse">
        <tbody>
          <tr v-for="(row, rowIndex) in pythagoreanGrid" :key="`row-${rowIndex}`">
            <td
              v-for="(cell, cellIndex) in row"
              :key="`cell-${rowIndex}-${cellIndex}`"
              class="border p-4 w-16 h-16 relative transition-all"
              :class="getCellClasses(cell)"
            >
              <span class="text-xl font-bold">{{ cell }}</span>
              <div v-if="powerChartData[cell] || isCoreNumber(cell)" class="absolute bottom-1 right-1 text-sm flex items-center space-x-1">
                <span v-if="powerChartData[cell]" class="text-gray-600">{{ powerChartData[cell] }}</span>
                <span v-if="isCoreNumber(cell)" class="text-teal-600">★</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Diễn giải tất cả các số -->
    <div v-if="!loading && !error" class="interpretations mt-6">
      <div
        v-for="number in activeNumbers"
        :key="`interpretation-${number}`"
        class="p-6 mb-4 bg-gray-50 rounded-xl border border-gray-200 animate-fadeIn"
      >
        <h4 class="text-xl font-bold text-teal-800 mb-3">
          Số {{ number }} - {{ getNumberTitle(number) }}
          <span v-if="isCoreNumber(number)" class="text-teal-500 text-sm ml-2">★</span>
        </h4>
        <p class="text-gray-700 mb-2">
          <strong>Tần suất:</strong> {{ powerChartData[number] || 'N/A' }}
        </p>
        <p class="text-gray-700 mb-2">
          <strong>Ý nghĩa cốt lõi:</strong> {{ getNumberCoreMeaning(number) }}
        </p>
        <p class="text-gray-700 mb-2">
          <strong>Biểu tượng:</strong> {{ getNumberSymbolism(number) }}
        </p>
        <p class="text-gray-700 mb-2">
          <strong>Nguyên tố:</strong> {{ getNumberElement(number) }}
        </p>
        <p class="text-gray-700 mb-2">
          <strong>Hành tinh:</strong> {{ getNumberPlanet(number) }}
        </p>
        <p class="text-gray-700 mb-2">
          <strong>Màu sắc:</strong> {{ getNumberColor(number) }}
        </p>
        <p class="text-gray-700 mb-2">
          <strong>Tác động tần suất:</strong> {{ getNumberFrequencyImpact(number) }}
        </p>
        <div v-if="getNumberStrengths(number)" class="mb-3">
          <strong class="text-gray-700">Điểm mạnh:</strong>
          <ul class="list-disc pl-5 text-gray-700">
            <li v-for="(strength, index) in getNumberStrengths(number)" :key="index">
              {{ strength }}
            </li>
          </ul>
        </div>
        <div v-if="getNumberChallenges(number)" class="mb-3">
          <strong class="text-gray-700">Thách thức:</strong>
          <ul class="list-disc pl-5 text-gray-700">
            <li v-for="(challenge, index) in getNumberChallenges(number)" :key="index">
              {{ challenge }}
            </li>
          </ul>
        </div>
        <div v-if="getNumberCareerAdvice(number)" class="mb-3">
          <strong class="text-gray-700">Lời khuyên nghề nghiệp:</strong>
          <ul class="list-disc pl-5 text-gray-700">
            <li v-for="(advice, index) in getNumberCareerAdvice(number)" :key="index">
              {{ advice }}
            </li>
          </ul>
        </div>
        <div v-if="getNumberRelationshipTips(number)" class="mb-3">
          <strong class="text-gray-700">Mẹo quan hệ:</strong>
          <ul class="list-disc pl-5 text-gray-700">
            <li v-for="(tip, index) in getNumberRelationshipTips(number)" :key="index">
              {{ tip }}
            </li>
          </ul>
        </div>
        <p class="text-gray-700 mb-2">
          <strong>Bài học tâm linh:</strong> {{ getNumberSpiritualLesson(number) }}
        </p>
        <p v-if="isCoreNumber(number)" class="text-sm text-teal-500 mt-2">
          (Đây là một trong những số cốt lõi của bạn)
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { toast } from 'vue3-toastify';
import {
  calculateLifePathNumber,
  calculateExpressionNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  calculateBirthDayNumber,
  calculatePeakNumbers
} from '~/utils/numerology-calculations';
import chartData from '~/data/powerChart.json';

// Bảng Pythagorean cứng để đảm bảo đúng lưới
const pythagoreanGrid = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6]
];

// Bảng ánh xạ chữ cái
const PYTHAGOREAN_CHART = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
  á: 1, à: 1, ả: 1, ã: 1, ạ: 1,
  ă: 1, ắ: 1, ằ: 1, ẳ: 1, ẵ: 1, ặ: 1,
  â: 1, ấ: 1, ầ: 1, ẩ: 1, ẫ: 1, ậ: 1,
  đ: 4,
  é: 5, è: 5, ẻ: 5, ẽ: 5, ẹ: 5,
  ê: 5, ế: 5, ề: 5, ể: 5, ễ: 5, ệ: 5,
  í: 9, ì: 9, ỉ: 9, ĩ: 9, ị: 9,
  ó: 6, ò: 6, ỏ: 6, õ: 6, ọ: 6,
  ô: 6, ố: 6, ồ: 6, ổ: 6, ỗ: 6, ộ: 6,
  ơ: 6, ớ: 6, ờ: 6, ở: 6, ỡ: 6, ợ: 6,
  ú: 3, ù: 3, ủ: 3, ũ: 3, ụ: 3,
  ư: 3, ứ: 3, ừ: 3, ử: 3, ữ: 3, ự: 3,
  ý: 7, ỳ: 7, ỷ: 7, ỹ: 7, ỵ: 7
};

const props = defineProps({
  birthDate: {
    type: String,
    required: true,
    validator: (value) => /^\d{2}\/\d{2}\/\d{4}$/.test(value)
  },
  fullName: {
    type: String,
    required: true
  }
});

const loading = ref(false);
const error = ref(null);
const powerChartData = ref({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 99: 0 });

// Tính số cốt lõi
const coreNumbers = computed(() => {
  try {
    const lifePath = calculateLifePathNumber(props.birthDate);
    const expression = calculateExpressionNumber(props.fullName);
    const soulUrge = calculateSoulUrgeNumber(props.fullName);
    const personality = calculatePersonalityNumber(props.fullName);
    const birthday = calculateBirthDayNumber(props.birthDate);
    console.log('[NumerologyPowerChart] Core numbers:', { lifePath, expression, soulUrge, personality, birthday });
    return { lifePath, expression, soulUrge, personality, birthday };
  } catch (err) {
    console.error('[NumerologyPowerChart] Core numbers error:', err.message);
    return {};
  }
});

// Danh sách các số có tần suất
const activeNumbers = computed(() => {
  const numbers = Object.keys(powerChartData.value)
    .filter(key => powerChartData.value[key] > 0 && key !== '99' || (key === '99' && powerChartData.value[99] > 0))
    .map(Number);
  console.log('[NumerologyPowerChart] Active numbers:', numbers);
  return numbers.sort((a, b) => a - b);
});

// Tính tần suất số
const calculatePowerChart = async () => {
  console.log('[NumerologyPowerChart] Calculating power chart:', {
    fullName: props.fullName,
    birthDate: props.birthDate
  });

  loading.value = true;
  error.value = null;
  powerChartData.value = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 99: 0 };

  try {
    if (!props.fullName || props.fullName.trim() === '') {
      throw new Error('Họ tên không được để trống');
    }
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
      throw new Error('Ngày sinh không hợp lệ, vui lòng dùng định dạng DD/MM/YYYY');
    }

    const [day, month, year] = props.birthDate.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    if (isNaN(dateObj.getTime()) || dateObj.getDate() !== day || dateObj.getMonth() + 1 !== month) {
      throw new Error('Ngày sinh không hợp lệ');
    }

    // Tính các chỉ số
    const lifePath = calculateLifePathNumber(props.birthDate);
    const expression = calculateExpressionNumber(props.fullName);
    const soulUrge = calculateSoulUrgeNumber(props.fullName);
    const personality = calculatePersonalityNumber(props.fullName);
    const birthday = calculateBirthDayNumber(props.birthDate);
    const peaks = Object.values(calculatePeakNumbers(props.birthDate));

    console.log('[NumerologyPowerChart] Calculated numbers:', {
      lifePath,
      expression,
      soulUrge,
      personality,
      birthday,
      peaks
    });

    // Tính số từ tên
    const cleanName = props.fullName.toLowerCase().replace(/[^a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/g, '');
    const nameNumbers = cleanName.split('').map(char => {
      const value = PYTHAGOREAN_CHART[char] || 0;
      console.log(`[NumerologyPowerChart] Name char: ${char}, value=${value}`);
      return value;
    }).filter(n => n > 0);

    console.log('[NumerologyPowerChart] Name numbers:', nameNumbers);

    // Tổng hợp số
    const allNumbers = [
      lifePath,
      expression,
      soulUrge,
      personality,
      birthday,
      ...peaks,
      ...nameNumbers
    ];
    console.log('[NumerologyPowerChart] All numbers:', allNumbers);

    // Đếm tần suất
    allNumbers.forEach(num => {
      if (num >= 1 && num <= 9) {
        powerChartData.value[num]++;
      }
    });

    // Xử lý số 99
    if (powerChartData.value[9] >= 5) {
      powerChartData.value[99] = powerChartData.value[9];
      powerChartData.value[9] = 0;
    }

    console.log('[NumerologyPowerChart] Power chart data:', powerChartData.value);
    toast.success('Tải biểu đồ sức mạnh thành công!');
  } catch (err) {
    console.error('[NumerologyPowerChart] Error:', err.message);
    error.value = err.message;
    toast.error(err.message);
  } finally {
    loading.value = false;
  }
};

// Kiểm tra số cốt lõi
const isCoreNumber = (cell) => {
  const isCore = Object.values(coreNumbers.value).includes(cell);
  console.log(`[NumerologyPowerChart] Checking core number ${cell}: ${isCore}`);
  return isCore;
};

// Lấy thông tin số
const getNumberTitle = (number) => {
  return chartData.numberMeanings[number]?.title || chartData.specialNumbers[number]?.title || 'Không xác định';
};

const getNumberCoreMeaning = (number) => {
  return chartData.numberMeanings[number]?.coreMeaning || chartData.specialNumbers[number]?.coreMeaning || 'Không có dữ liệu';
};

const getNumberSymbolism = (number) => {
  return chartData.numberMeanings[number]?.symbolism || chartData.specialNumbers[number]?.symbolism || 'Không có dữ liệu';
};

const getNumberElement = (number) => {
  return chartData.numberMeanings[number]?.element || chartData.specialNumbers[number]?.element || 'Không có dữ liệu';
};

const getNumberPlanet = (number) => {
  return chartData.numberMeanings[number]?.planet || chartData.specialNumbers[number]?.planet || 'Không có dữ liệu';
};

const getNumberColor = (number) => {
  return chartData.numberMeanings[number]?.color || chartData.specialNumbers[number]?.color || 'Không có dữ liệu';
};

const getNumberFrequencyImpact = (number) => {
  return chartData.numberMeanings[number]?.frequencyImpact || chartData.specialNumbers[number]?.frequencyImpact || 'Không có dữ liệu';
};

const getNumberStrengths = (number) => {
  return chartData.numberMeanings[number]?.strengths || chartData.specialNumbers[number]?.strengths || null;
};

const getNumberChallenges = (number) => {
  return chartData.numberMeanings[number]?.challenges || chartData.specialNumbers[number]?.challenges || null;
};

const getNumberCareerAdvice = (number) => {
  return chartData.numberMeanings[number]?.careerAdvice || chartData.specialNumbers[number]?.careerAdvice || null;
};

const getNumberRelationshipTips = (number) => {
  return chartData.numberMeanings[number]?.relationshipTips || chartData.specialNumbers[number]?.relationshipTips || null;
};

const getNumberSpiritualLesson = (number) => {
  return chartData.numberMeanings[number]?.spiritualLesson || chartData.specialNumbers[number]?.spiritualLesson || 'Không có dữ liệu';
};

// Lớp CSS cho ô
const getCellClasses = (cell) => ({
  'bg-teal-50': isCoreNumber(cell),
  'border-teal-300': isCoreNumber(cell),
  'bg-teal-100': powerChartData.value[cell] > 0 && cell !== 99,
  'border-teal-400': powerChartData.value[cell] >= 3 && cell !== 99, // Nổi bật tần suất cao
  'bg-gray-100': !powerChartData.value[cell] && cell !== 99,
  'border-gray-300': true
});

// Theo dõi thay đổi props
watch(
  () => [props.fullName, props.birthDate],
  () => {
    if (props.fullName && props.birthDate) {
      calculatePowerChart();
    } else {
      powerChartData.value = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 99: 0 };
      error.value = 'Vui lòng nhập đầy đủ họ tên và ngày sinh';
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.numerology-power-chart {
  font-family: 'Inter', sans-serif;
}

.chart-container table {
  border-spacing: 0;
}

.chart-container td {
  border-width: 1px;
  transition: background-color 0.2s;
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>