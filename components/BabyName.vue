<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-2xl font-semibold text-purple-700 mb-6 flex items-center">
      <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Đặt tên con
    </h2>

    <div class="space-y-6">
      <!-- Các input giữ nguyên -->
      <div>
        <label for="motherName" class="block text-gray-700 font-medium mb-2">Họ và tên mẹ</label>
        <input
          v-model="formData.motherName"
          type="text"
          id="motherName"
          placeholder="Nhập họ và tên mẹ"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label for="motherBirthdate" class="block text-gray-700 font-medium mb-2">Ngày sinh mẹ (dd/mm/yyyy)</label>
        <input
          v-model="formData.motherBirthdate"
          type="text"
          id="motherBirthdate"
          placeholder="Ví dụ: 15/08/1995"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label for="fatherName" class="block text-gray-700 font-medium mb-2">Họ và tên bố</label>
        <input
          v-model="formData.fatherName"
          type="text"
          id="fatherName"
          placeholder="Nhập họ và tên bố"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label for="fatherBirthdate" class="block text-gray-700 font-medium mb-2">Ngày sinh bố (dd/mm/yyyy)</label>
        <input
          v-model="formData.fatherBirthdate"
          type="text"
          id="fatherBirthdate"
          placeholder="Ví dụ: 14/03/1990"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label for="babyBirthdate" class="block text-gray-700 font-medium mb-2">Ngày sinh bé (dd/mm/yyyy, nếu có)</label>
        <input
          v-model="formData.babyBirthdate"
          type="text"
          id="babyBirthdate"
          placeholder="Ví dụ: 01/01/2023"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label for="gender" class="block text-gray-700 font-medium mb-2">Giới tính của con</label>
        <select
          v-model="formData.gender"
          id="gender"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="male">Bé trai</option>
          <option value="female">Bé gái</option>
          <option value="neutral">Trung tính</option>
        </select>
      </div>
      <div>
        <label for="babyBirthMonth" class="block text-gray-700 font-medium mb-2">Tháng sinh của con (1-12, tùy chọn)</label>
        <input
          v-model.number="formData.babyBirthMonth"
          type="number"
          id="babyBirthMonth"
          min="1"
          max="12"
          placeholder="Nhập tháng (1-12)"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label for="additionalRequest" class="block text-gray-700 font-medium mb-2">Yêu cầu thêm (tùy chọn)</label>
        <input
          v-model="formData.additionalRequest"
          type="text"
          id="additionalRequest"
          placeholder="Ví dụ: Tên có chữ Minh, theo họ mẹ"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <button
        @click="suggestBabyName"
        :disabled="loading"
        class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
      >
        {{ loading ? 'Đang đề xuất...' : 'Đề xuất tên con' }}
      </button>

      <!-- Hiển thị kết quả -->
      <div v-if="result" class="mt-4 p-6 bg-purple-50 rounded-lg">
        <p class="text-purple-800 font-semibold text-lg mb-2">Phân tích và tên đề xuất</p>
        <div class="text-gray-700 whitespace-pre-wrap">
          <p class="mb-4">{{ result.analysis }}</p>
          <div class="space-y-4">
            <div v-for="(name, index) in result.names" :key="index">
              <p v-html="marked(name.name)" class="font-bold"></p>
              <p>{{ name.meaning }}</p>
            </div>
          </div>
          <p class="mt-4 font-semibold">Lời khuyên:</p>
          <ul class="list-disc pl-5">
            <li v-for="(tip, index) in result.tips" :key="index">{{ tip }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import { marked } from 'marked';

const formData = ref({
  motherName: '',
  motherBirthdate: '',
  fatherName: '',
  fatherBirthdate: '',
  babyBirthdate: '',
  gender: 'neutral',
  babyBirthMonth: null,
  additionalRequest: ''
});
const result = ref(null);
const loading = ref(false);

const suggestBabyName = async () => {
  if (!formData.value.motherName) {
    toast.error('Vui lòng nhập họ và tên mẹ!', { position: 'top-center' });
    return;
  }
  if (!formData.value.motherBirthdate) {
    toast.error('Vui lòng nhập ngày sinh mẹ!', { position: 'top-center' });
    return;
  }
  if (!formData.value.fatherName) {
    toast.error('Vui lòng nhập họ và tên bố!', { position: 'top-center' });
    return;
  }
  if (!formData.value.fatherBirthdate) {
    toast.error('Vui lòng nhập ngày sinh bố!', { position: 'top-center' });
    return;
  }

  loading.value = true;
  try {
    const username = localStorage.getItem('username') || 'guest';
    const encodedUsername = encodeURIComponent(username);
    const response = await fetch('/api/numerology/baby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-username': encodedUsername,
      },
      body: JSON.stringify({
        motherName: formData.value.motherName,
        motherBirthdate: formData.value.motherBirthdate,
        fatherName: formData.value.fatherName,
        fatherBirthdate: formData.value.fatherBirthdate,
        babyBirthdate: formData.value.babyBirthdate || '',
        gender: formData.value.gender,
        babyBirthMonth: formData.value.babyBirthMonth || null,
        additionalRequest: formData.value.additionalRequest || ''
      }),
    });

    if (response.ok) {
      const data = await response.json();
      result.value = data;
      toast.success('Đề xuất tên con đã hoàn tất!', { position: 'top-center' });
    } else {
      const errorData = await response.json();
      toast.error(`Không thể đề xuất tên con: ${errorData.statusMessage || 'Lỗi không xác định'}`, { position: 'top-center' });
    }
  } catch (error) {
    console.error('Error suggesting baby name:', error);
    toast.error('Có lỗi xảy ra khi đề xuất tên con!', { position: 'top-center' });
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