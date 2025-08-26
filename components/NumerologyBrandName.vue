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
                @input="clearError('industry')"
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
                @input="clearError('date')"
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
              @input="clearError('ownerName')"
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
              @input="clearError('general')"
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
          <!-- Error, Loading, or Action Button -->
          <div v-if="isLoading || loading" class="flex justify-center">
            <svg
              class="animate-spin h-8 w-8 text-purple-600"
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
          </div>
          <div v-else-if="errors.general" class="text-red-600 text-center font-medium p-6">
            {{ errors.general }}
          </div>
          <div v-else class="text-center p-6">
            <button @click="generateReport" class="action-button">
              Tạo gợi ý tên thương hiệu
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
              <!-- Show More Suggestions Button -->
              <div v-if="numerologyData.suggestions.length < maxSuggestions" class="text-center p-6">
                <div v-if="isLoadingMore || loadingMore" class="flex justify-center">
                  <svg
                    class="animate-spin h-8 w-8 text-teal-600"
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
                </div>
                <div v-else class="text-center p-6">
                  <button @click="showMoreSuggestions" class="action-button">
                    Xem thêm gợi ý
                  </button>
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
  language: 'english',
});
const numerologyData = ref(null);
const loading = ref(false);
const loadingMore = ref(false);
const errors = ref({
  industry: '',
  date: '',
  ownerName: '',
  general: '',
});
const totalSuggestions = ref(0);
const existingNames = ref([]);
const maxSuggestions = ref(30);
const isLoading = ref(false);
const isLoadingMore = ref(false);

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
      language: 'english',
    };
    numerologyData.value = parsed.numerologyData || null;
    if (numerologyData.value?.suggestions) {
      totalSuggestions.value = numerologyData.value.suggestions.length;
      existingNames.value = numerologyData.value.suggestions.map((s) => s.name);
    }
  }
});

// Save data to localStorage on change
watch([formData, numerologyData], () => {
  localStorage.setItem('brandNumerologyData', JSON.stringify({
    formData: formData.value,
    numerologyData: numerologyData.value,
  }));
}, { deep: true });

// Hàm xóa lỗi
const clearError = (field) => {
  errors.value[field] = '';
  errors.value.general = '';
};

// Hàm tính số đường đời
const calculateLifePath = (dob) => {
  if (!dob || !/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) return null;
  const [day, month, year] = dob.split('/').map(Number);
  const daySum = Math.floor(day / 10) + (day % 10);
  const monthSum = Math.floor(month / 10) + (month % 10);
  const yearSum = year.toString().split('').reduce((acc, digit) => acc + Number(digit), 0);
  let sum = daySum + monthSum + yearSum;
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + Number(digit), 0);
  }
  return sum;
};

// Hàm tính số linh hồn (dựa trên nguyên âm trong tên)
const calculateSoulNumber = (name) => {
  if (!name) return null;
  const vowels = ['a', 'e', 'i', 'o', 'u', 'ă', 'â', 'ê', 'ô', 'ơ', 'ư'];
  const vowelSum = name.toLowerCase().split('')
    .filter(char => vowels.includes(char))
    .map(char => {
      const values = { 'a': 1, 'ă': 1, 'â': 1, 'e': 5, 'ê': 5, 'i': 9, 'o': 6, 'ô': 6, 'ơ': 6, 'u': 3, 'ư': 3 };
      return values[char] || 0;
    })
    .reduce((acc, val) => acc + val, 0);
  let sum = vowelSum;
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + Number(digit), 0);
  }
  return sum;
};

// Hàm tính số định mệnh (dựa trên toàn bộ tên)
const calculateDestinyNumber = (name) => {
  if (!name) return null;
  const letterValues = {
    'a': 1, 'ă': 1, 'â': 1, 'b': 2, 'c': 3, 'd': 4, 'đ': 4, 'e': 5, 'ê': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'ô': 6, 'ơ': 6, 'p': 7, 'q': 8, 'r': 9, 's': 1, 't': 2,
    'u': 3, 'ư': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
  };
  const nameSum = name.toLowerCase().split('')
    .map(char => letterValues[char] || 0)
    .reduce((acc, val) => acc + val, 0);
  let sum = nameSum;
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + Number(digit), 0);
  }
  return sum;
};

// Hàm tính số nhân cách (dựa trên phụ âm trong tên)
const calculatePersonalityNumber = (name) => {
  if (!name) return null;
  const vowels = ['a', 'e', 'i', 'o', 'u', 'ă', 'â', 'ê', 'ô', 'ơ', 'ư'];
  const letterValues = {
    'a': 1, 'ă': 1, 'â': 1, 'b': 2, 'c': 3, 'd': 4, 'đ': 4, 'e': 5, 'ê': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'ô': 6, 'ơ': 6, 'p': 7, 'q': 8, 'r': 9, 's': 1, 't': 2,
    'u': 3, 'ư': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
  };
  const consonantSum = name.toLowerCase().split('')
    .filter(char => !vowels.includes(char))
    .map(char => letterValues[char] || 0)
    .reduce((acc, val) => acc + val, 0);
  let sum = consonantSum;
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + Number(digit), 0);
  }
  return sum;
};

// Validate form
const validateForm = () => {
  errors.value = {
    industry: '',
    date: '',
    ownerName: '',
    general: '',
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

// Hàm tạo gợi ý tên thương hiệu (giả lập)
const generateReport = async () => {
  if (!process.client) {
    console.warn('generateReport called on server-side, ignoring.');
    return;
  }
  if (!validateForm()) {
    toast.error('Vui lòng kiểm tra lại thông tin nhập', { position: 'top-center' });
    return;
  }

  loading.value = true;
  errors.value.general = '';
  try {
    const lifePath = calculateLifePath(formData.value.date);
    const soul = calculateSoulNumber(formData.value.ownerName);
    const destiny = calculateDestinyNumber(formData.value.ownerName);
    const personality = calculatePersonalityNumber(formData.value.ownerName);
    if (!lifePath || !soul || !destiny || !personality) {
      throw new Error('Không thể tính toán các con số thần số học từ thông tin nhập.');
    }

    // Dữ liệu tên thương hiệu giả lập dựa trên số đường đời và ngành nghề
    const brandNameMap = {
      1: {
        suggestions: formData.value.language === 'english' ? [
          { name: 'NovaLead', soul: 1, destiny: 1, desc: 'Tên thể hiện sự dẫn đầu và đổi mới, phù hợp với ngành công nghệ.', logoSuggestion: 'Logo hình ngôi sao với gradient xanh-tím.' },
          { name: 'PioneerTech', soul: 5, destiny: 3, desc: 'Tượng trưng cho sự tiên phong và sáng tạo.', logoSuggestion: 'Logo chữ P cách điệu với vòng tròn năng lượng.' },
          { name: 'VisionPeak', soul: 9, destiny: 7, desc: 'Phù hợp với thương hiệu muốn tạo tầm nhìn lớn.', logoSuggestion: 'Logo hình núi với ánh sáng đỉnh.' },
        ] : [
          { name: 'TânLãnh', soul: 1, destiny: 1, desc: 'Tên thể hiện sự dẫn đầu và đổi mới, phù hợp với ngành công nghệ.', logoSuggestion: 'Logo hình ngôi sao với gradient xanh-tím.' },
          { name: 'TiênPhong', soul: 5, destiny: 3, desc: 'Tượng trưng cho sự tiên phong và sáng tạo.', logoSuggestion: 'Logo chữ T cách điệu với vòng tròn năng lượng.' },
          { name: 'TầmCao', soul: 9, destiny: 7, desc: 'Phù hợp với thương hiệu muốn tạo tầm nhìn lớn.', logoSuggestion: 'Logo hình núi với ánh sáng đỉnh.' },
        ],
        lifePathDesc: 'Số 1 biểu thị sự lãnh đạo, độc lập và sáng tạo.',
        soulDesc: 'Số linh hồn thể hiện mong muốn dẫn đầu và tạo dấu ấn.',
        personalityDesc: 'Phong cách bên ngoài mạnh mẽ, tự tin.',
        destinyDesc: 'Sứ mệnh thương hiệu là tiên phong và đổi mới.',
        generalAnalysis: `Thương hiệu trong ngành ${formData.value.industry} nên tập trung vào sự đổi mới và dẫn đầu thị trường. Số chủ đạo ${lifePath} cho thấy năng lượng mạnh mẽ, phù hợp với các thương hiệu muốn tạo dấu ấn độc đáo. ${formData.value.extraRequest ? 'Yêu cầu bổ sung: ' + formData.value.extraRequest : ''}`,
        brandAdvice: 'Xây dựng thương hiệu với hình ảnh mạnh mẽ, sử dụng các yếu tố như logo hình học và màu sắc nổi bật.',
      },
      2: {
        suggestions: formData.value.language === 'english' ? [
          { name: 'HarmonyCo', soul: 2, destiny: 2, desc: 'Tên gợi sự hòa hợp, phù hợp với ngành thời trang hoặc dịch vụ.', logoSuggestion: 'Logo hình vòng tròn lồng ghép, màu pastel.' },
          { name: 'UnityVibe', soul: 6, destiny: 4, desc: 'Tạo cảm giác cộng đồng và tin cậy.', logoSuggestion: 'Logo hình lá cây hoặc trái tim.' },
          { name: 'ConnectSphere', soul: 8, destiny: 6, desc: 'Phù hợp với thương hiệu tập trung vào kết nối.', logoSuggestion: 'Logo hình cầu với các đường liên kết.' },
        ] : [
          { name: 'HòaHợp', soul: 2, destiny: 2, desc: 'Tên gợi sự hòa hợp, phù hợp với ngành thời trang hoặc dịch vụ.', logoSuggestion: 'Logo hình vòng tròn lồng ghép, màu pastel.' },
          { name: 'ĐồngTâm', soul: 6, destiny: 4, desc: 'Tạo cảm giác cộng đồng và tin cậy.', logoSuggestion: 'Logo hình lá cây hoặc trái tim.' },
          { name: 'KếtNối', soul: 8, destiny: 6, desc: 'Phù hợp với thương hiệu tập trung vào kết nối.', logoSuggestion: 'Logo hình cầu với các đường liên kết.' },
        ],
        lifePathDesc: 'Số 2 biểu thị sự hợp tác, hòa hợp và nhạy bén.',
        soulDesc: 'Số linh hồn thể hiện mong muốn tạo sự gắn kết và hỗ trợ.',
        personalityDesc: 'Phong cách bên ngoài nhẹ nhàng, dễ gần.',
        destinyDesc: 'Sứ mệnh thương hiệu là xây dựng cộng đồng và sự tin cậy.',
        generalAnalysis: `Thương hiệu trong ngành ${formData.value.industry} nên tập trung vào sự kết nối và tạo niềm tin. Số chủ đạo ${lifePath} cho thấy năng lượng hòa hợp, phù hợp với các thương hiệu dịch vụ hoặc cộng đồng. ${formData.value.extraRequest ? 'Yêu cầu bổ sung: ' + formData.value.extraRequest : ''}`,
        brandAdvice: 'Sử dụng màu sắc nhẹ nhàng và logo mang tính biểu tượng cho sự đoàn kết, như vòng tròn hoặc hình trái tim.',
      },
      // Thêm các số khác nếu cần
    };

    numerologyData.value = {
      lifePath,
      soul,
      personality,
      destiny,
      lifePathDesc: brandNameMap[lifePath]?.lifePathDesc || 'Năng lượng dẫn đầu và sáng tạo.',
      soulDesc: brandNameMap[lifePath]?.soulDesc || 'Mong muốn tạo dấu ấn cá nhân.',
      personalityDesc: brandNameMap[lifePath]?.personalityDesc || 'Phong cách mạnh mẽ, tự tin.',
      destinyDesc: brandNameMap[lifePath]?.destinyDesc || 'Sứ mệnh tiên phong và đổi mới.',
      generalAnalysis: brandNameMap[lifePath]?.generalAnalysis || `Thương hiệu trong ngành ${formData.value.industry} nên tập trung vào sự sáng tạo và đổi mới.`,
      suggestions: brandNameMap[lifePath]?.suggestions || [],
      brandAdvice: brandNameMap[lifePath]?.brandAdvice || 'Tập trung xây dựng thương hiệu với hình ảnh độc đáo và sáng tạo.',
    };

    totalSuggestions.value = numerologyData.value.suggestions.length;
    existingNames.value = numerologyData.value.suggestions.map(s => s.name);

    toast.success('Tạo gợi ý tên thương hiệu hoàn tất!', { position: 'top-center' });
    setTimeout(() => {
      const resultElement = document.querySelector('[v-if="numerologyData"]');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  } catch (error) {
    console.error('Error in generateReport:', error);
    errors.value.general = error.message || 'Có lỗi xảy ra khi tạo gợi ý tên thương hiệu!';
    toast.error(errors.value.general, { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};

// Hàm tải thêm gợi ý (giả lập)
const showMoreSuggestions = async () => {
  if (!process.client) {
    console.warn('showMoreSuggestions called on server-side, ignoring.');
    return;
  }
  if (!numerologyData.value) return;
  if (totalSuggestions.value >= maxSuggestions.value) {
    toast.info('Đã đạt số lượng tối đa 30 gợi ý tên thương hiệu!', { position: 'top-center' });
    return;
  }

  loadingMore.value = true;
  try {
    const lifePath = calculateLifePath(formData.value.date);
    const additionalNames = {
      1: formData.value.language === 'english' ? [
        { name: 'InnovateCore', soul: 3, destiny: 5, desc: 'Tên gợi sự sáng tạo và cốt lõi mạnh mẽ.', logoSuggestion: 'Logo hình lõi năng lượng với gradient tím.' },
      ] : [
        { name: 'SángTạo', soul: 3, destiny: 5, desc: 'Tên gợi sự sáng tạo và cốt lõi mạnh mẽ.', logoSuggestion: 'Logo hình lõi năng lượng với gradient tím.' },
      ],
      2: formData.value.language === 'english' ? [
        { name: 'SyncWave', soul: 4, destiny: 7, desc: 'Tên gợi sự đồng bộ và năng lượng tích cực.', logoSuggestion: 'Logo hình sóng với màu xanh pastel.' },
      ] : [
        { name: 'ĐồngSóng', soul: 4, destiny: 7, desc: 'Tên gợi sự đồng bộ và năng lượng tích cực.', logoSuggestion: 'Logo hình sóng với màu xanh pastel.' },
      ],
    };

    const newName = additionalNames[lifePath]?.[0];
    if (newName && !existingNames.value.includes(newName.name)) {
      numerologyData.value.suggestions.push(newName);
      totalSuggestions.value = numerologyData.value.suggestions.length;
      existingNames.value = numerologyData.value.suggestions.map(s => s.name);
      toast.success('Đã thêm gợi ý tên mới!', { position: 'top-center' });
    } else {
      throw new Error('Không tìm thấy gợi ý tên phù hợp để thêm.');
    }
  } catch (error) {
    console.error('Error in showMoreSuggestions:', error);
    errors.value.general = error.message || 'Không thể tải thêm gợi ý tên!';
    toast.error(errors.value.general, { position: 'top-center' });
  } finally {
    loadingMore.value = false;
  }
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.action-button {
  @apply px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap mx-2;
}
</style>
