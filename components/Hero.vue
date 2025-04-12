<template>
  <section class="text-gray-800 py-12 md:py-16 relative overflow-hidden">
    <!-- Background với overlay cực nhẹ -->
    <div class="absolute inset-0 z-0">
      <img
        src="/tsh.avif"
        alt="Soft background"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <div class="flex flex-col lg:flex-row items-center">
        <div class="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
          <h2
            class="text-4xl md:text-5xl font-bold mb-6 fade-in bg-clip-text text-white"
          >
            Khám Phá Bản Thân Qua Thần Số Học
          </h2>
          <p class="text-xl mb-8 fade-in text-white">
            Con số ngày sinh và tên gọi của bạn tiết lộ nhiều điều thú vị về tính
            cách, sứ mệnh và tiềm năng của bạn.
          </p>
          <!-- <div class="flex flex-col sm:flex-row gap-4 fade-in">
            <NuxtLink
              to="#calculator"
              class="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-6 rounded-full hover:from-purple-600 hover:to-blue-600 transition duration-300 flex items-center shadow-sm"
            >
              Tính Số Của Bạn
              <font-awesome-icon
                :icon="['fas', 'calculator']"
                class="ml-2 text-lg"
              />
            </NuxtLink>
          </div> -->
        </div>

        <!-- Form section đơn giản -->
        <div
          class="lg:w-1/2 bg-white/90 rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 class="text-2xl font-bold mb-4 text-gray-800">
            Nhập thông tin của bạn
          </h3>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label for="fullname" class="block mb-2 font-medium text-gray-700"
                >Họ và tên</label
              >
              <input
                type="text"
                id="fullname"
                v-model="form.fullname"
                class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-300 focus:border-transparent focus:outline-none transition duration-200"
                placeholder="Nguyễn Văn A"
                required
              />
            </div>

            <div>
              <label for="birthdate" class="block mb-2 font-medium text-gray-700"
                >Ngày sinh</label
              >
              <input
                type="text"
                id="birthdate"
                v-model="form.birthdate"
                pattern="\d{2}/\d{2}/\d{4}"
                placeholder="DD/MM/YYYY"
                class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 focus:ring-2 focus:ring-purple-300 focus:border-transparent focus:outline-none transition duration-200"
                required
              />
            </div>

            <div class="pt-2">
             <button
                type="submit"
                :disabled="userStore.isLoading"
                class="w-full inline-flex justify-center items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                <template v-if="userStore.isLoading">
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
                    <span>Đang phân tích...</span>
                </template>
                <template v-else>
                    <span>Phân tích ngay</span>
                </template>
                </button>
            </div>

            <p v-if="userStore.error" class="text-red-500 text-sm text-center">
              {{ userStore.error }}
            </p>

            <p class="text-sm text-gray-500">
              Bằng việc nhấn nút trên, bạn đồng ý với
              <NuxtLink
                to="/dieu-khoan-su-dung"
                class="text-purple-600 hover:text-purple-900 transition duration-200"
              >
                Điều khoản sử dụng
              </NuxtLink>
              của chúng tôi.
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useUserStore } from "~/stores/general";

// Khởi tạo form
const form = ref({
  fullname: "",
  birthdate: "",
});

// Khởi tạo store và router
const userStore = useUserStore();
const router = useRouter();

// Hàm submit form
const submitForm = async () => {
  await userStore.fetchNumerology({
    fullname: form.value.fullname,
    birthdate: form.value.birthdate,
  });

  if (!userStore.error) {
    router.push("/xem");
  }
};
</script>

<style scoped>
.fade-in {
  animation: fadeIn 1.2s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.absolute.inset-0.z-0 {
  z-index: 0;
}
</style>