<!-- components/NumerologyCalendar.vue -->
<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-2xl font-semibold text-purple-700 mb-6">Lịch số học cá nhân</h2>
    <div class="space-y-6">
      <div>
        <label for="birthDate" class="block text-gray-700 font-medium mb-2">Ngày sinh (dd/mm/yyyy)</label>
        <input
          v-model="birthDate"
          type="text"
          id="birthDate"
          placeholder="Ví dụ: 15/08/1995"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label for="monthYear" class="block text-gray-700 font-medium mb-2">Tháng và năm (mm/yyyy)</label>
        <input
          v-model="monthYear"
          type="text"
          id="monthYear"
          placeholder="Ví dụ: 03/2025"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <button
        @click="generateCalendar"
        :disabled="loading"
        class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
      >
        {{ loading ? 'Đang tạo lịch...' : 'Xem lịch' }}
      </button>

      <!-- Lịch -->
      <div v-if="calendarData" class="mt-6">
        <h3 class="text-lg font-semibold text-purple-900 mb-4">{{ calendarData.month }}/{{ calendarData.year }}</h3>
        <div class="grid grid-cols-7 gap-2 text-center">
          <div v-for="day in ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']" :key="day" class="font-semibold text-gray-700">
            {{ day }}
          </div>
          <div
            v-for="(day, index) in calendarData.days"
            :key="index"
            :class="{
              'p-2 rounded-full': true,
              'bg-green-200': day.type === 'good',
              'bg-yellow-200': day.type === 'average',
              'bg-red-200': day.type === 'bad',
              'bg-gray-100': !day.number,
              'text-gray-500': !day.number
            }"
            :title="day.number ? `Số ngày: ${day.personalNumber} - ${day.desc}` : ''"
          >
            {{ day.number || '' }}
          </div>
        </div>

        <!-- Chú thích -->
        <div class="mt-6 p-4 bg-purple-50 rounded-lg">
          <h4 class="text-purple-900 font-semibold mb-2">Chú thích màu sắc:</h4>
          <p><span class="inline-block w-4 h-4 bg-green-200 mr-2"></span> <strong>Ngày tốt:</strong> Năng lượng tích cực, phù hợp để bắt đầu dự án, ký kết, hoặc giao tiếp quan trọng.</p>
          <p><span class="inline-block w-4 h-4 bg-yellow-200 mr-2"></span> <strong>Ngày trung bình:</strong> Ổn định, thích hợp cho công việc thường nhật, không quá nổi bật.</p>
          <p><span class="inline-block w-4 h-4 bg-red-200 mr-2"></span> <strong>Ngày xấu:</strong> Năng lượng thấp, nên tránh quyết định lớn hoặc hành động mạo hiểm.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';

const birthDate = ref('');
const monthYear = ref('');
const calendarData = ref(null);
const loading = ref(false);

const generateCalendar = async () => {
  if (!birthDate.value) {
    toast.error('Vui lòng nhập ngày sinh!');
    return;
  }
  if (!monthYear.value) {
    toast.error('Vui lòng nhập tháng và năm!');
    return;
  }

  loading.value = true;
  try {
    const response = await $fetch('/api/numerology/calendar', {
      method: 'POST',
      body: {
        birthDate: birthDate.value,
        monthYear: monthYear.value,
      },
    });

    calendarData.value = response.calendar;
    toast.success('Lịch đã sẵn sàng!');
  } catch (error) {
    console.error('Error:', error);
    toast.error('Không thể tạo lịch!');
  } finally {
    loading.value = false;
  }
};
</script>