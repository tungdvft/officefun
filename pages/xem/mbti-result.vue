<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8">
    <div class="container mx-auto px-4 sm:px-6 max-w-6xl">
      <!-- Header -->
      <header class="text-center mb-12">
        <h1 class="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
          Kết quả trắc nghiệm MBTI
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Khám phá kiểu tính cách và tiềm năng của bạn thông qua phân tích MBTI
        </p>
      </header>

      <!-- Incomplete Test Notice -->
      <div v-if="!store.mbtiCompleted" class="bg-white rounded-2xl shadow-xl p-8 text-center max-w-2xl mx-auto">
        <div class="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-purple-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Bạn chưa hoàn thành bài trắc nghiệm</h2>
        <p class="text-gray-600 mb-6">Để xem kết quả MBTI chi tiết, vui lòng hoàn thành bài đánh giá trước.</p>
        <NuxtLink to="/mbti"
                  class="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 shadow-md hover:scale-105 transform">
          Bắt đầu ngay
          <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </NuxtLink>
      </div>

      <!-- MBTI Results -->
      <div v-else class="space-y-8">
        <!-- Primary Type Card -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="p-8">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div class="flex items-center mb-4">
                  <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold mr-4">
                    {{ mbtiType }}
                  </span>
                  <h2 class="text-2xl font-bold text-gray-800">{{ mbtiType }} - {{ descriptions[mbtiType]?.title || 'Không xác định' }}</h2>
                </div>
                <p class="text-gray-700 mb-6">{{ descriptions[mbtiType]?.summary || 'Không xác định. Vui lòng làm lại bài trắc nghiệm.' }}</p>
                
                <div class="flex flex-wrap gap-2 mb-6">
                  <span v-for="(strength, idx) in (descriptions[mbtiType]?.strengths?.split(', ').slice(0, 4) || [])" :key="idx"
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {{ strength }}
                  </span>
                </div>
              </div>
              
              <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 min-w-[280px]">
                <h3 class="font-semibold text-gray-800 mb-4 text-center">Tỷ lệ các chiều</h3>
                <div class="space-y-4">
                  <div v-for="(score, dim) in dimensions" :key="dim" class="flex items-center">
                    <span class="w-12 font-medium text-gray-700">{{ dim }}:</span>
                    <div class="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden relative">
                      <div class="h-full bg-purple-500 rounded-full transition-all duration-500"
                           :style="{ width: `${score}%` }"></div>
                    </div>
                    <span class="w-12 text-right font-medium text-gray-700">{{ score }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <p class="text-sm text-gray-600 italic">* Tỷ lệ phần trăm thể hiện mức độ ưu thế của từng chiều trong tính cách của bạn</p>
          </div>
        </div>

        <!-- Chart and Celebrities -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Radar Chart -->
            <div class="bg-white rounded-2xl shadow-xl p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold text-gray-800">Biểu đồ MBTI</h3>
                <div class="flex space-x-2">
                <span v-for="type in ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']" :key="type" class="flex items-center">
                    <span class="w-3 h-3 rounded-full mr-1 bg-purple-500"></span>
                    <span class="text-xs font-medium text-gray-600">{{ type }}</span>
                </span>
                </div>
            </div>
            <ClientOnly>
                <RadarChart :scores="radarScores" :key="scoresKey" />
            </ClientOnly>
            </div>
          
          <!-- Celebrities -->
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <div class="flex items-center mb-6">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold mr-4">
                {{ mbtiType }}
              </div>
              <h3 class="text-xl font-semibold text-gray-800">Những {{ mbtiType }} nổi tiếng</h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-for="person in celebrities[mbtiType] || []" :key="person"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {{ person }}
              </span>
            </div>
          </div>
        </div>

        <!-- Detailed Characteristics -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4">
            <h2 class="text-xl font-bold text-white">Đặc điểm chi tiết</h2>
          </div>
          
          <div class="p-8">
            <div class="flex flex-col md:flex-row gap-8">
              <div class="md:w-1/2">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ mbtiType }} - {{ descriptions[mbtiType]?.title || 'Không xác định' }}</h3>
                <p class="text-gray-700 mb-6">{{ descriptions[mbtiType]?.detail || 'Không có thông tin.' }}</p>
                
                <div class="mb-6">
                  <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Điểm mạnh
                  </h4>
                  <ul class="space-y-2">
                    <li v-for="(strength, idx) in (descriptions[mbtiType]?.strengths?.split(', ') || [])" :key="idx" class="flex items-start">
                      <span class="text-green-500 mr-2">•</span>
                      <span class="text-gray-700">{{ strength }}</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div class="md:w-1/2">
                <div class="mb-6">
                  <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    Điểm yếu
                  </h4>
                  <ul class="space-y-2">
                    <li v-for="(weakness, idx) in (descriptions[mbtiType]?.weaknesses?.split(', ') || [])" :key="idx" class="flex items-start">
                      <span class="text-red-500 mr-2">•</span>
                      <span class="text-gray-700">{{ weakness }}</span>
                    </li>
                  </ul>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-purple-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-purple-800 mb-2">Ứng dụng trong công việc</h4>
                    <p class="text-gray-700 text-sm">{{ descriptions[mbtiType]?.work || 'Không có thông tin.' }}</p>
                  </div>
                  <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-blue-800 mb-2">Ứng dụng trong quan hệ</h4>
                    <p class="text-gray-700 text-sm">{{ descriptions[mbtiType]?.relationships || 'Không có thông tin.' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

     <!-- Career Suggestions -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4">
            <h2 class="text-xl font-bold text-white">Nghề nghiệp phù hợp</h2>
        </div>
        
        <div class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="(career, index) in careers[mbtiType] || []" :key="career.title"
                class="bg-gradient-to-r from-green-50 to-white p-5 rounded-xl border border-green-100 hover:shadow-md transition-shadow"
                :class="{'md:col-span-2': careers[mbtiType]?.length % 2 !== 0 && index === careers[mbtiType]?.length - 1}">
                <h5 class="font-bold text-gray-800 mb-2">{{ career.title }}</h5>
                <p class="text-gray-700 text-sm">{{ career.reason }}</p>
            </div>
            </div>
        </div>
        </div>

        <!-- Development Advice -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4">
            <h2 class="text-xl font-bold text-white">Lời khuyên phát triển</h2>
        </div>
        
        <div class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="(item, index) in advice[mbtiType] || []" :key="item.title"
                class="bg-gradient-to-r from-purple-50 to-white p-5 rounded-xl border border-purple-100 hover:shadow-md transition-shadow"
                :class="{'md:col-span-2': advice[mbtiType]?.length % 2 !== 0 && index === advice[mbtiType]?.length - 1}">
                <h4 class="font-semibold text-gray-800 mb-2">{{ item.title }}</h4>
                <p class="text-gray-700 text-sm">{{ item.description }}</p>
            </div>
            </div>
        </div>
        </div>

        <!-- Compatibility -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4">
            <h2 class="text-xl font-bold text-white">Tương hợp với các loại MBTI</h2>
          </div>
          
          <div class="p-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div v-for="match in compatibility[mbtiType] || []" :key="match.type"
                   class="bg-gray-50 p-5 rounded-xl hover:shadow-md transition-shadow">
                <div class="flex items-center mb-3">
                  <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 bg-purple-500">
                    {{ match.type }}
                  </span>
                  <h4 class="font-semibold text-gray-800">Với {{ match.type }}</h4>
                </div>
                <p class="text-gray-700 text-sm">{{ match.reason }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <button @click="resetQuiz"
                  class="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 shadow-md hover:scale-105 transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Làm lại bài
          </button>
          
          <!-- <button @click="shareResult"
                  class="inline-flex items-center justify-center bg-white text-gray-700 border border-gray-300 py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 shadow-md hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Chia sẻ kết quả
          </button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useAssessmentStore } from '~/stores/assessment';
import { useRouter } from 'vue-router';
import { useHead } from '#app';
import RadarChart from '~/components/RadarChart.vue';

definePageMeta({ layout: 'view' });

const store = useAssessmentStore();
const router = useRouter();
const scoresKey = ref(0);

// Load from localStorage
onMounted(() => {
  store.loadFromLocalStorage();
  console.log('mbti-result mounted, store state:', store.$state);
  scoresKey.value++;
});

// Compute dimensions
const dimensions = computed(() => {
  console.log('MBTI answers:', store.mbtiAnswers);
  const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  Object.values(store.mbtiAnswers).forEach(answer => {
    if (counts[answer] !== undefined) counts[answer]++;
  });
  return {
    'E/I': counts.E + counts.I > 0 ? Math.round((counts.E / (counts.E + counts.I)) * 100) : 50,
    'S/N': counts.S + counts.N > 0 ? Math.round((counts.S / (counts.S + counts.N)) * 100) : 50,
    'T/F': counts.T + counts.F > 0 ? Math.round((counts.T / (counts.T + counts.F)) * 100) : 50,
    'J/P': counts.J + counts.P > 0 ? Math.round((counts.J / (counts.J + counts.P)) * 100) : 50
  };
});

// MBTI type
const mbtiType = computed(() => {
  const ei = dimensions.value['E/I'] > 50 ? 'E' : 'I';
  const sn = dimensions.value['S/N'] > 50 ? 'S' : 'N';
  const tf = dimensions.value['T/F'] > 50 ? 'T' : 'F';
  const jp = dimensions.value['J/P'] > 50 ? 'J' : 'P';
  const type = `${ei}${sn}${tf}${jp}`;
  console.log('Calculated MBTI type:', type);
  return type;
});

// SEO and Schema.org (move after mbtiType)
useHead({
  title: 'Kết quả trắc nghiệm MBTI - Thần Số Học',
  meta: [
    { name: 'description', content: 'Xem kết quả trắc nghiệm MBTI chi tiết với loại tính cách, điểm số, radar chart, nghề nghiệp phù hợp, và lời khuyên phát triển.' }
  ],
  script: [{
    type: 'application/ld+json',
    innerHTML: computed(() => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Kết quả trắc nghiệm MBTI',
      description: 'Xem kết quả trắc nghiệm MBTI chi tiết với loại tính cách, điểm số, radar chart, nghề nghiệp phù hợp, và lời khuyên phát triển.',
   
    }))
  }]
});

// Radar chart scores
const radarScores = computed(() => ({
  E: dimensions.value['E/I'],
  I: 100 - dimensions.value['E/I'],
  S: dimensions.value['S/N'],
  N: 100 - dimensions.value['S/N'],
  T: dimensions.value['T/F'],
  F: 100 - dimensions.value['T/F'],
  J: dimensions.value['J/P'],
  P: 100 - dimensions.value['J/P']
}));

// SVG paths (simple icons for each MBTI type)
const typeIcons = {
  default: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v12', // Default fallback
  INTJ: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v4l3 3', // Bàn cờ chiến lược
  INTP: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4h4v4h-4z', // Biểu tượng tư duy
  ENTJ: 'M4 4h16v2H4zm0 4h12v2H4zm0 4h8v2H4z', // Lãnh đạo
  ENTP: 'M12 2l8 8-8 8-8-8zm0 4v8', // Tranh luận
  INFJ: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v12', // Người bảo vệ
  INFP: 'M12 2l8 8h-6v8h-4v-8H4z', // Ngọn lửa lý tưởng
  ENFJ: 'M4 4h16v4H4zm0 6h12v4H4z', // Truyền cảm hứng
  ENFP: 'M12 2l8 8-8 8-8-8zm0 4l4 4-4 4-4-4z', // Năng lượng
  ISTJ: 'M4 4h16v16H4z', // Hộp trách nhiệm
  ISFJ: 'M12 2a10 10 0 100 20 10 10 0 000-20zm-4 8h8v2H8z', // Chăm sóc
  ESTJ: 'M4 4h16v4H4zm0 6h12v4H4z', // Quản lý
  ESFJ: 'M12 2l8 8-8 8-8-8zm0 4l4 4', // Kết nối
  ISTP: 'M4 4h16v4H4zm0 6h12v4H4z', // Dụng cụ
  ISFP: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4l4 8-8 0z', // Nghệ thuật
  ESTP: 'M12 2l8 8-8 8-8-8zm0 4v8', // Hành động
  ESFP: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4l4 4-4 4z' // Biểu diễn
};

// Type colors (based on NT, NF, SJ, SP groups)
const typeColorClasses = {
  default: { text: 'text-purple-900', border: 'border-purple-200' },
  INTJ: { text: 'text-blue-800', border: 'border-blue-200' },
  INTP: { text: 'text-blue-800', border: 'border-blue-200' },
  ENTJ: { text: 'text-blue-800', border: 'border-blue-200' },
  ENTP: { text: 'text-blue-800', border: 'border-blue-200' },
  INFJ: { text: 'text-pink-800', border: 'border-pink-200' },
  INFP: { text: 'text-pink-800', border: 'border-pink-200' },
  ENFJ: { text: 'text-pink-800', border: 'border-pink-200' },
  ENFP: { text: 'text-pink-800', border: 'border-pink-200' },
  ISTJ: { text: 'text-gray-800', border: 'border-gray-200' },
  ISFJ: { text: 'text-gray-800', border: 'border-gray-200' },
  ESTJ: { text: 'text-gray-800', border: 'border-gray-200' },
  ESFJ: { text: 'text-gray-800', border: 'border-gray-200' },
  ISTP: { text: 'text-orange-800', border: 'border-orange-200' },
  ISFP: { text: 'text-orange-800', border: 'border-orange-200' },
  ESTP: { text: 'text-orange-800', border: 'border-orange-200' },
  ESFP: { text: 'text-orange-800', border: 'border-orange-200' }
};

// Celebrities
const celebrities = {
  INTJ: ['Elon Musk', 'Isaac Newton', 'Hillary Clinton'],
  INTP: ['Albert Einstein', 'Bill Gates', 'Kristen Stewart'],
  ENTJ: ['Steve Jobs', 'Gordon Ramsay', 'Margaret Thatcher'],
  ENTP: ['Leonardo da Vinci', 'Ryan Reynolds', 'Tina Fey'],
  INFJ: ['Nelson Mandela', 'Mother Teresa', 'Lady Gaga'],
  INFP: ['William Shakespeare', 'Johnny Depp', 'Audrey Hepburn'],
  ENFJ: ['Oprah Winfrey', 'Martin Luther King Jr.', 'Jennifer Lawrence'],
  ENFP: ['Robin Williams', 'Ellen DeGeneres', 'Robert Downey Jr.'],
  ISTJ: ['George Washington', 'Queen Elizabeth II', 'Warren Buffett'],
  ISFJ: ['Kate Middleton', 'Rosa Parks', 'Jimmy Carter'],
  ESTJ: ['John D. Rockefeller', 'Michelle Obama', 'Judge Judy'],
  ESFJ: ['Taylor Swift', 'Bill Clinton', 'Jennifer Garner'],
  ISTP: ['Clint Eastwood', 'Tom Cruise', 'Scarlett Johansson'],
  ISFP: ['Marilyn Monroe', 'Bob Dylan', 'Rihanna'],
  ESTP: ['Donald Trump', 'Madonna', 'Eddie Murphy'],
  ESFP: ['Will Smith', 'Miley Cyrus', 'Jamie Foxx']
};

// Descriptions (preloaded)
const descriptions = {
  INTJ: {
    title: 'Kiến trúc sư',
    summary: 'Sáng tạo, chiến lược, độc lập, luôn hướng đến việc xây dựng hệ thống hiệu quả.',
    detail: 'Bạn là người có tầm nhìn xa, thích lập kế hoạch dài hạn và giải quyết các vấn đề phức tạp. INTJ thường được biết đến với khả năng dự đoán và tối ưu hóa.',
    strengths: 'Tư duy chiến lược, độc lập, tự tin, khả năng phân tích xuất sắc',
    weaknesses: 'Khó diễn đạt cảm xúc, quá lý thuyết, dễ bỏ qua chi tiết nhỏ',
    work: 'Phù hợp với chiến lược gia, nhà khoa học, kỹ sư phần mềm, hoặc tư vấn quản lý.',
    relationships: 'Bạn đánh giá cao sự trung thực và trí tuệ trong các mối quan hệ, nhưng cần học cách cởi mở hơn về cảm xúc.'
  },
  INTP: {
    title: 'Nhà tư duy',
    summary: 'Phân tích, tò mò, yêu thích khám phá ý tưởng mới.',
    detail: 'Bạn yêu thích tư duy logic và khám phá các khái niệm trừu tượng. INTP thường đặt câu hỏi "tại sao" và tìm cách hiểu sâu sắc về thế giới.',
    strengths: 'Tư duy sáng tạo, logic, độc lập, khả năng giải quyết vấn đề',
    weaknesses: 'Dễ bị phân tâm, khó hoàn thành dự án, ít chú ý đến cảm xúc',
    work: 'Phù hợp với nghiên cứu, lập trình, triết học, hoặc viết lách.',
    relationships: 'Bạn cần không gian riêng, nên học cách bày tỏ cảm xúc.'
  },
  ENTJ: {
    title: 'Nhà lãnh đạo',
    summary: 'Quyết đoán, định hướng mục tiêu, giỏi tổ chức.',
    detail: 'Bạn là người lãnh đạo bẩm sinh, luôn đặt mục tiêu cao và tổ chức mọi người để đạt được chúng. ENTJ thích kiểm soát và đưa ra quyết định chiến lược.',
    strengths: 'Lãnh đạo mạnh mẽ, tự tin, tư duy chiến lược, hiệu quả',
    weaknesses: 'Có thể thiếu kiên nhẫn, quá tập trung vào mục tiêu, ít chú ý đến cảm xúc',
    work: 'Phù hợp với quản lý, khởi nghiệp, chính trị, hoặc tư vấn chiến lược.',
    relationships: 'Bạn dẫn dắt trong mối quan hệ, nhưng cần chú ý đến nhu cầu cảm xúc của đối phương.'
  },
  ENTP: {
    title: 'Nhà tranh luận',
    summary: 'Sáng tạo, nhanh trí, thích thử thách ý tưởng.',
    detail: 'Bạn là người yêu thích tranh luận và khám phá các góc nhìn mới. ENTP thường đưa ra ý tưởng sáng tạo và không ngại thử nghiệm.',
    strengths: 'Sáng tạo, linh hoạt, giao tiếp tốt, tư duy nhanh',
    weaknesses: 'Dễ bị phân tâm, thiếu kiên nhẫn, đôi khi thiếu cam kết',
    work: 'Phù hợp với khởi nghiệp, marketing, luật sư, hoặc sáng tạo nội dung.',
    relationships: 'Bạn thích sự kích thích trí tuệ, nhưng cần học cách duy trì cam kết.'
  },
  INFJ: {
    title: 'Người bảo vệ',
    summary: 'Lý tưởng, sâu sắc, luôn tìm kiếm ý nghĩa.',
    detail: 'Bạn là người có trực giác mạnh mẽ, luôn tìm cách giúp đỡ người khác và tạo ra thay đổi tích cực. INFJ thường nhạy cảm và sâu sắc.',
    strengths: 'Đồng cảm, sáng tạo, định hướng giá trị, khả năng lắng nghe',
    weaknesses: 'Quá lý tưởng, dễ bị kiệt sức, khó từ chối',
    work: 'Phù hợp với tư vấn tâm lý, giáo dục, viết lách, hoặc hoạt động xã hội.',
    relationships: 'Bạn tìm kiếm sự kết nối sâu sắc, nhưng cần đặt ranh giới để bảo vệ năng lượng.'
  },
  INFP: {
    title: 'Người lý tưởng',
    summary: 'Đồng cảm, sáng tạo, sống theo giá trị.',
    detail: 'Bạn là người sống nội tâm, luôn tìm kiếm ý nghĩa và làm theo trái tim. INFP thường có trí tưởng tượng phong phú và yêu nghệ thuật.',
    strengths: 'Đồng cảm, sáng tạo, trung thực, lý tưởng',
    weaknesses: 'Dễ bị tổn thương, khó đối mặt với thực tế, thiếu quyết đoán',
    work: 'Phù hợp với nghệ thuật, viết lách, hoặc công tác xã hội.',
    relationships: 'Bạn tìm kiếm sự chân thành, nhưng cần học cách đối mặt với xung đột.'
  },
  ENFJ: {
    title: 'Người truyền cảm hứng',
    summary: 'Nhiệt huyết, đồng cảm, giỏi dẫn dắt.',
    detail: 'Bạn là người truyền động lực, luôn khuyến khích người khác đạt được tiềm năng. ENFJ giỏi xây dựng mối quan hệ và dẫn dắt nhóm.',
    strengths: 'Giao tiếp xuất sắc, đồng cảm, lãnh đạo truyền cảm hứng',
    weaknesses: 'Dễ bỏ qua nhu cầu cá nhân, quá lý tưởng, nhạy cảm với phê bình',
    work: 'Phù hợp với giáo dục, tư vấn, quản lý nhân sự, hoặc diễn giả.',
    relationships: 'Bạn là người hỗ trợ tuyệt vời, nhưng cần đặt ranh giới để bảo vệ bản thân.'
  },
  ENFP: {
    title: 'Nhà vận động',
    summary: 'Nhiệt huyết, sáng tạo, hòa đồng.',
    detail: 'Bạn là người tràn đầy năng lượng, luôn tìm kiếm cơ hội mới và kết nối với mọi người. ENFP thích khám phá ý tưởng và truyền cảm hứng.',
    strengths: 'Sáng tạo, đồng cảm, linh hoạt, giao tiếp tốt',
    weaknesses: 'Thiếu tập trung, dễ trì hoãn, khó hoàn thành công việc',
    work: 'Phù hợp với marketing, viết lách, tổ chức sự kiện, hoặc khởi nghiệp.',
    relationships: 'Bạn dễ dàng kết nối, nhưng cần chú ý giữ cam kết lâu dài.'
  },
  ISTJ: {
    title: 'Người trách nhiệm',
    summary: 'Cẩn thận, đáng tin cậy, chú trọng chi tiết.',
    detail: 'Bạn là người có trách nhiệm cao, làm việc theo quy trình và đảm bảo mọi thứ được thực hiện đúng. ISTJ thích sự ổn định và trật tự.',
    strengths: 'Có tổ chức, đáng tin, logic, chú trọng chi tiết',
    weaknesses: 'Khó linh hoạt, không thích thay đổi, đôi khi quá cứng nhắc',
    work: 'Phù hợp với kế toán, quản lý dự án, luật sư, hoặc hành chính.',
    relationships: 'Bạn đáng tin cậy, nhưng cần cởi mở hơn về cảm xúc.'
  },
  ISFJ: {
    title: 'Người chăm sóc',
    summary: 'Kiên nhẫn, đồng cảm, luôn hỗ trợ người khác.',
    detail: 'Bạn là người chu đáo, luôn đặt nhu cầu của người khác lên hàng đầu. ISFJ thích hỗ trợ và duy trì sự hòa hợp.',
    strengths: 'Đồng cảm, đáng tin, chăm chỉ, chú trọng chi tiết',
    weaknesses: 'Khó từ chối, dễ bị lợi dụng, tránh xung đột',
    work: 'Phù hợp với y tế, giáo dục, dịch vụ khách hàng, hoặc hành chính.',
    relationships: 'Bạn là người bạn đồng hành tuyệt vời, nhưng cần bày tỏ nhu cầu cá nhân.'
  },
  ESTJ: {
    title: 'Người quản lý',
    summary: 'Hiệu quả, có tổ chức, định hướng mục tiêu.',
    detail: 'Bạn là người thực tế, thích quản lý và tổ chức công việc. ESTJ giỏi duy trì trật tự và đạt được kết quả.',
    strengths: 'Lãnh đạo mạnh mẽ, có tổ chức, thực tế, đáng tin',
    weaknesses: 'Quá cứng nhắc, ít chú ý đến cảm xúc, áp lực với người khác',
    work: 'Phù hợp với quản lý, tài chính, luật sư, hoặc quân đội.',
    relationships: 'Bạn dẫn dắt trong mối quan hệ, nhưng cần chú ý đến cảm xúc của đối phương.'
  },
  ESFJ: {
    title: 'Người kết nối',
    summary: 'Hòa đồng, đồng cảm, giỏi xây dựng mối quan hệ.',
    detail: 'Bạn là người ấm áp, luôn quan tâm đến mọi người xung quanh. ESFJ thích tổ chức và duy trì sự hòa hợp trong nhóm.',
    strengths: 'Giao tiếp tốt, đồng cảm, có tổ chức, trung thành',
    weaknesses: 'Dễ bị ảnh hưởng bởi ý kiến người khác, tránh xung đột',
    work: 'Phù hợp với giáo dục, y tế, quan hệ công chúng, hoặc tổ chức sự kiện.',
    relationships: 'Bạn là người hỗ trợ tuyệt vời, nhưng cần học cách đặt ranh giới.'
  },
  ISTP: {
    title: 'Người thợ thủ công',
    summary: 'Thực tế, linh hoạt, giỏi giải quyết vấn đề.',
    detail: 'Bạn là người thực tế, thích làm việc với tay nghề và giải quyết vấn đề tức thời. ISTP thường độc lập và thích tự do.',
    strengths: 'Linh hoạt, logic, thực tế, khả năng ứng biến',
    weaknesses: 'Khó cam kết, ít bày tỏ cảm xúc, dễ bị phân tâm',
    work: 'Phù hợp với kỹ sư, cơ khí, phi công, hoặc thể thao.',
    relationships: 'Bạn cần không gian riêng, nhưng nên học cách chia sẻ cảm xúc.'
  },
  ISFP: {
    title: 'Nghệ sĩ',
    summary: 'Nhạy cảm, sáng tạo, sống theo cảm xúc.',
    detail: 'Bạn là người yêu cái đẹp, sống theo giá trị cá nhân và thích sáng tạo. ISFP thường nhẹ nhàng và nhạy cảm.',
    strengths: 'Sáng tạo, đồng cảm, linh hoạt, trung thực',
    weaknesses: 'Dễ bị tổn thương, tránh xung đột, khó lập kế hoạch dài hạn',
    work: 'Phù hợp với nghệ thuật, thiết kế, giáo dục, hoặc công tác xã hội.',
    relationships: 'Bạn tìm kiếm sự chân thành, nhưng cần đối mặt với xung đột.'
  },
  ESTP: {
    title: 'Người hành động',
    summary: 'Năng động, thực tế, thích mạo hiểm.',
    detail: 'Bạn là người sống cho hiện tại, thích hành động nhanh và giải quyết vấn đề tức thời. ESTP thường năng động và lôi cuốn.',
    strengths: 'Linh hoạt, giao tiếp tốt, ứng biến nhanh, thực tế',
    weaknesses: 'Thiếu kiên nhẫn, dễ mạo hiểm, khó lập kế hoạch dài hạn',
    work: 'Phù hợp với kinh doanh, thể thao, cứu hỏa, hoặc giải trí.',
    relationships: 'Bạn thích sự kích thích, nhưng cần học cách duy trì cam kết.'
  },
  ESFP: {
    title: 'Người biểu diễn',
    summary: 'Hòa đồng, vui vẻ, sống cho hiện tại.',
    detail: 'Bạn là trung tâm của mọi bữa tiệc, luôn mang lại niềm vui và năng lượng. ESFP thích trải nghiệm mới và kết nối với mọi người.',
    strengths: 'Giao tiếp tốt, đồng cảm, linh hoạt, nhiệt huyết',
    weaknesses: 'Dễ bị phân tâm, thiếu kế hoạch, nhạy cảm với phê bình',
    work: 'Phù hợp với giải trí, du lịch, tổ chức sự kiện, hoặc dịch vụ khách hàng.',
    relationships: 'Bạn dễ dàng kết nối, nhưng cần chú ý đến cam kết lâu dài.'
  }
};

// Careers
const careers = {
  INTJ: [
    { title: 'Chiến lược gia doanh nghiệp', reason: 'Lập kế hoạch dài hạn và tối ưu hóa quy trình.' },
    { title: 'Kỹ sư phần mềm', reason: 'Giải quyết vấn đề phức tạp với logic và sáng tạo.' },
    { title: 'Nhà khoa học', reason: 'Phân tích và khám phá các lĩnh vực mới.' },
    { title: 'Tư vấn quản lý', reason: 'Đưa ra giải pháp cải thiện hiệu quả tổ chức.' },
    { title: 'Kiến trúc sư', reason: 'Thiết kế hệ thống với tầm nhìn xa.' },
    { title: 'Nhà phân tích tài chính', reason: 'Dự đoán xu hướng và tối ưu hóa đầu tư.' },
    { title: 'Nhà nghiên cứu AI', reason: 'Phát triển công nghệ tiên tiến.' },
    { title: 'Giám đốc điều hành', reason: 'Lãnh đạo chiến lược tổ chức.' }
  ],
  INTP: [
    { title: 'Nhà nghiên cứu', reason: 'Khám phá lý thuyết và ý tưởng mới.' },
    { title: 'Lập trình viên', reason: 'Sử dụng logic để xây dựng hệ thống.' },
    { title: 'Triết gia', reason: 'Tìm hiểu bản chất của tri thức.' },
    { title: 'Nhà viết sách', reason: 'Thể hiện ý tưởng qua ngôn ngữ.' },
    { title: 'Phân tích dữ liệu', reason: 'Tìm kiếm xu hướng từ dữ liệu phức tạp.' },
    { title: 'Kỹ sư robot', reason: 'Thiết kế hệ thống tự động.' },
    { title: 'Nhà toán học', reason: 'Giải quyết bài toán trừu tượng.' },
    { title: 'Giảng viên đại học', reason: 'Truyền đạt kiến thức chuyên sâu.' }
  ],
  ENTJ: [
    { title: 'Giám đốc điều hành', reason: 'Lãnh đạo và định hướng tổ chức.' },
    { title: 'Nhà khởi nghiệp', reason: 'Xây dựng doanh nghiệp từ ý tưởng mới.' },
    { title: 'Luật sư', reason: 'Đàm phán và đưa ra chiến lược pháp lý.' },
    { title: 'Tư vấn chiến lược', reason: 'Tối ưu hóa quy trình doanh nghiệp.' },
    { title: 'Quản lý dự án', reason: 'Tổ chức và thực hiện kế hoạch lớn.' },
    { title: 'Chính trị gia', reason: 'Dẫn dắt và ảnh hưởng cộng đồng.' },
    { title: 'Giám đốc marketing', reason: 'Xây dựng chiến dịch quảng bá.' },
    { title: 'Nhà đầu tư', reason: 'Ra quyết định tài chính chiến lược.' }
  ],
  ENTP: [
    { title: 'Nhà sáng tạo nội dung', reason: 'Đưa ra ý tưởng mới và sáng tạo.' },
    { title: 'Luật sư', reason: 'Tranh luận và bảo vệ quan điểm.' },
    { title: 'Nhà khởi nghiệp', reason: 'Thử nghiệm các mô hình kinh doanh mới.' },
    { title: 'Chuyên gia marketing', reason: 'Phát triển chiến dịch sáng tạo.' },
    { title: 'Nhà báo', reason: 'Khám phá và chia sẻ câu chuyện độc đáo.' },
    { title: 'Diễn giả', reason: 'Truyền cảm hứng qua tranh luận.' },
    { title: 'Nhà thiết kế UX', reason: 'Tạo trải nghiệm người dùng sáng tạo.' },
    { title: 'Nhà sản xuất phim', reason: 'Kể chuyện qua hình ảnh.' }
  ],
  INFJ: [
    { title: 'Tư vấn tâm lý', reason: 'Hỗ trợ người khác giải quyết vấn đề cảm xúc.' },
    { title: 'Giáo viên', reason: 'Truyền cảm hứng và giáo dục thế hệ trẻ.' },
    { title: 'Nhà văn', reason: 'Thể hiện ý nghĩa sâu sắc qua câu chữ.' },
    { title: 'Nhà hoạt động xã hội', reason: 'Tạo thay đổi tích cực trong cộng đồng.' },
    { title: 'Nhà trị liệu nghệ thuật', reason: 'Sử dụng sáng tạo để chữa lành.' },
    { title: 'Nhà báo điều tra', reason: 'Lên tiếng cho công lý.' },
    { title: 'Quản lý phi lợi nhuận', reason: 'Dẫn dắt tổ chức vì mục tiêu xã hội.' },
    { title: 'Nhà thiết kế bền vững', reason: 'Tạo ra giải pháp thân thiện môi trường.' }
  ],
  INFP: [
    { title: 'Nhà văn', reason: 'Thể hiện trí tưởng tượng qua câu chuyện.' },
    { title: 'Nghệ sĩ', reason: 'Sáng tạo tác phẩm mang ý nghĩa cá nhân.' },
    { title: 'Tư vấn viên', reason: 'Hỗ trợ người khác tìm ý nghĩa cuộc sống.' },
    { title: 'Nhà hoạt động xã hội', reason: 'Đấu tranh cho lý tưởng.' },
    { title: 'Nhà thiết kế nội thất', reason: 'Tạo không gian đẹp và ý nghĩa.' },
    { title: 'Nhạc sĩ', reason: 'Biểu đạt cảm xúc qua âm nhạc.' },
    { title: 'Nhà thơ', reason: 'Viết những tác phẩm sâu sắc.' },
    { title: 'Nhân viên xã hội', reason: 'Giúp đỡ những người cần hỗ trợ.' }
  ],
  ENFJ: [
    { title: 'Diễn giả', reason: 'Truyền cảm hứng và động lực cho đám đông.' },
    { title: 'Giáo viên', reason: 'Dẫn dắt và giáo dục với sự đồng cảm.' },
    { title: 'Quản lý nhân sự', reason: 'Xây dựng văn hóa đội nhóm tích cực.' },
    { title: 'Tư vấn viên', reason: 'Hỗ trợ phát triển cá nhân.' },
    { title: 'Nhà tổ chức sự kiện', reason: 'Tạo trải nghiệm gắn kết cộng đồng.' },
    { title: 'Nhà hoạt động xã hội', reason: 'Đấu tranh cho công bằng.' },
    { title: 'Nhà sản xuất truyền thông', reason: 'Kể chuyện truyền cảm hứng.' },
    { title: 'Huấn luyện viên đời sống', reason: 'Giúp đạt mục tiêu cá nhân.' }
  ],
  ENFP: [
    { title: 'Chuyên gia marketing', reason: 'Tạo chiến dịch sáng tạo và thu hút.' },
    { title: 'Nhà báo', reason: 'Khám phá và chia sẻ câu chuyện mới.' },
    { title: 'Nhà tổ chức sự kiện', reason: 'Mang lại năng lượng cho cộng đồng.' },
    { title: 'Nhà khởi nghiệp', reason: 'Thử nghiệm ý tưởng mới.' },
    { title: 'Diễn viên', reason: 'Biểu đạt cảm xúc qua vai diễn.' },
    { title: 'Nhà thiết kế đồ họa', reason: 'Sáng tạo hình ảnh độc đáo.' },
    { title: 'Huấn luyện viên sáng tạo', reason: 'Khơi dậy tiềm năng sáng tạo.' },
    { title: 'Nhân viên quan hệ công chúng', reason: 'Xây dựng hình ảnh tích cực.' }
  ],
  ISTJ: [
    { title: 'Kế toán', reason: 'Đảm bảo số liệu chính xác và chi tiết.' },
    { title: 'Quản lý dự án', reason: 'Tổ chức và thực hiện kế hoạch hiệu quả.' },
    { title: 'Luật sư', reason: 'Làm việc dựa trên quy định và logic.' },
    { title: 'Nhân viên hành chính', reason: 'Duy trì hệ thống trật tự.' },
    { title: 'Kỹ sư xây dựng', reason: 'Thiết kế và giám sát công trình.' },
    { title: 'Thư ký', reason: 'Hỗ trợ tổ chức và lập lịch.' },
    { title: 'Kiểm toán viên', reason: 'Đánh giá quy trình tài chính.' },
    { title: 'Quản lý kho', reason: 'Đảm bảo vận hành hàng hóa hiệu quả.' }
  ],
  ISFJ: [
    { title: 'Y tá', reason: 'Chăm sóc và hỗ trợ bệnh nhân với sự đồng cảm.' },
    { title: 'Giáo viên mầm non', reason: 'Nuôi dưỡng và giáo dục trẻ nhỏ.' },
    { title: 'Nhân viên dịch vụ khách hàng', reason: 'Giải quyết vấn đề với sự kiên nhẫn.' },
    { title: 'Nhân viên hành chính', reason: 'Hỗ trợ tổ chức hoạt động.' },
    { title: 'Nhân viên xã hội', reason: 'Giúp đỡ cộng đồng khó khăn.' },
    { title: 'Thư viện viên', reason: 'Tạo môi trường học tập yên tĩnh.' },
    { title: 'Nhà trị liệu vật lý', reason: 'Hỗ trợ phục hồi sức khỏe.' },
    { title: 'Quản lý văn phòng', reason: 'Duy trì môi trường làm việc.' }
  ],
  ESTJ: [
    { title: 'Quản lý tài chính', reason: 'Ra quyết định dựa trên hiệu quả.' },
    { title: 'Luật sư', reason: 'Lãnh đạo và bảo vệ trong pháp lý.' },
    { title: 'Sĩ quan cảnh sát', reason: 'Duy trì trật tự và luật pháp.' },
    { title: 'Quản lý dự án', reason: 'Tổ chức và thực thi kế hoạch.' },
    { title: 'Giám đốc điều hành', reason: 'Lãnh đạo tổ chức lớn.' },
    { title: 'Nhà quản lý bán lẻ', reason: 'Tối ưu hóa hoạt động kinh doanh.' },
    { title: 'Kỹ sư sản xuất', reason: 'Quản lý quy trình sản xuất.' },
    { title: 'Quản lý hậu cần', reason: 'Đảm bảo vận hành chuỗi cung ứng.' }
  ],
  ESFJ: [
    { title: 'Giáo viên', reason: 'Dẫn dắt và hỗ trợ học sinh.' },
    { title: 'Nhân viên quan hệ công chúng', reason: 'Xây dựng hình ảnh tích cực.' },
    { title: 'Nhân viên tổ chức sự kiện', reason: 'Tạo sự kiện gắn kết cộng đồng.' },
    { title: 'Y tá', reason: 'Chăm sóc bệnh nhân với sự đồng cảm.' },
    { title: 'Quản lý nhân sự', reason: 'Xây dựng văn hóa làm việc.' },
    { title: 'Nhân viên bán hàng', reason: 'Kết nối với khách hàng.' },
    { title: 'Nhân viên dịch vụ xã hội', reason: 'Hỗ trợ cộng đồng.' },
    { title: 'Nhân viên chăm sóc khách hàng', reason: 'Giải quyết vấn đề thân thiện.' }
  ],
  ISTP: [
    { title: 'Kỹ sư cơ khí', reason: 'Làm việc với công cụ và hệ thống.' },
    { title: 'Phi công', reason: 'Ứng biến nhanh trong tình huống.' },
    { title: 'Vận động viên', reason: 'Tận dụng kỹ năng thể chất.' },
    { title: 'Kỹ thuật viên IT', reason: 'Khắc phục sự cố công nghệ.' },
    { title: 'Thợ điện', reason: 'Sửa chữa hệ thống thực tế.' },
    { title: 'Nhà quay phim', reason: 'Sử dụng thiết bị để kể chuyện.' },
    { title: 'Kỹ sư âm thanh', reason: 'Tối ưu hóa thiết bị âm thanh.' },
    { title: 'Nhân viên cứu hỏa', reason: 'Hành động nhanh trong nguy cấp.' }
  ],
  ISFP: [
    { title: 'Họa sĩ', reason: 'Sáng tạo tác phẩm nghệ thuật.' },
    { title: 'Nhà thiết kế thời trang', reason: 'Thể hiện phong cách cá nhân.' },
    { title: 'Nhạc sĩ', reason: 'Biểu đạt cảm xúc qua âm nhạc.' },
    { title: 'Nhân viên xã hội', reason: 'Hỗ trợ cộng đồng với sự đồng cảm.' },
    { title: 'Nhà làm phim hoạt hình', reason: 'Kể chuyện qua hình ảnh động.' },
    { title: 'Nhà trị liệu nghệ thuật', reason: 'Dùng sáng tạo để chữa lành.' },
    { title: 'Nhiếp ảnh gia', reason: 'Chụp lại khoảnh khắc đẹp.' },
    { title: 'Nhà thiết kế cảnh quan', reason: 'Tạo không gian tự nhiên.' }
  ],
  ESTP: [
    { title: 'Doanh nhân', reason: 'Hành động nhanh và nắm bắt cơ hội.' },
    { title: 'Vận động viên', reason: 'Tận dụng năng lượng và kỹ năng.' },
    { title: 'Nhân viên cứu hỏa', reason: 'Ứng phó nhanh trong tình huống khẩn cấp.' },
    { title: 'Nhân viên bán hàng', reason: 'Thuyết phục và giao tiếp hiệu quả.' },
    { title: 'Nhà sản xuất sự kiện', reason: 'Tạo trải nghiệm năng động.' },
    { title: 'Nhà môi giới bất động sản', reason: 'Đàm phán và ra quyết định nhanh.' },
    { title: 'Diễn viên hành động', reason: 'Thể hiện năng lượng trên màn ảnh.' },
    { title: 'Hướng dẫn viên du lịch', reason: 'Dẫn dắt trải nghiệm mạo hiểm.' }
  ],
  ESFP: [
    { title: 'Diễn viên', reason: 'Tỏa sáng trên sân khấu và màn ảnh.' },
    { title: 'Nhân viên tổ chức sự kiện', reason: 'Tạo không khí vui vẻ và năng động.' },
    { title: 'Hướng dẫn viên du lịch', reason: 'Chia sẻ trải nghiệm với mọi người.' },
    { title: 'Nhân viên dịch vụ khách hàng', reason: 'Kết nối và hỗ trợ thân thiện.' },
    { title: 'Nhà thiết kế nội thất', reason: 'Tạo không gian sống động.' },
    { title: 'Nhân viên bán hàng', reason: 'Thuyết phục với sự nhiệt tình.' },
    { title: 'Ca sĩ', reason: 'Biểu diễn và truyền cảm hứng.' },
    { title: 'Nhân viên quan hệ công chúng', reason: 'Xây dựng hình ảnh tích cực.' }
  ]
};

// Advice
const advice = {
  INTJ: [
    { title: 'Cân bằng lý trí và cảm xúc', description: 'Học cách bày tỏ cảm xúc và kết nối với người khác.' },
    { title: 'Linh hoạt với thay đổi', description: 'Thử chấp nhận các tình huống không theo kế hoạch.' },
    { title: 'Nghề nghiệp phù hợp', description: 'Tìm vai trò như chiến lược gia, nhà khoa học.' },
    { title: 'Quản lý stress', description: 'Thực hành thiền hoặc yoga.' }
  ],
  INTP: [
    { title: 'Hoàn thành dự án', description: 'Sử dụng công cụ như Trello để quản lý.' },
    { title: 'Giao tiếp cảm xúc', description: 'Chia sẻ cảm xúc với người thân.' },
    { title: 'Nghề nghiệp phù hợp', description: 'Khám phá nghiên cứu, lập trình.' },
    { title: 'Tăng cường tập trung', description: 'Sử dụng kỹ thuật Pomodoro.' }
  ],
  ENTJ: [
    { title: 'Lắng nghe người khác', description: 'Lắng nghe ý kiến để cải thiện teamwork.' },
    { title: 'Quản lý cảm xúc', description: 'Kiểm soát cảm xúc khi áp lực cao.' },
    { title: 'Nghề nghiệp phù hợp', description: 'Tìm vai quản lý, khởi nghiệp.' },
    { title: 'Cân bằng công việc', description: 'Dành thời gian cho gia đình.' }
  ],
  ENTP: [
    { title: 'Duy trì cam kết', description: 'Lập kế hoạch dài hạn.' },
    { title: 'Tăng cường tập trung', description: 'Sử dụng danh sách công việc.' },
    { title: 'Nghề nghiệp phù hợp', description: 'Khám phá startup, marketing.' },
    { title: 'Phát triển lắng nghe', description: 'Lắng nghe sâu để hiểu nhu cầu.' }
  ],
  INFJ: [
    { title: 'Đặt ranh giới', description: 'Học nói "không" để bảo vệ năng lượng.' },
    { title: 'Quản lý nội tâm', description: 'Sử dụng nhật ký hoặc thiền.' },
    { title: 'Nghề nghiệp phù hợp', description: 'Tìm vai tư vấn tâm lý, giáo viên.' },
    { title: 'Quản lý stress', description: 'Thực hành yoga.' }
  ],
  INFP: [
    { title: 'Đối mặt với thực tế', description: 'Lập kế hoạch cụ thể để biến ước mơ thành hiện thực.' },
    { title: 'Tăng cường quyết đoán', description: 'Luyện tập bày tỏ ý kiến.' },
    { title: 'Nghề nghiệp phù hợp', description: 'Khám phá nghệ thuật, viết lách.' },
    { title: 'Quản lý cảm xúc', description: 'Sử dụng nhật ký để xử lý cảm xúc.' }
  ],
  ENFJ: [
    { title: 'Bảo vệ năng lượng', description: 'Đặt ranh giới để tránh kiệt sức.' },
    { title: 'Chấp nhận phê bình', description: 'Xem phê bình như cơ hội cải thiện.' },
    { title: 'Nghề nghiệp phù hợp', description: 'Tìm giáo dục, tư vấn.' },
    { title: 'Cân bằng công việc', description: 'Dành thời gian cho sở thích.' }
  ],
  ENFP: [
    { title: 'Hoàn thành nhiệm vụ', description: 'Sử dụng công cụ quản lý thời gian.' },
    { title: 'Duy trì cam kết', description: 'Lập mục tiêu dài hạn.' },
    { title: 'Nghề nghiệp phù hợp', description: 'Khám phá marketing, sự kiện.' },
    { title: 'Quản lý stress', description: 'Thực hành thiền.' }
  ],
  ISTJ: [
    { title: 'Tăng tính linh hoạt', description: 'Thử phương pháp làm việc mới.' },
    { title: 'Cởi mở cảm xúc', description: 'Chia sẻ cảm xúc với người thân.' },
    { title: 'Nghề nghiệp phù hợp', description: 'Tìm kế toán, quản lý dự án.' },
    { title: 'Quản lý stress', description: 'Thực hành đọc sách, đi bộ.' }
  ],
  ISFJ: [
    { title: 'Bày tỏ nhu cầu', description: 'Chia sẻ nhu cầu cá nhân.' },
    { title: 'Đối mặt với xung đột', description: 'Luyện tập thảo luận trực tiếp.' },
    { title: 'Nghề nghiệp phù hợp', description: 'Khám phá y tế, giáo dục.' },
    { title: 'Cân bằng công việc', description: 'Dành thời gian cho bản thân.' }
  ],
  ESTJ: [
    { title: 'Lắng nghe người khác', description: 'Lắng nghe ý kiến để cải thiện.' },
    { title: 'Quản lý cảm xúc', description: 'Kiểm soát cảm xúc khi áp lực.' },
    { title: 'Nghề nghiệp phù hợp', description: 'Tìm quản lý, tài chính.' },
    { title: 'Cân bằng công việc', description: 'Dành thời gian cho gia đình.' }
  ],
  ESFJ: [
    { title: 'Đặt ranh giới', description: 'Học nói "không" để bảo vệ năng lượng.' },
    { title: 'Chấp nhận phê bình', description: 'Xem phê bình như cơ hội.' },
    { title: 'Nghề nghiệp phù hợp', description: 'Tìm giáo viên, quan hệ công chúng.' },
    { title: 'Quản lý stress', description: 'Thực hành yoga.' }
  ],
  ISTP: [
    { title: 'Duy trì cam kết', description: 'Lập kế hoạch nhỏ để hoàn thành.' },
    { title: 'Bày tỏ cảm xúc', description: 'Chia sẻ cảm xúc để kết nối.' },
    { title: 'Nghề nghiệp phù hợp', description: 'Khám phá kỹ sư, cơ khí.' },
    { title: 'Tăng cường tập trung', description: 'Sử dụng danh sách công việc.' }
  ],
  ISFP: [
    { title: 'Đối mặt với xung đột', description: 'Học thảo luận để giải quyết.' },
    { title: 'Lập kế hoạch', description: 'Tạo mục tiêu nhỏ để hành động.' },
    { title: 'Nghề nghiệp phù hợp', description: 'Tìm nghệ thuật, thiết kế.' },
    { title: 'Quản lý cảm xúc', description: 'Sử dụng nhật ký.' }
  ],
  ESTP: [
    { title: 'Lập kế hoạch dài hạn', description: 'Sử dụng công cụ để theo dõi.' },
    { title: 'Duy trì cam kết', description: 'Tập trung vào mối quan hệ.' },
    { title: 'Nghề nghiệp phù hợp', description: 'Khám phá kinh doanh, thể thao.' },
    { title: 'Quản lý stress', description: 'Thực hành hoạt động thể chất.' }
  ],
  ESFP: [
    { title: 'Tăng cường tập trung', description: 'Sử dụng danh sách công việc.' },
    { title: 'Chấp nhận phê bình', description: 'Xem phê bình như cơ hội.' },
    { title: 'Nghề nghiệp phù hợp', description: 'Tìm giải trí, du lịch.' },
    { title: 'Quản lý tài chính', description: 'Lập ngân sách để kiểm soát.' }
  ]
};

// Compatibility
const compatibility = {
  INTJ: [
    { type: 'ENFP', reason: 'ENFP mang năng lượng sáng tạo, bổ sung cho trí tuệ chiến lược.' },
    { type: 'ENTP', reason: 'ENTP kích thích trí tuệ với ý tưởng mới.' },
    { type: 'INFJ', reason: 'INFJ chia sẻ tầm nhìn lý tưởng, hỗ trợ cảm xúc.' }
  ],
  INTP: [
    { type: 'ENTJ', reason: 'ENTJ cung cấp cấu trúc, giúp INTP biến ý tưởng thành hiện thực.' },
    { type: 'INFJ', reason: 'INFJ mang đồng cảm, bổ sung logic.' },
    { type: 'ENFJ', reason: 'ENFJ truyền cảm hứng, khuyến khích ý tưởng.' }
  ],
  ENTJ: [
    { type: 'INTP', reason: 'INTP cung cấp ý tưởng sáng tạo, hỗ trợ chiến lược.' },
    { type: 'ENFP', reason: 'ENFP mang năng lượng, cân bằng tổ chức.' },
    { type: 'INFJ', reason: 'INFJ chia sẻ tầm nhìn, bổ sung đồng cảm.' }
  ],
  ENTP: [
    { type: 'INFJ', reason: 'INFJ mang ý nghĩa sâu sắc, bổ sung sáng tạo.' },
    { type: 'INTJ', reason: 'INTJ cung cấp chiến lược, hỗ trợ ý tưởng.' },
    { type: 'ENFJ', reason: 'ENFJ khuyến khích và tổ chức.' }
  ],
  INFJ: [
    { type: 'ENFP', reason: 'ENFP mang năng lượng tích cực, hỗ trợ lý tưởng.' },
    { type: 'ENTP', reason: 'ENTP khoi kích thích trí tuệ, sáng tạo.' },
    { type: 'INTJ', reason: 'INTJ chia sẻ tầm nhìn, kết nối sâu sắc.' }
  ],
  INFP: [
    { type: 'ENFJ', reason: 'ENFJ mang hỗ trợ, bổ sung lý tưởng.' },
    { type: 'ENTJ', reason: 'ENTJ cung cấp cấu trúc, giúp thực hiện ước mơ.' },
    { type: 'INFJ', reason: 'INFJ chia sẻ đồng cảm và giá trị.' }
  ],
  ENFJ: [
    { type: 'INFP', reason: 'INFP mang lý tưởng, bổ sung nhiệt huyết.' },
    { type: 'ISFP', reason: 'ISFP cung cấp chân thành, hỗ trợ cảm xúc.' },
    { type: 'ENTP', reason: 'ENTP khoi kích thích trí tuệ.' }
  ],
  ENFP: [
    { type: 'INFJ', reason: 'INFJ mang ý nghĩa sâu sắc, hỗ trợ.' },
    { type: 'INTJ', reason: 'INTJ cung cấp chiến lược, cân bằng sáng tạo.' },
    { type: 'ENFJ', reason: 'ENFJ chia sẻ nhiệt huyết, gắn kết.' }
  ],
  ISTJ: [
    { type: 'ESFP', reason: 'ESFP mang vui vẻ, bổ sung ổn định.' },
    { type: 'ESTP', reason: 'ESTP cung cấp linh hoạt, hỗ trợ thực tế.' },
    { type: 'ISFJ', reason: 'ISFJ chia sẻ trách nhiệm, tin cậy.' }
  ],
  ISFJ: [
    { type: 'ESFP', reason: 'ESFP mang niềm vui, bổ sung chăm sóc.' },
    { type: 'ESTJ', reason: 'ESTJ cung cấp cấu trúc, hỗ trợ tổ chức.' },
    { type: 'ISFJ', reason: 'ISFJ chia sẻ đồng cảm, hòa hợp.' }
  ],
  ESTJ: [
    { type: 'ISFJ', reason: 'ISFJ mang hỗ trợ, bổ sung lãnh đạo.' },
    { type: 'ISTP', reason: 'ISTP cung cấp linh hoạt, hỗ trợ thực tế.' },
    { type: 'ESFJ', reason: 'ESFJ chia sẻ tổ chức, ổn định.' }
  ],
  ESFJ: [
    { type: 'ISFP', reason: 'ISFP mang chân thành, bổ sung kết nối.' },
    { type: 'ISTJ', reason: 'ISTJ cung cấp ổn định, hỗ trợ tổ chức.' },
    { type: 'ESFJ', reason: 'ESFJ chia sẻ hòa đồng, gắn bó.' }
  ],
  ISTP: [
    { type: 'ESTJ', reason: 'ESTJ cung cấp cấu trúc, hỗ trợ ứng biến.' },
    { type: 'ESFJ', reason: 'ESFJ cung cấp kết nối, bổ sung thực tế.' },
    { type: 'ISTJ', reason: 'ISTJ chia sẻ thực tế, tin cậy.' }
  ],
  ISFP: [
    { type: 'ENFJ', reason: 'ENFJ cung cấp hỗ trợ, bổ sung sáng tạo.' },
    { type: 'ESFJ', reason: 'ESFJ cung cấp kết nối, hỗ trợ cảm xúc.' },
    { type: 'ISFP', reason: 'ISFP chia sẻ chân thành, hòa hợp.' }
  ],
  ESTP: [
    { type: 'ISTJ', reason: 'ISTJ mang ổn định, bổ sung năng động.' },
    { type: 'ISFJ', reason: 'ISFJ cung cấp chăm sóc, hỗ trợ hành động.' },
    { type: 'ESTP', reason: 'ESTP chia sẻ năng lượng, kích thích.' }
  ],
  ESFP: [
    { type: 'ISTJ', reason: 'ISTJ mang ổn định, bổ sung vui vẻ.' },
    { type: 'ISFJ', reason: 'ISFJ cung cấp chăm sóc, hỗ trợ hòa đồng.' },
    { type: 'ESFP', reason: 'ESFP chia sẻ năng lượng, gắn kết.' }
  ]
};

// Methods
const resetQuiz = () => {
  console.log('Resetting MBTI');
  store.resetMbti();
  router.push('/mbti');
};

const shareResult = async () => {
  const text = `Kết quả MBTI của tôi: ${mbtiType.value} - ${descriptions[mbtiType.value]?.title || 'Chưa xác định'}! Kiểm tra tại ${window.location.href}`;
  try {
    if (navigator.share && process.client) {
      await navigator.share({ title: 'Kết quả MBTI', text, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(text);
      alert('Đã sao chép kết quả để chia sẻ!');
    }
  } catch (error) {
    console.error('Share error:', error);
    alert('Lỗi khi chia sẻ, hãy thử lại!');
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
@media (max-width: 640px) {
  .text-4xl { font-size: 2rem; }
  .p-6 { padding: 1.5rem; }
}
</style>
