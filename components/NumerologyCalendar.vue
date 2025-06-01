<template>
  <div class="bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4 min-h-screen">
    <div class="container mx-auto p-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Lịch Thần Số Học</h2>
        <p class="text-gray-600">Khám phá năng lượng hàng ngày, hàng tháng và hàng năm của bạn</p>
      </div>

      <!-- Main Content -->
      <div class="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
        <!-- Form -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-purple-700 mb-4">Nhập thông tin của bạn</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh (DD/MM/YYYY)</label>
              <input
                v-model="formData.date"
                type="text"
                id="date"
                placeholder="15/03/1990"
                :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.date ? 'border-red-500' : 'border-gray-300']"
              />
              <p v-if="errors.date" class="text-red-600 text-sm mt-1">{{ errors.date }}</p>
            </div>
            <div>
              <label for="year" class="block text-sm font-medium text-gray-700 mb-2">Năm lịch</label>
              <input
                v-model="formData.year"
                type="number"
                id="year"
                placeholder="2025"
                min="1900"
                max="2100"
                :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.year ? 'border-red-500' : 'border-gray-300']"
              />
              <p v-if="errors.year" class="text-red-600 text-sm mt-1">{{ errors.year }}</p>
            </div>
          </div>
          <div>
            <label for="ownerName" class="block text-sm font-medium text-gray-700 mb-2">Tên của bạn (tùy chọn)</label>
            <input
              v-model="formData.ownerName"
              type="text"
              id="ownerName"
              placeholder="Nguyễn Văn A"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            />
          </div>
          <div v-if="errors.general" class="p-4 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200">
            {{ errors.general }}
          </div>
          <div class="flex justify-center">
            <button
              @click="generateCalendar"
              :disabled="loading"
              class="w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-3 px-8 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-md"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tạo lịch...
              </span>
              <span v-else>Tạo lịch thần số học</span>
            </button>
          </div>
        </div>

        <!-- Results Section -->
        <transition name="slide-fade">
          <div v-if="numerologyData" class="mt-8 space-y-6">
            <!-- Yearly Info -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <h3 class="text-lg font-semibold text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </span>
                Năng lượng năm {{ formData.year }}
              </h3>
              <p class="text-gray-600 mt-2"><strong>Số năm cá nhân:</strong> {{ numerologyData.yearly.personalYear }}</p>
              <p class="text-gray-600 mt-2">{{ numerologyData.yearly.yearlyDesc }}</p>
            </div>

            <!-- Calendar -->
            <div>
              <h3 class="text-lg font-semibold text-purple-700 mb-4 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
                  </svg>
                </span>
                Lịch thần số học {{ formData.year }}
              </h3>
              <v-calendar
                :attributes="calendarAttributes"
                :min-date="new Date(formData.year, 0, 1)"
                :max-date="new Date(formData.year, 11, 31)"
                @dayclick="openDayModal"
                class="custom-calendar"
              />
            </div>
          </div>
        </transition>

        <!-- Modal for Day Details -->
        <transition name="fade">
          <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
              <h3 class="text-lg font-semibold text-purple-700 mb-4">Năng lượng ngày {{ selectedDay?.date }}</h3>
              <p class="text-gray-600"><strong>Số năng lượng:</strong> {{ selectedDay?.dailyEnergy }}</p>
              <p class="text-gray-600 mt-2">{{ selectedDay?.dailyDesc }}</p>
              <div class="mt-4 flex justify-end">
                <button
                  @click="showModal = false"
                  class="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { toast } from 'vue3-toastify';

definePageMeta({ layout: 'view' });

const formData = ref({
  date: '',
  year: '2025',
  ownerName: '',
});
const numerologyData = ref(null);
const loading = ref(false);
const errors = ref({
  date: '',
  year: '',
  general: '',
});
const showModal = ref(false);
const selectedDay = ref(null);

// Load saved data from localStorage
onMounted(() => {
  const savedData = localStorage.getItem('numerologyCalendarData');
  if (savedData) {
    const parsed = JSON.parse(savedData);
    formData.value = parsed.formData || { date: '', year: '2025', ownerName: '' };
    numerologyData.value = parsed.numerologyData || null;
  }
});

// Save data to localStorage
watch([formData, numerologyData], () => {
  localStorage.setItem('numerologyCalendarData', JSON.stringify({
    formData: formData.value,
    numerologyData: numerologyData.value,
  }));
}, { deep: true });

// Validate form
const validateForm = () => {
  errors.value = { date: '', year: '', general: '' };
  let isValid = true;

  if (!formData.value.date.trim()) {
    errors.value.date = 'Vui lòng nhập ngày sinh';
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
      errors.value.date = 'Ngày sinh không hợp lệ';
      isValid = false;
    }
  }

  if (!formData.value.year.trim()) {
    errors.value.year = 'Vui lòng nhập năm lịch';
    isValid = false;
  } else {
    const year = Number(formData.value.year);
    if (isNaN(year) || year < 1900 || year > 2100) {
      errors.value.year = 'Năm phải từ 1900 đến 2100';
      isValid = false;
    }
  }

  return isValid;
};

// Calendar attributes for V-Calendar
const calendarAttributes = computed(() => {
  if (!numerologyData.value?.daily) return [];
  return numerologyData.value.daily.map(day => ({
    key: day.date,
    highlight: {
      color: 'purple',
      fillMode: 'light',
    },
    contentStyle: {
      color: `#${(day.dailyEnergy * 111111).toString(16).padStart(6, '0')}`,
    },
    dates: new Date(day.date.split('/').reverse().join('-')),
    customData: day,
  }));
});

// Generate calendar data
const generateCalendar = async () => {
  if (!validateForm()) return;

  loading.value = true;
  errors.value.general = '';
  try {
    const username = localStorage.getItem('username') || 'guest';
    const response = await $fetch('/api/numerology/calendar', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: formData.value,
    });
    numerologyData.value = response.numerology;
    toast.success('Tạo lịch thần số học hoàn tất!', { position: 'top-center' });
  } catch (error) {
    console.error('Error:', error);
    errors.value.general = error.data?.message || 'Có lỗi xảy ra!';
    toast.error('Không thể tạo lịch!', { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};

// Open modal for day clicked
const openDayModal = (day) => {
  if (day.attributes && day.attributes[0]?.customData) {
    selectedDay.value = day.attributes[0].customData;
    showModal.value = true;
  }
};
</script>

<style scoped>
.custom-calendar {
  @apply bg-white rounded-lg shadow-md border border-gray-200 p-4;
}

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
</style>