<template>
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
            class="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-white hover:border-purple-200 flex flex-col items-center text-center"
          >
            <div v-html="feature.icon" class="w-14 h-14 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-6">
             
            </div>
            <h3 class="text-xl font-semibold text-purple-900 mb-3">{{ feature.title }}</h3>
            <p class="text-gray-600 mb-6">{{ feature.description }}</p>
            <NuxtLink 
              :to="feature.link"
              class="inline-flex items-center px-4 py-2 border border-purple-200 rounded-full group hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
            >
              <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">
                Khám phá ngay
              </span>
              <svg class="w-4 h-4 ml-2 text-purple-500 group-hover:text-purple-700 group-hover:translate-x-1 transition-all duration-200" 
                   fill="none" 
                   stroke="currentColor" 
                   viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
</template>

<script setup>
const features = [
  {
    title: "Báo cáo toàn diện",
    description: "Phân tích chi tiết đường đời, linh hồn và định mệnh dựa trên ngày sinh và tên của bạn.",
    icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m-4-4h8m-8-6h12" />
           </svg>`,
    link: "/xem"
  },
   {
    title: "Thần số học mỗi ngày",
    description: "Nhận dự báo hàng ngày dựa trên thần số học để định hướng và tối ưu năng lượng.",
    icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
           </svg>`,
    link: "/xem/than-so-hoc-moi-ngay"
  },
  {
    title: "Đặt tên con",
    description: "Tư vấn đặt tên con dựa trên nguyên lý cân bằng năng lượng số và ngũ hành.",
    icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
           </svg>`,
    link: "/xem/dat-ten-con"
  },
  {
    title: "Hướng nghiệp số học",
    description: "Gợi ý nghề nghiệp phù hợp nhất với năng lượng số của bạn để phát huy tối đa tiềm năng.",
    icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
           </svg>`,
    link: "/xem/dinh-huong-nghe-nghiep"
  },
  {
    title: "Hợp nhau theo số",
    description: "Đo lường mức độ hòa hợp trong các mối quan hệ quan trọng như tình yêu, đối tác, gia đình.",
    icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
           </svg>`,
    link: "/xem/kiem-tra-hop-nhau"
  },
  {
    title: "Đặt danh xưng quốc tế",
    description: "Tư vấn chọn tên tiếng Anh, bút danh phù hợp với vận mệnh và năng lượng cá nhân.",
    icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
           </svg>`,
    link: "/xem/danh-xung"
  },
  {
    title: "Chọn ngày cưới",
    description: "Tìm ngày cưới lý tưởng theo vận số của bạn và đối tác, đảm bảo hòa hợp, may mắn.",
    icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>`,
    link: "/xem/chon-ngay-cuoi"
  },
  {
    title: "Đặt tên thương hiệu",
    description: "Tư vấn tên thương hiệu hài hòa với năng lượng số, thu hút thành công và thịnh vượng.",
    icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
           </svg>`,
    link: "/xem/dat-ten-thuong-hieu"
  },
  {
    title: "Thần số học cho trẻ",
    description: "Khám phá tiềm năng và định hướng phát triển cho con bạn qua năng lượng số học.",
    icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
           </svg>`,
    link: "/xem/than-so-hoc-tre-em"
  }
];
</script>
