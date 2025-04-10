<template>
  <section class="py-16 bg-gradient-to-b from-purple-50 to-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-purple-800 mb-4">Câu Hỏi Thường Gặp</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">Những thắc mắc phổ biến về thần số học</p>
      </div>

      <div class="max-w-4xl mx-auto space-y-4">
        <div 
          v-for="(faq, index) in faqs" 
          :key="index"
          class="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300"
          :class="{ 'ring-2 ring-purple-500': faq.isOpen }"
        >
          <button 
            @click="toggleFAQ(index)"
            class="w-full p-6 text-left flex justify-between items-center hover:bg-purple-50 transition-colors duration-200"
          >
            <h3 class="text-xl font-semibold text-gray-800">{{ faq.question }}</h3>
            <svg 
              class="w-6 h-6 text-purple-600 transition-transform duration-300"
              :class="{ 'rotate-180': faq.isOpen }"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div 
            v-show="faq.isOpen"
            class="px-6 pb-6 pt-2 text-gray-600 border-t border-purple-100"
            v-html="faq.answer"
          ></div>
        </div>
      </div>

      <div class="text-center mt-12">
        <nuxt-link 
          to="/faq"
          class="inline-flex items-center bg-white text-purple-600 font-bold py-3 px-8 rounded-full border-2 border-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 hover:shadow-lg"
        >
          <span>Xem tất cả câu hỏi</span>
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      faqs: [
        {
          question: 'Thần số học có thực sự chính xác?',
          answer: `
            <p>Thần số học là bộ môn khoa học tâm linh có cơ sở từ hàng ngàn năm, kết hợp giữa toán học và triết lý nhân sinh. Theo nghiên cứu:</p>
            <ul class="mt-2 space-y-1 list-disc pl-5">
              <li>Độ chính xác về phân tích tính cách đạt 85-92%</li>
              <li>Dự đoán xu hướng phát triển chính xác khoảng 70-80%</li>
              <li>Đặc biệt chính xác trong việc xác định điểm mạnh, điểm yếu bẩm sinh</li>
            </ul>
            <p class="mt-2">Tuy nhiên, kết quả còn phụ thuộc vào độ chính xác của thông tin đầu vào và trình độ chuyên gia phân tích.</p>
          `,
          isOpen: true
        },
        {
          question: 'Tôi có thể thay đổi vận mệnh thông qua thần số học?',
          answer: `
            <p>Thần số học không phải để tiên đoán tương lai mà là công cụ giúp bạn:</p>
            <ul class="mt-2 space-y-1 list-disc pl-5">
              <li>Hiểu rõ bản thân và tiềm năng ẩn giấu</li>
              <li>Nhận biết các bài học cuộc đời cần trải nghiệm</li>
              <li>Phát huy điểm mạnh và cải thiện điểm yếu</li>
              <li>Đưa ra quyết định phù hợp với bản chất</li>
            </ul>
            <p class="mt-2">Bạn hoàn toàn có thể thay đổi cuộc đời bằng cách điều chỉnh hành vi và thái độ sống phù hợp với các chỉ số của mình.</p>
          `,
          isOpen: false
        },
        {
          question: 'Có nên đổi tên theo thần số học?',
          answer: `
            <p>Việc đổi tên có thể mang lại những thay đổi tích cực nếu:</p>
            <ul class="mt-2 space-y-1 list-disc pl-5">
              <li>Tên mới cân bằng được các con số trong biểu đồ ngày sinh</li>
              <li>Bổ sung năng lượng cho những chỉ số còn thiếu</li>
              <li>Phù hợp với mục tiêu và định hướng phát triển</li>
            </ul>
            <p class="mt-2">Tuy nhiên, đây là quyết định quan trọng cần được tư vấn kỹ lưỡng bởi chuyên gia. Chúng tôi khuyên bạn nên:</p>
            <ol class="mt-2 space-y-1 list-decimal pl-5">
              <li>Phân tích kỹ biểu đồ số hiện tại</li>
              <li>Xác định rõ mục đích đổi tên</li>
              <li>Tham khảo ý kiến từ nhiều chuyên gia</li>
              <li>Dùng thử tên mới trong 3-6 tháng trước khi quyết định chính thức</li>
            </ol>
          `,
          isOpen: false
        },
        {
          question: 'Thần số học khác gì so với chiêm tinh học?',
          answer: `
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <h4 class="font-bold text-purple-700 mb-2">Thần số học</h4>
                <ul class="space-y-1 list-disc pl-5">
                  <li>Dựa trên ngày sinh và tên gọi</li>
                  <li>Tập trung vào các con số từ 1-9 và số đặc biệt</li>
                  <li>Đơn giản, dễ tiếp cận</li>
                  <li>Kết quả rõ ràng, cụ thể</li>
                  <li>Không yêu cầu kiến thức thiên văn</li>
                </ul>
              </div>
              <div>
                <h4 class="font-bold text-purple-700 mb-2">Chiêm tinh học</h4>
                <ul class="space-y-1 list-disc pl-5">
                  <li>Dựa trên vị trí các hành tinh khi sinh</li>
                  <li>Liên quan đến 12 cung hoàng đạo</li>
                  <li>Phức tạp, cần kiến thức chuyên sâu</li>
                  <li>Kết quả mang tính dự báo nhiều hơn</li>
                  <li>Yêu cầu hiểu biết về thiên văn</li>
                </ul>
              </div>
            </div>
            <p class="mt-4">Cả hai đều là công cụ hữu ích để khám phá bản thân, tùy vào sở thích cá nhân mà bạn có thể lựa chọn hoặc kết hợp cả hai.</p>
          `,
          isOpen: false
        },
        {
          question: 'Tôi nên bắt đầu với thần số học như thế nào?',
          answer: `
            <p>Để bắt đầu hành trình khám phá thần số học, bạn có thể:</p>
            <ol class="mt-2 space-y-2 list-decimal pl-5">
              <li>
                <span class="font-semibold">Tính các chỉ số cơ bản:</span> Số đường đời, số linh hồn, số nhân cách từ ngày sinh và tên gọi
              </li>
              <li>
                <span class="font-semibold">Đọc hiểu ý nghĩa:</span> Tìm hiểu sâu về từng con số của bạn
              </li>
              <li>
                <span class="font-semibold">Phân tích biểu đồ ngày sinh:</span> Xem xét mối quan hệ giữa các con số
              </li>
              <li>
                <span class="font-semibold">Tham khảo tài liệu:</span> Đọc sách hoặc tham gia các khóa học cơ bản
              </li>
              <li>
                <span class="font-semibold">Tư vấn chuyên gia:</span> Để có phân tích chuyên sâu và chính xác nhất
              </li>
            </ol>
            <p class="mt-4">Chúng tôi cung cấp đầy đủ công cụ và tài liệu để bạn có thể tự khám phá hoặc sử dụng dịch vụ tư vấn chuyên nghiệp.</p>
          `,
          isOpen: false
        },
        {
        question: 'Làm thế nào để đặt tên con hợp lý theo thần số học?',
        answer: `
            <p>Đặt tên con theo thần số học là phương pháp khoa học giúp trẻ phát huy tiềm năng từ nhỏ. Dưới đây là 5 nguyên tắc vàng:</p>
            
            <div class="grid md:grid-cols-2 gap-6 mt-4">
            <div>
                <h4 class="font-bold text-purple-700 mb-2">Nguyên tắc cơ bản</h4>
                <ul class="space-y-2 list-disc pl-5">
                <li><span class="font-semibold">Cân bằng với ngày sinh:</span> Tên nên bổ sung năng lượng cho những con số thiếu trong biểu đồ ngày sinh</li>
                <li><span class="font-semibold">Chú trọng số đường đời:</span> Tổng tên nên tạo ra số đường đời hài hòa (thường từ 2-9, tránh số 1 quá mạnh cho trẻ)</li>
                <li><span class="font-semibold">Xem xét chu kỳ 9 năm:</span> Chọn tên phù hợp với chu kỳ phát triển đầu đời của trẻ</li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold text-purple-700 mb-2">Lưu ý quan trọng</h4>
                <ul class="space-y-2 list-disc pl-5">
                <li>Kết hợp với văn hóa gia đình và ý nghĩa tên truyền thống</li>
                <li>Tránh những tên tạo ra "nút thắt nghiệp" (các số 13, 14, 16, 19)</li>
                <li>Nên có sự cân bằng giữa số linh hồn (nguyện vọng) và số nhân cách (ấn tượng xã hội)</li>
                </ul>
            </div>
            </div>

            <div class="mt-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 class="font-bold text-purple-800 mb-2">Ví dụ thực tế:</h4>
            <p>Nếu bé sinh ngày 15/12/2023 (tổng ngày sinh 1+5+1+2+2+0+2+3=16=7):</p>
            <ul class="mt-2 space-y-1 list-disc pl-5">
                <li>Nên chọn tên bổ sung năng lượng số 2 hoặc 6 để cân bằng</li>
                <li>Tổng tên lý tưởng nên rơi vào 2, 3 hoặc 6</li>
                <li>Có thể tham khảo các tên như: Minh Anh (số 6), Gia Hân (số 3), Bảo Châu (số 2)</li>
            </ul>
            </div>

            <p class="mt-6">Chúng tôi cung cấp <strong>dịch vụ tư vấn đặt tên chuyên sâu</strong> với các bước:</p>
            <ol class="mt-2 space-y-1 list-decimal pl-5">
            <li>Phân tích biểu đồ ngày sinh chi tiết</li>
            <li>Xác định năng lượng cần bổ sung</li>
            <li>Gợi ý 5-10 tên phù hợp kèm phân tích</li>
            <li>Tư vấn chọn tên tốt nhất dựa trên nhiều yếu tố</li>
            </ol>
        `,
        isOpen: false
        }
      ]
    }
  },
  methods: {
    toggleFAQ(index) {
      this.faqs.forEach((faq, i) => {
        faq.isOpen = i === index ? !faq.isOpen : false
      })
    }
  }
}
</script>

<style scoped>
/* Tùy chỉnh transition */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Hiệu ứng khi mở FAQ */
.ring-2 {
  box-shadow: 0 10px 15px -3px rgba(167, 139, 250, 0.2), 0 4px 6px -2px rgba(167, 139, 250, 0.1);
}
</style>