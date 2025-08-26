<template>
  <div class="bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
    <div class="container mx-auto p-4">
      <!-- Header (không bảo vệ) -->
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Đặt Tên Danh Xưng (Quốc Tế)</h2>
        <p class="text-gray-600">Tạo danh xưng phù hợp với năng lượng số học của bạn</p>
      </div>

      <!-- Main Content -->
      <div class="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
        <!-- Form nhập liệu (không bảo vệ) -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-purple-700 mb-4">Nhập thông tin cá nhân</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
              <input
                v-model="formData.name"
                type="text"
                id="name"
                placeholder="Ví dụ: Nguyễn Văn A"
                :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.name ? 'border-red-500' : 'border-gray-300']"
              />
              <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
            </div>
            <div>
              <label for="birthdate" class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh (DD/MM/YYYY)</label>
              <input
                v-model="formData.birthdate"
                type="text"
                id="birthdate"
                placeholder="Ví dụ: 15/03/1995"
                :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.birthdate ? 'border-red-500' : 'border-gray-300']"
              />
              <p v-if="errors.birthdate" class="text-red-600 text-sm mt-1">{{ errors.birthdate }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
              <div class="flex space-x-6">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    v-model="formData.gender"
                    value="male"
                    class="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <span class="text-gray-700">Nam</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    v-model="formData.gender"
                    value="female"
                    class="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <span class="text-gray-700">Nữ</span>
                </label>
              </div>
              <p v-if="errors.gender" class="text-red-600 text-sm mt-1">{{ errors.gender }}</p>
            </div>
            <div>
              <label for="startLetter" class="block text-sm font-medium text-gray-700 mb-2">Chữ cái đầu tiên (tùy chọn)</label>
              <input
                v-model="formData.startLetter"
                type="text"
                id="startLetter"
                maxlength="1"
                placeholder="Ví dụ: H"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition uppercase tracking-widest text-center"
                @input="formData.startLetter = formData.startLetter.toUpperCase()"
              />
              <p v-if="errors.startLetter" class="text-red-600 text-sm mt-1">{{ errors.startLetter }}</p>
            </div>
          </div>
          <!-- Action Button and Error Messages -->
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
            <button @click="generateNickname" class="action-button">
              Tạo danh xưng
            </button>
          </div>
        </div>

        <!-- Kết quả -->
        <transition name="slide-fade">
          <div v-if="numerologyData" class="mt-8 space-y-8">
            <!-- Thông tin đầu vào -->
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
                  <h3 class="text-lg font-semibold text-purple-800">Thông tin cá nhân</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div><p class="text-sm text-gray-600">Họ và tên</p><p class="font-medium">{{ formData.name }}</p></div>
                    <div><p class="text-sm text-gray-600">Ngày sinh</p><p class="font-medium">{{ formData.birthdate }}</p></div>
                    <div><p class="text-sm text-gray-600">Giới tính</p><p class="font-medium">{{ formData.gender === 'male' ? 'Nam' : 'Nữ' }}</p></div>
                    <div><p class="text-sm text-gray-600">Chữ cái đầu</p><p class="font-medium">{{ formData.startLetter || 'Không có' }}</p></div>
                  </div>
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
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div class="flex items-center mb-2">
                    <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mr-2 text-sm">1</span>
                    <div>
                      <h4 class="font-medium text-gray-800">Số chủ đạo: {{ numerologyData.lifePath }}</h4>
                      <p class="text-sm text-gray-600">Con số đường đời</p>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm">{{ numerologyData.lifePathDesc }}</p>
                </div>
                <div class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div class="flex items-center mb-2">
                    <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mr-2 text-sm">2</span>
                    <div>
                      <h4 class="font-medium text-gray-800">Số linh hồn: {{ numerologyData.soul }}</h4>
                      <p class="text-sm text-gray-600">Mong muốn nội tâm</p>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm">{{ numerologyData.soulDesc }}</p>
                </div>
                <div class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div class="flex items-center mb-2">
                    <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mr-2 text-sm">3</span>
                    <div>
                      <h4 class="font-medium text-gray-800">Số nhân cách: {{ numerologyData.personality }}</h4>
                      <p class="text-sm text-gray-600">Phong cách bên ngoài</p>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm">{{ numerologyData.personalityDesc }}</p>
                </div>
                <div class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div class="flex items-center mb-2">
                    <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mr-2 text-sm">4</span>
                    <div>
                      <h4 class="font-medium text-gray-800">Số định mệnh: {{ numerologyData.destiny }}</h4>
                      <p class="text-sm text-gray-600">Sứ mệnh cuộc đời</p>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm">{{ numerologyData.destinyDesc }}</p>
                </div>
              </div>
            </div>

            <!-- Gợi ý danh xưng -->
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
                      d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Gợi ý danh xưng quốc tế
              </h3>
              <transition-group name="slide-fade" tag="div" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="(suggestion, index) in numerologyData.suggestions.slice(0, Math.min(totalSuggestions, 30))"
                  :key="suggestion.name"
                  class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-start mb-2">
                    <span
                      class="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mr-2 text-sm"
                    >
                      {{ index + 1 }}
                    </span>
                    <div>
                      <h4 class="font-medium text-gray-800">{{ suggestion.name }}</h4>
                      <p class="text-sm text-gray-600">
                        Số linh hồn: {{ suggestion.soul }} | Số định mệnh: {{ suggestion.destiny }}
                      </p>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm mb-2">{{ suggestion.desc }}</p>
                  <p class="text-sm text-gray-500 italic">Ví dụ: {{ suggestion.famous }}</p>
                </div>
              </transition-group>
              <div v-if="numerologyData && totalSuggestions < 30" class="text-center p-6">
                <div v-if="isLoading || loadingMore" class="flex justify-center">
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
                  <button @click="showMoreSuggestions" class="action-button">
                    Xem thêm gợi ý
                  </button>
                </div>
              </div>
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
                Lời khuyên sử dụng danh xưng
              </h3>
              <p class="text-gray-600 mt-2">{{ numerologyData.advice }}</p>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { useProtectedContent } from '~/composables/useProtectedContent';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const formData = ref({
  name: '',
  birthdate: '',
  gender: 'male',
  startLetter: '',
});
const numerologyData = ref(null);
const loading = ref(false);
const loadingMore = ref(false);
const totalSuggestions = ref(3);
const errors = ref({
  name: '',
  birthdate: '',
  gender: '',
  startLetter: '',
  general: '',
});
const isLoading = ref(false);

// Hàm chuyển đổi định dạng ngày từ YYYY-MM-DD sang DD/MM/YYYY
const formatDateToDDMMYYYY = (dateStr) => {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(dateStr)) {
    return '';
  }
  const [year, month, day] = dateStr.split('T')[0].split('-');
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
};

// Hàm chuyển đổi định dạng ngày từ DD/MM/YYYY sang YYYY-MM-DD
const formatDateToYYYYMMDD = (dateStr) => {
  if (!dateStr || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return '';
  const [day, month, year] = dateStr.split('/').map(Number);
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

// Hàm làm sạch dữ liệu, loại bỏ ký tự không hợp lệ
const cleanString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/["'<]/g, '');
};

// Làm sạch dữ liệu numerologyData từ API
const cleanNumerologyData = (data) => {
  if (!data) return null;
  return {
    lifePath: cleanString(data.lifePath),
    lifePathDesc: cleanString(data.lifePathDesc),
    soul: cleanString(data.soul),
    soulDesc: cleanString(data.soulDesc),
    personality: cleanString(data.personality),
    personalityDesc: cleanString(data.personalityDesc),
    destiny: cleanString(data.destiny),
    destinyDesc: cleanString(data.destinyDesc),
    suggestions: data.suggestions.map((suggestion) => ({
      name: cleanString(suggestion.name),
      soul: cleanString(suggestion.soul),
      destiny: cleanString(suggestion.destiny),
      desc: cleanString(suggestion.desc),
      famous: cleanString(suggestion.famous),
    })),
    advice: cleanString(data.advice),
  };
};

// Hàm validate form
const validateForm = () => {
  errors.value = {
    name: '',
    birthdate: '',
    gender: '',
    startLetter: '',
    general: '',
  };
  let isValid = true;
  if (!formData.value.name.trim()) {
    errors.value.name = 'Vui lòng nhập họ và tên';
    isValid = false;
  }
  if (!formData.value.birthdate.trim()) {
    errors.value.birthdate = 'Vui lòng nhập ngày sinh';
    isValid = false;
  } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.value.birthdate)) {
    errors.value.birthdate = 'Vui lòng nhập ngày sinh đúng định dạng DD/MM/YYYY';
    isValid = false;
  } else {
    const match = formData.value.birthdate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
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
      errors.value.birthdate = 'Ngày sinh không hợp lệ';
      isValid = false;
    }
  }
  if (!formData.value.gender) {
    errors.value.gender = 'Vui lòng chọn giới tính';
    isValid = false;
  }
  if (formData.value.startLetter && !/^[A-Z]$/.test(formData.value.startLetter)) {
    errors.value.startLetter = 'Chữ cái đầu tiên phải là A-Z';
    isValid = false;
  }
  return isValid;
};

// Xử lý tạo danh xưng
const generateNickname = async () => {
  if (!process.client) {
    console.warn('generateNickname called on server-side, ignoring.');
    return;
  }
  if (!validateForm()) {
    toast.error('Vui lòng kiểm tra lại thông tin nhập', { position: 'top-center' });
    return;
  }
  await getNickname();
};

// Hàm gọi API tạo danh xưng
async function getNickname() {
  loading.value = true;
  errors.value.general = '';
  try {
    const username = 'guest'; // Không cần đăng nhập, sử dụng 'guest'
    console.log('Sending request to /api/numerology/nickname with data:', formData.value);
    const response = await $fetch('/api/numerology/nickname', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: {
        name: formData.value.name,
        birthdate: formData.value.birthdate,
        gender: formData.value.gender,
        startLetter: formData.value.startLetter || undefined,
        count: 3,
      },
    });
    console.log('Response from /api/numerology/nickname:', response);
    numerologyData.value = cleanNumerologyData(response.numerology);
    totalSuggestions.value = 3;
    toast.success('Tạo danh xưng hoàn tất!', { position: 'top-center' });
    setTimeout(() => {
      const resultElement = document.querySelector('[v-if="numerologyData"]');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  } catch (error) {
    console.error('Error in getNickname:', error);
    errors.value.general = error.data?.message || 'Không thể tạo danh xưng!';
    toast.error(errors.value.general, { position: 'top-center' });
  } finally {
    loading.value = false;
  }
}

// Hàm tải thêm gợi ý
async function showMoreSuggestions() {
  if (!process.client) {
    console.warn('showMoreSuggestions called on server-side, ignoring.');
    return;
  }
  if (totalSuggestions.value >= 30) {
    console.log('Reached maximum suggestions (30)');
    toast.info('Đã đạt số lượng gợi ý tối đa (30)!', { position: 'top-center' });
    return;
  }

  loadingMore.value = true;
  errors.value.general = '';
  try {
    const excludeNames = numerologyData.value.suggestions.map((s) => s.name);
    const username = 'guest'; // Không cần đăng nhập, sử dụng 'guest'
    console.log('Sending request to /api/numerology/nickname with excludeNames:', excludeNames);
    const response = await $fetch('/api/numerology/nickname', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: {
        name: formData.value.name,
        birthdate: formData.value.birthdate,
        gender: formData.value.gender,
        startLetter: formData.value.startLetter || undefined,
        count: 3,
        excludeNames,
      },
    });
    console.log('Response from /api/numerology/nickname (more suggestions):', response);
    numerologyData.value.suggestions.push(...cleanNumerologyData(response.numerology).suggestions);
    totalSuggestions.value += 3;
    toast.success('Đã tải thêm gợi ý!', { position: 'top-center' });
  } catch (error) {
    console.error('Error in showMoreSuggestions:', error);
    errors.value.general = error.data?.message || 'Không thể tải thêm gợi ý!';
    toast.error(errors.value.general, { position: 'top-center' });
  } finally {
    loadingMore.value = false;
  }
}

// Load dữ liệu khi component được mount
onMounted(() => {
  console.log('Component mounted');
});
</script>

<style scoped>
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

.action-button {
  @apply px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap;
}

.action-button.inline {
  @apply mx-2 px-4 py-2 text-sm;
}
</style>
