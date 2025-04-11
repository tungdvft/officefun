<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-50 to-white">
    <!-- Header -->
 

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">Khám Phá Thế Giới Thần Số Học</h1>
        <p class="text-xl max-w-2xl mx-auto mb-8 opacity-90">
          Các bài viết chuyên sâu giúp bạn hiểu rõ về bản thân và vận mệnh thông qua những con số
        </p>
        <div class="max-w-md mx-auto relative">
          <input 
            type="text" 
            placeholder="Tìm kiếm bài viết..." 
            class="w-full py-3 px-6 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
          <button class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-16">
      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Articles Section -->
        <div class="lg:w-2/3">
          <!-- Featured Post -->
          <div class="mb-16 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="Bài viết nổi bật" 
              class="w-full h-64 md:h-80 object-cover"
            >
            <div class="p-6 md:p-8">
              <div class="flex items-center mb-4">
                <span class="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">NỔI BẬT</span>
                <span class="ml-4 text-gray-500 text-sm">12 tháng 6, 2023</span>
              </div>
              <h2 class="text-2xl md:text-3xl font-bold text-purple-900 mb-4">
                <router-link to="/bai-viet-1" class="hover:text-purple-600 transition-colors">
                  Giải Mã Con Số Đường Đời - Chìa Khóa Hiểu Bản Thân
                </router-link>
              </h2>
              <p class="text-gray-700 mb-6">
                Con số đường đời tiết lộ nhiều điều về tính cách, sứ mệnh và tiềm năng của bạn. Bài viết này sẽ hướng dẫn bạn cách tính toán và phân tích con số quan trọng này...
              </p>
              <div class="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80" 
                  alt="Tác giả" 
                  class="w-10 h-10 rounded-full object-cover mr-3"
                >
                <div>
                  <p class="text-sm font-medium text-gray-900">Tiến sĩ Lê Minh</p>
                  <p class="text-xs text-gray-500">Chuyên gia Thần số học</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Posts -->
          <h2 class="text-2xl font-bold text-purple-900 mb-8 pb-4 border-b border-purple-100">Bài Viết Mới Nhất</h2>
          
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Post 1 -->
            <article class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <router-link to="/bai-viet-2">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Bài viết 1" 
                  class="w-full h-48 object-cover"
                >
              </router-link>
              <div class="p-6">
                <div class="flex items-center mb-3">
                  <span class="text-purple-600 text-sm font-medium">SỐ HỌC ỨNG DỤNG</span>
                  <span class="mx-2 text-gray-300">•</span>
                  <span class="text-gray-500 text-sm">5 tháng 6, 2023</span>
                </div>
                <h3 class="text-xl font-bold text-purple-900 mb-3">
                  <router-link to="/bai-viet-2" class="hover:text-purple-600 transition-colors">
                    Cách Chọn Ngày Tốt Theo Thần Số Học
                  </router-link>
                </h3>
                <p class="text-gray-600 mb-4 line-clamp-2">
                  Khám phá cách lựa chọn ngày quan trọng như khai trương, cưới hỏi, ký kết hợp đồng dựa trên năng lượng của các con số...
                </p>
                <router-link 
                  to="/bai-viet-2" 
                  class="inline-flex items-center text-purple-600 text-sm font-medium hover:text-purple-800"
                >
                  Đọc tiếp
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>
            </article>

            <!-- Post 2 -->
            <article class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <router-link to="/bai-viet-3">
                <img 
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Bài viết 2" 
                  class="w-full h-48 object-cover"
                >
              </router-link>
              <div class="p-6">
                <div class="flex items-center mb-3">
                  <span class="text-purple-600 text-sm font-medium">TÌNH DUYÊN</span>
                  <span class="mx-2 text-gray-300">•</span>
                  <span class="text-gray-500 text-sm">28 tháng 5, 2023</span>
                </div>
                <h3 class="text-xl font-bold text-purple-900 mb-3">
                  <router-link to="/bai-viet-3" class="hover:text-purple-600 transition-colors">
                    Thần Số Học Trong Tình Yêu: Tìm Người Phù Hợp
                  </router-link>
                </h3>
                <p class="text-gray-600 mb-4 line-clamp-2">
                  Hiểu về sự hòa hợp giữa các con số giúp bạn xây dựng mối quan hệ bền vững và hạnh phúc hơn...
                </p>
                <router-link 
                  to="/bai-viet-3" 
                  class="inline-flex items-center text-purple-600 text-sm font-medium hover:text-purple-800"
                >
                  Đọc tiếp
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>
            </article>

            <!-- Post 3 -->
            <article class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <router-link to="/bai-viet-4">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Bài viết 3" 
                  class="w-full h-48 object-cover"
                >
              </router-link>
              <div class="p-6">
                <div class="flex items-center mb-3">
                  <span class="text-purple-600 text-sm font-medium">SỰ NGHIỆP</span>
                  <span class="mx-2 text-gray-300">•</span>
                  <span class="text-gray-500 text-sm">15 tháng 5, 2023</span>
                </div>
                <h3 class="text-xl font-bold text-purple-900 mb-3">
                  <router-link to="/bai-viet-4" class="hover:text-purple-600 transition-colors">
                    Con Số Sứ Mệnh: Định Hướng Nghề Nghiệp Theo Thần Số
                  </router-link>
                </h3>
                <p class="text-gray-600 mb-4 line-clamp-2">
                  Khám phá cách con số chủ đạo ảnh hưởng đến sự nghiệp và giúp bạn tìm ra công việc phù hợp nhất...
                </p>
                <router-link 
                  to="/bai-viet-4" 
                  class="inline-flex items-center text-purple-600 text-sm font-medium hover:text-purple-800"
                >
                  Đọc tiếp
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>
            </article>

            <!-- Post 4 -->
            <article class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <router-link to="/bai-viet-5">
                <img 
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Bài viết 4" 
                  class="w-full h-48 object-cover"
                >
              </router-link>
              <div class="p-6">
                <div class="flex items-center mb-3">
                  <span class="text-purple-600 text-sm font-medium">ĐẶT TÊN</span>
                  <span class="mx-2 text-gray-300">•</span>
                  <span class="text-gray-500 text-sm">2 tháng 5, 2023</span>
                </div>
                <h3 class="text-xl font-bold text-purple-900 mb-3">
                  <router-link to="/bai-viet-5" class="hover:text-purple-600 transition-colors">
                    Nghệ Thuật Đặt Tên Theo Thần Số Học
                  </router-link>
                </h3>
                <p class="text-gray-600 mb-4 line-clamp-2">
                  Cách chọn tên cho con, bút danh hoặc thương hiệu dựa trên năng lượng số học để mang lại may mắn và thành công...
                </p>
                <router-link 
                  to="/bai-viet-5" 
                  class="inline-flex items-center text-purple-600 text-sm font-medium hover:text-purple-800"
                >
                  Đọc tiếp
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>
            </article>
          </div>

          <!-- Pagination -->
          <!-- <div class="mt-16 flex justify-center">
            <nav class="flex items-center space-x-2">
              <button class="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 text-white">
                1
              </button>
              <button class="w-10 h-10 flex items-center justify-center rounded-full text-gray-700 hover:bg-purple-50">
                2
              </button>
              <button class="w-10 h-10 flex items-center justify-center rounded-full text-gray-700 hover:bg-purple-50">
                3
              </button>
              <span class="px-2 text-gray-500">...</span>
              <button class="w-10 h-10 flex items-center justify-center rounded-full text-gray-700 hover:bg-purple-50">
                8
              </button>
              <button class="w-10 h-10 flex items-center justify-center rounded-full text-gray-700 hover:bg-purple-50">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div> -->
        </div>

        <!-- Sidebar -->
        <aside class="lg:w-1/3">
          <!-- About Widget -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 class="text-xl font-bold text-purple-900 mb-4 pb-4 border-b border-purple-100">Về Blog</h3>
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80" 
              alt="Tác giả" 
              class="w-20 h-20 rounded-full object-cover mx-auto mb-4"
            >
            <p class="text-gray-700 mb-4">
              Chuyên trang chia sẻ kiến thức chuyên sâu về Thần Số Học, giúp bạn khám phá bản thân và định hướng cuộc sống qua những con số.
            </p>
            <router-link 
              to="/ve-chung-toi" 
              class="text-purple-600 font-medium hover:text-purple-800 inline-flex items-center"
            >
              Xem thêm
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>

          <!-- Categories Widget -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 class="text-xl font-bold text-purple-900 mb-4 pb-4 border-b border-purple-100">Chuyên Mục</h3>
            <ul class="space-y-3">
              <li>
                <router-link 
                  to="/chuyen-muc/song-hoc" 
                  class="flex justify-between items-center text-gray-700 hover:text-purple-600"
                >
                  <span>Số học cơ bản</span>
                  <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">24</span>
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/chuyen-muc/tinh-yeu" 
                  class="flex justify-between items-center text-gray-700 hover:text-purple-600"
                >
                  <span>Tình yêu & Hôn nhân</span>
                  <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">18</span>
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/chuyen-muc/su-nghiep" 
                  class="flex justify-between items-center text-gray-700 hover:text-purple-600"
                >
                  <span>Sự nghiệp & Tài chính</span>
                  <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">15</span>
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/chuyen-muc/dat-ten" 
                  class="flex justify-between items-center text-gray-700 hover:text-purple-600"
                >
                  <span>Đặt tên & Danh xưng</span>
                  <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">12</span>
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/chuyen-muc/chon-ngay" 
                  class="flex justify-between items-center text-gray-700 hover:text-purple-600"
                >
                  <span>Chọn ngày tốt</span>
                  <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">9</span>
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Popular Posts -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold text-purple-900 mb-4 pb-4 border-b border-purple-100">Bài Viết Nổi Bật</h3>
            <ul class="space-y-4">
              <li>
                <router-link to="/bai-viet-noi-bat-1" class="flex group">
                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
                    alt="Bài viết nổi bật" 
                    class="w-16 h-16 object-cover rounded-lg mr-4"
                  >
                  <div>
                    <h4 class="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">Các Con Số Chủ Đạo Và Ý Nghĩa</h4>
                    <p class="text-sm text-gray-500">10 tháng 4, 2023</p>
                  </div>
                </router-link>
              </li>
              <li>
                <router-link to="/bai-viet-noi-bat-2" class="flex group">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
                    alt="Bài viết nổi bật" 
                    class="w-16 h-16 object-cover rounded-lg mr-4"
                  >
                  <div>
                    <h4 class="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">Thần Số Học Và Sức Khỏe</h4>
                    <p class="text-sm text-gray-500">28 tháng 3, 2023</p>
                  </div>
                </router-link>
              </li>
              <li>
                <router-link to="/bai-viet-noi-bat-3" class="flex group">
                  <img 
                    src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
                    alt="Bài viết nổi bật" 
                    class="w-16 h-16 object-cover rounded-lg mr-4"
                  >
                  <div>
                    <h4 class="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">Năm Cá Nhân Và Những Điều Cần Biết</h4>
                    <p class="text-sm text-gray-500">15 tháng 3, 2023</p>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>

    <!-- Newsletter -->


    <!-- Footer -->
    <!--  -->
  </div>
</template>

<script setup>
// No script needed for static blog page
</script>

<style scoped>
/* Custom styles */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
.router-link-active {
  @apply text-purple-600;
}

/* Hover effects */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>