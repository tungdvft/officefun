<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-white bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">Chọn ngày cưới theo thần số học</h2>
          <p class="text-pink-100 mt-1">Tìm ngày tốt nhất cho hạnh phúc lứa đôi của bạn</p>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Form nhập liệu -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="brideName" class="form-label">Tên cô dâu</label>
          <input v-model="formData.brideName" type="text" id="brideName" placeholder="Nguyễn Thị A" class="form-input" />
        </div>
        <div>
          <label for="brideBirthdate" class="form-label">Ngày sinh cô dâu (dd/mm/yyyy)</label>
          <div class="relative">
            <input v-model="formData.brideBirthdate" type="text" id="brideBirthdate" placeholder="15/03/1995" class="form-input pl-10" />
            <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="groomName" class="form-label">Tên chú rể</label>
          <input v-model="formData.groomName" type="text" id="groomName" placeholder="Trần Văn B" class="form-input" />
        </div>
        <div>
          <label for="groomBirthdate" class="form-label">Ngày sinh chú rể (dd/mm/yyyy)</label>
          <div class="relative">
            <input v-model="formData.groomBirthdate" type="text" id="groomBirthdate" placeholder="22/07/1994" class="form-input pl-10" />
            <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="startDate" class="form-label">Từ ngày (dd/mm/yyyy)</label>
          <div class="relative">
            <input v-model="formData.startDate" type="text" id="startDate" placeholder="01/06/2025" class="form-input pl-10" />
            <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div>
          <label for="endDate" class="form-label">Đến ngày (dd/mm/yyyy)</label>
          <div class="relative">
            <input v-model="formData.endDate" type="text" id="endDate" placeholder="30/06/2025" class="form-input pl-10" />
            <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <button @click="fetchWeddingDates" :disabled="loading" class="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none">
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang tìm ngày tốt...
        </span>
        <span v-else>Tìm ngày cưới tốt nhất</span>
      </button>

      <!-- Kết quả -->
      <transition name="fade-slide">
        <div v-if="result?.numerology" class="mt-6 space-y-6">
          <!-- Thông tin cặp đôi -->
          <div class="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-100">
            <h3 class="text-xl font-bold text-pink-800 mb-4">Thông số thần số học</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white p-4 rounded-lg shadow-sm">
                <h4 class="text-lg font-semibold text-pink-700 mb-2 flex items-center">
                  <svg class="w-5 h-5 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <h4 class="text-lg font-semibold text-pink-700 mb-2 flex items-center">
                  <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <h3 class="text-xl font-bold text-pink-800 mb-4">Ngày cưới đề xuất</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(suggestion, index) in result.numerology.suggestions" :key="index" 
                   class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="text-center mb-3">
                  <div class="text-3xl font-bold text-pink-600">{{ suggestion.dayNumber }}</div>
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
          <div class="bg-rose-50 p-6 rounded-xl border border-rose-100">
            <h4 class="text-lg font-semibold text-rose-700 mb-3 flex items-center">
              <svg class="w-5 h-5 text-rose-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Lời khuyên từ chuyên gia
            </h4>
            <p class="text-gray-700 whitespace-pre-wrap">{{ result.numerology.advice }}</p>
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
            <button @click="downloadResult" class="btn-share bg-gray-600 hover:bg-gray-700">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Lưu PDF
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

const formData = ref({
  brideName: '',
  brideBirthdate: '',
  groomName: '',
  groomBirthdate: '',
  startDate: '',
  endDate: ''
});

const result = ref(null);
const loading = ref(false);

const fetchWeddingDates = async () => {
  if (!formData.value.brideName) return toast.error('Vui lòng nhập tên cô dâu!', { position: 'top-center' });
  if (!formData.value.brideBirthdate) return toast.error('Vui lòng nhập ngày sinh cô dâu!', { position: 'top-center' });
  if (!formData.value.groomName) return toast.error('Vui lòng nhập tên chú rể!', { position: 'top-center' });
  if (!formData.value.groomBirthdate) return toast.error('Vui lòng nhập ngày sinh chú rể!', { position: 'top-center' });
  if (!formData.value.startDate) return toast.error('Vui lòng nhập ngày bắt đầu!', { position: 'top-center' });
  if (!formData.value.endDate) return toast.error('Vui lòng nhập ngày kết thúc!', { position: 'top-center' });

  loading.value = true;
  try {
    const response = await $fetch('/api/numerology/wedding-date', {
      method: 'POST',
      body: formData.value
    });
    result.value = response; // Lưu response gốc vì dữ liệu nằm trong "numerology"
    toast.success('Đã tìm thấy ngày cưới tốt nhất!', { position: 'top-center' });
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.data?.message || 'Có lỗi xảy ra khi tìm ngày cưới!', { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};

const shareResult = (platform) => {
  if (!result.value?.numerology) return;
  const text = [
    `Kết quả chọn ngày cưới cho ${formData.value.brideName} và ${formData.value.groomName}`,
    `Thông số thần số học:`,
    `- Cô dâu ${formData.value.brideName}: Đường đời ${result.value.numerology.bride.lifePath}, Linh hồn ${result.value.numerology.bride.soul}, Định mệnh ${result.value.numerology.bride.destiny}`,
    `- Chú rể ${formData.value.groomName}: Đường đời ${result.value.numerology.groom.lifePath}, Linh hồn ${result.value.numerology.groom.soul}, Định mệnh ${result.value.numerology.groom.destiny}`,
    `Ngày cưới đề xuất:`,
    ...result.value.numerology.suggestions.map(s => `- ${s.date} (Số ${s.dayNumber}, Điểm ${s.compatibilityScore}/10): ${s.desc}`),
    `Lời khuyên: ${result.value.numerology.advice}`
  ].join('\n\n');

  if (platform === 'facebook' && process.client) {
    if (typeof FB !== 'undefined') {
      FB.ui({
        method: 'share',
        href: window.location.href,
        quote: text
      }, (response) => {
        if (response && !response.error) toast.success('Đã chia sẻ lên Facebook!');
        else toast.error('Có lỗi khi chia sẻ lên Facebook!');
      });
    } else {
      toast.error('Facebook SDK chưa tải, thử lại sau!');
    }
  } else if (platform === 'zalo' && process.client) {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Đã sao chép kết quả! Dán vào Zalo để chia sẻ.');
    }).catch(() => toast.error('Không thể sao chép!'));
  }
};

const downloadResult = async () => {
  if (!process.client || !result.value?.numerology) return toast.error('Không thể tải PDF!');
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.setFont('helvetica');
  doc.setFontSize(12);

  const content = [
    `Kết quả chọn ngày cưới cho ${formData.value.brideName} và ${formData.value.groomName}`,
    `\nThông số thần số học:`,
    `- Cô dâu ${formData.value.brideName}:`,
    `  Đường đời: ${result.value.numerology.bride.lifePath}`,
    `  Linh hồn: ${result.value.numerology.bride.soul}`,
    `  Định mệnh: ${result.value.numerology.bride.destiny}`,
    `- Chú rể ${formData.value.groomName}:`,
    `  Đường đời: ${result.value.numerology.groom.lifePath}`,
    `  Linh hồn: ${result.value.numerology.groom.soul}`,
    `  Định mệnh: ${result.value.numerology.groom.destiny}`,
    `\nNgày cưới đề xuất:`,
    ...result.value.numerology.suggestions.map(s => `- ${s.date} (Số ${s.dayNumber}, Điểm ${s.compatibilityScore}/10):\n  ${s.desc}`),
    `\nLời khuyên:\n${result.value.numerology.advice}`
  ].join('\n');

  const lines = doc.splitTextToSize(content, 180);
  doc.text(lines, 10, 10);
  doc.save(`ngay-cuoi-${formData.value.brideName}-${formData.value.groomName}.pdf`);
};
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.form-label {
  @apply block text-gray-700 font-medium mb-1;
}

.form-input {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200;
}

.btn-primary {
  @apply bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-rose-700 disabled:opacity-70 disabled:cursor-not-allowed transition duration-200 shadow-md font-medium;
}

.btn-share {
  @apply text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 shadow-sm;
}
</style>