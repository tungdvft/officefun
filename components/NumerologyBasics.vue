<template>
  <section class="py-16 cosmic-bg">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-purple-900 mb-4">Thần Số Học Là Gì?</h2>
        <div class="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto"></div>
      </div>

      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- Card 1 -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full">
          <div class="p-8 flex-grow">
            <div class="w-20 h-20 mx-auto mb-6">
              <svg viewBox="0 0 100 100" class="text-purple-600">
                <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="none" stroke="currentColor" stroke-width="6" />
                <path d="M30 50 Q50 30 70 50 Q50 70 30 50 Z" fill="none" stroke="currentColor" stroke-width="4" />
                <circle cx="50" cy="50" r="8" fill="currentColor" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-center text-gray-800 mb-4">Nguồn Gốc</h3>
            <p class="text-gray-600 text-center">
              Bắt nguồn từ Pythagoras - nhà toán học vĩ đại thời Hy Lạp cổ đại, 
              người đã khám phá mối quan hệ huyền bí giữa các con số và vũ trụ.
            </p>
          </div>
          <div class="bg-purple-50 px-6 py-4 border-t border-purple-100 mt-auto">
            <p class="text-sm text-purple-600 text-center">"Mọi thứ đều là số" - Pythagoras</p>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full">
          <div class="p-8 flex-grow">
            <div class="w-20 h-20 mx-auto mb-6">
              <svg viewBox="0 0 100 100" class="text-blue-600">
                <path d="M50 5 L82 25 L82 75 L50 95 L18 75 L18 25 Z" fill="none" stroke="currentColor" stroke-width="6" />
                <path d="M35 50 L50 35 L65 50 L50 65 Z" fill="none" stroke="currentColor" stroke-width="4" />
                <circle cx="50" cy="50" r="5" fill="currentColor" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-center text-gray-800 mb-4">Ý Nghĩa</h3>
            <p class="text-gray-600 text-center">
              Mỗi con số từ 1-9 và các số đặc biệt 11, 22, 33 đều mang năng lượng riêng, 
              ảnh hưởng đến tính cách, tài năng và vận mệnh mỗi người.
            </p>
          </div>
          <div class="bg-blue-50 px-6 py-4 border-t border-blue-100 mt-auto">
            <p class="text-sm text-blue-600 text-center">"Con số là ngôn ngữ của vũ trụ"</p>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full">
          <div class="p-8 flex-grow">
            <div class="w-20 h-20 mx-auto mb-6">
              <svg viewBox="0 0 100 100" class="text-pink-600">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="6" />
                <path d="M30 50 A20 20 0 1 1 70 50 A20 20 0 1 1 30 50" fill="none" stroke="currentColor" stroke-width="4" />
                <circle cx="50" cy="50" r="6" fill="currentColor" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-center text-gray-800 mb-4">Ứng Dụng</h3>
            <p class="text-gray-600 text-center">
              Công cụ mạnh mẽ để hiểu bản thân, định hướng nghề nghiệp, 
              cải thiện các mối quan hệ và khám phá sứ mệnh cuộc đời.
            </p>
          </div>
          <div class="bg-pink-50 px-6 py-4 border-t border-pink-100 mt-auto">
            <p class="text-sm text-pink-600 text-center">"Hiểu mình - Hiểu người - Hiểu đời"</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cosmic-bg {
  background: radial-gradient(circle at center, #f9f5ff 0%, #e9d8fd 100%);
}

/* Animation */
.transition-all {
  transition: all 0.3s ease;
}

/* SVG styling */
svg {
  width: 100%;
  height: 100%;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>