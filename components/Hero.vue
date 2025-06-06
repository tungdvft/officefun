<template>
  <section class="text-gray-50 py-12 md:py-16 relative overflow-hidden">
    <!-- Nền đậm với các chi tiết thần số học -->
    <div class="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900">
      <!-- Pattern các con số mờ -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 text-7xl font-bold text-white/20">1</div>
        <div class="absolute top-1/4 right-20 text-8xl font-bold text-white/20">2</div>
        <div class="absolute bottom-1/3 left-1/4 text-9xl font-bold text-white/20">3</div>
        <div class="absolute bottom-20 right-1/3 text-7xl font-bold text-white/20">4</div>
        <div class="absolute top-1/3 left-1/2 text-8xl font-bold text-white/20">5</div>
        <div class="absolute bottom-10 right-10 text-9xl font-bold text-white/20">6</div>
        <div class="absolute top-20 right-1/4 text-7xl font-bold text-white/20">7</div>
        <div class="absolute bottom-1/4 left-20 text-8xl font-bold text-white/20">8</div>
        <div class="absolute top-1/2 right-1/2 text-9xl font-bold text-white/20">9</div>
      </div>
      
      <!-- Các hình học sacred geometry -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-0 left-0 w-40 h-40 border-2 border-white/10 rounded-full"></div>
        <div class="absolute bottom-0 right-0 w-60 h-60 border-2 border-white/10 transform rotate-45"></div>
        <div class="absolute top-1/2 left-1/4 w-32 h-32 border-2 border-white/10 rounded-full"></div>
        <div class="absolute bottom-1/4 right-1/3 w-48 h-48 border-2 border-white/10 transform rotate-30"></div>
      </div>
      
      <!-- Hiệu ứng ánh sáng tinh tế -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 from-10% to-transparent"></div>
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <div class="flex flex-col lg:flex-row items-center gap-8">
        <!-- Text section -->
        <div class="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
          <h2 class="text-4xl md:text-5xl font-bold mb-6 fade-in bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent leading-tight">
            Khám Phá Bản Thân Qua Con Số Vận Mệnh
          </h2>
          <p class="text-lg md:text-xl mb-8 fade-in text-gray-200">
            Mỗi con số trong ngày sinh và tên gọi của bạn đều mang thông điệp riêng, 
            tiết lộ tính cách, sứ mệnh và tiềm năng ẩn sâu.
          </p>
          
          <!-- Các chỉ số quan trọng -->
          <div class="space-y-3 fade-in [animation-delay:0.3s]">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <span class="text-xl font-bold text-purple-300">1</span>
              </div>
              <span class="text-gray-200">Số chủ đạo - Con đường đời</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <span class="text-xl font-bold text-pink-300">2</span>
              </div>
              <span class="text-gray-200">Số linh hồn - Khát vọng sâu thẳm</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <span class="text-xl font-bold text-indigo-300">3</span>
              </div>
              <span class="text-gray-200">Số nhân cách - Ấn tượng bạn tạo ra</span>
            </div>
          </div>
        </div>

        <!-- Form section -->
        <div class="lg:w-1/2 bg-white/10 rounded-xl p-8 shadow-2xl border border-white/20 backdrop-blur-sm transform transition-all hover:shadow-purple-900/30">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-white">
              Luận Giải Thần Số Học
            </h3>
            <p class="text-gray-300 mt-2">Nhập thông tin để nhận báo cáo chi tiết</p>
          </div>
          
          <form @submit.prevent="submitForm" class="space-y-5">
            <div>
              <label for="fullname" class="block mb-2 font-medium text-gray-300">
                Họ và tên <span class="text-pink-400">*</span>
              </label>
              <input
                type="text"
                id="fullname"
                v-model="form.fullname"
                class="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-purple-300 focus:border-transparent focus:outline-none transition duration-200 hover:border-white/30"
                placeholder="Nhập đầy đủ họ tên"
                required
              />
            </div>

            <div>
              <label for="birthdate" class="block mb-2 font-medium text-gray-300">
                Ngày sinh <span class="text-pink-400">*</span>
              </label>
              <input
                type="text"
                id="birthdate"
                v-model="form.birthdate"
                pattern="\d{2}/\d{2}/\d{4}"
                placeholder="DD/MM/YYYY"
                class="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-gray-100 focus:ring-2 focus:ring-purple-300 focus:border-transparent focus:outline-none transition duration-200 hover:border-white/30"
                required
              />
              <p class="text-xs text-gray-400 mt-1">Ví dụ: 20/11/1990</p>
            </div>

            <div class="pt-2">
              <button
                type="submit"
                :disabled="generalStore.isLoading || !form.fullname || !form.birthdate"
                class="w-full inline-flex justify-center items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <span class="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span class="relative z-10 flex items-center">
                  <template v-if="generalStore.isLoading">
                    <svg
                      class="animate-spin h-5 w-5 text-white mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Đang luận giải...</span>
                  </template>
                  <template v-else>
                    <span class="group-hover:scale-105 transition-transform">Khám Phá Ngay</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transition-all group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </template>
                </span>
              </button>
            </div>

            <p v-if="generalStore.error" class="text-pink-300 text-sm text-center py-2 px-4 bg-white/5 rounded-lg border border-white/10">
              {{ generalStore.error }}
            </p>

            <p class="text-xs text-gray-400 text-center">
              Thông tin của bạn sẽ được bảo mật theo 
              <NuxtLink
                to="/dieu-khoan-su-dung"
                class="text-purple-300 hover:text-purple-200 transition duration-200 font-medium"
              >
                Chính sách riêng tư
              </NuxtLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useGeneralStore } from '~/stores/general';
import { useRouter } from 'vue-router';

// Khởi tạo form
const form = ref({
  fullname: '',
  birthdate: '',
});

// Khởi tạo store và router
const generalStore = useGeneralStore();
const router = useRouter();

// Hàm submit form
const submitForm = async () => {
  // Kiểm tra trạng thái đăng nhập
  const auth = localStorage.getItem('auth');
  if (auth) {
    try {
      const authData = JSON.parse(auth);
      // Kiểm tra xem authData có token và các trường cần thiết
      if (authData && authData.token && authData.id && authData.email) {
        // Nếu đã đăng nhập, gọi API và điều hướng sang /xem
        try {
          await generalStore.fetchNumerology({
            fullname: form.value.fullname,
            birthdate: form.value.birthdate,
          });

          if (generalStore.hasData) {
            router.push('/xem');
          } else {
            generalStore.error = 'Không thể lưu dữ liệu. Vui lòng thử lại!';
          }
        } catch (err) {
          console.error('Lỗi khi gửi form:', err.message);
          generalStore.error = 'Có lỗi xảy ra. Vui lòng thử lại!';
        }
      } else {
        // Nếu auth không hợp lệ, điều hướng sang trang đăng nhập
        router.push('/dang-nhap');
      }
    } catch (error) {
      console.error('Lỗi khi parse auth từ localStorage:', error);
      router.push('/dang-nhap');
    }
  } else {
    // Nếu không có auth trong localStorage, điều hướng sang trang đăng nhập
    router.push('/dang-nhap');
  }
};
</script>

<style scoped>
.fade-in {
  animation: fadeIn 1s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.absolute.inset-0.z-0 div:nth-child(1) {
  animation: float 8s ease-in-out infinite;
}
.absolute.inset-0.z-0 div:nth-child(2) {
  animation: float 10s ease-in-out infinite 2s;
}
.absolute.inset-0.z-0 div:nth-child(3) {
  animation: float 12s ease-in-out infinite 1s;
}
</style>