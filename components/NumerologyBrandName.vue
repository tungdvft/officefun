<!-- components/NumerologyBrandName.vue -->
<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-2xl font-semibold text-teal-700 mb-6">Đặt tên thương hiệu theo Thần số học</h2>
    <div class="space-y-6">
      <div>
        <label for="industry" class="block text-gray-700 font-medium mb-2">Ngành nghề</label>
        <input v-model="formData.industry" type="text" id="industry" placeholder="Ví dụ: Công nghệ, Thời trang, Thực phẩm" class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      <div>
        <label for="date" class="block text-gray-700 font-medium mb-2">Ngày thành lập hoặc ngày sinh founder (dd/mm/yyyy)</label>
        <input v-model="formData.date" type="text" id="date" placeholder="Ví dụ: 15/03/2020" class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      <div>
        <label for="ownerName" class="block text-gray-700 font-medium mb-2">Tên chủ thương hiệu</label>
        <input v-model="formData.ownerName" type="text" id="ownerName" placeholder="Ví dụ: Nguyễn Văn A" class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      <div>
        <label for="extraRequest" class="block text-gray-700 font-medium mb-2">Yêu cầu bổ sung</label>
        <input v-model="formData.extraRequest" type="text" id="extraRequest" placeholder="Ví dụ: Có chữ 'hot', ngắn gọn, sang trọng" class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-2">Giới tính founder (nếu dùng ngày sinh)</label>
        <div class="flex space-x-4">
          <label><input type="radio" v-model="formData.gender" value="male" /> Nam</label>
          <label><input type="radio" v-model="formData.gender" value="female" /> Nữ</label>
          <label><input type="radio" v-model="formData.gender" value="none" /> Không áp dụng</label>
        </div>
      </div>
      <button @click="generateReport" :disabled="loading" class="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 disabled:bg-gray-400">
        {{ loading ? 'Đang xử lý...' : 'Xem gợi ý tên thương hiệu' }}
      </button>

      <div v-if="numerologyData" class="mt-4 p-6 bg-teal-50 rounded-lg whitespace-pre-line">
        <h3 class="text-teal-800 font-semibold text-lg mb-4">Gợi ý tên thương hiệu theo Thần số học</h3>
        
        <p><strong>Ngành nghề:</strong> {{ formData.industry }}</p>
        <p><strong>Ngày:</strong> {{ formData.date }}</p>
        <p><strong>Tên chủ thương hiệu:</strong> {{ formData.ownerName }}</p>
        <p><strong>Yêu cầu bổ sung:</strong> {{ formData.extraRequest || 'Không có' }}</p>
        <p><strong>Giới tính:</strong> {{ formData.gender === 'none' ? 'Không áp dụng' : formData.gender === 'male' ? 'Nam' : 'Nữ' }}</p>
        
        <h4 class="mt-4 text-teal-700 font-semibold">Các con số chính:</h4>
        <p>Số chủ đạo: {{ numerologyData.lifePath }} - {{ numerologyData.lifePathDesc }}</p>
        <p>Số linh hồn (chủ): {{ numerologyData.soul }} - {{ numerologyData.soulDesc }}</p>
        <p>Số định mệnh (chủ): {{ numerologyData.destiny }} - {{ numerologyData.destinyDesc }}</p>
        
        <h4 class="mt-4 text-teal-700 font-semibold">Phân tích tổng quan:</h4>
        <p>{{ numerologyData.generalAnalysis }}</p>
        
        <h4 class="mt-4 text-teal-700 font-semibold">Gợi ý tên thương hiệu:</h4>
        <ul class="list-disc pl-5 space-y-4">
          <li v-for="(suggestion, index) in numerologyData.suggestions" :key="index">
            <strong>{{ suggestion.name }}</strong> (Số linh hồn: {{ suggestion.soul }}, Số định mệnh: {{ suggestion.destiny }})<br />
            <span>{{ suggestion.desc }}</span><br />
            <span class="text-teal-600"><strong>Gợi ý logo:</strong> {{ suggestion.logoSuggestion }}</span>
          </li>
        </ul>
        
        <h4 class="mt-4 text-teal-700 font-semibold">Lời khuyên:</h4>
        <p>{{ numerologyData.brandAdvice }}</p>
        
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

const jspdf = process.client ? await import('jspdf').then(module => module.jsPDF) : null;

const formData = ref({
  industry: '',
  date: '',
  ownerName: '',
  extraRequest: '',
  gender: 'none'
});
const numerologyData = ref(null);
const loading = ref(false);

const generateReport = async () => {
  if (!formData.value.industry) {
    toast.error('Vui lòng nhập ngành nghề!');
    return;
  }
  if (!formData.value.date) {
    toast.error('Vui lòng nhập ngày thành lập hoặc ngày sinh!');
    return;
  }
  if (!formData.value.ownerName) {
    toast.error('Vui lòng nhập tên chủ thương hiệu!');
    return;
  }

  loading.value = true;
  try {
    const response = await $fetch('/api/numerology/brand', {
      method: 'POST',
      body: {
        industry: formData.value.industry,
        date: formData.value.date,
        ownerName: formData.value.ownerName,
        extraRequest: formData.value.extraRequest,
        gender: formData.value.gender
      },
    });

    numerologyData.value = response.numerology;
    toast.success('Tạo gợi ý tên thương hiệu hoàn tất!');
  } catch (error) {
    console.error('Error:', error);
    toast.error('Không thể tạo gợi ý!');
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
  doc.setFont('times');
  doc.setFontSize(12);
  let y = 10;

  // Tiêu đề
  doc.setFontSize(16);
  doc.text('Gợi ý tên thương hiệu theo Thần số học', 10, y);
  y += 10;

  // Thông tin đầu vào
  doc.setFontSize(12);
  doc.text(`Ngành nghề: ${formData.value.industry}`, 10, y);
  y += 7;
  doc.text(`Ngày: ${formData.value.date}`, 10, y);
  y += 7;
  doc.text(`Tên chủ thương hiệu: ${formData.value.ownerName}`, 10, y);
  y += 7;
  doc.text(`Yêu cầu bổ sung: ${formData.value.extraRequest || 'Không có'}`, 10, y);
  y += 7;
  doc.text(`Giới tính: ${formData.value.gender === 'none' ? 'Không áp dụng' : formData.value.gender === 'male' ? 'Nam' : 'Nữ'}`, 10, y);
  y += 10;

  // Các con số chính
  doc.text('Các con số chính:', 10, y);
  y += 7;
  doc.text(`Số chủ đạo: ${numerologyData.value.lifePath} - ${numerologyData.value.lifePathDesc}`, 10, y);
  y += 7;
  doc.text(`Số linh hồn (chủ): ${numerologyData.value.soul} - ${numerologyData.value.soulDesc}`, 10, y);
  y += 7;
  doc.text(`Số định mệnh (chủ): ${numerologyData.value.destiny} - ${numerologyData.value.destinyDesc}`, 10, y);
  y += 10;

  // Các phần nội dung
  const addSection = (title, content) => {
    if (y > 260) {
      doc.addPage();
      y = 10;
    }
    doc.setFontSize(14);
    doc.text(title, 10, y);
    y += 7;
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 10, y);
    y += lines.length * 7 + 10;
  };

  addSection('Phân tích tổng quan', numerologyData.value.generalAnalysis);

  // Gợi ý tên thương hiệu với logo
  doc.setFontSize(14);
  doc.text('Gợi ý tên thương hiệu:', 10, y);
  y += 7;
  doc.setFontSize(12);
  numerologyData.value.suggestions.forEach(suggestion => {
    if (y > 260) {
      doc.addPage();
      y = 10;
    }
    const text = `${suggestion.name} (Số linh hồn: ${suggestion.soul}, Số định mệnh: ${suggestion.destiny})`;
    doc.text(text, 10, y);
    y += 7;
    const descLines = doc.splitTextToSize(`Mô tả: ${suggestion.desc}`, 180);
    doc.text(descLines, 10, y);
    y += descLines.length * 7;
    const logoLines = doc.splitTextToSize(`Gợi ý logo: ${suggestion.logoSuggestion}`, 180);
    doc.text(logoLines, 10, y);
    y += logoLines.length * 7 + 5;
  });
  y += 5;

  addSection('Lời khuyên', numerologyData.value.brandAdvice);

  doc.save('numerology_brand.pdf');
};
</script>

<style scoped>
p { margin-bottom: 0.5rem; }
strong { font-weight: bold; }
</style>