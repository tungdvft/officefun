<template>
  <div>
    <Hero />
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center gap-12">
          <div class="md:w-1/2">
            <div class="relative">
              <div class="absolute -top-6 -left-6 w-32 h-32 bg-purple-100 rounded-full z-0"></div>
              <div class="relative z-10">
                <img 
                  src="/home.jpg" 
                  alt="Phân tích thần số học" 
                  class="rounded-lg shadow-lg w-full h-auto"
                >
              </div>
              <div class="absolute -bottom-6 -right-6 w-24 h-24 bg-pink-100 rounded-full z-0"></div>
            </div>
          </div>
          
          <div class="md:w-1/2">
            <h2 class="text-3xl md:text-4xl font-bold text-purple-900 mb-6">
              <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Hệ thống</span> Phân Tích Thần Số Học Thông Minh
            </h2>
            <p class="text-gray-700 text-lg mb-6">
              Chúng tôi sử dụng trí tuệ nhân tạo và cơ sở dữ liệu lớn để phân tích sâu các con số trong ngày sinh và tên của bạn, từ đó đưa ra những dự đoán chính xác về tính cách, sự nghiệp và các mối quan hệ.
            </p>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start">
                <svg class="w-5 h-5 text-purple-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7z" />
                </svg>
                <span class="text-gray-700">Phân tích đa chiều dựa trên ngày sinh và tên</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-purple-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7z" />
                </svg>
                <span class="text-gray-700">Dự báo xu hướng theo năm, tháng, ngày</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-purple-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7z" />
                </svg>
                <span class="text-gray-700">Gợi ý hướng phát triển phù hợp với năng lượng số</span>
              </li>
            </ul>
            <!-- <a href="/about" class="inline-flex items-center text-purple-600 font-medium hover:text-purple-900">
              Tìm hiểu thêm
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a> -->
          </div>
        </div>
      </div>
    </section>
    <Feature />
    <NumerologyBasics />
  
    <CoreNumbers />
    <Testimonials />
    <FAQ />
    <Blog />
  </div>
</template>

<script>
import Hero from '~/components/Hero.vue'
import WhyChooseUs from '~/components/WhyChooseUs.vue'
import Stats from '~/components/Stats.vue'
import NumerologyBasics from '~/components/NumerologyBasics.vue'
import CoreNumbers from '~/components/CoreNumbers.vue'
import Calculator from '~/components/Calculator.vue'
import Testimonials from '~/components/Testimonials.vue'
import FAQ from '~/components/FAQ.vue'
import Blog from '~/components/Blog.vue'
export default {
  components: {
    Hero,
    WhyChooseUs,
    NumerologyBasics,
    CoreNumbers,
    Calculator,
    Testimonials,
    FAQ,
    Blog,
    Stats
  }
}
</script>