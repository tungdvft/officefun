<template>
  <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-cyan-500">
    <h2 class="text-xl font-semibold text-cyan-700 mb-3 flex items-center">
      <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      Gợi ý homestay
    </h2>
    <div class="mb-4">
      <label for="location" class="block text-gray-700 mb-2">Chọn địa điểm:</label>
      <select id="location" v-model="selectedLocation" @change="fetchHomestays" class="w-full p-2 border rounded-lg">
        <option value="Moc Chau">Mộc Châu</option>
        <option value="Da Lat">Đà Lạt</option>
        <option value="Sa Pa">Sa Pa</option>
      </select>
    </div>
    <div v-if="homestayData.homestaySuggestion.length">
      <div v-for="(homestay, index) in homestayData.homestaySuggestion" :key="index" class="mb-4">
        <p class="text-gray-800 font-semibold">{{ homestay.name }}</p>
        <p class="text-gray-600">Đánh giá: {{ homestay.rating }}/5 ({{ homestay.reviews }} lượt)</p>
        <p class="text-gray-600">Tiện ích: {{ homestay.amenities.join(', ') }}</p>
        <p class="text-gray-600">Giá: {{ homestay.priceRange }}</p>
      </div>
    </div>
    <p v-else class="text-gray-600 leading-relaxed">{{ homestayData.homestaySuggestion }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  homestayData: { type: Object, required: true }
})

const selectedLocation = ref('Moc Chau')
const emit = defineEmits(['refresh-homestay'])

function fetchHomestays() {
  emit('refresh-homestay', selectedLocation.value)
}
</script>