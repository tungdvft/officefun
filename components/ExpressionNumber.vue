<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">Số Biểu Đạt của {{ fullName }}</h1>
    <div v-if="expressionData" class="space-y-6">
      <div>
        <h2 class="text-2xl font-semibold text-indigo-600">Số Biểu Đạt: {{ expressionData.number }}</h2>
      </div>
      <div>
        <h3 class="text-xl font-medium text-gray-700">Mô tả</h3>
        <p class="text-gray-600">{{ expressionData.description }}</p>
      </div>
      <div>
        <h3 class="text-xl font-medium text-gray-700">Lời khuyên</h3>
        <p class="text-gray-600">{{ expressionData.advice }}</p>
      </div>
      <div>
        <h3 class="text-xl font-medium text-gray-700">Đặc điểm</h3>
        <p class="text-gray-600">{{ expressionData.traits }}</p>
      </div>
      <div>
        <h3 class="text-xl font-medium text-gray-700">Thách thức</h3>
        <p class="text-gray-600">{{ expressionData.challenges }}</p>
      </div>
    </div>
    <div v-else class="text-red-600">
      Không tìm thấy dữ liệu cho số biểu đạt của tên này. Vui lòng kiểm tra lại tên.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import expressionNumbers from '~/data/ExpressionNumbers.json'; // Giả định JSON trong thư mục assets

const props = defineProps({
  fullName: {
    type: String,
    required: true,
  },
});

// Hàm chuyển ký tự có dấu tiếng Việt sang không dấu
const removeVietnameseAccents = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

// Hàm tính số biểu đạt
const calculateExpressionNumber = (name) => {
  if (!name) return null;

  // Bảng Pythagoras
  const letterValues = {
    J: 1, S: 1,
    B: 2, K: 2, T: 2,
    C: 3, L: 3,
    D: 4, M: 4, V: 4,
    N: 5, W: 5,
    F: 6, X: 6,
    P: 7, Y: 7,
    H: 8, Q: 8, Z: 8,
    R: 9,
  };

  // Chuyển tên sang không dấu và lấy phụ âm
  const normalizedName = removeVietnameseAccents(name).toUpperCase();
  const consonants = normalizedName
    .replace(/[^A-Z]/g, '') // Loại bỏ ký tự không phải chữ
    .split('')
    .filter(char => !['A', 'E', 'I', 'O', 'U'].includes(char)); // Loại nguyên âm, giữ Y

  // Tính tổng giá trị phụ âm
  let sum = consonants.reduce((acc, char) => acc + (letterValues[char] || 0), 0);

  // Rút gọn tổng về số biểu đạt
  if (sum === 22) return '22/4'; // Giữ số Master 22/4
  while (sum > 11) {
    sum = sum
      .toString()
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit), 0);
  }

  return sum;
};

// Tính số biểu đạt từ fullName
const expressionNumber = computed(() => calculateExpressionNumber(props.fullName));

// Tìm dữ liệu tương ứng trong JSON
const expressionData = computed(() => {
  return expressionNumbers.numbers.find(
    item => item.number === expressionNumber.value || item.number.toString() === expressionNumber.value
  );
});
</script>

<style scoped>
/* Tailwind CSS được sử dụng trực tiếp trong template */
</style>