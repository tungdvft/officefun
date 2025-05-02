<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <!-- Header với ngày sinh -->
    <div v-if="birthDate" class="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
      <h1 class="text-2xl font-bold text-indigo-700">Kết quả thần số học</h1>
      <p class="text-indigo-600 mt-1">Ngày sinh: {{ birthDate }}</p>
    </div>

    <!-- Kết quả -->
    <div v-if="result" class="space-y-10">
      <!-- Số Đường Đời - Highlight -->
      <section class="p-6 bg-indigo-50 rounded-xl border-l-4 border-indigo-500">
        <div class="flex items-start">
          <div class="mr-4 flex-shrink-0">
            <div class="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold">
              {{ result.number }}
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-indigo-700 mb-3">Số Đường Đời: {{ result.number }}</h2>
            <p class="text-gray-700 leading-relaxed">{{ result.meaning }}</p>
          </div>
        </div>
      </section>

      <!-- Grid layout cho các phần thông tin -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Điểm mạnh -->
        <section class="p-5 bg-green-50 rounded-lg">
          <div class="flex items-center mb-3">
            <svg class="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <h3 class="text-xl font-semibold text-green-700">Điểm mạnh</h3>
          </div>
          <ul class="space-y-3 text-gray-700">
            <li v-for="(strength, index) in result.strengths" :key="index" class="flex items-start">
              <span class="text-green-500 mr-2">•</span>
              <span>{{ strength }}</span>
            </li>
          </ul>
        </section>

        <!-- Điểm yếu -->
        <section class="p-5 bg-amber-50 rounded-lg">
          <div class="flex items-center mb-3">
            <svg class="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 class="text-xl font-semibold text-amber-700">Điểm yếu</h3>
          </div>
          <ul class="space-y-3 text-gray-700">
            <li v-for="(weakness, index) in result.weaknesses" :key="index" class="flex items-start">
              <span class="text-amber-500 mr-2">•</span>
              <span>{{ weakness }}</span>
            </li>
          </ul>
        </section>

        <!-- Tình duyên -->
        <section class="p-5 bg-pink-50 rounded-lg">
          <div class="flex items-center mb-3">
            <svg class="h-5 w-5 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 class="text-xl font-semibold text-pink-700">Tình duyên</h3>
          </div>
          <ul class="space-y-3 text-gray-700">
            <li v-for="(romance, index) in result.romance" :key="index" class="flex items-start">
              <span class="text-pink-500 mr-2">•</span>
              <span>{{ romance }}</span>
            </li>
          </ul>
        </section>

        <!-- Nghề nghiệp phù hợp -->
        <section class="p-5 bg-blue-50 rounded-lg">
          <div class="flex items-center mb-3">
            <svg class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 class="text-xl font-semibold text-blue-700">Nghề nghiệp phù hợp</h3>
          </div>
          <ul class="space-y-3 text-gray-700">
            <li v-for="(career, index) in result.careers" :key="index" class="flex items-start">
              <span class="text-blue-500 mr-2">•</span>
              <span>{{ career }}</span>
            </li>
          </ul>
        </section>
      </div>

      <!-- Mối quan hệ tương thích -->
      <section class="p-6 bg-purple-50 rounded-xl">
        <h3 class="text-xl font-semibold text-purple-700 mb-4 flex items-center">
          <svg class="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Mối quan hệ tương thích
        </h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-green-600 mb-2 flex items-center">
              <svg class="h-5 w-5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Tương thích nhất
            </h4>
            <ul class="space-y-3">
              <li v-for="(compat, index) in result.compatibility.best" :key="index" class="text-gray-700">
                <span class="font-medium text-purple-600">Số {{ compat.number }}:</span> {{ compat.description }}
              </li>
            </ul>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-amber-600 mb-2 flex items-center">
              <svg class="h-5 w-5 text-amber-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Ít tương thích
            </h4>
            <ul class="space-y-3">
              <li v-for="(compat, index) in result.compatibility.least" :key="index" class="text-gray-700">
                <span class="font-medium text-purple-600">Số {{ compat.number }}:</span> {{ compat.description }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Người nổi tiếng -->
      <section v-if="result.famousPeople && result.famousPeople.length" class="p-6 bg-amber-50 rounded-xl">
        <h3 class="text-xl font-semibold text-amber-700 mb-4 flex items-center">
          <svg class="h-6 w-6 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Người nổi tiếng
        </h3>
        <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="(person, index) in result.famousPeople" :key="index" class="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <p class="text-gray-700">{{ person }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// Nhận birthDate và result từ component cha
defineProps({
  birthDate: {
    type: String,
    required: true
  },
  result: {
    type: Object,
    default: null
  }
});
</script>