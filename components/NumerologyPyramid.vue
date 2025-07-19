
<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-6">
      <!-- Phần không bảo vệ (Tiêu đề và mô tả) -->
      <div v-for="section in introSection" :key="section.title" class="text-center mb-8">
        <h2 class="text-4xl font-bold text-teal-700 mb-3">{{ section.title }}</h2>
        <div class="w-24 h-1 bg-teal-500 mx-auto mb-4 rounded-full"></div>
        <div class="text-lg text-gray-600 max-w-3xl mx-auto space-y-3 text-left px-4">
          <div v-for="(paragraph, index) in section.content" :key="index">
            <p v-if="typeof paragraph === 'string'" v-html="paragraph"></p>
            <ul v-else-if="Array.isArray(paragraph)" class="list-disc pl-5 space-y-1">
              <li v-for="(item, i) in paragraph" :key="i" v-html="item"></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Phần thông báo lỗi, trạng thái tải, hoặc nội dung được bảo vệ -->
      <transition name="fade-slide">
        <div>
          <!-- Trạng thái đang tải -->
          <div v-if="isLoading" class="text-center py-12">
            <div class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-gray-600">Đang kiểm tra quyền truy cập...</span>
            </div>
          </div>

          <!-- Lỗi đăng nhập -->
          <div v-else-if="errorMessage && errorType === 'login'" class="text-center py-12 bg-red-50 rounded-lg">
            <svg class="h-12 w-12 mx-auto text-red-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h4 class="text-red-600 font-medium text-lg">Vui lòng đăng nhập để xem tiếp</h4>
            <button @click="errorAction" class="mt-4 px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap">
              Đăng nhập
            </button>
          </div>

          <!-- Lỗi thiếu token -->
          <div v-else-if="errorMessage && errorType === 'topup'" class="text-center py-12 bg-red-50 rounded-lg">
            <svg class="h-12 w-12 mx-auto text-red-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h4 class="text-red-600 font-medium text-lg">Không đủ token để xem tiếp</h4>
            <p class="text-gray-600 mt-1">Cần {{ tokenCost }} token. Vui lòng nạp thêm.</p>
            <button @click="navigateToTopup" class="mt-4 px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap">
              Nạp thêm token
            </button>
          </div>

          <!-- Lỗi chung -->
          <div v-else-if="errorMessage" class="text-center py-12 bg-red-50 rounded-lg">
            <svg class="h-12 w-12 mx-auto text-red-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h4 class="text-red-600 font-medium text-lg">{{ errorMessage }}</h4>
          </div>

          <!-- Đang tải dữ liệu kim tự tháp -->
          <div v-else-if="loading" class="text-center py-12">
            <div class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-gray-600">Đang tải dữ liệu kim tự tháp...</span>
            </div>
          </div>

          <!-- Lỗi dữ liệu -->
          <div v-else-if="!peaksData || !peaksData.length" class="text-center py-12 bg-red-50 rounded-lg">
            <svg class="h-12 w-12 mx-auto text-red-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h4 class="text-red-600 font-medium text-lg">Lỗi dữ liệu</h4>
            <p class="text-gray-600 mt-1">Vui lòng nhập ngày sinh hợp lệ để xem kim tự tháp.</p>
          </div>

          <!-- Yêu cầu đăng nhập hoặc mở khóa nội dung -->
          <div v-else-if="!isContentAccessible" class="text-center py-12">
            <div v-if="!userStore.isAuthenticated">
              <p class="text-gray-600 mb-4">Vui lòng đăng nhập để xem biểu đồ và giải thích chi tiết.</p>
              <button
                @click="errorAction"
                class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap"
                :disabled="isLoading"
              >
                Đăng nhập để xem tiếp
              </button>
            </div>
            <div v-else-if="!hasSufficientTokens" class="text-red-600 text-center font-medium ">
              Không đủ token cho tính năng này. Hãy <button @click="navigateToTopup" class="action-button">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
              <!-- <p class="text-gray-600 mt-2">Số dư token: {{ userStore.user?.tokens || 0 }}</p> -->
            </div>
            <div v-else>
              <button
                @click="performAction"
                class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap"
                :disabled="isLoading"
              >
                Xem tiếp (Cần {{ tokenCost }} token)
              </button>
            </div>
          </div>

          <!-- Nội dung được bảo vệ (Biểu đồ SVG và Giải thích chi tiết) -->
          <div v-else class="space-y-8">
            <div v-for="section in protectedSections" :key="section.title">
              <!-- Biểu đồ SVG -->
              <div v-if="section.type === 'svg'" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div class="text-center mb-8">
                  <h3 class="text-2xl font-bold text-teal-700 mb-2">{{ section.title }}</h3>
                  <div class="w-24 h-1 bg-teal-300 mx-auto rounded-full"></div>
                </div>
                <div class="flex justify-center items-center w-full h-auto">
                  <svg
                    viewBox="0 0 780 520"
                    preserveAspectRatio="xMidYMid meet"
                    class="w-full max-w-[780px] h-auto mx-auto"
                  >
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#003366" />
                      </marker>
                    </defs>

                    <!-- Lines -->
                    <line class="line" x1="350" y1="0" x2="100" y2="200" />
                    <line class="line" x1="350" y1="0" x2="600" y2="200" />
                    <line class="line" x1="350" y1="80" x2="250" y2="140" />
                    <line class="line" x1="350" y1="80" x2="450" y2="140" />
                    <line class="line" x1="250" y1="140" x2="100" y2="200" />
                    <line class="line" x1="450" y1="140" x2="600" y2="200" />
                    <line class="line" x1="250" y1="140" x2="350" y2="200" />
                    <line class="line" x1="450" y1="140" x2="350" y2="200" />
                    <line class="line" x1="100" y1="200" x2="250" y2="260" />
                    <line class="line" x1="600" y1="200" x2="450" y2="260" />
                    <line class="line" x1="350" y1="200" x2="250" y2="260" />
                    <line class="line" x1="350" y1="200" x2="450" y2="260" />
                    <line class="line" x1="250" y1="260" x2="350" y2="320" />
                    <line class="line" x1="450" y1="260" x2="350" y2="320" />
                    <line class="line" x1="350" y1="400" x2="100" y2="200" />
                    <line class="line" x1="350" y1="400" x2="600" y2="200" />

                    <!-- Nodes -->
                    <!-- Topmost node (Đỉnh cao giai đoạn 4) -->
                    <g class="node" transform="translate(350,0)">
                      <circle r="20" fill="#b96cc4" />
                      <text y="5" text-anchor="middle" x="0">{{ peaksData[3].peak }}</text>
                      <text y="35" text-anchor="middle" x="0">{{ peaksData[3].age_range.split(' ')[0] }}</text>
                      <text y="50" text-anchor="middle" x="0">({{ peaksData[3].age_range.match(/\d{4}–\d{4}/)?.[0] || '' }})</text>
                    </g>

                    <!-- Peak Stage 3 -->
                    <g class="node" transform="translate(350,80)">
                      <circle r="20" fill="#b96cc4" />
                      <text y="5" text-anchor="middle" x="0">{{ peaksData[2].peak }}</text>
                      <text y="35" text-anchor="middle" x="0">{{ peaksData[2].age_range.split(' ')[0] }}</text>
                      <text y="50" text-anchor="middle" x="0">({{ peaksData[2].age_range.match(/\d{4}–\d{4}/)?.[0] || '' }})</text>
                    </g>

                    <!-- Peak Stage 1 -->
                    <g class="node" transform="translate(250,140)">
                      <circle r="20" fill="#b96cc4" />
                      <text y="5" text-anchor="middle" x="0">{{ peaksData[0].peak }}</text>
                      <text y="35" text-anchor="middle" x="0">{{ peaksData[0].age_range.split(' ')[0] }}</text>
                      <text y="50" text-anchor="middle" x="0">({{ peaksData[0].age_range.match(/\d{4}–\d{4}/)?.[0] || '' }})</text>
                    </g>

                    <!-- Peak Stage 2 -->
                    <g class="node" transform="translate(450,140)">
                      <circle r="20" fill="#b96cc4" />
                      <text y="5" text-anchor="middle" x="0">{{ peaksData[1].peak }}</text>
                      <text y="35" text-anchor="middle" x="0">{{ peaksData[1].age_range.split(' ')[0] }}</text>
                      <text y="50" text-anchor="middle" x="0">({{ peaksData[1].age_range.match(/\d{4}–\d{4}/)?.[0] || '' }})</text>
                    </g>

                    <!-- Birth Month -->
                    <g class="node" transform="translate(100,200)">
                      <circle r="20" fill="#c0e6f8" />
                      <text y="5" text-anchor="middle" x="0">{{ birthDigits.month }}</text>
                      <text y="35" text-anchor="middle" x="0">Tháng {{ birthDate.split('/')[1] }}</text>
                    </g>

                    <!-- Birth Day -->
                    <g class="node" transform="translate(350,200)">
                      <circle r="20" fill="#c0e6f8" />
                      <text y="5" text-anchor="middle" x="0">{{ birthDigits.day }}</text>
                      <text y="35" text-anchor="middle" x="0">Ngày {{ birthDate.split('/')[0] }}</text>
                    </g>

                    <!-- Birth Year -->
                    <g class="node" transform="translate(600,200)">
                      <circle r="20" fill="#c0e6f8" />
                      <text y="5" text-anchor="middle" x="0">{{ birthDigits.year }}</text>
                      <text y="35" text-anchor="middle" x="0">{{ birthDate.split('/')[2] }}</text>
                    </g>

                    <!-- Challenge Stage 1 -->
                    <g class="node" transform="translate(250,260)">
                      <circle r="20" fill="#b96cc4" />
                      <text y="5" text-anchor="middle" x="0">{{ peaksData[0].challenge }}</text>
                    </g>

                    <!-- Challenge Stage 2 -->
                    <g class="node" transform="translate(450,260)">
                      <circle r="20" fill="#b96cc4" />
                      <text y="5" text-anchor="middle" x="0">{{ peaksData[1].challenge }}</text>
                    </g>

                    <!-- Challenge Stage 3 -->
                    <g class="node" transform="translate(350,320)">
                      <circle r="20" fill="#b96cc4" />
                      <text y="5" text-anchor="middle" x="0">{{ peaksData[2].challenge }}</text>
                    </g>

                    <!-- Bottommost node (Thử thách giai đoạn 4) -->
                    <g class="node" transform="translate(350,400)">
                      <circle r="20" fill="#b96cc4" />
                      <text y="5" text-anchor="middle" x="0">{{ peaksData[3].challenge }}</text>
                    </g>
                  </svg>
                </div>
              </div>

              <!-- Giải thích chi tiết -->
              <div v-if="section.type === 'stages'" class="space-y-8">
                <div class="text-center mb-8">
                  <h3 class="text-2xl font-bold text-teal-700 mb-2">{{ section.title }}</h3>
                  <div class="w-24 h-1 bg-teal-300 mx-auto rounded-full"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    v-for="(stage, index) in section.stages"
                    :key="index"
                    class="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg"
                    :style="`--i: ${index}`"
                  >
                    <!-- Header với số giai đoạn -->
                    <div class="flex items-center px-6 pt-6 pb-4 border-b border-gray-100">
                      <div class="flex-shrink-0 w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                        {{ index + 1 }}
                      </div>
                      <div>
                        <h4 class="text-lg font-semibold text-gray-800">Giai đoạn {{ stage.age_range.split(' ')[0] }}</h4>
                        <p class="text-sm text-gray-500 mt-1">{{ stage.age_range.match(/\(\d{4}–\d{4}\)/)?.[0] || '' }}</p>
                      </div>
                    </div>

                    <!-- Nội dung -->
                    <div class="p-6 space-y-4">
                      <!-- Đỉnh cao -->
                      <div class="flex items-start">
                        <div class="flex-shrink-0 mt-1">
                          <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold text-sm">
                            {{ stage.peak }}
                          </span>
                        </div>
                        <div class="ml-3">
                          <h5 class="font-medium text-gray-800">Đỉnh cao số {{ stage.peak }}</h5>
                          <p class="text-sm text-gray-600 mt-1 leading-relaxed">{{ getPeakDescription(stage.peak) }}</p>
                        </div>
                      </div>

                      <!-- Thử thách -->
                      <div class="flex items-start">
                        <div class="flex-shrink-0 mt-1">
                          <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold text-sm">
                            {{ stage.challenge }}
                          </span>
                        </div>
                        <div class="ml-3">
                          <h5 class="font-medium text-gray-800">Thử thách số {{ stage.challenge }}</h5>
                          <p class="text-sm text-gray-600 mt-1 leading-relaxed">{{ getChallengeDescription(stage.challenge) }}</p>
                        </div>
                      </div>

                      <!-- Mô tả -->
                      <div class="pt-3 mt-3 border-t border-gray-100">
                        <p class="text-gray-700 text-sm leading-relaxed">{{ stage.description }}</p>
                      </div>
                    </div>

                    <!-- Góc trang trí -->
                    <div class="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div class="absolute top-0 right-0 w-full h-full bg-teal-50 transform translate-x-1/2 -translate-y-1/2 rotate-45 origin-bottom-left"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { calculateLifePathNumber } from '~/utils/numerology-calculations';
import peaksAndChallengesData from '~/data/PeaksandChallenges.json';
import { useProtectedContent } from '~/composables/useProtectedContent';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

const props = defineProps({
  birthDate: {
    type: String,
    default: '25/03/1988',
    validator: (value) => {
      if (!value) return true;
      return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
    },
  },
  fullName: {
    type: String,
    default: 'Nguyễn Văn A',
  },
});

const router = useRouter();
const userStore = useUserStore();
const peaksData = ref(null);
const loading = ref(false);
const lifePath = ref(null);
const birthDigits = ref({ day: null, month: null, year: null });

// Protected content setup
const tokenCost = ref(20); // Cập nhật chi phí thành 20 token
const description = 'Access to numerology pyramid data';
const { isLoading, errorMessage, errorType, isContentAccessible, hasSufficientTokens, checkAuthAndAccess, performAction, errorAction, navigateToTopup } = useProtectedContent(tokenCost.value, description);

// Phần không bảo vệ (Tiêu đề và mô tả)
const introSection = computed(() => [
  {
    title: 'Kim Tự Tháp Thần Số Học',
    content: [
      'Kim tự tháp thần số học là công cụ mạnh mẽ giúp bạn khám phá 4 giai đoạn đỉnh cao quan trọng trong cuộc đời, mỗi giai đoạn kéo dài khoảng 9 năm, cùng những thử thách tương ứng bạn cần vượt qua.',
      'Mỗi đỉnh kim tự tháp đại diện cho:',
      [
        '<span class="font-medium">Đỉnh cao 1 (27-36 tuổi):</span> Nền tảng sự nghiệp và cá nhân',
        '<span class="font-medium">Đỉnh cao 2 (36-45 tuổi):</span> Phát triển bản thân và mối quan hệ',
        '<span class="font-medium">Đỉnh cao 3 (45-54 tuổi):</span> Đóng góp cho xã hội và cộng đồng',
        '<span class="font-medium">Đỉnh cao 4 (54 tuổi trở lên):</span> Tổng kết và để lại di sản',
      ],
      'Cấu trúc kim tự tháp gồm 3 lớp chính:',
      [
        '<span class="font-medium">Nền móng:</span> Ngày, tháng, năm sinh (dữ liệu đầu vào)',
        '<span class="font-medium">Đỉnh tháp:</span> 4 đỉnh cao tương ứng 4 giai đoạn',
        '<span class="font-medium">Đáy tháp:</span> Thử thách cần vượt qua ở mỗi giai đoạn',
      ],
      'Bằng cách phân tích các con số từ ngày sinh của bạn, kim tự tháp này sẽ tiết lộ:',
      [
        'Thời điểm vàng để phát triển sự nghiệp',
        'Giai đoạn thuận lợi cho các mối quan hệ',
        'Thời điểm cần tập trung vào đời sống tinh thần',
        'Những bài học cuộc sống quan trọng',
      ],
    ],
  },
]);

// Phần được bảo vệ (Biểu đồ SVG và Giải thích chi tiết)
const protectedSections = computed(() => [
  {
    title: 'Biểu Đồ Thể Hiện 4 Giai Đoạn Đỉnh Cao Kèm Thử Thách Tương Ứng',
    type: 'svg',
  },
  {
    title: 'Giải Thích 4 Giai Đoạn Đỉnh Cao',
    type: 'stages',
    stages: peaksData.value || [],
  },
]);

// Bảng ánh xạ mô tả
const getPeakDescription = (peak) => {
  const descriptions = {
    1: 'Khẳng định bản thân, độc lập và lãnh đạo.',
    2: 'Hợp tác, nhạy bén và xây dựng mối quan hệ.',
    3: 'Sáng tạo, biểu đạt và niềm vui.',
    4: 'Xây dựng nền tảng, kỷ luật và tổ chức.',
    5: 'Tự do, thay đổi và khám phá.',
    6: 'Trách nhiệm, gia đình và hài hòa.',
    7: 'Nội tâm, tri thức và tâm linh.',
    8: 'Thành công, quyền lực và quản lý.',
    9: 'Nhân đạo, lý tưởng và cống hiến.',
    11: 'Trực giác, cảm hứng và tâm linh.',
    22: 'Xây dựng lớn, thực tiễn và thành công.',
  };
  return descriptions[peak] || 'Đặc biệt';
};

const getChallengeDescription = (challenge) => {
  const descriptions = {
    0: 'Tiềm năng vô hạn, cần tìm hướng đi rõ ràng.',
    1: 'Vượt qua tự nghi ngờ, kiểm soát cái tôi.',
    2: 'Học cách hợp tác, kiểm soát cảm xúc.',
    3: 'Kiểm soát sự phân tán, thể hiện rõ ràng.',
    4: 'Duy trì kỷ luật, tránh cứng nhắc.',
    5: 'Thích nghi thay đổi, tránh bốc đồng.',
    6: 'Cân bằng trách nhiệm và tự do cá nhân.',
    7: 'Vượt qua cô lập, tin tưởng trực giác.',
    8: 'Quản lý tài chính, tránh tham vọng quá mức.',
    9: 'Cân bằng lý tưởng và thực tế.',
    11: 'Cân bằng trực giác và thực tế.',
    22: 'Cân bằng tầm nhìn lớn và chi tiết thực tiễn.',
  };
  return descriptions[challenge] || 'Đặc biệt';
};

// Tính số rút gọn
const reduceToSingleDigit = (number) => {
  if ([11, 22].includes(number)) return number;
  let sum = number;
  while (sum > 9) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum;
};

// Lấy và xử lý dữ liệu
const fetchPeaksAndChallenges = async () => {
  console.log('fetchPeaksAndChallenges called with birthDate:', props.birthDate);

  if (!props.birthDate) {
    loading.value = false;
    peaksData.value = null;
    return;
  }

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    loading.value = false;
    peaksData.value = null;
    return;
  }

  const [day, month, year] = props.birthDate.split('/').map(Number);
  const dateObj = new Date(year, month - 1, day);
  if (
    dateObj.getDate() !== day ||
    dateObj.getMonth() + 1 !== month ||
    year < 1900 ||
    year > 2025
  ) {
    loading.value = false;
    peaksData.value = null;
    return;
  }

  loading.value = true;
  peaksData.value = null;

  try {
    // Tính số ngày, tháng, năm
    const daySum = reduceToSingleDigit(day);
    const monthSum = reduceToSingleDigit(month);
    const yearSum = reduceToSingleDigit(year.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0));
    birthDigits.value = { day: daySum, month: monthSum, year: yearSum };

    // Tính số đường đời
    lifePath.value = calculateLifePathNumber(props.birthDate);
    console.log('lifePath:', lifePath.value);
    const lifePathStr = lifePath.value === 22 ? '22/4' : lifePath.value.toString();

    // Lấy dữ liệu từ JSON
    const lifePathData = peaksAndChallengesData.numerology_peaks_and_challenges.life_paths.find(
      (path) => path.life_path.toString() === lifePathStr
    );

    if (!lifePathData) {
      throw new Error(`Không tìm thấy dữ liệu cho số đường đời ${lifePathStr}`);
    }

    // Điều chỉnh age_range
    const birthYear = year;
    const stages = lifePathData.stages.map((stage) => {
      const [startAge, endAge] = stage.age_range.match(/\d+/g).map(Number);
      const startYear = birthYear + startAge;
      const endYear = birthYear + endAge;
      return {
        ...stage,
        age_range: `${startAge}–${endAge} (${startYear}–${endYear})`,
      };
    });

    peaksData.value = stages;
    console.log('Dữ liệu đỉnh cao và thử thách:', peaksData.value);
  } catch (err) {
    console.error('Lỗi trong fetchPeaksAndChallenges:', err);
    peaksData.value = [
      {
        stage: '9.1',
        age_range: '27–35 (2015–2023)',
        peak: 1,
        challenge: 4,
        description: 'Giai đoạn đỉnh cao đầu tiên. Đỉnh cao số 1 mang năng lượng lãnh đạo. Thử thách số 4 yêu cầu kỷ luật.',
      },
      {
        stage: '9.2',
        age_range: '36–44 (2024–2032)',
        peak: 8,
        challenge: 0,
        description: 'Giai đoạn đỉnh cao thứ 2. Đỉnh cao số 8 thúc đẩy thành công. Thử thách số 0 đòi hỏi tìm hướng đi.',
      },
      {
        stage: '9.3',
        age_range: '45–53 (2033–2041)',
        peak: 9,
        challenge: 4,
        description: 'Giai đoạn đỉnh cao thứ 3. Đỉnh cao số 9 tiếp tục nhân đạo. Thử thách số 4 yêu cầu tổ chức.',
      },
      {
        stage: '9.4',
        age_range: '54–62 (2042–2050)',
        peak: 1,
        challenge: 4,
        description: 'Giai đoạn đỉnh cao 4. Đỉnh cao số 1 khuyến khích độc lập. Thử thách số 4 đòi hỏi nền tảng.',
      },
    ];
  } finally {
    loading.value = false;
  }
};

// Khởi tạo trạng thái đăng nhập và hành động
const initializeAuth = async () => {
  console.log('Initializing auth for NumerologyPyramid...');
  try {
    await userStore.initialize();
    console.log('User Store Initialized, isAuthenticated:', userStore.isAuthenticated, 'tokenBalance:', userStore.user?.tokens);
    await checkAuthAndAccess();
    console.log('Auth checked, isContentAccessible:', isContentAccessible.value, 'hasSufficientTokens:', hasSufficientTokens.value);
  } catch (err) {
    console.error('Lỗi khi khởi tạo auth:', err);
    errorMessage.value = 'Không thể khởi tạo trạng thái đăng nhập. Vui lòng thử lại.';
    errorType.value = '';
  }
};

// Theo dõi birthDate
watch(() => props.birthDate, (newValue) => {
  console.log('watch birthDate triggered:', newValue);
  if (newValue && /^\d{2}\/\d{2}\/\d{4}$/.test(newValue)) {
    fetchPeaksAndChallenges();
  } else {
    console.log('birthDate không hợp lệ khi watch:', newValue);
    peaksData.value = null;
  }
});

// Gọi khi mount
onMounted(() => {
  console.log('Component mounted, birthDate:', props.birthDate);
  if (props.birthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    fetchPeaksAndChallenges();
    initializeAuth();
  }
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.line {
  stroke: #14B8A6;
  stroke-width: 2;
  marker-end: url(#arrow);
}
.node {
  fill: #fff;
  font-size: 14px;
  font-weight: bold;
}
.node text {
  fill: #000;
  font-size: 12px;
  text-anchor: middle;
}
svg {
  display: block;
  overflow: visible;
}
@media (max-width: 768px) {
  svg {
    max-width: 90vw;
  }
  .container {
    padding: 1rem;
  }
  .text-4xl {
    font-size: 2rem;
  }
  .text-2xl {
    font-size: 1.5rem;
  }
  .text-lg {
    font-size: 1rem;
  }
}
</style>
