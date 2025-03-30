<!-- components/SuccessMap.vue -->
<template>
  <div class="bg-white p-6 rounded-xl shadow-lg">
    <h2 class="text-2xl font-semibold text-purple-700 mb-4">Bản đồ thành công</h2>

    <!-- Form nhập thông tin -->
    <div v-if="!userInfo.name || editing" class="space-y-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="name" class="block text-gray-700 font-medium mb-2">Họ và tên</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            placeholder="Ví dụ: Nguyễn Văn A"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label for="birthDate" class="block text-gray-700 font-medium mb-2">Ngày sinh (dd/mm/yyyy)</label>
          <input
            v-model="form.birthDate"
            type="text"
            id="birthDate"
            placeholder="Ví dụ: 15/08/1995"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
      <button
        @click="fetchSuccessMap"
        :disabled="loading"
        class="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
      >
        {{ loading ? 'Đang xử lý...' : 'Xem bản đồ' }}
      </button>
    </div>
    <div v-else class="flex justify-between items-center mb-4">
      <p class="text-gray-700">Bản đồ thành công của: <span class="font-semibold">{{ userInfo.name }}</span></p>
      <button
        @click="editing = true"
        class="text-purple-500 hover:underline"
      >
        Cập nhật thông tin
      </button>
    </div>

    <!-- Kết quả -->
    <div v-if="!userInfo.name" class="text-center text-gray-600">
      <p>Nhập thông tin để khám phá bản đồ thành công của bạn!</p>
    </div>
    <div v-else-if="successMap" class="mt-4 p-4 bg-purple-50 rounded-lg space-y-6">
      <div>
        <p class="text-purple-700 font-semibold text-lg">Mục tiêu lớn (Số Đường đời: {{ successMap.lifePathNumber }})</p>
        <p class="text-gray-700 mt-2">{{ successMap.goal }}</p>
      </div>
      <div>
        <p class="text-purple-700 font-semibold text-lg">Điểm mạnh (Số Tên: {{ successMap.expressionNumber }})</p>
        <p class="text-gray-700 mt-2">{{ successMap.strengths }}</p>
      </div>
      <div>
        <p class="text-purple-700 font-semibold text-lg">Điểm cần lưu ý (Số Linh hồn: {{ successMap.soulUrgeNumber }})</p>
        <p class="text-gray-700 mt-2">{{ successMap.notes }}</p>
      </div>
      <div>
        <p class="text-purple-700 font-semibold text-lg">Chiến lược năm {{ currentYear }} (Số Cá nhân: {{ successMap.personalYearNumber }})</p>
        <p class="text-gray-700 mt-2">{{ successMap.strategy }}</p>
      </div>
      <div>
        <p class="text-purple-700 font-semibold text-lg">Các cột mốc thành công</p>
        <div class="space-y-4 mt-2">
          <div>
            <p class="text-purple-600 font-semibold">Cột mốc ngắn hạn (Dựa trên Số Linh hồn)</p>
            <p class="text-gray-700">{{ successMap.milestones.shortTerm }}</p>
          </div>
          <div>
            <p class="text-purple-600 font-semibold">Cột mốc trung hạn (Dựa trên Số Tên)</p>
            <p class="text-gray-700">{{ successMap.milestones.mediumTerm }}</p>
          </div>
          <div>
            <p class="text-purple-600 font-semibold">Cột mốc dài hạn (Dựa trên Số Đường đời)</p>
            <p class="text-gray-700">{{ successMap.milestones.longTerm }}</p>
          </div>
          <div>
            <p class="text-purple-600 font-semibold">Cột mốc năm {{ currentYear }} (Dựa trên Số Cá nhân)</p>
            <p class="text-gray-700">{{ successMap.milestones.currentYear }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

const currentYear = '2025';

// Form và trạng thái
const form = ref({
  name: '',
  birthDate: ''
});
const userInfo = ref({ name: '', birthDate: '' });
const successMap = ref(null);
const loading = ref(false);
const editing = ref(false);

// Lấy dữ liệu bản đồ thành công
const fetchSuccessMap = async () => {
  if (!form.value.name || !form.value.birthDate) {
    toast.error('Vui lòng nhập đầy đủ tên và ngày sinh!', { position: 'top-center' });
    return;
  }
  loading.value = true;
  try {
    const response = await $fetch('/api/numerology/success-map', {
      method: 'POST',
      body: {
        name: form.value.name,
        birthDate: form.value.birthDate
      }
    });
    userInfo.value = { name: form.value.name, birthDate: form.value.birthDate };
    successMap.value = response.successMap;
    editing.value = false;
    toast.success('Bản đồ thành công đã sẵn sàng!', { position: 'top-center' });
  } catch (error) {
    console.error('Error:', error);
    toast.error('Không thể lấy bản đồ thành công!', { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};
</script>