<template>
  <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
   
    <div v-if="!discData" class="text-red-600 text-center">
      Không thể tải câu hỏi. Vui lòng thử lại.
    </div>
    <div v-else-if="errorMessage" class="text-red-600 text-center mb-4">
      {{ errorMessage }}
    </div>
    <div v-else-if="!isCompleted" class="space-y-6">
      <div class="flex justify-between items-center">
        <p class="text-sm text-gray-600">Câu {{ currentQuestionIndex + 1 }} / {{ questions.length }}</p>
        <div class="w-2/3 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
               :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"></div>
        </div>
      </div>
      <div v-if="questions[currentQuestionIndex]" class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          {{ questions[currentQuestionIndex].text }}
        </h3>
        <div class="space-y-3">
          <label v-for="(option, index) in questions[currentQuestionIndex].options"
                 :key="index"
                 class="flex items-center p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 transition"
                 :class="{ 'ring-2 ring-purple-600': answers[currentQuestionIndex] === option.type }">
            <input type="radio"
                   :name="`question-${currentQuestionIndex}`"
                   :value="option.type"
                   v-model="answers[currentQuestionIndex]"
                   class="form-radio text-purple-600 h-5 w-5 mr-3"
                   @change="store.setDiscAnswer(currentQuestionIndex, option.type)">
            <span class="text-gray-700">{{ option.text }}</span>
          </label>
        </div>
      </div>
      <div class="flex justify-between">
        <button @click="prevQuestion"
                :disabled="currentQuestionIndex === 0"
                class="inline-block bg-gray-300 text-gray-700 py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 shadow-md disabled:opacity-50">
          Quay lại
        </button>
        <button @click="nextQuestion"
                :disabled="!answers[currentQuestionIndex]"
                class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 animate-pulse-once shadow-md disabled:opacity-50">
          {{ currentQuestionIndex === questions.length - 1 ? 'Hoàn thành' : 'Tiếp theo' }}
        </button>
      </div>
    </div>
    <div v-else class="text-center">
      <p class="text-lg text-gray-700 mb-4">Bạn đã hoàn thành trắc nghiệm DISC!</p>
     
      <button @click="handleComplete"
              class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 animate-pulse-once shadow-md">
        Xem kết quả
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAssessmentStore } from '~/stores/assessment';
import { useRouter } from 'vue-router';
import discData from '~/data/disc.json';

const store = useAssessmentStore();
const router = useRouter();
const questions = ref(discData?.questions || []);
const currentQuestionIndex = ref(0);
const answers = ref(store.discAnswers);
const isCompleted = ref(false);
const errorMessage = ref('');

console.log('Initial state:', { isCompleted: isCompleted.value, storeCompleted: store.discCompleted }); // Debug

const nextQuestion = () => {
  if (!answers.value[currentQuestionIndex.value]) return;
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  } else {
    console.log('Completing DISC quiz'); // Seen
    store.completeDisc();
    isCompleted.value = true;
    console.log('After complete:', { isCompleted: isCompleted.value, storeCompleted: store.discCompleted }); // Debug
  }
};

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

const handleComplete = async () => {
  console.log('handleComplete called, redirecting to /xem/disc-result'); // Debug
  console.log('Answers:', store.discAnswers); // Debug
  if (Object.keys(store.discAnswers).length < 20) {
    errorMessage.value = 'Vui lòng trả lời đủ 20 câu hỏi.';
    console.warn('Not enough answers:', Object.keys(store.discAnswers).length);
    return;
  }
  store.completeDisc();
  try {
    await router.push('/xem/disc-result');
  } catch (error) {
    console.error('Navigation error:', error);
    errorMessage.value = 'Không thể chuyển đến trang kết quả. Vui lòng thử lại.';
  }
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
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
