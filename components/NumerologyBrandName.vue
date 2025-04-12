<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-white bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">Đặt tên thương hiệu theo Thần số học</h2>
          <p class="text-teal-100 mt-1">Tạo tên thương hiệu phù hợp với năng lượng số của bạn</p>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Form nhập liệu -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="industry" class="form-label">Ngành nghề</label>
          <input v-model="formData.industry" type="text" id="industry" placeholder="Ví dụ: Công nghệ, Thời trang" class="form-input" />
        </div>
        <div>
          <label for="date" class="form-label">Ngày thành lập/sinh (dd/mm/yyyy)</label>
          <div class="relative">
            <input v-model="formData.date" type="text" id="date" placeholder="15/03/2020" class="form-input pl-10" />
            <!-- <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg> -->
          </div>
        </div>
      </div>

      <div>
        <label for="ownerName" class="form-label">Tên chủ thương hiệu</label>
        <input v-model="formData.ownerName" type="text" id="ownerName" placeholder="Nguyễn Văn A" class="form-input" />
      </div>

      <div>
        <label for="extraRequest" class="form-label">Yêu cầu bổ sung (tùy chọn)</label>
        <textarea v-model="formData.extraRequest" id="extraRequest" rows="3" placeholder="Ví dụ: Có chữ 'hot', ngắn gọn, sang trọng..." class="form-input"></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="form-group">
          <label class="form-label">Giới tính founder (nếu dùng ngày sinh)</label>
          <div class="flex flex-wrap gap-4">
            <label class="radio-option">
              <input type="radio" v-model="formData.gender" value="male" class="radio-input" />
              <span class="radio-label">Nam</span>
            </label>
            <label class="radio-option">
              <input type="radio" v-model="formData.gender" value="female" class="radio-input" />
              <span class="radio-label">Nữ</span>
            </label>
            <label class="radio-option">
              <input type="radio" v-model="formData.gender" value="none" class="radio-input" />
              <span class="radio-label">Không áp dụng</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Ngôn ngữ tên thương hiệu</label>
          <div class="flex flex-wrap gap-4">
            <label class="radio-option">
              <input type="radio" v-model="formData.language" value="english" class="radio-input" />
              <span class="radio-label">Tiếng Anh</span>
            </label>
            <label class="radio-option">
              <input type="radio" v-model="formData.language" value="vietnamese" class="radio-input" />
              <span class="radio-label">Tiếng Việt</span>
            </label>
          </div>
        </div>
      </div>

      <button @click="generateReport" :disabled="loading" class="w-full btn-primary">
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang phân tích...
        </span>
        <span v-else>Tạo gợi ý tên thương hiệu</span>
      </button>

      <!-- Kết quả -->
      <transition name="fade-slide">
        <div v-if="numerologyData" class="mt-6 space-y-8">
          <!-- Thông tin đầu vào -->
          <div class="bg-teal-50 p-6 rounded-xl border border-teal-100">
            <h3 class="text-xl font-bold text-teal-800 mb-4">Thông tin thương hiệu</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><p class="text-sm text-gray-500">Ngành nghề</p><p class="font-medium">{{ formData.industry }}</p></div>
              <div><p class="text-sm text-gray-500">Ngày</p><p class="font-medium">{{ formData.date }}</p></div>
              <div><p class="text-sm text-gray-500">Tên chủ</p><p class="font-medium">{{ formData.ownerName }}</p></div>
              <div><p class="text-sm text-gray-500">Yêu cầu</p><p class="font-medium">{{ formData.extraRequest || 'Không có' }}</p></div>
              <div><p class="text-sm text-gray-500">Giới tính</p><p class="font-medium">{{ formData.gender === 'none' ? 'Không áp dụng' : formData.gender === 'male' ? 'Nam' : 'Nữ' }}</p></div>
              <div><p class="text-sm text-gray-500">Ngôn ngữ</p><p class="font-medium">{{ formData.language === 'english' ? 'Tiếng Anh' : 'Tiếng Việt' }}</p></div>
            </div>
          </div>

          <!-- Các con số chính -->
          <div>
            <h3 class="text-xl font-bold text-teal-800 mb-4">Các con số chính</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div class="flex items-center mb-2">
                  <span class="text-3xl font-bold text-teal-600 mr-3">{{ numerologyData.lifePath }}</span>
                  <div>
                    <h4 class="font-semibold text-gray-800">Số chủ đạo</h4>
                    <p class="text-sm text-gray-500">Con số đường đời</p>
                  </div>
                </div>
                <p class="text-gray-700">{{ numerologyData.lifePathDesc }}</p>
              </div>
              <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div class="flex items-center mb-2">
                  <span class="text-3xl font-bold text-teal-600 mr-3">{{ numerologyData.soul }}</span>
                  <div>
                    <h4 class="font-semibold text-gray-800">Số linh hồn</h4>
                    <p class="text-sm text-gray-500">Mong muốn nội tâm</p>
                  </div>
                </div>
                <p class="text-gray-700">{{ numerologyData.soulDesc }}</p>
              </div>
              <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div class="flex items-center mb-2">
                  <span class="text-3xl font-bold text-teal-600 mr-3">{{ numerologyData.personality }}</span>
                  <div>
                    <h4 class="font-semibold text-gray-800">Số nhân cách</h4>
                    <p class="text-sm text-gray-500">Phong cách bên ngoài</p>
                  </div>
                </div>
                <p class="text-gray-700">{{ numerologyData.personalityDesc }}</p>
              </div>
              <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div class="flex items-center mb-2">
                  <span class="text-3xl font-bold text-teal-600 mr-3">{{ numerologyData.destiny }}</span>
                  <div>
                    <h4 class="font-semibold text-gray-800">Số định mệnh</h4>
                    <p class="text-sm text-gray-500">Sứ mệnh thương hiệu</p>
                  </div>
                </div>
                <p class="text-gray-700">{{ numerologyData.destinyDesc }}</p>
              </div>
            </div>
          </div>

          <!-- Phân tích tổng quan -->
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="text-xl font-bold text-teal-800 mb-4">Phân tích tổng quan</h3>
            <p class="text-gray-700 whitespace-pre-line">{{ numerologyData.generalAnalysis }}</p>
          </div>

          <!-- Gợi ý tên thương hiệu -->
          <div>
            <h3 class="text-xl font-bold text-teal-800 mb-4">Gợi ý tên thương hiệu</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="(suggestion, index) in numerologyData.suggestions" :key="index" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-start mb-4">
                  <span class="w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold mr-3">{{ index + 1 }}</span>
                  <div>
                    <h4 class="text-lg font-semibold text-gray-800">{{ suggestion.name }}</h4>
                    <p class="text-sm text-gray-500">Số linh hồn: {{ suggestion.soul }} | Số định mệnh: {{ suggestion.destiny }}</p>
                  </div>
                </div>
                <p class="text-gray-700 mb-4">{{ suggestion.desc }}</p>
                <div class="p-4 bg-teal-50 rounded-lg">
                  <p class="font-medium text-teal-700">Gợi ý logo:</p>
                  <p class="text-gray-700">{{ suggestion.logoSuggestion }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Lời khuyên -->
          <div class="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
            <h3 class="text-xl font-bold text-emerald-800 mb-4 flex items-center">
              <svg class="w-6 h-6 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Lời khuyên phát triển thương hiệu
            </h3>
            <p class="text-gray-700 whitespace-pre-line">{{ numerologyData.brandAdvice }}</p>
          </div>

          <!-- Nút tải và chia sẻ -->
          <!-- <div class="flex flex-wrap gap-3 justify-center">
            <ClientOnly>
              <button @click="downloadPDF" class="btn-share bg-teal-600 hover:bg-teal-700">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Tải báo cáo PDF
              </button>
            </ClientOnly>
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
          </div> -->
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

definePageMeta({ layout: 'dashboard' });

const formData = ref({
  industry: '',
  date: '',
  ownerName: '',
  extraRequest: '',
  gender: 'none',
  language: 'english' // Mặc định là tiếng Anh
});
const numerologyData = ref(null);
const loading = ref(false);

const generateReport = async () => {
  if (!formData.value.industry) return toast.error('Vui lòng nhập ngành nghề!', { position: 'top-center' });
  if (!formData.value.date) return toast.error('Vui lòng nhập ngày thành lập hoặc ngày sinh!', { position: 'top-center' });
  if (!formData.value.ownerName) return toast.error('Vui lòng nhập tên chủ thương hiệu!', { position: 'top-center' });

  loading.value = true;
  try {
    const username = localStorage.getItem('username') || 'guest';
    const response = await $fetch('/api/numerology/brand', {
      method: 'POST',
      headers: { 'x-username': encodeURIComponent(username) },
      body: { ...formData.value, extraRequest: `${formData.value.extraRequest || ''} Tên bằng ${formData.value.language === 'english' ? 'tiếng Anh' : 'tiếng Việt'}` }
    });
    numerologyData.value = response.numerology;
    toast.success('Tạo gợi ý tên thương hiệu hoàn tất!', { position: 'top-center' });
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.data?.message || 'Có lỗi xảy ra!', { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};

const shareResult = (platform) => {
  if (!numerologyData.value) return;
  const text = [
    `Gợi ý tên thương hiệu cho ${formData.value.ownerName} (${formData.value.industry})`,
    `Số chủ đạo: ${numerologyData.value.lifePath} - ${numerologyData.value.lifePathDesc}`,
    `Số linh hồn: ${numerologyData.value.soul} - ${numerologyData.value.soulDesc}`,
    `Số nhân cách: ${numerologyData.value.personality} - ${numerologyData.value.personalityDesc}`,
    `Số định mệnh: ${numerologyData.value.destiny} - ${numerologyData.value.destinyDesc}`,
    `Phân tích tổng quan: ${numerologyData.value.generalAnalysis}`,
    `Gợi ý tên thương hiệu:`,
    ...numerologyData.value.suggestions.map(s => `- ${s.name} (Số linh hồn: ${s.soul}, Số định mệnh: ${s.destiny}): ${s.desc}\n  Logo: ${s.logoSuggestion}`),
    `Lời khuyên: ${numerologyData.value.brandAdvice}`
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

const downloadPDF = async () => {
  if (!process.client) return toast.error('Không thể tải PDF trên server!');
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.setFont('helvetica');
  doc.setFontSize(12);
  let y = 10;

  doc.setFontSize(16);
  doc.text(`Gợi ý tên thương hiệu cho ${formData.value.ownerName}`, 10, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Ngành nghề: ${formData.value.industry}`, 10, y); y += 7;
  doc.text(`Ngày: ${formData.value.date}`, 10, y); y += 7;
  doc.text(`Tên chủ: ${formData.value.ownerName}`, 10, y); y += 7;
  doc.text(`Yêu cầu: ${formData.value.extraRequest || 'Không có'}`, 10, y); y += 7;
  doc.text(`Giới tính: ${formData.value.gender === 'none' ? 'Không áp dụng' : formData.value.gender === 'male' ? 'Nam' : 'Nữ'}`, 10, y); y += 7;
  doc.text(`Ngôn ngữ: ${formData.value.language === 'english' ? 'Tiếng Anh' : 'Tiếng Việt'}`, 10, y); y += 10;

  const addSection = (title, content) => {
    if (y > 260) { doc.addPage(); y = 10; }
    doc.setFontSize(14);
    doc.text(title, 10, y);
    y += 7;
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 10, y);
    y += lines.length * 7 + 10;
  };

  addSection('Các con số chính', [
    `Số chủ đạo: ${numerologyData.value.lifePath} - ${numerologyData.value.lifePathDesc}`,
    `Số linh hồn: ${numerologyData.value.soul} - ${numerologyData.value.soulDesc}`,
    `Số nhân cách: ${numerologyData.value.personality} - ${numerologyData.value.personalityDesc}`,
    `Số định mệnh: ${numerologyData.value.destiny} - ${numerologyData.value.destinyDesc}`
  ].join('\n'));

  addSection('Phân tích tổng quan', numerologyData.value.generalAnalysis);

  doc.setFontSize(14);
  doc.text('Gợi ý tên thương hiệu:', 10, y); y += 7;
  doc.setFontSize(12);
  numerologyData.value.suggestions.forEach(s => {
    if (y > 260) { doc.addPage(); y = 10; }
    const text = `${s.name} (Số linh hồn: ${s.soul}, Số định mệnh: ${s.destiny})\nMô tả: ${s.desc}\nLogo: ${s.logoSuggestion}`;
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, y);
    y += lines.length * 7 + 5;
  });

  addSection('Lời khuyên phát triển thương hiệu', numerologyData.value.brandAdvice);

  doc.save(`brand-numerology-${formData.value.ownerName}.pdf`);
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
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200;
}

.radio-option {
  @apply flex items-center;
}

.radio-input {
  @apply mr-2;
}

.radio-label {
  @apply text-gray-700;
}

.btn-primary {
  @apply bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition duration-200 shadow-md font-medium;
}

.btn-share {
  @apply text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 shadow-sm;
}
</style>