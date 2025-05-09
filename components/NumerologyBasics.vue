<template>
  <section class="py-16">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <span class="inline-block px-4 py-1 bg-purple-100 text-purple-900 rounded-full text-sm font-semibold mb-4">KHÁM PHÁ THẦN SỐ HỌC</span>
        <h2 class="text-3xl md:text-4xl font-bold text-purple-900">
          <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Thần Số Học</span> Là Gì?
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto mt-4">
          Tìm hiểu nguồn gốc, ý nghĩa và ứng dụng của thần số học trong cuộc sống
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-10 mx-auto">
        <!-- Card 1 -->
        <div class="bg-white rounded-2xl shadow-xl border border-purple-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full">
          <div class="flex-grow flex flex-col items-center justify-center p-6">
            <div class="w-16 h-16 mb-4">
              <svg viewBox="0 0 100 100" class="text-purple-600">
                <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="none" stroke="currentColor" stroke-width="6" />
                <path d="M30 50 Q50 30 70 50 Q50 70 30 50 Z" fill="none" stroke="currentColor" stroke-width="4" />
                <circle cx="50" cy="50" r="8" fill="currentColor" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Nguồn Gốc</h3>
            <p class="text-gray-600 text-sm text-center">
              Bắt nguồn từ Pythagoras - nhà toán học vĩ đại thời Hy Lạp cổ đại, 
              người đã khám phá mối quan hệ huyền bí giữa các con số và vũ trụ.
            </p>
          </div>
          <div class="bg-purple-50 px-6 py-4 border-t border-purple-100 mt-auto">
            <p class="text-sm text-purple-600 text-center">"Mọi thứ đều là số" - Pythagoras</p>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="bg-white rounded-2xl shadow-xl border border-purple-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full">
          <div class="flex-grow flex flex-col items-center justify-center p-6">
            <div class="w-16 h-16 mb-4">
              <svg viewBox="0 0 100 100" class="text-purple-600">
                <path d="M50 5 L82 25 L82 75 L50 95 L18 75 L18 25 Z" fill="none" stroke="currentColor" stroke-width="6" />
                <path d="M35 50 L50 35 L65 50 L50 65 Z" fill="none" stroke="currentColor" stroke-width="4" />
                <circle cx="50" cy="50" r="5" fill="currentColor" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Ý Nghĩa</h3>
            <p class="text-gray-600 text-sm text-center">
              Mỗi con số từ 1-9 và các số đặc biệt 11, 22, 33 đều mang năng lượng riêng, 
              ảnh hưởng đến tính cách, tài năng và vận mệnh mỗi người.
            </p>
          </div>
          <div class="bg-purple-50 px-6 py-4 border-t border-purple-100 mt-auto">
            <p class="text-sm text-purple-600 text-center">"Con số là ngôn ngữ của vũ trụ"</p>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="bg-white rounded-2xl shadow-xl border border-purple-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full">
          <div class="flex-grow flex flex-col items-center justify-center p-6">
            <div class="w-16 h-16 mb-4">
              <svg viewBox="0 0 100 100" class="text-purple-600">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="6" />
                <path d="M30 50 A20 20 0 1 1 70 50 A20 20 0 1 1 30 50" fill="none" stroke="currentColor" stroke-width="4" />
                <circle cx="50" cy="50" r="6" fill="currentColor" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Ứng Dụng</h3>
            <p class="text-gray-600 text-sm text-center">
              Công cụ mạnh mẽ để hiểu bản thân, định hướng nghề nghiệp, 
              cải thiện các mối quan hệ và khám phá sứ mệnh cuộc đời.
            </p>
          </div>
          <div class="bg-purple-50 px-6 py-4 border-t border-purple-100 mt-auto">
            <p class="text-sm text-purple-600 text-center">"Hiểu mình - Hiểu người - Hiểu đời"</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
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