
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
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
            <div>
              <label for="birthdate" class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh (DD/MM/YYYY)</label>
              <input
                v-model="formData.birthdate"
                type="text"
                id="birthdate"
                placeholder="Ví dụ: 15/03/1995"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
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
            </div>
          </div>
          <div class="flex justify-center">
            <button
              @click="generateNickname"
              :disabled="loading || isLoading || !hasSufficientTokens"
              class="w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-3 px-8 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-md"
            >
              <span v-if="loading || isLoading" class="flex items-center justify-center">
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
                {{ isLoading ? 'Đang kiểm tra quyền truy cập...' : 'Đang xử lý...' }}
              </span>
              <span v-else>{{ isLoggedIn ? `Tạo danh xưng (Cần ${tokenCost} tokens)` : 'Đăng nhập để tạo danh xưng' }}</span>
            </button>
          </div>
          <!-- Error Messages -->
          <div v-if="errorMessage" class="mt-6 p-4 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200">
            <p>{{ errorMessage }}</p>
            <p v-if="hasSufficientTokens === false" class="text-sm mt-1">Bạn không có đủ token. Vui lòng nạp thêm.</p>
          </div>
        </div>

        <!-- Kết quả (bảo vệ) -->
        <transition name="slide-fade">
          <div v-if="numerologyData && isContentAccessible" class="mt-8 space-y-8">
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
              <div v-if="numerologyData && totalSuggestions < 30" class="flex justify-center mt-6">
                <button
                  @click="showMoreSuggestions"
                  :disabled="loadingMore"
                  class="w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-3 px-8 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-md"
                >
                  <span v-if="loadingMore" class="flex items-center justify-center">
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
                    Đang tải...
                  </span>
                  <span v-else>Xem thêm gợi ý</span>
                </button>
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

const formData = ref({
  name: '',
  birthdate: '',
  gender: 'male',
  startLetter: ''
});
const numerologyData = ref(null);
const loading = ref(false);
const loadingMore = ref(false);
const totalSuggestions = ref(3);
const tokenCost = ref(15);
const description = 'Access to detailed numerology nickname generation results';
const { isLoading, errorMessage, isContentAccessible, hasSufficientTokens, checkAuthAndAccess } = useProtectedContent(tokenCost.value, description);
const isLoggedIn = ref(false);
let handleAction = () => {};
const isInitialLoad = ref(true);

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
    suggestions: data.suggestions.map(suggestion => ({
      name: cleanString(suggestion.name),
      soul: cleanString(suggestion.soul),
      destiny: cleanString(suggestion.destiny),
      desc: cleanString(suggestion.desc),
      famous: cleanString(suggestion.famous)
    })),
    advice: cleanString(data.advice)
  };
};

// Khởi tạo trạng thái đăng nhập và hành động
const initializeAuth = async () => {
  const { isLoggedIn: authStatus, action } = await checkAuthAndAccess();
  isLoggedIn.value = authStatus;
  handleAction = action;
};

// Khôi phục dữ liệu từ Local Storage (chỉ ở client)
onMounted(() => {
  if (process.client) {
    console.log('Running on client, restoring localStorage');
    try {
      const savedFormData = localStorage.getItem('nicknameFormData');
      const savedNumerologyData = localStorage.getItem('nicknameNumerologyData');

      if (savedFormData) {
        const parsedFormData = JSON.parse(savedFormData);
        if (parsedFormData && typeof parsedFormData === 'object') {
          formData.value = {
            name: cleanString(parsedFormData.name),
            birthdate: cleanString(parsedFormData.birthdate),
            gender: cleanString(parsedFormData.gender),
            startLetter: cleanString(parsedFormData.startLetter)
          };
          console.log('Khôi phục formData:', formData.value);
        }
      }

      if (savedNumerologyData) {
        const parsedNumerologyData = JSON.parse(savedNumerologyData);
        if (parsedNumerologyData && typeof parsedNumerologyData === 'object') {
          numerologyData.value = cleanNumerologyData(parsedNumerologyData);
          console.log('Khôi phục numerologyData:', numerologyData.value);
        }
      }

      // Khởi tạo trạng thái đăng nhập nếu có dữ liệu form hoặc numerologyData
      if (savedFormData || savedNumerologyData) {
        initializeAuth();
        isInitialLoad.value = false;
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
  () => formData.value,
  (newFormData) => {
    if (process.client) {
      try {
        localStorage.setItem('nicknameFormData', JSON.stringify({
          name: cleanString(newFormData.name),
          birthdate: cleanString(newFormData.birthdate),
          gender: cleanString(newFormData.gender),
          startLetter: cleanString(newFormData.startLetter)
        }));
        console.log('Lưu formData:', newFormData);
      } catch (error) {
        console.error('Lỗi khi lưu formData vào Local Storage:', error);
        toast.error('Không thể lưu dữ liệu form!', { position: 'top-center' });
      }
    }
  },
  { deep: true, immediate: true }
);

// Lưu numerologyData khi thay đổi (chỉ ở client)
watch(
  () => numerologyData.value,
  (newNumerologyData) => {
    if (process.client) {
      try {
        if (newNumerologyData) {
          localStorage.setItem('nicknameNumerologyData', JSON.stringify(newNumerologyData));
          console.log('Lưu numerologyData:', newNumerologyData);
        } else {
          localStorage.removeItem('nicknameNumerologyData');
          console.log('Xóa numerologyData khỏi Local Storage');
        }
      } catch (error) {
        console.error('Lỗi khi lưu numerologyData vào Local Storage:', error);
        toast.error('Không thể lưu kết quả!', { position: 'top-center' });
      }
    }
  },
  { immediate: true }
);

const generateNickname = async () => {
  errorMessage.value = null;

  if (!formData.value.name) return toast.error('Vui lòng nhập họ và tên!', { position: 'top-center' });
  if (!formData.value.birthdate) return toast.error('Vui lòng nhập ngày sinh!', { position: 'top-center' });
  if (!formData.value.gender) return toast.error('Vui lòng chọn giới tính!', { position: 'top-center' });
  if (formData.value.startLetter && !/^[A-Z]$/.test(formData.value.startLetter)) {
    return toast.error('Chữ cái đầu tiên phải là A-Z!', { position: 'top-center' });
  }

  if (isContentAccessible.value) {
    await getNickname();
  } else {
    await handleAction();
    if (isContentAccessible.value) {
      await getNickname();
    }
  }
};

async function getNickname() {
  loading.value = true;
  try {
    const username = process.client ? localStorage.getItem('username') || 'guest' : 'guest';
    console.log('Sending request with data:', formData.value);
    const response = await $fetch('/api/numerology/nickname', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: {
        name: formData.value.name,
        birthdate: formData.value.birthdate,
        gender: formData.value.gender,
        startLetter: formData.value.startLetter || undefined,
        count: 3
      },
    });
    console.log('Response from API:', response);
    numerologyData.value = cleanNumerologyData(response.numerology);
    totalSuggestions.value = 3;
    toast.success('Tạo danh xưng hoàn tất!', { position: 'top-center' });
  } catch (error) {
    console.error('Error details:', error);
    errorMessage.value = error.data?.message || 'Không thể tạo danh xưng!';
    toast.error(errorMessage.value, { position: 'top-center' });
  } finally {
    loading.value = false;
  }
}

const showMoreSuggestions = async () => {
  if (totalSuggestions.value >= 30) return;

  loadingMore.value = true;
  try {
    const excludeNames = numerologyData.value.suggestions.map(s => s.name);
    const username = process.client ? localStorage.getItem('username') || 'guest' : 'guest';
    const response = await $fetch('/api/numerology/nickname', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: {
        name: formData.value.name,
        birthdate: formData.value.birthdate,
        gender: formData.value.gender,
        startLetter: formData.value.startLetter || undefined,
        count: 3,
        excludeNames
      },
    });
    numerologyData.value.suggestions.push(...cleanNumerologyData(response.numerology).suggestions);
    totalSuggestions.value += 3;
    toast.success('Đã tải thêm gợi ý!', { position: 'top-center' });
  } catch (error) {
    console.error('Error fetching more suggestions:', error);
    errorMessage.value = error.data?.message || 'Không thể tải thêm gợi ý!';
    toast.error(errorMessage.value, { position: 'top-center' });
  } finally {
    loadingMore.value = false;
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
