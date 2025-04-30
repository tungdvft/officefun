<template>
  <div class="life-path-destiny-display">
    <h2>Tương Quan Số Đường Đời và Sứ Mệnh</h2>
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <div v-else-if="loading" class="loading">
      Đang tải dữ liệu...
    </div>
    <div v-else-if="correlationData">
      <div class="summary">
        <p><strong>Số Đường Đời:</strong> {{ lifePathNumber }}</p>
        <p><strong>Số Sứ Mệnh:</strong> {{ destinyNumber }}</p>
      </div>
      <div class="correlation-section">
        <h3>Tương Thích</h3>
        <p>{{ correlationData.compatibility }}</p>
      </div>
      <div class="correlation-section">
        <h3>Điểm Mạnh</h3>
        <p>{{ correlationData.strengths }}</p>
      </div>
      <div class="correlation-section">
        <h3>Thách Thức</h3>
        <p>{{ correlationData.challenges }}</p>
      </div>
      <div class="correlation-section">
        <h3>Giải Pháp</h3>
        <p>{{ correlationData.solutions }}</p>
      </div>
    </div>
    <div v-else>
      Không tìm thấy dữ liệu cho ngày sinh này.
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// Props
const props = defineProps({
  birthdate: {
    type: String,
    required: true,
  },
});

// State
const lifePathNumber = ref(null);
const destinyNumber = ref(null);
const correlationData = ref(null);
const loading = ref(false);
const error = ref(null);

// Hàm tính số Đường Đời hoặc Sứ Mệnh
const calculateNumber = (input) => {
  if (!input) return null;
  // Tổng các chữ số
  const sum = input
    .replace(/\D/g, '') // Chỉ lấy số
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit), 0);
  // Giữ số chính (11, 22, 33), rút gọn về 1–9 nếu không phải
  if ([11, 22, 33].includes(sum)) return sum;
  const reduced = sum
    .toString()
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit), 0);
  return reduced > 9 ? calculateNumber(reduced.toString()) : reduced;
};

// Tính số Đường Đời và Sứ Mệnh
const computeNumbers = () => {
  if (!props.birthdate || !/^\d{2}\/\d{2}\/\d{4}$/.test(props.birthdate)) {
    error.value = 'Ngày sinh không hợp lệ. Vui lòng nhập theo định dạng DD/MM/YYYY.';
    return;
  }
  try {
    // Chuyển DD/MM/YYYY thành Date để kiểm tra hợp lệ
    const [day, month, year] = props.birthdate.split('/');
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime()) || date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day) {
      error.value = 'Ngày sinh không hợp lệ. Vui lòng kiểm tra lại.';
      return;
    }
    // Tính số Đường Đời (tổng chữ số ngày sinh)
    lifePathNumber.value = calculateNumber(props.birthdate);
    // Tính số Sứ Mệnh (giả định tương tự, vì chưa có công thức riêng)
    destinyNumber.value = calculateNumber(props.birthdate); // Thay đổi nếu có công thức riêng
  } catch (err) {
    error.value = 'Lỗi khi tính toán số Đường Đời hoặc Sứ Mệnh.';
  }
};

// Tải dữ liệu JSON
const loadCorrelationData = async () => {
  if (!lifePathNumber.value || !destinyNumber.value) return;
  loading.value = true;
  error.value = null;
  correlationData.value = null;
  try {
    // Tải file JSON dựa trên số Đường Đời
    const fileName = `LifePath${lifePathNumber.value}CorrelationData.json`;
    const response = await import(`@/data/LifePathDestinyCorrelationData/${fileName}`);
    const data = response.default;
    // Tìm bản ghi tương quan dựa trên số Sứ Mệnh
    const correlation = data.correlations.find(
      (item) => item.destiny === destinyNumber.value
    );
    if (correlation) {
      correlationData.value = correlation;
    } else {
      error.value = `Không tìm thấy dữ liệu tương quan cho Sứ Mệnh ${destinyNumber.value}.`;
    }
  } catch (err) {
    error.value = `Lỗi khi tải file LifePath${lifePathNumber.value}CorrelationData.json.`;
  } finally {
    loading.value = false;
  }
};

// Watch birthdate để cập nhật khi thay đổi
watch(
  () => props.birthdate,
  () => {
    computeNumbers();
    loadCorrelationData();
  },
  { immediate: true }
);
</script>

<style scoped>
.life-path-destiny-display {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  color: #333;
}

.summary {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.correlation-section {
  margin-bottom: 20px;
}

.correlation-section h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.correlation-section p {
  line-height: 1.6;
  color: #555;
}

.loading, .error {
  text-align: center;
  color: #e74c3c;
  font-weight: bold;
}

@media (max-width: 600px) {
  .life-path-destiny-display {
    padding: 10px;
  }

  h2 {
    font-size: 1.5em;
  }

  .correlation-section h3 {
    font-size: 1.2em;
  }
}
</style>