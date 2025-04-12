<template>
  <section class="py-16 bg-gradient-to-b from-purple-50 to-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-purple-900 mb-4">Ứng Dụng Thực Tế</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">Thần số học giúp bạn trong nhiều khía cạnh cuộc sống</p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- Use Case 1 -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="h-48 bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center">
            <font-awesome-icon :icon="['fas', 'baby']" class="text-6xl text-purple-600 opacity-80" />
          </div>
          <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-3">Đặt Tên Cho Con</h3>
            <p class="text-gray-600 mb-4">
              Chọn tên phù hợp với ngày sinh giúp trẻ phát huy tiềm năng, cân bằng năng lượng và có cuộc đời thuận lợi.
            </p>
            <ul class="space-y-2 text-purple-700">
              <li class="flex items-start">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="mt-1 mr-2 text-purple-500" />
                <span>Bổ sung năng lượng thiếu trong biểu đồ ngày sinh</span>
              </li>
              <li class="flex items-start">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="mt-1 mr-2 text-purple-500" />
                <span>Tạo đường đời hài hòa</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Use Case 2 -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="h-48 bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
            <font-awesome-icon :icon="['fas', 'user-tag']" class="text-6xl text-blue-600 opacity-80" />
          </div>
          <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-3">Biệt Danh/Nghệ Danh</h3>
            <p class="text-gray-600 mb-4">
              Tên gọi bạn sử dụng hàng ngày ảnh hưởng trực tiếp đến năng lượng và cách người khác nhìn nhận bạn.
            </p>
            <ul class="space-y-2 text-blue-700">
              <li class="flex items-start">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="mt-1 mr-2 text-blue-500" />
                <span>Tăng cường điểm mạnh cá nhân</span>
              </li>
              <li class="flex items-start">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="mt-1 mr-2 text-blue-500" />
                <span>Phù hợp với lĩnh vực hoạt động</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Use Case 3 -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="h-48 bg-gradient-to-r from-pink-100 to-rose-100 flex items-center justify-center">
            <font-awesome-icon :icon="['fas', 'store']" class="text-6xl text-pink-600 opacity-80" />
          </div>
          <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-3">Tên Thương Hiệu</h3>
            <p class="text-gray-600 mb-4">
              Tên doanh nghiệp mang năng lượng số học tốt sẽ thu hút khách hàng và tài lộc.
            </p>
            <ul class="space-y-2 text-pink-700">
              <li class="flex items-start">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="mt-1 mr-2 text-pink-500" />
                <span>Tạo ấn tượng mạnh với khách hàng</span>
              </li>
              <li class="flex items-start">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="mt-1 mr-2 text-pink-500" />
                <span>Hỗ trợ định vị thương hiệu</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Use Case 4 -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="h-48 bg-gradient-to-r from-yellow-100 to-amber-100 flex items-center justify-center">
            <font-awesome-icon :icon="['fas', 'heart']" class="text-6xl text-yellow-600 opacity-80" />
          </div>
          <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-3">Hôn Nhân</h3>
            <p class="text-gray-600 mb-4">
              Hiểu biết thần số giúp cải thiện mối quan hệ, tìm đối tác phù hợp và hóa giải xung đột.
            </p>
            <ul class="space-y-2 text-amber-700">
              <li class="flex items-start">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="mt-1 mr-2 text-amber-500" />
                <span>Phối hợp năng lượng vợ chồng</span>
              </li>
              <li class="flex items-start">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="mt-1 mr-2 text-amber-500" />
                <span>Chọn thời điểm kết hôn phù hợp</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Use Case 5 -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="h-48 bg-gradient-to-r from-green-100 to-teal-100 flex items-center justify-center">
            <font-awesome-icon :icon="['fas', 'briefcase']" class="text-6xl text-green-600 opacity-80" />
          </div>
          <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-3">Định Hướng Nghề Nghiệp</h3>
            <p class="text-gray-600 mb-4">
              Khám phá công việc phù hợp với năng lượng bẩm sinh để phát triển sự nghiệp thuận lợi.
            </p>
            <ul class="space-y-2 text-teal-700">
              <li class="flex items-start">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="mt-1 mr-2 text-teal-500" />
                <span>Xác định nghề nghiệp lý tưởng</span>
              </li>
              <li class="flex items-start">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="mt-1 mr-2 text-teal-500" />
                <span>Chọn thời điểm khởi nghiệp tốt nhất</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Use Case 6 -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="h-48 bg-gradient-to-r from-indigo-100 to-violet-100 flex items-center justify-center">
            <font-awesome-icon :icon="['fas', 'home']" class="text-6xl text-indigo-600 opacity-80" />
          </div>
          <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-3">Phong Thủy Nhà Ở</h3>
            <p class="text-gray-600 mb-4">
              Kết hợp thần số học với phong thủy để tạo không gian sống hài hòa năng lượng.
            </p>
            <ul class="space-y-2 text-indigo-700">
              <li class="flex items-start">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="mt-1 mr-2 text-indigo-500" />
                <span>Chọn số nhà, căn hộ phù hợp</span>
              </li>
              <li class="flex items-start">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="mt-1 mr-2 text-indigo-500" />
                <span>Bố trí phòng ốc theo năng lượng cá nhân</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'UseCases'
}
</script>

<style scoped>
/* Hiệu ứng khi hover */
.hover\:shadow-xl {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Đảm bảo các card có chiều cao bằng nhau */
.grid > div {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>