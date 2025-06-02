
<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header section -->
    <div class="bg-gradient-to-r from-purple-700 to-pink-600 p-6 text-white">
      <h2 class="text-2xl sm:text-3xl font-bold mb-2">Trắc nghiệm tính cách MBTI</h2>
      <p class="opacity-90">Khám phá loại tính cách của bạn qua 40 câu hỏi</p>
    </div>

    <!-- Error states -->
    <div v-if="!mbtiData" class="p-6 text-center">
      <div class="inline-flex items-center justify-center bg-red-100 rounded-full p-4 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-red-600 mb-2">Không thể tải câu hỏi</h3>
      <p class="text-gray-600 mb-4">Vui lòng kiểm tra kết nối mạng và thử lại</p>
      <button @click="retryLoading" class="btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Thử lại
      </button>
    </div>

    <!-- Quiz in progress -->
    <div v-else-if="!isCompleted" class="p-4 sm:p-6 space-y-6">
      <!-- Progress bar with animation -->
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium text-purple-700">Tiến trình</span>
          <span class="text-sm font-medium text-gray-600">{{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
        </div>
        <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
               :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"></div>
        </div>
      </div>

      <!-- Question card with subtle animation -->
      <transition name="fade-slide" mode="out-in">
        <div v-if="questions[currentQuestionIndex]" key="question" class="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100 shadow-sm">
          <div class="flex items-start mb-4">
            <div class="bg-purple-600 text-white rounded-lg p-2 mr-3 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-800 leading-tight">
              {{ questions[currentQuestionIndex].text }}
            </h3>
          </div>

          <!-- Options with better visual feedback -->
          <div class="space-y-3">
            <label v-for="(option, index) in questions[currentQuestionIndex].options"
                   :key="index"
                   class="flex items-center p-4 bg-white rounded-lg cursor-pointer transition-all duration-200 border-2"
                   :class="{
                     'border-purple-500 shadow-md': answers[currentQuestionIndex] === option.type,
                     'border-transparent hover:border-purple-200': answers[currentQuestionIndex] !== option.type
                   }">
              <input type="radio"
                     :name="`question-${currentQuestionIndex}`"
                     :value="option.type"
                     v-model="answers[currentQuestionIndex]"
                     class="form-radio text-purple-600 h-5 w-5 mr-3 focus:ring-purple-500"
                     @change="store.setMbtiAnswer(currentQuestionIndex, option.type)"
                     hidden>
              <div class="flex items-center justify-center w-6 h-6 rounded-full border-2 mr-3 flex-shrink-0"
                   :class="{
                     'border-purple-600 bg-purple-100': answers[currentQuestionIndex] === option.type,
                     'border-gray-300': answers[currentQuestionIndex] !== option.type
                   }">
                <div v-if="answers[currentQuestionIndex] === option.type" class="w-3 h-3 rounded-full bg-purple-600"></div>
              </div>
              <span class="text-gray-700">{{ option.text }}</span>
            </label>
          </div>
        </div>
      </transition>

      <!-- Navigation buttons -->
      <div class="flex justify-between pt-4">
        <button @click="prevQuestion"
                :disabled="currentQuestionIndex === 0"
                class="btn-secondary"
                :class="{ 'opacity-50 cursor-not-allowed': currentQuestionIndex === 0 }">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại
        </button>
        <button @click="nextQuestion"
                :disabled="!answers[currentQuestionIndex]"
                class="btn-primary"
                :class="{ 'opacity-50 cursor-not-allowed': !answers[currentQuestionIndex] }">
          {{ currentQuestionIndex === questions.length - 1 ? 'Hoàn thành' : 'Tiếp theo' }}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Completion screen -->
    <transition name="fade-scale" mode="out-in">
      <div v-if="isCompleted" class="p-6 sm:p-8 text-center">
        <div class="mx-auto w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Chúc mừng!</h3>
        <p class="text-gray-600 mb-6 max-w-md mx-auto">
          Bạn đã hoàn thành trắc nghiệm MBTI. Hãy khám phá kết quả chi tiết về loại tính cách của bạn.
        </p>

        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <button @click="handleComplete" class="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Xem kết quả chi tiết
          </button>
          <button @click="restartQuiz" class="btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Làm lại từ đầu
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAssessmentStore } from '~/stores/assessment';
import { useRouter } from 'vue-router';
import mbtiData from '~/data/mbti.json';

const store = useAssessmentStore();
const router = useRouter();
const questions = ref(mbtiData?.questions || []);
const currentQuestionIndex = ref(0);
const answers = ref(store.mbtiAnswers);
const isCompleted = ref(store.mbtiCompleted);
const errorMessage = ref('');
const isLoading = ref(true);

onMounted(() => {
  console.log('MbtiQuiz mounted, initial state:', { isCompleted: isCompleted.value, storeCompleted: store.mbtiCompleted });
  setTimeout(() => {
    isLoading.value = false;
    if (!questions.value.length) {
      errorMessage.value = 'Không thể tải câu hỏi. Vui lòng thử lại.';
    }
  }, 500);
});

const retryLoading = () => {
  console.log('Retrying to load MBTI questions');
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    questions.value = mbtiData?.questions || [];
    if (!questions.value.length) {
      errorMessage.value = 'Không thể tải câu hỏi. Vui lòng thử lại.';
    }
  }, 800);
};

const nextQuestion = () => {
  if (!answers.value[currentQuestionIndex.value]) return;

  console.log('Next question, current index:', currentQuestionIndex.value);
  setTimeout(() => {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++;
    } else {
      console.log('Completing MBTI quiz');
      store.completeMbti();
      isCompleted.value = true;
      console.log('After complete:', { isCompleted: isCompleted.value, storeCompleted: store.mbtiCompleted });
    }
  }, 150);
};

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    console.log('Previous question, new index:', currentQuestionIndex.value - 1);
    currentQuestionIndex.value--;
  }
};

const restartQuiz = () => {
  console.log('Restarting MBTI quiz');
  store.resetMbti();
  currentQuestionIndex.value = 0;
  answers.value = {};
  isCompleted.value = false;
  errorMessage.value = '';
};

const handleComplete = async () => {
  console.log('handleComplete called, answers:', store.mbtiAnswers);
  if (Object.keys(store.mbtiAnswers).length < questions.value.length) {
    errorMessage.value = `Vui lòng trả lời đủ ${questions.value.length} câu hỏi.`;
    console.warn('Not enough answers:', Object.keys(store.mbtiAnswers).length);
    const firstUnanswered = questions.value.findIndex((_, i) => !answers.value[i]);
    if (firstUnanswered >= 0) {
      currentQuestionIndex.value = firstUnanswered;
      isCompleted.value = false;
    }
    return;
  }

  try {
    console.log('Navigating to /xem/mbti-result');
    await router.push('/xem/mbti-result');
  } catch (error) {
    console.error('Navigation error:', error);
    errorMessage.value = 'Không thể chuyển đến trang kết quả. Vui lòng thử lại.';
  }
};
</script>

<style scoped>
/* Button styles */
.border-2 {
  transition-property: border-color, box-shadow;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
}
.btn-primary {
  @apply inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-full text-base font-medium hover:shadow-lg transition-all duration-300 shadow-md hover:from-purple-700 hover:to-pink-700;
}
.btn-secondary {
  @apply inline-flex items-center justify-center bg-white text-gray-700 py-3 px-6 rounded-full text-base font-medium hover:shadow-lg transition-all duration-300 shadow-sm border border-gray-200 hover:border-purple-300 hover:bg-gray-50;
}

/* Animations */
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
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
