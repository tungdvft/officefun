<template>
  <div class="container mx-auto p-4 sm:p-6">
    <h1 class="text-3xl sm:text-4xl font-bold text-purple-900 mb-8 text-center">Trắc nghiệm DISC</h1>
    
    <!-- Mô tả -->
    <div v-if="!showQuiz && !store.discCompleted" class="bg-white rounded-xl shadow-lg p-6 mb-8 text-center">
      <p class="text-gray-600 mb-6">
        Khám phá phong cách hành vi của bạn qua 20 câu hỏi, xác định bạn thuộc kiểu Thống trị, Ảnh hưởng, Ổn định hay Tuân thủ.
      </p>
      <button @click="startQuiz"
              class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 animate-pulse-once shadow-md">
        Bắt đầu
      </button>
    </div>

    <!-- Trắc nghiệm -->
    <div v-if="showQuiz" class="mt-8">
      <DISCQuiz />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAssessmentStore } from '~/stores/assessment';
import DISCQuiz from '~/components/DISCQuiz.vue';
import { useHead } from '#app';

useHead({
  title: 'Trắc nghiệm DISC - Thần Số Học',
  meta: [
    {
      name: 'description',
      content: 'Khám phá phong cách hành vi của bạn qua 20 câu hỏi trắc nghiệm DISC, xác định bạn thuộc kiểu Thống trị, Ảnh hưởng, Ổn định hay Tuân thủ.'
    }
  ]
});

const store = useAssessmentStore();
const showQuiz = ref(false);

const startQuiz = () => {
  console.log('Starting quiz'); // Debug
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
