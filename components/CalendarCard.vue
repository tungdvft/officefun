<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-xl font-semibold text-yellow-700 mb-3 flex items-center">
      <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Lịch cá nhân
    </h2>

    <!-- Nút đồng bộ Google Calendar -->
    <button v-if="!isAuthenticated" @click="authenticateGoogle" class="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition">
      Đồng bộ Google Calendar
    </button>
    <button v-else @click="syncWithGoogleCalendar" class="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition">
      Sync ngay
    </button>

    <!-- Form nhập sự kiện -->
    <div class="mb-4">
      <label for="eventDatetime" class="block text-gray-700 mb-1">Ngày và giờ:</label>
      <VueDatePicker
        v-model="newEvent.datetime"
        id="eventDatetime"
        placeholder="Chọn ngày và giờ"
        class="w-full mb-2"
        :min-date="new Date()"
        :enable-time-picker="true"
        format="yyyy-MM-dd HH:mm"
      />

      <label for="eventDesc" class="block text-gray-700 mb-1">Mô tả:</label>
      <textarea id="eventDesc" v-model="newEvent.description" placeholder="Nhập công việc, họp..." class="w-full p-2 border rounded-lg mb-2" rows="3"></textarea>

      <button @click="addEvent" class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
        Thêm sự kiện
      </button>
    </div>

    <!-- Danh sách sự kiện -->
    <div v-if="events.length" class="mt-4">
      <h3 class="text-gray-800 font-semibold mb-2">Sự kiện hôm nay:</h3>
      <ul class="space-y-2">
        <li v-for="(event, index) in filteredEvents" :key="index" class="flex justify-between items-center p-2 bg-gray-100 rounded-lg">
          <span>{{ formatEventDatetime(event.datetime) }} - {{ event.description }}</span>
          <button @click="removeEvent(index)" class="text-red-500 hover:text-red-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </li>
      </ul>
    </div>
    <p v-else class="text-gray-600">Chưa có sự kiện nào hôm nay!</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const newEvent = ref({
  datetime: new Date(), // Mặc định là thời điểm hiện tại
  description: '',
});

const events = ref([]);
const isAuthenticated = ref(false);
const googleTokens = ref(null);

// Lấy dữ liệu từ localStorage
onMounted(() => {
  const storedEvents = localStorage.getItem('calendarEvents');
  if (storedEvents) {
    events.value = JSON.parse(storedEvents).map(event => ({
      ...event,
      datetime: new Date(event.datetime), // Chuyển string thành Date object
    }));
  }

  const tokens = localStorage.getItem('googleTokens');
  if (tokens) {
    googleTokens.value = JSON.parse(tokens);
    isAuthenticated.value = true;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code) {
    handleOAuthCallback(code);
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

// Lọc sự kiện hôm nay
const filteredEvents = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return events.value.filter(event => {
    const eventDate = new Date(event.datetime).toISOString().split('T')[0];
    return eventDate === today;
  });
});

// Format datetime để hiển thị
function formatEventDatetime(datetime) {
  const date = new Date(datetime);
  return `${date.toISOString().split('T')[0]} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

// Xác thực Google
async function authenticateGoogle() {
  const { authUrl } = await $fetch('/api/calendar?action=auth');
  window.location.href = authUrl;
}

// Xử lý callback từ Google
async function handleOAuthCallback(code) {
  const { tokens } = await $fetch(`/api/calendar?action=callback&code=${code}`);
  googleTokens.value = tokens;
  localStorage.setItem('googleTokens', JSON.stringify(tokens));
  isAuthenticated.value = true;
  await syncWithGoogleCalendar();
}

// Thêm sự kiện
async function addEvent() {
  if (!newEvent.value.description) {
    alert('Vui lòng nhập mô tả sự kiện!');
    return;
  }

  const formattedDatetime = newEvent.value.datetime.toISOString(); // ISO string: "2025-03-20T14:00:00.000Z"
  const event = {
    datetime: formattedDatetime,
    description: newEvent.value.description,
  };

  events.value.push(event);
  localStorage.setItem('calendarEvents', JSON.stringify(events.value));
  if (isAuthenticated.value) {
    const { googleId } = await $fetch('/api/calendar?action=add', {
      method: 'POST',
      body: { tokens: googleTokens.value, event },
    });
    event.googleId = googleId;
    localStorage.setItem('calendarEvents', JSON.stringify(events.value));
  }
  newEvent.value.description = '';
  newEvent.value.datetime = new Date(); // Reset về hiện tại
}

// Xóa sự kiện
async function removeEvent(index) {
  const event = events.value[index];
  events.value.splice(index, 1);
  localStorage.setItem('calendarEvents', JSON.stringify(events.value));
  if (isAuthenticated.value && event.googleId) {
    await $fetch('/api/calendar?action=delete', {
      method: 'POST',
      body: { tokens: googleTokens.value, googleId: event.googleId },
    });
  }
}

// Đồng bộ với Google Calendar
async function syncWithGoogleCalendar() {
  const googleEvents = await $fetch('/api/calendar?action=sync', {
    method: 'POST',
    body: { tokens: googleTokens.value },
  });

  googleEvents.forEach(ge => {
    if (!events.value.some(e => e.googleId === ge.googleId)) {
      events.value.push({ ...ge, datetime: new Date(ge.datetime) });
    }
  });
  localStorage.setItem('calendarEvents', JSON.stringify(events.value));

  for (const event of events.value) {
    if (!event.googleId) {
      const { googleId } = await $fetch('/api/calendar?action=add', {
        method: 'POST',
        body: { tokens: googleTokens.value, event },
      });
      event.googleId = googleId;
    }
  }
  localStorage.setItem('calendarEvents', JSON.stringify(events.value));
}
</script>

<style scoped>
/* Tùy chỉnh style cho VueDatePicker */
.dp__input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
}
.dp__input:focus {
  border-color: #eab308;
  box-shadow: 0 0 0 2px rgba(234, 179, 8, 0.5);
}
</style>