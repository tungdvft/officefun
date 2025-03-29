<!-- pages/dashboard/index.vue -->
<template>
  <div class="space-y-8">
    <!-- Banner chào mừng -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-xl shadow-lg">
      <h1 class="text-4xl font-bold mb-2">Chào mừng đến với Thần số học</h1>
      <p class="text-lg opacity-90">Khám phá ý nghĩa sâu xa của con số trong cuộc sống của bạn.</p>
      <NuxtLink
        to="/baby-name"
        class="mt-4 inline-block bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-100 transition"
      >
        Bắt đầu ngay
      </NuxtLink>
    </div>

    <!-- Grid các tính năng -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-xl font-semibold text-purple-700">Đặt tên con</h2>
        </div>
        <p class="text-gray-600">Tìm tên hoàn hảo cho bé yêu dựa trên năng lượng số học.</p>
        <NuxtLink to="/baby-name" class="mt-4 inline-block text-purple-500 hover:underline">Thử ngay</NuxtLink>
      </div>
      <!-- Các card khác giữ nguyên -->
    </div>

    <!-- Dự đoán năm cá nhân -->
    <div class="bg-white p-6 rounded-xl shadow-lg">
      <h2 class="text-2xl font-semibold text-purple-700 mb-4">Dự đoán năm cá nhân</h2>
      <div class="space-y-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <label for="birthDate" class="block text-gray-700 font-medium mb-2">Ngày sinh (dd/mm/yyyy)</label>
            <input
              v-model="personalYearForm.birthDate"
              type="text"
              id="birthDate"
              placeholder="Ví dụ: 15/08/1995"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div class="flex-1">
            <label for="year" class="block text-gray-700 font-medium mb-2">Năm muốn xem</label>
            <input
              v-model="personalYearForm.year"
              type="number"
              id="year"
              :placeholder="currentYear"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        <button
          @click="getPersonalYear"
          :disabled="personalYearLoading"
          class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
        >
          {{ personalYearLoading ? 'Đang xử lý...' : 'Xem dự đoán' }}
        </button>
        <div v-if="personalYearResult" class="mt-4 p-4 bg-purple-50 rounded-lg">
          <p class="text-purple-800 font-semibold">Số năm cá nhân: {{ personalYearResult.number }}</p>
          <p class="text-gray-700 mt-2">{{ personalYearResult.description }}</p>
        </div>
      </div>
    </div>

    <!-- Lịch số học cá nhân -->
    <div class="bg-white p-6 rounded-xl shadow-lg">
      <h2 class="text-2xl font-semibold text-purple-700 mb-4">Lịch số học cá nhân</h2>
      <div class="flex flex-col md:flex-row gap-4 mb-4">
        <div class="flex-1">
          <label for="calendarBirthDate" class="block text-gray-700 font-medium mb-2">Ngày sinh (dd/mm/yyyy)</label>
          <input
            v-model="calendarForm.birthDate"
            type="text"
            id="calendarBirthDate"
            placeholder="Ví dụ: 15/08/1995"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div class="flex-1">
          <label for="month" class="block text-gray-700 font-medium mb-2">Tháng/Năm</label>
          <input
            v-model="calendarForm.monthYear"
            type="text"
            id="month"
            :placeholder="currentMonthYear"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
      <button
        @click="getCalendar"
        :disabled="calendarLoading"
        class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400 mb-4"
      >
        {{ calendarLoading ? 'Đang xử lý...' : 'Xem lịch' }}
      </button>
      <div v-if="calendarData" class="grid grid-cols-7 gap-2 text-center">
        <div v-for="day in ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']" :key="day" class="font-semibold text-gray-700">{{ day }}</div>
        <div
          v-for="(day, index) in calendarData.days"
          :key="index"
          :class="[
            'p-2 rounded-lg',
            day.number === 1 ? 'bg-green-100 text-green-800' :
            day.number === 8 ? 'bg-yellow-100 text-yellow-800' :
            day.number === 5 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
          ]"
          :title="day.description"
        >
          <span>{{ day.date }}</span>
          <span class="block text-sm">{{ day.number }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';

definePageMeta({
  layout: 'dashboard'
});

const currentYear = new Date().getFullYear();
const currentMonthYear = `${new Date().getMonth() + 1}/${currentYear}`;

// Dự đoán năm cá nhân
const personalYearForm = ref({
  birthDate: '',
  year: currentYear
});
const personalYearResult = ref(null);
const personalYearLoading = ref(false);

const getPersonalYear = async () => {
  if (!personalYearForm.value.birthDate) {
    toast.error('Vui lòng nhập ngày sinh!', { position: 'top-center' });
    return;
  }
  personalYearLoading.value = true;
  try {
    const response = await $fetch('/api/numerology/personal-year', {
      method: 'POST',
      body: {
        birthDate: personalYearForm.value.birthDate,
        year: personalYearForm.value.year
      }
    });
    personalYearResult.value = response.personalYear;
    toast.success('Dự đoán hoàn tất!', { position: 'top-center' });
  } catch (error) {
    console.error('Error:', error);
    toast.error('Không thể lấy dự đoán!', { position: 'top-center' });
  } finally {
    personalYearLoading.value = false;
  }
};

// Lịch số học cá nhân
const calendarForm = ref({
  birthDate: '',
  monthYear: currentMonthYear
});
const calendarData = ref(null);
const calendarLoading = ref(false);

const getCalendar = async () => {
  if (!calendarForm.value.birthDate) {
    toast.error('Vui lòng nhập ngày sinh!', { position: 'top-center' });
    return;
  }
  calendarLoading.value = true;
  try {
    const response = await $fetch('/api/numerology/calendar', {
      method: 'POST',
      body: {
        birthDate: calendarForm.value.birthDate,
        monthYear: calendarForm.value.monthYear
      }
    });
    calendarData.value = response.calendar;
    toast.success('Lịch đã sẵn sàng!', { position: 'top-center' });
  } catch (error) {
    console.error('Error:', error);
    toast.error('Không thể tạo lịch!', { position: 'top-center' });
  } finally {
    calendarLoading.value = false;
  }
};
</script>