```vue
<template>
  <div class="bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
    <div class="container mx-auto p-4">
      <!-- Header Section -->
      <div v-for="section in introSection" :key="section.title" class="space-y-6">
        <div v-if="section.type === 'header'" class="text-center mb-8 relative">
          <h1 class="text-3xl md:text-4xl font-bold text-blue-800 mb-2">{{ section.title }}</h1>
          <p class="text-gray-600">{{ section.description }}</p>
          <p class="text-gray-600 mt-2">Hôm nay: <span class="font-medium">{{ currentDate }}</span></p>
          <div v-if="personalDayNumber" class="mt-4 inline-flex items-center px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
            Số ngày cá nhân hôm nay của bạn: <span class="font-bold ml-1">{{ personalDayNumber }}</span>
          </div>
        </div>

        <!-- Input Form -->
        <div v-if="section.type === 'form'" class="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
          <h3 class="text-xl font-semibold text-purple-700 mb-4">Nhập thông tin cá nhân</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
              <input
                v-model="formData.name"
                type="text"
                id="name"
                placeholder="VD: Nguyễn Văn A"
                :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.name ? 'border-red-500' : 'border-gray-300']"
              />
              <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
            </div>
            <div>
              <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh (DD/MM/YYYY)</label>
              <input
                v-model="formData.birthDate"
                type="text"
                id="birthDate"
                placeholder="VD: 01/01/1990"
                :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.birthDate ? 'border-red-500' : 'border-gray-300']"
              />
              <p v-if="errors.birthDate" class="text-red-600 text-sm mt-1">{{ errors.birthDate }}</p>
            </div>
          </div>

          <!-- Tabs Navigation -->
          <div class="mb-6">
            <nav class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                v-for="tab in tabs"
                :key="tab"
                @click="switchTab(tab)"
                :class="[
                  activeTab === tab
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-700',
                  'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200'
                ]"
              >
                {{ tab }}
              </button>
            </nav>
          </div>

          <!-- Input Form for Preferences/Plans -->
          <form @submit.prevent="getRecommendations" class="space-y-6">
            <div v-if="activeTab === 'Đồ ăn'">
              <label for="foodPreferences" class="block text-sm font-medium text-gray-700 mb-3">Món ăn yêu thích (phân cách bằng dấu phẩy, nếu không có bỏ trống)</label>
              <input
                v-model="formData.foodPreferences"
                type="text"
                id="foodPreferences"
                placeholder="VD: phở, bún, cơm tấm"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
            <div v-else-if="activeTab === 'Đồ uống'">
              <label for="drinkPreferences" class="block text-sm font-medium text-gray-700 mb-3">Đồ uống yêu thích (phân cách bằng dấu phẩy, nếu không có bỏ trống)</label>
              <input
                v-model="formData.drinkPreferences"
                type="text"
                id="drinkPreferences"
                placeholder="VD: trà sữa, cà phê, nước cam"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
            <div v-else>
              <label for="plans" class="block text-sm font-medium text-gray-700 mb-3">Dự định hôm nay (phân cách bằng dấu phẩy, nếu không có bỏ trống)</label>
              <input
                v-model="formData.plans"
                type="text"
                id="plans"
                placeholder="VD: gặp khách hàng, hoàn thành báo cáo, đi tập gym"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>

            <!-- Action Button for Get Recommendations -->
            <div class="text-center p-6">
              <button
                @click="getRecommendations"
                :disabled="isLoading || loading"
                :class="[
                  'action-button',
                  (isLoading || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                ]"
              >
                {{ isLoading || loading ? 'Đang tải...' : `Xem gợi ý hôm nay (Cần ${tokenCost} token)` }}
              </button>
              <div v-if="errorMessage" class="text-red-600 text-center font-medium mt-4">
                <template v-if="errorType === 'login'">
                  Vui lòng <button @click="errorAction" class="action-button inline">Đăng Nhập</button> để xem gợi ý hôm nay.
                </template>
                <template v-else-if="errorType === 'topup'">
                  Không đủ token để xem gợi ý hôm nay. Hãy <button @click="navigateToTopup" class="action-button inline">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
                </template>
                <template v-else>
                  {{ errorMessage }}
                </template>
              </div>
              <div v-else-if="errors.general" class="text-red-600 text-center font-medium mt-4">
                {{ errors.general }}
              </div>
              <div v-else-if="!isContentAccessible && !isLoading && !loading" class="text-red-600 text-center font-medium mt-4">
                <template v-if="!userStore.isAuthenticated">
                  Vui lòng <button @click="errorAction" class="action-button inline">Đăng Nhập</button> để xem gợi ý hôm nay.
                </template>
                <template v-else-if="userStore.isAuthenticated && !hasSufficientTokens">
                  Không đủ token để xem gợi ý hôm nay. Hãy <button @click="navigateToTopup" class="action-button inline">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
                </template>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Results Section -->
      <transition name="slide-fade">
        <div v-if="isContentAccessible && recommendations" class="space-y-8">
          <div v-for="section in resultSections" :key="section.title" class="space-y-6">
            <div v-if="section.type === 'personalDay'" class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <div class="flex items-center">
                <div class="bg-purple-100 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-purple-800">Số ngày cá nhân: <span class="text-2xl font-bold">{{ personalDayNumber }}</span></h2>
                  <p class="text-gray-600 mt-1">Dựa trên ngày sinh của bạn, hôm nay là ngày mang năng lượng số {{ personalDayNumber }}.</p>
                </div>
              </div>
            </div>
            <div v-if="section.type === 'food' && activeTab === 'Đồ ăn' && recommendations.food" class="space-y-4">
              <h3 class="font-medium text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
                  </svg>
                </span>
                Gợi ý món ăn
              </h3>
              <div v-if="Array.isArray(recommendations.food)" class="grid gap-4 md:grid-cols-2">
                <div v-for="(item, index) in recommendations.food" :key="index" class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <p class="font-medium text-gray-800 flex items-center">
                    <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mr-2 text-sm">{{ index + 1 }}</span>
                    {{ item.item }}
                  </p>
                  <p class="text-gray-600 text-sm mt-2">{{ item.explanation }}</p>
                </div>
              </div>
              <div v-else class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <p class="font-medium text-gray-800">{{ recommendations.food.item }}</p>
                <p class="text-gray-600 text-sm mt-2">{{ recommendations.food.explanation }}</p>
              </div>
              <div v-if="section.type === 'food' && recommendations.food && recommendations.food.length < maxSuggestions" class="text-center p-6">
                <button
                  @click="loadMoreRecommendations('food')"
                  :disabled="isLoadingMore || loadingMore"
                  :class="[
                    'action-button',
                    (isLoadingMore || loadingMore) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                  ]"
                >
                  {{ isLoadingMore || loadingMore ? 'Đang tải...' : `Xem thêm gợi ý món ăn (Cần ${tokenCostMore} token)` }}
                </button>
                <div v-if="errorMessageMore" class="text-red-600 text-center font-medium mt-4">
                  <template v-if="errorTypeMore === 'login'">
                    Vui lòng <button @click="errorActionMore" class="action-button inline">Đăng Nhập</button> để xem thêm gợi ý món ăn.
                  </template>
                  <template v-else-if="errorTypeMore === 'topup'">
                    Không đủ token để xem thêm gợi ý món ăn. Hãy <button @click="navigateToTopup" class="action-button inline">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
                  </template>
                  <template v-else>
                    {{ errorMessageMore }}
                  </template>
                </div>
                <div v-else-if="!isContentAccessibleMore && !isLoadingMore && !loadingMore" class="text-red-600 text-center font-medium mt-4">
                  <template v-if="!userStore.isAuthenticated">
                    Vui lòng <button @click="errorActionMore" class="action-button inline">Đăng Nhập</button> để xem thêm gợi ý món ăn.
                  </template>
                  <template v-else-if="userStore.isAuthenticated && !hasSufficientTokensMore">
                    Không đủ token để xem thêm gợi ý món ăn. Hãy <button @click="navigateToTopup" class="action-button inline">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
                  </template>
                </div>
              </div>
            </div>
            <div v-if="section.type === 'drink' && activeTab === 'Đồ uống' && recommendations.drink" class="space-y-4">
              <h3 class="font-medium text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clip-rule="evenodd" />
                  </svg>
                </span>
                Gợi ý đồ uống
              </h3>
              <div v-if="Array.isArray(recommendations.drink)" class="grid gap-4 md:grid-cols-2">
                <div v-for="(item, index) in recommendations.drink" :key="index" class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <p class="font-medium text-gray-800 flex items-center">
                    <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-2 text-sm">{{ index + 1 }}</span>
                    {{ item.item }}
                  </p>
                  <p class="text-gray-600 text-sm mt-2">{{ item.explanation }}</p>
                </div>
              </div>
              <div v-else class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <p class="font-medium text-gray-800">{{ recommendations.drink.item }}</p>
                <p class="text-gray-600 text-sm mt-2">{{ recommendations.drink.explanation }}</p>
              </div>
              <div v-if="section.type === 'drink' && recommendations.drink && recommendations.drink.length < maxSuggestions" class="text-center p-6">
                <button
                  @click="loadMoreRecommendations('drink')"
                  :disabled="isLoadingMore || loadingMore"
                  :class="[
                    'action-button',
                    (isLoadingMore || loadingMore) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                  ]"
                >
                  {{ isLoadingMore || loadingMore ? 'Đang tải...' : `Xem thêm gợi ý đồ uống (Cần ${tokenCostMore} token)` }}
                </button>
                <div v-if="errorMessageMore" class="text-red-600 text-center font-medium mt-4">
                  <template v-if="errorTypeMore === 'login'">
                    Vui lòng <button @click="errorActionMore" class="action-button inline">Đăng Nhập</button> để xem thêm gợi ý đồ uống.
                  </template>
                  <template v-else-if="errorTypeMore === 'topup'">
                    Không đủ token để xem thêm gợi ý đồ uống. Hãy <button @click="navigateToTopup" class="action-button inline">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
                  </template>
                  <template v-else>
                    {{ errorMessageMore }}
                  </template>
                </div>
                <div v-else-if="!isContentAccessibleMore && !isLoadingMore && !loadingMore" class="text-red-600 text-center font-medium mt-4">
                  <template v-if="!userStore.isAuthenticated">
                    Vui lòng <button @click="errorActionMore" class="action-button inline">Đăng Nhập</button> để xem thêm gợi ý đồ uống.
                  </template>
                  <template v-else-if="userStore.isAuthenticated && !hasSufficientTokensMore">
                    Không đủ token để xem thêm gợi ý đồ uống. Hãy <button @click="navigateToTopup" class="action-button inline">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
                  </template>
                </div>
              </div>
            </div>
            <div v-if="section.type === 'insight' && activeTab === 'Insight hôm nay' && recommendations.insight" class="space-y-6">
              <h3 class="font-medium text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </span>
                Insight hôm nay
              </h3>
              <div v-if="recommendations.insight.selectedPlan" class="space-y-6">
                <div class="bg-white p-5 rounded-xl border border-green-100 shadow-sm">
                  <h4 class="text-sm font-semibold text-green-600 uppercase tracking-wider mb-3">DỰ ĐỊNH TỐT NHẤT</h4>
                  <p class="text-gray-800 font-semibold text-lg">{{ recommendations.insight.selectedPlan }}</p>
                  <p class="text-gray-600 mt-2">{{ recommendations.insight.planExplanation }}</p>
                </div>
                <div class="grid gap-5 md:grid-cols-2">
                  <div class="bg-white p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                    <h4 class="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      NÊN LÀM
                    </h4>
                    <p class="text-gray-800 font-medium">{{ recommendations.insight.doToday.activity }}</p>
                    <p class="text-gray-600 mt-2 text-sm">{{ recommendations.insight.doToday.explanation }}</p>
                  </div>
                  <div class="bg-white p-5 rounded-xl border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                    <h4 class="text-sm font-semibold text-red-600 uppercase tracking-wider mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                      NÊN TRÁNH
                    </h4>
                    <p class="text-gray-800 font-medium">{{ recommendations.insight.avoidToday.activity }}</p>
                    <p class="text-gray-600 mt-2 text-sm">{{ recommendations.insight.avoidToday.explanation }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="space-y-6">
                <div class="grid gap-5 md:grid-cols-2">
                  <div class="bg-white p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                    <h4 class="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">NÊN LÀM</h4>
                    <div v-for="(item, index) in recommendations.insight.doToday" :key="'do-' + index" class="mt-4 first:mt-0">
                      <p class="text-gray-800 font-medium">{{ item.activity }}</p>
                      <p class="text-gray-600 mt-1 text-sm">{{ item.explanation }}</p>
                    </div>
                  </div>
                  <div class="bg-white p-5 rounded-xl border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                    <h4 class="text-sm font-semibold text-red-600 uppercase tracking-wider mb-3">NÊN TRÁNH</h4>
                    <div v-for="(item, index) in recommendations.insight.avoidToday" :key="'avoid-' + index" class="mt-4 first:mt-0">
                      <p class="text-gray-800 font-medium">{{ item.activity }}</p>
                      <p class="text-gray-600 mt-1 text-sm">{{ item.explanation }}</p>
                    </div>
                  </div>
                </div>
                <div v-if="section.type === 'insight' && recommendations.insight && recommendations.insight.doToday.length < maxSuggestions" class="text-center p-6">
                  <button
                    @click="loadMoreRecommendations('insight')"
                    :disabled="isLoadingMore || loadingMore"
                    :class="[
                      'action-button',
                      (isLoadingMore || loadingMore) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                    ]"
                  >
                    {{ isLoadingMore || loadingMore ? 'Đang tải...' : `Xem thêm gợi ý insight (Cần ${tokenCostMore} token)` }}
                  </button>
                  <div v-if="errorMessageMore" class="text-red-600 text-center font-medium mt-4">
                    <template v-if="errorTypeMore === 'login'">
                      Vui lòng <button @click="errorActionMore" class="action-button inline">Đăng Nhập</button> để xem thêm gợi ý insight.
                    </template>
                    <template v-else-if="errorTypeMore === 'topup'">
                      Không đủ token để xem thêm gợi ý insight. Hãy <button @click="navigateToTopup" class="action-button inline">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
                    </template>
                    <template v-else>
                      {{ errorMessageMore }}
                    </template>
                  </div>
                  <div v-else-if="!isContentAccessibleMore && !isLoadingMore && !loadingMore" class="text-red-600 text-center font-medium mt-4">
                    <template v-if="!userStore.isAuthenticated">
                      Vui lòng <button @click="errorActionMore" class="action-button inline">Đăng Nhập</button> để xem thêm gợi ý insight.
                    </template>
                    <template v-else-if="userStore.isAuthenticated && !hasSufficientTokensMore">
                      Không đủ token để xem thêm gợi ý insight. Hãy <button @click="navigateToTopup" class="action-button inline">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
                    </template>
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
import { ref, computed, onMounted, watch } from 'vue';
import { toast } from 'vue3-toastify';
import { useProtectedContent } from '~/composables/useProtectedContent';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

definePageMeta({ layout: 'view' });

const router = useRouter();
const userStore = useUserStore();
const formData = ref({
  name: '',
  birthDate: '',
  foodPreferences: '',
  drinkPreferences: '',
  plans: '',
});
const personalDayNumber = ref(null);
const recommendations = ref(null);
const loading = ref(false);
const loadingMore = ref(false);
const errors = ref({
  name: '',
  birthDate: '',
  general: '',
});
const activeTab = ref('Insight hôm nay');
const tabs = ['Insight hôm nay', 'Đồ ăn', 'Đồ uống'];
const tokenCost = ref(10);
const tokenCostMore = ref(5);
const maxSuggestions = ref(12);
const description = 'Access to daily numerology recommendations';
const {
  isLoading,
  errorMessage,
  errorType,
  isContentAccessible,
  hasSufficientTokens,
  checkAuthAndAccess,
  performAction,
  errorAction,
  navigateToTopup,
} = useProtectedContent(tokenCost.value, description);
const {
  isLoading: isLoadingMore,
  errorMessage: errorMessageMore,
  errorType: errorTypeMore,
  isContentAccessible: isContentAccessibleMore,
  hasSufficientTokens: hasSufficientTokensMore,
  checkAuthAndAccess: checkAuthAndAccessMore,
  performAction: performActionMore,
  errorAction: errorActionMore,
} = useProtectedContent(tokenCostMore.value, 'Load more numerology recommendations');

// Hàm điều hướng đến trang nạp token


// Hàm lấy ngày hiện tại định dạng DD/MM/YYYY
const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};
const currentDate = ref(getCurrentDate());

// Hàm chuyển đổi định dạng ngày từ YYYY-MM-DD sang DD/MM/YYYY
const formatDateToDDMMYYYY = (dateStr) => {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(dateStr)) return '';
  const [year, month, day] = dateStr.split('T')[0].split('-');
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
};

// Hàm chuyển đổi định dạng ngày từ DD/MM/YYYY sang YYYY-MM-DD
const formatDateToYYYYMMDD = (dateStr) => {
  if (!dateStr || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return '';
  const [day, month, year] = dateStr.split('/').map(Number);
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

// Hàm tính số ngày cá nhân
const calculatePersonalDayNumber = (birthDate, currentDate) => {
  if (!birthDate || !currentDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate) || !/^\d{2}\/\d{2}\/\d{4}$/.test(currentDate)) {
    return null;
  }
  const [birthDay, birthMonth, birthYear] = birthDate.split('/').map(Number);
  const [currentDay, currentMonth, currentYear] = currentDate.split('/').map(Number);
  const sumBirth = (birthDay + birthMonth + birthYear)
    .toString()
    .split('')
    .reduce((sum, digit) => sum + Number(digit), 0);
  const sumCurrent = (currentDay + currentMonth + currentYear)
    .toString()
    .split('')
    .reduce((sum, digit) => sum + Number(digit), 0);
  let personalDay = (sumBirth + sumCurrent) % 9;
  if (personalDay === 0) personalDay = 9;
  return personalDay;
};

// Phần không bảo vệ (Tiêu đề và form nhập thông tin)
const introSection = computed(() => [
  {
    title: 'Thần Số Học Hôm Nay - Khám Phá Vận Mệnh Ngày Mới',
    description: 'Mỗi ngày là một con số khác nhau - Hãy xem hôm nay vũ trụ dành điều gì cho bạn!',
    type: 'header',
  },
  {
    title: 'Nhập thông tin cá nhân',
    type: 'form',
  },
]);

// Phần được bảo vệ (Kết quả gợi ý)
const resultSections = computed(() => {
  if (!recommendations.value) return [];
  return [
    {
      title: 'Số ngày cá nhân',
      type: 'personalDay',
    },
    {
      title: 'Gợi ý món ăn',
      type: 'food',
    },
    {
      title: 'Gợi ý đồ uống',
      type: 'drink',
    },
    {
      title: 'Insight hôm nay',
      type: 'insight',
    },
  ];
});

// Hàm lấy thông tin người dùng từ API
const fetchUserData = async () => {
  if (!userStore.isAuthenticated || !userStore.user?.id) {
    console.log('User not authenticated, skipping fetchUserData');
    return;
  }
  try {
    const userIdValue = String(userStore.user.id);
    console.log('Fetching user data for userId:', userIdValue);
    const response = await $fetch(`/api/users/${userIdValue}`, {
      method: 'GET',
    });
    console.log('API /api/users response:', response);
    const { fullname, birthdate } = response.user;
    formData.value.name = fullname?.trim() || '';
    formData.value.birthDate = birthdate ? formatDateToDDMMYYYY(birthdate.split('T')[0]) : '';
    if (formData.value.birthDate) {
      personalDayNumber.value = calculatePersonalDayNumber(formData.value.birthDate, currentDate.value);
    }
  } catch (err) {
    console.error('Error fetching user data:', err);
    errors.value.general = err.data?.message || 'Không thể tải thông tin tài khoản. Vui lòng nhập thủ công.';
    toast.error(errors.value.general, { position: 'top-center' });
  }
};

// Khởi tạo trạng thái đăng nhập và kiểm tra token
const initializeAuth = async () => {
  console.log('Initializing auth for DailyNumerology...');
  try {
    await userStore.initialize();
    console.log('User Store Initialized, isAuthenticated:', userStore.isAuthenticated, 'tokenBalance:', userStore.user?.tokens);
    await checkAuthAndAccess();
    await checkAuthAndAccessMore();
    console.log('Auth checked, isContentAccessible:', isContentAccessible.value, 'hasSufficientTokens:', hasSufficientTokens.value);
    console.log('Auth checked for more, isContentAccessibleMore:', isContentAccessibleMore.value, 'hasSufficientTokensMore:', hasSufficientTokensMore.value);
  } catch (err) {
    console.error('Lỗi khi khởi tạo auth:', err);
    errors.value.general = 'Không thể khởi tạo trạng thái đăng nhập. Vui lòng thử lại.';
    toast.error(errors.value.general, { position: 'top-center' });
  }
};

// Hàm chuyển tab và kiểm tra quyền truy cập
const switchTab = async (tab) => {
  activeTab.value = tab;
  loadingMore.value = false; // Reset trạng thái loading khi chuyển tab
  await checkAuthAndAccessMore();
  console.log(`Switched to tab: ${tab}, isContentAccessibleMore:`, isContentAccessibleMore.value, 'hasSufficientTokensMore:', hasSufficientTokensMore.value);
};

// Cập nhật thông tin người dùng khi thay đổi name hoặc birthDate
watch([() => formData.value.name, () => formData.value.birthDate], async ([newName, newBirthDate]) => {
  if (!userStore.isStoreInitialized || !userStore.user?.id) return;
  const currentBirthDate = userStore.user?.birthdate || '';
  const formattedNewBirthDate = formatDateToYYYYMMDD(newBirthDate);
  if (newName !== userStore.user?.fullname || formattedNewBirthDate !== currentBirthDate) {
    try {
      const response = await $fetch(`/api/users/${userStore.user.id}`, {
        method: 'PATCH',
        body: {
          fullname: newName.trim(),
          birthdate: formattedNewBirthDate,
        },
      });
      if (response.success) {
        userStore.setUser({
          id: userStore.user.id,
          email: userStore.user?.email || '',
          fullname: newName.trim(),
          birthdate: formattedNewBirthDate,
          tokens: userStore.user?.tokens || 0,
        });
        if (newBirthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(newBirthDate)) {
          personalDayNumber.value = calculatePersonalDayNumber(newBirthDate, currentDate.value);
        }
      }
    } catch (err) {
      console.error('Lỗi cập nhật thông tin người dùng:', err);
      errors.value.general = 'Không thể cập nhật thông tin. Vui lòng thử lại.';
      toast.error(errors.value.general, { position: 'top-center' });
    }
  }
});

// Theo dõi isStoreInitialized để lấy dữ liệu khi store sẵn sàng
watch(() => userStore.isStoreInitialized, (initialized) => {
  if (initialized && process.client) {
    console.log('User store initialized, running initializeAuth and fetchUserData');
    initializeAuth();
    fetchUserData();
  }
});

// Theo dõi activeTab để kiểm tra quyền truy cập khi chuyển tab
watch(activeTab, async () => {
  await checkAuthAndAccessMore();
  console.log('Active tab changed, rechecked auth for more:', isContentAccessibleMore.value, hasSufficientTokensMore.value);
});

// Validate form
const validateForm = () => {
  errors.value = {
    name: '',
    birthDate: '',
    general: '',
  };
  let isValid = true;
  if (!formData.value.name.trim()) {
    errors.value.name = 'Vui lòng nhập họ và tên';
    isValid = false;
  }
  if (!formData.value.birthDate.trim()) {
    errors.value.birthDate = 'Vui lòng nhập ngày sinh';
    isValid = false;
  } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.value.birthDate)) {
    errors.value.birthDate = 'Vui lòng nhập ngày sinh đúng định dạng DD/MM/YYYY';
    isValid = false;
  } else {
    const match = formData.value.birthDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    const date = new Date(year, month - 1, day);
    if (
      date.getDate() !== day ||
      date.getMonth() + 1 !== month ||
      date.getFullYear() !== year ||
      year < 1900 ||
      year > new Date().getFullYear()
    ) {
      errors.value.birthDate = 'Ngày sinh không hợp lệ';
      isValid = false;
    }
  }
  return isValid;
};

// Hàm lấy gợi ý
const getRecommendations = async () => {
  if (!process.client) {
    console.warn('getRecommendations called on server-side, ignoring.');
    return;
  }
  if (!validateForm()) {
    toast.error('Vui lòng kiểm tra lại thông tin nhập', { position: 'top-center' });
    return;
  }
  if (isContentAccessible.value) {
    await fetchRecommendations();
  } else {
    try {
      await performAction();
      if (isContentAccessible.value) {
        await fetchRecommendations();
      } else {
        toast.error(errorMessage.value, { position: 'top-center' });
      }
    } catch (err) {
      console.error('Error in performAction:', err);
      toast.error(errorMessage.value || 'Có lỗi khi kiểm tra quyền truy cập', { position: 'top-center' });
    }
  }
};

// Hàm gọi API lấy gợi ý
const fetchRecommendations = async () => {
  loading.value = true;
  errors.value.general = '';
  try {
    const username = userStore.isAuthenticated ? userStore.user.email : 'guest';
    let endpoint;
    let body = { birthDate: formData.value.birthDate, numSuggestions: 3, previousItems: [] };
    if (activeTab.value === 'Đồ ăn') {
      endpoint = '/api/numerology/food';
      body.preferences = formData.value.foodPreferences;
    } else if (activeTab.value === 'Đồ uống') {
      endpoint = '/api/numerology/drinks';
      body.preferences = formData.value.drinkPreferences;
    } else {
      endpoint = '/api/numerology/insights';
      body.plans = formData.value.plans;
    }
    console.log(`Sending request to ${endpoint} with data:`, body);
    const response = await $fetch(endpoint, {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8',
      },
      body,
    });
    console.log(`Response from ${endpoint}:`, response);
    personalDayNumber.value = response.personalDayNumber;
    recommendations.value = response.recommendations;
    toast.success('Gợi ý hôm nay đã được tải thành công!', { position: 'top-center' });
    setTimeout(() => {
      const resultElement = document.querySelector('[v-if="isContentAccessible && recommendations"]');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    await checkAuthAndAccess();
    await checkAuthAndAccessMore();
  } catch (error) {
    console.error('Error in fetchRecommendations:', error);
    errors.value.general = error.data?.message || 'Có lỗi xảy ra khi lấy gợi ý!';
    toast.error(errors.value.general, { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};

// Hàm tải thêm gợi ý
const loadMoreRecommendations = async (type) => {
  if (!process.client) {
    console.warn('loadMoreRecommendations called on server-side, ignoring.');
    return;
  }
  if (!recommendations.value) return;

  if (isContentAccessibleMore.value) {
    await fetchMoreRecommendations(type);
  } else {
    try {
      await performActionMore();
      if (isContentAccessibleMore.value) {
        await fetchMoreRecommendations(type);
      } else {
        toast.error(errorMessageMore.value, { position: 'top-center' });
      }
    } catch (err) {
      console.error('Error in performActionMore:', err);
      toast.error(errorMessageMore.value || 'Có lỗi khi kiểm tra quyền truy cập', { position: 'top-center' });
    }
  }
};

// Hàm gọi API tải thêm gợi ý
const fetchMoreRecommendations = async (type) => {
  loadingMore.value = true;
  try {
    const username = userStore.isAuthenticated ? userStore.user.email : 'guest';
    let endpoint;
    let body = { birthDate: formData.value.birthDate };
    let previousItems = [];
    if (type === 'food') {
      endpoint = '/api/numerology/food';
      body.preferences = formData.value.foodPreferences;
      previousItems = recommendations.value.food ? recommendations.value.food.map((item) => item.item) : [];
    } else if (type === 'drink') {
      endpoint = '/api/numerology/drinks';
      body.preferences = formData.value.drinkPreferences;
      previousItems = recommendations.value.drink ? recommendations.value.drink.map((item) => item.item) : [];
    } else {
      endpoint = '/api/numerology/insights';
      body.plans = formData.value.plans;
      previousItems = recommendations.value.insight
        ? recommendations.value.insight.doToday.concat(recommendations.value.insight.avoidToday).map((item) => item.activity)
        : [];
    }
    body.numSuggestions = Math.min((previousItems.length || 0) + 3, maxSuggestions.value);
    body.previousItems = previousItems;
    console.log(`Sending request to ${endpoint} for more suggestions, numSuggestions:`, body.numSuggestions);
    const response = await $fetch(endpoint, {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8',
      },
      body,
    });
    console.log(`Response from ${endpoint} (more suggestions):`, response);
    recommendations.value = {
      ...recommendations.value,
      [type]: type === 'insight' ? response.recommendations.insight : response.recommendations[type],
    };
    toast.success(`Đã tải thêm gợi ý ${type === 'food' ? 'món ăn' : type === 'drink' ? 'đồ uống' : 'insight'} thành công!`, {
      position: 'top-center',
    });
    await checkAuthAndAccess();
    await checkAuthAndAccessMore();
  } catch (error) {
    console.error('Error loading more recommendations:', error);
    errors.value.general = error.data?.message || 'Có lỗi khi tải thêm gợi ý!';
    toast.error(errors.value.general, { position: 'top-center' });
  } finally {
    loadingMore.value = false;
  }
};

// Load dữ liệu khi component được mount
onMounted(() => {
  console.log('Component mounted, isStoreInitialized:', userStore.isStoreInitialized);
  if (userStore.isStoreInitialized) {
    initializeAuth();
    fetchUserData();
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.action-button {
  @apply px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white transition-all duration-300 shadow-md whitespace-nowrap flex items-center justify-center;
}

.action-button.inline {
  @apply mx-1;
}
</style>
```