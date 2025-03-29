<!-- pages/dashboard/full-numerology.vue -->
<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-2xl font-semibold text-purple-700 mb-6 flex items-center">
      <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      Thần số học trọn đời
    </h2>

    <div class="space-y-6">
      <div>
        <label for="fullName" class="block text-gray-700 font-medium mb-2">Họ và tên</label>
        <input
          v-model="formData.fullName"
          type="text"
          id="fullName"
          placeholder="Nhập họ và tên của bạn"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label for="birthdate" class="block text-gray-700 font-medium mb-2">Ngày sinh (dd/mm/yyyy)</label>
        <input
          v-model="formData.birthdate"
          type="text"
          id="birthdate"
          placeholder="Ví dụ: 15/08/1995"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <button
        @click="getFullNumerology"
        :disabled="loading"
        class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
      >
        {{ loading ? 'Đang xử lý...' : 'Xem báo cáo' }}
      </button>

      <!-- Hiển thị kết quả với Markdown -->
      <div v-if="result" class="mt-4 p-6 bg-purple-50 rounded-lg">
        <p class="text-purple-800 font-semibold text-lg mb-2">Báo cáo thần số học trọn đời</p>
        <div v-html="parsedResult" class="text-gray-700 whitespace-pre-line"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';
import { marked } from 'marked';

definePageMeta({
  layout: 'dashboard'
});

const formData = ref({
  fullName: '',
  birthdate: ''
});
const result = ref('');
const loading = ref(false);

// Parse Markdown để hiển thị kết quả
const parsedResult = computed(() => {
  return result.value ? marked(result.value) : '';
});

const getFullNumerology = async () => {
  if (!formData.value.fullName) {
    toast.error('Vui lòng nhập họ và tên!', { position: 'top-center' });
    return;
  }
  if (!formData.value.birthdate) {
    toast.error('Vui lòng nhập ngày sinh!', { position: 'top-center' });
    return;
  }

  loading.value = true;
  try {
    const username = localStorage.getItem('username') || 'guest';
    const encodedUsername = encodeURIComponent(username);
    const response = await fetch('/api/numerology/full', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-username': encodedUsername,
      },
      body: JSON.stringify({
        fullName: formData.value.fullName,
        birthdate: formData.value.birthdate
      }),
    });

    if (response.ok) {
      const data = await response.json();
      result.value = data.answer || 'Báo cáo trọn đời đang được phát triển...'; // Placeholder
      toast.success('Báo cáo đã sẵn sàng!', { position: 'top-center' });
    } else {
      toast.error('Không thể tạo báo cáo!', { position: 'top-center' });
    }
  } catch (error) {
    console.error('Error getting full numerology:', error);
    toast.error('Có lỗi xảy ra!', { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};
</script>

<style>
div[v-html] strong {
  font-weight: bold;
}
</style>