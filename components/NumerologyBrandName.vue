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
          <div v-else-if="errorMessage" class="text-red-600 text-center font-medium p-6">
            <template v-if="errorType === 'login'">
              Vui lòng <button @click="errorAction" class="action-button">Đăng Nhập</button> để tạo gợi ý tên thương hiệu.
            </template>
            <template v-else-if="errorType === 'topup'">
              Không đủ token để tạo gợi ý tên thương hiệu. Hãy <button @click="navigateToTopup" class="action-button">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
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
                Vui lòng <button @click="errorAction" class="action-button">Đăng Nhập</button> để tạo gợi ý tên thương hiệu.
              </p>
            </template>
            <template v-else-if="userStore.isAuthenticated && !hasSufficientTokens">
              <p class="text-red-600 font-medium mb-4">
                Không đủ token để tạo gợi ý tên thương hiệu. Hãy <button @click="navigateToTopup" class="action-button">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
              </p>
            </template>
            <template v-else>
              <button @click="generateReport" class="action-button">
                Tạo gợi ý tên thương hiệu (Cần {{ tokenCost }} tokens)
              </button>
            </template>
          </div>
        </div>

        <!-- Results Section -->
        <transition name="slide-fade">
          <div v-if="numerologyData && isContentAccessible" class="mt-8 space-y-6">
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
              <div v-if="numerologyData.suggestions.length < maxSuggestions && isContentAccessible" class="text-center p-6">
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
                    Vui lòng <button @click="errorActionMore" class="action-button">Đăng Nhập</button> để xem thêm gợi ý.
                  </template>
                  <template v-else-if="errorTypeMore === 'topup'">
                    Không đủ token để xem thêm gợi ý. Hãy <button @click="navigateToTopup" class="action-button">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
                  </template>
                  <template v-else>
                    {{ errorMessageMore }}
                  </template>
                </div>
                <div v-else-if="!isContentAccessibleMore" class="text-center p-6">
                  <template v-if="!userStore.isAuthenticated">
                    <p class="text-red-600 font-medium mb-4">
                      Vui lòng <button @click="errorActionMore" class="action-button">Đăng Nhập</button> để xem thêm gợi ý.
                    </p>
                  </template>
                  <template v-else-if="userStore.isAuthenticated && !hasSufficientTokensForMore">
                    <p class="text-red-600 font-medium mb-4">
                      Không đủ token để xem thêm gợi ý. Hãy <button @click="navigateToTopup" class="action-button">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
                    </p>
                  </template>
                  <template v-else>
                    <button @click="showMoreSuggestions" class="action-button">
                      Xem thêm gợi ý (Cần {{ tokenCostMore }} tokens)
                    </button>
                  </template>
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
import { useProtectedContent } from '~/composables/useProtectedContent';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

definePageMeta({ layout: 'view' });

const router = useRouter();
const userStore = useUserStore();
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
const tokenCost = ref(50); // Lần đầu: 50 tokens
const tokenCostMore = ref(10); // Tải thêm: 10 tokens
const maxSuggestions = ref(30);
const description = 'Access to brand name generation based on numerology';
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
  hasSufficientTokens: hasSufficientTokensForMore,
  checkAuthAndAccess: checkAuthAndAccessMore,
  performAction: performActionMore,
  errorAction: errorActionMore,
  navigateToTopup: navigateToTopupMore,
} = useProtectedContent(tokenCostMore.value, 'Load more brand name suggestions');

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
    const { fullname } = response.user;
    formData.value.ownerName = fullname?.trim() || '';
  } catch (err) {
    console.error('Error fetching user data:', err);
    errors.value.general = err.data?.message || 'Không thể tải thông tin tài khoản. Vui lòng nhập thủ công.';
    toast.error(errors.value.general, { position: 'top-center' });
  }
};

// Khởi tạo trạng thái đăng nhập và kiểm tra token
const initializeAuth = async () => {
  console.log('Initializing auth for BrandNumerology...');
  try {
    await userStore.initialize();
    console.log('User Store Initialized, isAuthenticated:', userStore.isAuthenticated, 'tokenBalance:', userStore.user?.tokens);
    await checkAuthAndAccess();
    await checkAuthAndAccessMore();
    console.log('Auth checked, isContentAccessible:', isContentAccessible.value, 'hasSufficientTokens:', hasSufficientTokens.value);
    console.log('Auth checked for more, isContentAccessibleMore:', isContentAccessibleMore.value, 'hasSufficientTokensForMore:', hasSufficientTokensForMore.value);
  } catch (err) {
    console.error('Lỗi khi khởi tạo auth:', err);
    errors.value.general = 'Không thể khởi tạo trạng thái đăng nhập. Vui lòng thử lại.';
    toast.error(errors.value.general, { position: 'top-center' });
  }
};

// Load saved data from localStorage on mount
onMounted(() => {
  console.log('Component mounted, isStoreInitialized:', userStore.isStoreInitialized);
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
  if (userStore.isStoreInitialized) {
    initializeAuth();
    fetchUserData();
  }
});

// Save data to localStorage on change
watch([formData, numerologyData], () => {
  localStorage.setItem('brandNumerologyData', JSON.stringify({
    formData: formData.value,
    numerologyData: numerologyData.value,
  }));
}, { deep: true });

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

// Hàm tạo gợi ý tên thương hiệu
const generateReport = async () => {
  if (!process.client) {
    console.warn('generateReport called on server-side, ignoring.');
    return;
  }
  if (!validateForm()) {
    toast.error('Vui lòng kiểm tra lại thông tin nhập', { position: 'top-center' });
    return;
  }

  if (isContentAccessible.value) {
    await fetchBrandNames();
  } else {
    try {
      await performAction();
      if (isContentAccessible.value) {
        await fetchBrandNames();
      } else {
        toast.error(errorMessage.value, { position: 'top-center' });
      }
    } catch (err) {
      console.error('Error in performAction:', err);
      toast.error(errorMessage.value || 'Có lỗi khi kiểm tra quyền truy cập', { position: 'top-center' });
    }
  }
};

// Hàm gọi API để tạo gợi ý tên thương hiệu
async function fetchBrandNames() {
  loading.value = true;
  errors.value.general = '';
  try {
    const username = userStore.isAuthenticated ? userStore.user.email : 'guest';
    console.log('Sending request to /api/numerology/brand with data:', formData.value);
    const response = await $fetch('/api/numerology/brand', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: {
        ...formData.value,
        extraRequest: `${formData.value.extraRequest || ''} Tên bằng ${formData.value.language === 'english' ? 'tiếng Anh' : 'tiếng Việt'}`.trim(),
        count: 3,
        excludeNames: [],
      },
    });
    console.log('Response from /api/numerology/brand:', response);
    numerologyData.value = response.numerology;
    totalSuggestions.value = response.numerology.suggestions.length;
    existingNames.value = response.numerology.suggestions.map((s) => s.name);
    await checkAuthAndAccess();
    await checkAuthAndAccessMore();
    toast.success('Tạo gợi ý tên thương hiệu hoàn tất!', { position: 'top-center' });
    // Scroll to result
    setTimeout(() => {
      const resultElement = document.querySelector('[v-if="numerologyData && isContentAccessible"]');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  } catch (error) {
    console.error('Error in fetchBrandNames:', error);
    errors.value.general = error.data?.message || 'Có lỗi xảy ra khi tạo gợi ý tên thương hiệu!';
    toast.error(errors.value.general, { position: 'top-center' });
  } finally {
    loading.value = false;
  }
}

// Hàm tải thêm gợi ý
const showMoreSuggestions = async () => {
  if (!process.client) {
    console.warn('showMoreSuggestions called on server-side, ignoring.');
    return;
  }
  if (totalSuggestions.value >= maxSuggestions.value) {
    toast.info('Đã đạt số lượng tối đa 30 gợi ý tên thương hiệu!', { position: 'top-center' });
    return;
  }

  if (isContentAccessibleMore.value) {
    await fetchMoreSuggestions();
  } else {
    try {
      await performActionMore();
      if (isContentAccessibleMore.value) {
        await fetchMoreSuggestions();
      } else {
        toast.error(errorMessageMore.value, { position: 'top-center' });
      }
    } catch (err) {
      console.error('Error in performActionMore:', err);
      toast.error(errorMessageMore.value || 'Có lỗi khi kiểm tra quyền truy cập', { position: 'top-center' });
    }
  }
};

// Hàm gọi API để tải thêm gợi ý
async function fetchMoreSuggestions() {
  loadingMore.value = true;
  errors.value.general = '';
  try {
    const username = userStore.isAuthenticated ? userStore.user.email : 'guest';
    console.log('Sending request to /api/numerology/brand for more suggestions');
    const response = await $fetch('/api/numerology/brand', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: {
        ...formData.value,
        extraRequest: `${formData.value.extraRequest || ''} Tên bằng ${formData.value.language === 'english' ? 'tiếng Anh' : 'tiếng Việt'}`.trim(),
        count: 3,
        excludeNames: existingNames.value,
      },
    });
    console.log('Response from /api/numerology/brand (more suggestions):', response);
    if (response.numerology && response.numerology.suggestions) {
      numerologyData.value.suggestions = [
        ...numerologyData.value.suggestions,
        ...response.numerology.suggestions,
      ];
      totalSuggestions.value = numerologyData.value.suggestions.length;
      existingNames.value = numerologyData.value.suggestions.map((s) => s.name);
      await checkAuthAndAccess();
      await checkAuthAndAccessMore();
      toast.success(`Đã thêm ${response.numerology.suggestions.length} gợi ý tên mới!`, { position: 'top-center' });
    }
  } catch (error) {
    console.error('Error loading more suggestions:', error);
    errors.value.general = error.data?.message || 'Không thể tải thêm gợi ý tên!';
    toast.error(errors.value.general, { position: 'top-center' });
  } finally {
    loadingMore.value = false;
  }
}
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
  transform: translateY(20px);
  opacity: 0;
}

.action-button {
  @apply px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap mx-2;
}
</style>
