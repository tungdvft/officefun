<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-2xl font-semibold text-teal-700 mb-6">Đặt tên thương hiệu theo Thần số học</h2>
    <div class="space-y-6">
      <!-- Form Inputs -->
      <div>
        <label for="industry" class="block text-gray-700 font-medium mb-2">Ngành nghề*</label>
        <input v-model="formData.industry" type="text" id="industry" placeholder="Ví dụ: Thực phẩm, Công nghệ, Thời trang" 
               class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
      </div>
      
      <div>
        <label for="date" class="block text-gray-700 font-medium mb-2">Ngày thành lập/sinh (dd/mm/yyyy)*</label>
        <input v-model="formData.date" type="text" id="date" placeholder="Ví dụ: 15/03/2020" 
               class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
      </div>
      
      <div>
        <label for="ownerName" class="block text-gray-700 font-medium mb-2">Tên chủ thương hiệu*</label>
        <input v-model="formData.ownerName" type="text" id="ownerName" placeholder="Ví dụ: Nguyễn Văn A" 
               class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
      </div>
      
      <div>
        <label for="extraRequest" class="block text-gray-700 font-medium mb-2">Yêu cầu bổ sung</label>
        <textarea v-model="formData.extraRequest" id="extraRequest" rows="2"
                  placeholder="Ví dụ: Có chữ 'Organic', ngắn gọn, sang trọng"
                  class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
      </div>
      
      <button @click="generateReport" :disabled="loading" 
              class="w-full bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 disabled:bg-gray-400 transition-colors">
        {{ loading ? 'Đang phân tích...' : 'Xem gợi ý tên thương hiệu' }}
        <span v-if="loading" class="ml-2 inline-block animate-spin">↻</span>
      </button>

      <!-- Results Section -->
      <div v-if="numerologyData" class="mt-6 p-6 bg-teal-50 rounded-lg transition-all duration-300">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-teal-800 font-semibold text-xl">Gợi ý tên thương hiệu</h3>
          <button @click="downloadPDF" class="flex items-center text-teal-700 hover:text-teal-900">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Tải PDF
          </button>
        </div>
        
        <!-- Basic Info -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <p><span class="font-medium text-gray-700">Ngành nghề:</span> {{ formData.industry }}</p>
            <p><span class="font-medium text-gray-700">Ngày:</span> {{ formData.date }}</p>
            <p><span class="font-medium text-gray-700">Tên chủ:</span> {{ formData.ownerName }}</p>
            <p><span class="font-medium text-gray-700">Yêu cầu:</span> {{ formData.extraRequest || 'Không có' }}</p>
          </div>
          
          <!-- Numerology Numbers -->
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="font-semibold text-teal-700 mb-3">Các con số chính</h4>
            <div class="space-y-3">
              <div>
                <p class="font-medium">Số chủ đạo: <span class="text-teal-600">{{ numerologyData.analysis.lifePath.number }}</span></p>
                <p class="text-sm">{{ numerologyData.analysis.lifePath.meaning }}</p>
              </div>
              <div>
                <p class="font-medium">Số linh hồn: <span class="text-teal-600">{{ numerologyData.analysis.soul.number }}</span></p>
                <p class="text-sm">{{ numerologyData.analysis.soul.meaning }}</p>
              </div>
              <div>
                <p class="font-medium">Số định mệnh: <span class="text-teal-600">{{ numerologyData.analysis.destiny.number }}</span></p>
                <p class="text-sm">{{ numerologyData.analysis.destiny.meaning }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Combined Analysis -->
        <div class="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h4 class="font-semibold text-teal-700 mb-3">Phân tích tổng quan</h4>
          <p class="whitespace-pre-line">{{ numerologyData.combinedAnalysis }}</p>
        </div>
        
        <!-- Name Suggestions -->
        <div class="mb-6">
          <h4 class="font-semibold text-teal-700 mb-3">Gợi ý tên thương hiệu</h4>
          <div class="grid md:grid-cols-2 gap-4">
            <div v-for="(suggestion, index) in numerologyData.nameSuggestions" :key="index" 
                 class="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-start mb-2">
                <span class="inline-block px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs mr-2">#{{ index + 1 }}</span>
                <h5 class="font-bold text-lg">{{ suggestion.name }}</h5>
              </div>
              <div class="flex text-sm space-x-3 mb-2">
                <span class="text-gray-600">Linh hồn: {{ suggestion.soulNumber }}</span>
                <span class="text-gray-600">Định mệnh: {{ suggestion.destinyNumber }}</span>
              </div>
              <p class="text-gray-700 mb-3">{{ suggestion.meaning }}</p>
              <div class="bg-teal-50 p-3 rounded">
                <p class="text-sm font-medium text-teal-700 mb-1">Gợi ý logo:</p>
                <p class="text-sm">{{ suggestion.logoDescription }}</p>
                <div class="mt-2">
                  <p class="text-sm font-medium text-teal-700 mb-1">Màu sắc phù hợp:</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="(color, i) in suggestion.suitableColors" :key="i" 
                          class="px-2 py-1 text-xs rounded-full border" 
                          :style="{ borderColor: getColorCode(color), color: getColorCode(color) }">
                      {{ color }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Brand Advice -->
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h4 class="font-semibold text-teal-700 mb-3">Lời khuyên phát triển thương hiệu</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li v-for="(advice, index) in numerologyData.brandAdvice" :key="index">
              {{ advice }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const formData = ref({
  industry: '',
  date: '',
  ownerName: '',
  extraRequest: '',
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
      body: formData.value,
    });

    numerologyData.value = response.numerology;
    toast.success('Phân tích thần số học thành công!');
  } catch (error) {
    console.error('Error:', error);
    toast.error('Lỗi khi phân tích: ' + error.message);
  } finally {
    loading.value = false;
  }
};

const getColorCode = (colorName) => {
  const colors = {
    'Xanh lá đậm': '#1a5c1a',
    'Nâu đất': '#8B4513',
    'Vàng nhạt': '#FFD700',
    'Nâu vàng': '#D2B48C',
    'Kem': '#FFFDD0',
    'Xanh nhạt': '#ADD8E6',
  };
  return colors[colorName] || '#000000';
};

const downloadPDF = async () => {
  if (!numerologyData.value) return;
  
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Tiêu đề
    doc.setFontSize(18);
    doc.text('GỢI Ý TÊN THƯƠNG HIỆU THEO THẦN SỐ HỌC', 10, 15);
    
    // Thông tin cơ bản
    doc.setFontSize(12);
    let y = 30;
    doc.text(`Ngành nghề: ${formData.value.industry}`, 10, y);
    y += 7;
    doc.text(`Ngày: ${formData.value.date}`, 10, y);
    y += 7;
    doc.text(`Tên chủ: ${formData.value.ownerName}`, 10, y);
    y += 10;
    
    // Các con số
    doc.setFontSize(14);
    doc.text('CÁC CON SỐ CHÍNH', 10, y);
    y += 10;
    
    doc.setFontSize(12);
    doc.text(`Số chủ đạo: ${numerologyData.value.analysis.lifePath.number}`, 10, y);
    y += 7;
    doc.text(numerologyData.value.analysis.lifePath.meaning, 10, y, { maxWidth: 180 });
    y += 15;
    
    doc.text(`Số linh hồn: ${numerologyData.value.analysis.soul.number}`, 10, y);
    y += 7;
    doc.text(numerologyData.value.analysis.soul.meaning, 10, y, { maxWidth: 180 });
    y += 15;
    
    doc.text(`Số định mệnh: ${numerologyData.value.analysis.destiny.number}`, 10, y);
    y += 7;
    doc.text(numerologyData.value.analysis.destiny.meaning, 10, y, { maxWidth: 180 });
    y += 15;
    
    // Gợi ý tên
    doc.setFontSize(14);
    doc.text('GỢI Ý TÊN THƯƠNG HIỆU', 10, y);
    y += 10;
    
    doc.setFontSize(12);
    numerologyData.value.nameSuggestions.forEach((suggestion, index) => {
      if (y > 260) {
        doc.addPage();
        y = 10;
      }
      
      doc.text(`${index + 1}. ${suggestion.name}`, 10, y);
      y += 7;
      doc.text(`Số linh hồn: ${suggestion.soulNumber} | Số định mệnh: ${suggestion.destinyNumber}`, 15, y);
      y += 7;
      doc.text(`Ý nghĩa: ${suggestion.meaning}`, 15, y, { maxWidth: 180 });
      y += 10;
      doc.text(`Gợi ý logo: ${suggestion.logoDescription}`, 15, y, { maxWidth: 180 });
      y += 10;
      doc.text(`Màu sắc: ${suggestion.suitableColors.join(', ')}`, 15, y);
      y += 15;
    });
    
    doc.save(`goi-y-ten-thuong-hieu-${formData.value.industry}.pdf`);
  } catch (error) {
    console.error('PDF generation error:', error);
    toast.error('Lỗi khi tạo PDF');
  }
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>