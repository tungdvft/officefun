<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-2xl font-semibold text-purple-700 mb-6">Định hướng nghề nghiệp</h2>
    <div class="space-y-6">
      <div>
        <label for="name" class="block text-gray-700 font-medium mb-2">Họ và tên</label>
        <input
          v-model="formData.name"
          type="text"
          id="name"
          placeholder="Nhập họ và tên"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label for="birthdate" class="block text-gray-700 font-medium mb-2">Ngày sinh (dd/mm/yyyy)</label>
        <input
          v-model="formData.birthdate"
          type="text"
          id="birthdate"
          placeholder="Ví dụ: 15/03/1995"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label for="currentJob" class="block text-gray-700 font-medium mb-2">Công việc hiện tại</label>
        <input
          v-model="formData.currentJob"
          type="text"
          id="currentJob"
          placeholder="Ví dụ: Lập trình viên, Giáo viên"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <button
        @click="getCareerGuidance"
        :disabled="loading"
        class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
      >
        {{ loading ? 'Đang xử lý...' : 'Xem định hướng nghề nghiệp' }}
      </button>

      <div v-if="result" class="mt-4 p-6 bg-purple-50 rounded-lg whitespace-pre-line">
        <p class="text-purple-800 font-semibold text-lg mb-2">Định hướng nghề nghiệp</p>
        <div v-html="parsedResult"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';
import { marked } from 'marked';

const formData = ref({
  name: '',
  birthdate: '',
  currentJob: '' // Thêm trường công việc hiện tại
});
const result = ref('');
const loading = ref(false);

const parsedResult = computed(() => {
  return result.value ? marked(result.value) : '';
});

const getCareerGuidance = async () => {
  if (!formData.value.name) {
    toast.error('Vui lòng nhập họ và tên!');
    return;
  }
  if (!formData.value.birthdate) {
    toast.error('Vui lòng nhập ngày sinh!');
    return;
  }

  loading.value = true;
  try {
    const username = localStorage.getItem('username') || 'guest';
    const response = await fetch('/api/numerology/career', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-username': encodeURIComponent(username),
      },
      body: JSON.stringify({
        name: formData.value.name,
        birthdate: formData.value.birthdate,
        currentJob: formData.value.currentJob || '' // Gửi công việc hiện tại (có thể rỗng)
      }),
    });

    if (response.ok) {
      const data = await response.json();
      result.value = data.answer;
      toast.success('Định hướng nghề nghiệp đã hoàn tất!');
    } else {
      toast.error('Không thể lấy định hướng nghề nghiệp!');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Có lỗi xảy ra!');
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