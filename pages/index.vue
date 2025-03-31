<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Banner -->
    <section class="gradient-bg text-white py-20 px-6 text-center">
      <div class="max-w-4xl mx-auto">
        <nuxt-img 
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iaW5maW5pdHlHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM1QjIxQjY7c3RvcC1vcGFjaXR5OjEiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojQTc4QkZBO3N0b3Atb3BhY2l0eToxIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJzdGFyR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkJCRjI0O3N0b3Atb3BhY2l0eToxIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGRDcwMDtzdG9wLW9wYWNpdHk6MSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggZD0iTTIwIDUwIFE0MCAxMCA2MCA1MCBRODAgOTAgMTAwIDUwIFE4MCAxMCA2MCA1MCBRNDAgOTAgMjAgNTAiIAogICAgICAgIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCNpbmZpbml0eUdyYWRpZW50KSIgc3Ryb2tlLXdpZHRoPSI4IiBzdHJva2UtY2FwbGluZT0icm91bmQiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLW9wYWNpdHkiIHZhbHVlcz0iMTswLjc7MSIgc3Rva2UtY2FwbGluZT0icm91bmQiIGR1cj0iMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgICA8L3BhdGg+CiAgPHBhdGggZD0iTTIwIDUwIFE0MCAxMCA2MCA1MCBRODAgOTAgMTAwIDUwIFE4MCAxMCA2MCA1MCBRNDAgOTAgMjAgNTAiIAogICAgICAgIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzhCNUNGNiIgc3Ryb2tlLXdpZHRoPSIxMiIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIvPgogIDxwb2x5Z29uIHBvaW50cz0iNjAsNDUgNjIsNTAgNjcsNTAgNjMsNTMgNjQsNTggNjAsNTUgNTYsNTggNTcsNTMgNTMsNTAgNTgsNTAiIAogICAgICAgIGZpbGw9InVybCgjc3RhckdyYWRpZW50KSIgLz4KPC9zdmc+Cg==" 
          alt="Logo Thần Số Học" 
          class="mx-auto mb-6 w-24 h-16"
        />
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Khám Phá Con Số Định Mệnh Của Bạn</h1>
        <p class="text-lg md:text-xl mb-8">Ứng dụng Thần Số Học AI - Công cụ mạnh mẽ giúp bạn hiểu bản thân qua con số.</p>
        <nuxt-link to="/dashboard" class="bg-white text-purple-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
          Dùng Ngay
        </nuxt-link>
      </div>
    </section>

    <!-- Features -->
    <section class="py-16 px-6">
      <div class="max-w-6xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-12">Tại Sao Chọn Thần Số Học AI?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="feature-card bg-white p-6 rounded-lg shadow-md">
            <svg class="w-12 h-12 mx-auto mb-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <h3 class="text-xl font-semibold mb-2">AI Với Dữ Liệu Khổng Lồ</h3>
            <p class="text-gray-600">Phân tích chính xác nhờ AI được huấn luyện với lượng dữ liệu thần số học khổng lồ.</p>
          </div>
          <div class="feature-card bg-white p-6 rounded-lg shadow-md">
            <svg class="w-12 h-12 mx-auto mb-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-xl font-semibold mb-2">Giao Diện Trực Quan</h3>
            <p class="text-gray-600">Thiết kế đẹp mắt, dễ nhìn, giúp bạn nhanh chóng nắm bắt thông tin.</p>
          </div>
          <div class="feature-card bg-white p-6 rounded-lg shadow-md">
            <svg class="w-12 h-12 mx-auto mb-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <h3 class="text-xl font-semibold mb-2">Tương Tác Dễ Dàng</h3>
            <p class="text-gray-600">Thao tác đơn giản, phù hợp với mọi người dùng, từ mới bắt đầu đến chuyên gia.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services (Solo: Ảnh bên trái, Text bên phải) -->
    <section class="py-16 px-6 bg-gray-100">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold mb-12 text-center">Dịch Vụ Nổi Bật</h2>
        <div class="space-y-12">
          <div v-for="(service, index) in services" :key="index" class="flex flex-col md:flex-row items-center gap-6">
            <nuxt-img 
              :src="`https://via.placeholder.com/300x200?text=${service.title}`" 
              :alt="service.title" 
              class="w-full md:w-1/2 rounded-lg shadow-md"
            />
            <div class="w-full md:w-1/2 text-center md:text-left">
              <h3 class="text-2xl font-semibold mb-2">{{ service.title }}</h3>
              <p class="text-gray-600">{{ service.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials (Cải tiến) -->
    <section class="py-16 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-12">Người Dùng Nói Gì?</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
            <p class="text-gray-600 italic mb-4">"{{ testimonial.text }}"</p>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-purple-800 font-bold">
                {{ testimonial.name.charAt(0) }}
              </div>
              <p class="ml-4 font-semibold">{{ testimonial.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQs (Accordion) -->
    <section class="py-16 px-6 bg-gray-100">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold mb-12 text-center">Câu Hỏi Thường Gặp</h2>
        <div class="space-y-4">
          <div v-for="(faq, index) in faqs" :key="index" class="bg-white rounded-lg shadow-md">
            <button 
              @click="toggleFaq(index)" 
              class="w-full text-left p-4 flex justify-between items-center focus:outline-none"
            >
              <h3 class="text-xl font-semibold">{{ faq.question }}</h3>
              <svg :class="{ 'rotate-180': openFaq === index }" class="w-6 h-6 text-purple-600 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="openFaq === index" class="p-4 pt-0 text-gray-600">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="gradient-bg text-white py-16 px-6 text-center">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Sẵn Sàng Khám Phá?</h2>
        <p class="text-lg md:text-xl mb-8">Hãy để Thần Số Học AI dẫn bạn đến những bí ẩn của cuộc sống!</p>
        <nuxt-link to="/dashboard" class="bg-white text-purple-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
          Bắt Đầu Ngay
        </nuxt-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Services (8 dịch vụ)
const services = [
  { title: 'Đặt Tên Con', description: 'Tìm tên hoàn hảo cho bé dựa trên thần số học và ý nghĩa sâu sắc.' },
  { title: 'Bản Đồ Thành Công', description: 'Khám phá con đường sự nghiệp và cuộc sống qua con số cá nhân.' },
  { title: 'Đặt Tên Thương Hiệu', description: 'Xây dựng thương hiệu mạnh mẽ với tên gọi hợp phong thủy số học.' },
  { title: 'Định Hướng Nghề Nghiệp', description: 'Xác định hướng đi nghề nghiệp phù hợp với con số định mệnh.' },
  { title: 'Thần Số Học Trọn Đời', description: 'Phân tích toàn diện cuộc đời bạn qua các con số quan trọng.' },
  { title: 'Kiểm Tra Mức Độ Hợp Nhau', description: 'Đánh giá sự tương thích giữa bạn và người khác qua số học.' },
  { title: 'Số Học Phong Thủy', description: 'Ứng dụng thần số học để tối ưu phong thủy cho cuộc sống.' },
  { title: 'Tư Vấn Cá Nhân', description: 'Nhận lời khuyên cá nhân hóa từ AI dựa trên số liệu của bạn.' },
];

// Testimonials
const testimonials = [
  { text: 'Ứng dụng này giúp tôi hiểu rõ hơn về bản thân qua con số. Giao diện đẹp và dễ dùng!', name: 'Nguyễn Minh Anh' },
  { text: 'Tôi đã tìm được tên cho con rất ý nghĩa nhờ AI của app. Rất đáng thử!', name: 'Trần Văn Hùng' },
];

// FAQs (Accordion)
const faqs = [
  { question: 'Thần Số Học AI là gì?', answer: 'Đây là ứng dụng sử dụng AI để phân tích con số định mệnh của bạn dựa trên thần số học.' },
  { question: 'App có miễn phí không?', answer: 'Chúng tôi cung cấp bản dùng thử miễn phí, với các tính năng nâng cao trong gói trả phí.' },
  { question: 'Làm sao để bắt đầu?', answer: 'Chỉ cần đăng ký và nhập ngày sinh, bạn sẽ nhận được phân tích ngay lập tức.' },
];
const openFaq = ref(null);
const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? null : index;
};
</script>

<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, #5B21B6, #A78BFA);
}
.feature-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>