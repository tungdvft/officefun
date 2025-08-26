<template>
  <div class="bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
    <div class="container mx-auto p-4">
      <!-- Phần không bảo vệ (Tiêu đề, mô tả, form nhập thông tin) -->
      <div v-for="section in introSection" :key="section.title" class="space-y-6">
        <div v-if="section.type === 'header'" class="mb-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-blue-800 mb-2">{{ section.title }}</h2>
          <p class="text-gray-600">{{ section.description }}</p>
        </div>
        <div v-if="section.type === 'form'" class="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
          <h3 class="text-xl font-semibold text-purple-700 mb-4">Nhập thông tin cá nhân</h3>
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                <input
                  v-model="formData.name"
                  type="text"
                  id="name"
                  placeholder="Nguyễn Văn A"
                  :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.name ? 'border-red-500' : 'border-gray-300']"
                  @input="clearError('name')"
                />
                <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
              </div>
              <div>
                <label for="birthdate" class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh (DD/MM/YYYY hoặc DD-MM-YYYY)</label>
                <input
                  v-model="formData.birthdate"
                  type="text"
                  id="birthdate"
                  placeholder="15/03/1995"
                  :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.birthdate ? 'border-red-500' : 'border-gray-300']"
                  @input="clearError('birthdate')"
                />
                <p v-if="errors.birthdate" class="text-red-600 text-sm mt-1">{{ errors.birthdate }}</p>
              </div>
            </div>
            <div>
              <label for="currentJob" class="block text-sm font-medium text-gray-700 mb-2">Công việc hiện tại (nếu có)</label>
              <input
                v-model="formData.currentJob"
                type="text"
                id="currentJob"
                placeholder="Ví dụ: Lập trình viên, Giáo viên..."
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                @input="clearError('general')"
              />
            </div>
            <!-- Phần thông báo lỗi, trạng thái tải, hoặc nút hành động -->
            <div v-if="isLoading || loading" class="flex justify-center">
              <svg
                class="animate-spin h-8 w-8 text-purple-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <div v-else-if="errors.general" class="text-red-600 text-center font-medium p-6">
              {{ errors.general }}
            </div>
            <div v-else class="text-center p-6">
              <button @click="getCareerGuidance" class="action-button">
                Xem định hướng nghề nghiệp
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Phần kết quả định hướng nghề nghiệp -->
      <transition name="slide-fade">
        <div v-if="result" class="space-y-8">
          <div v-for="section in protectedSections" :key="section.title" class="space-y-6">
            <div v-if="section.type === 'overview' || section.type === 'advice'" class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <h3 class="text-xl font-semibold text-purple-700 mb-4 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                {{ section.title }}
              </h3>
              <div class="space-y-4">
                <div v-for="item in section.items" :key="item.title">
                  <h4 class="text-base font-semibold text-purple-700 flex items-center">
                    <svg :class="item.iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path :d="item.iconPath" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                    </svg>
                    {{ item.title }}
                  </h4>
                  <p class="text-gray-600 whitespace-pre-wrap">{{ item.content }}</p>
                </div>
              </div>
            </div>
            <div v-if="section.type === 'suggestions'" class="space-y-4">
              <h3 class="text-xl font-semibold text-purple-700 mb-4 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fill-rule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Đề xuất nghề nghiệp
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  v-for="(suggestion, index) in section.suggestions"
                  :key="index"
                  class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h4 class="text-base font-semibold text-purple-700 mb-3">{{ suggestion.job }}</h4>
                  <p class="text-gray-600 mb-2"><strong>Lý do phù hợp:</strong> {{ suggestion.reason }}</p>
                  <p class="text-gray-600 mb-2"><strong>Cơ hội hiện tại:</strong> {{ suggestion.opportunities }}</p>
                  <p class="text-gray-600"><strong>Xu hướng tương lai:</strong> {{ suggestion.trends }}</p>
                </div>
              </div>
              <div v-if="section.suggestions.length < maxSuggestions" class="text-center p-6">
                <div v-if="isLoadingMore || loadingMore" class="flex justify-center">
                  <svg
                    class="animate-spin h-8 w-8 text-teal-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <div v-else class="text-center p-6">
                  <button @click="loadMoreCareers" class="action-button">
                    Xem thêm nghề nghiệp phù hợp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';

definePageMeta({ layout: 'view' });

const formData = ref({
  name: '',
  birthdate: '',
  currentJob: '',
});
const result = ref(null);
const loading = ref(false);
const loadingMore = ref(false);
const errors = ref({
  name: '',
  birthdate: '',
  general: '',
});
const maxSuggestions = ref(12);
const isLoading = ref(false);
const isLoadingMore = ref(false);

// Phần không bảo vệ (Tiêu đề, mô tả, form nhập thông tin)
const introSection = computed(() => [
  {
    title: 'Định Hướng Nghề Nghiệp',
    description: 'Khám phá nghề nghiệp phù hợp với tính cách và năng lực của bạn',
    type: 'header',
  },
  {
    title: 'Nhập thông tin cá nhân',
    type: 'form',
  },
]);

// Phần kết quả định hướng nghề nghiệp
const protectedSections = computed(() => {
  if (!result.value) return [];
  return [
    {
      title: 'Định hướng nghề nghiệp',
      type: 'overview',
      items: [
        {
          title: 'Mục tiêu nghề nghiệp',
          content: result.value.careerGoals,
          iconClass: 'w-5 h-5 text-purple-500 mr-2',
          iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        },
        {
          title: 'Đam mê và động lực',
          content: result.value.passionAndMotivation,
          iconClass: 'w-5 h-5 text-green-500 mr-2',
          iconPath: 'M5 13l4 4L19 7',
        },
        {
          title: 'Phong cách làm việc',
          content: result.value.workStyle,
          iconClass: 'w-5 h-5 text-blue-500 mr-2',
          iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 1.857h10M12 4v8m-8 8h16',
        },
        {
          title: 'Con đường dài hạn',
          content: result.value.longTermPath,
          iconClass: 'w-5 h-5 text-yellow-500 mr-2',
          iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
        },
        ...(formData.value.currentJob
          ? [
              {
                title: 'Phân tích công việc hiện tại',
                content: result.value.currentJobAnalysis,
                iconClass: 'w-5 h-5 text-indigo-500 mr-2',
                iconPath: 'M9 17v-2m0-2v-2m0-2V7m6 10v-2m0-2v-2m0-2V7m-9 10h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
              },
            ]
          : []),
      ],
    },
    {
      title: 'Đề xuất nghề nghiệp',
      type: 'suggestions',
      suggestions: result.value.careerSuggestions || [],
    },
    {
      title: 'Lời khuyên thực tế',
      type: 'advice',
      items: [
        {
          title: 'Lời khuyên thực tế',
          content: result.value.practicalAdvice,
          iconClass: 'w-5 h-5 text-purple-600 mr-2',
          iconPath: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
        },
      ],
    },
  ];
});

// Hàm xóa lỗi
const clearError = (field) => {
  errors.value[field] = '';
  errors.value.general = '';
};

// Hàm tính số đường đời
const calculateLifePath = (dob) => {
  if (!dob || !/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(dob)) return null;
  const [day, month, year] = dob.replace('-', '/').split('/').map(Number);
  const daySum = Math.floor(day / 10) + (day % 10);
  const monthSum = Math.floor(month / 10) + (month % 10);
  const yearSum = year.toString().split('').reduce((acc, digit) => acc + Number(digit), 0);
  let sum = daySum + monthSum + yearSum;
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + Number(digit), 0);
  }
  return sum;
};

// Hàm tính số linh hồn (dựa trên nguyên âm trong tên)
const calculateSoulNumber = (name) => {
  if (!name) return null;
  const vowels = ['a', 'e', 'i', 'o', 'u', 'ă', 'â', 'ê', 'ô', 'ơ', 'ư'];
  const vowelSum = name.toLowerCase().split('')
    .filter(char => vowels.includes(char))
    .map(char => {
      const values = { 'a': 1, 'ă': 1, 'â': 1, 'e': 5, 'ê': 5, 'i': 9, 'o': 6, 'ô': 6, 'ơ': 6, 'u': 3, 'ư': 3 };
      return values[char] || 0;
    })
    .reduce((acc, val) => acc + val, 0);
  let sum = vowelSum;
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + Number(digit), 0);
  }
  return sum;
};

// Hàm tính số định mệnh (dựa trên toàn bộ tên)
const calculateDestinyNumber = (name) => {
  if (!name) return null;
  const letterValues = {
    'a': 1, 'ă': 1, 'â': 1, 'b': 2, 'c': 3, 'd': 4, 'đ': 4, 'e': 5, 'ê': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'ô': 6, 'ơ': 6, 'p': 7, 'q': 8, 'r': 9, 's': 1, 't': 2,
    'u': 3, 'ư': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
  };
  const nameSum = name.toLowerCase().split('')
    .map(char => letterValues[char] || 0)
    .reduce((acc, val) => acc + val, 0);
  let sum = nameSum;
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + Number(digit), 0);
  }
  return sum;
};

// Validate form
const validateForm = () => {
  errors.value = {
    name: '',
    birthdate: '',
    general: '',
  };
  let isValid = true;

  if (!formData.value.name.trim()) {
    errors.value.name = 'Vui lòng nhập họ và tên';
    isValid = false;
  }
  if (!formData.value.birthdate.trim()) {
    errors.value.birthdate = 'Vui lòng nhập ngày sinh';
    isValid = false;
  } else if (!/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(formData.value.birthdate)) {
    errors.value.birthdate = 'Vui lòng nhập ngày đúng định dạng DD/MM/YYYY hoặc DD-MM-YYYY';
    isValid = false;
  } else {
    const match = formData.value.birthdate.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    const date = new Date(year, month - 1, day);
    if (
      date.getDate() !== day ||
      date.getMonth() + 1 !== month ||
      date.getFullYear() !== year ||
      year < 1900 ||
      year > new Date().getFullYear()
    ) {
      errors.value.birthdate = 'Ngày sinh không hợp lệ';
      isValid = false;
    }
  }

  return isValid;
};

// Hàm lấy định hướng nghề nghiệp (giả lập)
const getCareerGuidance = async () => {
  if (!process.client) {
    console.warn('getCareerGuidance called on server-side, ignoring.');
    return;
  }
  if (!validateForm()) {
    toast.error('Vui lòng kiểm tra lại thông tin nhập', { position: 'top-center' });
    return;
  }

  loading.value = true;
  errors.value.general = '';
  try {
    const lifePath = calculateLifePath(formData.value.birthdate);
    const soulNumber = calculateSoulNumber(formData.value.name);
    const destinyNumber = calculateDestinyNumber(formData.value.name);
    if (!lifePath || !soulNumber || !destinyNumber) {
      throw new Error('Không thể tính toán các con số thần số học từ thông tin nhập.');
    }

    // Dữ liệu nghề nghiệp giả lập dựa trên số đường đời
    const careerMap = {
      1: {
        jobs: [
          { job: 'Doanh nhân', reason: 'Số 1 thể hiện sự lãnh đạo và độc lập', opportunities: 'Khởi nghiệp, quản lý', trends: 'Xu hướng khởi nghiệp công nghệ' },
          { job: 'Quản lý dự án', reason: 'Khả năng tổ chức và ra quyết định', opportunities: 'Công nghệ, xây dựng', trends: 'Quản lý dự án số hóa' },
          { job: 'Nhà sáng tạo nội dung', reason: 'Sáng tạo và độc đáo', opportunities: 'Truyền thông, quảng cáo', trends: 'Nội dung số phát triển mạnh' },
        ],
        careerGoals: 'Bạn hướng đến việc dẫn đầu và tạo dấu ấn cá nhân trong công việc.',
        passionAndMotivation: 'Đam mê sáng tạo và thúc đẩy sự đổi mới.',
        workStyle: 'Tự chủ, quyết đoán, thích làm việc độc lập.',
        longTermPath: 'Phấn đấu trở thành lãnh đạo hoặc chuyên gia trong lĩnh vực bạn chọn.',
        currentJobAnalysis: formData.value.currentJob ? `Công việc hiện tại (${formData.value.currentJob}) phù hợp với khả năng lãnh đạo của bạn.` : '',
        practicalAdvice: 'Hãy phát triển kỹ năng lãnh đạo và tìm kiếm cơ hội khởi nghiệp.',
      },
      2: {
        jobs: [
          { job: 'Nhà ngoại giao', reason: 'Số 2 giỏi hòa giải và hợp tác', opportunities: 'Quan hệ quốc tế, nhân sự', trends: 'Hợp tác quốc tế tăng' },
          { job: 'Nhân viên xã hội', reason: 'Nhạy cảm và quan tâm đến cộng đồng', opportunities: 'NGO, dịch vụ công', trends: 'Phát triển cộng đồng bền vững' },
          { job: 'Chuyên viên tư vấn', reason: 'Khả năng lắng nghe và hỗ trợ', opportunities: 'Tâm lý, giáo dục', trends: 'Tư vấn trực tuyến phát triển' },
        ],
        careerGoals: 'Bạn tìm kiếm sự hài hòa và hợp tác trong công việc.',
        passionAndMotivation: 'Đam mê giúp đỡ người khác và xây dựng mối quan hệ.',
        workStyle: 'Hợp tác, kiên nhẫn, giỏi làm việc nhóm.',
        longTermPath: 'Phấn đấu xây dựng môi trường làm việc hòa hợp và hỗ trợ cộng đồng.',
        currentJobAnalysis: formData.value.currentJob ? `Công việc hiện tại (${formData.value.currentJob}) phù hợp với khả năng hợp tác của bạn.` : '',
        practicalAdvice: 'Tập trung vào kỹ năng giao tiếp và xây dựng mạng lưới quan hệ.',
      },
      // Thêm các số khác tương tự nếu cần
    };

    result.value = {
      careerGoals: careerMap[lifePath]?.careerGoals || 'Tìm kiếm sự phát triển cá nhân và chuyên môn.',
      passionAndMotivation: careerMap[lifePath]?.passionAndMotivation || 'Đam mê học hỏi và phát triển.',
      workStyle: careerMap[lifePath]?.workStyle || 'Linh hoạt, thích nghi tốt với môi trường làm việc.',
      longTermPath: careerMap[lifePath]?.longTermPath || 'Xây dựng sự nghiệp ổn định và lâu dài.',
      currentJobAnalysis: careerMap[lifePath]?.currentJobAnalysis || '',
      careerSuggestions: careerMap[lifePath]?.jobs || [],
      practicalAdvice: careerMap[lifePath]?.practicalAdvice || 'Tiếp tục học hỏi và phát triển kỹ năng mềm.',
    };

    toast.success('Định hướng nghề nghiệp đã hoàn tất!', { position: 'top-center' });
    setTimeout(() => {
      const resultElement = document.querySelector('[v-if="result"]');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  } catch (error) {
    console.error('Error in getCareerGuidance:', error);
    errors.value.general = error.message || 'Có lỗi xảy ra khi lấy định hướng nghề nghiệp!';
    toast.error(errors.value.general, { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};

// Hàm tải thêm nghề nghiệp (giả lập)
const loadMoreCareers = async () => {
  if (!process.client) {
    console.warn('loadMoreCareers called on server-side, ignoring.');
    return;
  }
  if (!result.value) return;
  if (result.value.careerSuggestions.length >= maxSuggestions.value) {
    errors.value.general = 'Đã đạt số lượng gợi ý tối đa!';
    toast.error(errors.value.general, { position: 'top-center' });
    return;
  }

  loadingMore.value = true;
  try {
    const lifePath = calculateLifePath(formData.value.birthdate);
    const additionalJobs = {
      1: [
        { job: 'Nhà thiết kế sản phẩm', reason: 'Sáng tạo và đổi mới', opportunities: 'Công nghệ, thiết kế', trends: 'Thiết kế trải nghiệm người dùng' },
      ],
      2: [
        { job: 'Giáo viên', reason: 'Khả năng truyền đạt và hỗ trợ', opportunities: 'Giáo dục, đào tạo', trends: 'Giáo dục trực tuyến phát triển' },
      ],
    };

    const newJob = additionalJobs[lifePath]?.[0];
    if (newJob) {
      result.value.careerSuggestions.push(newJob);
      toast.success('Đã tải thêm nghề nghiệp phù hợp!', { position: 'top-center' });
    } else {
      throw new Error('Không tìm thấy nghề nghiệp phù hợp để thêm.');
    }
  } catch (error) {
    console.error('Error in loadMoreCareers:', error);
    errors.value.general = error.message || 'Có lỗi khi tải thêm nghề nghiệp!';
    toast.error(errors.value.general, { position: 'top-center' });
  } finally {
    loadingMore.value = false;
  }
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.action-button {
  @apply px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap mx-2;
}
</style>
