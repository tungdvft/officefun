<template>
  <div class="bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
    <div class="container mx-auto p-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Đặt Tên Thương Hiệu Theo Thần Số Học</h2>
        <p class="text-gray-600">Tạo tên thương hiệu phù hợp với năng lượng số của bạn</p>
      </div>

      <!-- Main Content -->
      <div class="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
        <!-- Form -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-purple-700 mb-4">Nhập thông tin thương hiệu</h3>
          <!-- Input Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="industry" class="block text-sm font-medium text-gray-700 mb-2">Ngành nghề</label>
              <input
                v-model="formData.industry"
                type="text"
                id="industry"
                placeholder="Ví dụ: Công nghệ, Thời trang"
                :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.industry ? 'border-red-500' : 'border-gray-300']"
              />
              <p v-if="errors.industry" class="text-red-600 text-sm mt-1">{{ errors.industry }}</p>
            </div>
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700 mb-2">Ngày thành lập/sinh (DD/MM/YYYY)</label>
              <input
                v-model="formData.date"
                type="text"
                id="date"
                placeholder="15/03/2020"
                :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.date ? 'border-red-500' : 'border-gray-300']"
              />
              <p v-if="errors.date" class="text-red-600 text-sm mt-1">{{ errors.date }}</p>
            </div>
          </div>
          <div>
            <label for="ownerName" class="block text-sm font-medium text-gray-700 mb-2">Tên chủ thương hiệu</label>
            <input
              v-model="formData.ownerName"
              type="text"
              id="ownerName"
              placeholder="Nguyễn Văn A"
              :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.ownerName ? 'border-red-500' : 'border-gray-300']"
            />
            <p v-if="errors.ownerName" class="text-red-600 text-sm mt-1">{{ errors.ownerName }}</p>
          </div>
          <div>
            <label for="extraRequest" class="block text-sm font-medium text-gray-700 mb-2">Yêu cầu bổ sung (tùy chọn)</label>
            <textarea
              v-model="formData.extraRequest"
              id="extraRequest"
              rows="3"
              placeholder="Ví dụ: Có chữ 'hot', ngắn gọn, sang trọng..."
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition resize-none"
            ></textarea>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Giới tính founder (nếu dùng ngày sinh)</label>
              <div class="flex flex-wrap gap-4">
                <label class="flex items-center">
                  <input type="radio" v-model="formData.gender" value="male" class="mr-2" />
                  <span class="text-gray-700">Nam</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="formData.gender" value="female" class="mr-2" />
                  <span class="text-gray-700">Nữ</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="formData.gender" value="none" class="mr-2" />
                  <span class="text-gray-700">Không áp dụng</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ tên thương hiệu</label>
              <div class="flex flex-wrap gap-4">
                <label class="flex items-center">
                  <input type="radio" v-model="formData.language" value="english" class="mr-2" />
                  <span class="text-gray-700">Tiếng Anh</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="formData.language" value="vietnamese" class="mr-2" />
                  <span class="text-gray-700">Tiếng Việt</span>
                </label>
              </div>
            </div>
          </div>
          <!-- Error Message -->
          <div v-if="errors.general" class="p-4 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200">
            {{ errors.general }}
          </div>
          <!-- Button -->
          <div class="flex justify-center">
            <button
              @click="generateReport"
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
                Đang phân tích...
              </span>
              <span v-else>Tạo gợi ý tên thương hiệu</span>
            </button>
          </div>
        </div>

        <!-- Results Section -->
        <transition name="slide-fade">
          <div v-if="numerologyData" class="mt-8 space-y-6">
            <!-- Thông tin đầu vào -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <h3 class="text-lg font-semibold text-purple-700 flex items-center">
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
                Thông tin thương hiệu
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p class="text-sm text-gray-500">Ngành nghề</p>
                  <p class="font-medium text-gray-800">{{ formData.industry }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Ngày</p>
                  <p class="font-medium text-gray-800">{{ formData.date }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tên chủ</p>
                  <p class="font-medium text-gray-800">{{ formData.ownerName }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Yêu cầu</p>
                  <p class="font-medium text-gray-800">{{ formData.extraRequest || 'Không có' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Giới tính</p>
                  <p class="font-medium text-gray-800">
                    {{ formData.gender === 'none' ? 'Không áp dụng' : formData.gender === 'male' ? 'Nam' : 'Nữ' }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Ngôn ngữ</p>
                  <p class="font-medium text-gray-800">
                    {{ formData.language === 'english' ? 'Tiếng Anh' : 'Tiếng Việt' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Các con số chính -->
            <div>
              <h3 class="text-lg font-semibold text-purple-700 mb-4 flex items-center">
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
                Các con số chính
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-center mb-2">
                    <span class="text-3xl font-bold text-purple-600 mr-3">{{ numerologyData.lifePath }}</span>
                    <div>
                      <h4 class="font-semibold text-gray-800">Số chủ đạo</h4>
                      <p class="text-sm text-gray-500">Con số đường đời</p>
                    </div>
                  </div>
                  <p class="text-gray-600">{{ numerologyData.lifePathDesc }}</p>
                </div>
                <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-center mb-2">
                    <span class="text-3xl font-bold text-purple-600 mr-3">{{ numerologyData.soul }}</span>
                    <div>
                      <h4 class="font-semibold text-gray-800">Số linh hồn</h4>
                      <p class="text-sm text-gray-500">Mong muốn nội tâm</p>
                    </div>
                  </div>
                  <p class="text-gray-600">{{ numerologyData.soulDesc }}</p>
                </div>
                <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-center mb-2">
                    <span class="text-3xl font-bold text-purple-600 mr-3">{{ numerologyData.personality }}</span>
                    <div>
                      <h4 class="font-semibold text-gray-800">Số nhân cách</h4>
                      <p class="text-sm text-gray-500">Phong cách bên ngoài</p>
                    </div>
                  </div>
                  <p class="text-gray-600">{{ numerologyData.personalityDesc }}</p>
                </div>
                <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-center mb-2">
                    <span class="text-3xl font-bold text-purple-600 mr-3">{{ numerologyData.destiny }}</span>
                    <div>
                      <h4 class="font-semibold text-gray-800">Số định mệnh</h4>
                      <p class="text-sm text-gray-500">Sứ mệnh thương hiệu</p>
                    </div>
                  </div>
                  <p class="text-gray-600">{{ numerologyData.destinyDesc }}</p>
                </div>
              </div>
            </div>

            <!-- Phân tích tổng quan -->
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 class="text-lg font-semibold text-purple-700 flex items-center">
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
              <p class="text-gray-600 mt-2 whitespace-pre-line">{{ numerologyData.generalAnalysis }}</p>
            </div>

            <!-- Gợi ý tên thương hiệu -->
            <div>
              <h3 class="text-lg font-semibold text-purple-700 mb-4 flex items-center">
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
                Gợi ý tên thương hiệu
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  v-for="(suggestion, index) in numerologyData.suggestions"
                  :key="index"
                  class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div class="flex items-start mb-4">
                    <span
                      class="w-10 h-10 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full font-bold mr-3"
                    >
                      {{ index + 1 }}
                    </span>
                    <div>
                      <h4 class="text-lg font-semibold text-gray-800">{{ suggestion.name }}</h4>
                      <p class="text-sm text-gray-500">
                        Số linh hồn: {{ suggestion.soul }} | Số định mệnh: {{ suggestion.destiny }}
                      </p>
                    </div>
                  </div>
                  <p class="text-gray-600 mb-4">{{ suggestion.desc }}</p>
                  <div class="p-4 bg-purple-50 rounded-lg">
                    <p class="font-medium text-purple-700">Gợi ý logo:</p>
                    <p class="text-gray-600">{{ suggestion.logoSuggestion }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Lời khuyên -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <h3 class="text-lg font-semibold text-purple-700 flex items-center">
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
                Lời khuyên phát triển thương hiệu
              </h3>
              <p class="text-gray-600 mt-2 whitespace-pre-line">{{ numerologyData.brandAdvice }}</p>
            </div>

            <!-- Nút tải và chia sẻ -->
            <div class="flex flex-wrap gap-3 justify-center">
              <ClientOnly>
                <button
                  @click="downloadPDF"
                  class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 shadow-sm"
                >
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                  </svg>
                  Tải báo cáo PDF
                </button>
              </ClientOnly>
              <button
                @click="shareResult('zalo')"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 shadow-sm"
              >
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"
                  />
                </svg>
                Chia sẻ Zalo
              </button>
              <button
                @click="shareResult('facebook')"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 shadow-sm"
              >
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  />
                </svg>
                Chia sẻ Facebook
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { toast } from 'vue3-toastify';

definePageMeta({ layout: 'view' });

const formData = ref({
  industry: '',
  date: '',
  ownerName: '',
  extraRequest: '',
  gender: 'none',
  language: 'english'
});
const numerologyData = ref(null);
const loading = ref(false);
const errors = ref({
  industry: '',
  date: '',
  ownerName: '',
  general: ''
});

// Load saved data from localStorage on mount
onMounted(() => {
  const savedData = localStorage.getItem('brandNumerologyData');
  if (savedData) {
    const parsed = JSON.parse(savedData);
    formData.value = parsed.formData || {
      industry: '',
      date: '',
      ownerName: '',
      extraRequest: '',
      gender: 'none',
      language: 'english'
    };
    numerologyData.value = parsed.numerologyData || null;
  }
});

// Save data to localStorage on change
watch([formData, numerologyData], () => {
  localStorage.setItem('brandNumerologyData', JSON.stringify({
    formData: formData.value,
    numerologyData: numerologyData.value
  }));
}, { deep: true });

// Validate form
const validateForm = () => {
  errors.value = {
    industry: '',
    date: '',
    ownerName: '',
    general: ''
  };
  let isValid = true;

  if (!formData.value.industry.trim()) {
    errors.value.industry = 'Vui lòng nhập ngành nghề';
    isValid = false;
  }
  if (!formData.value.date.trim()) {
    errors.value.date = 'Vui lòng nhập ngày thành lập hoặc ngày sinh';
    isValid = false;
  } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.value.date)) {
    errors.value.date = 'Vui lòng nhập ngày đúng định dạng DD/MM/YYYY';
    isValid = false;
  } else {
    const match = formData.value.date.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    const date = new Date(year, month - 1, day);
    if (
      date.getDate() !== day ||
      date.getMonth() + 1 !== month ||
      date.getFullYear() !== year ||
      year < 1900 ||
      year > new Date().getFullYear()
    ) {
      errors.value.date = 'Ngày không hợp lệ';
      isValid = false;
    }
  }
  if (!formData.value.ownerName.trim()) {
    errors.value.ownerName = 'Vui lòng nhập tên chủ thương hiệu';
    isValid = false;
  }

  return isValid;
};

const generateReport = async () => {
  if (!validateForm()) return;

  loading.value = true;
  errors.value.general = '';
  try {
    const username = localStorage.getItem('username') || 'guest';
    const response = await $fetch('/api/numerology/brand', {
      method: 'POST',
      headers: { 
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: { 
        ...formData.value, 
        extraRequest: `${formData.value.extraRequest || ''} Tên bằng ${formData.value.language === 'english' ? 'tiếng Anh' : 'tiếng Việt'}` 
      }
    });
    numerologyData.value = response.numerology;
    toast.success('Tạo gợi ý tên thương hiệu hoàn tất!', { position: 'top-center' });
  } catch (error) {
    console.error('Error:', error);
    errors.value.general = error.data?.message || 'Có lỗi xảy ra!';
  } finally {
    loading.value = false;
  }
};

const shareResult = (platform) => {
  if (!numerologyData.value) return;
  const text = [
    `Gợi ý tên thương hiệu cho ${formData.value.ownerName} (${formData.value.industry})`,
    `Số chủ đạo: ${numerologyData.value.lifePath} - ${numerologyData.value.lifePathDesc}`,
    `Số linh hồn: ${numerologyData.value.soul} - ${numerologyData.value.soulDesc}`,
    `Số nhân cách: ${numerologyData.value.personality} - ${numerologyData.value.personalityDesc}`,
    `Số định mệnh: ${numerologyData.value.destiny} - ${numerologyData.value.destinyDesc}`,
    `Phân tích tổng quan: ${numerologyData.value.generalAnalysis}`,
    `Gợi ý tên thương hiệu:`,
    ...numerologyData.value.suggestions.map(s => `- ${s.name} (Số linh hồn: ${s.soul}, Số định mệnh: ${s.destiny}): ${s.desc}\n  Logo: ${s.logoSuggestion}`),
    `Lời khuyên: ${numerologyData.value.brandAdvice}`
  ].join('\n\n');

  if (platform === 'facebook' && process.client) {
    if (typeof FB !== 'undefined') {
      FB.ui({
        method: 'share',
        href: window.location.href,
        quote: text
      }, (response) => {
        if (response && !response.error) toast.success('Đã chia sẻ lên Facebook!');
        else toast.error('Có lỗi khi chia sẻ lên Facebook!');
      });
    } else {
      toast.error('Facebook SDK chưa tải, thử lại sau!');
    }
  } else if (platform === 'zalo' && process.client) {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Đã sao chép kết quả! Dán vào Zalo để chia sẻ.');
    }).catch(() => toast.error('Không thể sao chép!'));
  }
};

const downloadPDF = async () => {
  if (!process.client) return toast.error('Không thể tải PDF trên server!');
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.setFont('helvetica');
  doc.setFontSize(12);
  let y = 10;

  doc.setFontSize(16);
  doc.text(`Gợi ý tên thương hiệu cho ${formData.value.ownerName}`, 10, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Ngành nghề: ${formData.value.industry}`, 10, y); y += 7;
  doc.text(`Ngày: ${formData.value.date}`, 10, y); y += 7;
  doc.text(`Tên chủ: ${formData.value.ownerName}`, 10, y); y += 7;
  doc.text(`Yêu cầu: ${formData.value.extraRequest || 'Không có'}`, 10, y); y += 7;
  doc.text(`Giới tính: ${formData.value.gender === 'none' ? 'Không áp dụng' : formData.value.gender === 'male' ? 'Nam' : 'Nữ'}`, 10, y); y += 7;
  doc.text(`Ngôn ngữ: ${formData.value.language === 'english' ? 'Tiếng Anh' : 'Tiếng Việt'}`, 10, y); y += 10;

  const addSection = (title, content) => {
    if (y > 260) { doc.addPage(); y = 10; }
    doc.setFontSize(14);
    doc.text(title, 10, y);
    y += 7;
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 10, y);
    y += lines.length * 7 + 10;
  };

  addSection('Các con số chính', [
    `Số chủ đạo: ${numerologyData.value.lifePath} - ${numerologyData.value.lifePathDesc}`,
    `Số linh hồn: ${numerologyData.value.soul} - ${numerologyData.value.soulDesc}`,
    `Số nhân cách: ${numerologyData.value.personality} - ${numerologyData.value.personalityDesc}`,
    `Số định mệnh: ${numerologyData.value.destiny} - ${numerologyData.value.destinyDesc}`
  ].join('\n'));

  addSection('Phân tích tổng quan', numerologyData.value.generalAnalysis);

  doc.setFontSize(14);
  doc.text('Gợi ý tên thương hiệu:', 10, y); y += 7;
  doc.setFontSize(12);
  numerologyData.value.suggestions.forEach(s => {
    if (y > 260) { doc.addPage(); y = 10; }
    const text = `${s.name} (Số linh hồn: ${s.soul}, Số định mệnh: ${s.destiny})\nMô tả: ${s.desc}\nLogo: ${s.logoSuggestion}`;
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, y);
    y += lines.length * 7 + 5;
  });

  addSection('Lời khuyên phát triển thương hiệu', numerologyData.value.brandAdvice);

  doc.save(`brand-numerology-${formData.value.ownerName}.pdf`);
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