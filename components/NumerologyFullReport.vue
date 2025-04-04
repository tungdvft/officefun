<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header với gradient -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-white bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">Thần số học trọn đời</h2>
          <p class="text-teal-100 mt-1">Khám phá con số định mệnh và các giai đoạn cuộc đời bạn</p>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Form nhập liệu -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="name" class="form-label">Họ và tên</label>
          <input
            v-model="formData.name"
            type="text"
            id="name"
            placeholder="Nguyễn Văn A"
            class="form-input"
          />
        </div>
        <div>
          <label for="birthdate" class="form-label">Ngày sinh (dd/mm/yyyy)</label>
          <div class="relative">
            <input
              v-model="formData.birthdate"
              type="text"
              id="birthdate"
              placeholder="15/03/1995"
              class="form-input pl-10"
            />
            <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Giới tính</label>
        <div class="flex space-x-6">
          <label class="radio-option">
            <input type="radio" v-model="formData.gender" value="male" class="radio-input" />
            <span class="radio-label">Nam</span>
          </label>
          <label class="radio-option">
            <input type="radio" v-model="formData.gender" value="female" class="radio-input" />
            <span class="radio-label">Nữ</span>
          </label>
        </div>
      </div>

      <button
        @click="generateReport"
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
        <span v-else>
          Xem báo cáo Thần số học
        </span>
      </button>

      <!-- Kết quả báo cáo -->
      <transition name="fade-slide">
        <div v-if="numerologyData" class="mt-6 space-y-8">
          <!-- Thông tin cá nhân -->
          <div class="bg-teal-50 p-6 rounded-xl border border-teal-100">
            <h3 class="text-xl font-bold text-teal-800 mb-4">Thông tin cá nhân</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Họ và tên</p>
                <p class="font-medium">{{ formData.name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Ngày sinh</p>
                <p class="font-medium">{{ formData.birthdate }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Giới tính</p>
                <p class="font-medium">{{ formData.gender === 'male' ? 'Nam' : 'Nữ' }}</p>
              </div>
            </div>
          </div>

          <!-- Các con số chính -->
          <div>
            <h3 class="text-xl font-bold text-teal-800 mb-4">Các con số chính</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <p class="text-sm text-gray-500">Con số mong muốn nội tâm</p>
                  </div>
                </div>
                <p class="text-gray-700">{{ numerologyData.soulDesc }}</p>
              </div>

              <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div class="flex items-center mb-2">
                  <span class="text-3xl font-bold text-teal-600 mr-3">{{ numerologyData.personality }}</span>
                  <div>
                    <h4 class="font-semibold text-gray-800">Số nhân cách</h4>
                    <p class="text-sm text-gray-500">Ấn tượng bạn tạo ra</p>
                  </div>
                </div>
                <p class="text-gray-700">{{ numerologyData.personalityDesc }}</p>
              </div>

              <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div class="flex items-center mb-2">
                  <span class="text-3xl font-bold text-teal-600 mr-3">{{ numerologyData.destiny }}</span>
                  <div>
                    <h4 class="font-semibold text-gray-800">Số định mệnh</h4>
                    <p class="text-sm text-gray-500">Sứ mệnh cuộc đời</p>
                  </div>
                </div>
                <p class="text-gray-700">{{ numerologyData.destinyDesc }}</p>
              </div>
            </div>
          </div>

          <!-- Các giai đoạn cuộc đời -->
          <div>
            <h3 class="text-xl font-bold text-teal-800 mb-4">Các giai đoạn cuộc đời</h3>
            <div class="space-y-6">
              <div v-for="(period, index) in lifePeriods" :key="index" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div class="flex items-center mb-4">
                  <span class="w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold mr-3">{{ period.age }}</span>
                  <h4 class="text-lg font-semibold text-gray-800">{{ period.title }}</h4>
                </div>
                <div class="prose prose-teal max-w-none">
                  <p class="text-gray-700">{{ period.content }}</p>
                  <div class="mt-4 p-4 bg-teal-50 rounded-lg">
                    <p class="font-medium text-teal-700">Lời khuyên:</p>
                    <p class="text-gray-700">{{ period.advice }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Nút tải và chia sẻ -->
          <div class="flex flex-wrap gap-3 justify-center mt-8">
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
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

// Chỉ import jspdf ở client-side
const jspdf = process.client ? await import('jspdf').then(module => module.jsPDF) : null;

const formData = ref({
  name: '',
  birthdate: '',
  gender: 'male'
});
const numerologyData = ref(null);
const loading = ref(false);

const generateReport = async () => {
  if (!formData.value.name) {
    toast.error('Vui lòng nhập họ và tên!');
    return;
  }
  if (!formData.value.birthdate) {
    toast.error('Vui lòng nhập ngày sinh!');
    return;
  }
  if (!formData.value.gender) {
    toast.error('Vui lòng chọn giới tính!');
    return;
  }

  loading.value = true;
  try {
    const response = await $fetch('/api/numerology/full', {
      method: 'POST',
      body: {
        name: formData.value.name,
        birthdate: formData.value.birthdate,
        gender: formData.value.gender
      },
    });

    numerologyData.value = response.numerology;
    toast.success('Tạo báo cáo Thần số học hoàn tất!');
  } catch (error) {
    console.error('Error:', error);
    toast.error('Không thể tạo báo cáo!');
  } finally {
    loading.value = false;
  }
};

const downloadPDF = () => {
  if (!process.client || !jspdf || !numerologyData.value) {
    toast.error('Không thể tải PDF trên server-side hoặc chưa có dữ liệu!');
    return;
  }
  const doc = new jspdf();
  doc.setFont('times'); // Font mặc định hỗ trợ tiếng Việt
  doc.setFontSize(12);
  let y = 10;

  // Tiêu đề
  doc.setFontSize(16);
  doc.text('Thần số học trọn đời', 10, y);
  y += 10;

  // Thông tin cá nhân
  doc.setFontSize(12);
  doc.text(`Họ và tên: ${formData.value.name}`, 10, y);
  y += 7;
  doc.text(`Ngày sinh: ${formData.value.birthdate}`, 10, y);
  y += 7;
  doc.text(`Giới tính: ${formData.value.gender === 'male' ? 'Nam' : 'Nữ'}`, 10, y);
  y += 10;

  // Các con số chính
  doc.text('Các con số chính:', 10, y);
  y += 7;
  doc.text(`Số chủ đạo: ${numerologyData.value.lifePath} - ${numerologyData.value.lifePathDesc}`, 10, y);
  y += 7;
  doc.text(`Số linh hồn: ${numerologyData.value.soul} - ${numerologyData.value.soulDesc}`, 10, y);
  y += 7;
  doc.text(`Số nhân cách: ${numerologyData.value.personality} - ${numerologyData.value.personalityDesc}`, 10, y);
  y += 7;
  doc.text(`Số định mệnh: ${numerologyData.value.destiny} - ${numerologyData.value.destinyDesc}`, 10, y);
  y += 10;

  // Diễn giải từng giai đoạn
  const addSection = (title, content, advice) => {
    if (y > 260) { // Nếu vượt quá trang, thêm trang mới
      doc.addPage();
      y = 10;
    }
    doc.setFontSize(14);
    doc.text(title, 10, y);
    y += 7;
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 10, y);
    y += lines.length * 7 + 5;

    doc.text('Lời khuyên:', 10, y);
    y += 7;
    const adviceLines = doc.splitTextToSize(advice, 180);
    doc.text(adviceLines, 10, y);
    y += adviceLines.length * 7 + 10;
  };

  addSection('0-10 tuổi', numerologyData.value.age0_10, numerologyData.value.age0_10Advice);
  addSection('10-20 tuổi', numerologyData.value.age10_20, numerologyData.value.age10_20Advice);
  addSection('20-30 tuổi', numerologyData.value.age20_30, numerologyData.value.age20_30Advice);
  addSection('30-40 tuổi', numerologyData.value.age30_40, numerologyData.value.age30_40Advice);
  addSection('40-50 tuổi', numerologyData.value.age40_50, numerologyData.value.age40_50Advice);
  addSection('50-60 tuổi', numerologyData.value.age50_60, numerologyData.value.age50_60Advice);
  addSection('60+ tuổi', numerologyData.value.age60_plus, numerologyData.value.age60_plusAdvice);

  doc.save('numerology_full.pdf');
};
</script>

