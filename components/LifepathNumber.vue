<template>
  <section class="container mx-auto py-16 bg-purple-50 flex flex-col md:flex-row items-center justify-center gap-12">
    <!-- Vòng tròn các số -->
    <div class="relative w-80 h-80 flex items-center justify-center">
      <!-- Số 22 ở giữa -->
      <div
        @click="selectNumber(10)"
        :class="[
          'absolute w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-300',
          activeNumber === 10 ? 'bg-yellow-600 text-white shadow-lg scale-110' : 'bg-gray-400 text-white shadow-md hover:bg-gray-500'
        ]"
      >
        22
      </div>

      <!-- Các số từ 1-9 và 11 ở vòng ngoài -->
      <div
        v-for="(number, index) in numbers.slice(0, 10)"
        :key="number.label"
        @click="selectNumber(index)"
        :class="[
          'absolute w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold cursor-pointer transition-all duration-300',
          activeNumber === index ? `${number.colorActive} text-white shadow-lg scale-110` : 'bg-gray-400 text-white shadow-md hover:bg-gray-500'
        ]"
        :style="getCirclePosition(index)"
      >
        {{ number.label }}
      </div>
    </div>

    <!-- Nội dung hiển thị bên phải với độ rộng cố định -->
    <div class="w-full md:w-96 bg-white p-6 rounded-xl shadow-md min-h-[200px] flex flex-col justify-between">
      <div v-if="activeNumber !== null">
        <h3 class="text-2xl font-bold text-purple-800 mb-4">Số {{ numbers[activeNumber].label }}</h3>
        <p class="text-gray-600 mb-4">{{ numbers[activeNumber].content }}</p>
        <a
          :href="numbers[activeNumber].link"
          target="_self"
          class="inline-flex items-center bg-purple-600 text-white font-bold py-2 px-4 rounded-full hover:bg-purple-700 transition duration-300"
        >
          <span>Xem chi tiết</span>
          <font-awesome-icon :icon="['fas', 'angle-right']" class="ml-2" />
        </a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      activeNumber: 0, // Mặc định active số 1 (index 0)
      numbers: [
        { label: '1', color: 'bg-red-500', colorHover: 'bg-red-600', colorActive: 'bg-red-600', content: 'Thần số học số 1 là hiện thân của sự táo bạo, đổi mới, chấp nhận rủi ro...', link: 'https://tracuuthansohoc.com/than-so-hoc-so-1/' },
        { label: '2', color: 'bg-orange-500', colorHover: 'bg-orange-600', colorActive: 'bg-orange-600', content: 'Thần số học số 2 là hiện thân cho sự kiên nhẫn, công bằng...', link: 'https://tracuuthansohoc.com/than-so-hoc-so-2/' },
        { label: '3', color: 'bg-yellow-400', colorHover: 'bg-yellow-500', colorActive: 'bg-yellow-500', content: 'Thần số học số 3 là hiện thân của sự năng động, vui tươi...', link: 'https://tracuuthansohoc.com/than-so-hoc-so-3/' },
        { label: '4', color: 'bg-green-500', colorHover: 'bg-green-600', colorActive: 'bg-green-600', content: 'Thần số học số 4 là hiện thân cho những định hướng, sự chia sẻ thực tế...', link: 'https://tracuuthansohoc.com/than-so-hoc-so-4/' },
        { label: '5', color: 'bg-teal-500', colorHover: 'bg-teal-600', colorActive: 'bg-teal-600', content: 'Thần số học số 5 là hiện thân cho sự mạo hiểm, bản tính thích phiêu lưu...', link: 'https://tracuuthansohoc.com/than-so-hoc-so-5/' },
        { label: '6', color: 'bg-blue-500', colorHover: 'bg-blue-600', colorActive: 'bg-blue-600', content: 'Thần số học số 6 là hiện thân cho trách nhiệm, không phán xét...', link: 'https://tracuuthansohoc.com/than-so-hoc-so-6/' },
        { label: '7', color: 'bg-indigo-500', colorHover: 'bg-indigo-600', colorActive: 'bg-indigo-600', content: 'Thần số học số 7 là hiện thân của trực giác, trí tuệ...', link: 'https://tracuuthansohoc.com/than-so-hoc-so-7/' },
        { label: '8', color: 'bg-purple-500', colorHover: 'bg-purple-600', colorActive: 'bg-purple-600', content: 'Thần số học số 8 là hiện thân cho sự dư dả về tài chính...', link: 'https://tracuuthansohoc.com/than-so-hoc-so-8/' },
        { label: '9', color: 'bg-pink-500', colorHover: 'bg-pink-600', colorActive: 'bg-pink-600', content: 'Thần số học số 9 là hiện thân của người lắng nghe, biết đồng cảm...', link: 'https://tracuuthansohoc.com/than-so-hoc-so-9/' },
        { label: '11', color: 'bg-gray-500', colorHover: 'bg-gray-600', colorActive: 'bg-gray-600', content: 'Thần số học số 11 nhận được món quà thượng đế ban cho bạn là trực giác rất phong phú...', link: 'https://tracuuthansohoc.com/y-nghia-than-so-hoc-so-11/' },
        { label: '22', color: 'bg-yellow-500', colorHover: 'bg-yellow-600', colorActive: 'bg-yellow-600', content: '22 là một trong bộ ba số quan trọng trong Nhân số học (11, 22, 33)...', link: 'https://tracuuthansohoc.com/than-so-hoc-22/' }
      ]
    }
  },
  methods: {
    selectNumber(index) {
      this.activeNumber = index
    },
    getCirclePosition(index) {
      const radius = 120 // Bán kính vòng tròn ngoài
      const angle = (index * 360) / 10 - 90 // Chia đều 10 số trên vòng tròn, -90 để bắt đầu từ đỉnh
      const x = radius * Math.cos((angle * Math.PI) / 180)
      const y = radius * Math.sin((angle * Math.PI) / 180)
      return {
        transform: `translate(${x}px, ${y}px)`
      }
    }
  }
}
</script>

<style scoped>
/* Không cần thêm style phức tạp vì đã dùng Tailwind */
</style>