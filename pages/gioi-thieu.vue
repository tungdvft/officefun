<template>
    <div class="min-h-screen bg-gradient-to-b from-purple-50 to-white">
    <!-- Hero Section -->
    <section class="relative py-20 text-center overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
      
      <div class="container mx-auto px-4 relative z-10">
        <h1 class="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
          <span class="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Sự kết hợp </span> giữa hiện đại và cổ điển
        </h1>
        <p class="text-xl md:text-2xl max-w-3xl mx-auto mb-8 opacity-90">
           Công nghệ AI tiên tiến kết hợp với kho dữ liệu thần số học khổng lồ giúp bạn hiểu rõ bản thân và định hướng tương lai.
        </p>
      </div>
    </section>
    <!-- About Content -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center gap-12">
          <div class="md:w-1/2">
            <div class="relative">
              <div class="absolute -top-6 -left-6 w-32 h-32 bg-purple-100 rounded-full z-0"></div>
              <div class="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Phân tích thần số học" 
                  class="rounded-lg shadow-lg w-full h-auto"
                >
              </div>
              <div class="absolute -bottom-6 -right-6 w-24 h-24 bg-pink-100 rounded-full z-0"></div>
            </div>
          </div>
          
          <div class="md:w-1/2">
            <h2 class="text-3xl md:text-4xl font-bold text-purple-900 mb-6">
              <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Hệ thống</span> Phân Tích Thần Số Học Thông Minh
            </h2>
            <p class="text-gray-700 text-lg mb-6">
              Chúng tôi sử dụng trí tuệ nhân tạo để phân tích sâu các con số trong ngày sinh và tên của bạn, từ đó đưa ra những dự đoán chính xác về tính cách, sự nghiệp và các mối quan hệ.
            </p>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start">
                <svg class="w-5 h-5 text-purple-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7z" />
                </svg>
                <span class="text-gray-700">Phân tích đa chiều dựa trên ngày sinh và tên</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-purple-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7z" />
                </svg>
                <span class="text-gray-700">Dự báo xu hướng theo năm, tháng, ngày</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-purple-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7z" />
                </svg>
                <span class="text-gray-700">Gợi ý hướng phát triển phù hợp với năng lượng số</span>
              </li>
            </ul>
            <!-- <a href="/about" class="inline-flex items-center text-purple-600 font-medium hover:text-purple-900">
              Tìm hiểu thêm
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a> -->
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1 bg-purple-100 text-purple-900 rounded-full text-sm font-semibold mb-4">TÍNH NĂNG NỔI BẬT</span>
          <h2 class="text-3xl md:text-4xl font-bold text-purple-900">
            Giải Mã <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Vận Mệnh</span> Toàn Diện
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto mt-4">
            Các công cụ mạnh mẽ giúp bạn hiểu rõ bản thân và đưa ra quyết định sáng suốt
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="(feature, index) in features"
            :key="index"
            class="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-white hover:border-purple-200"
          >
            <div v-html="feature.icon" class="w-14 h-14 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-6">
             
            </div>
            <h3 class="text-xl font-semibold text-purple-900 mb-3">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonial Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 shadow-inner">
          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="md:w-1/3">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80" 
                alt="Khách hàng" 
                class="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
              >
            </div>
            <div class="md:w-2/3 text-center md:text-left">
              <div class="text-purple-600 mb-4">
                ★ ★ ★ ★ ★
              </div>
              <blockquote class="text-xl italic text-gray-700 mb-6">
                "Nhờ phân tích thần số học, tôi đã tìm được hướng đi đúng đắn cho sự nghiệp. Những dự báo hàng tháng cực kỳ chính xác và hữu ích!"
              </blockquote>
              <div>
                <p class="font-semibold text-purple-900">Chị Nguyễn Thị Hương</p>
                <p class="text-gray-600">Doanh nhân - Hà Nội</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-16 bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          Sẵn sàng khám phá <span class="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">con số định mệnh</span> của bạn?
        </h2>
        <p class="text-xl max-w-2xl mx-auto mb-8 opacity-90">
          Đăng ký ngay để nhận báo cáo thần số học miễn phí và bắt đầu hành trình khám phá bản thân!
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <a href="/dang-ky" class="inline-block bg-white text-purple-900 py-3 px-8 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg">
            Đăng ký miễn phí
          </a>
         
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const features = [
  {
    title: "Báo cáo toàn diện",
    description: "Phân tích chi tiết đường đời, linh hồn và định mệnh dựa trên ngày sinh và tên của bạn.",
    icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m-4-4h8m-8-6h12" />
           </svg>`
  },
  {
    title: "Dự báo theo chu kỳ",
    description: "Dự đoán xu hướng theo năm cá nhân, tháng cá nhân giúp bạn chủ động trong mọi quyết định.",
    icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
           </svg>`
  },
  {
    title: "Hướng nghiệp số học",
    description: "Gợi ý nghề nghiệp phù hợp nhất với năng lượng số của bạn để phát huy tối đa tiềm năng.",
    icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
           </svg>`
  },
  {
    title: "Hợp nhau theo số",
    description: "Đo lường mức độ hòa hợp trong các mối quan hệ quan trọng như tình yêu, đối tác, gia đình.",
    icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
           </svg>`
  },
  {
    title: "Đặt tên hoàn hảo",
    description: "Tư vấn đặt tên con, bút danh, thương hiệu dựa trên nguyên lý cân bằng năng lượng số.",
    icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0l-4.586-4.586" />
           </svg>`
  },
  {
    title: "Ngày tốt quan trọng",
    description: "Chọn ngày cưới, khai trương, ký kết hợp đồng phù hợp với vận số của bạn.",
    icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>`
  }
];
</script>

<style scoped>
/* Animation keyframes */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    transform: translateY(20px);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from { 
    transform: translateY(40px);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulseOnce {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes blob {
  0% { transform: translate(0,0) scale(1); }
  33% { transform: translate(30px,-50px) scale(1.1); }
  66% { transform: translate(-20px,20px) scale(0.9); }
  100% { transform: translate(0,0) scale(1); }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-slide-up {
  animation: slideUp 1s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 1s ease-out;
}

.animate-pulse-once {
  animation: pulseOnce 1.5s ease-in-out;
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>