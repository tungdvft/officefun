<template>
  <section class="bg-hero text-white py-12 md:py-16">
    <div class="container mx-auto px-4">
      <div class="flex flex-col lg:flex-row items-center">
        <div class="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
          <h2 class="text-4xl md:text-5xl font-bold mb-6 fade-in">Khám Phá Bản Thân Qua Thần Số Học</h2>
          <p class="text-xl mb-8 fade-in">Con số ngày sinh và tên gọi của bạn tiết lộ nhiều điều thú vị về tính cách, sứ mệnh và tiềm năng của bạn.</p>
          <div class="flex flex-col sm:flex-row gap-4 fade-in">
            <NuxtLink to="#calculator" class="bg-white text-purple-800 font-bold py-3 px-6 rounded-full hover:bg-purple-100 transition duration-300 flex items-center">
              Tính Số Của Bạn
              <font-awesome-icon :icon="['fas', 'calculator']" class="ml-2 text-lg" />
            </NuxtLink>
            <NuxtLink to="/blog" class="border-2 border-white text-white font-bold py-3 px-6 rounded-full hover:bg-white hover:text-purple-800 transition duration-300 flex items-center">
              Tìm Hiểu Thêm
              <font-awesome-icon :icon="['fas', 'book-open']" class="ml-2 text-lg" />
            </NuxtLink>
          </div>
        </div>

        <div class="lg:w-1/2 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 class="text-2xl font-bold mb-4">Nhập thông tin của bạn</h3>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label for="fullname" class="block mb-2 font-medium">Họ và tên</label>
              <input type="text" id="fullname" v-model="form.fullname" class="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-white placeholder-opacity-70 focus:ring-2 focus:ring-white focus:border-transparent" placeholder="Nguyễn Văn A">
            </div>

            <div>
              <label for="birthdate" class="block mb-2 font-medium">Ngày sinh</label>
              <input type="date" id="birthdate" v-model="form.birthdate" class="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white focus:ring-2 focus:ring-white focus:border-transparent">
            </div>

            <div class="pt-2">
              <button type="submit" class="w-full bg-white text-purple-800 font-bold py-3 px-4 rounded-lg hover:bg-purple-100 transition duration-300 flex items-center justify-center">
                Phân tích ngay
                <font-awesome-icon :icon="['fas', 'arrow-right']" class="ml-2 text-lg" />
              </button>
            </div>

            <p class="text-sm text-white text-opacity-80">Bằng việc nhấn nút trên, bạn đồng ý với <NuxtLink to="/dieu-khoan" class="underline hover:text-yellow-200">Điều khoản sử dụng</NuxtLink> của chúng tôi.</p>
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
/* Thay bg-numerology bằng ảnh nền huyền bí */
.bg-hero {
  background-image: url('https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Hiệu ứng fade-in */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>