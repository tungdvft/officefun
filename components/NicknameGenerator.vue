<template>
  <div class="bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
    <div class="container mx-auto p-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Đặt Tên Danh Xưng (Quốc Tế)</h2>
        <p class="text-gray-600">Tạo danh xưng phù hợp với năng lượng số học của bạn</p>
      </div>

      <!-- Main Content -->
      <div class="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
        <!-- Form nhập liệu -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-purple-700 mb-4">Nhập thông tin cá nhân</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
              <input
                v-model="formData.name"
                type="text"
                id="name"
                placeholder="Ví dụ: Nguyễn Văn A"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
            <div>
              <label for="birthdate" class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh (DD/MM/YYYY)</label>
              <input
                v-model="formData.birthdate"
                type="text"
                id="birthdate"
                placeholder="Ví dụ: 15/03/1995"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
              <div class="flex space-x-6">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    v-model="formData.gender"
                    value="male"
                    class="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <span class="text-gray-700">Nam</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    v-model="formData.gender"
                    value="female"
                    class="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <span class="text-gray-700">Nữ</span>
                </label>
              </div>
            </div>
            <div>
              <label for="startLetter" class="block text-sm font-medium text-gray-700 mb-2">Chữ cái đầu tiên (tùy chọn)</label>
              <input
                v-model="formData.startLetter"
                type="text"
                id="startLetter"
                maxlength="1"
                placeholder="Ví dụ: H"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition uppercase tracking-widest text-center"
                @input="formData.startLetter = formData.startLetter.toUpperCase()"
              />
            </div>
          </div>
          <div class="flex justify-center">
            <button
              @click="generateNickname"
              :disabled="loading"
              class="w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-3 px-8 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-md"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </span>
              <span v-else>Tạo danh xưng</span>
            </button>
          </div>
        </div>

        <!-- Kết quả -->
        <transition name="slide-fade">
          <div v-if="numerologyData" class="mt-8 space-y-8">
            <!-- Thông tin đầu vào -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <div class="flex items-center">
                <div class="bg-purple-100 p-2 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-purple-800">Thông tin cá nhân</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div><p class="text-sm text-gray-600">Họ và tên</p><p class="font-medium">{{ formData.name }}</p></div>
                    <div><p class="text-sm text-gray-600">Ngày sinh</p><p class="font-medium">{{ formData.birthdate }}</p></div>
                    <div><p class="text-sm text-gray-600">Giới tính</p><p class="font-medium">{{ formData.gender === 'male' ? 'Nam' : 'Nữ' }}</p></div>
                    <div><p class="text-sm text-gray-600">Chữ cái đầu</p><p class="font-medium">{{ formData.startLetter || 'Không có' }}</p></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Các con số chính -->
            <div>
              <h3 class="text-lg font-semibold text-purple-700 mb-4 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Các con số chính
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div class="flex items-center mb-2">
                    <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mr-2 text-sm">1</span>
                    <div>
                      <h4 class="font-medium text-gray-800">Số chủ đạo: {{ numerologyData.lifePath }}</h4>
                      <p class="text-sm text-gray-600">Con số đường đời</p>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm">{{ numerologyData.lifePathDesc }}</p>
                </div>
                <div class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div class="flex items-center mb-2">
                    <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mr-2 text-sm">2</span>
                    <div>
                      <h4 class="font-medium text-gray-800">Số linh hồn: {{ numerologyData.soul }}</h4>
                      <p class="text-sm text-gray-600">Mong muốn nội tâm</p>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm">{{ numerologyData.soulDesc }}</p>
                </div>
                <div class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div class="flex items-center mb-2">
                    <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mr-2 text-sm">3</span>
                    <div>
                      <h4 class="font-medium text-gray-800">Số nhân cách: {{ numerologyData.personality }}</h4>
                      <p class="text-sm text-gray-600">Phong cách bên ngoài</p>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm">{{ numerologyData.personalityDesc }}</p>
                </div>
                <div class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div class="flex items-center mb-2">
                    <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mr-2 text-sm">4</span>
                    <div>
                      <h4 class="font-medium text-gray-800">Số định mệnh: {{ numerologyData.destiny }}</h4>
                      <p class="text-sm text-gray-600">Sứ mệnh cuộc đời</p>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm">{{ numerologyData.destinyDesc }}</p>
                </div>
              </div>
            </div>

            <!-- Gợi ý danh xưng -->
            <div>
              <h3 class="text-lg font-semibold text-purple-700 mb-4 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Gợi ý danh xưng quốc tế
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="(suggestion, index) in numerologyData.suggestions"
                  :key="index"
                  class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-start mb-2">
                    <span
                      class="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mr-2 text-sm"
                    >
                      {{ index + 1 }}
                    </span>
                    <div>
                      <h4 class="font-medium text-gray-800">{{ suggestion.name }}</h4>
                      <p class="text-sm text-gray-600">
                        Số linh hồn: {{ suggestion.soul }} | Số định mệnh: {{ suggestion.destiny }}
                      </p>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm mb-2">{{ suggestion.desc }}</p>
                  <p class="text-sm text-gray-500 italic">Ví dụ: {{ suggestion.famous }}</p>
                </div>
              </div>
            </div>

            <!-- Lời khuyên -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <h3 class="font-medium text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Lời khuyên sử dụng danh xưng
              </h3>
              <p class="text-gray-600 mt-2">{{ numerologyData.advice }}</p>
            </div>

            <!-- Nút chia sẻ và tải -->
            <!-- <div class="flex flex-wrap gap-3 justify-center">
              <button
                @click="shareViaMessenger"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 shadow-sm"
              >
                <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"
                  />
                </svg>
                Messenger
              </button>
              <button
                @click="copyToClipboard"
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 shadow-sm"
              >
                <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                  />
                </svg>
                Sao chép Zalo
              </button>
              <ClientOnly>
                <button
                  @click="downloadPDF"
                  class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 shadow-sm"
                >
                  <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                  </svg>
                  Tải PDF
                </button>
              </ClientOnly>
            </div> -->
          </div>
        </transition>
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
/* Custom transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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
</style>