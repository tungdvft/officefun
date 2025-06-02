<template>
  <div class="container mx-auto p-4 sm:p-6">
    <h1 class="text-3xl sm:text-4xl font-bold text-purple-900 mb-8 text-center">Kết quả trắc nghiệm MBTI</h1>
    
    <div v-if="!store.mbtiCompleted" class="bg-white rounded-xl shadow-lg p-6 text-center">
      <p class="text-gray-600 mb-6">Bạn chưa hoàn thành trắc nghiệm MBTI. Vui lòng thực hiện trước!</p>
      <NuxtLink to="/mbti"
                class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 animate-pulse-once shadow-md">
        Làm bài ngay
      </NuxtLink>
    </div>
    
    <div v-else class="space-y-8">
      <!-- Kiểu MBTI chính -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-purple-900 mb-4">Kiểu MBTI của bạn: {{ mbtiType }}</h2>
        <p class="text-gray-700 mb-4">{{ descriptions[mbtiType]?.summary || 'Không xác định.' }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="(score, dim) in dimensions" :key="dim" class="bg-gray-50 p-4 rounded-lg">
            <p class="font-semibold text-gray-800">{{ dim }}: {{ score }}%</p>
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
        <p class="text-gray-700 mb-4">{{ descriptions[mbtiType]?.detail }}</p>
        <p class="text-gray-600"><strong>Điểm mạnh:</strong> {{ descriptions[mbtiType]?.strengths }}</p>
        <p class="text-gray-600"><strong>Điểm yếu:</strong> {{ descriptions[mbtiType]?.weaknesses }}</p>
      </div>
      
      <!-- Gợi ý phát triển -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-purple-900 mb-4">Gợi ý phát triển</h2>
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li v-for="tip in descriptions[mbtiType]?.tips" :key="tip">{{ tip }}</li>
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
  title: 'Kết quả trắc nghiệm MBTI - Thần Số Học',
  meta: [
    { name: 'description', content: 'Xem kết quả trắc nghiệm MBTI của bạn với chi tiết loại tính cách, điểm số, và gợi ý phát triển.' }
  ]
});

const dimensions = computed(() => {
  const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  Object.values(store.mbtiAnswers).forEach(answer => {
    counts[answer]++;
  });
  return {
    'E/I': counts.E ? Math.round((counts.E / (counts.E + counts.I)) * 100) : 0,
    'S/N': counts.S ? Math.round((counts.S / (counts.S + counts.N)) * 100) : 0,
    'T/F': counts.T ? Math.round((counts.T / (counts.T + counts.F)) * 100) : 0,
    'J/P': counts.J ? Math.round((counts.J / (counts.J + counts.P)) * 100) : 0
  };
});

const mbtiType = computed(() => {
  const ei = dimensions.value['E/I'] > 50 ? 'E' : 'I';
  const sn = dimensions.value['S/N'] > 50 ? 'S' : 'N';
  const tf = dimensions.value['T/F'] > 50 ? 'T' : 'F';
  const jp = dimensions.value['J/P'] > 50 ? 'J' : 'P';
  return `${ei}${sn}${tf}${jp}`;
});

const descriptions = {
  INTJ: {
    summary: 'Kiến trúc sư: Sáng tạo, chiến lược, độc lập.',
    detail: 'Bạn là người có tầm nhìn xa, thích lập kế hoạch và giải quyết vấn đề phức tạp. Bạn làm việc tốt một mình và luôn tìm cách cải tiến.',
    strengths: 'Tư duy chiến lược, độc lập, quyết đoán.',
    weaknesses: 'Khó diễn đạt cảm xúc, có thể quá lý thuyết.',
    tips: [
      'Học cách linh hoạt hơn với thay đổi bất ngờ.',
      'Tăng cường giao tiếp để chia sẻ ý tưởng.',
      'Cân bằng giữa lý trí và cảm xúc.'
    ]
  },
  ENFP: {
    summary: 'Nhà truyền cảm hứng: Nhiệt huyết, sáng tạo, hòa đồng.',
    detail: 'Bạn là người tràn đầy năng lượng, thích khám phá ý tưởng mới và kết nối với người khác. Bạn giỏi truyền động lực và sáng tạo.',
    strengths: 'Sáng tạo, đồng cảm, linh hoạt.',
    weaknesses: 'Thiếu tập trung, dễ trì hoãn.',
    tips: [
      'Lập kế hoạch cụ thể để hoàn thành công việc.',
      'Học cách ưu tiên nhiệm vụ quan trọng.',
      'Tập trung vào mục tiêu dài hạn.'
    ]
  },
  // Thêm các kiểu MBTI khác tương tự (16 loại)
};

const resetMbti = () => {
  store.resetMbti();
  router.push('/mbti');
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
