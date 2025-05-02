<template>
  <div class="karmic-debt-display max-w-800px mx-auto p-5 font-inter">
    <h2 class="text-2xl font-bold text-center text-teal-800 mb-6">Các Nợ Nghiệp</h2>
    
    <!-- Thông báo lỗi -->
    <div v-if="error" class="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded transition-all duration-300">
      {{ error }}
    </div>
    
    <!-- Trạng thái loading -->
    <div v-else-if="loading" class="p-4 text-center text-gray-600">
      <div class="animate-pulse">Đang tải dữ liệu...</div>
    </div>
    
    <!-- Hiển thị kết quả -->
    <div v-else-if="showResult" class="mt-6 animate-fadeIn">
      <div class="bg-white p-6 rounded-xl border border-gray-200">
      <h3 class="text-xl font-bold text-teal-800 mb-4">Các Nợ Nghiệp Của Bạn</h3>
      <p class="text-gray-700 text-lg">Các loại nợ nghiệp: <span class="font-bold text-teal-600">{{ debtTypes.join(', ') }}</span></p>
    </div>
    
    <div v-for="debt in debtData" :key="debt.type" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
      <h3 class="text-xl font-bold text-teal-800 mb-4">{{ debt.type }}</h3>
      <div class="prose prose-teal max-w-none space-y-3">
        <p class="text-gray-700"><strong>Mô tả:</strong> {{ debt.description }}</p>
        <p class="text-gray-700"><strong>Lời khuyên:</strong></p>
        <ul class="list-disc pl-5">
          <li v-for="(advice, index) in debt.advice" :key="index" class="text-gray-700">{{ advice }}</li>
        </ul>
      </div>
    </div>
  </div>
  
  <!-- Trường hợp không có nợ nghiệp -->
  <div v-else-if="!loading && !error" class="p-4 text-center animate-fadeIn">
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
      Chúc mừng! Không tìm thấy nợ nghiệp nào với thông tin của bạn.
    </div>
  </div>
  
  <!-- Yêu cầu nhập thông tin -->
  <div v-else class="p-4 text-center animate-fadeIn">
    <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
      Vui lòng nhập họ tên và ngày sinh hợp lệ (DD/MM/YYYY) để xem thông tin.
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { calculateKarmicDebtNumbers } from '~/utils/numerology-calculations';
import karmicDebtDataJson from '~/data/karmicDebtData.json';

console.log('[KarmicDebtDisplay] karmicDebtDataJson:', karmicDebtDataJson);

const props = defineProps({
  birthDate: {
    type: String,
    default: '',
    validator: (value) => {
      if (!value) return true;
      return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
    },
  },
  fullName: {
    type: String,
    default: '',
  },
});

onMounted(() => {
  console.log('[KarmicDebtDisplay] Mounted with props:', {
    fullName: props.fullName,
    birthDate: props.birthDate,
    isValidBirthDate: props.birthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate),
  });
});

const debtTypes = ref([]);
const debtData = ref([]);
const loading = ref(false);
const error = ref(null);

const showResult = computed(() => {
  const result = debtData.value.length > 0 && debtTypes.value.length > 0;
  console.log('[KarmicDebtDisplay] showResult:', result, {
    debtData: debtData.value,
    debtTypes: debtTypes.value,
  });
  return result;
});

const loadKarmicDebtData = async () => {
  console.log('[KarmicDebtDisplay] loadKarmicDebtData called with:', {
    fullName: props.fullName,
    birthDate: props.birthDate,
  });

  loading.value = true;
  error.value = null;
  debtTypes.value = [];
  debtData.value = [];

  try {
    console.log('[KarmicDebtDisplay] Checking inputs...');
    if (!props.fullName || props.fullName.trim() === '') {
      throw new Error('Họ tên không được để trống');
    }
    if (!props.birthDate) {
      throw new Error('Ngày sinh không được để trống');
    }
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
      throw new Error(`Định dạng ngày sinh không hợp lệ: ${props.birthDate}. Vui lòng dùng DD/MM/YYYY`);
    }

    const [day, month, year] = props.birthDate.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    console.log('[KarmicDebtDisplay] Parsed birthDate:', { day, month, year, dateObj });

    if (
      isNaN(dateObj.getTime()) ||
      dateObj.getDate() !== day ||
      dateObj.getMonth() + 1 !== month ||
      year < 1900 ||
      year > new Date().getFullYear()
    ) {
      throw new Error(`Ngày sinh không hợp lệ: ${props.birthDate}`);
    }

    console.log('[KarmicDebtDisplay] Calling calculateKarmicDebtNumbers...');
    const debts = calculateKarmicDebtNumbers(props.fullName, props.birthDate);
    console.log('[KarmicDebtDisplay] Debts:', debts);

    debtTypes.value = Object.keys(debts).filter((key) => debts[key]);
    console.log('[KarmicDebtDisplay] debtTypes:', debtTypes.value);

    debtData.value = debtTypes.value
      .map((type) => {
        const debt = karmicDebtDataJson.karmicDebts.find((debt) => debt.type === type);
        console.log(`[KarmicDebtDisplay] Searching for type ${type}:`, debt);
        return debt;
      })
      .filter(Boolean);

    console.log('[KarmicDebtDisplay] debtData:', debtData.value);

    if (debtData.value.length > 0) {
      toast.success('Tính toán Nợ Nghiệp thành công!');
    } else {
      console.log('[KarmicDebtDisplay] No karmic debts found, displaying no-debt state');
      toast.info('Không tìm thấy nợ nghiệp nào!');
    }
  } catch (err) {
    console.error('[KarmicDebtDisplay] Error in loadKarmicDebtData:', err.message, err.stack);
    error.value = err.message;
    toast.error(err.message);
    debtData.value = [];
  } finally {
    loading.value = false;
    console.log('[KarmicDebtDisplay] loadKarmicDebtData finished:', {
      error: error.value,
      loading: loading.value,
      debtTypes: debtTypes.value,
      debtData: debtData.value,
      showResult: showResult.value,
    });
  }
};

watch(
  [() => props.birthDate, () => props.fullName],
  ([newBirthDate, newFullName]) => {
    console.log('[KarmicDebtDisplay] Watch triggered:', {
      newBirthDate,
      newFullName,
      isValidBirthDate: newBirthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(newBirthDate),
      isValidFullName: newFullName && newFullName.trim() !== '',
    });
    if (newBirthDate && newFullName && newFullName.trim() !== '') {
      loadKarmicDebtData();
    } else {
      console.warn('[KarmicDebtDisplay] Watch skipped: Invalid input');
      error.value = 'Vui lòng nhập đầy đủ họ tên và ngày sinh';
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.karmic-debt-display {
  font-family: 'Inter', Arial, sans-serif;
}

.transition-all {
  transition: all 0.3s ease;
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .karmic-debt-display {
    padding: 15px;
  }
  .text-2xl {
    font-size: 1.4rem;
  }
  .text-xl {
    font-size: 1.2rem;
  }
  .text-lg {
    font-size: 1rem;
  }
}
</style>