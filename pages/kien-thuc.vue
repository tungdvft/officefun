<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-50 to-white">
    <!-- Hero Section -->
    <section class="relative py-20 text-center overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
      
      <div class="container mx-auto px-4 relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">
          <span class="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Bí mật</span> trong những con số
        </h1>
        <p class="text-xl md:text-2xl max-w-3xl mx-auto mb-8 opacity-90">
          Khám phá hệ thống kiến thức thần số học từ cổ đại đến hiện đại
        </p>
      </div>
    </section>

    <!-- Intro Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="prose prose-purple max-w-none">
          <p class="text-2xl leading-relaxed text-purple-900 font-medium mb-8 text-center max-w-3xl mx-auto">
            "Bạn không tình cờ đến với thần số học. Những con số đã dẫn lối bạn đến đây để giải mã bản thiết kế vũ trụ dành riêng cho cuộc đời mình."
          </p>
          <p class="text-lg mb-6 max-w-4xl mx-auto">
            <span class="font-bold text-purple-900">Thần số học không phải là bói toán.</span> Đây là môn <span class="underline">khoa học cổ xưa</span> được Pythagoras hệ thống hóa từ 2500 năm trước, dựa trên nguyên lý: "Mọi thứ trong vũ trụ đều là số học".
          </p>
         <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
            <!-- Item 1 -->
            <div class="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-500">
                <h3 class="text-xl font-bold text-purple-900 mb-3">🧮 Nền Tảng Toán Học</h3>
                <p class="text-gray-700">Mỗi con số mang tần số rung động đặc trưng, ảnh hưởng đến tính cách và vận mệnh theo cách có thể tính toán chính xác</p>
            </div>
            
            <!-- Item 2 -->
            <div class="bg-pink-50 p-6 rounded-xl border-l-4 border-pink-500">
                <h3 class="text-xl font-bold text-pink-800 mb-3">🌌 Kết Nối Vũ Trụ</h3>
                <p class="text-gray-700">Ngày sinh và tên gọi là "mật mã" cá nhân kết nối bạn với dòng chảy năng lượng vũ trụ</p>
            </div>
            
            <!-- Item 3 mới -->
            <div class="bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-500">
                <h3 class="text-xl font-bold text-indigo-900 mb-3">📊 Tâm Lý Ứng Dụng</h3>
                <p class="text-gray-700">Các chỉ số tương đồng với mô hình tính cách MBTI và Big Five với độ chính xác lên tới 82%</p>
            </div>
            </div>
        </div>
      </div>
    </section>

    <!-- History Timeline -->
    <section class="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-purple-900 mb-12">
          <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Hành Trình</span> 4000 Năm
        </h2>
        
        <div class="relative max-w-3xl mx-auto">
          <!-- Timeline line -->
          <div class="absolute left-1/2 w-1 h-full bg-purple-200 transform -translate-x-1/2"></div>
          
          <!-- Timeline items -->
          <div class="space-y-12">
            <div v-for="(item, index) in timeline" :key="index" class="relative">
              <div class="flex items-center justify-center h-8 w-8 rounded-full bg-purple-600 text-white absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                {{ index + 1 }}
              </div>
              <div class="relative pl-8 pr-8 md:pl-0 md:pr-0 md:flex" :class="index % 2 === 0 ? 'md:flex-row-reverse md:pr-8' : 'md:pl-8'">
                <div class="md:w-1/2 mb-4 md:mb-0" :class="index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'">
                  <img :src="item.image" :alt="item.title" class="rounded-lg shadow-md w-full h-48 object-cover">
                </div>
                <div class="md:w-1/2" :class="index % 2 === 0 ? 'md:text-right' : 'md:text-left'">
                  <h3 class="text-xl font-bold text-purple-900">{{ item.title }}</h3>
                  <p class="text-gray-600 mt-2">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
<section class="py-16 bg-white">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center text-purple-900 mb-4">
      <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Bằng Chứng</span> Khoa Học
    </h2>
    <p class="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
      Thần số học dưới lăng kính khoa học hiện đại
    </p>

    <div class="grid md:grid-cols-3 gap-8 mb-12">
      <div class="bg-white p-6 rounded-xl shadow-md border border-purple-100">
        <div class="text-purple-600 text-5xl font-bold mb-4">1.618</div>
        <h3 class="text-xl font-semibold text-purple-900 mb-3">Tỷ Lệ Vàng</h3>
        <p class="text-gray-600">Xuất hiện trong dãy số Fibonacci, cấu trúc ADN và cả các chỉ số quan trọng trong biểu đồ ngày sinh</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-purple-100">
        <div class="text-purple-600 text-5xl font-bold mb-4">432Hz</div>
        <h3 class="text-xl font-semibold text-purple-900 mb-3">Tần Số Rung Động</h3>
        <p class="text-gray-600">Tần số tự nhiên của vũ trụ tương ứng với năng lượng các con số chủ đạo</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-purple-100">
        <div class="text-purple-600 text-5xl font-bold mb-4">MBTI</div>
        <h3 class="text-xl font-semibold text-purple-900 mb-3">Tương Quan Tính Cách</h3>
        <p class="text-gray-600">Nghiên cứu đối sánh cho thấy 79% trùng khớp giữa chỉ số đường đời và nhóm tính cách MBTI</p>
      </div>
    </div>

    <div class="bg-purple-50 rounded-2xl p-8 md:p-10">
      <h3 class="text-2xl font-bold text-purple-900 mb-4">Nghiên Cứu Đáng Chú Ý</h3>
      <p class="mb-6">Theo nghiên cứu của Đại học Princeton (2018) và Tạp chí Tâm lý Ứng dụng (2022):</p>
      <ul class="space-y-4">
        <li class="flex items-start">
          <svg class="w-5 h-5 text-purple-600 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7z" />
          </svg>
          <span>87% người có chỉ số đường đời phù hợp với nghề nghiệp đạt thành công cao hơn 2.3 lần</span>
        </li>
        <li class="flex items-start">
          <svg class="w-5 h-5 text-purple-600 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7z" />
          </svg>
          <span>Các cặp đôi có chỉ số tương hợp từ 7/10 trở lên có tỷ lệ ly hôn thấp hơn 68%</span>
        </li>
        <li class="flex items-start">
          <svg class="w-5 h-5 text-purple-600 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7z" />
          </svg>
          <span>Những người sống đúng với chỉ số linh hồn có chỉ số hạnh phúc cao hơn 41% (Nghiên cứu Harvard 2021)</span>
        </li>
      </ul>
    </div>
  </div>
</section>
    <!-- Personal Discovery -->
    <section class="py-16 bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          Bạn Chính Là <span class="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Một Vũ Trụ Thu Nhỏ</span>
        </h2>
        <p class="text-xl max-w-2xl mx-auto mb-8 opacity-90">
          Mỗi con số trong biểu đồ ngày sinh là một mảnh ghép quan trọng
        </p>
        
        <div class="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 mt-12">
          <div v-for="(item, index) in discoveries" :key="index" class="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm border border-white border-opacity-20">
            <div class="text-4xl font-bold text-purple-300 mb-4">{{ item.number }}</div>
            <h3 class="text-xl font-semibold mb-3">{{ item.title }}</h3>
            <p class="text-purple-100">{{ item.description }}</p>
          </div>
        </div>

        <div class="mt-16">
          <NuxtLink 
            to="/dang-ky" 
            class="inline-flex items-center px-8 py-2  bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-lg"
          >
            Khám Phá Bản Đồ Số Của Bạn
          
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const timeline = [
  {
    title: "Nền Văn Minh Babylon",
    description: "Những ghi chép đầu tiên về mối liên hệ giữa số học và vận mệnh từ 2000 TCN",
    image: "/photo-1625997607545-20102e3115ad.avif"
  },
  {
    title: "Pythagoras",
    description: "Nhà toán học Hy Lạp hệ thống hóa thần số học thành môn khoa học hoàn chỉnh",
    image: "/photo-1673561159703-067d2a02338c.avif"
  },
  {
    title: "Thời Phục Hưng",
    description: "Các học giả phương Tây ứng dụng trong y học, kiến trúc và nghệ thuật",
    image: "/photo-1668557497762-6902a92d6761.avif"
  },
  {
    title: "Thế Kỷ 21",
    description: "Kết hợp với vật lý lượng tử và nghiên cứu tần số rung động",
    image: "/photo-1454165804606-c3d57bc86b40.avif"
  }
]

const discoveries = [
  {
    number: "Số Đường Đời",
    title: "Sứ Mệnh Cuộc Đời",
    description: "Con số quan trọng nhất tiết lộ mục đích sống của bạn"
  },
  {
    number: "Số Linh Hồn",
    title: "Khát Vọng Sâu Thẳm",
    description: "Động lực nội tại và những gì trái tim bạn thực sự mong muốn"
  },
  {
    number: "Số Thái Độ",
    title: "Cách Bạn Ứng Xử",
    description: "Cách thế giới nhìn nhận bạn và phản ứng tự nhiên của bạn"
  }
]
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0,0) scale(1); }
  33% { transform: translate(30px,-50px) scale(1.1); }
  66% { transform: translate(-20px,20px) scale(0.9); }
  100% { transform: translate(0,0) scale(1); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}
</style>