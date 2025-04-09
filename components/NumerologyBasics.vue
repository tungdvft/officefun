<template>
  <section class="mb-16 bg-purple-50 py-12">
    <div class="container mx-auto ">
    <h2 class="text-3xl font-bold text-center mb-12 text-purple-800">Thần Số Học Là Gì?</h2>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="bg-white p-6 rounded-xl shadow-md numerology-card">
        <div class="text-purple-600 mb-4">
          <font-awesome-icon :icon="['fas', 'history']" class="text-4xl" />
        </div>
        <h3 class="text-xl font-bold mb-3 text-gray-800">Nguồn Gốc</h3>
        <p class="text-gray-600">Thần số học có nguồn gốc từ thời Pythagoras, nhà toán học Hy Lạp cổ đại, người tin rằng vũ trụ được xây dựng bằng quyền năng của các con số.</p>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-md numerology-card">
        <div class="text-purple-600 mb-4">
          <font-awesome-icon :icon="['fas', 'key']" class="text-4xl" />
        </div>
        <h3 class="text-xl font-bold mb-3 text-gray-800">Ý Nghĩa</h3>
        <p class="text-gray-600">Mỗi con số từ 1 đến 9 và các số đặc biệt như 11, 22 đều mang năng lượng và ý nghĩa riêng, ảnh hưởng đến tính cách và cuộc đời mỗi người.</p>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-md numerology-card">
        <div class="text-purple-600 mb-4">
          <font-awesome-icon :icon="['fas', 'user']" class="text-4xl" />
        </div>
        <h3 class="text-xl font-bold mb-3 text-gray-800">Ứng Dụng</h3>
        <p class="text-gray-600">Thần số học giúp bạn hiểu bản thân, phát huy điểm mạnh, cải thiện điểm yếu, chọn nghề nghiệp phù hợp và xây dựng các mối quan hệ tốt đẹp hơn.</p>
      </div>
    </div>
    </div>
  </section>
</template>

<style scoped>
/* Hiệu ứng hover cho card */
.numerology-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.numerology-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Nếu muốn thêm background ảnh thay vì màu solid */
/*
.bg-numerology {
  background-image: url('https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
*/
</style>