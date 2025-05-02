<template>
  <div class="natural-ability-display max-w-800px mx-auto p-5 font-inter">
    <h2 class="text-2xl font-bold text-center text-teal-800 mb-6">Chỉ số Năng Lực Tự Nhiên</h2>
    
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
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 class="text-xl font-bold text-teal-800 mb-4">Chỉ Số Của Bạn</h3>
        <div class="flex items-center">
          <span class="w-12 h-12 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold text-lg mr-4">
            {{ abilityNumber }}
          </span>
          <p class="text-gray-700 text-lg">Số Năng Lực Tự Nhiên: <span class="font-bold text-teal-600">{{ abilityNumber }}</span></p>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
        <h3 class="text-xl font-bold text-teal-800 mb-4">Luận Giải Chi Tiết</h3>
        <div class="prose prose-teal max-w-none space-y-3">
          <p class="text-gray-700"><strong>Mô tả:</strong> {{ abilityData.description }}</p>
          <p class="text-gray-700"><strong>Lời khuyên:</strong></p>
          <ul class="list-disc pl-5">
            <li v-for="(advice, index) in abilityData.advice" :key="index" class="text-gray-700">{{ advice }}</li>
          </ul>
        </div>
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
import { ref, watch, computed } from 'vue';
import { toast } from 'vue3-toastify';
import { calculateNaturalAbilityNumber } from '~/utils/numerology-calculations';
import naturalAbilityData from '~/data/naturalAbilityData.json';

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

const abilityNumber = ref(null);
const abilityData = ref(null);
const loading = ref(false);
const error = ref(null);

const showResult = computed(() => {
  return abilityData.value && abilityNumber.value !== null;
});

const loadAbilityData = async () => {
  loading.value = true;
  error.value = null;
  abilityNumber.value = null;
  abilityData.value = null;

  try {
    if (!props.birthDate || !props.fullName) {
      throw new Error('Vui lòng nhập đầy đủ họ tên và ngày sinh');
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
      throw new Error('Định dạng ngày sinh không hợp lệ (DD/MM/YYYY)');
    }

    const [day, month, year] = props.birthDate.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);

    if (
      dateObj.getDate() !== day ||
      dateObj.getMonth() + 1 !== month ||
      year < 1900 ||
      year > new Date().getFullYear()
    ) {
      throw new Error('Ngày sinh không hợp lệ');
    }

    abilityNumber.value = calculateNaturalAbilityNumber(props.fullName, props.birthDate);

    if (!abilityNumber.value) {
      throw new Error('Không thể tính toán chỉ số Năng Lực Tự Nhiên');
    }

    const data = naturalAbilityData.abilities.find(
      (item) => item.number === abilityNumber.value
    );

    if (data) {
      abilityData.value = data;
      toast.success('Tính toán Năng Lực Tự Nhiên thành công!');
    } else {
      throw new Error(`Không tìm thấy dữ liệu cho số ${abilityNumber.value}`);
    }
  } catch (err) {
    console.error('Lỗi trong loadAbilityData:', err);
    error.value = err.message;
    toast.error(err.message);
    abilityData.value = {
      description: `Tạm thời chưa có dữ liệu chi tiết cho số ${abilityNumber.value}`,
      advice: ['Đang cập nhật dữ liệu'],
    };
  } finally {
    loading.value = false;
  }
};

watch(
  [() => props.birthDate, () => props.fullName],
  ([newBirthDate, newFullName]) => {
    if (newBirthDate && newFullName && /^\d{2}\/\d{2}\/\d{4}$/.test(newBirthDate)) {
      loadAbilityData();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.natural-ability-display {
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
  .natural-ability-display {
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