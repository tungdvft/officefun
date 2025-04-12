<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-white bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">Đặt tên danh xưng (Quốc tế)</h2>
          <p class="text-purple-100 mt-1">Tạo danh xưng phù hợp với năng lượng số học của bạn</p>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Form nhập liệu -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="name" class="form-label">Họ và tên</label>
          <input v-model="formData.name" type="text" id="name" placeholder="Ví dụ: Nguyễn Văn A" class="form-input" />
        </div>
        <div>
          <label for="birthdate" class="form-label">Ngày sinh (dd/mm/yyyy)</label>
          <div class="relative">
            <input v-model="formData.birthdate" type="text" id="birthdate" placeholder="15/03/1995" class="form-input pl-10" />
            <!-- <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg> -->
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div>
          <label for="startLetter" class="form-label">Chữ cái đầu tiên (tùy chọn)</label>
          <input v-model="formData.startLetter" type="text" id="startLetter" maxlength="1" 
                 placeholder="Ví dụ: H" class="form-input uppercase tracking-widest text-center" 
                 @input="formData.startLetter = formData.startLetter.toUpperCase()" />
        </div>
      </div>

      <button @click="generateNickname" :disabled="loading" class="w-full btn-primary">
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang xử lý...
        </span>
        <span v-else>Tạo danh xưng</span>
      </button>

      <!-- Kết quả -->
      <transition name="fade-slide">
        <div v-if="numerologyData" class="mt-6 space-y-8">
          <!-- Thông tin đầu vào -->
          <div class="bg-purple-50 p-6 rounded-xl border border-purple-100">
            <h3 class="text-xl font-bold text-purple-900 mb-4">Thông tin cá nhân</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><p class="text-sm text-gray-500">Họ và tên</p><p class="font-medium">{{ formData.name }}</p></div>
              <div><p class="text-sm text-gray-500">Ngày sinh</p><p class="font-medium">{{ formData.birthdate }}</p></div>
              <div><p class="text-sm text-gray-500">Giới tính</p><p class="font-medium">{{ formData.gender === 'male' ? 'Nam' : 'Nữ' }}</p></div>
              <div><p class="text-sm text-gray-500">Chữ cái đầu</p><p class="font-medium">{{ formData.startLetter || 'Không có' }}</p></div>
            </div>
          </div>

          <!-- Các con số chính -->
          <div>
            <h3 class="text-xl font-bold text-purple-900 mb-4">Các con số chính</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div class="flex items-center mb-2">
                  <span class="text-3xl font-bold text-purple-600 mr-3">{{ numerologyData.lifePath }}</span>
                  <div>
                    <h4 class="font-semibold text-gray-800">Số chủ đạo</h4>
                    <p class="text-sm text-gray-500">Con số đường đời</p>
                  </div>
                </div>
                <p class="text-gray-700">{{ numerologyData.lifePathDesc }}</p>
              </div>
              <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div class="flex items-center mb-2">
                  <span class="text-3xl font-bold text-purple-600 mr-3">{{ numerologyData.soul }}</span>
                  <div>
                    <h4 class="font-semibold text-gray-800">Số linh hồn</h4>
                    <p class="text-sm text-gray-500">Mong muốn nội tâm</p>
                  </div>
                </div>
                <p class="text-gray-700">{{ numerologyData.soulDesc }}</p>
              </div>
              <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div class="flex items-center mb-2">
                  <span class="text-3xl font-bold text-purple-600 mr-3">{{ numerologyData.personality }}</span>
                  <div>
                    <h4 class="font-semibold text-gray-800">Số nhân cách</h4>
                    <p class="text-sm text-gray-500">Phong cách bên ngoài</p>
                  </div>
                </div>
                <p class="text-gray-700">{{ numerologyData.personalityDesc }}</p>
              </div>
              <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div class="flex items-center mb-2">
                  <span class="text-3xl font-bold text-purple-600 mr-3">{{ numerologyData.destiny }}</span>
                  <div>
                    <h4 class="font-semibold text-gray-800">Số định mệnh</h4>
                    <p class="text-sm text-gray-500">Sứ mệnh cuộc đời</p>
                  </div>
                </div>
                <p class="text-gray-700">{{ numerologyData.destinyDesc }}</p>
              </div>
            </div>
          </div>

          <!-- Gợi ý danh xưng -->
          <div>
            <h3 class="text-xl font-bold text-purple-900 mb-4">Gợi ý danh xưng quốc tế</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div v-for="(suggestion, index) in numerologyData.suggestions" :key="index" 
                   class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-start mb-4">
                  <span class="w-10 h-10 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full font-bold mr-3">{{ index + 1 }}</span>
                  <div>
                    <h4 class="text-lg font-semibold text-gray-800">{{ suggestion.name }}</h4>
                    <p class="text-sm text-gray-500">Số linh hồn: {{ suggestion.soul }} | Số định mệnh: {{ suggestion.destiny }}</p>
                  </div>
                </div>
                <p class="text-gray-700 mb-2">{{ suggestion.desc }}</p>
                <p class="text-sm text-gray-500 italic">Ví dụ: {{ suggestion.famous }}</p>
              </div>
            </div>
          </div>

          <!-- Lời khuyên -->
          <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 class="text-xl font-bold text-indigo-800 mb-4 flex items-center">
              <svg class="w-6 h-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Lời khuyên sử dụng danh xưng
            </h3>
            <p class="text-gray-700">{{ numerologyData.advice }}</p>
          </div>

          <!-- Nút chia sẻ và tải -->
          <div class="flex flex-wrap gap-3 justify-center">
            <button @click="shareViaMessenger" class="btn-share bg-blue-500 hover:bg-blue-600">
              <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"/>
              </svg>
              Messenger
            </button>
            <button @click="copyToClipboard" class="btn-share bg-green-500 hover:bg-green-600">
              <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
              Sao chép Zalo
            </button>
            <ClientOnly>
              <button @click="downloadPDF" class="btn-share bg-gray-600 hover:bg-gray-700">
                <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Tải PDF
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

const formData = ref({
  name: '',
  birthdate: '',
  gender: 'male',
  startLetter: ''
});
const numerologyData = ref(null);
const loading = ref(false);

const generateNickname = async () => {
  if (!formData.value.name) return toast.error('Vui lòng nhập họ và tên!');
  if (!formData.value.birthdate) return toast.error('Vui lòng nhập ngày sinh!');
  if (!formData.value.gender) return toast.error('Vui lòng chọn giới tính!');
  if (formData.value.startLetter && !/^[A-Z]$/.test(formData.value.startLetter)) return toast.error('Chữ cái đầu tiên phải là A-Z!');

  loading.value = true;
  try {
    console.log('Sending request with data:', formData.value);
    const response = await $fetch('/api/numerology/nickname', {
      method: 'POST',
      body: {
        name: formData.value.name,
        birthdate: formData.value.birthdate,
        gender: formData.value.gender,
        startLetter: formData.value.startLetter || undefined
      },
    });
    console.log('Response from API:', response);
    numerologyData.value = response.numerology;
    toast.success('Tạo danh xưng hoàn tất!');
  } catch (error) {
    console.error('Error details:', error);
    toast.error(error.data?.message || error.message || 'Không thể tạo danh xưng!');
  } finally {
    loading.value = false;
  }
};

const shareViaMessenger = () => {
  if (!process.client || typeof FB === 'undefined') {
    toast.error('Facebook SDK chưa tải xong, thử lại sau!');
    return;
  }
  const text = formatResultForShare();
  FB.ui({
    method: 'send',
    link: window.location.href,
    quote: text,
  }, (response) => {
    if (response && !response.error) toast.success('Đã chia sẻ qua Messenger!');
    else toast.error('Có lỗi khi chia sẻ qua Messenger!');
  });
};

const copyToClipboard = () => {
  if (!process.client) return;
  const text = formatResultForShare();
  navigator.clipboard.writeText(text).then(() => {
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
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.setFont('helvetica');
  doc.setFontSize(12);
  let y = 10;

  doc.setFontSize(16);
  doc.text(`Danh xưng quốc tế cho ${formData.value.name}`, 10, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Họ và tên: ${formData.value.name}`, 10, y); y += 7;
  doc.text(`Ngày sinh: ${formData.value.birthdate}`, 10, y); y += 7;
  doc.text(`Giới tính: ${formData.value.gender === 'male' ? 'Nam' : 'Nữ'}`, 10, y); y += 7;
  doc.text(`Chữ cái đầu: ${formData.value.startLetter || 'Không có'}`, 10, y); y += 10;

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

  doc.setFontSize(14);
  doc.text('Gợi ý danh xưng:', 10, y); y += 7;
  doc.setFontSize(12);
  numerologyData.value.suggestions.forEach(s => {
    if (y > 260) { doc.addPage(); y = 10; }
    const text = `${s.name} (Số linh hồn: ${s.soul}, Số định mệnh: ${s.destiny})\nMô tả: ${s.desc}\nVí dụ: ${s.famous}`;
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, y);
    y += lines.length * 7 + 5;
  });

  addSection('Lời khuyên', numerologyData.value.advice);

  doc.save(`nickname-${formData.value.name}.pdf`);
};

const formatResultForShare = () => {
  if (!numerologyData.value) return '';
  return [
    `Danh xưng quốc tế cho ${formData.value.name}`,
    `Số chủ đạo: ${numerologyData.value.lifePath} - ${numerologyData.value.lifePathDesc}`,
    `Số linh hồn: ${numerologyData.value.soul} - ${numerologyData.value.soulDesc}`,
    `Số nhân cách: ${numerologyData.value.personality} - ${numerologyData.value.personalityDesc}`,
    `Số định mệnh: ${numerologyData.value.destiny} - ${numerologyData.value.destinyDesc}`,
    `Gợi ý danh xưng:`,
    ...numerologyData.value.suggestions.map(s => `- ${s.name} (Số linh hồn: ${s.soul}, Số định mệnh: ${s.destiny}): ${s.desc} (${s.famous})`),
    `Lời khuyên: ${numerologyData.value.advice}`
  ].join('\n');
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
  @apply flex items-center space-x-2 cursor-pointer;
}

.radio-input {
  @apply h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300;
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