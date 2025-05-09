<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-white bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">Kiểm tra mức độ hợp nhau</h2>
          <p class="text-purple-100 mt-1">Phân tích mối quan hệ dựa trên thần số học</p>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Tabs -->
      <div class="flex overflow-x-auto pb-2 -mx-6 px-6">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="formData.relationshipType = tab.value"
          :class="[
            'flex-shrink-0 py-2 px-4 font-medium rounded-full transition-colors duration-200',
            formData.relationshipType === tab.value
              ? 'bg-purple-100 text-purple-700 shadow-sm'
              : 'text-gray-500 hover:bg-gray-100'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Form -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <h3 class="text-lg font-semibold text-purple-700 mb-4 flex items-center">
            <span class="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full mr-2">1</span>
            Thông tin người 1
          </h3>
          <div class="space-y-4">
            <div>
              <label for="person1Name" class="form-label">Họ và tên</label>
              <input v-model="formData.person1Name" type="text" id="person1Name" placeholder="Nguyễn Văn A" class="form-input" />
            </div>
            <div>
              <label for="person1Birthdate" class="form-label">Ngày sinh (dd/mm/yyyy hoặc dd-mm-yyyy)</label>
              <div class="relative">
                <input v-model="formData.person1Birthdate" type="text" id="person1Birthdate" placeholder="15/08/1995" class="form-input pl-10" />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <h3 class="text-lg font-semibold text-purple-700 mb-4 flex items-center">
            <span class="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full mr-2">2</span>
            Thông tin người 2
          </h3>
          <div class="space-y-4">
            <div>
              <label for="person2Name" class="form-label">Họ và tên</label>
              <input v-model="formData.person2Name" type="text" id="person2Name" placeholder="Trần Thị B" class="form-input" />
            </div>
            <div>
              <label for="person2Birthdate" class="form-label">Ngày sinh (dd/mm/yyyy hoặc dd-mm-yyyy)</label>
              <div class="relative">
                <input v-model="formData.person2Birthdate" type="text" id="person2Birthdate" placeholder="14/03/1990" class="form-input pl-10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button @click="checkCompatibility" :disabled="loading" class="w-full btn-primary">
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang kiểm tra...
        </span>
        <span v-else>Kiểm tra ngay</span>
      </button>

      <!-- Kết quả -->
      <transition name="fade-slide">
        <div v-if="result" class="mt-6 space-y-6">
          <!-- Tổng quan -->
          <div class="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-purple-900">Tổng quan mối quan hệ</h3>
              <div class="flex items-center">
                <span class="text-3xl font-bold text-purple-600 mr-2">{{ compatibilityScore }}</span>
                <div class="relative w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="absolute h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" :style="{ width: `${compatibilityScore * 10}%` }"></div>
                </div>
                <span class="ml-2 text-gray-500">/10</span>
              </div>
            </div>
            <p class="text-gray-700 whitespace-pre-wrap">{{ result.overview }}</p>
            <p class="text-gray-600 mt-2 italic">{{ compatibilityExplanation }}</p>
          </div>

          <!-- Các mục khác -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h4 class="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Điểm mạnh
              </h4>
              <p class="text-gray-700 whitespace-pre-wrap">{{ result.strengths }}</p>
            </div>
            <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h4 class="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Điểm yếu
              </h4>
              <p class="text-gray-700 whitespace-pre-wrap">{{ result.weaknesses }}</p>
            </div>
            <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h4 class="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                <svg class="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Tiềm năng
              </h4>
              <p class="text-gray-700 whitespace-pre-wrap">{{ result.potential }}</p>
            </div>
            <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h4 class="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                <svg class="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Thách thức
              </h4>
              <p class="text-gray-700 whitespace-pre-wrap">{{ result.challenges }}</p>
            </div>
          </div>

          <!-- Gợi ý -->
          <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h4 class="text-lg font-semibold text-indigo-700 mb-3 flex items-center">
              <svg class="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Gợi ý phát triển mối quan hệ
            </h4>
            <p class="text-gray-700 whitespace-pre-wrap">{{ result.advice }}</p>
          </div>

        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';
import { drawDOM, exportPDF } from '@progress/kendo-drawing';

const formData = ref({
  person1Name: '',
  person1Birthdate: '',
  person2Name: '',
  person2Birthdate: '',
  relationshipType: 'lover'
});

const tabs = [
  { label: 'Người yêu', value: 'lover' },
  { label: 'Vợ chồng', value: 'spouse' },
  { label: 'Bạn bè', value: 'friend' },
  { label: 'Đối tác', value: 'partner' }
];

const result = ref(null);
const loading = ref(false);

const compatibilityScore = computed(() => {
  if (!result.value?.compatibility) return 0;
  const match = result.value.compatibility.match(/Mức độ hợp nhau: (\d+)\/10/);
  return match ? parseInt(match[1]) : 0;
});

const compatibilityExplanation = computed(() => {
  if (!result.value?.compatibility) return '';
  return result.value.compatibility.replace(/Mức độ hợp nhau: \d+\/10\.?\s*/, '');
});

const checkCompatibility = async () => {
  if (!formData.value.person1Name) return toast.error('Vui lòng nhập họ và tên người 1!', { position: 'top-center' });
  if (!formData.value.person1Birthdate) return toast.error('Vui lòng nhập ngày sinh người 1!', { position: 'top-center' });
  if (!formData.value.person2Name) return toast.error('Vui lòng nhập họ và tên người 2!', { position: 'top-center' });
  if (!formData.value.person2Birthdate) return toast.error('Vui lòng nhập ngày sinh người 2!', { position: 'top-center' });

  loading.value = true;
  try {
    const username = localStorage.getItem('username') || 'guest';
    const response = await $fetch('/api/numerology/compatibility', {
      method: 'POST',
      headers: { 
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(formData.value)
    });
    result.value = response;
    toast.success('Kiểm tra hoàn tất!', { position: 'top-center' });
  } catch (error) {
    console.error('Error checking compatibility:', error);
    toast.error(error.data?.message || 'Có lỗi xảy ra!', { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};

</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.form-label {
  @apply block text-gray-700 font-medium mb-1;
}

.form-input {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200;
}

.btn-primary {
  @apply bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition duration-200 shadow-md font-medium;
}

.btn-share {
  @apply text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 shadow-sm;
}
</style>