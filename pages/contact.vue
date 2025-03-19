<template>
  <div class="relative h-[calc(100vh-180px)] bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 py-12">
    <!-- Background pattern -->
    <div class="inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

    <!-- Container chính -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative">
      <!-- Tiêu đề -->
      <h1 class="text-4xl md:text-5xl font-extrabold text-white text-center mb-6 tracking-tight">
        Liên hệ với Offitify
      </h1>
      <p class="text-lg text-gray-200 text-center mb-12">
       Bạn có gì thắc mắc không? Muốn góp ý? Hay chỉ muốn chém gió với tụi mình? Đừng ngại, để lại dấu ấn dưới đây nhé!
      </p>

      <!-- Card chính -->
      <div class="bg-white rounded-xl shadow-2xl p-8 md:p-12">
        <p class="text-gray-600 text-center mb-8">
          Gửi tin nhắn cho tụi mình qua mạng xã hội hoặc email, tụi mình sẽ trả lời sớm nhất có thể (khi nào hết bận họp với cái ghế xoay)!
        </p>

        <!-- Liên kết mạng xã hội -->
        <div class="flex justify-center gap-6 mb-8">
          <a
            href="https://facebook.com/offitify"
            target="_blank"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.845c0-2.509 1.493-3.89 3.778-3.89.755 0 1.545.134 1.545.134v1.697h-.87c-.857 0-1.124.532-1.124 1.077V12h1.91l-.305 2.891h-1.605v6.987C18.343 21.128 22 16.991 22 12z" />
            </svg>
            Facebook
          </a>
          <a
            href="mailto:support@offitify.com"
            class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded589-lg hover:bg-red-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2l-8 5-8-5h16zm-2 12H6V8l6 4.5L18 8v10z" />
            </svg>
            Email
          </a>
        </div>

        <!-- Fun fact nhỏ -->
        <div class="text-center text-gray-500 text-sm">
          <p>Fun fact: 80% tin nhắn của tụi mình được trả lời trong vòng 1 tách cà phê!</p>
        </div>
      </div>

      <!-- Nút quay lại -->
      <!-- <div class="mt-8 text-center">
        <NuxtLink
          to="/"
          class="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại trang chủ
        </NuxtLink>
      </div> -->
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default', // Dùng layout mặc định nếu có
});

useHead({
  title: 'Liên hệ - Offitify',
  meta: [
    { name: 'description', content: 'Liên hệ với Offitify qua mạng xã hội hoặc email để được hỗ trợ nhanh chóng!' },
  ],
});
</script>

<style scoped>
/* Không cần scoped CSS vì dùng Tailwind */
</style>