<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Banner -->
    <section class="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-32 overflow-hidden">
      <div class="absolute inset-0 -z-10 bg-cover bg-center opacity-30" style="background-image: url('/cosmic-bg.png')"></div>
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 items-center relative z-10">
        <div class="text-left">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">Khám Phá Vận Mệnh Độc Nhất Của Bạn</h1>
          <p class="text-lg md:text-2xl mb-4">Ứng dụng tiên phong kết hợp AI với Tarot & Thần Số Học</p>
          <p class="text-md md:text-lg mb-8 italic opacity-90">Cá nhân hóa tối ưu – Tương tác sống động</p>
          <button @click="scrollToFeatures" class="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-100 transition">
            Bắt Đầu Hành Trình
          </button>
        </div>
        <div class="hidden lg:block">
          <!-- <img src="/hero-illustration.png" alt="Hero Illustration" class="w-full max-w-md mx-auto"> -->
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-16 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Tính Năng Nổi Bật</h2>
        <div class="space-y-16">
          <!-- Tarot Theo Ngày -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div class="text-center md:text-left">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Bói Tarot Theo Ngày</h3>
              <p class="text-gray-600">Nhận dự đoán mỗi ngày với bài Tarot đơn giản, nhanh chóng.</p>
            </div>
            <div>
              <!-- <img src="/tarot-day.png" alt="Tarot Day" class="w-full max-w-xs mx-auto"> -->
            </div>
          </div>
          <!-- Tarot 3 Lá -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div class="order-1 md:order-2 text-center md:text-left">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Tarot 3 Lá</h3>
              <p class="text-gray-600">Khám phá tình yêu, sự nghiệp, và tương lai qua 3 lá bài chi tiết.</p>
            </div>
            <div class="order-2 md:order-1">
              <!-- <img src="/tarot-3.png" alt="Tarot 3 Lá" class="w-full max-w-xs mx-auto"> -->
            </div>
          </div>
          <!-- Tarot Celtic 5 Lá -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div class="text-center md:text-left">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Tarot Celtic 5 Lá</h3>
              <p class="text-gray-600">Phân tích sâu sắc vận mệnh với trải bài Celtic 5 lá cổ điển.</p>
            </div>
            <div>
              <!-- <img src="/tarot-celtic.png" alt="Tarot Celtic" class="w-full max-w-xs mx-auto"> -->
            </div>
          </div>
          <!-- Thần Số Học -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div class="order-1 md:order-2 text-center md:text-left">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Thần Số Học</h3>
              <p class="text-gray-600">Hiểu bản thân qua các con số và nhận lời khuyên thực tế.</p>
            </div>
            <div class="order-2 md:order-1">
              <!-- <img src="/numerology.png" alt="Numerology" class="w-full max-w-xs mx-auto"> -->
            </div>
          </div>
        </div>
      </div>
    </section>
<!-- Testimonials Section -->
    <section class="py-16 bg-gray-100">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Họ Đã Trầm Trồ Gì Về Chúng Tôi</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md text-center">
            <p class="text-gray-600 mb-4">"Tôi hoàn toàn bị cuốn hút! Thần Số Học mở ra cánh cửa bí ẩn về chính tôi, như một phép màu!"</p>
            <p class="font-semibold text-gray-800">Nguyễn Thị Lan</p>
            <p class="text-sm text-gray-500">Hà Nội</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md text-center">
            <p class="text-gray-600 mb-4">"Tarot 3 lá quá đỉnh! Tôi rùng mình vì độ chính xác, như có ai đó đọc được tâm hồn tôi vậy!"</p>
            <p class="font-semibold text-gray-800">Trần Văn Hùng</p>
            <p class="text-sm text-gray-500">TP. HCM</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md text-center">
            <p class="text-gray-600 mb-4">"Celtic 5 lá làm tôi kinh ngạc! Chi tiết đến từng ngóc ngách vận mệnh, không thể tin nổi!"</p>
            <p class="font-semibold text-gray-800">Lê Minh Thư</p>
            <p class="text-sm text-gray-500">Đà Nẵng</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Count-Up Section -->
    <section class="py-16 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-12">Thành Tựu Của Chúng Tôi</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span class="text-5xl font-bold block mb-2">{{ displayedUsers }}</span>
            <span class="text-xl">Người Dùng</span>
          </div>
          <div>
            <span class="text-5xl font-bold block mb-2">{{ displayedTarot }}</span>
            <span class="text-xl">Lượt Xem Tarot</span>
          </div>
          <div>
            <span class="text-5xl font-bold block mb-2">{{ displayedNumerology }}</span>
            <span class="text-xl">Lượt Xem Thần Số Học</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Table -->
    <section id="pricing" class="py-16 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Gói Thành Viên</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div class="p-6 bg-gray-50 rounded-lg shadow-md text-center">
            <h3 class="text-2xl font-semibold text-gray-800 mb-4">Gói Cơ Bản</h3>
            <p class="text-4xl font-bold text-purple-600 mb-4">200.000 VND</p>
            <ul class="text-gray-600 mb-6 space-y-2">
              <li>Truy cập Tarot Theo Ngày</li>
              <li>Tarot 3 Lá không giới hạn</li>
              <li>Hỗ trợ cơ bản</li>
            </ul>
            <button @click="subscribe('basic')" class="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition">
              Đăng Ký Ngay
            </button>
          </div>
          <div class="p-6 bg-gray-50 rounded-lg shadow-md text-center border-2 border-purple-600">
            <h3 class="text-2xl font-semibold text-gray-800 mb-4">Gói Cao Cấp</h3>
            <p class="text-4xl font-bold text-purple-600 mb-4">300.000 VND</p>
            <ul class="text-gray-600 mb-6 space-y-2">
              <li>Tất cả tính năng Gói Cơ Bản</li>
              <li>Tarot Celtic 5 Lá</li>
              <li>Thần Số Học nâng cao</li>
              <li>Hỗ trợ ưu tiên</li>
            </ul>
            <button @click="subscribe('premium')" class="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition">
              Đăng Ký Ngay
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 bg-gray-100">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Câu Hỏi Thường Gặp</h2>
        <div class="max-w-2xl mx-auto space-y-6">
          <div v-for="(faq, index) in faqs" :key="index" class="bg-white p-6 rounded-lg shadow-md">
            <button @click="toggleFaq(index)" class="w-full text-left flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-800">{{ faq.question }}</span>
              <span>{{ faq.open ? '-' : '+' }}</span>
            </button>
            <transition name="fade">
              <p v-if="faq.open" class="mt-4 text-gray-600">{{ faq.answer }}</p>
            </transition>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// State cho FAQ
const faqs = ref([
  { question: 'Bói Tarot có chính xác không?', answer: 'Tarot là công cụ phản ánh năng lượng hiện tại, kết quả phụ thuộc vào cách bạn diễn giải.', open: false },
  { question: 'Gói trả phí có thời hạn bao lâu?', answer: 'Cả hai gói đều là thành viên vĩnh viễn, chỉ trả một lần!', open: false },
  { question: 'Tôi có thể dùng app trên nhiều thiết bị không?', answer: 'Có, chỉ cần đăng nhập bằng tài khoản của bạn.', open: false },
]);

// State cho count-up
const usersTarget = ref(5000); // Người dùng
const tarotTarget = ref(15000); // Lượt xem Tarot
const numerologyTarget = ref(10000); // Lượt xem Thần Số Học
const displayedUsers = ref(0);
const displayedTarot = ref(0);
const displayedNumerology = ref(0);

// Hàm đếm tăng dần không dùng thư viện
const animateCount = (startRef, targetRef, duration = 2000) => {
  let start = 0;
  const end = targetRef.value;
  const stepTime = Math.abs(Math.floor(duration / end));
  
  const timer = setInterval(() => {
    start += Math.ceil(end / 100); // Tăng dần theo phần trăm cho mượt
    startRef.value = start;
    if (start >= end) {
      startRef.value = end;
      clearInterval(timer);
    }
  }, stepTime);
};

// Hàm scroll đến features
const scrollToFeatures = () => {
  document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
};

// Hàm toggle FAQ
const toggleFaq = (index) => {
  faqs.value[index].open = !faqs.value[index].open;
};

// Hàm xử lý đăng ký gói
const subscribe = (plan) => {
  if (plan === 'basic') {
    alert('Đăng ký Gói Cơ Bản 200k VND - Chuyển hướng đến thanh toán...');
    // Thêm logic thanh toán ở đây
  } else if (plan === 'premium') {
    alert('Đăng ký Gói Cao Cấp 300k VND - Chuyển hướng đến thanh toán...');
    // Thêm logic thanh toán ở đây
  }
};

// Khởi chạy đếm khi component mounted
onMounted(() => {
  animateCount(displayedUsers, usersTarget);
  animateCount(displayedTarot, tarotTarget);
  animateCount(displayedNumerology, numerologyTarget);
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>