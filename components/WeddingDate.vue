<template>
  <div class="bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-bold text-blue-800 mb-3">Chọn Ngày Cưới Theo Thần Số Học</h1>
        <p class="text-lg text-gray-600">Tìm ngày tốt nhất cho hạnh phúc lứa đôi của bạn</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-10 border border-gray-100">
        <div class="flex items-center mb-4">
          <span class="bg-purple-100 p-2 rounded-full mr-2">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <h2 class="text-xl font-semibold text-purple-700">Thông tin cô dâu và chú rể</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Thông tin cô dâu -->
          <div class="space-y-4">
            <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
              <h3 class="text-sm font-medium text-purple-700 mb-3 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </span>
                Thông tin cô dâu
              </h3>
              <div>
                <label for="brideName" class="block text-sm font-medium text-gray-700 mb-4">Tên cô dâu</label>
                <input
                  v-model="formData.brideName"
                  type="text"
                  id="brideName"
                  placeholder="VD: Nguyễn Thị A"
                  :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base', errors.brideName ? 'border-red-500' : 'border-gray-300']"
                />
                <p v-if="errors.brideName" class="text-red-600 text-sm mt-1">{{ errors.brideName }}</p>
              </div>
              <div>
                <label for="brideBirthdate" class="block text-sm font-medium text-gray-700 mb-4">Ngày sinh cô dâu (DD/MM/YYYY)</label>
                <input
                  v-model="formData.brideBirthdate"
                  type="text"
                  id="brideBirthdate"
                  placeholder="VD: 15/03/1995"
                  :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-   focus:ring-purple-500 focus:border-purple-500 transition text-base', errors.brideBirthdate ? 'border-red-500' : 'border-gray-300']"
                />
                <p v-if="errors.brideBirthdate" class="text-red-600 text-sm mt-1">{{ errors.brideBirthdate }}</p>
              </div>
            </div>
          </div>

          <!-- Thông tin chú rể -->
          <div class="space-y-4">
            <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
              <h3 class="text-sm font-medium text-purple-700 mb-3 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </span>
                Thông tin chú rể
              </h3>
              <div>
                <label for="groomName" class="block text-sm font-medium text-gray-700 mb-4">Tên chú rể</label>
                <input
                  v-model="formData.groomName"
                  type="text"
                  id="groomName"
                  placeholder="VD: Trần Văn B"
                  :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base', errors.groomName ? 'border-red-500' : 'border-gray-300']"
                />
                <p v-if="errors.groomName" class="text-red-600 text-sm mt-1">{{ errors.groomName }}</p>
              </div>
              <div>
                <label for="groomBirthdate" class="block text-sm font-medium text-gray-700 mb-4">Ngày sinh chú rể (DD/MM/YYYY)</label>
                <input
                  v-model="formData.groomBirthdate"
                  type="text"
                  id="groomBirthdate"
                  placeholder="VD: 22/07/1994"
                  :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base', errors.groomBirthdate ? 'border-red-500' : 'border-gray-300']"
                />
                <p v-if="errors.groomBirthdate" class="text-red-600 text-sm mt-1">{{ errors.groomBirthdate }}</p>
              </div>
            </div>
          </div>

          <!-- Khoảng thời gian -->
          <div class="space-y-4">
            <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
              <h3 class="text-sm font-medium text-purple-700 mb-3 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                Khoảng thời gian
              </h3>
              <div>
                <label for="startDate" class="block text-sm font-medium text-gray-700 mb-4">Từ ngày (DD/MM/YYYY)</label>
                <input
                  v-model="formData.startDate"
                  type="text"
                  id="startDate"
                  placeholder="VD: 01/06/2025"
                  :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base', errors.startDate ? 'border-red-500' : 'border-gray-300']"
                />
                <p v-if="errors.startDate" class="text-red-600 text-sm mt-1">{{ errors.startDate }}</p>
              </div>
              <div>
                <label for="endDate" class="block text-sm font-medium text-gray-700 mb-4">Đến ngày (DD/MM/YYYY)</label>
                <input
                  v-model="formData.endDate"
                  type="text"
                  id="endDate"
                  placeholder="VD: 30/06/2025"
                  :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base', errors.endDate ? 'border-red-500' : 'border-gray-300']"
                />
                <p v-if="errors.endDate" class="text-red-600 text-sm mt-1">{{ errors.endDate }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Nút tìm ngày -->
        <div class="mt-6 flex justify-center">
          <button
            @click="fetchWeddingDates"
            :disabled="loading"
            class="w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-md disabled:opacity-70"
          >
            <span class="flex items-center justify-center gap-2">
              <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Đang tìm ngày tốt...' : 'Tìm ngày cưới tốt nhất' }}
            </span>
          </button>
        </div>
      </div>

      <!-- Kết quả -->
      <transition name="slide-fade">
        <div v-if="result?.numerology" class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div class="flex items-center mb-4">
            <span class="bg-purple-100 p-2 rounded-full mr-2">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <h2 class="text-xl font-semibold text-purple-700">Kết quả ngày cưới đề xuất</h2>
          </div>

          <!-- Thông tin cặp đôi -->
          <div class="bg-purple-50 p-6 rounded-xl border border-purple-100 mb-6">
            <h3 class="text-xl font-bold text-purple-800 mb-4">Thông số thần số học</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white p-4 rounded-lg shadow-sm">
                <h4 class="text-lg font-semibold text-purple-700 mb-2 flex items-center">
                  <svg class="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cô dâu: {{ formData.brideName }}
                </h4>
                <ul class="space-y-1">
                  <li class="flex justify-between"><span class="text-gray-600">Đường đời:</span> <span class="font-medium">{{ result.numerology.bride.lifePath }}</span></li>
                  <li class="flex justify-between"><span class="text-gray-600">Linh hồn:</span> <span class="font-medium">{{ result.numerology.bride.soul }}</span></li>
                  <li class="flex justify-between"><span class="text-gray-600">Định mệnh:</span> <span class="font-medium">{{ result.numerology.bride.destiny }}</span></li>
                </ul>
              </div>
              <div class="bg-white p-4 rounded-lg shadow-sm">
                <h4 class="text-lg font-semibold text-purple-700 mb-2 flex items-center">
                  <svg class="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Chú rể: {{ formData.groomName }}
                </h4>
                <ul class="space-y-1">
                  <li class="flex justify-between"><span class="text-gray-600">Đường đời:</span> <span class="font-medium">{{ result.numerology.groom.lifePath }}</span></li>
                  <li class="flex justify-between"><span class="text-gray-600">Linh hồn:</span> <span class="font-medium">{{ result.numerology.groom.soul }}</span></li>
                  <li class="flex justify-between"><span class="text-gray-600">Định mệnh:</span> <span class="font-medium">{{ result.numerology.groom.destiny }}</span></li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Ngày đề xuất -->
          <div>
            <h3 class="text-xl font-bold text-purple-800 mb-4">Ngày cưới đề xuất</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(suggestion, index) in result.numerology.suggestions" :key="index" 
                   class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="text-center mb-3">
                  <div class="text-3xl font-bold text-purple-600">{{ suggestion.dayNumber }}</div>
                  <div class="text-lg font-medium text-gray-700">{{ suggestion.date }}</div>
                  <div class="mt-2">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium"
                          :class="{
                            'bg-green-100 text-green-800': suggestion.compatibilityScore >= 8,
                            'bg-yellow-100 text-yellow-800': suggestion.compatibilityScore >= 6 && suggestion.compatibilityScore < 8,
                            'bg-red-100 text-red-800': suggestion.compatibilityScore < 6
                          }">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {{ suggestion.compatibilityScore }}/10
                    </span>
                  </div>
                </div>
                <p class="text-gray-700 text-sm">{{ suggestion.desc }}</p>
              </div>
            </div>
          </div>

          <!-- Lời khuyên -->
          <div class="bg-purple-50 p-6 rounded-xl border border-purple-100 mt-6">
            <h4 class="text-lg font-semibold text-purple-700 mb-3 flex items-center">
              <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Lời khuyên từ chuyên gia
            </h4>
            <p class="text-gray-700 whitespace-pre-wrap">{{ result.numerology.advice }}</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { toast } from 'vue3-toastify';

const formData = ref({
  brideName: '',
  brideBirthdate: '',
  groomName: '',
  groomBirthdate: '',
  startDate: '',
  endDate: ''
});

const errors = ref({
  brideName: '',
  brideBirthdate: '',
  groomName: '',
  groomBirthdate: '',
  startDate: '',
  endDate: ''
});

const result = ref(null);
const loading = ref(false);

// Hàm lưu vào localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('weddingDateSelectorForm', JSON.stringify(formData.value));
  localStorage.setItem('weddingDateSelectorResult', JSON.stringify(result.value));
};

// Hàm tải từ localStorage
const loadFromLocalStorage = () => {
  const savedForm = localStorage.getItem('weddingDateSelectorForm');
  const savedResult = localStorage.getItem('weddingDateSelectorResult');

  if (savedForm) {
    formData.value = JSON.parse(savedForm);
  }
  if (savedResult) {
    result.value = JSON.parse(savedResult);
  }
};

// Tải dữ liệu khi component được mounted
onMounted(() => {
  loadFromLocalStorage();
});

// Theo dõi thay đổi để lưu vào localStorage
watch(formData, () => {
  saveToLocalStorage();
}, { deep: true });

watch(result, () => {
  saveToLocalStorage();
}, { deep: true });

// Hàm validate form
const validateForm = () => {
  errors.value = {
    brideName: '',
    brideBirthdate: '',
    groomName: '',
    groomBirthdate: '',
    startDate: '',
    endDate: ''
  };
  let isValid = true;

  // Kiểm tra trường trống
  if (!formData.value.brideName.trim()) {
    errors.value.brideName = 'Vui lòng nhập tên cô dâu';
    isValid = false;
  }
  if (!formData.value.brideBirthdate.trim()) {
    errors.value.brideBirthdate = 'Vui lòng nhập ngày sinh cô dâu';
    isValid = false;
  }
  if (!formData.value.groomName.trim()) {
    errors.value.groomName = 'Vui lòng nhập tên chú rể';
    isValid = false;
  }
  if (!formData.value.groomBirthdate.trim()) {
    errors.value.groomBirthdate = 'Vui lòng nhập ngày sinh chú rể';
    isValid = false;
  }
  if (!formData.value.startDate.trim()) {
    errors.value.startDate = 'Vui lòng nhập ngày bắt đầu';
    isValid = false;
  }
  if (!formData.value.endDate.trim()) {
    errors.value.endDate = 'Vui lòng nhập ngày kết thúc';
    isValid = false;
  }

  // Kiểm tra định dạng ngày
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const validateDate = (dateStr, field) => {
    if (!dateStr) return true;
    const match = dateStr.match(dateRegex);
    if (!match) {
      errors.value[field] = 'Ngày không đúng định dạng DD/MM/YYYY';
      return false;
    }
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    const date = new Date(year, month - 1, day);
    if (
      date.getDate() !== day ||
      date.getMonth() + 1 !== month ||
      date.getFullYear() !== year ||
      year < 1900 ||
      (field === 'startDate' || field === 'endDate' ? year > new Date().getFullYear() + 5 : year > new Date().getFullYear())
    ) {
      errors.value[field] = 'Ngày không hợp lệ';
      return false;
    }
    return true;
  };

  if (formData.value.brideBirthdate && !validateDate(formData.value.brideBirthdate, 'brideBirthdate')) {
    isValid = false;
  }
  if (formData.value.groomBirthdate && !validateDate(formData.value.groomBirthdate, 'groomBirthdate')) {
    isValid = false;
  }
  if (formData.value.startDate && !validateDate(formData.value.startDate, 'startDate')) {
    isValid = false;
  }
  if (formData.value.endDate && !validateDate(formData.value.endDate, 'endDate')) {
    isValid = false;
  }

  // Kiểm tra startDate < endDate
  if (formData.value.startDate && formData.value.endDate) {
    const startMatch = formData.value.startDate.match(dateRegex);
    const endMatch = formData.value.endDate.match(dateRegex);
    if (startMatch && endMatch) {
      const startDate = new Date(parseInt(startMatch[3]), parseInt(startMatch[2]) - 1, parseInt(startMatch[1]));
      const endDate = new Date(parseInt(endMatch[3]), parseInt(endMatch[2]) - 1, parseInt(endMatch[1]));
      if (startDate > endDate) {
        errors.value.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
        isValid = false;
      }
    }
  }

  return isValid;
};

const fetchWeddingDates = async () => {
  if (!validateForm()) return;

  loading.value = true;
  try {
    const response = await $fetch('/api/numerology/wedding-date', {
      method: 'POST',
      body: formData.value
    });
    result.value = response;
    toast.success('Đã tìm thấy ngày cưới tốt nhất!', { position: 'top-center' });
  } catch (error) {
    console.error('Error:', error);
    errors.value.brideName = error.data?.message || 'Có lỗi xảy ra khi tìm ngày cưới';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
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

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  h1 {
    font-size: 1.875rem;
  }
}
</style>