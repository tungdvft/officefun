<template>
  <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
    <h2 class="text-xl font-semibold text-green-700 mb-3 flex items-center">
      <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
      Gợi ý nghe nhạc
    </h2>

    <!-- Dropdown chọn vibe -->
    <div class="mb-4">
      <label for="vibe" class="block text-gray-700 mb-2">Chọn vibe:</label>
      <select id="vibe" v-model="selectedVibe" @change="fetchMusic" class="w-full p-2 border rounded-lg">
        <option value="">{{ todayPlaylist }}</option>
        <option value="chill">Chill Vibes</option>
        <option value="party">Party Mode</option>
        <option value="focus">Focus Flow</option>
        <option value="energetic">Energetic Boost</option>
        <option value="romantic">Romantic Mood</option>
        <option value="relax">Relax & Unwind</option>
        <option value="happy">Happy Tunes</option>
      </select>
    </div>

    <!-- Hiển thị playlist -->
    <p class="text-gray-800 font-semibold">{{ musicData.title }}</p>
    <p class="text-gray-600 leading-relaxed">{{ musicData.description }}</p>
    <a :href="musicData.url" target="_blank" class="text-blue-500 hover:underline mt-2 inline-block">Mở trên Spotify</a>

    <!-- Embed Spotify để play ngay -->
    <iframe
      v-if="musicData.url && musicData.url.includes('/playlist/')"
      :src="`https://open.spotify.com/embed/playlist/${musicData.url.split('/playlist/')[1]}?utm_source=generator&autoplay=1`"
      width="100%"
      height="152"
      frameborder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      class="mt-4"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineProps({
  musicData: { type: Object, required: true }
})

const selectedVibe = ref('')
const emit = defineEmits(['refresh-music'])

// Tính toán title theo ngày hiện tại
const today = new Date().getDay()
const dayTitles = {
  1: 'Monday Motivation',
  2: 'Tuesday Energy',
  3: 'Midweek Vibes',
  4: 'Focus Thursday',
  5: 'Friday Chill',
  6: 'Saturday Party',
  0: 'Sunday Relaxation'
}
const todayPlaylist = computed(() => dayTitles[today])

function fetchMusic() {
  emit('refresh-music', selectedVibe.value)
}
</script>