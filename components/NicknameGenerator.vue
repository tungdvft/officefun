<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6">
    <!-- Header với gradient -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-t-lg -mx-6 -mt-6 mb-6">
      <h2 class="text-2xl font-bold text-white">Đặt tên danh xưng (Quốc tế)</h2>
      <p class="text-purple-100 mt-1">Nhập thông tin để nhận danh xưng phù hợp với bạn</p>
    </div>

    <div class="space-y-6">
      <!-- Form group với hiệu ứng focus tốt hơn -->
      <div class="form-group">
        <label for="name" class="form-label">Họ và tên</label>
        <input v-model="formData.name" type="text" id="name" placeholder="Ví dụ: Nguyễn Văn A" 
               class="form-input" />
      </div>

      <div class="form-group">
        <label for="birthdate" class="form-label">Ngày sinh (dd/mm/yyyy)</label>
        <div class="relative">
          <input v-model="formData.birthdate" type="text" id="birthdate" placeholder="15/03/1995" 
                 class="form-input pl-10" />
          <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
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

      <div class="form-group">
        <label for="startLetter" class="form-label">Chữ cái đầu tiên của tên (tùy chọn)</label>
        <input v-model="formData.startLetter" type="text" id="startLetter" maxlength="1" 
               placeholder="Ví dụ: H" class="form-input uppercase tracking-widest text-center" 
               @input="formData.startLetter = formData.startLetter.toUpperCase()" />
      </div>

      <button @click="generateNickname" :disabled="loading" 
              class="w-full btn-primary">
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang xử lý...
        </span>
        <span v-else>
          Tạo danh xưng
        </span>
      </button>

      <!-- Kết quả với animation và thiết kế đẹp hơn -->
      <transition name="fade">
        <div v-if="result" class="mt-6 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-100 shadow-sm">
          <div class="flex items-center mb-4">
            <svg class="h-6 w-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p class="text-purple-800 font-bold text-xl">Danh xưng đề xuất</p>
          </div>
          
          <div class="prose prose-purple max-w-none" v-html="parsedResult"></div>
          
          <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
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
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';
import { marked } from 'marked';

const jspdf = process.client ? await import('jspdf').then(module => module.jsPDF) : null;

const formData = ref({
  name: '',
  birthdate: '',
  gender: 'male',
  startLetter: ''
});
const result = ref('');
const loading = ref(false);

const parsedResult = computed(() => result.value ? marked(result.value) : '');

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
    console.log('Sending request with data:', formData.value); // Debug dữ liệu gửi đi
    const response = await $fetch('/api/numerology/nickname', {
      method: 'POST',
      body: {
        name: formData.value.name,
        birthdate: formData.value.birthdate,
        gender: formData.value.gender,
        startLetter: formData.value.startLetter || undefined
      },
    });
    console.log('Response from API:', response); // Debug dữ liệu nhận được
    result.value = response.answer;
    toast.success('Đặt danh xưng hoàn tất!');
  } catch (error) {
    console.error('Error details:', error); // Debug lỗi chi tiết
    const errorMessage = error.data?.message || error.message || 'Không thể tạo danh xưng!';
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
  FB.ui({
    method: 'send',
    link: window.location.href,
    quote: result.value,
  }, (response) => {
    if (response && !response.error) toast.success('Đã chia sẻ qua Messenger!');
    else toast.error('Có lỗi khi chia sẻ qua Messenger!');
  });
};

const copyToClipboard = () => {
  if (!process.client) return;
  navigator.clipboard.writeText(result.value).then(() => {
    toast.success('Đã sao chép kết quả! Dán vào Zalo để chia sẻ.');
  }).catch(() => {
    toast.error('Không thể sao chép!');
  });
};

const downloadPDF = () => {
  if (!process.client || !jspdf) {
    toast.error('Không thể tải PDF trên server-side!');
    return;
  }
  const doc = new jspdf();
  doc.setFont('times');
  doc.setFontSize(12);
  const lines = doc.splitTextToSize(result.value, 180);
  doc.text(lines, 10, 10);
  doc.save('nickname.pdf');
};
</script>

<style>
/* Animation cho kết quả */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Style chung */
.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-gray-700 font-medium;
}

.form-input {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200;
}

.btn-primary {
  @apply bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition duration-200 shadow-md font-medium;
}

.btn-share {
  @apply text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200;
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

/* Style cho nội dung markdown */
.prose h3 {
  @apply text-lg font-semibold text-purple-700 mt-4 mb-2;
}

.prose ul {
  @apply list-disc pl-5 space-y-1;
}

.prose strong {
  @apply text-purple-600 font-semibold;
}
</style>