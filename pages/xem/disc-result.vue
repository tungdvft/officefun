```vue
<template>
  <div class="container mx-auto p-4 sm:p-6">
    <h1 class="text-3xl sm:text-4xl font-bold text-purple-900 mb-8 text-center">Kết quả trắc nghiệm DISC</h1>
    
    <div v-if="!store.discCompleted" class="bg-white rounded-xl shadow-lg p-6 text-center">
      <p class="text-gray-600 mb-6">Bạn chưa hoàn thành trắc nghiệm DISC. Vui lòng thực hiện trước!</p>
      <NuxtLink to="/disc"
                class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 animate-pulse-once shadow-md">
        Làm bài ngay
      </NuxtLink>
    </div>
    
    <div v-else class="space-y-8">
      <!-- Kiểu DISC chính -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-purple-900 mb-4">Kiểu DISC của bạn: {{ primaryType }}</h2>
        <p class="text-gray-700 mb-6">{{ descriptions[primaryType]?.summary || 'Không xác định.' }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div v-for="(score, type) in scores" :key="type" class="bg-gray-50 p-4 rounded-lg text-center">
            <p class="font-semibold text-gray-800">{{ type }}: {{ score }}%</p>
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
        <p class="text-gray-600 italic">Tỷ lệ phần trăm thể hiện mức độ phù hợp của bạn với từng kiểu hành vi.</p>
      </div>
      
      <!-- Chi tiết đặc điểm -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-purple-900 mb-4">Đặc điểm chi tiết</h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ primaryType }} - {{ descriptions[primaryType]?.title }}</h3>
            <p class="text-gray-700 mb-4">{{ descriptions[primaryType]?.detail }}</p>
            <p class="text-gray-600"><strong>Điểm mạnh:</strong> {{ descriptions[primaryType]?.strengths }}</p>
            <p class="text-gray-600"><strong>Điểm yếu:</strong> {{ descriptions[primaryType]?.weaknesses }}</p>
            <p class="text-gray-600 mt-2"><strong>Ứng dụng trong công việc:</strong> {{ descriptions[primaryType]?.work }}</p>
            <p class="text-gray-600"><strong>Ứng dụng trong quan hệ:</strong> {{ descriptions[primaryType]?.relationships }}</p>
          </div>
        </div>
      </div>
      
      <!-- Lời khuyên phát triển -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-purple-900 mb-4">Lời khuyên phát triển</h2>
        <div class="space-y-4">
          <div v-for="(advice, index) in advice[primaryType]" :key="index" class="bg-gray-50 p-4 rounded-lg">
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
  title: 'Kết quả trắc nghiệm DISC - Thần Số Học',
  meta: [
    { name: 'description', content: 'Xem kết quả trắc nghiệm DISC chi tiết với điểm số, đặc điểm hành vi, ứng dụng thực tế và lời khuyên phát triển.' }
  ]
});

const scores = computed(() => {
  const counts = { D: 0, I: 0, S: 0, C: 0 };
  Object.values(store.discAnswers).forEach(answer => {
    counts[answer]++;
  });
  const total = Object.values(counts).reduce((sum, val) => sum + val, 0);
  return {
    D: total ? Math.round((counts.D / total) * 100) : 0,
    I: total ? Math.round((counts.I / total) * 100) : 0,
    S: total ? Math.round((counts.S / total) * 100) : 0,
    C: total ? Math.round((counts.C / total) * 100) : 0
  };
});

const primaryType = computed(() => {
  return Object.entries(scores.value).reduce((max, [type, score]) => score > max.score ? { type, score } : max, { type: 'D', score: 0 }).type;
});

const descriptions = {
  D: {
    title: 'Thống trị',
    summary: 'Người Thống trị: Quyết đoán, mạnh mẽ, định hướng kết quả.',
    detail: 'Bạn là người lãnh đạo bẩm sinh, luôn đặt mục tiêu cao và không ngại đối mặt với thách thức. Bạn thích kiểm soát tình huống và đưa ra quyết định nhanh chóng, thường dẫn dắt nhóm với sự tự tin và quyết tâm.',
    strengths: 'Lãnh đạo xuất sắc, tự tin, tập trung vào kết quả, khả năng ra quyết định nhanh.',
    weaknesses: 'Có thể thiếu kiên nhẫn, đôi khi áp đảo người khác, ít chú ý đến cảm xúc.',
    work: 'Phù hợp với vai trò quản lý, khởi nghiệp, hoặc các vị trí yêu cầu ra quyết định nhanh như giám đốc điều hành, trưởng phòng kinh doanh.',
    relationships: 'Bạn có xu hướng dẫn dắt trong các mối quan hệ, nhưng cần học cách lắng nghe và chia sẻ cảm xúc để xây dựng sự gắn kết.'
  },
  I: {
    title: 'Ảnh hưởng',
    summary: 'Người Ảnh hưởng: Năng động, thân thiện, truyền cảm hứng.',
    detail: 'Bạn là trung tâm của mọi cuộc trò chuyện, luôn mang đến năng lượng tích cực và khả năng thuyết phục. Bạn giỏi xây dựng mối quan hệ và thích làm việc trong môi trường hợp tác, sáng tạo.',
    strengths: 'Giao tiếp xuất sắc, sáng tạo, truyền động lực, xây dựng mối quan hệ tốt.',
    weaknesses: 'Dễ bị phân tâm, thiếu tập trung vào chi tiết, đôi khi quá lạc quan.',
    work: 'Phù hợp với marketing, quan hệ công chúng, diễn giả, hoặc các vai trò sáng tạo như thiết kế, tổ chức sự kiện.',
    relationships: 'Bạn dễ dàng kết nối với người khác, nhưng cần chú ý giữ cam kết và lắng nghe sâu sắc hơn.'
  },
  S: {
    title: 'Ổn định',
    summary: 'Người Ổn định: Kiên nhẫn, đáng tin cậy, hợp tác.',
    detail: 'Bạn là người đáng tin cậy, luôn hỗ trợ đồng đội và duy trì sự hòa hợp trong nhóm. Bạn thích môi trường ổn định, làm việc với quy trình rõ ràng và ưu tiên sự cân bằng.',
    strengths: 'Đồng cảm, trung thành, giỏi lắng nghe, tạo sự ổn định.',
    weaknesses: 'Khó thích nghi với thay đổi, thiếu quyết đoán, tránh xung đột.',
    work: 'Phù hợp với dịch vụ khách hàng, giáo dục, y tế, hoặc các vai trò hành chính yêu cầu sự kiên nhẫn.',
    relationships: 'Bạn là người bạn đồng hành tuyệt vời, nhưng cần học cách bày tỏ ý kiến và đối mặt với xung đột.'
  },
  C: {
    title: 'Tuân thủ',
    summary: 'Người Tuân thủ: Cẩn thận, phân tích, chú trọng chi tiết.',
    detail: 'Bạn là người tỉ mỉ, luôn đảm bảo mọi thứ được thực hiện chính xác và theo quy trình. Bạn giỏi phân tích dữ liệu, giải quyết vấn đề logic và thích làm việc trong môi trường có cấu trúc.',
    strengths: 'Chính xác, logic, có tổ chức, chú trọng chất lượng.',
    weaknesses: 'Quá cầu toàn, khó linh hoạt, đôi khi thiếu sáng tạo.',
    work: 'Phù hợp với kế toán, kỹ sư, phân tích dữ liệu, hoặc các vai trò nghiên cứu đòi hỏi sự chính xác.',
    relationships: 'Bạn đáng tin cậy trong các mối quan hệ, nhưng cần cởi mở hơn về cảm xúc và linh hoạt với người khác.'
  }
};

const advice = {
  D: [
    {
      title: 'Cải thiện kỹ năng lắng nghe',
      description: 'Tập trung vào việc lắng nghe ý kiến của đồng đội trước khi đưa ra quyết định. Điều này giúp bạn xây dựng mối quan hệ tốt hơn và tăng hiệu quả làm việc nhóm.'
    },
    {
      title: 'Quản lý cảm xúc',
      description: 'Khi đối mặt với áp lực, hãy dành thời gian để bình tĩnh và cân nhắc cảm xúc của người khác. Thiền hoặc kỹ thuật hít thở sâu có thể hữu ích.'
    },
    {
      title: 'Chia sẻ trách nhiệm',
      description: 'Học cách giao phó công việc cho người khác để giảm tải áp lực và phát triển kỹ năng lãnh đạo phân quyền.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Tìm kiếm các vai trò như giám đốc, nhà quản lý dự án, hoặc khởi nghiệp, nơi bạn có thể dẫn dắt và đưa ra quyết định chiến lược.'
    }
  ],
  I: [
    {
      title: 'Tăng cường tập trung',
      description: 'Sử dụng công cụ quản lý thời gian như Pomodoro để hoàn thành nhiệm vụ quan trọng trước khi chuyển sang ý tưởng mới.'
    },
    {
      title: 'Lập kế hoạch chi tiết',
      description: 'Tạo danh sách công việc hàng ngày và ưu tiên các mục tiêu dài hạn để tránh bị phân tâm bởi các cơ hội ngắn hạn.'
    },
    {
      title: 'Phát triển kỹ năng lắng nghe',
      description: 'Tập trung vào việc lắng nghe sâu để hiểu rõ nhu cầu của người khác, thay vì chỉ chia sẻ ý tưởng của bạn.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Khám phá các lĩnh vực như marketing, truyền thông, hoặc tổ chức sự kiện, nơi bạn có thể phát huy sự sáng tạo và giao tiếp.'
    }
  ],
  S: [
    {
      title: 'Đón nhận thay đổi',
      description: 'Thử tham gia các dự án mới hoặc học kỹ năng mới để tăng khả năng thích nghi. Bắt đầu với những thay đổi nhỏ để cảm thấy thoải mái hơn.'
    },
    {
      title: 'Tăng cường quyết đoán',
      description: 'Luyện tập bày tỏ ý kiến trong các cuộc họp hoặc thảo luận nhóm. Bắt đầu bằng cách chia sẻ ý tưởng nhỏ để xây dựng sự tự tin.'
    },
    {
      title: 'Quản lý xung đột',
      description: 'Học cách đối mặt với xung đột bằng cách thảo luận trực tiếp và tìm giải pháp đôi bên cùng có lợi.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Xem xét các công việc như hỗ trợ khách hàng, giáo viên, hoặc nhân viên y tế, nơi bạn có thể hỗ trợ và tạo sự ổn định.'
    }
  ],
  C: [
    {
      title: 'Tăng tính linh hoạt',
      description: 'Thử chấp nhận các phương pháp làm việc mới hoặc giải pháp chưa hoàn hảo để cải thiện tốc độ và hiệu quả.'
    },
    {
      title: 'Giảm cầu toàn',
      description: 'Đặt mục tiêu hoàn thành 80% công việc ở mức tốt thay vì 100% hoàn hảo để tiết kiệm thời gian và năng lượng.'
    },
    {
      title: 'Phát triển giao tiếp',
      description: 'Tham gia các khóa học giao tiếp hoặc thảo luận nhóm để chia sẻ ý tưởng và kết nối với đồng nghiệp.'
    },
    {
      title: 'Nghề nghiệp phù hợp',
      description: 'Tìm các vai trò như kế toán, phân tích dữ liệu, hoặc kỹ sư, nơi sự chính xác và logic của bạn được đánh giá cao.'
    }
  ]
};

const resetQuiz = () => {
  store.resetDisc();
  router.push('/disc');
};

const shareResult = () => {
  const text = `Kết quả trắc nghiệm DISC của tôi: ${primaryType} - ${descriptions[primaryType]?.summary} Xem ngay tại than-so-hoc.com!`;
  if (navigator.share) {
    navigator.share({ title: 'Kết quả DISC', text, url: window.location.href });
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
```