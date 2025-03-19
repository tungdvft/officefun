<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1
          class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 animate-gradient"
        >
          Về Offitify
        </h1>
        <p class="mt-4 text-lg text-gray-600 italic">
          Nơi biến văn phòng thành không gian của niềm vui và sáng tạo
        </p>
      </div>

      <!-- Nội dung chính -->
      <div class="bg-white rounded-xl shadow-2xl p-8 md:p-12">
        <div class="space-y-8 text-gray-700 leading-relaxed">
          <!-- Phần 1 -->
          <div class="flex flex-col md:flex-row items-center gap-6">
            <div class="flex-1">
              <p class="text-lg">
                <span class="font-semibold text-blue-600">Offitify</span> ra đời từ một ý tưởng đơn
                giản: văn phòng không chỉ là nơi đầy ắp deadline, áp lực công việc và những buổi họp
                căng thẳng. Chúng tôi tin rằng, giữa nhịp sống hối hả ấy, vẫn có chỗ cho
                <span class="font-semibold text-pink-500">niềm vui</span>,
                <span class="font-semibold text-purple-500">sự sáng tạo</span> và những khoảnh khắc
                thư giãn để làm mới bản thân.
              </p>
            </div>
            <div class="flex-shrink-0 relative">
              <img
                src="/images/office-fun-team.jpg"
                alt="Office Fun Team"
                class="w-40 h-40 md:w-48 md:h-48 rounded-full shadow-md object-cover"
              />
              <div
                class="absolute inset-0 rounded-full bg-gradient-to-t from-gray-900/40 to-transparent"
              ></div>
            </div>
          </div>

          <!-- Phần 2 -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <p>
              Với Offitify, chúng tôi muốn biến mỗi ngày làm việc của bạn thành một trải nghiệm
              đáng nhớ. Không chỉ là những con số hay báo cáo, mà còn là những bản nhạc chill để xoa
              dịu tâm hồn, hay những mini game vui vẻ. Văn
              phòng không chỉ là nơi làm việc, mà còn là nơi bạn tìm thấy cảm hứng và kết nối.
            </p>
          </div>

          <!-- Phần 3 -->
          <div class="flex flex-col md:flex-row-reverse items-center gap-6">
            <div class="flex-1">
              <p>
                Chúng tôi hiểu rằng, đôi khi, áp lực công việc có thể khiến bạn quên mất rằng cuộc
                sống còn nhiều điều thú vị khác. Offitify ở đây để nhắc bạn: một ngày làm việc
                hiệu quả không cần phải khô khan. Hãy để chúng tôi đồng hành cùng bạn, mang đến
                những gợi ý nhỏ nhưng ý nghĩa – từ một câu quote truyền động lực, một lá bài tarot
                đầy bất ngờ, đến những mẹo vui để văn phòng bớt nhàm chán.
              </p>
            </div>
            <div class="flex-shrink-0 relative">
              <img
                src="/images/office-chill-vibe.jpg"
                alt="Office Chill Vibe"
                class="w-40 h-40 md:w-48 md:h-48 rounded-full shadow-md object-cover"
              />
              <div
                class="absolute inset-0 rounded-full bg-gradient-to-t from-gray-900/40 to-transparent"
              ></div>
            </div>
          </div>

          <!-- Phần 4 -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <p>
              Offitify không chỉ là một ứng dụng – nó là một người bạn. Chúng tôi hy vọng mỗi khi
              bạn mở app, bạn sẽ mỉm cười và nghĩ rằng: "Ừ, hôm nay cũng không tệ đâu nhỉ!" Dù là
              Thứ Hai bận rộn hay Thứ Sáu nhẹ nhàng, chúng tôi luôn ở đây để giúp bạn tìm thấy niềm
              vui trong từng khoảnh khắc.
            </p>
          </div>

          <!-- Kết thúc -->
          <p
            class="text-center text-2xl font-semibold text-gray-800 mt-10 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text"
          >
            Offitify – Bởi vì văn phòng cũng có thể là nơi để chill, để vui, và để sống đúng với
            chính mình!
          </p>
        </div>
      </div>

      <!-- Nút quay lại -->
      <!-- <div class="mt-10 text-center">
        <NuxtLink
          to="/"
          class="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
        >
          Quay lại trang chủ
        </NuxtLink>
      </div> -->
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
});
</script>

<style scoped>
.animate-gradient {
  animation: gradient 3s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>