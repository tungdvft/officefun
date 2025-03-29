<!-- components/NumerologyFullReport.vue -->
<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-2xl font-semibold text-teal-700 mb-6">Thần số học trọn đời</h2>
    <div class="space-y-6">
      <div>
        <label for="name" class="block text-gray-700 font-medium mb-2">Họ và tên</label>
        <input v-model="formData.name" type="text" id="name" placeholder="Nhập họ và tên" class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      <div>
        <label for="birthdate" class="block text-gray-700 font-medium mb-2">Ngày sinh (dd/mm/yyyy)</label>
        <input v-model="formData.birthdate" type="text" id="birthdate" placeholder="Ví dụ: 15/03/1995" class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-2">Giới tính</label>
        <div class="flex space-x-4">
          <label><input type="radio" v-model="formData.gender" value="male" /> Nam</label>
          <label><input type="radio" v-model="formData.gender" value="female" /> Nữ</label>
        </div>
      </div>
      <button @click="generateReport" :disabled="loading" class="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 disabled:bg-gray-400">
        {{ loading ? 'Đang xử lý...' : 'Xem báo cáo Thần số học' }}
      </button>

      <div v-if="numerologyData" class="mt-4 p-6 bg-teal-50 rounded-lg whitespace-pre-line">
        <h3 class="text-teal-800 font-semibold text-lg mb-4">Báo cáo Thần số học trọn đời</h3>
        
        <p><strong>Họ và tên:</strong> {{ formData.name }}</p>
        <p><strong>Ngày sinh:</strong> {{ formData.birthdate }}</p>
        <p><strong>Giới tính:</strong> {{ formData.gender === 'male' ? 'Nam' : 'Nữ' }}</p>
        
        <h4 class="mt-4 text-teal-700 font-semibold">Các con số chính:</h4>
        <p>Số chủ đạo: {{ numerologyData.lifePath }} - {{ numerologyData.lifePathDesc }}</p>
        <p>Số linh hồn: {{ numerologyData.soul }} - {{ numerologyData.soulDesc }}</p>
        <p>Số nhân cách: {{ numerologyData.personality }} - {{ numerologyData.personalityDesc }}</p>
        <p>Số định mệnh: {{ numerologyData.destiny }} - {{ numerologyData.destinyDesc }}</p>
        
        <h4 class="mt-4 text-teal-700 font-semibold">0-10 tuổi:</h4>
        <p>{{ numerologyData.age0_10 }}</p>
        <p><strong>Lời khuyên:</strong> {{ numerologyData.age0_10Advice }}</p>
        
        <h4 class="mt-4 text-teal-700 font-semibold">10-20 tuổi:</h4>
        <p>{{ numerologyData.age10_20 }}</p>
        <p><strong>Lời khuyên:</strong> {{ numerologyData.age10_20Advice }}</p>
        
        <h4 class="mt-4 text-teal-700 font-semibold">20-30 tuổi:</h4>
        <p>{{ numerologyData.age20_30 }}</p>
        <p><strong>Lời khuyên:</strong> {{ numerologyData.age20_30Advice }}</p>
        
        <h4 class="mt-4 text-teal-700 font-semibold">30-40 tuổi:</h4>
        <p>{{ numerologyData.age30_40 }}</p>
        <p><strong>Lời khuyên:</strong> {{ numerologyData.age30_40Advice }}</p>
        
        <h4 class="mt-4 text-teal-700 font-semibold">40-50 tuổi:</h4>
        <p>{{ numerologyData.age40_50 }}</p>
        <p><strong>Lời khuyên:</strong> {{ numerologyData.age40_50Advice }}</p>
        
        <h4 class="mt-4 text-teal-700 font-semibold">50-60 tuổi:</h4>
        <p>{{ numerologyData.age50_60 }}</p>
        <p><strong>Lời khuyên:</strong> {{ numerologyData.age50_60Advice }}</p>
        
        <h4 class="mt-4 text-teal-700 font-semibold">60+ tuổi:</h4>
        <p>{{ numerologyData.age60_plus }}</p>
        <p><strong>Lời khuyên:</strong> {{ numerologyData.age60_plusAdvice }}</p>
        
        <ClientOnly>
          <button @click="downloadPDF" class="mt-6 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">Tải PDF</button>
        </ClientOnly>
      </div>
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

<style scoped>
p { margin-bottom: 0.5rem; }
strong { font-weight: bold; }
</style>