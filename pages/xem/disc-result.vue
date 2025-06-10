<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8">
    <div class="container mx-auto px-4 sm:px-6 max-w-6xl">
      <!-- Header -->
      <header class="text-center mb-12">
        <h1 class="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
          Kết quả trắc nghiệm DISC
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Khám phá phong cách hành vi và tiềm năng của bạn thông qua phân tích DISC
        </p>
      </header>

      <!-- Incomplete Test Notice -->
      <div v-if="!store.discCompleted" class="bg-white rounded-2xl shadow-xl p-8 text-center max-w-2xl mx-auto">
        <div class="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-purple-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Bạn chưa hoàn thành bài trắc nghiệm</h2>
        <p class="text-gray-600 mb-6">Để xem kết quả DISC chi tiết, vui lòng hoàn thành bài đánh giá trước.</p>
        <NuxtLink to="/disc"
                  class="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 shadow-md hover:scale-105 transform">
          Bắt đầu ngay
          <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </NuxtLink>
      </div>

      <!-- DISC Results -->
      <div v-else class="space-y-8">
        <!-- Primary Type Card -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="p-8">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div class="flex items-center mb-4">
                  <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold mr-4">
                    {{ primaryType }}
                  </span>
                  <h2 class="text-2xl font-bold text-gray-800">{{ primaryType }} - {{ descriptions[primaryType]?.title }}</h2>
                </div>
                <p class="text-gray-700 mb-6">{{ descriptions[primaryType]?.summary }}</p>
                
                <div class="flex flex-wrap gap-2 mb-6">
                  <span v-for="(strength, idx) in descriptions[primaryType]?.strengths.slice(0, 4)" :key="idx" 
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {{ strength }}
                  </span>
                </div>
              </div>
              
              <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 min-w-[280px]">
                <h3 class="font-semibold text-gray-800 mb-4 text-center">Tỷ lệ các nhóm</h3>
                <div class="space-y-4">
                  <div v-for="(score, type) in scores" :key="type" class="flex items-center">
                    <span class="w-8 font-medium text-gray-700">{{ type }}:</span>
                    <div class="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden relative">
                      <div class="h-full rounded-full transition-all duration-500"
                           :class="{
                             'bg-red-500': type === 'D',
                             'bg-yellow-400': type === 'I',
                             'bg-green-500': type === 'S',
                             'bg-blue-500': type === 'C'
                           }"
                           :style="{ width: `${score}%` }"></div>
                    </div>
                    <span class="w-12 text-right font-medium text-gray-700">{{ score }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <p class="text-sm text-gray-600 italic">* Tỷ lệ phần trăm thể hiện mức độ phù hợp của bạn với từng kiểu hành vi</p>
          </div>
        </div>

        <!-- Chart and Combination Analysis -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Radar Chart -->
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-gray-800">Biểu đồ DISC</h3>
              <div class="flex space-x-2">
                <span v-for="type in ['D', 'I', 'S', 'C']" :key="type" class="flex items-center">
                  <span class="w-3 h-3 rounded-full mr-1"
                        :class="{
                          'bg-red-500': type === 'D',
                          'bg-yellow-400': type === 'I',
                          'bg-green-500': type === 'S',
                          'bg-blue-500': type === 'C'
                        }"></span>
                  <span class="text-xs font-medium text-gray-600">{{ type }}</span>
                </span>
              </div>
            </div>
            <ClientOnly>
              <RadarChart :scores="scores" :key="scoresKey" />
            </ClientOnly>
          </div>
          
          <!-- Combination Analysis -->
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <div class="flex items-center mb-6">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold mr-4">
                {{ combination?.combination }}
              </div>
              <h3 class="text-xl font-semibold text-gray-800">Kiểu kết hợp: {{ combination?.combination }}</h3>
            </div>
            
            <div v-if="combination" class="space-y-4">
              <p class="text-gray-700">{{ combination.description }}</p>
              
              <div class="bg-green-50 border border-green-100 rounded-lg p-4">
                <h4 class="font-semibold text-green-800 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Điểm mạnh
                </h4>
                <ul class="space-y-2 pl-1">
                  <li v-for="(strength, idx) in combination.strengths" :key="idx" class="flex items-start">
                    <span class="text-green-500 mr-2">•</span>
                    <span class="text-gray-700">{{ strength }}</span>
                  </li>
                </ul>
              </div>
              
              <div class="bg-red-50 border border-red-100 rounded-lg p-4">
                <h4 class="font-semibold text-red-800 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  Thách thức
                </h4>
                <ul class="space-y-2 pl-1">
                  <li v-for="(challenge, idx) in combination.challenges" :key="idx" class="flex items-start">
                    <span class="text-red-500 mr-2">•</span>
                    <span class="text-gray-700">{{ challenge }}</span>
                  </li>
                </ul>
              </div>
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
                <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ primaryType }} - {{ descriptions[primaryType]?.title }}</h3>
                <p class="text-gray-700 mb-6">{{ descriptions[primaryType]?.detail }}</p>
                
                <div class="mb-6">
                  <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Điểm mạnh
                  </h4>
                  <ul class="space-y-2">
                    <li v-for="(strength, idx) in descriptions[primaryType]?.strengths" :key="idx" class="flex items-start">
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
                    <li v-for="(weakness, idx) in descriptions[primaryType]?.weaknesses" :key="idx" class="flex items-start">
                      <span class="text-red-500 mr-2">•</span>
                      <span class="text-gray-700">{{ weakness }}</span>
                    </li>
                  </ul>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-purple-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-purple-800 mb-2">Phong cách giao tiếp</h4>
                    <p class="text-gray-700 text-sm">{{ descriptions[primaryType]?.communication_style }}</p>
                  </div>
                  <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-blue-800 mb-2">Động lực</h4>
                    <p class="text-gray-700 text-sm">{{ descriptions[primaryType]?.motivation }}</p>
                  </div>
                  <div class="bg-pink-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-pink-800 mb-2">Nỗi sợ</h4>
                    <p class="text-gray-700 text-sm">{{ descriptions[primaryType]?.fears }}</p>
                  </div>
                  <div class="bg-indigo-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-indigo-800 mb-2">Môi trường lý tưởng</h4>
                    <p class="text-gray-700 text-sm">{{ descriptions[primaryType]?.work_environment }}</p>
                  </div>
                </div>
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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Phát triển cá nhân
                  </h4>
                  <ul class="space-y-3">
                    <li v-for="(tip, idx) in advice[primaryType]?.personal_development" :key="idx" class="flex">
                      <span class="text-purple-500 mr-2">{{ idx + 1 }}.</span>
                      <span class="text-gray-700">{{ tip }}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Phát triển sự nghiệp
                  </h4>
                  <ul class="space-y-3">
                    <li v-for="(tip, idx) in advice[primaryType]?.career_advice" :key="idx" class="flex">
                      <span class="text-blue-500 mr-2">{{ idx + 1 }}.</span>
                      <span class="text-gray-700">{{ tip }}</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Mối quan hệ
                  </h4>
                  <ul class="space-y-3">
                    <li v-for="(tip, idx) in advice[primaryType]?.relationship_tips" :key="idx" class="flex">
                      <span class="text-pink-500 mr-2">{{ idx + 1 }}.</span>
                      <span class="text-gray-700">{{ tip }}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Quản lý stress
                  </h4>
                  <ul class="space-y-3">
                    <li v-for="(tip, idx) in advice[primaryType]?.stress_management" :key="idx" class="flex">
                      <span class="text-indigo-500 mr-2">{{ idx + 1 }}.</span>
                      <span class="text-gray-700">{{ tip }}</span>
                    </li>
                  </ul>
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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Phù hợp nhất
                </h4>
                <div class="space-y-4">
                  <div v-for="(job, idx) in careerSuggestions[primaryType]?.best_matches" :key="idx" 
                       class="bg-gradient-to-r from-green-50 to-white p-5 rounded-xl border border-green-100 hover:shadow-md transition-shadow">
                    <h5 class="font-bold text-gray-800 mb-2">{{ job.title }}</h5>
                    <p class="text-gray-700 text-sm">{{ job.reason }}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cần tránh
                </h4>
                <div class="space-y-4">
                  <div v-for="(job, idx) in careerSuggestions[primaryType]?.to_avoid" :key="idx" 
                       class="bg-gradient-to-r from-red-50 to-white p-5 rounded-xl border border-red-100 hover:shadow-md transition-shadow">
                    <h5 class="font-bold text-gray-800 mb-2">{{ job.title }}</h5>
                    <p class="text-gray-700 text-sm">{{ job.reason }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Interaction with Other Types -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4">
            <h2 class="text-xl font-bold text-white">Tương tác với các nhóm khác</h2>
          </div>
          
          <div class="p-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div v-for="(comp, type) in comparisonData[primaryType]" :key="type" 
                   class="bg-gray-50 p-5 rounded-xl hover:shadow-md transition-shadow">
                <div class="flex items-center mb-3">
                  <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3"
                        :class="{
                          'bg-red-500': type === 'D',
                          'bg-yellow-400': type === 'I',
                          'bg-green-500': type === 'S',
                          'bg-blue-500': type === 'C'
                        }">
                    {{ type }}
                  </span>
                  <h4 class="font-semibold text-gray-800">Với {{ descriptions[type]?.title }}</h4>
                </div>
                <p class="text-gray-700 text-sm">{{ comp }}</p>
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
import { computed, onMounted, ref } from 'vue';
import { useAssessmentStore } from '~/stores/assessment';
import { useRouter } from 'vue-router';
import { useHead } from '#app';
import RadarChart from '~/components/RadarChart.vue';
definePageMeta({
  layout: 'view',
  // middleware: ['auth']
});
const store = useAssessmentStore();
const router = useRouter();
const scoresKey = ref(0);

// SEO
useHead({
  title: 'Kết quả trắc nghiệm DISC - Thần Số Học',
  meta: [
    {
      name: 'description',
      content: 'Xem kết quả trắc nghiệm DISC chi tiết với điểm số, phân tích kết hợp, biểu đồ radar, nghề nghiệp phù hợp và lời khuyên phát triển.'
    }
  ]
});

// Load localStorage immediately
if (process.client) {
  store.loadFromLocalStorage();
}

// Debug
onMounted(() => {
  console.log('disc-result mounted, store state:', store.$state);
  console.log('Initial scores:', scores.value);
  scoresKey.value++;
});

// Compute scores
const scores = computed(() => {
  const counts = { D: 0, I: 0, S: 0, C: 0 };
  Object.values(store.discAnswers).forEach(answer => {
    if (counts[answer] !== undefined) counts[answer]++;
  });
  const total = Object.values(counts).reduce((sum, val) => sum + val, 0);
  const computedScores = {
    D: total ? Math.round((counts.D / total) * 100) : 0,
    I: total ? Math.round((counts.I / total) * 100) : 0,
    S: total ? Math.round((counts.S / total) * 100) : 0,
    C: total ? Math.round((counts.C / total) * 100) : 0
  };
  console.log('Computed scores:', computedScores);
  return computedScores;
});

// Primary type
const primaryType = computed(() => {
  return Object.entries(scores.value).reduce((max, [type, score]) => (
    score > max.score ? { type, score } : max
  ), { type: 'D', score: 0 }).type;
});

// Combination
const combination = computed(() => {
  const sorted = Object.entries(scores.value).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0][0];
  const secondary = sorted[1][0];
  const comboKey = primary + secondary;

  return {
    combination: comboKey,
    description: combinationTypes[comboKey]?.description || `Bạn có xu hướng ${descriptions[primary].title} chủ đạo với yếu tố ${descriptions[secondary].title} phụ trợ.`,
    strengths: [...(combinationTypes[comboKey]?.strengths || descriptions[primary].strengths.slice(0, 2).concat(descriptions[secondary].strengths.slice(0, 2)))],
    challenges: combinationTypes[comboKey]?.challenges || [
      `Cân bằng giữa ${descriptions[primary].title.toLowerCase()} và ${descriptions[secondary].title.toLowerCase()}.`
    ]
  };
});

// Data
const descriptions = {
  D: {
    title: 'Thống trị (Dominance)',
    summary: 'Người quyết đoán, định hướng hành động và kết quả.',
    detail: 'Nhóm D mạnh mẽ, tập trung vào kết quả, thích thử thách và lãnh đạo.',
    strengths: ['Khả năng lãnh đạo', 'Tự tin', 'Tập trung mục tiêu', 'Giải quyết vấn đề', 'Cạnh tranh'],
    weaknesses: ['Thiếu kiên nhẫn', 'Độc đoán', 'Ít quan tâm cảm xúc', 'Dễ xung đột', 'Khó chấp nhận chỉ trích'],
    work: 'Quản lý, giám đốc, doanh nhân, quân đội, thể thao.',
    relationships: 'Dẫn dắt, cần học lắng nghe và thấu hiểu.',
    communication_style: 'Trực tiếp, ngắn gọn.',
    motivation: 'Thành tích, quyền lực, thử thách.',
    fears: 'Bị kiểm soát, mất quyền lực.',
    work_environment: 'Năng động, cạnh tranh.',
    famous_examples: 'Steve Jobs, Margaret Thatcher'
  },
  I: {
    title: 'Ảnh hưởng (Influence)',
    summary: 'Người năng động, truyền cảm hứng và hòa đồng.',
    detail: 'Nhóm I hướng ngoại, giỏi giao tiếp, thuyết phục, mang năng lượng tích cực.',
    strengths: ['Giao tiếp lôi cuốn', 'Truyền cảm hứng', 'Sáng tạo', 'Xây dựng mối quan hệ', 'Lạc quan'],
    weaknesses: ['Dễ phân tâm', 'Thiếu kiên nhẫn chi tiết', 'Phụ thuộc công nhận', 'Trì hoãn', 'Tránh xung đột'],
    work: 'Marketing, PR, diễn giả, giáo viên, sáng tạo.',
    relationships: 'Kết nối dễ dàng, cần lắng nghe sâu và cam kết.',
    communication_style: 'Thân thiện, thuyết phục.',
    motivation: 'Công nhận, mối quan hệ, sáng tạo.',
    fears: 'Bị từ chối, cô lập.',
    work_environment: 'Hợp tác, sáng tạo.',
    famous_examples: 'Oprah Winfrey, Bill Clinton'
  },
  S: {
    title: 'Ổn định (Steadiness)',
    summary: 'Người kiên nhẫn, đáng tin cậy và hợp tác.',
    detail: 'Nhóm S bình tĩnh, chu đáo, hỗ trợ đội nhóm, thích ổn định.',
    strengths: ['Đáng tin', 'Lắng nghe', 'Kiên nhẫn', 'Duy trì hòa bình', 'Hợp tác'],
    weaknesses: ['Khó thích nghi thay đổi', 'Thiếu quyết đoán', 'Tránh xung đột', 'Chậm quyết định', 'Ít bày tỏ'],
    work: 'Dịch vụ khách hàng, giáo dục, y tế, hành chính.',
    relationships: 'Bạn đồng hành tốt, cần bày tỏ nhu cầu.',
    communication_style: 'Nhẹ nhàng, đồng cảm.',
    motivation: 'Ổn định, an toàn, được đánh giá.',
    fears: 'Thay đổi, xung đột, mất an toàn.',
    work_environment: 'Ổn định, ít cạnh tranh.',
    famous_examples: 'Mother Teresa, George Washington'
  },
  C: {
    title: 'Tuân thủ (Compliance)',
    summary: 'Người cẩn thận, phân tích và chú trọng chi tiết.',
    detail: 'Nhóm C tỉ mỉ, logic, ưu tiên chất lượng và quy trình.',
    strengths: ['Chính xác', 'Logic', 'Tổ chức', 'Giải quyết vấn đề', 'Chất lượng'],
    weaknesses: ['Cầu toàn', 'Khó linh hoạt', 'Ít bày tỏ cảm xúc', 'Căng thẳng thiếu thông tin', 'Tránh rủi ro'],
    work: 'Kế toán, kỹ sư, phân tích dữ liệu, nghiên cứu.',
    relationships: 'Đáng tin, cần cởi mở cảm xúc.',
    communication_style: 'Chính xác, có cấu trúc.',
    motivation: 'Chất lượng, rõ ràng, học hỏi.',
    fears: 'Sai sót, thiếu thông tin.',
    work_environment: 'Cấu trúc, ít rủi ro.',
    famous_examples: 'Albert Einstein, Angela Merkel'
  }
};

const combinationTypes = {
  DI: {
    description: 'Kết hợp quyết đoán và lôi cuốn, bạn dẫn dắt với năng lượng tích cực.',
    strengths: ['Lãnh đạo truyền cảm hứng', 'Tạo động lực', 'Sáng tạo giải pháp'],
    challenges: ['Cân bằng giữa kiểm soát và linh hoạt', 'Kiểm soát cảm xúc khi áp lực']
  },
  DS: {
    description: 'Kết hợp quyết đoán và ổn định, bạn lãnh đạo với sự kiên nhẫn.',
    strengths: ['Kiểm soát tốt', 'Hỗ trợ đội nhóm', 'Kiên trì đạt mục tiêu'],
    challenges: ['Khó thích nghi thay đổi nhanh', 'Cần thể hiện cảm xúc nhiều hơn']
  },
  DC: {
    description: 'Kết hợp quyết đoán và cẩn thận, bạn dẫn dắt với sự chính xác.',
    strengths: ['Ra quyết định logic', 'Tập trung chất lượng', 'Giải quyết vấn đề'],
    challenges: ['Dễ cầu toàn', 'Cần linh hoạt hơn']
  },
  ID: {
    description: 'Kết hợp lôi cuốn và quyết đoán, bạn truyền cảm hứng mạnh mẽ.',
    strengths: ['Thuyết phục', 'Tạo mối quan hệ', 'Năng lượng cao'],
    challenges: ['Dễ mất tập trung', 'Cần chú ý chi tiết']
  },
  IS: {
    description: 'Kết hợp hòa đồng và ổn định, bạn xây dựng đội nhóm hài hòa.',
    strengths: ['Hỗ trợ', 'Giao tiếp tốt', 'Duy trì hòa bình'],
    challenges: ['Tránh xung đột', 'Cần quyết đoán hơn']
  },
  IC: {
    description: 'Kết hợp lôi cuốn và cẩn thận, bạn sáng tạo với sự tỉ mỉ.',
    strengths: ['Sáng tạo có kế hoạch', 'Chú ý chi tiết', 'Giao tiếp hiệu quả'],
    challenges: ['Cân bằng sáng tạo và quy trình', 'Dễ căng thẳng']
  },
  SD: {
    description: 'Kết hợp ổn định và quyết đoán, bạn hỗ trợ với sự kiểm soát.',
    strengths: ['Hỗ trợ đội nhóm', 'Kiên nhẫn', 'Kiểm soát tốt'],
    challenges: ['Khó thay đổi', 'Cần bày tỏ ý kiến']
  },
  SI: {
    description: 'Kết hợp ổn định và hòa đồng, bạn tạo môi trường thân thiện.',
    strengths: ['Hợp tác', 'Lắng nghe', 'Xây dựng mối quan hệ'],
    challenges: ['Tránh xung đột', 'Cần chủ động hơn']
  },
  SC: {
    description: 'Kết hợp ổn định và cẩn thận, bạn đáng tin với sự tỉ mỉ.',
    strengths: ['Chú ý chi tiết', 'Kiên nhẫn', 'Đáng tin'],
    challenges: ['Chậm quyết định', 'Khó thích nghi']
  },
  CD: {
    description: 'Kết hợp cẩn thận và quyết đoán, bạn phân tích với sự kiểm soát.',
    strengths: ['Logic', 'Ra quyết định chính xác', 'Tập trung chất lượng'],
    challenges: ['Cầu toàn', 'Cần cởi mở hơn']
  },
  CI: {
    description: 'Kết hợp cẩn thận và lôi cuốn, bạn tỉ mỉ nhưng giao tiếp tốt.',
    strengths: ['Chú ý chi tiết', 'Thuyết phục', 'Sáng tạo'],
    challenges: ['Cân bằng chi tiết và linh hoạt', 'Dễ căng thẳng']
  },
  CS: {
    description: 'Kết hợp cẩn thận và ổn định, bạn đáng tin với quy trình rõ ràng.',
    strengths: ['Tổ chức', 'Kiên nhẫn', 'Chất lượng cao'],
    challenges: ['Khó thay đổi', 'Cần quyết đoán hơn']
  }
};

const advice = {
  D: {
    personal_development: ['Lắng nghe nhiều hơn', 'Kiểm soát cảm xúc', 'Học kiên nhẫn'],
    career_advice: ['Tìm vai trò lãnh đạo', 'Học cách ủy quyền', 'Cân bằng tốc độ và chất lượng'],
    relationship_tips: ['Thể hiện sự đồng cảm', 'Dành thời gian cho người khác', 'Lắng nghe sâu'],
    stress_management: ['Tập thiền', 'Tập thể dục', 'Lên kế hoạch để giảm áp lực']
  },
  I: {
    personal_development: ['Tập trung vào chi tiết', 'Học quản lý thời gian', 'Đặt mục tiêu rõ ràng'],
    career_advice: ['Tìm công việc sáng tạo', 'Học tổ chức', 'Cải thiện kỹ năng phân tích'],
    relationship_tips: ['Lắng nghe chủ động', 'Duy trì cam kết', 'Tránh hứa quá mức'],
    stress_management: ['Tập yoga', 'Lên lịch công việc', 'Tìm không gian yên tĩnh']
  },
  S: {
    personal_development: ['Học quyết đoán', 'Thích nghi thay đổi', 'Bày tỏ ý kiến'],
    career_advice: ['Tìm vai trò hỗ trợ', 'Học kỹ năng mới', 'Tham gia nhóm đa dạng'],
    relationship_tips: ['Nói lên nhu cầu', 'Đối mặt xung đột', 'Xây dựng ranh giới'],
    stress_management: ['Tập hít thở', 'Dành thời gian cho bản thân', 'Tìm sự hỗ trợ']
  },
  C: {
    personal_development: ['Học linh hoạt', 'Chấp nhận rủi ro nhỏ', 'Bày tỏ cảm xúc'],
    career_advice: ['Tìm công việc phân tích', 'Học giao tiếp', 'Cải thiện tốc độ quyết định'],
    relationship_tips: ['Cởi mở hơn', 'Chia sẻ cảm xúc', 'Học thấu hiểu'],
    stress_management: ['Tập thiền định', 'Lập kế hoạch rõ ràng', 'Giảm cầu toàn']
  }
};

const careerSuggestions = {
  D: {
    best_matches: [
      { title: 'Giám đốc điều hành', reason: 'Cần lãnh đạo mạnh mẽ và quyết đoán.' },
      { title: 'Doanh nhân', reason: 'Phù hợp với tinh thần cạnh tranh và đổi mới.' }
    ],
    to_avoid: [
      { title: 'Nhân viên hành chính', reason: 'Quá nhiều quy trình lặp lại.' },
      { title: 'Nhân viên chăm sóc khách hàng', reason: 'Yêu cầu kiên nhẫn cao.' }
    ]
  },
  I: {
    best_matches: [
      { title: 'Chuyên viên marketing', reason: 'Sáng tạo và giao tiếp tốt.' },
      { title: 'Diễn giả', reason: 'Khả năng truyền cảm hứng.' }
    ],
    to_avoid: [
      { title: 'Kế toán', reason: 'Quá chi tiết và ít tương tác.' },
      { title: 'Lập trình viên', reason: 'Yêu cầu tập trung cao độ.' }
    ]
  },
  S: {
    best_matches: [
      { title: 'Nhân viên dịch vụ khách hàng', reason: 'Kiên nhẫn và đồng cảm.' },
      { title: 'Giáo viên', reason: 'Hỗ trợ và xây dựng môi trường ổn định.' }
    ],
    to_avoid: [
      { title: 'Nhà môi giới chứng khoán', reason: 'Áp lực và thay đổi nhanh.' },
      { title: 'Quản lý bán hàng', reason: 'Cần quyết đoán và cạnh tranh.' }
    ]
  },
  C: {
    best_matches: [
      { title: 'Kế toán', reason: 'Chú trọng chi tiết và chính xác.' },
      { title: 'Kỹ sư phần mềm', reason: 'Phân tích và giải quyết vấn đề.' }
    ],
    to_avoid: [
      { title: 'Nhân viên bán hàng', reason: 'Yêu cầu linh hoạt và giao tiếp.' },
      { title: 'Tổ chức sự kiện', reason: 'Quá nhiều thay đổi đột xuất.' }
    ]
  }
};

const comparisonData = {
  D: {
    I: 'D và I hợp tác tốt trong môi trường sáng tạo, nhưng D cần kiên nhẫn với sự thiếu tập trung của I.',
    S: 'D có thể lấn át S, cần học cách tôn trọng sự kiên nhẫn của S.',
    C: 'D và C có thể xung đột do D muốn nhanh, C muốn chính xác.'
  },
  I: {
    D: 'I mang năng lượng tích cực cho D, nhưng cần chú ý chi tiết hơn.',
    S: 'I và S tạo môi trường hòa hợp, nhưng I cần tôn trọng nhu cầu ổn định của S.',
    C: 'I và C cần cân bằng giữa sáng tạo và quy trình.'
  },
  S: {
    D: 'S hỗ trợ D tốt, nhưng cần bày tỏ ý kiến để không bị lấn át.',
    I: 'S và I hợp tác tốt trong môi trường thân thiện, nhưng S cần chủ động hơn.',
    C: 'S và C làm việc hiệu quả trong môi trường ổn định, ít rủi ro.'
  },
  C: {
    D: 'C cần học cách đáp ứng tốc độ của D, trong khi D cần tôn trọng sự cẩn thận của C.',
    I: 'C và I cần cân bằng chi tiết và sáng tạo.',
    S: 'C và S làm việc tốt cùng nhau, nhưng cần đẩy nhanh tiến độ.'
  }
};

// Methods
const resetQuiz = () => {
  store.resetDisc();
  router.push('/disc');
};

const shareResult = () => {
  if (process.client) {
    const text = `Kết quả DISC của tôi: ${primaryType} - ${descriptions[primaryType].title}! ${window.location.href}`;
    navigator.clipboard.writeText(text)
      .then(() => alert('Đã sao chép kết quả để chia sẻ!'))
      .catch(() => alert('Lỗi khi sao chép, hãy thử lại.'));
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
  .p-6 { padding: 1rem; }
}
</style>
