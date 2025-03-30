<!-- pages/dashboard/compatibility.vue -->
<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-2xl font-semibold text-purple-700 mb-6 flex items-center">
      <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      Kiểm tra mức độ hợp nhau
    </h2>

    <div class="space-y-6">
      <!-- Tabs -->
      <div class="flex space-x-4 border-b">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="formData.relationshipType = tab.value"
          :class="[
            'py-2 px-4 font-medium',
            formData.relationshipType === tab.value
              ? 'border-b-2 border-purple-500 text-purple-700'
              : 'text-gray-500 hover:text-purple-700'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Form -->
      <div>
        <label for="person1Name" class="block text-gray-700 font-medium mb-2">Họ và tên người 1</label>
        <input
          v-model="formData.person1Name"
          type="text"
          id="person1Name"
          placeholder="Nhập họ và tên người 1"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label for="person1Birthdate" class="block text-gray-700 font-medium mb-2">Ngày sinh người 1 (dd/mm/yyyy)</label>
        <input
          v-model="formData.person1Birthdate"
          type="text"
          id="person1Birthdate"
          placeholder="Ví dụ: 15/08/1995"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label for="person2Name" class="block text-gray-700 font-medium mb-2">Họ và tên người 2</label>
        <input
          v-model="formData.person2Name"
          type="text"
          id="person2Name"
          placeholder="Nhập họ và tên người 2"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label for="person2Birthdate" class="block text-gray-700 font-medium mb-2">Ngày sinh người 2 (dd/mm/yyyy)</label>
        <input
          v-model="formData.person2Birthdate"
          type="text"
          id="person2Birthdate"
          placeholder="Ví dụ: 14/03/1990"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <button
        @click="checkCompatibility"
        :disabled="loading"
        class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
      >
        {{ loading ? 'Đang kiểm tra...' : 'Kiểm tra ngay' }}
      </button>

      <!-- Hiển thị kết quả -->
      <div v-if="result" class="mt-4 p-6 bg-purple-50 rounded-lg">
        <p class="text-purple-800 font-semibold text-lg mb-2">Kết quả mức độ hợp nhau</p>
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
  person1Name: '',
  person1Birthdate: '',
  person2Name: '',
  person2Birthdate: '',
  relationshipType: 'lover' // Mặc định là người yêu
});

const tabs = [
  { label: 'Người yêu', value: 'lover' },
  { label: 'Bạn bè', value: 'friend' },
  { label: 'Đối tác', value: 'partner' }
];

const result = ref('');
const loading = ref(false);

const parsedResult = computed(() => {
  return result.value ? marked(result.value) : '';
});

const checkCompatibility = async () => {
  if (!formData.value.person1Name) {
    toast.error('Vui lòng nhập họ và tên người 1!', { position: 'top-center' });
    return;
  }
  if (!formData.value.person1Birthdate) {
    toast.error('Vui lòng nhập ngày sinh người 1!', { position: 'top-center' });
    return;
  }
  if (!formData.value.person2Name) {
    toast.error('Vui lòng nhập họ và tên người 2!', { position: 'top-center' });
    return;
  }
  if (!formData.value.person2Birthdate) {
    toast.error('Vui lòng nhập ngày sinh người 2!', { position: 'top-center' });
    return;
  }

  loading.value = true;
  try {
    const username = localStorage.getItem('username') || 'guest';
    const encodedUsername = encodeURIComponent(username);
    const response = await fetch('/api/numerology/compatibility', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-username': encodedUsername,
      },
      body: JSON.stringify({
        person1Name: formData.value.person1Name,
        person1Birthdate: formData.value.person1Birthdate,
        person2Name: formData.value.person2Name,
        person2Birthdate: formData.value.person2Birthdate,
        relationshipType: formData.value.relationshipType // Gửi loại quan hệ
      }),
    });

    if (response.ok) {
      const data = await response.json();
      result.value = data.answer || 'Kết quả kiểm tra hợp nhau đang được phát triển...';
      toast.success('Kiểm tra hoàn tất!', { position: 'top-center' });
    } else {
      toast.error('Không thể kiểm tra hợp nhau!', { position: 'top-center' });
    }
  } catch (error) {
    console.error('Error checking compatibility:', error);
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