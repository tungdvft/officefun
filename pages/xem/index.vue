<template>
  <div>
    <NumerologyRecommendation :full-name="fullName" :birth-date="birthDate" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'
import { navigateTo } from '#app'
import { toast } from 'vue3-toastify'

definePageMeta({
  layout: 'view'
})

const userStore = useUserStore()
const fullName = ref('')
const birthDate = ref('')

onMounted(() => {
  if (process.client) {
    // Đảm bảo store đã được khởi tạo
    if (!userStore.isStoreInitialized) {
      userStore.initialize()
    }

    // Kiểm tra userStore.user
    if (userStore.user && userStore.user.fullname && userStore.user.birthdate) {
      fullName.value = userStore.user.fullname
      birthDate.value = userStore.user.birthdate
    } else {
      // Nếu không có dữ liệu người dùng, hiển thị thông báo và chuyển hướng
      toast.error('Vui lòng đăng nhập để xem thông tin', {
        position: 'top-center',
        theme: 'colored'
      })
      navigateTo('/dang-nhap')
    }
  }
})
</script>