<!-- pages/about.vue -->
<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold text-teal-800 mb-6 text-center">Thần số học - Người bạn đồng hành của bạn</h1>
      
      <section class="mb-10">
        <h2 class="text-2xl font-semibold text-teal-700 mb-4">Thần số học: Hiểu mình, hiểu đời</h2>
        <p class="text-gray-600 leading-relaxed">Thần số học không phải điều gì quá xa vời - nó giống như một người bạn, giúp bạn nhìn rõ hơn về bản thân, gia đình, và những bước đi trong cuộc sống. Ứng dụng của chúng tôi mang thần số học đến gần bạn hơn, với những gợi ý đơn giản, dễ áp dụng, để bạn tự tin hơn mỗi ngày.</p>
      </section>
      
      <section class="mb-10">
        <h2 class="text-2xl font-semibold text-teal-700 mb-4">Thần số học giúp gì cho bạn?</h2>
        <div class="space-y-8">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold text-teal-600 mb-2">Đặt tên con - Gửi gắm yêu thương</h3>
            <p class="text-gray-600">Bạn sắp có bé yêu? Chúng tôi dùng ngày sinh của bố mẹ để gợi ý cái tên hợp năng lượng gia đình, giúp bé lớn lên trong sự hòa hợp, khỏe mạnh và tràn đầy may mắn.</p>
            <p class="text-purple-700 mt-2 italic">Ví dụ: Bố mẹ sinh 15/03/1990 và 20/04/1992, tên "Bảo Anh" mang số định mệnh 6 - gắn kết yêu thương gia đình!</p>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold text-teal-600 mb-2">Tạo nickname - Thể hiện chính mình</h3>
            <p class="text-gray-600">Muốn một cái tên thật "chất" trên mạng? App gợi ý nickname dựa trên số linh hồn và số định mệnh, để bạn nổi bật theo cách riêng của mình.</p>
            <p class="text-purple-700 mt-2 italic">Ví dụ: "MiaPhan" (số linh hồn 5) - dành cho người thích tự do và luôn sáng tạo!</p>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold text-teal-600 mb-2">Đặt tên thương hiệu - Bắt đầu giấc mơ</h3>
            <p class="text-gray-600">Bạn đang ấp ủ một ý tưởng kinh doanh? Chúng tôi gợi ý tên thương hiệu hợp với bạn và ngành nghề, để hành trình khởi nghiệp của bạn thêm thuận lợi.</p>
            <p class="text-purple-700 mt-2 italic">Ví dụ: "NovaTech9" (số định mệnh 9) - tên công nghệ mang năng lượng lớn, sẵn sàng vươn xa!</p>
            <nuxt-link to="/numerology-brand" class="text-teal-500 hover:underline mt-2 inline-block">Thử ngay</nuxt-link>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold text-teal-600 mb-2">Kiểm tra mức độ hợp nhau - Gắn kết yêu thương</h3>
            <p class="text-gray-600">Bạn đang phân vân về mối quan hệ với người yêu, bạn bè, hay đồng nghiệp? App phân tích con số của cả hai để giúp bạn hiểu rõ hơn và xây dựng tình cảm bền chặt.</p>
            <p class="text-purple-700 mt-2 italic">Ví dụ: Số chủ đạo 9 và 3 - hai tâm hồn sáng tạo, dễ đồng điệu!</p>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold text-teal-600 mb-2">Thần số học trọn đời - Hành trình của bạn</h3>
            <p class="text-gray-600">Muốn biết cuộc đời mình sẽ ra sao? App đưa ra báo cáo chi tiết qua từng giai đoạn, từ những năm đầu đời đến tuổi về hưu, để bạn luôn sẵn sàng cho mọi điều phía trước.</p>
            <p class="text-purple-700 mt-2 italic">Ví dụ: Số chủ đạo 1 - 30-40 tuổi là thời điểm bạn tỏa sáng rực rỡ!</p>
            <nuxt-link to="/numerology-full" class="text-teal-500 hover:underline mt-2 inline-block">Khám phá ngay</nuxt-link>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold text-teal-600 mb-2">Giải đáp thắc mắc - Lắng nghe câu hỏi của bạn</h3>
            <p class="text-gray-600">Có điều gì khiến bạn băn khoăn? Chỉ cần nhập câu hỏi, app sẽ phân tích dựa trên con số của bạn để đưa ra lời khuyên gần gũi, dễ hiểu, giúp bạn quyết định đúng lúc.</p>
            <p class="text-purple-700 mt-2 italic">Ví dụ: "Tôi có nên sinh em bé trong năm nay không?" - Với số chủ đạo 6, năm nay là thời điểm tốt để gia đình thêm yêu thương!</p>
          </div>
        </div>
      </section>
      
      <section class="mb-10">
        <h2 class="text-2xl font-semibold text-teal-700 mb-4">Case Study: Khi Thần số học dẫn lối</h2>
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold text-teal-600 mb-2">Elon Musk (Quốc tế) - Người mơ lớn</h3>
            <p class="text-gray-600">Ngày sinh: 28/06/1971 - Số chủ đạo: 7, Số linh hồn: 5 (từ "Elon"), Số định mệnh: 9 (từ "Elon Musk"). Số 7 thích tìm tòi, số 5 khao khát tự do, số 9 mang lý tưởng lớn. Từ một kỹ sư, Elon đã xây dựng Tesla và SpaceX, đưa ước mơ vũ trụ thành hiện thực.</p>
            <p class="text-purple-700 mt-2 italic">"Số 7 khơi dậy trí tò mò, số 5 phá bỏ giới hạn, số 9 giúp Elon viết nên câu chuyện cho cả nhân loại!"</p>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold text-teal-600 mb-2">Oprah Winfrey (Quốc tế) - Người lan tỏa yêu thương</h3>
            <p class="text-gray-600">Ngày sinh: 29/01/1954 - Số chủ đạo: 4, Số linh hồn: 7 (từ "Oprah"), Số định mệnh: 3 (từ "Oprah Winfrey"). Số 4 bền bỉ, số 7 tìm ý nghĩa, số 3 lan tỏa cảm hứng. Oprah vượt qua khó khăn để trở thành người dẫn chương trình truyền hình ảnh hưởng nhất thế giới.</p>
            <p class="text-purple-700 mt-2 italic">"Số 4 xây đắp từng bước, số 7 tìm ánh sáng trong tâm hồn, số 3 giúp Oprah chạm đến trái tim triệu người!"</p>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold text-teal-600 mb-2">Phạm Nhật Vượng (Việt Nam) - Người mở đường</h3>
            <p class="text-gray-600">Ngày sinh: 05/08/1968 - Số chủ đạo: 1, Số linh hồn: 1 (từ "Vượng"), Số định mệnh: 5 (từ "Phạm Nhật Vượng"). Số 1 mạnh mẽ, số 5 đổi mới. Từ một người bán mì gói, ông xây dựng Vingroup, đưa VinFast ra thế giới.</p>
            <p class="text-purple-700 mt-2 italic">"Số 1 dẫn lối kiên định, số 5 mở ra chân trời mới, Vượng là minh chứng cho giấc mơ không giới hạn!"</p>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold text-teal-600 mb-2">Nguyễn Thị Phương Thảo (Việt Nam) - Người bay cao</h3>
            <p class="text-gray-600">Ngày sinh: 07/06/1970 - Số chủ đạo: 3, Số linh hồn: 6 (từ "Thảo"), Số định mệnh: 9 (từ "Nguyễn Thị Phương Thảo"). Số 3 sáng tạo, số 6 ấm áp, số 9 mơ lớn. Bà Thảo đưa VietJet bay khắp bầu trời với những ý tưởng táo bạo.</p>
            <p class="text-purple-700 mt-2 italic">"Số 3 thắp sáng ý tưởng, số 6 chăm sóc gia đình lớn, số 9 đưa Thảo đến đỉnh cao của bầu trời Việt!"</p>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold text-teal-600 mb-2">Đặng Lê Nguyên Vũ (Việt Nam) - Người kể chuyện cà phê</h3>
            <p class="text-gray-600">Ngày sinh: 10/02/1971 - Số chủ đạo: 3, Số linh hồn: 5 (từ "Vũ"), Số định mệnh: 7 (từ "Đặng Lê Nguyên Vũ"). Số 3 sáng tạo, số 5 tự do, số 7 sâu sắc. Ông Vũ biến Trung Nguyên thành câu chuyện cà phê đầy cảm hứng.</p>
            <p class="text-purple-700 mt-2 italic">"Số 3 vẽ nên đam mê, số 5 bay xa, số 7 giúp Vũ kể câu chuyện cà phê chạm đến từng tâm hồn!"</p>
          </div>
        </div>
      </section>
      
      <section class="mb-10">
        <h2 class="text-2xl font-semibold text-teal-700 mb-4">Tại sao chọn chúng tôi?</h2>
        <p class="text-gray-600 leading-relaxed">Chúng tôi không chỉ là một ứng dụng, mà là người bạn luôn sẵn sàng lắng nghe và đồng hành cùng bạn. Thần số học với chúng tôi là cách để bạn hiểu mình hơn, đưa ra lựa chọn tốt hơn, từ những điều nhỏ bé đến những quyết định lớn trong đời.</p>
      </section>
      
      <div class="text-center">
        <nuxt-link to="/dashboard" class="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 text-lg font-semibold">
          Khám phá ngay
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
});
</script>