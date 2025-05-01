<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-6">
      <!-- Nội dung chỉ số năng lực trưởng thành -->
      <transition name="fade-slide">
        <div v-if="number && data" class="mt-6">
          <div class="space-y-6">
            <!-- Hiển thị chỉ số năng lực trưởng thành -->
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 class="text-xl font-bold text-teal-800 mb-4">Chỉ Số Năng Lực Trưởng Thành Của Bạn</h3>
              <div class="flex items-center">
                <span class="w-12 h-12 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold text-lg mr-4">{{ number }}</span>
                <p class="text-gray-700 text-lg">Số năng lực trưởng thành: <span class="font-bold text-teal-600">{{ number }}</span></p>
              </div>
            </div>
            <!-- Luận giải chi tiết -->
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 class="text-xl font-bold text-teal-800 mb-4">Luận Giải Chi Tiết</h3>
              <div class="prose prose-teal max-w-none">
                <p class="text-gray-700"><strong>Mô tả:</strong> {{ data.description }}</p>
                <p class="text-gray-700"><strong>Lời khuyên:</strong> {{ data.advice }}</p>
                <p class="text-gray-700"><strong>Đặc điểm:</strong> {{ data.traits }}</p>
                <p class="text-gray-700"><strong>Thách thức:</strong> {{ data.challenges }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="loading" class="text-center text-gray-600">Đang tải dữ liệu...</div>
        <div v-else class="text-center text-red-600">Không có dữ liệu chỉ số năng lực trưởng thành.</div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useNumerologyData } from '@/composables/useNumerologyData';

const props = defineProps({
  birthDate: {
    type: String,
    default: '',
    validator: (value) => {
      if (!value) return true;
      return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
    },
  },
  fullName: {
    type: String,
    default: '',
  },
});

const birthDate = ref(props.birthDate);
const fullName = ref(props.fullName);
const { number, data, loading } = useNumerologyData('maturePower', birthDate, fullName);
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
