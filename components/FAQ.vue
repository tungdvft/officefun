<template>
  <section class="mb-16">
    <h2 class="text-3xl font-bold text-center mb-8 text-purple-800">Câu Hỏi Thường Gặp</h2>
    <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div class="faq-item p-6" v-for="(faq, index) in faqs" :key="index">
        <button @click="toggleFAQ(index)" class="faq-question flex justify-between items-center w-full text-left font-bold text-lg text-gray-800">
          <span>{{ faq.question }}</span>
          <i class="fas fa-chevron-down text-purple-600 transition-transform duration-300" :class="{ 'rotate-180': faq.isOpen }"></i>
        </button>
        <div v-if="faq.isOpen" class="faq-answer mt-3 text-gray-600">
          <p>{{ faq.answer }}</p>
        </div>
      </div>
    </div>
    <div class="text-center mt-8">
      <nuxt-link to="#" class="inline-block border-2 border-purple-600 text-purple-600 font-bold py-3 px-6 rounded-lg hover:bg-purple-600 hover:text-white transition duration-300">
        Xem thêm câu hỏi <i class="fas fa-arrow-right ml-2"></i>
      </nuxt-link>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      faqs: [
        { question: 'Thần số học có chính xác không?', answer: 'Thần số học là bộ môn khoa học tâm linh...', isOpen: false },
        { question: 'Tôi có thể thay đổi vận mệnh bằng thần số học?', answer: 'Thần số học không phải là bói toán...', isOpen: false },
        // Thêm các FAQ khác
      ]
    }
  },
  methods: {
    toggleFAQ(index) {
      this.faqs[index].isOpen = !this.faqs[index].isOpen
    }
  }
}
</script>