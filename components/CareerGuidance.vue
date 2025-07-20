
<template>
  <div class="bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
    <div class="container mx-auto p-4">
      <!-- Phần không bảo vệ (Tiêu đề, mô tả, form nhập thông tin) -->
      <div v-for="section in introSection" :key="section.title" class="space-y-6">
        <div v-if="section.type === 'header'" class="mb-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-blue-800 mb-2">{{ section.title }}</h2>
          <p class="text-gray-600">{{ section.description }}</p>
        </div>
        <div v-if="section.type === 'form'" class="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
          <h3 class="text-xl font-semibold text-purple-700 mb-4">Nhập thông tin cá nhân</h3>
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                <input
                  v-model="formData.name"
                  type="text"
                  id="name"
                  placeholder="Nguyễn Văn A"
                  :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.name ? 'border-red-500' : 'border-gray-300']"
                />
                <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
              </div>
              <div>
                <label for="birthdate" class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh (DD/MM/YYYY hoặc DD-MM-YYYY)</label>
                <input
                  v-model="formData.birthdate"
                  type="text"
                  id="birthdate"
                  placeholder="15/03/1995"
                  :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.birthdate ? 'border-red-500' : 'border-gray-300']"
                />
                <p v-if="errors.birthdate" class="text-red-600 text-sm mt-1">{{ errors.birthdate }}</p>
              </div>
            </div>
            <div>
              <label for="currentJob" class="block text-sm font-medium text-gray-700 mb-2">Công việc hiện tại (nếu có)</label>
              <input
                v-model="formData.currentJob"
                type="text"
                id="currentJob"
                placeholder="Ví dụ: Lập trình viên, Giáo viên..."
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
            <!-- Phần thông báo lỗi, trạng thái tải, hoặc nút hành động -->
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
                Vui lòng <button @click="errorAction" class="action-button">Đăng Nhập</button> để xem định hướng nghề nghiệp.
              </template>
              <template v-else-if="errorType === 'topup'">
                Không đủ token để xem định hướng nghề nghiệp. Hãy <button @click="navigateToTopup" class="action-button">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
              </template>
              <template v-else>
                {{ errorMessage }}
              </template>
            </div>
            <div v-else-if="errors.general" class="text-red-600 text-center font-medium p-6">
              {{ errors.general }}
            </div>
            <div v-else-if="!isContentAccessible" class="text-center p-6">
              <template v-if="!userStore.isAuthenticated">
                <p class="text-red-600 font-medium mb-4">
                  Vui lòng <button @click="errorAction" class="action-button">Đăng Nhập</button> để xem định hướng nghề nghiệp.
                </p>
              </template>
              <template v-else-if="userStore.isAuthenticated && !hasSufficientTokens">
                <p class="text-red-600 font-medium mb-4">
                  Không đủ token để xem định hướng nghề nghiệp. Hãy <button @click="navigateToTopup" class="action-button">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
                </p>
              </template>
              <template v-else>
                <button @click="getCareerGuidance" class="action-button">
                  Xem định hướng nghề nghiệp (Cần {{ tokenCost }} token)
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Phần được bảo vệ (Kết quả định hướng nghề nghiệp) -->
      <transition name="slide-fade">
        <div v-if="isContentAccessible && result" class="space-y-8">
          <div v-for="section in protectedSections" :key="section.title" class="space-y-6">
            <div v-if="section.type === 'overview' || section.type === 'advice'" class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <h3 class="text-xl font-semibold text-purple-700 mb-4 flex items-center">
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
                {{ section.title }}
              </h3>
              <div class="space-y-4">
                <div v-for="item in section.items" :key="item.title">
                  <h4 class="text-base font-semibold text-purple-700 flex items-center">
                    <svg :class="item.iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path :d="item.iconPath" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                    </svg>
                    {{ item.title }}
                  </h4>
                  <p class="text-gray-600 whitespace-pre-wrap">{{ item.content }}</p>
                </div>
              </div>
            </div>
            <div v-if="section.type === 'suggestions'" class="space-y-4">
              <h3 class="text-xl font-semibold text-purple-700 mb-4 flex items-center">
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
                Đề xuất nghề nghiệp
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  v-for="(suggestion, index) in section.suggestions"
                  :key="index"
                  class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h4 class="text-base font-semibold text-purple-700 mb-3">{{ suggestion.job }}</h4>
                  <p class="text-gray-600 mb-2"><strong>Lý do phù hợp:</strong> {{ suggestion.reason }}</p>
                  <p class="text-gray-600 mb-2"><strong>Cơ hội hiện tại:</strong> {{ suggestion.opportunities }}</p>
                  <p class="text-gray-600"><strong>Xu hướng tương lai:</strong> {{ suggestion.trends }}</p>
                </div>
              </div>
              <div v-if="section.suggestions.length < maxSuggestions && isContentAccessible" class="text-center p-6">
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
                <div v-else-if="errorMessageMore" class="text-red-600 text-center font-medium p-6">
                  <template v-if="errorTypeMore === 'login'">
                    Vui lòng <button @click="errorActionMore" class="action-button">Đăng Nhập</button> để xem thêm nghề nghiệp.
                  </template>
                  <template v-else-if="errorTypeMore === 'topup'">
                    Không đủ token để xem thêm nghề nghiệp. Hãy <button @click="navigateToTopup" class="action-button">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
                  </template>
                  <template v-else>
                    {{ errorMessageMore }}
                  </template>
                </div>
                <div v-else-if="!isContentAccessibleMore" class="text-center p-6">
                  <template v-if="!userStore.isAuthenticated">
                    <p class="text-red-600 font-medium mb-4">
                      Vui lòng <button @click="errorActionMore" class="action-button">Đăng Nhập</button> để xem thêm nghề nghiệp.
                    </p>
                  </template>
                  <template v-else-if="userStore.isAuthenticated && !hasSufficientTokensMore">
                    <p class="text-red-600 font-medium mb-4">
                      Không đủ token để xem thêm nghề nghiệp. Hãy <button @click="navigateToTopup" class="action-button">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
                    </p>
                  </template>
                  <template v-else>
                    <button @click="loadMoreCareers" class="action-button">
                      Xem thêm nghề nghiệp phù hợp (Cần {{ tokenCostMore }} token)
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { toast } from 'vue3-toastify';
import { useProtectedContent } from '~/composables/useProtectedContent';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

definePageMeta({ layout: 'view' });

const router = useRouter();
const userStore = useUserStore();
const formData = ref({
  name: '',
  birthdate: '',
  currentJob: '',
});
const result = ref(null);
const loading = ref(false);
const loadingMore = ref(false);
const errors = ref({
  name: '',
  birthdate: '',
  general: '',
});
const tokenCost = ref(30);
const tokenCostMore = ref(10);
const maxSuggestions = ref(12);
const description = 'Access to career guidance based on numerology';
const {
  isLoading,
  errorMessage,
  errorType,
  isContentAccessible,
  hasSufficientTokens,
  checkAuthAndAccess,
  performAction,
  errorAction,
  navigateToTopup: navigateToTopupMain,
} = useProtectedContent(tokenCost.value, description);
const {
  isLoading: isLoadingMore,
  errorMessage: errorMessageMore,
  errorType: errorTypeMore,
  isContentAccessible: isContentAccessibleMore,
  hasSufficientTokens: hasSufficientTokensMore,
  checkAuthAndAccess: checkAuthAndAccessMore,
  performAction: performActionMore,
  errorAction: errorActionMore,
  navigateToTopup: navigateToTopupMore,
} = useProtectedContent(tokenCostMore.value, 'Load more career suggestions');

// Hàm điều hướng đến trang nạp token
const navigateToTopup = () => {
  if (process.client) {
    console.log('Navigating to /nap-token');
    try {
      router.push('/nap-token').catch((err) => {
        console.error('Navigation error:', err);
        toast.error('Không thể điều hướng đến trang nạp token. Vui lòng thử lại.', { position: 'top-center' });
      });
    } catch (err) {
      console.error('Error in navigateToTopup:', err);
      toast.error('Có lỗi khi điều hướng. Vui lòng kiểm tra lại.', { position: 'top-center' });
    }
  } else {
    console.warn('navigateToTopup called on server-side, ignoring.');
  }
};

// Phần không bảo vệ (Tiêu đề, mô tả, form nhập thông tin)
const introSection = computed(() => [
  {
    title: 'Định Hướng Nghề Nghiệp',
    description: 'Khám phá nghề nghiệp phù hợp với tính cách và năng lực của bạn',
    type: 'header',
  },
  {
    title: 'Nhập thông tin cá nhân',
    type: 'form',
  },
]);

// Phần được bảo vệ (Kết quả định hướng nghề nghiệp)
const protectedSections = computed(() => {
  if (!result.value) return [];
  return [
    {
      title: 'Định hướng nghề nghiệp',
      type: 'overview',
      items: [
        {
          title: 'Mục tiêu nghề nghiệp',
          content: result.value.careerGoals,
          iconClass: 'w-5 h-5 text-purple-500 mr-2',
          iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        },
        {
          title: 'Đam mê và động lực',
          content: result.value.passionAndMotivation,
          iconClass: 'w-5 h-5 text-green-500 mr-2',
          iconPath: 'M5 13l4 4L19 7',
        },
        {
          title: 'Phong cách làm việc',
          content: result.value.workStyle,
          iconClass: 'w-5 h-5 text-blue-500 mr-2',
          iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 1.857h10M12 4v8m-8 8h16',
        },
        {
          title: 'Con đường dài hạn',
          content: result.value.longTermPath,
          iconClass: 'w-5 h-5 text-yellow-500 mr-2',
          iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
        },
        ...(formData.value.currentJob
          ? [
              {
                title: 'Phân tích công việc hiện tại',
                content: result.value.currentJobAnalysis,
                iconClass: 'w-5 h-5 text-indigo-500 mr-2',
                iconPath: 'M9 17v-2m0-2v-2m0-2V7m6 10v-2m0-2v-2m0-2V7m-9 10h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
              },
            ]
          : []),
      ],
    },
    {
      title: 'Đề xuất nghề nghiệp',
      type: 'suggestions',
      suggestions: result.value.careerSuggestions || [],
    },
    {
      title: 'Lời khuyên thực tế',
      type: 'advice',
      items: [
        {
          title: 'Lời khuyên thực tế',
          content: result.value.practicalAdvice,
          iconClass: 'w-5 h-5 text-purple-600 mr-2',
          iconPath: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
        },
      ],
    },
  ];
});

// Hàm chuyển đổi định dạng ngày từ YYYY-MM-DD sang DD/MM/YYYY
const formatDateToDDMMYYYY = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
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
    const { fullname, birthdate } = response.user;
    formData.value.name = fullname?.trim() || '';
    formData.value.birthdate = birthdate ? formatDateToDDMMYYYY(birthdate.split('T')[0]) : '';
  } catch (err) {
    console.error('Error fetching user data:', err);
    errors.value.general = err.data?.message || 'Không thể tải thông tin tài khoản. Vui lòng nhập thủ công.';
    toast.error(errors.value.general, { position: 'top-center' });
  }
};

// Khởi tạo trạng thái đăng nhập và kiểm tra token
const initializeAuth = async () => {
  console.log('Initializing auth for CareerGuidance...');
  try {
    await userStore.initialize();
    console.log('User Store Initialized, isAuthenticated:', userStore.isAuthenticated, 'tokenBalance:', userStore.user?.tokens);
    await checkAuthAndAccess();
    await checkAuthAndAccessMore();
    console.log('Auth checked, isContentAccessible:', isContentAccessible.value, 'hasSufficientTokens:', hasSufficientTokens.value);
    console.log('Auth checked for more, isContentAccessibleMore:', isContentAccessibleMore.value, 'hasSufficientTokensMore:', hasSufficientTokensMore.value);
  } catch (err) {
    console.error('Lỗi khi khởi tạo auth:', err);
    errors.value.general = 'Không thể khởi tạo trạng thái đăng nhập. Vui lòng thử lại.';
    toast.error(errors.value.general, { position: 'top-center' });
  }
};

// Load dữ liệu khi component được mount
onMounted(() => {
  console.log('Component mounted, isStoreInitialized:', userStore.isStoreInitialized);
  if (userStore.isStoreInitialized) {
    initializeAuth();
    fetchUserData();
  }
});

// Theo dõi isStoreInitialized để lấy dữ liệu khi store sẵn sàng
watch(() => userStore.isStoreInitialized, (initialized) => {
  if (initialized && process.client) {
    console.log('User store initialized, running initializeAuth and fetchUserData');
    initializeAuth();
    fetchUserData();
  }
});

// Validate form
const validateForm = () => {
  errors.value = {
    name: '',
    birthdate: '',
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
  } else if (!/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(formData.value.birthdate)) {
    errors.value.birthdate = 'Vui lòng nhập ngày đúng định dạng DD/MM/YYYY hoặc DD-MM-YYYY';
    isValid = false;
  } else {
    const match = formData.value.birthdate.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
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

  return isValid;
};

// Hàm lấy định hướng nghề nghiệp
const getCareerGuidance = async () => {
  if (!process.client) {
    console.warn('getCareerGuidance called on server-side, ignoring.');
    return;
  }
  if (!validateForm()) {
    toast.error('Vui lòng kiểm tra lại thông tin nhập', { position: 'top-center' });
    return;
  }

  if (isContentAccessible.value) {
    await fetchCareerGuidance();
  } else {
    try {
      await performAction();
      if (isContentAccessible.value) {
        await fetchCareerGuidance();
      } else {
        toast.error(errorMessage.value, { position: 'top-center' });
      }
    } catch (err) {
      console.error('Error in performAction:', err);
      toast.error(errorMessage.value || 'Có lỗi khi kiểm tra quyền truy cập', { position: 'top-center' });
    }
  }
};

// Hàm gọi API lấy định hướng nghề nghiệp
const fetchCareerGuidance = async () => {
  loading.value = true;
  errors.value.general = '';
  try {
    const username = userStore.isAuthenticated ? userStore.user.email : 'guest';
    console.log('Sending request to /api/numerology/career with data:', formData.value);
    const response = await $fetch('/api/numerology/career', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: { ...formData.value, numSuggestions: 3, previousJobs: [] },
    });
    console.log('Response from /api/numerology/career:', response);
    result.value = response;
    toast.success('Định hướng nghề nghiệp đã hoàn tất!', { position: 'top-center' });
    setTimeout(() => {
      const resultElement = document.querySelector('[v-if="isContentAccessible && result"]');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    await checkAuthAndAccess();
    await checkAuthAndAccessMore();
  } catch (error) {
    console.error('Error in fetchCareerGuidance:', error);
    errors.value.general = error.data?.message || 'Có lỗi xảy ra khi lấy định hướng nghề nghiệp!';
    toast.error(errors.value.general, { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};

// Hàm tải thêm nghề nghiệp
const loadMoreCareers = async () => {
  if (!process.client) {
    console.warn('loadMoreCareers called on server-side, ignoring.');
    return;
  }
  if (!result.value) return;

  if (isContentAccessibleMore.value) {
    await fetchMoreCareers();
  } else {
    try {
      await performActionMore();
      if (isContentAccessibleMore.value) {
        await fetchMoreCareers();
      } else {
        toast.error(errorMessageMore.value, { position: 'top-center' });
      }
    } catch (err) {
      console.error('Error in performActionMore:', err);
      toast.error(errorMessageMore.value || 'Có lỗi khi kiểm tra quyền truy cập', { position: 'top-center' });
    }
  }
};

// Hàm gọi API tải thêm nghề nghiệp
const fetchMoreCareers = async () => {
  loadingMore.value = true;
  try {
    const username = userStore.isAuthenticated ? userStore.user.email : 'guest';
    const numSuggestions = Math.min(result.value.careerSuggestions.length + 3, maxSuggestions.value);
    const previousJobs = result.value.careerSuggestions.map((s) => s.job);
    console.log('Sending request to /api/numerology/career for more suggestions, numSuggestions:', numSuggestions);
    const response = await $fetch('/api/numerology/career', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: { ...formData.value, numSuggestions, previousJobs },
    });
    console.log('Response from /api/numerology/career (more suggestions):', response);
    result.value = response;
    toast.success(
      `Đã tải thêm ${response.careerSuggestions.length - (result.value.careerSuggestions.length - 3)} nghề nghiệp phù hợp!`,
      { position: 'top-center' }
    );
    await checkAuthAndAccess();
    await checkAuthAndAccessMore();
  } catch (error) {
    console.error('Error loading more careers:', error);
    errors.value.general = error.data?.message || 'Có lỗi khi tải thêm nghề nghiệp!';
    toast.error(errors.value.general, { position: 'top-center' });
  } finally {
    loadingMore.value = false;
  }
};
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
  @apply px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap mx-2;
}
</style>
