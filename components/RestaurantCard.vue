<template>
  <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
    <h2 class="text-xl font-semibold text-yellow-700 mb-3 flex items-center">
      <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      </svg>
      Gợi ý quán ăn trưa
    </h2>
    <p class="text-gray-600 leading-relaxed">{{ restaurantData.restaurantSuggestion }}</p>
  </div>
</template>

<script setup>
defineProps({
  restaurantData: { type: Object, required: true }
})
</script>