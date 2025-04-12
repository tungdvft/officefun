<template>
  <section id="calculator" class="bg-purple-50 rounded-xl p-8 mb-16">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-8 text-purple-900">Tính Số Đường Đời Của Bạn</h2>
      <div class="bg-white rounded-lg p-6 shadow-md">
        <form @submit.prevent="calculateLifePath" class="space-y-4">
          <div>
            <label for="birthday" class="block text-gray-700 font-medium mb-2">Ngày sinh của bạn</label>
            <input type="date" id="birthday" v-model="birthday" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
          </div>
          <button type="submit" class="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition duration-300">
            Tính Số <i class="fas fa-calculator ml-2"></i>
          </button>
        </form>
        
        <div id="result" class="mt-6" :class="{ 'hidden': !showResult }">
          <div class="bg-purple-100 p-4 rounded-lg">
            <h3 class="text-xl font-bold text-purple-900 mb-2">Kết Quả</h3>
            <p class="text-gray-800">Số Đường Đời của bạn là: <span id="lifePathNumber" class="text-3xl font-bold text-purple-600">{{ lifePathNumber }}</span></p>
            <div id="interpretation" class="mt-4 text-gray-700">
              <p class="mb-2"><strong>Ý nghĩa Số Đường Đời {{ lifePathNumber }}:</strong></p>
              <p>{{ interpretation }}</p>
              <p class="mt-4"><NuxtLink to="/duong-doi" class="text-purple-600 font-medium hover:text-purple-900">Xem chi tiết phân tích →</NuxtLink></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      birthday: '',
      lifePathNumber: null,
      interpretation: '',
      showResult: false,
      interpretations: {
        1: "Bạn là người độc lập, sáng tạo và có tinh thần lãnh đạo. Sứ mệnh của bạn là dẫn dắt người khác bằng ý tưởng và sự tự tin.",
        2: "Bạn nhạy cảm, hòa nhã và có khả năng ngoại giao. Sứ mệnh của bạn là mang mọi người lại với nhau bằng sự hợp tác và thấu hiểu.",
        3: "Bạn sáng tạo, lạc quan và có khả năng giao tiếp tốt. Sứ mệnh của bạn là truyền cảm hứng cho người khác bằng nghệ thuật và sự vui vẻ.",
        4: "Bạn thực tế, có tổ chức và đáng tin cậy. Sứ mệnh của bạn là xây dựng nền tảng vững chắc cho bản thân và cộng đồng.",
        5: "Bạn yêu tự do, thích phiêu lưu và thích ứng nhanh. Sứ mệnh của bạn là trải nghiệm cuộc sống đa dạng và truyền bá sự tiến bộ.",
        6: "Bạn có trách nhiệm, nuôi dưỡng và cân bằng. Sứ mệnh của bạn là chăm sóc người khác và tạo ra sự hài hòa trong cộng đồng.",
        7: "Bạn phân tích, trực giác mạnh và tâm linh. Sứ mệnh của bạn là tìm kiếm sự thật và chia sẻ kiến thức với thế giới.",
        8: "Bạn tham vọng, có tổ chức và giỏi quản lý. Sứ mệnh của bạn là đạt được thành công vật chất và sử dụng nó để giúp đỡ người khác.",
        9: "Bạn nhân đạo, sáng tạo và có tầm nhìn. Sứ mệnh của bạn là phục vụ nhân loại bằng tình yêu thương và sự thấu hiểu.",
        11: "Bạn là người có trực giác mạnh, tâm linh và truyền cảm hứng. Sứ mệnh của bạn là nâng cao nhận thức tâm linh cho người khác.",
        22: "Bạn là người xây dựng bậc thầy với tầm nhìn lớn. Sứ mệnh của bạn là hiện thực hóa những ý tưởng vĩ đại mang lại lợi ích cho nhân loại."
      }
    }
  },
  methods: {
    calculateLifePath() {
      if (!this.birthday) {
        this.$toast.error('Vui lòng nhập ngày sinh')
        return
      }
      
      // Extract day, month, year
      const [year, month, day] = this.birthday.split('-')
      
      // Calculate life path number
      const dayNum = this.reduceNumber(parseInt(day))
      const monthNum = this.reduceNumber(parseInt(month))
      const yearNum = this.reduceNumber(parseInt(year))
      
      this.lifePathNumber = this.reduceNumber(dayNum + monthNum + yearNum)
      this.interpretation = this.interpretations[this.lifePathNumber] || "Đây là một con số đặc biệt với ý nghĩa sâu sắc về tâm linh và sứ mệnh cao cả."
      this.showResult = true
      
      // Scroll to result
      this.$nextTick(() => {
        const resultElement = document.getElementById('result')
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth' })
        }
      })
    },
    reduceNumber(num) {
      if (num === 11 || num === 22) {
        return num // Master numbers
      }
      
      while (num > 9) {
        let sum = 0
        while (num > 0) {
          sum += num % 10
          num = Math.floor(num / 10)
        }
        num = sum
        
        // Check again for master numbers after reduction
        if (num === 11 || num === 22) {
          return num
        }
      }
      
      return num
    }
  }
}
</script>