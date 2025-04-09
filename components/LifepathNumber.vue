<template>
  <div class="relative w-full max-w-xl mx-auto my-16">
    <!-- Vòng tròn các con số -->
    <div class="relative w-full aspect-square">
      <!-- Các số xung quanh -->
      <div 
        v-for="(number, index) in circleNumbers" 
        :key="number.id"
        class="absolute rounded-full flex items-center justify-center font-bold text-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-110"
        :class="[
          activeNumber === number.id ? 'scale-110 ring-4 ring-white z-10' : '',
          number.color
        ]"
        :style="getPositionStyle(index)"
        @click="selectNumber(number.id)"
      >
        <div class="text-center p-2">
          {{ number.label }}
        </div>
      </div>

      <!-- Số 22 ở giữa -->
      <div 
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-purple-800 flex items-center justify-center text-white font-bold text-xl shadow-lg cursor-pointer hover:bg-purple-900 transition-all duration-300 z-10"
        @click="selectNumber('tab_22')"
      >
        22
      </div>
    </div>

    <!-- Hiển thị nội dung -->
    <div class="mt-12 bg-white p-6 rounded-xl shadow-md">
      <div>
        <h3 class="text-xl font-bold text-purple-800 mb-4">
          Ý nghĩa số {{ getCurrentNumber().label }}
        </h3>
        <p class="text-gray-600 mb-4">{{ getCurrentNumber().content }}</p>
        <a 
          :href="getCurrentNumber().link" 
          target="_blank"
          class="inline-flex items-center bg-purple-600 text-white font-bold py-2 px-4 rounded-full hover:bg-purple-700 transition duration-300"
        >
          <span>Xem chi tiết</span>
          <font-awesome-icon :icon="['fas', 'angle-right']" class="ml-2" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeNumber: 'tab_1', // Mặc định active số 1
      circleNumbers: [
        { id: 'tab_1', label: '1', color: 'bg-red-500', size: 'w-16 h-16 text-lg' },
        { id: 'tab_2', label: '2', color: 'bg-orange-400', size: 'w-14 h-14 text-base' },
        { id: 'tab_3', label: '3', color: 'bg-yellow-400', size: 'w-14 h-14 text-base' },
        { id: 'tab_4', label: '4', color: 'bg-green-500', size: 'w-14 h-14 text-base' },
        { id: 'tab_5', label: '5', color: 'bg-blue-500', size: 'w-14 h-14 text-base' },
        { id: 'tab_6', label: '6', color: 'bg-indigo-500', size: 'w-14 h-14 text-base' },
        { id: 'tab_7', label: '7', color: 'bg-purple-500', size: 'w-14 h-14 text-base' },
        { id: 'tab_8', label: '8', color: 'bg-pink-500', size: 'w-14 h-14 text-base' },
        { id: 'tab_9', label: '9', color: 'bg-teal-500', size: 'w-14 h-14 text-base' },
        { id: 'tab_11', label: '11', color: 'bg-amber-600', size: 'w-16 h-16 text-lg' }
      ],
      numbers: [
        { id: 'tab_1', label: '1', content: 'Số 1 - Lãnh đạo: Độc lập, sáng tạo, tự tin. Người tiên phong với tinh thần mạnh mẽ và khả năng dẫn dắt.', link: '#' },
        { id: 'tab_2', label: '2', content: 'Số 2 - Hòa giải: Nhạy cảm, hòa nhã, có khả năng ngoại giao. Người mang lại sự hài hòa trong các mối quan hệ.', link: '#' },
        { id: 'tab_3', label: '3', content: 'Số 3 - Sáng tạo: Lạc quan, vui vẻ, có khả năng giao tiếp tốt. Người truyền cảm hứng bằng nghệ thuật và sự nhiệt tình.', link: '#' },
        { id: 'tab_4', label: '4', content: 'Số 4 - Tổ chức: Thực tế, đáng tin cậy, có kỷ luật. Người xây dựng nền tảng vững chắc cho mọi việc.', link: '#' },
        { id: 'tab_5', label: '5', content: 'Số 5 - Tự do: Yêu tự do, thích phiêu lưu, thích ứng nhanh. Người mang đến sự đổi mới và tiến bộ.', link: '#' },
        { id: 'tab_6', label: '6', content: 'Số 6 - Trách nhiệm: Nuôi dưỡng, cân bằng, có trách nhiệm. Người tạo ra sự hài hòa và chăm sóc cộng đồng.', link: '#' },
        { id: 'tab_7', label: '7', content: 'Số 7 - Trí tuệ: Phân tích, trực giác mạnh, tâm linh. Người tìm kiếm sự thật và chia sẻ tri thức.', link: '#' },
        { id: 'tab_8', label: '8', content: 'Số 8 - Quyền lực: Tham vọng, quản lý tốt, thành công vật chất. Người biết sử dụng ảnh hưởng để tạo ra giá trị.', link: '#' },
        { id: 'tab_9', label: '9', content: 'Số 9 - Nhân đạo: Rộng lượng, sáng tạo, có tầm nhìn. Người phục vụ nhân loại bằng tình yêu thương.', link: '#' },
        { id: 'tab_11', label: '11', content: 'Số 11 - Linh hồn: Trực giác cao, nhạy cảm, truyền cảm hứng. Người có khả năng kết nối tâm linh mạnh mẽ.', link: '#' },
        { id: 'tab_22', label: '22', content: 'Số 22 - Kiến trúc sư: Thực tế nhưng có tầm nhìn xa, xây dựng bền vững. Người hiện thực hóa những ý tưởng vĩ đại.', link: '#' }
      ]
    }
  },
  methods: {
    selectNumber(id) {
      this.activeNumber = id
    },
    getCurrentNumber() {
      return this.numbers.find(n => n.id === this.activeNumber) || this.numbers[0]
    },
    getPositionStyle(index) {
      const radius = 150 // Khoảng cách từ tâm
      const angle = (index * 36) - 18 // 36° mỗi số (360/10), offset -18° để bắt đầu từ trên
      const radian = (angle * Math.PI) / 180
      
      return {
        left: `calc(50% + ${radius * Math.sin(radian)}px)`,
        top: `calc(50% - ${radius * Math.cos(radian)}px)`,
        transform: 'translate(-50%, -50%)',
        width: this.circleNumbers[index].size.split(' ')[0],
        height: this.circleNumbers[index].size.split(' ')[1]
      }
    }
  }
}
</script>

<style scoped>
/* Tùy chỉnh thêm nếu cần */
</style>