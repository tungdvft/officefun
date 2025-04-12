<template>
  <div class="terms-page">
    <div class="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Điều Khoản Sử Dụng</h1>
        <!-- <p class="text-lg text-gray-600">Cập nhật lần cuối: {{ lastUpdated }}</p> -->
      </div>

      <!-- Content -->
      <div class="prose prose-lg max-w-none">
        <section class="mb-10">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">1. Giới thiệu</h2>
          <p class="mb-4">Chào mừng bạn đến với dịch vụ Thần số học. Bằng cách sử dụng dịch vụ, bạn đồng ý với các điều khoản sau:</p>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">2. Điều kiện sử dụng</h2>
          <p class="mb-4">Khi sử dụng dịch vụ, bạn cam kết:</p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li>Đủ 18 tuổi trở lên hoặc có sự đồng ý của người giám hộ</li>
            <li>Cung cấp thông tin chính xác, trung thực</li>
            <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
            <li>Không can thiệp vào hệ thống kỹ thuật của dịch vụ</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">3. Quyền lợi và trách nhiệm</h2>
          <p class="mb-4"><strong>3.1 Quyền lợi của bạn:</strong></p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li>Sử dụng các tính năng cơ bản miễn phí</li>
            <li>Nhận báo cáo chi tiết về thần số học</li>
            <li>Hủy tài khoản bất cứ lúc nào</li>
          </ul>

          <p class="mb-4"><strong>3.2 Trách nhiệm của chúng tôi:</strong></p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li>Duy trì dịch vụ ổn định</li>
            <li>Bảo mật thông tin người dùng</li>
            <li>Hỗ trợ kỹ thuật khi cần thiết</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">4. Thanh toán và hoàn tiền</h2>
          <p class="mb-4">Đối với các dịch vụ trả phí:</p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li>Thanh toán một lần hoặc theo định kỳ</li>
            <li>Hoàn tiền trong vòng 7 ngày nếu không hài lòng</li>
            <li>Không hoàn tiền cho dịch vụ đã sử dụng</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">5. Bản quyền</h2>
          <p class="mb-4">Mọi nội dung trên nền tảng thuộc bản quyền của chúng tôi. Bạn không được:</p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li>Sao chép, phân phối trái phép</li>
            <li>Sử dụng cho mục đích thương mại</li>
            <li>Đăng tải lại trên các nền tảng khác</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">6. Chấm dứt dịch vụ</h2>
          <p class="mb-4">Chúng tôi có quyền chấm dứt tài khoản nếu:</p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li>Vi phạm điều khoản sử dụng</li>
            <li>Gian lận hoặc lạm dụng hệ thống</li>
            <li>Yêu cầu của cơ quan pháp luật</li>
          </ul>
        </section>

        <!-- <section>
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">7. Thay đổi điều khoản</h2>
          <p class="mb-4">Chúng tôi có thể cập nhật điều khoản này. Bạn sẽ được thông báo trước 30 ngày khi có thay đổi quan trọng.</p>
          <p>Mọi thắc mắc vui lòng liên hệ: <a href="mailto:support@thansohoc.com" class="text-blue-600 hover:underline">support@thansohoc.com</a></p>
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
.terms-page {
  @apply bg-gray-50 min-h-screen;
}

.prose ul {
  @apply mb-4;
}

.prose a {
  @apply text-blue-600 hover:text-blue-800 transition-colors;
}
</style>