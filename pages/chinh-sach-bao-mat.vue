<template>
  <div class="policy-page">
    <div class="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Chính Sách Bảo Mật</h1>
       
      </div>

      <!-- Content -->
      <div class="prose prose-lg max-w-none">
        <section class="mb-10">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">1. Thu thập thông tin</h2>
          <p class="mb-4">Chúng tôi thu thập các thông tin sau khi bạn sử dụng dịch vụ:</p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li>Thông tin cá nhân: Họ tên, ngày sinh, email, số điện thoại</li>
            <li>Thông tin sử dụng: Lịch sử truy cập, tương tác với dịch vụ</li>
            <li>Thông tin thiết bị: Địa chỉ IP, loại trình duyệt, hệ điều hành</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">2. Mục đích sử dụng</h2>
          <p class="mb-4">Thông tin thu thập được sử dụng để:</p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li>Cung cấp và duy trì dịch vụ</li>
            <li>Cải thiện trải nghiệm người dùng</li>
            <li>Phân tích và nghiên cứu thị trường</li>
            <li>Liên hệ hỗ trợ khi cần thiết</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">3. Bảo mật thông tin</h2>
          <p class="mb-4">Chúng tôi áp dụng các biện pháp bảo mật bao gồm:</p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li>Mã hóa dữ liệu nhạy cảm</li>
            <li>Giới hạn quyền truy cập thông tin</li>
            <li>Kiểm tra bảo mật định kỳ</li>
            <li>Tuân thủ các tiêu chuẩn bảo mật quốc tế</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">4. Chia sẻ thông tin</h2>
          <p class="mb-4">Chúng tôi không bán hoặc cho thuê thông tin cá nhân của bạn. Thông tin có thể được chia sẻ với:</p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li>Đối tác cung cấp dịch vụ theo yêu cầu pháp lý</li>
            <li>Bên thứ ba khi có sự đồng ý của bạn</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">5. Quyền lợi của bạn</h2>
          <p class="mb-4">Bạn có quyền:</p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li>Truy cập và yêu cầu chỉnh sửa thông tin cá nhân</li>
            <li>Yêu cầu xóa dữ liệu cá nhân</li>
            <li>Từ chối nhận thông tin quảng cáo</li>
            <li>Khiếu nại về việc sử dụng dữ liệu</li>
          </ul>
        </section>

        <!-- <section>
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">6. Liên hệ</h2>
          <p class="mb-4">Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ:</p>
          <p>Email: <a href="mailto:privacy@thansohoc.com" class="text-blue-600 hover:underline">privacy@thansohoc.com</a></p>
          <p>Điện thoại: 1900 1234</p>
        </section> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const lastUpdated = ref('01/01/2023')
</script>

<style scoped>
.policy-page {
  @apply bg-gray-50 min-h-screen;
}

.prose ul {
  @apply mb-4;
}

.prose a {
  @apply text-blue-600 hover:text-blue-800 transition-colors;
}
</style>