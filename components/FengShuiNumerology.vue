<!-- components/FengShuiNumerology.vue -->
<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-2xl font-semibold text-purple-700 mb-6">Số học phong thủy</h2>
    <div class="space-y-6">
      <div>
        <label for="birthDate" class="block text-gray-700 font-medium mb-2">Ngày sinh (dd/mm/yyyy)</label>
        <input
          v-model="birthDate"
          type="text"
          id="birthDate"
          placeholder="Ví dụ: 15/08/1995"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <button
        @click="generateFengShui"
        :disabled="loading"
        class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
      >
        {{ loading ? 'Đang xử lý...' : 'Xem phong thủy' }}
      </button>

      <div v-if="fengShuiData" class="mt-4 p-6 bg-purple-50 rounded-lg whitespace-pre-line">
        <h3 class="text-purple-800 font-semibold text-lg mb-4">Phong thủy theo thần số học</h3>
        <p><strong>Số chủ đạo:</strong> {{ fengShuiData.lifePath }}</p>
        <p><strong>Ngũ hành:</strong> {{ fengShuiData.element }}</p>
        <p><strong>Hướng tốt nhất:</strong> {{ fengShuiData.direction }}</p>
        <p><strong>Màu sắc hợp mệnh:</strong> {{ fengShuiData.colors.join(', ') }}</p>
        <p><strong>Vật phẩm phong thủy:</strong> {{ fengShuiData.items.join(', ') }}</p>
        <h4 class="mt-4 text-purple-700 font-semibold">Phân tích:</h4>
        <p>{{ fengShuiData.analysis }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

const birthDate = ref('');
const fengShuiData = ref(null);
const loading = ref(false);

const generateFengShui = async () => {
  if (!birthDate.value) {
    toast.error('Vui lòng nhập ngày sinh!');
    return;
  }

  loading.value = true;
  try {
    const response = await $fetch('/api/numerology/fengshui', {
      method: 'POST',
      body: { birthDate: birthDate.value },
    });

    fengShuiData.value = response.fengshui;
    toast.success('Đã tạo phân tích phong thủy!');
  } catch (error) {
    console.error('Error:', error);
    toast.error('Không thể tạo phân tích!');
  } finally {
    loading.value = false;
  }
};
</script>