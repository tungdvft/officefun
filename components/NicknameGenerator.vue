<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-2xl font-semibold text-purple-700 mb-6">Đặt tên danh xưng (Quốc tế)</h2>
    <div class="space-y-6">
      <div>
        <label for="name" class="block text-gray-700 font-medium mb-2">Họ và tên</label>
        <input v-model="formData.name" type="text" id="name" placeholder="Nhập họ và tên" class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
      </div>
      <div>
        <label for="birthdate" class="block text-gray-700 font-medium mb-2">Ngày sinh (dd/mm/yyyy)</label>
        <input v-model="formData.birthdate" type="text" id="birthdate" placeholder="Ví dụ: 15/03/1995" class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-2">Giới tính</label>
        <div class="flex space-x-4">
          <label class="flex items-center">
            <input type="radio" v-model="formData.gender" value="male" class="mr-2" /> Nam
          </label>
          <label class="flex items-center">
            <input type="radio" v-model="formData.gender" value="female" class="mr-2" /> Nữ
          </label>
        </div>
      </div>
      <div>
        <label for="startLetter" class="block text-gray-700 font-medium mb-2">Chữ cái đầu tiên của tên (tùy chọn)</label>
        <input v-model="formData.startLetter" type="text" id="startLetter" maxlength="1" placeholder="Ví dụ: H" class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase" @input="formData.startLetter = formData.startLetter.toUpperCase()" />
      </div>
      <button @click="generateNickname" :disabled="loading" class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400 transition-colors duration-200">
        {{ loading ? 'Đang xử lý...' : 'Tạo danh xưng' }}
      </button>

      <div v-if="result" class="mt-6 p-6 bg-purple-50 rounded-lg">
        <div class="mb-6">
          <h3 class="text-xl font-bold text-purple-800 mb-2">Phân tích số học</h3>
          <p class="text-gray-700">{{ result.data.analysis }}</p>
        </div>

        <div class="mb-6">
          <h3 class="text-xl font-bold text-purple-800 mb-4">Danh xưng đề xuất</h3>
          <div class="space-y-6">
            <div v-for="(suggestion, index) in result.data.suggestions" :key="index" class="p-4 bg-white rounded-lg shadow">
              <h4 class="text-lg font-bold text-purple-700 mb-2">{{ suggestion.name }}</h4>
              <p class="text-gray-600 mb-2">{{ suggestion.meaning }}</p>
              
              <div class="mb-2">
                <span class="font-medium text-gray-700">Tính cách nổi bật:</span>
                <div class="flex flex-wrap gap-2 mt-1">
                  <span v-for="(trait, i) in suggestion.personalityTraits" :key="i" class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {{ trait }}
                  </span>
                </div>
              </div>
              
              <p class="text-sm text-gray-500 italic">Ví dụ: {{ suggestion.famousExample }}</p>
            </div>
          </div>
        </div>

        <div class="p-4 bg-purple-100 rounded-lg">
          <h4 class="font-bold text-purple-700 mb-2">Lời khuyên sử dụng</h4>
          <p class="text-gray-700">{{ result.data.usageTips }}</p>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <button @click="shareViaMessenger" class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 4.975-12 11.111 0 3.497 1.745 6.616 4.472 8.652v4.237l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111 0-6.136-5.373-11.111-12-11.111zm1.193 14.963l-3.056-3.259-5.963 3.259 6.559-6.963 3.13 3.259 5.889-3.259-6.559 6.963z"/>
            </svg>
            Chia sẻ Messenger
          </button>
          <button @click="copyToClipboard" class="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
            </svg>
            Sao chép Zalo
          </button>
          <ClientOnly>
            <button @click="downloadPDF" class="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Tải PDF
            </button>
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

const formData = ref({
  name: '',
  birthdate: '',
  gender: 'male',
  startLetter: ''
});
const result = ref(null);
const loading = ref(false);

const generateNickname = async () => {
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
  if (formData.value.startLetter && !/^[A-Z]$/.test(formData.value.startLetter)) {
    toast.error('Chữ cái đầu tiên phải là một chữ cái từ A-Z!');
    return;
  }

  loading.value = true;
  try {
    const response = await $fetch('/api/numerology/nickname', {
      method: 'POST',
      body: {
        name: formData.value.name,
        birthdate: formData.value.birthdate,
        gender: formData.value.gender,
        startLetter: formData.value.startLetter || undefined
      },
    });
    result.value = response;
    toast.success('Tạo danh xưng thành công!');
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error.data?.message || error.message || 'Có lỗi xảy ra khi tạo danh xưng';
    toast.error(errorMessage);
  } finally {
    loading.value = false;
  }
};

const shareViaMessenger = () => {
  if (!process.client || typeof FB === 'undefined') {
    toast.error('Facebook SDK chưa tải xong, thử lại sau!');
    return;
  }
  
  const shareText = `Tôi vừa tạo danh xưng quốc tế:\n\n` +
    `Họ tên: ${formData.value.name}\n` +
    `Ngày sinh: ${formData.value.birthdate}\n\n` +
    `Kết quả:\n${result.value.data.suggestions.map(s => `${s.name}: ${s.meaning}`).join('\n')}`;
  
  FB.ui({
    method: 'share',
    href: window.location.href,
    quote: shareText,
  }, (response) => {
    if (response && !response.error) {
      toast.success('Đã chia sẻ thành công!');
    }
  });
};

const copyToClipboard = () => {
  if (!process.client) return;
  
  const textToCopy = `Tôi vừa tạo danh xưng quốc tế:\n\n` +
    `Họ tên: ${formData.value.name}\n` +
    `Ngày sinh: ${formData.value.birthdate}\n\n` +
    `Kết quả:\n${result.value.data.suggestions.map((s, i) => 
      `${i+1}. ${s.name}\n- Ý nghĩa: ${s.meaning}\n- Tính cách: ${s.personalityTraits.join(', ')}\n- Ví dụ: ${s.famousExample}`
    ).join('\n\n')}`;
  
  navigator.clipboard.writeText(textToCopy).then(() => {
    toast.success('Đã sao chép kết quả! Dán vào Zalo để chia sẻ.');
  }).catch(() => {
    toast.error('Không thể sao chép!');
  });
};

const downloadPDF = async () => {
  if (!process.client) {
    toast.error('Không thể tải PDF trên server-side!');
    return;
  }
  
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Thêm tiêu đề
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(102, 51, 153); // Màu purple
    doc.text('KẾT QUẢ DANH XƯNG QUỐC TẾ', 105, 20, null, null, 'center');
    
    // Thêm thông tin cá nhân
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Họ tên: ${formData.value.name}`, 20, 40);
    doc.text(`Ngày sinh: ${formData.value.birthdate}`, 20, 50);
    doc.text(`Giới tính: ${formData.value.gender === 'male' ? 'Nam' : 'Nữ'}`, 20, 60);
    
    // Thêm phân tích
    doc.setFont('helvetica', 'bold');
    doc.text('Phân tích số học:', 20, 75);
    doc.setFont('helvetica', 'normal');
    const analysisLines = doc.splitTextToSize(result.value.data.analysis, 170);
    doc.text(analysisLines, 20, 85);
    
    // Thêm đề xuất
    doc.setFont('helvetica', 'bold');
    doc.text('Danh xưng đề xuất:', 20, 110);
    
    let yPosition = 120;
    result.value.data.suggestions.forEach((suggestion, index) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(102, 51, 153);
      doc.text(`${index + 1}. ${suggestion.name}`, 20, yPosition);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const meaningLines = doc.splitTextToSize(`Ý nghĩa: ${suggestion.meaning}`, 170);
      doc.text(meaningLines, 25, yPosition + 7);
      
      const traitsLines = doc.splitTextToSize(`Tính cách: ${suggestion.personalityTraits.join(', ')}`, 170);
      doc.text(traitsLines, 25, yPosition + 17);
      
      const exampleLines = doc.splitTextToSize(`Ví dụ: ${suggestion.famousExample}`, 170);
      doc.text(exampleLines, 25, yPosition + 27);
      
      yPosition += 40;
    });
    
    // Lời khuyên
    doc.setFont('helvetica', 'bold');
    doc.text('Lời khuyên:', 20, yPosition + 10);
    doc.setFont('helvetica', 'normal');
    const tipsLines = doc.splitTextToSize(result.value.data.usageTips, 170);
    doc.text(tipsLines, 20, yPosition + 20);
    
    // Lưu file
    doc.save(`Danh_xuong_quoc_te_${formData.value.name.replace(/\s+/g, '_')}.pdf`);
    toast.success('Đã tải PDF thành công!');
  } catch (error) {
    console.error('PDF generation error:', error);
    toast.error('Có lỗi khi tạo PDF!');
  }
};
</script>

<style scoped>
.uppercase {
  text-transform: uppercase;
}
</style>