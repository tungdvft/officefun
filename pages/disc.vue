<template>
  <div class="container mx-auto p-4 sm:p-6">
    <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
      <h1 class="text-3xl sm:text-4xl font-bold text-purple-900 mb-6 text-center">Trắc nghiệm Phong cách Hành vi DISC</h1>
      
      <!-- Mô tả chi tiết -->
      <div v-if="!showQuiz && !store.discCompleted">
        <div class="prose max-w-none text-gray-700">
          <h2 class="text-2xl font-semibold text-purple-800 mb-4">Khám phá phong cách hành vi của bạn với DISC</h2>
          
          <p class="mb-4">
            <strong>DISC</strong> là mô hình đánh giá hành vi được sử dụng rộng rãi trong phát triển cá nhân và nghề nghiệp, 
            giúp xác định 4 xu hướng hành vi chính: Thống trị (D), Ảnh hưởng (I), Kiên định (S) và Tuân thủ (C).
          </p>
          
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-red-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 class="font-bold text-red-700 mb-2">Thống trị (Dominance - D)</h3>
              <ul class="list-disc pl-5 space-y-1">
                <li>Tập trung vào kết quả và mục tiêu</li>
                <li>Mạnh mẽ, quyết đoán, thẳng thắn</li>
                <li>Thích thử thách và cạnh tranh</li>
                <li>Khả năng ra quyết định nhanh</li>
              </ul>
            </div>
            
            <div class="bg-yellow-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 class="font-bold text-yellow-700 mb-2">Ảnh hưởng (Influence - I)</h3>
              <ul class="list-disc pl-5 space-y-1">
                <li>Hướng ngoại và nhiệt tình</li>
                <li>Giỏi giao tiếp và thuyết phục</li>
                <li>Lạc quan, sáng tạo</li>
                <li>Thích làm việc nhóm</li>
              </ul>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 class="font-bold text-green-700 mb-2">Kiên định (Steadiness - S)</h3>
              <ul class="list-disc pl-5 space-y-1">
                <li>Điềm tĩnh, kiên nhẫn</li>
                <li>Trung thành, đáng tin cậy</li>
                <li>Thích sự ổn định và hòa hợp</li>
                <li>Lắng nghe và hỗ trợ người khác</li>
              </ul>
            </div>
            
            <div class="bg-blue-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 class="font-bold text-blue-700 mb-2">Tuân thủ (Compliance - C)</h3>
              <ul class="list-disc pl-5 space-y-1">
                <li>Chính xác, tỉ mỉ</li>
                <li>Phân tích logic, hệ thống</li>
                <li>Tuân thủ quy trình, tiêu chuẩn</li>
                <li>Thận trọng trong ra quyết định</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-6">
            <h3 class="font-bold text-purple-700 mb-2">Bài trắc nghiệm này bao gồm:</h3>
            <p>20 câu hỏi được thiết kế để đánh giá chính xác phong cách hành vi của bạn. 
            Mỗi câu hỏi có 4 lựa chọn, hãy chọn phương án mô tả đúng nhất hành vi thông thường của bạn.</p>
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
        <DISCQuiz />
      </div>
      
      <!-- Thông tin thêm sau khi hoàn thành -->
      <div v-if="store.discCompleted" class="mt-8">
        <h2 class="text-2xl font-bold text-purple-800 mb-4">Ứng dụng DISC trong cuộc sống</h2>
        <div class="prose max-w-none text-gray-700">
          <p>
            DISC được phát triển bởi nhà tâm lý học William Moulton Marston, là công cụ mạnh mẽ để:
          </p>
          
          <div class="grid md:grid-cols-2 gap-4 mt-4">
            <div class="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 class="font-semibold text-purple-700 mb-2">Trong công việc</h3>
              <ul class="list-disc pl-5 space-y-1">
                <li>Cải thiện giao tiếp với đồng nghiệp</li>
                <li>Phát triển phong cách lãnh đạo</li>
                <li>Xây dựng đội nhóm hiệu quả</li>
                <li>Đàm phán và thuyết phục tốt hơn</li>
              </ul>
            </div>
            
            <div class="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 class="font-semibold text-purple-700 mb-2">Trong cuộc sống</h3>
              <ul class="list-disc pl-5 space-y-1">
                <li>Hiểu và cải thiện các mối quan hệ</li>
                <li>Giải quyết xung đột hiệu quả</li>
                <li>Phát triển bản thân toàn diện</li>
                <li>Nhận biết điểm mạnh cần phát huy</li>
              </ul>
            </div>
          </div>
          
          <p class="mt-4">
            Mỗi phong cách DISC đều có giá trị riêng. Không có phong cách nào tốt hơn, chỉ có phong cách phù hợp hơn 
            trong từng tình huống cụ thể.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAssessmentStore } from '~/stores/assessment';
import DISCQuiz from '~/components/DISCQuiz.vue';
import { useHead } from '#app';

useHead({
  title: 'Trắc nghiệm DISC - Khám phá phong cách hành vi',
  meta: [
    {
      name: 'description',
      content: 'Bài trắc nghiệm DISC chính xác giúp bạn xác định phong cách hành vi: Thống trị (D), Ảnh hưởng (I), Kiên định (S) hay Tuân thủ (C). Ứng dụng trong công việc và cuộc sống.'
    }
  ]
});

const store = useAssessmentStore();
const showQuiz = ref(false);

// Reset quiz data when entering the page
onMounted(() => {
  console.log('DISC page mounted, resetting quiz');
  if (process.client) {
    store.loadFromLocalStorage();
    store.resetDisc();
  }
  showQuiz.value = false;
});

const startQuiz = () => {
  console.log('Starting quiz');
  showQuiz.value = true;
};
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

/* Màu nền cho các nhóm DISC */
.bg-red-50 {
  background-color: #fef2f2;
}
.bg-yellow-50 {
  background-color: #fffbeb;
}
.bg-green-50 {
  background-color: #f0fdf4;
}
.bg-blue-50 {
  background-color: #eff6ff;
}
.bg-purple-50 {
  background-color: #f5f3ff;
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