<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header với gradient -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-white bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">Thần số học trọn đời</h2>
          <p class="text-teal-100 mt-1">Khám phá con số định mệnh và các giai đoạn cuộc đời bạn</p>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Form nhập liệu -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="name" class="form-label">Họ và tên</label>
          <input v-model="formData.name" type="text" id="name" placeholder="Nguyễn Văn A" class="form-input" />
        </div>
        <div>
          <label for="birthdate" class="form-label">Ngày sinh (dd/mm/yyyy)</label>
          <div class="relative">
            <input v-model="formData.birthdate" type="text" id="birthdate" placeholder="15/03/1995" class="form-input pl-10" />
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Giới tính</label>
        <div class="flex space-x-6">
          <label class="radio-option">
            <input type="radio" v-model="formData.gender" value="male" class="radio-input" />
            <span class="radio-label">Nam</span>
          </label>
          <label class="radio-option">
            <input type="radio" v-model="formData.gender" value="female" class="radio-input" />
            <span class="radio-label">Nữ</span>
          </label>
        </div>
      </div>

      <button @click="generateReport" :disabled="loading" class="w-full btn-primary">
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang phân tích...
        </span>
        <span v-else>Xem báo cáo Thần số học</span>
      </button>

      <!-- Tabs và nội dung -->
      <transition name="fade-slide">
        <div v-if="numerologyData" class="mt-6">
          <!-- Tabs -->
          <div class="flex overflow-x-auto border-b border-gray-200">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="activeTab = tab.value"
              :class="[
                'px-5 py-3 font-medium whitespace-nowrap transition-colors duration-200',
                activeTab === tab.value ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500 hover:text-teal-500'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Nội dung tab -->
          <div class="mt-6 space-y-6">
            <!-- Tab Thông tin cá nhân -->
            <div v-if="activeTab === 'personalInfo'" class="bg-teal-50 p-6 rounded-xl border border-teal-100">
              <h3 class="text-xl font-bold text-teal-800 mb-4">Thông tin cá nhân</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Họ và tên</p>
                  <p class="font-medium">{{ formData.name }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Ngày sinh</p>
                  <p class="font-medium">{{ formData.birthdate }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Giới tính</p>
                  <p class="font-medium">{{ formData.gender === 'male' ? 'Nam' : 'Nữ' }}</p>
                </div>
              </div>
            </div>

            <!-- Tab Tổng quan -->
            <div v-if="activeTab === 'overview'" class="space-y-6">
              <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div class="flex items-center mb-4">
                  <span class="w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold mr-3">{{ numerologyData.lifePath.number }}</span>
                  <h3 class="text-xl font-bold text-teal-800">Số chủ đạo - {{ numerologyData.lifePath.number }} {{ numerologyData.lifePath.symbol }}</h3>
                </div>
                <div class="prose prose-teal max-w-none">
                  <p class="text-gray-700">{{ numerologyData.lifePath.description }}</p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p class="font-medium text-teal-700">Điểm mạnh:</p>
                      <ul class="list-disc pl-5 text-gray-700">
                        <li v-for="strength in numerologyData.lifePath.strengths" :key="strength">{{ strength }}</li>
                      </ul>
                    </div>
                    <div>
                      <p class="font-medium text-teal-700">Thử thách:</p>
                      <ul class="list-disc pl-5 text-gray-700">
                        <li v-for="challenge in numerologyData.lifePath.challenges" :key="challenge">{{ challenge }}</li>
                      </ul>
                    </div>
                  </div>
                  <div class="mt-4">
                    <p class="font-medium text-teal-700">Nghề nghiệp phù hợp:</p>
                    <ul class="list-disc pl-5 text-gray-700">
                      <li v-for="career in numerologyData.lifePath.careers" :key="career">{{ career }}</li>
                    </ul>
                  </div>
                  <div class="mt-4 p-4 bg-teal-50 rounded-lg">
                    <p class="font-medium text-teal-700">Lời khuyên:</p>
                    <ul class="list-disc pl-5 text-gray-700">
                      <li v-for="advice in numerologyData.lifePath.advice" :key="advice">{{ advice }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tab Các con số chính -->
            <div v-if="activeTab === 'mainNumbers'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div class="flex items-center mb-2">
                  <span class="text-3xl font-bold text-teal-600 mr-3">{{ numerologyData.soul }}</span>
                  <div>
                    <h4 class="font-semibold text-gray-800">Số linh hồn</h4>
                    <p class="text-sm text-gray-500">Con số mong muốn nội tâm</p>
                  </div>
                </div>
                <p class="text-gray-700">{{ numerologyData.soulDesc }}</p>
              </div>
              <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div class="flex items-center mb-2">
                  <span class="text-3xl font-bold text-teal-600 mr-3">{{ numerologyData.personality }}</span>
                  <div>
                    <h4 class="font-semibold text-gray-800">Số nhân cách</h4>
                    <p class="text-sm text-gray-500">Ấn tượng bạn tạo ra</p>
                  </div>
                </div>
                <p class="text-gray-700">{{ numerologyData.personalityDesc }}</p>
              </div>
              <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div class="flex items-center mb-2">
                  <span class="text-3xl font-bold text-teal-600 mr-3">{{ numerologyData.destiny }}</span>
                  <div>
                    <h4 class="font-semibold text-gray-800">Số định mệnh</h4>
                    <p class="text-sm text-gray-500">Sứ mệnh cuộc đời</p>
                  </div>
                </div>
                <p class="text-gray-700">{{ numerologyData.destinyDesc }}</p>
              </div>
            </div>

            <!-- Tab Chu kỳ đường đời -->
            <div v-if="activeTab === 'lifeCycles'" class="space-y-6">
              <div v-for="period in lifePeriods" :key="period.age" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div class="flex items-center mb-4">
                  <span class="w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold mr-3">{{ period.age }}</span>
                  <h4 class="text-lg font-semibold text-gray-800">{{ period.title }}</h4>
                </div>
                <div class="prose prose-teal max-w-none">
                  <p class="text-gray-700">{{ period.content }}</p>
                  <div class="mt-4 p-4 bg-teal-50 rounded-lg">
                    <p class="font-medium text-teal-700">Lời khuyên:</p>
                    {{ period.advice }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Tab Chu kỳ vận số -->
            <div v-if="activeTab === 'personalYears'" class="space-y-6">
              <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 class="text-xl font-bold text-teal-800 mb-4">Biểu đồ chu kỳ vận số</h3>
                <ClientOnly>
                  <canvas ref="cycleChart"></canvas>
                </ClientOnly>
              </div>
              <div v-for="(yearData, year) in numerologyData.cycles" :key="year" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div class="flex items-center mb-4">
                  <span class="w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold mr-3">{{ yearData.number }}</span>
                  <h4 class="text-lg font-semibold text-gray-800">Năm {{ year }}</h4>
                </div>
                <div class="prose prose-teal max-w-none">
                  <p class="text-gray-700">{{ yearData.description }}</p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p class="font-medium text-teal-700">Tập trung:</p>
                      <ul class="list-disc pl-5 text-gray-700">
                        <li v-for="focus in yearData.focus" :key="focus">{{ focus }}</li>
                      </ul>
                    </div>
                    <div>
                      <p class="font-medium text-teal-700">Từ khóa:</p>
                      <ul class="list-disc pl-5 text-gray-700">
                        <li v-for="keyword in yearData.keywords" :key="keyword">{{ keyword }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Nút tải và chia sẻ -->
          <div class="flex flex-wrap gap-3 justify-center mt-8">
            <ClientOnly>
              <button @click="downloadPDF" class="btn-share bg-teal-600 hover:bg-teal-700">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                </svg>
                Tải báo cáo PDF
              </button>
            </ClientOnly>
            <button @click="shareResult('zalo')" class="btn-share bg-blue-500 hover:bg-blue-600">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z" />
              </svg>
              Chia sẻ Zalo
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { toast } from 'vue3-toastify';
import Chart from 'chart.js/auto';

// Chỉ import jspdf ở client-side
const jspdf = process.client ? await import('jspdf').then(module => module.jsPDF) : null;

const formData = ref({
  name: '',
  birthdate: '',
  gender: 'male'
});
const numerologyData = ref(null);
const loading = ref(false);
const activeTab = ref('personalInfo');
const cycleChart = ref(null);
let chartInstance = null;

// Danh sách tabs
const tabs = [
  { label: 'Thông tin cá nhân', value: 'personalInfo' },
  { label: 'Tổng quan', value: 'overview' },
  { label: 'Các con số chính', value: 'mainNumbers' },
  { label: 'Chu kỳ đường đời', value: 'lifeCycles' },
  { label: 'Chu kỳ vận số', value: 'personalYears' }
];

// Dữ liệu chu kỳ đường đời
const lifePeriods = computed(() => {
  if (!numerologyData.value) return [];
  return [
    { age: '0-10', title: '0-10 tuổi', content: numerologyData.value.age0_10, advice: numerologyData.value.age0_10Advice },
    { age: '10-20', title: '10-20 tuổi', content: numerologyData.value.age10_20, advice: numerologyData.value.age10_20Advice },
    { age: '20-30', title: '20-30 tuổi', content: numerologyData.value.age20_30, advice: numerologyData.value.age20_30Advice },
    { age: '30-40', title: '30-40 tuổi', content: numerologyData.value.age30_40, advice: numerologyData.value.age30_40Advice },
    { age: '40-50', title: '40-50 tuổi', content: numerologyData.value.age40_50, advice: numerologyData.value.age40_50Advice },
    { age: '50-60', title: '50-60 tuổi', content: numerologyData.value.age50_60, advice: numerologyData.value.age50_60Advice },
    { age: '60+', title: '60+ tuổi', content: numerologyData.value.age60_plus, advice: numerologyData.value.age60_plusAdvice }
  ];
});

// Tạo biểu đồ chu kỳ vận số
const createCycleChart = () => {
  if (!process.client || !numerologyData.value || !cycleChart.value || !numerologyData.value.cycles) return;

  if (chartInstance) chartInstance.destroy();

  const years = Object.keys(numerologyData.value.cycles);
  const numbers = years.map(year => numerologyData.value.cycles[year].number);

  chartInstance = new Chart(cycleChart.value, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Số cá nhân',
          data: numbers,
          borderColor: '#14B8A6',
          backgroundColor: 'rgba(20, 184, 166, 0.2)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#14B8A6',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#14B8A6'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `Số ${context.raw}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 11,
          title: { display: true, text: 'Số cá nhân' }
        },
        x: {
          title: { display: true, text: 'Năm' }
        }
      }
    }
  });
};

// Theo dõi khi tab hoặc dữ liệu thay đổi để vẽ biểu đồ
watch([activeTab, numerologyData], () => {
  if (activeTab.value === 'personalYears' && numerologyData.value && numerologyData.value.cycles) {
    setTimeout(() => createCycleChart(), 100); // Đợi DOM render
  }
});

const generateReport = async () => {
  if (!formData.value.name) {
    toast.error('Vui lòng nhập họ và tên!');
    return;
  }
  if (!formData.value.birthdate) {
    toast.error('Vui lòng nhập ngày sinh!');
    return;
  }
  if (!formData.value.gender) {
    toast.error('Vui lòng chọn giới tính!');
    return;
  }

  loading.value = true;
  try {
    // Gọi từng API riêng biệt
    const [overviewResponse, coreNumbersResponse, lifeCyclesResponse, personalYearCyclesResponse] = await Promise.all([
      $fetch('/api/numerology/overview', {
        method: 'POST',
        body: { name: formData.value.name, birthdate: formData.value.birthdate, gender: formData.value.gender }
      }),
      $fetch('/api/numerology/core-numbers', {
        method: 'POST',
        body: { name: formData.value.name, birthdate: formData.value.birthdate }
      }),
      $fetch('/api/numerology/life-cycles', {
        method: 'POST',
        body: { name: formData.value.name, birthdate: formData.value.birthdate }
      }),
      $fetch('/api/numerology/personal-year-cycles', {
        method: 'POST',
        body: { birthdate: formData.value.birthdate }
      })
    ]);

    // Hợp nhất dữ liệu từ các API
    numerologyData.value = {
      ...overviewResponse.overview, // Thông tin tổng quan
      ...coreNumbersResponse.numerology, // Các con số chính
      ...lifeCyclesResponse.numerology, // Chu kỳ đường đời
      cycles: personalYearCyclesResponse.numerology.cycles // Chu kỳ vận số
    };

    toast.success('Tạo báo cáo Thần số học hoàn tất!');
    activeTab.value = 'personalInfo';
  } catch (error) {
    console.error('Error fetching numerology data:', error);
    toast.error('Không thể tạo báo cáo từ API, sử dụng dữ liệu mẫu!');
    // Dữ liệu mẫu khi API lỗi
    numerologyData.value = {
      name: formData.value.name,
      birthdate: formData.value.birthdate,
      gender: formData.value.gender,
      description: `Với tên "${formData.value.name}", sinh ngày ${formData.value.birthdate}, bạn là một cá nhân mang năng lượng đặc biệt, định hình qua giới tính ${formData.value.gender}. Hành trình cuộc đời bạn là sự kết hợp giữa khám phá bản thân và hoàn thiện ước mơ.`,
      lifePath: {
        number: 9,
        symbol: "♾",
        description: "Số 9 trong thần số học tượng trưng cho sự hoàn thiện, nhân đạo và vị tha. Những người có số chủ đạo 9 thường có trái tim nhân hậu, luôn quan tâm đến người khác và sẵn sàng giúp đỡ những người yếu thế. Họ có trực giác mạnh mẽ và khả năng thấu hiểu sâu sắc. Họ là những người có tầm nhìn xa trông rộng, luôn hướng tới mục tiêu cao cả. Tuy nhiên, họ cũng dễ bị cuốn vào cảm xúc và đôi khi quên chăm sóc bản thân. Sự vị tha quá mức có thể dẫn đến kiệt sức và mệt mỏi. Họ cần học cách đặt ranh giới và cân bằng giữa việc giúp đỡ người khác và chăm sóc bản thân. Họ có khả năng lãnh đạo xuất sắc và thường đạt được thành công đáng kể trong cuộc sống.",
        strengths: ["Nhân hậu", "Vị tha", "Trực giác mạnh mẽ", "Lãnh đạo", "Tầm nhìn xa trông rộng"],
        challenges: ["Dễ bị cuốn vào cảm xúc", "Quên chăm sóc bản thân", "Đặt ranh giới", "Kiệt sức", "Cân bằng giữa giúp đỡ người khác và bản thân"],
        careers: ["Nhà hoạt động xã hội", "Giáo viên", "Nhà văn", "Nhà trị liệu", "Nhân viên cứu hộ"],
        advice: ["Hãy nhớ chăm sóc bản thân", "Đặt ra ranh giới rõ ràng", "Hãy cân bằng giữa giúp đỡ người khác và nhu cầu cá nhân", "Tin tưởng vào trực giác của bạn", "Đừng quên nghỉ ngơi và thư giãn"]
      },
      soul: 1,
      soulDesc: "Số linh hồn 1 đại diện cho sự độc lập, sáng tạo và lãnh đạo. Bạn là người tiên phong, luôn tìm kiếm những trải nghiệm mới và muốn tạo ra sự khác biệt.",
      personality: 9,
      personalityDesc: "Số nhân cách 9 thể hiện sự vị tha, nhân đạo và lòng trắc ẩn. Bạn hướng ngoại, dễ gần và luôn quan tâm đến người khác.",
      destiny: 4,
      destinyDesc: "Số định mệnh 4 cho thấy bạn là người thực tế, chăm chỉ và có trách nhiệm. Bạn xây dựng cuộc sống bằng sự kiên trì và nỗ lực không ngừng.",
      age0_10: "Với số linh hồn 1, những năm tuổi thơ của bạn có thể được đánh dấu bằng sự độc lập sớm. Bạn có thể là một đứa trẻ tò mò, ham học hỏi và thích khám phá thế giới xung quanh. Bạn thể hiện sự quyết đoán và có ý chí mạnh mẽ ngay từ nhỏ.",
      age10_20: "Bước vào tuổi thiếu niên, số linh hồn 1 kết hợp với số chủ đạo 9 sẽ tạo nên một giai đoạn đầy thử thách và cơ hội. Bạn sẽ khám phá bản thân nhiều hơn, khát khao thể hiện cá tính và tìm kiếm ý nghĩa cuộc sống.",
      age20_30: "Giai đoạn này, sự kết hợp của số linh hồn 1, số chủ đạo 9 và số nhân cách 9 sẽ tạo nên một cá nhân mạnh mẽ, độc lập và giàu lòng trắc ẩn. Bạn có thể theo đuổi những mục tiêu đầy tham vọng và sẵn sàng cống hiến cho cộng đồng.",
      age30_40: "Số nhân cách 9 và số định mệnh 4 sẽ định hình giai đoạn này. Bạn sẽ tập trung vào việc xây dựng sự nghiệp vững chắc và ổn định.",
      age40_50: "Sự kết hợp giữa số nhân cách 9 và số định mệnh 4 tiếp tục tạo nên sự ổn định và thành công trong giai đoạn này. Bạn sẽ đạt được những thành tựu đáng kể trong sự nghiệp.",
      age50_60: "Ở giai đoạn này, sự kết hợp của số nhân cách 9, số định mệnh 4 và số chủ đạo 9 sẽ mang lại sự cân bằng và hài hòa trong cuộc sống.",
      age60_plus: "Kết hợp tất cả các con số, giai đoạn này là thời gian để bạn nhìn lại chặng đường đã qua và tận hưởng thành quả của cuộc đời.",
      age0_10Advice: ["Khuyến khích sự tò mò và ham học hỏi", "Hỗ trợ bé phát triển sự tự lập"],
      age10_20Advice: ["Khuyến khích sự sáng tạo và độc lập", "Hỗ trợ bé tìm kiếm đam mê và mục tiêu"],
      age20_30Advice: ["Đừng quên chăm sóc bản thân", "Đặt ra ranh giới rõ ràng"],
      age30_40Advice: ["Tập trung vào việc xây dựng sự nghiệp vững chắc", "Đừng quên dành thời gian cho gia đình"],
      age40_50Advice: ["Tiếp tục đóng góp cho xã hội", "Dành thời gian chăm sóc sức khỏe"],
      age50_60Advice: ["Tận hưởng cuộc sống và những mối quan hệ thân thiết", "Chia sẻ kinh nghiệm với thế hệ trẻ"],
      age60_plusAdvice: ["Tận hưởng cuộc sống an nhàn", "Chia sẻ kinh nghiệm với mọi người"],
      cycles: {
        "2024": {
          number: 4,
          description: "Năm 2024 là một năm tập trung vào sự ổn định và xây dựng nền tảng vững chắc.",
          focus: ["Sự nghiệp", "Gia đình", "Củng cố nền tảng"],
          keywords: ["Ổn định", "Kiên trì", "Cấu trúc", "Hợp tác", "Thành tựu"]
        },
        "2025": {
          number: 5,
          description: "Năm 2025 là năm của sự thay đổi và phiêu lưu.",
          focus: ["Du lịch", "Mở rộng tầm nhìn", "Khám phá bản thân"],
          keywords: ["Thay đổi", "Linh hoạt", "Phiêu lưu", "Tự do", "Khám phá"]
        },
        "2026": {
          number: 6,
          description: "Năm 2026 là năm của gia đình và tình yêu.",
          focus: ["Gia đình", "Tình yêu", "Hài hòa"],
          keywords: ["Hạnh phúc", "Yêu thương", "Hài hòa", "Cân bằng", "Kết nối"]
        }
      }
    };
    activeTab.value = 'personalInfo';
  } finally {
    loading.value = false;
  }
};

const downloadPDF = () => {
  if (!process.client || !jspdf || !numerologyData.value) {
    toast.error('Không thể tải PDF trên server-side hoặc chưa có dữ liệu!');
    return;
  }
  const doc = new jspdf();
  doc.setFont('times');
  doc.setFontSize(12);
  let y = 10;

  // Tiêu đề
  doc.setFontSize(16);
  doc.text('Thần số học trọn đời', 10, y);
  y += 10;

  // Thông tin cá nhân
  doc.setFontSize(12);
  doc.text('Thông tin cá nhân:', 10, y);
  y += 7;
  doc.text(`Họ và tên: ${formData.value.name}`, 10, y);
  y += 7;
  doc.text(`Ngày sinh: ${formData.value.birthdate}`, 10, y);
  y += 7;
  doc.text(`Giới tính: ${formData.value.gender === 'male' ? 'Nam' : 'Nữ'}`, 10, y);
  y += 10;

  // Tổng quan
  doc.text('Tổng quan:', 10, y);
  y += 7;
  doc.text(`Số chủ đạo: ${numerologyData.value.lifePath.number} ${numerologyData.value.lifePath.symbol}`, 10, y);
  y += 7;
  const lifePathDesc = doc.splitTextToSize(numerologyData.value.lifePath.description, 180);
  doc.text(lifePathDesc, 10, y);
  y += lifePathDesc.length * 7 + 5;
  doc.text('Điểm mạnh: ' + numerologyData.value.lifePath.strengths.join(', '), 10, y);
  y += 7;
  doc.text('Thử thách: ' + numerologyData.value.lifePath.challenges.join(', '), 10, y);
  y += 7;
  doc.text('Nghề nghiệp: ' + numerologyData.value.lifePath.careers.join(', '), 10, y);
  y += 7;
  const adviceLines = doc.splitTextToSize('Lời khuyên: ' + numerologyData.value.lifePath.advice.join('; '), 180);
  doc.text(adviceLines, 10, y);
  y += adviceLines.length * 7 + 10;

  // Các con số chính
  doc.text('Các con số chính:', 10, y);
  y += 7;
  doc.text(`Số linh hồn: ${numerologyData.value.soul} - ${numerologyData.value.soulDesc}`, 10, y);
  y += 7;
  doc.text(`Số nhân cách: ${numerologyData.value.personality} - ${numerologyData.value.personalityDesc}`, 10, y);
  y += 7;
  doc.text(`Số định mệnh: ${numerologyData.value.destiny} - ${numerologyData.value.destinyDesc}`, 10, y);
  y += 10;

  // Chu kỳ đường đời
  const addSection = (title, content, advice) => {
    if (y > 260) {
      doc.addPage();
      y = 10;
    }
    doc.setFontSize(14);
    doc.text(title, 10, y);
    y += 7;
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 10, y);
    y += lines.length * 7 + 5;
    const adviceLines = doc.splitTextToSize('Lời khuyên: ' + advice.join('; '), 180);
    doc.text(adviceLines, 10, y);
    y += adviceLines.length * 7 + 10;
  };

  lifePeriods.value.forEach(period => {
    addSection(period.title, period.content, period.advice);
  });

  // Chu kỳ vận số
  doc.setFontSize(14);
  doc.text('Chu kỳ vận số:', 10, y);
  y += 10;
  doc.setFontSize(12);
  Object.entries(numerologyData.value.cycles).forEach(([year, data]) => {
    if (y > 260) {
      doc.addPage();
      y = 10;
    }
    doc.text(`Năm ${year} - Số ${data.number}`, 10, y);
    y += 7;
    const descLines = doc.splitTextToSize(data.description, 180);
    doc.text(descLines, 10, y);
    y += descLines.length * 7 + 5;
    doc.text('Tập trung: ' + data.focus.join(', '), 10, y);
    y += 7;
    doc.text('Từ khóa: ' + data.keywords.join(', '), 10, y);
    y += 10;
  });

  doc.save('numerology_full.pdf');
};

const shareResult = (platform) => {
  toast.info(`Chia sẻ qua ${platform} đang được phát triển!`);
};
</script>

<style scoped>
.form-label {
  @apply block text-gray-700 font-medium mb-2;
}
.form-input {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors;
}
.form-group {
  @apply space-y-2;
}
.radio-option {
  @apply flex items-center;
}
.radio-input {
  @apply mr-2;
}
.radio-label {
  @apply text-gray-700;
}
.btn-primary {
  @apply bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed;
}
.btn-share {
  @apply text-white py-2 px-4 rounded-lg font-medium flex items-center transition-colors;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>