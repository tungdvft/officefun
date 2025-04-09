<template>
  <section class="container mx-auto mb-16">
    <h2 class="text-3xl font-bold text-center mb-12 text-purple-800">Các Con Số Cốt Lõi</h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg overflow-hidden shadow-md numerology-card">
        <div class="bg-purple-100 p-4">
          <h3 class="text-xl font-bold text-purple-800">Số Đường Đời</h3>
        </div>
        <div class="p-4">
          <p class="text-gray-600 mb-4">Con số quan trọng nhất, tính từ ngày sinh, thể hiện mục đích sống và bài học bạn cần học trong cuộc đời.</p>
          <NuxtLink to="/duong-doi" class="text-purple-600 font-medium hover:text-purple-800">Tính ngay →</NuxtLink>
        </div>
      </div>
      
      <div class="bg-white rounded-lg overflow-hidden shadow-md numerology-card">
        <div class="bg-purple-100 p-4">
          <h3 class="text-xl font-bold text-purple-800">Số Linh Hồn</h3>
        </div>
        <div class="p-4">
          <p class="text-gray-600 mb-4">Tính từ nguyên âm trong tên, thể hiện ước muốn sâu thẳm trong trái tim bạn, động lực nội tại thúc đẩy bạn.</p>
          <NuxtLink to="/linh-hon" class="text-purple-600 font-medium hover:text-purple-800">Tìm hiểu →</NuxtLink>
        </div>
      </div>
      
      <div class="bg-white rounded-lg overflow-hidden shadow-md numerology-card">
        <div class="bg-purple-100 p-4">
          <h3 class="text-xl font-bold text-purple-800">Số Nhân Cách</h3>
        </div>
        <div class="p-4">
          <p class="text-gray-600 mb-4">Tính từ phụ âm trong tên, thể hiện cách bạn thể hiện ra bên ngoài, ấn tượng đầu tiên bạn tạo ra với người khác.</p>
          <NuxtLink to="/nhan-cach" class="text-purple-600 font-medium hover:text-purple-800">Khám phá →</NuxtLink>
        </div>
      </div>
      
      <div class="bg-white rounded-lg overflow-hidden shadow-md numerology-card">
        <div class="bg-purple-100 p-4">
          <h3 class="text-xl font-bold text-purple-800">Số Sứ Mệnh</h3>
        </div>
        <div class="p-4">
          <p class="text-gray-600 mb-4">Tính từ toàn bộ tên gọi, thể hiện tài năng bẩm sinh và cách bạn có thể cống hiến tốt nhất cho thế giới.</p>
          <NuxtLink to="/su-menh" class="text-purple-600 font-medium hover:text-purple-800">Xem ngay →</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.numerology-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.numerology-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>