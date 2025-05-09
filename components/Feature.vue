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