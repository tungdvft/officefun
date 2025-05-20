<template>
  <div class="bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
    <div class="container mx-auto p-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Giải Đáp Thắc Mắc - Thần Số Học</h2>
        <p class="text-gray-600">Hỏi đáp dựa trên năng lượng số của bạn</p>
      </div>

      <!-- Main Content -->
      <div class="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
        <!-- Form -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-purple-700 mb-4">Nhập thông tin và câu hỏi</h3>
          <!-- Input Form for Name and Birth Date in Two Columns -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
              <input
                v-model="formData.name"
                type="text"
                id="name"
                placeholder="Ví dụ: Nguyễn Văn A"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
            <div>
              <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh (DD/MM/YYYY)</label>
              <input
                v-model="formData.birthDate"
                type="text"
                id="birthDate"
                placeholder="Ví dụ: 15/03/1995"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
          </div>
          <!-- Question Input -->
          <div>
            <label for="question" class="block text-sm font-medium text-gray-700 mb-2">Câu hỏi của bạn</label>
            <textarea
              v-model="formData.question"
              id="question"
              placeholder="Ví dụ: Tôi có nên học thạc sĩ trong năm nay không?"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition h-24 resize-none"
            ></textarea>
          </div>
          <div class="flex justify-center">
            <button
              @click="consult"
              :disabled="loading"
              class="w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-3 px-8 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-md"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </span>
              <span v-else>Gửi câu hỏi</span>
            </button>
          </div>
        </div>

        <!-- Results Section -->
        <transition name="slide-fade">
          <div v-if="result" class="mt-8 space-y-6">
            <!-- Số chủ đạo -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <div class="flex items-center">
                <div class="bg-purple-100 p-2 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-purple-800">
                    Số chủ đạo: <span class="text-2xl font-bold">{{ result.lifePath }}</span>
                  </h3>
                  <p v-text="result.lifePathDesc" class="text-gray-600 mt-1"></p>
                </div>
              </div>
            </div>

            <!-- Số năm cá nhân -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <div class="flex items-center">
                <div class="bg-purple-100 p-2 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-purple-800">
                    Số năm cá nhân {{ currentYear }}: <span class="text-2xl font-bold">{{ result.personalYear }}</span>
                  </h3>
                  <p v-text="result.personalYearDesc" class="text-gray-600 mt-1"></p>
                </div>
              </div>
            </div>

            <!-- Phân tích -->
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 class="font-medium text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Phân tích tổng quan
              </h3>
              <p v-text="result.analysis" class="text-gray-600 mt-2"></p>
            </div>

            <!-- Cơ hội -->
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 class="font-medium text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fill-rule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Cơ hội
              </h3>
              <p v-text="result.opportunities" class="text-gray-600 mt-2"></p>
            </div>

            <!-- Thách thức -->
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 class="font-medium text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Thách thức
              </h3>
              <p v-text="result.challenges" class="text-gray-600 mt-2"></p>
            </div>

            <!-- Lời khuyên -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <h3 class="font-medium text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Lời khuyên
              </h3>
              <p v-text="result.advice" class="text-gray-600 mt-2"></p>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { toast } from 'vue3-toastify';

definePageMeta({ layout: 'view' });

const formData = ref({
  name: '',
  birthDate: '',
  question: ''
});

const result = ref(null);
const loading = ref(false);
const currentYear = new Date().getFullYear();

// Hàm làm sạch dữ liệu, loại bỏ ký tự không hợp lệ
const cleanString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/["'<]/g, '');
};

// Computed property để làm sạch formData
const cleanedFormData = computed({
  get: () => ({
    name: cleanString(formData.value.name),
    birthDate: cleanString(formData.value.birthDate),
    question: cleanString(formData.value.question)
  }),
  set: (newValue) => {
    formData.value = {
      name: newValue.name,
      birthDate: newValue.birthDate,
      question: newValue.question
    };
  }
});

// Làm sạch dữ liệu result từ API
const cleanResult = (data) => {
  if (!data) return null;
  return {
    lifePath: cleanString(data.lifePath),
    lifePathDesc: cleanString(data.lifePathDesc),
    personalYear: cleanString(data.personalYear),
    personalYearDesc: cleanString(data.personalYearDesc),
    analysis: cleanString(data.analysis),
    opportunities: cleanString(data.opportunities),
    challenges: cleanString(data.challenges),
    advice: cleanString(data.advice)
  };
};

// Khôi phục dữ liệu từ Local Storage (chỉ ở client)
onMounted(() => {
  if (process.client) {
    console.log('Running on client, restoring localStorage');
    try {
      const savedFormData = localStorage.getItem('numerologyFormData');
      const savedResult = localStorage.getItem('numerologyResult');

      if (savedFormData) {
        const parsedFormData = JSON.parse(savedFormData);
        if (parsedFormData && typeof parsedFormData === 'object') {
          formData.value = {
            name: cleanString(parsedFormData.name),
            birthDate: cleanString(parsedFormData.birthDate),
            question: cleanString(parsedFormData.question)
          };
          console.log('Khôi phục formData:', formData.value);
        }
      }

      if (savedResult) {
        const parsedResult = JSON.parse(savedResult);
        if (parsedResult && typeof parsedResult === 'object') {
          result.value = cleanResult(parsedResult);
          console.log('Khôi phục result:', result.value);
        }
      }
    } catch (error) {
      console.error('Lỗi khi khôi phục dữ liệu từ Local Storage:', error);
      toast.error('Không thể khôi phục dữ liệu cũ!', { position: 'top-center' });
    }
  } else {
    console.log('Running on server, skipping localStorage');
  }
});

// Lưu formData khi thay đổi (chỉ ở client)
watch(
  () => cleanedFormData.value,
  (newFormData) => {
    if (process.client) {
      try {
        localStorage.setItem('numerologyFormData', JSON.stringify(newFormData));
        console.log('Lưu formData:', newFormData);
      } catch (error) {
        console.error('Lỗi khi lưu formData vào Local Storage:', error);
        toast.error('Không thể lưu dữ liệu form!', { position: 'top-center' });
      }
    }
  },
  { deep: true, immediate: true }
);

// Lưu result khi thay đổi (chỉ ở client)
watch(
  () => result.value,
  (newResult) => {
    if (process.client) {
      try {
        if (newResult) {
          localStorage.setItem('numerologyResult', JSON.stringify(newResult));
          console.log('Lưu result:', newResult);
        } else {
          localStorage.removeItem('numerologyResult');
          console.log('Xóa result khỏi Local Storage');
        }
      } catch (error) {
        console.error('Lỗi khi lưu result vào Local Storage:', error);
        toast.error('Không thể lưu kết quả!', { position: 'top-center' });
      }
    }
  },
  { immediate: true }
);

const consult = async () => {
  if (!cleanedFormData.value.name) return toast.error('Vui lòng nhập họ và tên!', { position: 'top-center' });
  if (!cleanedFormData.value.birthDate) return toast.error('Vui lòng nhập ngày sinh!', { position: 'top-center' });
  if (!cleanedFormData.value.question) return toast.error('Vui lòng nhập câu hỏi!', { position: 'top-center' });

  loading.value = true;
  try {
    const username = process.client ? localStorage.getItem('username') || 'guest' : 'guest';
    const response = await $fetch('/api/numerology/consult', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: cleanedFormData.value
    });
    result.value = cleanResult(response.consult);
    toast.success('Giải đáp hoàn tất!', { position: 'top-center' });
  } catch (error) {
    console.error('Error consulting:', error);
    toast.error(error.data?.message || 'Có lỗi xảy ra!', { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Custom transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>