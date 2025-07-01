
<template>
  <div class="bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
    <div class="container mx-auto p-4">
      <!-- Header Section -->
      <div class="text-center mb-8 relative">
        <h1 class="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Thần Số Học Hôm Nay - Khám Phá Vận Mệnh Ngày Mới</h1>
        <p class="text-gray-600">Mỗi ngày là một con số khác nhau - Hãy xem hôm nay vũ trụ dành điều gì cho bạn!</p>
        <p class="text-gray-600 mt-2">Hôm nay: <span class="font-medium">{{ currentDate }}</span></p>
        <div v-if="personalDayNumber" class="mt-4 inline-flex items-center px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
          Số ngày cá nhân hôm nay của bạn: <span class="font-bold ml-1">{{ personalDayNumber }}</span>
        </div>
      </div>

      <!-- Main Content -->
      <div class="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
        <div v-if="userStore.isStoreInitialized" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
            <input
              v-model="name"
              type="text"
              id="name"
              placeholder="VD: Nguyễn Văn A"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            />
          </div>
          <div>
            <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh (DD/MM/YYYY)</label>
            <input
              v-model="birthDateInput"
              type="text"
              id="birthDate"
              placeholder="VD: 01/01/1990"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            />
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="mb-6">
          <nav class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="activeTab = tab"
              :class="[
                activeTab === tab
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-700',
                'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200'
              ]"
            >
              {{ tab }}
            </button>
          </nav>
        </div>

        <!-- Input Form for Preferences/Plans -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="activeTab === 'Đồ ăn'">
            <label for="foodPreferences" class="block text-sm font-medium text-gray-700 mb-3">Món ăn yêu thích (phân cách bằng , nếu không có bỏ trống)</label>
            <input
              v-model="foodPreferences"
              type="text"
              id="foodPreferences"
              placeholder="VD: phở,bún,cơm tấm"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            />
          </div>

          <div v-else-if="activeTab === 'Đồ uống'">
            <label for="drinkPreferences" class="block text-sm font-medium text-gray-700 mb-3">Đồ uống yêu thích (phân cách bằng , nếu không có bỏ trống)</label>
            <input
              v-model="drinkPreferences"
              type="text"
              id="drinkPreferences"
              placeholder="VD: trà sữa,cà phê,nước cam"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            />
          </div>

          <div v-else>
            <label for="plans" class="block text-sm font-medium text-gray-700 mb-3">Dự định hôm nay (phân cách bằng , nếu không có bỏ trống)</label>
            <input
              v-model="plans"
              type="text"
              id="plans"
              placeholder="VD: gặp khách hàng,hoàn thành báo cáo,đi tập gym"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            />
          </div>

          <!-- Button -->
          <div class="flex flex-col items-center">
            <button
              type="submit"
              :disabled="isLoading || !hasSufficientTokens"
              class="w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-3 px-8 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-md"
            >
              <span v-if="isLoading">Đang xử lý...</span>
              <span v-else>{{ isLoggedIn ? `Xem gợi ý (Cần ${tokenCost} tokens)` : 'Đăng nhập để xem gợi ý' }}</span>
            </button>
          </div>

          <!-- Error Messages -->
          <div v-if="error || errorMessage" class="mt-6 p-4 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200">
            <p v-if="error">{{ error }}</p>
            <p v-if="errorMessage">{{ errorMessage }}</p>
            <p v-if="hasSufficientTokens === false" class="text-sm mt-1">Bạn không có đủ token. Vui lòng nạp thêm.</p>
          </div>

          <!-- Results Section -->
          <div v-if="recommendations" class="mt-8 space-y-6">
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <div class="flex items-center">
                <div class="bg-purple-100 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-purple-800">Số ngày cá nhân: <span class="text-2xl font-bold">{{ personalDayNumber }}</span></h2>
                  <p class="text-gray-600 mt-1">Dựa trên ngày sinh của bạn, hôm nay là ngày mang năng lượng số {{ personalDayNumber }}.</p>
                </div>
              </div>
            </div>

            <!-- Food Recommendations -->
            <div v-if="activeTab === 'Đồ ăn' && recommendations.food" class="space-y-4">
              <h3 class="font-medium text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
                  </svg>
                </span>
                Gợi ý món ăn
              </h3>
              <div v-if="Array.isArray(recommendations.food)" class="grid gap-4 md:grid-cols-2">
                <div v-for="(item, index) in recommendations.food" :key="index" class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <p class="font-medium text-gray-800 flex items-center">
                    <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mr-2 text-sm">{{ index + 1 }}</span>
                    {{ item.item }}
                  </p>
                  <p class="text-gray-600 text-sm mt-2">{{ item.explanation }}</p>
                </div>
              </div>
              <div v-else class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <p class="font-medium text-gray-800">{{ recommendations.food.item }}</p>
                <p class="text-gray-600 text-sm mt-2">{{ recommendations.food.explanation }}</p>
              </div>
            </div>

            <!-- Drink Recommendations -->
            <div v-if="activeTab === 'Đồ uống' && recommendations.drink" class="space-y-4">
              <h3 class="font-medium text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clip-rule="evenodd" />
                  </svg>
                </span>
                Gợi ý đồ uống
              </h3>
              <div v-if="Array.isArray(recommendations.drink)" class="grid gap-4 md:grid-cols-2">
                <div v-for="(item, index) in recommendations.drink" :key="index" class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <p class="font-medium text-gray-800 flex items-center">
                    <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-2 text-sm">{{ index + 1 }}</span>
                    {{ item.item }}
                  </p>
                  <p class="text-gray-600 text-sm mt-2">{{ item.explanation }}</p>
                </div>
              </div>
              <div v-else class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <p class="font-medium text-gray-800">{{ recommendations.drink.item }}</p>
                <p class="text-gray-600 text-sm mt-2">{{ recommendations.drink.explanation }}</p>
              </div>
            </div>

            <!-- Insight Recommendations -->
            <div v-if="activeTab === 'Insight hôm nay' && recommendations.insight" class="space-y-6">
              <h3 class="font-medium text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </span>
                Insight hôm nay
              </h3>
              <div v-if="recommendations.insight.selectedPlan" class="space-y-6">
                <div class="bg-white p-5 rounded-xl border border-green-100 shadow-sm">
                  <h4 class="text-sm font-semibold text-green-600 uppercase tracking-wider mb-3">DỰ ĐỊNH TỐT NHẤT</h4>
                  <p class="text-gray-800 font-semibold text-lg">{{ recommendations.insight.selectedPlan }}</p>
                  <p class="text-gray-600 mt-2">{{ recommendations.insight.planExplanation }}</p>
                </div>
                <div class="grid gap-5 md:grid-cols-2">
                  <div class="bg-white p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                    <h4 class="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      NÊN LÀM
                    </h4>
                    <p class="text-gray-800 font-medium">{{ recommendations.insight.doToday.activity }}</p>
                    <p class="text-gray-600 mt-2 text-sm">{{ recommendations.insight.doToday.explanation }}</p>
                  </div>
                  <div class="bg-white p-5 rounded-xl border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                    <h4 class="text-sm font-semibold text-red-600 uppercase tracking-wider mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                      NÊN TRÁNH
                    </h4>
                    <p class="text-gray-800 font-medium">{{ recommendations.insight.avoidToday.activity }}</p>
                    <p class="text-gray-600 mt-2 text-sm">{{ recommendations.insight.avoidToday.explanation }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="space-y-6">
                <div class="grid gap-5 md:grid-cols-2">
                  <div class="bg-white p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                    <h4 class="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">NÊN LÀM</h4>
                    <div v-for="(item, index) in recommendations.insight.doToday" :key="'do-' + index" class="mt-4 first:mt-0">
                      <p class="text-gray-800 font-medium">{{ item.activity }}</p>
                      <p class="text-gray-600 mt-1 text-sm">{{ item.explanation }}</p>
                    </div>
                  </div>
                  <div class="bg-white p-5 rounded-xl border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                    <h4 class="text-sm font-semibold text-red-600 uppercase tracking-wider mb-3">NÊN TRÁNH</h4>
                    <div v-for="(item, index) in recommendations.insight.avoidToday" :key="'avoid-' + index" class="mt-4 first:mt-0">
                      <p class="text-gray-800 font-medium">{{ item.activity }}</p>
                      <p class="text-gray-600 mt-1 text-sm">{{ item.explanation }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useProtectedContent } from '~/composables/useProtectedContent';

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
  if (!dateStr || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return '';
  }
  const [day, month, year] = dateStr.split('/').map(Number);
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

// Hàm lấy ngày hiện tại định dạng DD/MM/YYYY
const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

// Hàm tính số ngày cá nhân
const calculatePersonalDayNumber = (birthDate, currentDate) => {
  if (!birthDate || !currentDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate) || !/^\d{2}\/\d{2}\/\d{4}$/.test(currentDate)) {
    return null;
  }

  const [birthDay, birthMonth, birthYear] = birthDate.split('/').map(Number);
  const [currentDay, currentMonth, currentYear] = currentDate.split('/').map(Number);

  const sumBirth = (birthDay + birthMonth + birthYear)
    .toString()
    .split('')
    .reduce((sum, digit) => sum + Number(digit), 0);
  const sumCurrent = (currentDay + currentMonth + currentYear)
    .toString()
    .split('')
    .reduce((sum, digit) => sum + Number(digit), 0);

  let personalDay = (sumBirth + sumCurrent) % 9;
  if (personalDay === 0) personalDay = 9;
  return personalDay;
};

// Khởi tạo dữ liệu người dùng từ userStore hoặc localStorage (auth)
const userStore = useUserStore();
const initializeUserData = () => {
  // Ưu tiên lấy từ userStore
  if (userStore.user?.fullname || userStore.user?.birthdate) {
    return {
      name: userStore.user.fullname?.trim() || '',
      birthDate: userStore.user.birthdate ? formatDateToDDMMYYYY(userStore.user.birthdate) : '',
      userId: userStore.user.id || null,
    };
  }

  // Nếu không có userStore, kiểm tra localStorage với key 'auth'
  if (process.client) {
    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        let formattedBirthDate = parsedData.birthdate || '';
        if (formattedBirthDate && formattedBirthDate.includes('T')) {
          formattedBirthDate = formatDateToDDMMYYYY(parsedData.birthdate);
        }
        return {
          name: parsedData.fullname?.trim() || '',
          birthDate: formattedBirthDate,
          userId: parsedData.id || null,
        };
      } catch (error) {
        console.error('Lỗi parse auth data từ localStorage:', error);
      }
    }
  }

  return {
    name: '',
    birthDate: '',
    userId: null,
  };
};

// Tải dữ liệu đã lưu từ localStorage (numerologyData)
const loadSavedData = () => {
  if (process.client) {
    const savedData = localStorage.getItem('numerologyData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        const authData = localStorage.getItem('auth');
        const currentUserId = authData ? JSON.parse(authData).id : null;
        if (parsedData.userId === currentUserId) {
          return {
            foodPreferences: parsedData.foodPreferences || '',
            drinkPreferences: parsedData.drinkPreferences || '',
            plans: parsedData.plans || '',
            activeTab: parsedData.activeTab || 'Insight hôm nay',
            personalDayNumber: parsedData.personalDayNumber || null,
            recommendations: parsedData.recommendations || null,
          };
        }
      } catch (error) {
        console.error('Lỗi parse numerology data từ localStorage:', error);
      }
    }
  }
  return {
    foodPreferences: '',
    drinkPreferences: '',
    plans: '',
    activeTab: 'Insight hôm nay',
    personalDayNumber: null,
    recommendations: null,
  };
};

// Khởi tạo state
const { name, birthDate, userId } = initializeUserData();
const savedData = loadSavedData();
const nameRef = ref(name);
const birthDateInput = ref(birthDate);
const userIdRef = ref(userId);
const foodPreferences = ref(savedData.foodPreferences);
const drinkPreferences = ref(savedData.drinkPreferences);
const plans = ref(savedData.plans);
const personalDayNumber = ref(savedData.personalDayNumber);
const recommendations = ref(savedData.recommendations);
const loading = ref(false);
const error = ref(null);
const activeTab = ref(savedData.activeTab);
const tabs = ['Insight hôm nay', 'Đồ ăn', 'Đồ uống'];
const currentDate = ref(getCurrentDate());

// Khởi tạo useProtectedContent
const tokenCost = ref(10);
const description = 'Access to daily numerology recommendations';
const { isLoading, errorMessage, isContentAccessible, hasSufficientTokens, checkAuthAndAccess } = useProtectedContent(tokenCost.value, description);
const isLoggedIn = ref(false);
let handleAction = () => {};

// Khởi tạo trạng thái đăng nhập và hành động
const initializeAuth = async () => {
  const { isLoggedIn: authStatus, action } = await checkAuthAndAccess();
  isLoggedIn.value = authStatus;
  handleAction = action;
};

// Hàm xóa dữ liệu localStorage cũ
const clearNumerologyData = () => {
  if (process.client) {
    localStorage.removeItem('numerologyData');
    foodPreferences.value = '';
    drinkPreferences.value = '';
    plans.value = '';
    personalDayNumber.value = null;
    recommendations.value = null;
    activeTab.value = 'Insight hôm nay';
  }
};

// Theo dõi thay đổi userId để xóa dữ liệu localStorage khi đăng nhập tài khoản mới
watch(
  () => userStore.user?.id,
  (newUserId, oldUserId) => {
    if (newUserId && newUserId !== oldUserId && oldUserId !== undefined) {
      clearNumerologyData();
      const { name, birthDate, userId } = initializeUserData();
      nameRef.value = name;
      birthDateInput.value = birthDate;
      userIdRef.value = userId;
      if (birthDateInput.value && /^\d{2}\/\d{2}\/\d{4}$/.test(birthDateInput.value)) {
        personalDayNumber.value = calculatePersonalDayNumber(birthDateInput.value, currentDate.value);
      }
    }
  },
  { immediate: true }
);

// Cập nhật thông tin người dùng khi thay đổi name hoặc birthDate
watch([nameRef, birthDateInput], async ([newName, newBirthDate]) => {
  if (!userStore.isStoreInitialized || !userIdRef.value) return;

  const currentBirthDate = userStore.user?.birthdate || '';
  const formattedNewBirthDate = formatDateToYYYYMMDD(newBirthDate);

  if (newName !== userStore.user?.fullname || formattedNewBirthDate !== currentBirthDate) {
    try {
      const response = await $fetch(`/api/users/${userIdRef.value}`, {
        method: 'PATCH',
        body: {
          fullname: newName.trim(),
          birthdate: formattedNewBirthDate,
        },
      });

      if (response.success) {
        userStore.setUser({
          id: userIdRef.value,
          email: userStore.user?.email || '',
          fullname: newName.trim(),
          birthdate: formattedNewBirthDate,
          tokens: userStore.user?.tokens || 0,
        });

        if (process.client) {
          const authData = localStorage.getItem('auth');
          if (authData) {
            const parsedData = JSON.parse(authData);
            localStorage.setItem(
              'auth',
              JSON.stringify({
                ...parsedData,
                fullname: newName.trim(),
                birthdate: formattedNewBirthDate,
              })
            );
          }
        }

        if (newBirthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(newBirthDate)) {
          personalDayNumber.value = calculatePersonalDayNumber(newBirthDate, currentDate.value);
        }
      }
    } catch (err) {
      console.error('Lỗi cập nhật thông tin người dùng:', err);
      error.value = 'Không thể cập nhật thông tin. Vui lòng thử lại.';
    }
  }
});

// Hàm xử lý submit form
const handleSubmit = async () => {
  error.value = null;
  errorMessage.value = null;

  if (isContentAccessible.value) {
    await getRecommendations();
  } else {
    await handleAction();
    if (isContentAccessible.value) {
      await getRecommendations();
    }
  }
};

async function getRecommendations() {
  error.value = null;
  recommendations.value = null;
  loading.value = true;

  try {
    if (!userStore.isStoreInitialized) {
      throw new Error('Đang tải thông tin người dùng, vui lòng thử lại');
    }

    let userId = userIdRef.value;
    if (!userId && process.client) {
      const authData = localStorage.getItem('auth');
      if (authData) {
        userId = JSON.parse(authData).id;
      }
    }

    if (!userId) {
      throw new Error('Vui lòng đăng nhập để sử dụng tính năng này');
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDateInput.value)) {
      throw new Error('Vui lòng nhập ngày sinh đúng định dạng DD/MM/YYYY');
    }

    let endpoint;
    let body = { birthDate: birthDateInput.value };

    if (activeTab.value === 'Đồ ăn') {
      endpoint = '/api/numerology/food';
      body.preferences = foodPreferences.value;
    } else if (activeTab.value === 'Đồ uống') {
      endpoint = '/api/numerology/drinks';
      body.preferences = drinkPreferences.value;
    } else {
      endpoint = '/api/numerology/insights';
      body.plans = plans.value;
    }

    const response = await $fetch(endpoint, {
      method: 'POST',
      body,
    });

    personalDayNumber.value = response.personalDayNumber;
    recommendations.value = response.recommendations;

    // Lưu dữ liệu vào localStorage
    if (process.client) {
      localStorage.setItem(
        'numerologyData',
        JSON.stringify({
          userId: userIdRef.value,
          name: nameRef.value,
          birthDate: birthDateInput.value,
          foodPreferences: foodPreferences.value,
          drinkPreferences: drinkPreferences.value,
          plans: plans.value,
          activeTab: activeTab.value,
          personalDayNumber: personalDayNumber.value,
          recommendations: recommendations.value,
        })
      );
    }
  } catch (err) {
    error.value =
      err.message === 'Không tìm thấy người dùng'
        ? 'Tài khoản không tồn tại, vui lòng đăng nhập lại'
        : err.message === 'Cơ sở dữ liệu chỉ đọc, không thể ghi'
        ? 'Hệ thống gặp lỗi, vui lòng thử lại sau'
        : err.message || 'Có lỗi xảy ra khi lấy gợi ý';
  } finally {
    loading.value = false;
  }
}

onBeforeMount(() => {
  if (process.client) {
    userStore.initialize();
  }
  if (birthDateInput.value && /^\d{2}\/\d{2}\/\d{4}$/.test(birthDateInput.value)) {
    personalDayNumber.value = personalDayNumber.value || calculatePersonalDayNumber(birthDateInput.value, currentDate.value);
  }
  initializeAuth();
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
</style>
