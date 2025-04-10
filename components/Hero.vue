<template>
  <section class="text-gray-800 py-12 md:py-16 relative overflow-hidden">
    <!-- Background với overlay cực nhẹ -->
    <div class="absolute inset-0 z-0">
      <img 
        src="/tsh.avif"
        alt="Soft background"
        class="w-full h-full object-cover"
      />
      <!-- <div class="absolute inset-0 bg-white opacity-20"></div> -->
    </div>
    
    <div class="container mx-auto px-4 relative z-10">
      <div class="flex flex-col lg:flex-row items-center">
        <div class="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
          <!-- Heading với text gradient tím -> xanh nhẹ -->
          <h2 class="text-4xl md:text-5xl font-bold mb-6 fade-in bg-clip-text text-white">
            Khám Phá Bản Thân Qua Thần Số Học
          </h2>
          
          <!-- Subheading màu tự nhiên -->
          <p class="text-xl mb-8 fade-in text-white">
            Con số ngày sinh và tên gọi của bạn tiết lộ nhiều điều thú vị về tính cách, sứ mệnh và tiềm năng của bạn.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 fade-in">
            <NuxtLink 
              to="#calculator" 
              class="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-6 rounded-full hover:from-purple-600 hover:to-blue-600 transition duration-300 flex items-center shadow-sm"
            >
              Tính Số Của Bạn
              <font-awesome-icon :icon="['fas', 'calculator']" class="ml-2 text-lg" />
            </NuxtLink>
            <!-- <NuxtLink 
              to="/blog" 
              class="border-2 border-purple-500 text-purple-600 font-bold py-3 px-6 rounded-full hover:bg-purple-50 transition duration-300 flex items-center"
            >
              Tìm Hiểu Thêm
              <font-awesome-icon :icon="['fas', 'book-open']" class="ml-2 text-lg" />
            </NuxtLink> -->
          </div>
        </div>

        <!-- Form section đơn giản -->
        <div class="lg:w-1/2 bg-white/90 rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 class="text-2xl font-bold mb-4 text-gray-800">
            Nhập thông tin của bạn
          </h3>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label for="fullname" class="block mb-2 font-medium text-gray-700">Họ và tên</label>
              <input 
                type="text" 
                id="fullname" 
                v-model="form.fullname" 
                class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-300 focus:border-transparent focus:outline-none transition duration-200"
                placeholder="Nguyễn Văn A"
              >
            </div>

            <div>
              <label for="birthdate" class="block mb-2 font-medium text-gray-700">Ngày sinh</label>
              <input 
                type="date" 
                id="birthdate" 
                v-model="form.birthdate" 
                class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 focus:ring-2 focus:ring-purple-300 focus:border-transparent focus:outline-none transition duration-200"
              >
            </div>

            <div class="pt-2">
              <button 
                type="submit" 
                class="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition duration-300 flex items-center justify-center shadow-sm"
              >
                Phân tích ngay
                <font-awesome-icon :icon="['fas', 'arrow-right']" class="ml-2 text-lg" />
              </button>
            </div>

            <p class="text-sm text-gray-500">
              Bằng việc nhấn nút trên, bạn đồng ý với 
              <NuxtLink to="/dieu-khoan" class="text-purple-600 hover:text-purple-800 transition duration-200">
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

<script>
export default {
  data() {
    return {
      form: {
        fullname: '',
        birthdate: ''
      }
    }
  },
  methods: {
    submitForm() {
      this.$toast.success('Cảm ơn bạn đã nhập thông tin! Chúng tôi sẽ phân tích và gửi kết quả cho bạn sớm nhất.')
    }
  }
}
</script>

<style scoped>
/* Hiệu ứng fade-in nhẹ nhàng */
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

/* Đảm bảo background hiển thị đúng */
.absolute.inset-0.z-0 {
  z-index: 0;
}
</style>