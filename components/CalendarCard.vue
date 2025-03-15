<template>
  <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
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
      <label for="eventDate" class="block text-gray-700 mb-1">Ngày:</label>
      <input type="date" id="eventDate" v-model="newEvent.date" class="w-full p-2 border rounded-lg mb-2" />

      <label for="eventTime" class="block text-gray-700 mb-1">Giờ:</label>
      <input type="time" id="eventTime" v-model="newEvent.time" class="w-full p-2 border rounded-lg mb-2" />

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
          <span>{{ event.date }} {{ event.time }} - {{ event.description }}</span>
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
import { ref, computed, onMounted } from 'vue'
import { google } from 'googleapis'

const CLIENT_ID = 'YOUR_CLIENT_ID' // Thay bằng Client ID từ Google
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET' // Thay bằng Client Secret
const REDIRECT_URI = 'http://localhost:3000/oauth2callback' // Thay nếu khác

// State cho sự kiện mới
const newEvent = ref({
  date: new Date().toISOString().split('T')[0],
  time: '09:00',
  description: ''
})

const events = ref([])
const isAuthenticated = ref(false)
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

// Lấy token từ localStorage
onMounted(() => {
  const storedEvents = localStorage.getItem('calendarEvents')
  if (storedEvents) events.value = JSON.parse(storedEvents)

  const tokens = localStorage.getItem('googleTokens')
  if (tokens) {
    oauth2Client.setCredentials(JSON.parse(tokens))
    isAuthenticated.value = true
  }
})

// Lọc sự kiện hôm nay
const filteredEvents = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return events.value.filter(event => event.date === today)
})

// Xác thực Google
async function authenticateGoogle() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar']
  })
  window.location.href = authUrl // Chuyển hướng để lấy code
}

// Callback xử lý token (tạo route riêng nếu cần)
async function handleOAuthCallback(code) {
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)
  localStorage.setItem('googleTokens', JSON.stringify(tokens))
  isAuthenticated.value = true
  await syncWithGoogleCalendar() // Sync ngay sau khi auth
}

// Thêm sự kiện
async function addEvent() {
  if (!newEvent.value.description) {
    alert('Vui lòng nhập mô tả sự kiện!')
    return
  }
  events.value.push({ ...newEvent.value })
  localStorage.setItem('calendarEvents', JSON.stringify(events.value))
  if (isAuthenticated.value) await pushToGoogleCalendar(newEvent.value)
  newEvent.value.description = ''
}

// Xóa sự kiện
async function removeEvent(index) {
  const event = events.value[index]
  events.value.splice(index, 1)
  localStorage.setItem('calendarEvents', JSON.stringify(events.value))
  if (isAuthenticated.value) await deleteFromGoogleCalendar(event)
}

// Đồng bộ với Google Calendar
async function syncWithGoogleCalendar() {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  // Lấy sự kiện từ Google Calendar
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    singleEvents: true,
    orderBy: 'startTime'
  })

  const googleEvents = res.data.items || []
  googleEvents.forEach(ge => {
    const event = {
      date: ge.start.dateTime.split('T')[0],
      time: ge.start.dateTime.split('T')[1].slice(0, 5),
      description: ge.summary,
      googleId: ge.id // Lưu ID để xóa sau
    }
    if (!events.value.some(e => e.googleId === event.googleId)) {
      events.value.push(event)
    }
  })
  localStorage.setItem('calendarEvents', JSON.stringify(events.value))

  // Push sự kiện local chưa có trên Google
  for (const event of events.value) {
    if (!event.googleId) await pushToGoogleCalendar(event)
  }
}

// Push sự kiện lên Google Calendar
async function pushToGoogleCalendar(event) {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
  const googleEvent = {
    summary: event.description,
    start: { dateTime: `${event.date}T${event.time}:00` },
    end: { dateTime: `${event.date}T${event.time}:00` } // Thêm 1h nếu cần
  }
  const res = await calendar.events.insert({
    calendarId: 'primary',
    resource: googleEvent
  })
  event.googleId = res.data.id // Lưu ID để quản lý
  localStorage.setItem('calendarEvents', JSON.stringify(events.value))
}

// Xóa sự kiện khỏi Google Calendar
async function deleteFromGoogleCalendar(event) {
  if (!event.googleId) return
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
  await calendar.events.delete({
    calendarId: 'primary',
    eventId: event.googleId
  })
}
</script>