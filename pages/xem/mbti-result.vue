<template>
  <div class="container mx-auto p-4 sm:p-6">
    <h1 class="text-3xl sm:text-4xl font-bold text-purple-900 mb-8 text-center">Kết quả trắc nghiệm MBTI</h1>
    
    <div v-if="!store.mbtiCompleted" class="bg-white rounded-xl shadow-lg p-6 text-center">
      <p class="text-gray-600 mb-6">Bạn chưa hoàn thành trắc nghiệm MBTI. Vui lòng thực hiện trước!</p>
      <NuxtLink to="/mbti"
                class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 animate-pulse-once shadow-md">
        Làm bài ngay
      </NuxtLink>
    </div>
    
    <div v-else class="space-y-8">
      <!-- Kiểu MBTI chính -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-purple-900 mb-4">Kiểu MBTI của bạn: {{ mbtiType }}</h2>
        <p class="text-gray-700 mb-6">{{ descriptions[mbtiType]?.summary || 'Không xác định. Vui lòng làm lại bài trắc nghiệm.' }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div v-for="(score, dim) in dimensions" :key="dim" class="bg-gray-50 p-4 rounded-lg text-center">
            <p class="font-semibold text-gray-800">{{ dim }}</p>
            <div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden relative">
              <div class="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
                   :style="{ width: `${score}%` }"></div>
              <span class="absolute inset-0 flex items-center justify-center text-xs text-white font-semibold"
                    :class="{ 'text-gray-700': score < 30 }">
                {{ score }}%
              </span>
            </div>
          </div>
        </div>
        <p class="text-gray-600 italic">Tỷ lệ phần trăm thể hiện mức độ ưu thế của từng chiều trong tính cách của bạn.</p>
      </div>
      
      <!-- Chi tiết đặc điểm -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-purple-900 mb-4">Đặc điểm chi tiết</h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ mbtiType }} - {{ descriptions[mbtiType]?.title }}</h3>
            <p class="text-gray-700 mb-4">{{ descriptions[mbtiType]?.detail }}</p>
            <p class="text-gray-600"><strong>Điểm mạnh:</strong> {{ descriptions[mbtiType]?.strengths }}</p>
            <p class="text-gray-600"><strong>Điểm yếu:</strong> {{ descriptions[mbtiType]?.weaknesses }}</p>
            <p class="text-gray-600 mt-2"><strong>Ứng dụng trong công việc:</strong> {{ descriptions[mbtiType]?.work }}</p>
            <p class="text-gray-600"><strong>Ứng dụng trong quan hệ:</strong> {{ descriptions[mbtiType]?.relationships }}</p>
          </div>
        </div>
      </div>
      
      <!-- Lời khuyên phát triển -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-purple-900 mb-4">Lời khuyên phát triển</h2>
        <div class="space-y-4">
          <div v-for="(advice, index) in advice[mbtiType]" :key="index" class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-lg font-semibold text-gray-800">{{ advice.title }}</h4>
            <p class="text-gray-700">{{ advice.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Button reset -->
      <div class="text-center space-x-4">
        <button @click="resetQuiz"
                class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 animate-pulse-once shadow-md">
          Làm lại bài trắc nghiệm
        </button>
        <!-- <button @click="shareResult"
                class="inline-block bg-gray-200 text-gray-700 py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 shadow-md">
          Chia sẻ kết quả
        </button> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAssessmentStore } from '~/stores/assessment';
import { useRouter } from 'vue-router';
import { useHead } from '#app';

const store = useAssessmentStore();
const router = useRouter();

useHead({
  title: 'Kết quả trắc nghiệm MBTI - Thần Số Học',
  meta: [
    { name: 'description', content: 'Xem kết quả trắc nghiệm MBTI chi tiết với loại tính cách, điểm số, ứng dụng thực tế và lời khuyên phát triển.' }
  ]
});

const dimensions = computed(() => {
  console.log('MBTI answers:', store.mbtiAnswers);
  const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  Object.values(store.mbtiAnswers).forEach(answer => {
    counts[answer]++;
  });
  return {
    'E/I': counts.E + counts.I > 0 ? Math.round((counts.E / (counts.E + counts.I)) * 100) : 0,
    'S/N': counts.S + counts.N > 0 ? Math.round((counts.S / (counts.S + counts.N)) * 100) : 0,
    'T/F': counts.T + counts.F > 0 ? Math.round((counts.T / (counts.T + counts.F)) * 100) : 0,
    'J/P': counts.J + counts.P > 0 ? Math.round((counts.J / (counts.J + counts.P)) * 100) : 0
  };
});

const mbtiType = computed(() => {
  const ei = dimensions.value['E/I'] > 50 ? 'E' : 'I';
  const sn = dimensions.value['S/N'] > 50 ? 'S' : 'N';
  const tf = dimensions.value['T/F'] > 50 ? 'T' : 'F';
  const jp = dimensions.value['J/P'] > 50 ? 'J' : 'P';
  const type = `${ei}${sn}${tf}${jp}`;
  console.log('Calculated MBTI type:', type);
  return type;
});

const descriptions = {
  INTJ: {
    title: 'Kiến trúc sư',
    summary: 'Sáng tạo, chiến lược, độc lập, luôn hướng đến việc xây dựng hệ thống hiệu quả.',
    detail: 'Bạn là người có tầm nhìn xa, thích lập kế hoạch dài hạn và giải quyết các vấn đề phức tạp. Bạn làm việc tốt một mình, sử dụng tư duy logic và sáng tạo để đạt được mục tiêu. INTJ thường được biết đến với khả năng dự đoán và tối ưu hóa.',
    strengths: 'Tư duy chiến lược, độc lập, tự tin, khả năng phân tích xuất sắc.',
    weaknesses: 'Khó diễn đạt cảm xúc, đôi khi quá lý thuyết, dễ bỏ qua chi tiết nhỏ.',
    work: 'Phù hợp với các vai trò như chiến lược gia, nhà khoa học, kỹ sư phần mềm, hoặc tư vấn quản lý.',
    relationships: 'Bạn đánh giá cao sự trung thực và trí tuệ trong các mối quan hệ, nhưng cần học cách cởi mở hơn về cảm xúc.'
  },
  INTP: {
    title: 'Nhà tư duy',
    summary: 'Phân tích, tò mò, yêu thích khám phá ý tưởng mới.',
    detail: 'Bạn là người yêu thích tư duy logic và khám phá các khái niệm trừu tượng. INTP thường đặt câu hỏi "tại sao" và tìm cách hiểu sâu sắc về thế giới xung quanh.',
    strengths: 'Tư duy sáng tạo, logic, độc lập, khả năng giải quyết vấn đề.',
    weaknesses: 'Dễ bị phân tâm, khó hoàn thành dự án, ít chú ý đến cảm xúc.',
    work: 'Phù hợp với nghiên cứu, lập trình, triết học, hoặc viết lách.',
    relationships: 'Bạn cần không gian riêng trong mối quan hệ, nhưng nên học cách bày tỏ cảm xúc.'
  },
  ENTJ: {
    title: 'Nhà lãnh đạo',
    summary: 'Quyết đoán, định hướng mục tiêu, giỏi tổ chức.',
    detail: 'Bạn là người lãnh đạo bẩm sinh, luôn đặt mục tiêu cao và tổ chức mọi người để đạt được chúng. ENTJ thích kiểm soát và đưa ra quyết định chiến lược.',
    strengths: 'Lãnh đạo mạnh mẽ, tự tin, tư duy chiến lược, hiệu quả.',
    weaknesses: 'Có thể thiếu kiên nhẫn, quá tập trung vào mục tiêu, ít chú ý đến cảm xúc.',
    work: 'Phù hợp với quản lý, khởi nghiệp, chính trị, hoặc tư vấn chiến lược.',
    relationships: 'Bạn dẫn dắt trong mối quan hệ, nhưng cần chú ý đến nhu cầu cảm xúc của đối phương.'
  },
  ENTP: {
    title: 'Nhà tranh luận',
    summary: 'Sáng tạo, nhanh trí, thích thử thách ý tưởng.',
    detail: 'Bạn là người yêu thích tranh luận và khám phá các góc nhìn mới. ENTP thường đưa ra ý tưởng sáng tạo và không ngại thử nghiệm.',
    strengths: 'Sáng tạo, linh hoạt, giao tiếp tốt, tư duy nhanh.',
    weaknesses: 'Dễ bị phân tâm, thiếu kiên nhẫn, đôi khi thiếu cam kết.',
    work: 'Phù hợp với khởi nghiệp, marketing, luật sư, hoặc sáng tạo nội dung.',
    relationships: 'Bạn thích sự kích thích trí tuệ, nhưng cần học cách duy trì cam kết.'
  },
  INFJ: {
    title: 'Người bảo vệ',
    summary: 'Lý tưởng, sâu sắc, luôn tìm kiếm ý nghĩa.',
    detail: 'Bạn là người có trực giác mạnh mẽ, luôn tìm cách giúp đỡ người khác và tạo ra thay đổi tích cực. INFJ thường nhạy cảm và sâu sắc.',
    strengths: 'Đồng cảm, sáng tạo, định hướng giá trị, khả năng lắng nghe.',
    weaknesses: 'Quá lý tưởng, dễ bị kiệt sức, khó từ chối.',
    work: 'Phù hợp với tư vấn tâm lý, giáo dục, viết lách, hoặc hoạt động xã hội.',
    relationships: 'Bạn tìm kiếm sự kết nối sâu sắc, nhưng cần đặt ranh giới để bảo vệ năng lượng.'
  },
  INFP: {
    title: 'Người lý tưởng',
    summary: 'Đồng cảm, sáng tạo, sống theo giá trị.',
    detail: 'Bạn là người sống nội tâm, luôn tìm kiếm ý nghĩa và làm theo trái tim. INFP thường có trí tưởng tượng phong phú và yêu nghệ thuật.',
    strengths: 'Đồng cảm, sáng tạo, trung thực, lý tưởng.',
    weaknesses: 'Dễ bị tổn thương, khó đối mặt với thực tế, thiếu quyết đoán.',
    work: 'Phù hợp với nghệ thuật, viết lách, tư vấn, hoặc công tác xã hội.',
    relationships: 'Bạn tìm kiếm sự chân thành, nhưng cần học cách đối mặt với xung đột.'
  },
  ENFJ: {
    title: 'Người truyền cảm hứng',
    summary: 'Nhiệt huyết, đồng cảm, giỏi dẫn dắt.',
    detail: 'Bạn là người truyền động lực, luôn khuyến khích người khác đạt được tiềm năng. ENFJ giỏi xây dựng mối quan hệ và dẫn dắt nhóm.',
    strengths: 'Giao tiếp xuất sắc, đồng cảm, lãnh đạo truyền cảm hứng.',
    weaknesses: 'Dễ bỏ qua nhu cầu cá nhân, quá lý tưởng, nhạy cảm với phê bình.',
    work: 'Phù hợp với giáo dục, tư vấn, quản lý nhân sự, hoặc diễn giả.',
    relationships: 'Bạn là người hỗ trợ tuyệt vời, nhưng cần đặt ranh giới để bảo vệ bản thân.'
  },
  ENFP: {
    title: 'Nhà vận động',
    summary: 'Nhiệt huyết, sáng tạo, hòa đồng.',
    detail: 'Bạn là người tràn đầy năng lượng, luôn tìm kiếm cơ hội mới và kết nối với mọi người. ENFP thích khám phá ý tưởng và truyền cảm hứng.',
    strengths: 'Sáng tạo, đồng cảm, linh hoạt, giao tiếp tốt.',
    weaknesses: 'Thiếu tập trung, dễ trì hoãn, khó hoàn thành công việc.',
    work: 'Phù hợp với marketing, viết lách, tổ chức sự kiện, hoặc khởi nghiệp.',
    relationships: 'Bạn dễ dàng kết nối, nhưng cần chú ý giữ cam kết lâu dài.'
  },
  ISTJ: {
    title: 'Người trách nhiệm',
    summary: 'Cẩn thận, đáng tin cậy, chú trọng chi tiết.',
    detail: 'Bạn là người có trách nhiệm cao, làm việc theo quy trình và đảm bảo mọi thứ được thực hiện đúng. ISTJ thích sự ổn định và trật tự.',
    strengths: 'Có tổ chức, đáng tin, logic, chú trọng chi tiết.',
    weaknesses: 'Khó linh hoạt, không thích thay đổi, đôi khi quá cứng nhắc.',
    work: 'Phù hợp với kế toán, quản lý dự án, luật sư, hoặc hành chính.',
    relationships: 'Bạn đáng tin cậy, nhưng cần cởi mở hơn về cảm xúc.'
  },
  ISFJ: {
    title: 'Người chăm sóc',
    summary: 'Kiên nhẫn, đồng cảm, luôn hỗ trợ người khác.',
    detail: 'Bạn là người chu đáo, luôn đặt nhu cầu của người khác lên hàng đầu. ISFJ thích hỗ trợ và duy trì sự hòa hợp.',
    strengths: 'Đồng cảm, đáng tin, chăm chỉ, chú trọng chi tiết.',
    weaknesses: 'Khó từ chối, dễ bị lợi dụng, tránh xung đột.',
    work: 'Phù hợp với y tế, giáo dục, dịch vụ khách hàng, hoặc hành chính.',
    relationships: 'Bạn là người bạn đồng hành tuyệt vời, nhưng cần bày tỏ nhu cầu cá nhân.'
  },
  ESTJ: {
    title: 'Người quản lý',
    summary: 'Hiệu quả, có tổ chức, định hướng mục tiêu.',
    detail: 'Bạn là người thực tế, thích quản lý và tổ chức công việc. ESTJ giỏi duy trì trật tự và đạt được kết quả.',
    strengths: 'Lãnh đạo mạnh mẽ, có tổ chức, thực tế, đáng tin.',
    weaknesses: 'Quá cứng nhắc, ít chú ý đến cảm xúc, áp lực với người khác.',
    work: 'Phù hợp với quản lý, tài chính, luật sư, hoặc quân đội.',
    relationships: 'Bạn dẫn dắt trong mối quan hệ, nhưng cần chú ý đến cảm xúc của đối phương.'
  },
  ESFJ: {
    title: 'Người kết nối',
    summary: 'Hòa đồng, đồng cảm, giỏi xây dựng mối quan hệ.',
    detail: 'Bạn là người ấm áp, luôn quan tâm đến mọi người xung quanh. ESFJ thích tổ chức và duy trì sự hòa hợp trong nhóm.',
    strengths: 'Giao tiếp tốt, đồng cảm, có tổ chức, trung thành.',
    weaknesses: 'Dễ bị ảnh hưởng bởi ý kiến người khác, tránh xung đột.',
    work: 'Phù hợp với giáo dục, y tế, quan hệ công chúng, hoặc tổ chức sự kiện.',
    relationships: 'Bạn là người hỗ trợ tuyệt vời, nhưng cần học cách đặt ranh giới.'
  },
  ISTP: {
    title: 'Người thợ thủ công',
    summary: 'Thực tế, linh hoạt, giỏi giải quyết vấn đề.',
    detail: 'Bạn là người thực tế, thích làm việc với tay chân và giải quyết vấn đề tức thì. ISTP thường độc lập và thích tự do.',
    strengths: 'Linh hoạt, logic, thực tế, khả năng ứng biến.',
    weaknesses: 'Khó cam kết, ít bày tỏ cảm xúc, dễ bị phân tâm.',
    work: 'Phù hợp với kỹ sư, cơ khí, phi công, hoặc thể thao.',
    relationships: 'Bạn cần không gian riêng, nhưng nên học cách chia sẻ cảm xúc.'
  },
  ISFP: {
    title: 'Nghệ sĩ',
    summary: 'Nhạy cảm, sáng tạo, sống theo cảm xúc.',
    detail: 'Bạn là người yêu cái đẹp, sống theo giá trị cá nhân và thích sáng tạo. ISFP thường nhẹ nhàng và nhạy cảm.',
    strengths: 'Sáng tạo, đồng cảm, linh hoạt, trung thực.',
    weaknesses: 'Dễ bị tổn thương, tránh xung đột, khó lập kế hoạch dài hạn.',
    work: 'Phù hợp với nghệ thuật, thiết kế, giáo dục, hoặc công tác xã hội.',
    relationships: 'Bạn tìm kiếm sự chân thành, nhưng cần đối mặt với xung đột.'
  },
  ESTP: {
    title: 'Người hành động',
    summary: 'Năng động, thực tế, thích mạo hiểm.',
    detail: 'Bạn là người sống cho hiện tại, thích hành động nhanh và giải quyết vấn đề tức thì. ESTP thường năng động và lôi cuốn.',
    strengths: 'Linh hoạt, giao tiếp tốt, ứng biến nhanh, thực tế.',
    weaknesses: 'Thiếu kiên nhẫn, dễ mạo hiểm, khó lập kế hoạch dài hạn.',
    work: 'Phù hợp với kinh doanh, thể thao, cứu hỏa, hoặc giải trí.',
    relationships: 'Bạn thích sự kích thích, nhưng cần học cách duy trì cam kết.'
  },
  ESFP: {
    title: 'Người biểu diễn',
    summary: 'Hòa đồng, vui vẻ, sống cho hiện tại.',
    detail: 'Bạn là trung tâm của mọi bữa tiệc, luôn mang lại niềm vui và năng lượng. ESFP thích trải nghiệm mới và kết nối với mọi người.',
    strengths: 'Giao tiếp tốt, đồng cảm, linh hoạt, nhiệt huyết.',
    weaknesses: 'Dễ bị phân tâm, thiếu kế hoạch, nhạy cảm với phê bình.',
    work: 'Phù hợp với giải trí, du lịch, tổ chức sự kiện, hoặc dịch vụ khách hàng.',
    relationships: 'Bạn dễ dàng kết nối, nhưng cần chú ý đến cam kết lâu dài.'
  }
};

const advice = {
  INTJ: [
    {
      title: 'Cân bằng lý trí và cảm xúc',
      description: 'Học cách bày tỏ cảm xúc và kết nối với người khác để xây dựng mối quan hệ sâu sắc hơn. Thử viết nhật ký cảm xúc hoặc tham gia các buổi trò chuyện thân mật.'
    },
    {
      title: 'Linh hoạt với thay đổi',
      description: 'Thử chấp nhận các tình huống không theo kế hoạch bằng cách đặt mục tiêu nhỏ và thích nghi từng bước.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Tìm các vai trò như chiến lược gia, nhà khoa học, hoặc kỹ sư, nơi bạn có thể sử dụng tư duy phân tích và tầm nhìn dài hạn.'
    },
    {
      title: 'Quản lý stress',
      description: 'Thực hành thiền hoặc yoga để giảm áp lực từ việc theo đuổi mục tiêu lớn.'
    }
  ],
  INTP: [
    {
      title: 'Hoàn thành dự án',
      description: 'Sử dụng công cụ quản lý như Trello để theo dõi tiến độ và hoàn thành các ý tưởng của bạn.'
    },
    {
      title: 'Giao tiếp cảm xúc',
      description: 'Học cách chia sẻ cảm xúc với người thân để xây dựng mối quan hệ gần gũi hơn.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Khám phá nghiên cứu, lập trình, hoặc viết lách, nơi bạn có thể phát huy tư duy logic và sáng tạo.'
    },
    {
      title: 'Tăng cường tập trung',
      description: 'Sử dụng kỹ thuật Pomodoro để làm việc hiệu quả hơn và tránh bị phân tâm.'
    }
  ],
  ENTJ: [
    {
      title: 'Lắng nghe người khác',
      description: 'Dành thời gian lắng nghe ý kiến của đồng đội để cải thiện hiệu quả làm việc nhóm và xây dựng lòng tin.'
    },
    {
      title: 'Quản lý cảm xúc',
      description: 'Học cách kiểm soát cảm xúc khi áp lực cao bằng cách thực hành hít thở sâu hoặc tạm nghỉ.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Tìm các vai trò như quản lý, khởi nghiệp, hoặc tư vấn, nơi bạn có thể dẫn dắt và tổ chức.'
    },
    {
      title: 'Cân bằng công việc và cuộc sống',
      description: 'Dành thời gian cho gia đình và sở thích cá nhân để tránh kiệt sức.'
    }
  ],
  ENTP: [
    {
      title: 'Duy trì cam kết',
      description: 'Lập kế hoạch dài hạn và ưu tiên các dự án quan trọng để tránh bị phân tâm bởi ý tưởng mới.'
    },
    {
      title: 'Tăng cường tập trung',
      description: 'Sử dụng danh sách công việc hàng ngày để hoàn thành nhiệm vụ trước khi chuyển sang ý tưởng khác.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Khám phá khởi nghiệp, marketing, hoặc luật sư, nơi bạn có thể phát huy sự sáng tạo và tranh luận.'
    },
    {
      title: 'Phát triển lắng nghe',
      description: 'Tập trung lắng nghe sâu để hiểu rõ nhu cầu và ý kiến của người khác.'
    }
  ],
  INFJ: [
    {
      title: 'Đặt ranh giới',
      description: 'Học cách nói "không" để bảo vệ năng lượng cá nhân và tránh bị kiệt sức khi giúp đỡ người khác.'
      },
      {
      title: 'Quản ánh nội tâm',
      description: 'Sử dụng nhật ký hoặc thiền để hiểu rõ nhu cầu và mục tiêu của bản thân.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Tìm các vai trò như tư vấn tâm lý, giáo viên, hoặc nhà hoạt động xã hội, nơi bạn có thể tạo ra thay đổi tích cực.'
    },
    {
      title: 'Quản lý stress',
      description: 'Thực hành yoga hoặc đi bộ để cân bằng cảm xúc và duy trì sức khỏe tinh thần.'
    }
  ],
  INFP: [
    {
      title: 'Đối mặt với thực tế',
      description: 'Lập kế hoạch cụ thể để biến ước mơ thành hiện thực tế, thực tế, bắt đầu từ những bước nhỏ nhỏ.'
      },
    {
      title: 'Tăng cường quyết đoán',
      description: 'Luyện tập bày tỏ ý kiến trong nhóm để xây dựng sự tự tin và được công nhận.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Khám phá nghệ thuật, viết lách, hoặc tư vấn, nơi bạn có thể phát huy sự sáng tạo và đồng cảm.'
    },
    {
      title: 'Quản lý cảm xúc',
      description: 'Sử dụng nhật ký để xử lý cảm xúc và tránh bị cuốn vào những suy nghĩ tiêu cực.'
    }
  ],
  ENFJ: [
    {
      title: 'Bảo vệ năng lượng',
      description: 'Đặt ranh giới để tránh bị kiệt sức khi hỗ trợ người khác. Dành thời gian cho bản thân.'
    },
    {
      title: 'Chấp nhận phê bình',
      description: 'Xem phê bình như cơ hội để cải thiện, thay vì cảm thấy bị tổn thương.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Tìm các vai trò như giáo dục, tư vấn, hoặc quản lý nhân sự, nơi bạn có thể truyền cảm hứng.'
    },
    {
      title: 'Cân bằng công việc',
      description: 'Dành thời gian cho sở thích cá nhân để duy trì sức khỏe tinh thần.'
    }
  ],
  ENFP: [
    {
      title: 'Hoàn thành nhiệm vụ',
      description: 'Sử dụng công cụ quản lý thời gian để ưu tiên và hoàn thành các dự án quan trọng.'
    },
    {
      title: 'Duy trì cam kết',
      description: 'Lập mục tiêu dài hạn và theo dõi tiến độ để tránh bị phân tâm bởi cơ hội mới.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Khám phá marketing, viết lách, hoặc tổ chức sự kiện, nơi bạn có thể phát huy sự sáng tạo.'
    },
    {
      title: 'Quản lý stress',
      description: 'Thực hành thiền hoặc đi bộ để cân bằng năng lượng và giảm căng thẳng.'
    }
  ],
  ISTJ: [
    {
      title: 'Tăng tính linh hoạt',
      description: 'Thử chấp nhận các phương pháp làm việc mới để thích nghi với thay đổi.'
    },
    {
      title: 'Cởi mở cảm xúc',
      description: 'Chia sẻ cảm xúc với người thân để xây dựng mối quan hệ gần gũi hơn.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Tìm các vai trò như kế toán, quản lý dự án, hoặc luật sư, nơi sự chính xác được đánh giá cao.'
    },
    {
      title: 'Quản lý stress',
      description: 'Thực hành các hoạt động thư giãn như đọc sách hoặc đi bộ để giảm căng thẳng.'
    }
  ],
  ISFJ: [
    {
      title: 'Bày tỏ nhu cầu',
      description: 'Học cách chia sẻ nhu cầu cá nhân để tránh bị lợi dụng hoặc kiệt sức.'
    },
    {
      title: 'Đối mặt với xung đột',
      description: 'Luyện tập thảo luận trực tiếp để giải quyết vấn đề thay vì tránh né.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Khám phá y tế, giáo dục, hoặc dịch vụ khách hàng, nơi bạn có thể hỗ trợ người khác.'
    },
    {
      title: 'Cân bằng công việc',
      description: 'Dành thời gian cho bản thân để duy trì sức khỏe tinh thần.'
    }
  ],
  ESTJ: [
    {
      title: 'Lắng nghe người khác',
      description: 'Dành thời gian lắng nghe ý kiến của đồng đội để cải thiện hiệu quả làm việc nhóm.'
    },
    {
      title: 'Quản lý cảm xúc',
      description: 'Học kiểm soát cảm xúc khi áp lực cao bằng cách hít thở hoặc tạm nghỉ.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Tìm các vai trò như quản lý, tài chính, hoặc luật sư, nơi bạn có thể tổ chức và dẫn dắt.'
    },
    {
      title: 'Cân bằng công việc',
      description: 'Dành thời gian cho gia đình và sở thích để tránh kiệt sức.'
    }
  ],
  ESFJ: [
    {
      title: 'Đặt ranh giới',
      description: 'Học cách nói "không" để bảo vệ năng lượng và thời gian cá nhân.'
    },
    {
      title: 'Chấp nhận phê bình',
      description: 'Xem phê bình như cơ hội để cải thiện, thay vì cảm thấy bị tổn thương.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Tìm các vai như giáo viên, quan hệ công chúng, hoặc tổ chức sự kiện, nơi bạn có thể kết nối.'
    },
    {
      title: 'Quản lý stress',
      description: 'Thực hành yoga hoặc thiền để cân bằng cảm xúc và giảm căng thẳng.'
    }
  ],
  ISTP: [
    {
      title: 'Duy trì cam kết',
      description: 'Lập kế hoạch nhỏ để hoàn thành nhiệm vụ và duy trì mối quan hệ lâu dài.'
      },
    {
      title: 'Bày tỏ cảm xúc',
      description: 'Chia sẻ cảm xúc với người thân để xây dựng sự kết nối sâu sắc hơn.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Khám phá kỹ sư, cơ khí, hoặc thể thao, nơi bạn có thể làm việc thực tế và linh hoạt.'
    },
    {
      title: 'Tăng cường tập trung',
      description: 'Sử dụng danh sách công việc để ưu tiên và hoàn thành nhiệm vụ.'
    }
  ],
  ISFP: [
    {
      title: 'Đối mặt với xung đột',
      description: 'Học cách thảo luận trực tiếp để giải quyết vấn đề thay vì tránh né.'
    },
    {
      title: 'Lập kế hoạch',
      description: 'Tạo mục tiêu nhỏ để tiến tới các dự án dài hạn và thực tế hơn.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Tìm nghệ thuật, thiết kế, hoặc giáo dục, nơi bạn có thể phát huy sự sáng tạo.'
    },
    {
      title: 'Quản lý cảm xúc',
      description: 'Sử dụng nhật ký hoặc nghệ thuật để xử lý cảm xúc và giảm căng thẳng.'
    }
  ],
  ESTP: [
    {
      title: 'Lập kế hoạch dài hạn',
      description: 'Sử dụng công cụ quản lý để theo dõi mục tiêu và tránh hành động bộc phát.'
    },
    {
      title: 'Duy trì cam kết',
      description: 'Tập trung vào các mối quan hệ và dự án dài hạn để xây dựng sự ổn định.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Khám phá kinh doanh, thể thao, hoặc giải trí, nơi bạn có thể hành động nhanh.'
    },
    {
      title: 'Quản lý stress',
      description: 'Thực hành các hoạt động thể chất để giải tỏa năng lượng và giảm căng thẳng.'
    }
  ],
  ESFP: [
    {
      title: 'Tăng cường tập trung',
      description: 'Sử dụng danh sách công việc để ưu tiên và hoàn thành nhiệm vụ quan trọng.'
    },
    {
      title: 'Chấp nhận phê bình',
      description: 'Xem phê bình như cơ hội để cải thiện, thay vì cảm thấy bị tổn thương.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Tìm các vai như giải trí, du lịch, hoặc dịch vụ khách hàng, nơi bạn có thể kết nối.'
    },
    {
      title: 'Quản lý tài chính',
      description: 'Lập ngân sách để kiểm soát chi tiêu và đạt mục tiêu tài chính dài hạn.'
    }
  ]
};

const resetQuiz = () => {
  store.resetMbti();
  router.push('/mbti');
};

const shareResult = () => {
  const text = `Kết quả trắc nghiệm của tôi MBTI: ${mbtiType} - ${descriptions[mbtiType]?.summary || 'Kiểm tra ngay'} tại than-so-hoc.com!`;
  if (navigator.share) {
    navigator.share({ title: 'Kết quả MBTI', text, url: window.location.href });
  } else {
    alert('Chức năng chia sẻ không khả dụng. Bạn có thể sao chép: ' + text);
  }
};
</script>

<style scoped>
@keyframes pulse-once {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.animate-pulse-once {
  animation: pulse-once 0.5s ease-in-out;
}
</style>
