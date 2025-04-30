
<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">

    <!-- Kết quả -->
    <div v-if="result" class="space-y-8">
      <!-- Số Đường Đời -->
      <section>
        <h2 class="text-2xl font-semibold text-indigo-600 mb-4">
          Số Đường Đời: {{ result.number }}
        </h2>
        <p class="text-gray-700 leading-relaxed">{{ result.meaning }}</p>
      </section>

      <!-- Điểm mạnh -->
      <section>
        <h3 class="text-xl font-semibold text-gray-800 mb-3">Điểm mạnh</h3>
        <ul class="list-disc pl-6 space-y-2 text-gray-700">
          <li v-for="(strength, index) in result.strengths" :key="index">
            {{ strength }}
          </li>
        </ul>
      </section>

      <!-- Điểm yếu -->
      <section>
        <h3 class="text-xl font-semibold text-gray-800 mb-3">Điểm yếu</h3>
        <ul class="list-disc pl-6 space-y-2 text-gray-700">
          <li v-for="(weakness, index) in result.weaknesses" :key="index">
            {{ weakness }}
          </li>
        </ul>
      </section>

      <!-- Mối quan hệ tương thích -->
      <section>
        <h3 class="text-xl font-semibold text-gray-800 mb-3">Mối quan hệ tương thích</h3>
        <div class="space-y-4">
          <div>
            <h4 class="text-lg font-medium text-gray-700">Tương thích nhất</h4>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
              <li v-for="(compat, index) in result.compatibility.best" :key="index">
                Số {{ compat.number }}: {{ compat.description }}
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-medium text-gray-700">Ít tương thích</h4>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
              <li v-for="(compat, index) in result.compatibility.least" :key="index">
                Số {{ compat.number }}: {{ compat.description }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Tình duyên -->
      <section>
        <h3 class="text-xl font-semibold text-gray-800 mb-3">Tình duyên</h3>
        <ul class="list-disc pl-6 space-y-2 text-gray-700">
          <li v-for="(romance, index) in result.romance" :key="index">
            {{ romance }}
          </li>
        </ul>
      </section>

      <!-- Nghề nghiệp phù hợp -->
      <section>
        <h3 class="text-xl font-semibold text-gray-800 mb-3">Nghề nghiệp phù hợp</h3>
        <ul class="list-disc pl-6 space-y-2 text-gray-700">
          <li v-for="(career, index) in result.careers" :key="index">
            {{ career }}
          </li>
        </ul>
      </section>

      <!-- Người nổi tiếng -->
      <section v-if="result.famousPeople && result.famousPeople.length">
        <h3 class="text-xl font-semibold text-gray-800 mb-3">Người nổi tiếng</h3>
        <ul class="list-disc pl-6 space-y-2 text-gray-700">
          <li v-for="(person, index) in result.famousPeople" :key="index">
            {{ person }}
          </li>
        </ul>
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
