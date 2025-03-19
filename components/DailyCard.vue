<template>
  <div>
     <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
          <h2 class="text-xl font-semibold text-indigo-700 mb-3 flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m-3-3v6m-6 6h12m-3-3v6" />
            </svg>
            Vận mệnh hôm nay (Thần số học)
          </h2>
          <p class="text-gray-600 leading-relaxed">{{ dailyData.dailyNumerology }}</p>
        </div>

        <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
          <h2 class="text-xl font-semibold text-pink-700 mb-3 flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Vận mệnh tuần này (Thần số học)
          </h2>
          <p class="text-gray-600 leading-relaxed">{{ dailyData.weeklyNumerology }}</p>
        </div>
    <!-- Office Tip -->
    <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
      <h2 class="text-xl font-semibold text-blue-700 mb-3 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Mẹo văn phòng
      </h2>
      <p class="text-gray-600 leading-relaxed">{{ dailyData.officeTip }}</p>
    </div>

    <!-- Tarot -->
    <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
      <h2 class="text-xl font-semibold text-purple-700 mb-3 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Quẻ Tarot hôm nay
      </h2>
      <p class="text-gray-600 leading-relaxed">{{ dailyData.tarot }}</p>
    </div>

    <!-- Fun Fact -->
    <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
      <h2 class="text-xl font-semibold text-orange-700 mb-3 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Fact vui
      </h2>
      <p class="text-gray-600 leading-relaxed">{{ dailyData.funFact }}</p>
    </div>

    <!-- Quote -->
    <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-rose-500">
      <h2 class="text-xl font-semibold text-rose-700 mb-3 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Quote động lực
      </h2>
      <p class="text-gray-600 italic leading-relaxed">"{{ dailyData.quote }}"</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  dailyData: { type: Object, required: true }
});
</script>