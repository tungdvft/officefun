<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-2xl font-semibold text-purple-700 mb-6">Đặt tên danh xưng (Quốc tế)</h2>
    <div class="space-y-6">
      <div>
        <label for="name" class="block text-gray-700 font-medium mb-2">Họ và tên</label>
        <input v-model="formData.name" type="text" id="name" placeholder="Nhập họ và tên" class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
      </div>
      <div>
        <label for="birthdate" class="block text-gray-700 font-medium mb-2">Ngày sinh (dd/mm/yyyy)</label>
        <input v-model="formData.birthdate" type="text" id="birthdate" placeholder="Ví dụ: 15/03/1995" class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-2">Giới tính</label>
        <div class="flex space-x-4">
          <label><input type="radio" v-model="formData.gender" value="male" /> Nam</label>
          <label><input type="radio" v-model="formData.gender" value="female" /> Nữ</label>
        </div>
      </div>
      <button @click="generateNickname" :disabled="loading" class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400">
        {{ loading ? 'Đang xử lý...' : 'Tạo danh xưng' }}
      </button>

      <div v-if="result" class="mt-4 p-6 bg-purple-50 rounded-lg whitespace-pre-line">
        <p class="text-purple-800 font-semibold text-lg mb-2">Danh xưng đề xuất</p>
        <div v-html="parsedResult"></div>
        <div class="mt-4 flex space-x-4">
          <button @click="shareViaMessenger" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Chia sẻ qua Messenger</button>
          <button @click="copyToClipboard" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Sao chép để chia sẻ qua Zalo</button>
          <ClientOnly>
            <button @click="downloadPDF" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">Tải PDF</button>
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';
import { marked } from 'marked';

// Chỉ import jspdf ở client-side
const jspdf = process.client ? await import('jspdf').then(module => module.jsPDF) : null;

const formData = ref({
  name: '',
  birthdate: '',
  gender: 'male' // Mặc định là nam
});
const result = ref('');
const loading = ref(false);

const parsedResult = computed(() => result.value ? marked(result.value) : '');

const generateNickname = async () => {
  if (!formData.value.name) {
    toast.error('Vui lòng nhập họ và tên!');
    return;
  }
  if (!formData.value.birthdate) {
    toast.error('Vui lòng nhập ngày sinh!');
    return;
  }
  if (!formData.value.gender) {
    toast.error('Vui lòng chọn giới tính!');
    return;
  }

  loading.value = true;
  try {
    const response = await $fetch('/api/numerology/nickname', {
      method: 'POST',
      body: {
        name: formData.value.name,
        birthdate: formData.value.birthdate,
        gender: formData.value.gender
      },
    });

    result.value = response.answer;
    toast.success('Đặt danh xưng hoàn tất!');
  } catch (error) {
    console.error('Error:', error);
    toast.error('Không thể tạo danh xưng!');
  } finally {
    loading.value = false;
  }
};

const shareViaMessenger = () => {
  if (!process.client || typeof FB === 'undefined') {
    toast.error('Facebook SDK chưa tải xong, thử lại sau!');
    return;
  }
  FB.ui({
    method: 'send',
    link: window.location.href,
    quote: result.value,
  }, (response) => {
    if (response && !response.error) toast.success('Đã chia sẻ qua Messenger!');
    else toast.error('Có lỗi khi chia sẻ qua Messenger!');
  });
};

const copyToClipboard = () => {
  if (!process.client) return;
  navigator.clipboard.writeText(result.value).then(() => {
    toast.success('Đã sao chép kết quả! Dán vào Zalo để chia sẻ.');
  }).catch(() => {
    toast.error('Không thể sao chép!');
  });
};

const downloadPDF = () => {
  if (!process.client || !jspdf) {
    toast.error('Không thể tải PDF trên server-side!');
    return;
  }
  const doc = new jspdf();
  doc.setFont('times');
  doc.setFontSize(12);
  const lines = doc.splitTextToSize(result.value, 180);
  doc.text(lines, 10, 10);
  doc.save('nickname.pdf');
};
</script>

<style>
div[v-html] strong {
  font-weight: bold;
}
</style>