<template>
  <div class="container mx-auto p-4 sm:p-6">
    <h1 class="text-3xl sm:text-4xl font-bold text-purple-900 mb-8 text-center">Trắc nghiệm MBTI</h1>
    
    <!-- Mô tả -->
    <div v-if="!showQuiz && !store.mbtiCompleted" class="bg-white rounded-xl shadow-lg p-6 mb-8 text-center">
      <p class="text-gray-600 mb-6">
        Tìm hiểu loại tính cách của bạn qua 40 câu hỏi, xác định một trong 16 kiểu tính cách như INTJ, ENFP, v.v.
      </p>
      <button @click="startQuiz"
              class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 animate-pulse-once shadow-md">
        Bắt đầu
      </button>
    </div>

    <!-- Trắc nghiệm -->
    <div v-if="showQuiz" class="mt-8">
      <MBTIQuiz />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAssessmentStore } from '~/stores/assessment';
import MBTIQuiz from '~/components/MBTIQuiz.vue';
import { useHead } from '#app';

useHead({
  title: 'Trắc nghiệm MBTI - Thần Số Học',
  meta: [
    {
      name: 'description',
      content: 'Tìm hiểu loại tính cách của bạn qua 40 câu hỏi trắc nghiệm MBTI, xác định một trong 16 kiểu tính cách như INTJ, ENFP, v.v.'
    }
  ]
});

const store = useAssessmentStore();
const showQuiz = ref(false);

const startQuiz = () => {
  console.log('Starting MBTI quiz'); // Debug
  showQuiz.value = true;
};
</script>

<style scoped>
@keyframes pulse-once {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.animate-pulse-once {
  animation: pulse-once 0.5s ease-in-out;
}
@media (max-width: 640px) {
  .text-4xl {
    font-size: 2rem;
  }
  .p-6 {
    padding: 1rem;
  }
}
</style>
