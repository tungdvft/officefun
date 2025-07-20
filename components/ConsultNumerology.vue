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
                :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.name ? 'border-red-500' : 'border-gray-300']"
              />
              <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
            </div>
            <div>
              <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh (DD/MM/YYYY)</label>
              <input
                v-model="formData.birthDate"
                type="text"
                id="birthDate"
                placeholder="Ví dụ: 15/03/1995"
                :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.birthDate ? 'border-red-500' : 'border-gray-300']"
              />
              <p v-if="errors.birthDate" class="text-red-600 text-sm mt-1">{{ errors.birthDate }}</p>
            </div>
          </div>
          <!-- Question Input -->
          <div>
            <label for="question" class="block text-sm font-medium text-gray-700 mb-2">Câu hỏi của bạn</label>
            <textarea
              v-model="formData.question"
              id="question"
              placeholder="Ví dụ: Tôi có nên mua nhà trong năm nay không?"
              :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition h-24 resize-none', errors.question ? 'border-red-500' : 'border-gray-300']"
            ></textarea>
            <p v-if="errors.question" class="text-red-600 text-sm mt-1">{{ errors.question }}</p>
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
          <div v-else-if="errorMessage" class="text-red-600 text-center font-medium p-6">
            <template v-if="errorType === 'login'">
              Vui lòng <button @click="errorAction" class="action-button inline">Đăng Nhập</button> để gửi câu hỏi.
            </template>
            <template v-else-if="errorType === 'topup'">
              Không đủ token để gửi câu hỏi. Hãy <button @click="navigateToTopup" class="action-button inline">Nạp thêm token</button> để tiếp tục.
            </template>
            <template v-else>
              {{ errorMessage }}
            </template>
          </div>
          <div v-else-if="errors.general" class="text-red-600 text-center font-medium p-6">
            {{ errors.general }}
          </div>
          <div v-else class="text-center p-6">
            <template v-if="!userStore.isAuthenticated">
              <p class="text-red-600 font-medium mb-4">
                Vui lòng <button @click="errorAction" class="action-button inline">Đăng Nhập</button> để gửi câu hỏi.
              </p>
            </template>
            <template v-else-if="userStore.isAuthenticated && !hasSufficientTokens">
              <p class="text-red-600 font-medium mb-4">
                Không đủ token để gửi câu hỏi. Hãy <button @click="navigateToTopup" class="action-button inline">Nạp thêm token</button> để tiếp tục.
              </p>
            </template>
            <template v-else>
              <button @click="consult" class="action-button">
                Gửi câu hỏi (Cần {{ tokenCost }} token)
              </button>
            </template>
          </div>
        </div>

        <!-- Results Section -->
        <transition name="slide-fade">
          <div v-if="result && isContentAccessible" class="mt-8">
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
                Giải đáp
              </h3>
              <p v-text="result.answer" class="text-gray-600 mt-2"></p>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { useProtectedContent } from '~/composables/useProtectedContent';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

definePageMeta({ layout: 'view' });

const router = useRouter();
const userStore = useUserStore();
const formData = ref({
  name: '',
  birthDate: '',
  question: '',
});
const result = ref(null);
const loading = ref(false);
const errors = ref({
  name: '',
  birthDate: '',
  question: '',
  general: '',
});
const tokenCost = ref(15);
const description = 'Access to numerology consultation results';
const { isLoading, errorMessage, errorType, isContentAccessible, hasSufficientTokens, checkAuthAndAccess, performAction, errorAction, navigateToTopup } = useProtectedContent(tokenCost.value, description);

// Hàm chuyển đổi định dạng ngày từ YYYY-MM-DD sang DD/MM/YYYY
const formatDateToDDMMYYYY = (dateStr) => {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(dateStr)) {
    return '';
  }
  const [year, month, day] = dateStr.split('T')[0].split('-');
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
};

// Hàm làm sạch dữ liệu, loại bỏ ký tự không hợp lệ
const cleanString = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/["'<]/g, '');
};

// Computed property để làm sạch formData
const cleanedFormData = computed({
  get: () => ({
    name: cleanString(formData.value.name),
    birthDate: cleanString(formData.value.birthDate),
    question: cleanString(formData.value.question),
  }),
  set: (newValue) => {
    formData.value = {
      name: newValue.name,
      birthDate: newValue.birthDate,
      question: newValue.question,
    };
  },
});

// Hàm validate form
const validateForm = () => {
  errors.value = {
    name: '',
    birthDate: '',
    question: '',
    general: '',
  };
  let isValid = true;
  if (!formData.value.name.trim()) {
    errors.value.name = 'Vui lòng nhập họ và tên';
    isValid = false;
  }
  if (!formData.value.birthDate.trim()) {
    errors.value.birthDate = 'Vui lòng nhập ngày sinh';
    isValid = false;
  } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.value.birthDate)) {
    errors.value.birthDate = 'Vui lòng nhập ngày sinh đúng định dạng DD/MM/YYYY';
    isValid = false;
  } else {
    const match = formData.value.birthDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
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
      errors.value.birthDate = 'Ngày sinh không hợp lệ';
      isValid = false;
    }
  }
  if (!formData.value.question.trim()) {
    errors.value.question = 'Vui lòng nhập câu hỏi';
    isValid = false;
  }
  return isValid;
};

// Hàm lấy thông tin người dùng từ API
const fetchUserData = async () => {
  if (!userStore.isAuthenticated || !userStore.user?.id) {
    console.log('User not authenticated, skipping fetchUserData');
    return;
  }
  try {
    const userIdValue = String(userStore.user.id);
    console.log('Fetching user data for userId:', userIdValue);
    const response = await $fetch(`/api/users/${userIdValue}`, {
      method: 'GET',
    });
    console.log('API /api/users response:', response);
    formData.value.name = response.user.fullname?.trim() || '';
    formData.value.birthDate = response.user.birthdate ? formatDateToDDMMYYYY(response.user.birthdate) : '';
  } catch (err) {
    console.error('Error fetching user data:', err);
    errors.value.general = err.data?.message || 'Không thể tải thông tin tài khoản. Vui lòng nhập thủ công.';
    toast.error(errors.value.general, { position: 'top-center' });
  }
};

// Khởi tạo trạng thái đăng nhập và kiểm tra token
const initializeAuth = async () => {
  console.log('Initializing auth for NumerologyConsultation...');
  try {
    await userStore.initialize();
    console.log('User Store Initialized, isAuthenticated:', userStore.isAuthenticated, 'tokenBalance:', userStore.user?.tokens);
    await checkAuthAndAccess();
    console.log('Auth checked, isContentAccessible:', isContentAccessible.value, 'hasSufficientTokens:', hasSufficientTokens.value);
  } catch (err) {
    console.error('Lỗi khi khởi tạo auth:', err);
    errors.value.general = 'Không thể khởi tạo trạng thái đăng nhập. Vui lòng thử lại.';
    toast.error(errors.value.general, { position: 'top-center' });
  }
};

// Xử lý gửi câu hỏi
const consult = async () => {
  if (!process.client) {
    console.warn('consult called on server-side, ignoring.');
    return;
  }
  if (!validateForm()) {
    toast.error('Vui lòng kiểm tra lại thông tin nhập', { position: 'top-center' });
    return;
  }
  if (isContentAccessible.value) {
    await getConsultation();
  } else {
    try {
      await performAction();
      if (isContentAccessible.value) {
        await getConsultation();
      } else {
        toast.error(errorMessage.value || 'Không đủ quyền truy cập hoặc token!', { position: 'top-center' });
      }
    } catch (err) {
      console.error('Error in performAction:', err);
      toast.error(errorMessage.value || 'Có lỗi khi kiểm tra quyền truy cập', { position: 'top-center' });
    }
  }
};

// Hàm gọi API lấy giải đáp
const getConsultation = async () => {
  loading.value = true;
  errors.value.general = '';
  try {
    const username = userStore.isAuthenticated ? userStore.user.email : 'guest';
    const response = await $fetch('/api/numerology/consult', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: cleanedFormData.value,
    });
    console.log('Response from /api/numerology/consult:', response);
    result.value = response.consult;
    toast.success('Giải đáp hoàn tất!', { position: 'top-center' });
    setTimeout(() => {
      const resultElement = document.querySelector('[v-if="result && isContentAccessible"]');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    await checkAuthAndAccess();
  } catch (error) {
    console.error('Error in getConsultation:', error);
    errors.value.general = error.data?.message || 'Có lỗi xảy ra khi lấy giải đáp!';
    toast.error(errors.value.general, { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};

// Theo dõi isStoreInitialized để lấy dữ liệu khi store sẵn sàng
watch(() => userStore.isStoreInitialized, (initialized) => {
  if (initialized && process.client) {
    console.log('User store initialized, running initializeAuth and fetchUserData');
    initializeAuth();
    fetchUserData();
  }
});

// Cập nhật thông tin người dùng khi thay đổi name hoặc birthDate
watch([() => formData.value.name, () => formData.value.birthDate], async ([newName, newBirthDate]) => {
  if (!userStore.isStoreInitialized || !userStore.user?.id) return;
  const currentBirthDate = userStore.user?.birthdate || '';
  const formattedNewBirthDate = formatDateToYYYYMMDD(newBirthDate);
  if (newName !== userStore.user?.fullname || formattedNewBirthDate !== currentBirthDate) {
    try {
      const response = await $fetch(`/api/users/${userStore.user.id}`, {
        method: 'PATCH',
        body: {
          fullname: newName.trim(),
          birthdate: formattedNewBirthDate,
        },
      });
      if (response.success) {
        userStore.setUser({
          id: userStore.user.id,
          email: userStore.user?.email || '',
          fullname: newName.trim(),
          birthdate: formattedNewBirthDate,
          tokens: userStore.user?.tokens || 0,
        });
      }
    } catch (err) {
      console.error('Lỗi cập nhật thông tin người dùng:', err);
      errors.value.general = 'Không thể cập nhật thông tin. Vui lòng thử lại.';
      toast.error(errors.value.general, { position: 'top-center' });
    }
  }
});

// Hàm chuyển đổi định dạng ngày từ DD/MM/YYYY sang YYYY-MM-DD
const formatDateToYYYYMMDD = (dateStr) => {
  if (!dateStr || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return '';
  const [day, month, year] = dateStr.split('/').map(Number);
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

// Load dữ liệu khi component được mount
onMounted(() => {
  console.log('Component mounted, isStoreInitialized:', userStore.isStoreInitialized);
  if (userStore.isStoreInitialized) {
    initializeAuth();
    fetchUserData();
  }
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