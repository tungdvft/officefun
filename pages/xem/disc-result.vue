<template>
  <div class="container mx-auto p-4 sm:p-6">
    <h1 class="text-3xl sm:text-4xl font-bold text-purple-900 mb-8 text-center">Kết quả trắc nghiệm DISC</h1>
    
    <div v-if="!store.discCompleted" class="bg-white rounded-xl shadow-lg p-6 text-center">
      <p class="text-gray-600 mb-6">Bạn chưa hoàn thành trắc nghiệm DISC. Vui lòng thực hiện trước!</p>
      <NuxtLink to="/disc"
                class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 animate-pulse-once shadow-md">
        Làm bài ngay
      </NuxtLink>
    </div>
    
    <div v-else class="space-y-8">
      <!-- Kiểu DISC chính -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-purple-900 mb-4">Kiểu DISC của bạn: {{ primaryType }}</h2>
        <p class="text-gray-700 mb-4">{{ descriptions[primaryType]?.summary || 'Không xác định.' }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="(score, type) in scores" :key="type" class="bg-gray-50 p-4 rounded-lg">
            <p class="font-semibold text-gray-800">{{ type }}: {{ score }}%</p>
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
                   :style="{ width: `${score}%` }"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Chi tiết đặc điểm -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-purple-900 mb-4">Đặc điểm chi tiết</h2>
        <div v-for="(desc, type) in descriptions" :key="type" class="mb-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ type }}</h3>
          <p class="text-gray-700">{{ desc.detail }}</p>
          <p class="text-gray-600 mt-2"><strong>Điểm mạnh:</strong> {{ desc.strengths }}</p>
          <p class="text-gray-600"><strong>Điểm yếu:</strong> {{ desc.weaknesses }}</p>
        </div>
      </div>
      
      <!-- Gợi ý phát triển -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-purple-900 mb-4">Gợi ý phát triển</h2>
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li v-for="tip in developmentTips[primaryType]" :key="tip">{{ tip }}</li>
        </ul>
      </div>
      
      <!-- Button reset -->
      <div class="text-center">
        <button @click="resetQuiz"
                class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 animate-pulse-once shadow-md">
          Làm lại bài trắc nghiệm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAssessmentStore } from '~/stores/assessment';
import { useRouter } from 'vue-router';
import { useHead } from '#app';

const store = useAssessmentStore();
const router = useRouter();

useHead({
  title: 'Kết quả trắc nghiệm DISC - Thần Số Học',
  meta: [
    { name: 'description', content: 'Xem kết quả trắc nghiệm DISC của bạn với chi tiết điểm số, đặc điểm tính cách, và gợi ý phát triển.' }
  ]
});

const scores = computed(() => {
  const counts = { D: 0, I: 0, S: 0, C: 0 };
  Object.values(store.discAnswers).forEach(answer => {
    counts[answer]++;
  });
  const total = Object.values(counts).reduce((sum, val) => sum + val, 0);
  return {
    D: total ? Math.round((counts.D / total) * 100) : 0,
    I: total ? Math.round((counts.I / total) * 100) : 0,
    S: total ? Math.round((counts.S / total) * 100) : 0,
    C: total ? Math.round((counts.C / total) * 100) : 0
  };
});

const primaryType = computed(() => {
  return Object.entries(scores.value).reduce((max, [type, score]) => score > max.score ? { type, score } : max, { type: 'D', score: 0 }).type;
});

const descriptions = {
  D: {
    summary: 'Thống trị: Quyết đoán, mạnh mẽ, tập trung vào kết quả.',
    detail: 'Bạn là người quyết đoán, thích kiểm soát và đạt được mục tiêu nhanh chóng. Bạn thường dẫn dắt nhóm và không ngại thử thách.',
    strengths: 'Lãnh đạo, tự tin, định hướng mục tiêu.',
    weaknesses: 'Thiếu kiên nhẫn, có thể áp đảo người khác.'
  },
  I: {
    summary: 'Ảnh hưởng: Năng động, thân thiện, truyền cảm hứng.',
    detail: 'Bạn là người hòa đồng, thích giao tiếp và tạo động lực cho người khác. Bạn giỏi xây dựng mối quan hệ và thuyết phục.',
    strengths: 'Giao tiếp tốt, sáng tạo, nhiệt huyết.',
    weaknesses: 'Thiếu tập trung, dễ bị phân tâm.'
  },
  S: {
    summary: 'Ổn định: Kiên nhẫn, đáng tin cậy, hợp tác.',
    detail: 'Bạn là người bình tĩnh, thích sự ổn định và hỗ trợ đồng đội. Bạn giỏi lắng nghe và duy trì hòa bình.',
    strengths: 'Đồng cảm, đáng tin, trung thành.',
    weaknesses: 'Khó thích nghi với thay đổi, thiếu quyết đoán.'
  },
  C: {
    summary: 'Tuân thủ: Cẩn thận, phân tích, chú trọng chi tiết.',
    detail: 'Bạn là người tỉ mỉ, thích làm việc theo quy trình và đảm bảo chất lượng. Bạn giỏi phân tích và giải quyết vấn đề.',
    strengths: 'Chính xác, logic, có tổ chức.',
    weaknesses: 'Quá cầu toàn, khó linh hoạt.'
  }
};

const developmentTips = {
  D: [
    'Học cách lắng nghe và kiên nhẫn hơn với người khác.',
    'Tập trung vào xây dựng mối quan hệ lâu dài.',
    'Thử chia sẻ trách nhiệm để giảm áp lực.'
  ],
  I: [
    'Lập kế hoạch cụ thể để cải thiện tập trung.',
    'Học cách quản lý thời gian hiệu quả hơn.',
    'Cân nhắc ý kiến từ người khác trước khi quyết định.'
  ],
  S: [
    'Thử bước ra khỏi vùng an toàn để đón nhận thay đổi.',
    'Phát triển kỹ năng ra quyết định độc lập.',
    'Tự tin thể hiện ý kiến cá nhân trong nhóm.'
  ],
  C: [
    'Học cách linh hoạt hơn với các tình huống bất ngờ.',
    'Giảm bớt xu hướng cầu toàn để tăng hiệu suất.',
    'Tăng cường giao tiếp để chia sẻ ý tưởng.'
  ]
};

const resetQuiz = () => {
  store.resetDisc();
  router.push('/disc');
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
</style>
