<template>
  <div class="container mx-auto p-4 sm:p-6 ">
    <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
      <h1 class="text-3xl sm:text-4xl font-bold text-purple-900 mb-6 text-center">Trắc nghiệm Tính cách MBTI</h1>
      
      <!-- Mô tả chi tiết -->
      <div v-if="!showQuiz && !store.mbtiCompleted">
        <div class="prose max-w-none text-gray-700">
          <h2 class="text-2xl font-semibold text-purple-800 mb-4">Khám phá tính cách của bạn với MBTI</h2>
          
          <p class="mb-4">
            <strong>MBTI (Myers-Briggs Type Indicator)</strong> là một phương pháp đánh giá tính cách phổ biến nhất thế giới, 
            giúp phân loại tính cách con người thành 16 nhóm khác nhau dựa trên 4 tiêu chí cơ bản.
          </p>
          
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-purple-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 class="font-bold text-purple-700 mb-2">4 Thang đo chính của MBTI:</h3>
              <ul class="list-disc pl-5 space-y-1">
                <li><strong>Hướng ngoại (E) - Hướng nội (I)</strong>: Cách bạn tương tác với thế giới</li>
                <li><strong>Giác quan (S) - Trực giác (N)</strong>: Cách bạn tiếp nhận thông tin</li>
                <li><strong>Lý trí (T) - Cảm xúc (F)</strong>: Cách bạn đưa ra quyết định</li>
                <li><strong>Nguyên tắc (J) - Linh hoạt (P)</strong>: Cách bạn tổ chức cuộc sống</li>
              </ul>
            </div>
            
            <div class="bg-pink-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 class="font-bold text-pink-700 mb-2">Lợi ích khi biết MBTI:</h3>
              <ul class="list-disc pl-5 space-y-1">
                <li>Hiểu rõ điểm mạnh, điểm yếu của bản thân</li>
                <li>Cải thiện các mối quan hệ cá nhân và công việc</li>
                <li>Định hướng nghề nghiệp phù hợp với tính cách</li>
                <li>Phát triển bản thân hiệu quả hơn</li>
                <li>Giao tiếp hiệu quả với người khác</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-6">
            <h3 class="font-bold text-blue-700 mb-2">Bài trắc nghiệm này bao gồm:</h3>
            <p>40 câu hỏi được thiết kế khoa học để đánh giá chính xác tính cách của bạn. 
            Mỗi câu hỏi có 2 lựa chọn, hãy chọn phương án phản ánh đúng nhất con người thật của bạn.</p>

          </div>
        </div>
        
        <div class="text-center mt-8">
          <button @click="startQuiz"
                  class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg transform hover:-translate-y-1">
            Bắt đầu Trắc nghiệm Ngay
          </button>
        
        </div>
      </div>

      <!-- Trắc nghiệm -->
      <div v-if="showQuiz" class="mt-6">
        <MBTIQuiz />
      </div>
      
      <!-- Thông tin thêm sau khi hoàn thành -->
      <div v-if="store.mbtiCompleted" class="mt-8">
        <h2 class="text-2xl font-bold text-purple-800 mb-4">Tìm hiểu thêm về MBTI</h2>
        <div class="prose max-w-none text-gray-700">
          <p>
            MBTI được phát triển bởi Isabel Briggs Myers và Katharine Cook Briggs dựa trên lý thuyết của Carl Jung. 
            Mỗi loại tính cách MBTI đều có những đặc điểm, điểm mạnh và điểm yếu riêng biệt.
          </p>
          
          <h3 class="text-xl font-semibold mt-4 text-purple-700">16 Nhóm tính cách MBTI:</h3>
          <div class="grid sm:grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <div v-for="type in mbtiTypes" :key="type" 
                 class="bg-gray-50 p-3 rounded-lg text-center text-sm shadow-sm hover:shadow-md transition-shadow duration-300">
              {{ type }}
            </div>
          </div>
          
          <p class="mt-4">
            Kết quả MBTI không phải để đánh giá tốt/xấu mà giúp bạn hiểu bản thân hơn. 
            Mỗi loại tính cách đều có giá trị riêng và phù hợp với những môi trường, công việc khác nhau.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAssessmentStore } from '~/stores/assessment';
import MBTIQuiz from '~/components/MBTIQuiz.vue';
import { useHead } from '#app';

useHead({
  title: 'Trắc nghiệm MBTI - Khám phá tính cách của bạn',
  meta: [
    {
      name: 'description',
      content: 'Bài trắc nghiệm MBTI chính xác với 40 câu hỏi giúp bạn khám phá 1 trong 16 loại tính cách. Hiểu rõ bản thân, phát triển sự nghiệp và cải thiện các mối quan hệ.'
    }
  ]
});

const store = useAssessmentStore();
const showQuiz = ref(false);

const mbtiTypes = ref([
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
]);

const startQuiz = () => {
  console.log('Starting MBTI quiz');
  store.resetMbti();
  showQuiz.value = true;
};

onMounted(() => {
  console.log('Mounted mbti.vue, resetting MBTI state');
  store.resetMbti();
  showQuiz.value = false;
});
</script>

<style scoped>
.container {
  min-height: calc(100vh - 120px);
}

.prose h2, .prose h3 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.prose ul {
  margin-bottom: 1rem;
}

.bg-purple-50 {
  background-color: #f5f3ff;
}

.bg-pink-50 {
  background-color: #fdf2f8;
}

.bg-blue-50 {
  background-color: #eff6ff;
}

/* Tùy chỉnh shadow */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

@media (max-width: 640px) {
  .text-4xl {
    font-size: 2rem;
  }
  .p-6, .p-8 {
    padding: 1.5rem;
  }
}
</style>