<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header với gradient -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-white bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">Đặt tên con theo Thần số học</h2>
          <p class="text-purple-100 mt-1">Tìm tên phù hợp với vận mệnh và năng lượng của bé</p>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Form nhập liệu -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Thông tin mẹ -->
        <div class="bg-purple-50 p-5 rounded-lg border border-purple-100">
          <h3 class="text-lg font-semibold text-purple-700 mb-4 flex items-center">
            <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Thông tin mẹ
          </h3>
          <div class="space-y-4">
            <div>
              <label for="motherName" class="form-label">Họ và tên</label>
              <input
                v-model="formData.motherName"
                type="text"
                id="motherName"
                placeholder="Nguyễn Thị A"
                class="form-input"
              />
            </div>
            <div>
              <label for="motherBirthdate" class="form-label">Ngày sinh</label>
              <div class="relative">
                <input
                  v-model="formData.motherBirthdate"
                  type="text"
                  id="motherBirthdate"
                  placeholder="15/08/1995"
                  class="form-input pl-10"
                />
                <!-- <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg> -->
              </div>
            </div>
          </div>
        </div>

        <!-- Thông tin bố -->
        <div class="bg-blue-50 p-5 rounded-lg border border-blue-100">
          <h3 class="text-lg font-semibold text-blue-700 mb-4 flex items-center">
            <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Thông tin bố
          </h3>
          <div class="space-y-4">
            <div>
              <label for="fatherName" class="form-label">Họ và tên</label>
              <input
                v-model="formData.fatherName"
                type="text"
                id="fatherName"
                placeholder="Trần Văn B"
                class="form-input"
              />
            </div>
            <div>
              <label for="fatherBirthdate" class="form-label">Ngày sinh</label>
              <div class="relative">
                <input
                  v-model="formData.fatherBirthdate"
                  type="text"
                  id="fatherBirthdate"
                  placeholder="14/03/1990"
                  class="form-input pl-10"
                />
                <!-- <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg> -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Thông tin bé -->
      <div class="bg-pink-50 p-5 rounded-lg border border-pink-100">
        <h3 class="text-lg font-semibold text-pink-700 mb-4 flex items-center">
          <svg class="w-5 h-5 text-pink-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Thông tin bé
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label for="babyBirthdate" class="form-label">Ngày sinh (nếu có)</label>
            <div class="relative">
              <input
                v-model="formData.babyBirthdate"
                type="text"
                id="babyBirthdate"
                placeholder="01/01/2023"
                class="form-input pl-10"
              />
              <!-- <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg> -->
            </div>
          </div>
          <div>
            <label for="gender" class="form-label">Giới tính</label>
            <select
              v-model="formData.gender"
              id="gender"
              class="form-input"
            >
              <option value="male">Bé trai</option>
              <option value="female">Bé gái</option>
              <option value="neutral">Trung tính</option>
            </select>
          </div>
          <div>
            <label for="babyBirthMonth" class="form-label">Tháng sinh (1-12)</label>
            <input
              v-model.number="formData.babyBirthMonth"
              type="number"
              id="babyBirthMonth"
              min="1"
              max="12"
              placeholder="Nhập tháng (1-12)"
              class="form-input"
            />
          </div>
        </div>
        <div class="mt-4">
          <label for="additionalRequest" class="form-label">Yêu cầu thêm (tùy chọn)</label>
          <textarea
            v-model="formData.additionalRequest"
            id="additionalRequest"
            rows="2"
            placeholder="Ví dụ: Tên có chữ Minh, theo họ mẹ..."
            class="form-input"
          ></textarea>
        </div>
      </div>

      <button
        @click="suggestBabyName"
        :disabled="loading"
        class="w-full btn-primary"
      >
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang phân tích...
        </span>
        <span v-else class="flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Đề xuất tên con
        </span>
      </button>

      <!-- Kết quả -->
      <transition name="fade-slide">
        <div v-if="result" class="mt-6 space-y-6">
          <!-- Phân tích -->
          <div class="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
            <h3 class="text-xl font-bold text-purple-900 mb-4">Phân tích tổng quan</h3>
            <div class="prose prose-purple max-w-none">
              <p class="whitespace-pre-wrap">{{ result.analysis }}</p>
            </div>
          </div>

          <!-- Tên đề xuất -->
          <div>
            <h3 class="text-xl font-bold text-purple-900 mb-4">Tên đề xuất cho bé</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                v-for="(name, index) in result.names" 
                :key="index"
                class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div class="flex items-start mb-4">
                  <span class="w-10 h-10 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full font-bold mr-3">
                    {{ index + 1 }}
                  </span>
                  <div>
                    <h4 class="text-lg font-semibold text-gray-800" v-html="marked(name.name)"></h4>
                    <div class="flex items-center mt-1">
                      <span 
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          name.matchScore > 8 ? 'bg-green-100 text-green-800' :
                          name.matchScore > 6 ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        ]"
                      >
                        Độ phù hợp: {{ name.matchScore || 'Cao' }}/10
                      </span>
                    </div>
                  </div>
                </div>
                <p class="text-gray-700">{{ name.meaning }}</p>
              </div>
            </div>
          </div>

          <!-- Lời khuyên -->
          <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 class="text-xl font-bold text-indigo-800 mb-4 flex items-center">
              <svg class="w-6 h-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Lời khuyên hữu ích
            </h3>
            <ul class="space-y-3">
              <li v-for="(tip, index) in result.tips" :key="index" class="flex items-start">
                <svg class="flex-shrink-0 h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-700">{{ tip }}</span>
              </li>
            </ul>
          </div>

          <!-- Nút chia sẻ -->
          <div class="flex flex-wrap gap-3 justify-center">
            <button @click="shareResult('zalo')" class="btn-share bg-blue-500 hover:bg-blue-600">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"/>
              </svg>
              Chia sẻ Zalo
            </button>
            <button @click="shareResult('facebook')" class="btn-share bg-blue-600 hover:bg-blue-700">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
              Chia sẻ Facebook
            </button>
            <ClientOnly>
              <button @click="downloadResult" class="btn-share bg-gray-600 hover:bg-gray-700">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Tải kết quả
              </button>
            </ClientOnly>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import { marked } from 'marked';

const formData = ref({
  motherName: '',
  motherBirthdate: '',
  fatherName: '',
  fatherBirthdate: '',
  babyBirthdate: '',
  gender: 'neutral',
  babyBirthMonth: null,
  additionalRequest: ''
});
const result = ref(null);
const loading = ref(false);

const suggestBabyName = async () => {
  if (!formData.value.motherName) {
    toast.error('Vui lòng nhập họ và tên mẹ!', { position: 'top-center' });
    return;
  }
  if (!formData.value.motherBirthdate) {
    toast.error('Vui lòng nhập ngày sinh mẹ!', { position: 'top-center' });
    return;
  }
  if (!formData.value.fatherName) {
    toast.error('Vui lòng nhập họ và tên bố!', { position: 'top-center' });
    return;
  }
  if (!formData.value.fatherBirthdate) {
    toast.error('Vui lòng nhập ngày sinh bố!', { position: 'top-center' });
    return;
  }

  loading.value = true;
  try {
    const username = localStorage.getItem('username') || 'guest';
    const encodedUsername = encodeURIComponent(username);
    const response = await fetch('/api/numerology/baby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-username': encodedUsername,
      },
      body: JSON.stringify({
        motherName: formData.value.motherName,
        motherBirthdate: formData.value.motherBirthdate,
        fatherName: formData.value.fatherName,
        fatherBirthdate: formData.value.fatherBirthdate,
        babyBirthdate: formData.value.babyBirthdate || '',
        gender: formData.value.gender,
        babyBirthMonth: formData.value.babyBirthMonth || null,
        additionalRequest: formData.value.additionalRequest || ''
      }),
    });

    if (response.ok) {
      const data = await response.json();
      result.value = data;
      toast.success('Đề xuất tên con đã hoàn tất!', { position: 'top-center' });
    } else {
      const errorData = await response.json();
      toast.error(`Không thể đề xuất tên con: ${errorData.statusMessage || 'Lỗi không xác định'}`, { position: 'top-center' });
    }
  } catch (error) {
    console.error('Error suggesting baby name:', error);
    toast.error('Có lỗi xảy ra khi đề xuất tên con!', { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};
</script>

<style>
/* Animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Form styles */
.form-label {
  @apply block text-gray-700 font-medium mb-1.5 text-sm;
}

.form-input {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-sm;
}

.btn-primary {
  @apply bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition duration-200 shadow-md font-medium text-sm;
}

.btn-share {
  @apply text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 text-sm;
}

/* Prose style for markdown content */
.prose-purple strong {
  @apply text-purple-600 font-semibold;
}
</style>