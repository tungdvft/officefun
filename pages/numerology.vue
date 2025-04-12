<template>
  <div v-if="!isPageLoading" class="py-10 relative">
    <div
      class="absolute inset-0 -z-10 bg-cover bg-center"
      style="background-image: url('/background-home.jpeg')"
    >
      <div class="absolute inset-0 bg-black/40"></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div>
        <!-- Vận mệnh hôm nay (Thần số học) -->
        <div v-if="dailyData.dailyNumerology" class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
          <h2 class="text-xl font-semibold text-indigo-700 mb-3 flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m-3-3v6m-6 6h12m-3-3v6" />
            </svg>
            Vận mệnh hôm nay (Thần số học)
          </h2>
          <p class="text-gray-600 leading-relaxed">{{ dailyData.dailyNumerology }}</p>
        </div>

        <!-- Phần Thần số học nâng cao -->
        <div class="mb-8 bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-purple-700 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m-3-3v6m-6 6h12m-3-3v6" />
            </svg>
            Thần số học nâng cao
          </h2>

          <!-- Diễn giải các con số -->
          <div v-if="advancedData.numbers" class="mb-6">
            <h3 class="text-lg font-semibold text-purple-600 mb-3">Diễn giải các con số của bạn</h3>
            <div class="space-y-4">
              <p><strong>Số đường đời:</strong> {{ advancedData.numbers.lifePath }} - {{ advancedData.numbers.lifePathDescription }}</p>
              <p><strong>Số linh hồn:</strong> {{ advancedData.numbers.soulUrge }} - {{ advancedData.numbers.soulUrgeDescription }}</p>
              <p><strong>Số nhân cách:</strong> {{ advancedData.numbers.personality }} - {{ advancedData.numbers.personalityDescription }}</p>
              <p><strong>Số định mệnh:</strong> {{ advancedData.numbers.destiny }} - {{ advancedData.numbers.destinyDescription }}</p>
            </div>
          </div>

          <!-- Người nổi tiếng cùng số đường đời -->
          <div v-if="advancedData.celebrities && advancedData.celebrities.length" class="mb-6">
            <h3 class="text-lg font-semibold text-purple-600 mb-3">Người nổi tiếng cùng số đường đời</h3>
            <ul class="list-disc pl-5 text-gray-700">
              <li v-for="celeb in advancedData.celebrities" :key="celeb">{{ celeb }}</li>
            </ul>
          </div>

          <!-- Form nhập thông tin và lời khuyên -->
          <div class="space-y-6">
            <p class="text-gray-600 mb-4">Hãy nhập câu hỏi của bạn để nhận lời khuyên chi tiết:</p>
            <div>
              <label for="name" class="block text-gray-700 font-medium mb-2">Họ và tên</label>
              <input
                v-model="formData.name"
                type="text"
                id="name"
                placeholder="Nhập họ và tên của bạn"
                class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label for="intention" class="block text-gray-700 font-medium mb-2">Ý định hoặc câu hỏi của bạn</label>
              <textarea
                v-model="formData.intention"
                id="intention"
                placeholder="Ví dụ: Tôi có nên chuyển việc năm nay không?"
                rows="3"
                class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              ></textarea>
            </div>
            <button
              @click="submitForm"
              :disabled="loadingAdvice"
              class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
            >
              {{ loadingAdvice ? 'Đang xử lý...' : 'Xem lời khuyên' }}
            </button>

            <!-- Hiển thị lời khuyên ngay dưới form -->
            <div v-if="advice" class="mt-4 p-6 bg-purple-50 rounded-lg">
              <p class="text-purple-900 font-semibold text-lg mb-2">Câu trả lời cho câu hỏi của bạn</p>
              <p class="text-gray-700 whitespace-pre-line">{{ advice }}</p>
            </div>
          </div>

          <!-- Tabs cho phân tích mối quan hệ -->
          <h3 class="text-lg font-semibold text-purple-600 mt-5">Bói mức độ hợp nhau</h3>
          <div class="mt-8">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8">
                <button
                  v-for="tab in tabs"
                  :key="tab.name"
                  @click="activeTab = tab.name"
                  :class="[
                    activeTab === tab.name
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                  ]"
                >
                  {{ tab.label }}
                </button>
              </nav>
            </div>
            <div class="mt-6">
              <!-- Tab Người yêu -->
              <div v-if="activeTab === 'lover'" class="space-y-6">
                <div>
                  <label for="loverName" class="block text-gray-700 font-medium mb-2">Họ và tên người yêu</label>
                  <input
                    v-model="relationshipData.loverName"
                    type="text"
                    id="loverName"
                    placeholder="Nhập họ và tên người yêu"
                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label for="loverBirthdate" class="block text-gray-700 font-medium mb-2">Ngày sinh người yêu (dd/mm/yyyy)</label>
                  <input
                    v-model="relationshipData.loverBirthdate"
                    type="text"
                    id="loverBirthdate"
                    placeholder="Ví dụ: 15/08/1995"
                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  @click="analyzeRelationship('lover')"
                  :disabled="loadingRelationship"
                  class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
                >
                  {{ loadingRelationship ? 'Đang phân tích...' : 'Phân tích mức độ hợp nhau' }}
                </button>
                <div v-if="relationshipData.loverResult" class="mt-4 p-6 bg-purple-50 rounded-lg">
                  <p class="text-purple-900 font-semibold text-lg mb-2">Kết quả phân tích với người yêu</p>
                  <p class="text-gray-700 whitespace-pre-line">{{ getDescription('lover') }}</p>
                  <p class="text-purple-700 font-semibold mt-2">Lời khuyên:</p>
                  <p class="text-gray-700 whitespace-pre-line">{{ getAdvice('lover') }}</p>
                </div>
              </div>
              <!-- Tab Bạn bè -->
              <div v-if="activeTab === 'friend'" class="space-y-6">
                <div>
                  <label for="friendName" class="block text-gray-700 font-medium mb-2">Họ và tên bạn bè</label>
                  <input
                    v-model="relationshipData.friendName"
                    type="text"
                    id="friendName"
                    placeholder="Nhập họ và tên bạn bè"
                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label for="friendBirthdate" class="block text-gray-700 font-medium mb-2">Ngày sinh bạn bè (dd/mm/yyyy)</label>
                  <input
                    v-model="relationshipData.friendBirthdate"
                    type="text"
                    id="friendBirthdate"
                    placeholder="Ví dụ: 15/08/1995"
                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  @click="analyzeRelationship('friend')"
                  :disabled="loadingRelationship"
                  class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
                >
                  {{ loadingRelationship ? 'Đang phân tích...' : 'Phân tích mức độ hợp nhau' }}
                </button>
                <div v-if="relationshipData.friendResult" class="mt-4 p-6 bg-purple-50 rounded-lg">
                  <p class="text-purple-900 font-semibold text-lg mb-2">Kết quả phân tích với bạn bè</p>
                  <p class="text-gray-700 whitespace-pre-line">{{ getDescription('friend') }}</p>
                  <p class="text-purple-700 font-semibold mt-2">Lời khuyên:</p>
                  <p class="text-gray-700 whitespace-pre-line">{{ getAdvice('friend') }}</p>
                </div>
              </div>
              <!-- Tab Đối tác -->
              <div v-if="activeTab === 'partner'" class="space-y-6">
                <div>
                  <label for="partnerName" class="block text-gray-700 font-medium mb-2">Họ và tên đối tác</label>
                  <input
                    v-model="relationshipData.partnerName"
                    type="text"
                    id="partnerName"
                    placeholder="Nhập họ và tên đối tác"
                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label for="partnerBirthdate" class="block text-gray-700 font-medium mb-2">Ngày sinh đối tác (dd/mm/yyyy)</label>
                  <input
                    v-model="relationshipData.partnerBirthdate"
                    type="text"
                    id="partnerBirthdate"
                    placeholder="Ví dụ: 15/08/1995"
                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  @click="analyzeRelationship('partner')"
                  :disabled="loadingRelationship"
                  class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
                >
                  {{ loadingRelationship ? 'Đang phân tích...' : 'Phân tích mức độ hợp nhau' }}
                </button>
                <div v-if="relationshipData.partnerResult" class="mt-4 p-6 bg-purple-50 rounded-lg">
                  <p class="text-purple-900 font-semibold text-lg mb-2">Kết quả phân tích với đối tác</p>
                  <p class="text-gray-700 whitespace-pre-line">{{ getDescription('partner') }}</p>
                  <p class="text-purple-700 font-semibold mt-2">Lời khuyên:</p>
                  <p class="text-gray-700 whitespace-pre-line">{{ getAdvice('partner') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="min-h-[50vh] flex items-center justify-center">
    <div class="text-center">
      <svg class="animate-spin h-8 w-8 text-yellow-200 mx-auto mb-4" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <p class="text-gray-200 text-lg">Đang tải dữ liệu...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { toast } from 'vue3-toastify';

const userData = ref({ username: '', birthdate: '', profession: '', displayName: '', id: '', isPremium: false });
const isPremium = ref(false);
const dailyData = ref({});
const advancedData = ref({});
const advice = ref('');
const isPageLoading = ref(true);
const loadingAdvice = ref(false);
const loadingRelationship = ref(false);
const formData = ref({
  name: '',
  intention: ''
});
const tabs = [
  { name: 'lover', label: 'Người yêu' },
  { name: 'friend', label: 'Bạn bè' },
  { name: 'partner', label: 'Đối tác' }
];
const activeTab = ref('lover');
const relationshipData = ref({
  loverName: '',
  loverBirthdate: '',
  loverResult: '',
  friendName: '',
  friendBirthdate: '',
  friendResult: '',
  partnerName: '',
  partnerBirthdate: '',
  partnerResult: ''
});

// Hàm lấy dữ liệu đã lưu từ database
const loadStoredResults = async (username) => {
  try {
    const encodedUsername = encodeURIComponent(username);
    const response = await fetch('/api/numerology/results', {
      method: 'GET',
      headers: {
        'x-username': encodedUsername,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.advice) {
        advice.value = data.advice.answer;
        formData.value.intention = data.advice.intention || '';
      }
      if (data.relationship_lover) relationshipData.value = { ...relationshipData.value, ...data.relationship_lover };
      if (data.relationship_friend) relationshipData.value = { ...relationshipData.value, ...data.relationship_friend };
      if (data.relationship_partner) relationshipData.value = { ...relationshipData.value, ...data.relationship_partner };
    }
  } catch (error) {
    console.error('Error loading stored results:', error);
    toast.warn('Không thể tải dữ liệu đã lưu.', { position: 'top-center' });
  }
};

// Hàm lưu dữ liệu vào database
const saveResult = async (username, type, result) => {
  try {
    const encodedUsername = encodeURIComponent(username);
    await fetch('/api/numerology/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-username': encodedUsername,
      },
      body: JSON.stringify({ type, result }),
    });
  } catch (error) {
    console.error('Error saving result:', error);
    toast.error('Không thể lưu dữ liệu!', { position: 'top-center' });
  }
};

onMounted(async () => {
  if (process.client) {
    const username = localStorage.getItem('username');
    // if (!username) {
    //   navigateTo('/login');
    //   return;
    // }
    userData.value.username = username;

    try {
      const userResponse = await $fetch('/api/user', {
        method: 'GET',
        query: { username },
      });
      if (userResponse && !userResponse.error) {
        userData.value = { ...userData.value, ...userResponse };
        isPremium.value = userResponse.isPremium || false;
        formData.value.name = userResponse.displayName || username;
      } else {
        throw new Error('Invalid user response');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.warn('Không thể tải thông tin user.', { position: 'top-center' });
      userData.value.id = 'guest';
    }

    try {
      const encodedUsername = encodeURIComponent(username);
      const dailyResponse = await fetch('/api/daily', {
        headers: {
          'x-username': encodedUsername,
          'x-birthdate': userData.value.birthdate || '14/03/2000',
        },
      });
      if (dailyResponse.ok) {
        dailyData.value = await dailyResponse.json();
      } else {
        toast.warn('Không thể tải dữ liệu vận mệnh hôm nay.', { position: 'top-center' });
      }
    } catch (error) {
      console.error('Error fetching daily data:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu vận mệnh hôm nay!', { position: 'top-center' });
    }

    if (userData.value.birthdate && formData.value.name) {
      try {
        const encodedUsername = encodeURIComponent(userData.value.username);
        const response = await fetch('/api/numerology/advanced', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-username': encodedUsername,
          },
          body: JSON.stringify({
            name: formData.value.name,
            birthdate: userData.value.birthdate,
            intention: 'Cung cấp thông tin cơ bản về tôi dựa trên thần số học.'
          }),
        });

        if (response.ok) {
          const data = await response.json();
          advancedData.value = { numbers: data.numbers, celebrities: data.celebrities };
        } else {
          toast.warn('Không thể tải dữ liệu Thần số học cơ bản!', { position: 'top-center' });
        }
      } catch (error) {
        console.error('Error fetching initial numerology data:', error);
        toast.error('Có lỗi khi tải dữ liệu Thần số học cơ bản!', { position: 'top-center' });
      }
    } else {
      toast.warn('Thiếu thông tin ngày sinh hoặc tên để tải dữ liệu Thần số học!', { position: 'top-center' });
    }

    // Tải dữ liệu đã lưu từ database
    await loadStoredResults(username);
    isPageLoading.value = false;
  }
});

const submitForm = async () => {
  if (!formData.value.name) {
    toast.error('Vui lòng nhập họ và tên!', { position: 'top-center' });
    return;
  }
  if (!userData.value.birthdate) {
    toast.error('Không tìm thấy ngày sinh trong thông tin user. Vui lòng cập nhật hồ sơ!', { position: 'top-center' });
    return;
  }

  loadingAdvice.value = true;
  try {
    const encodedUsername = encodeURIComponent(userData.value.username);
    const response = await fetch('/api/numerology/advanced', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-username': encodedUsername,
      },
      body: JSON.stringify({
        name: formData.value.name,
        birthdate: userData.value.birthdate,
        intention: formData.value.intention || 'Không có ý định cụ thể.',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      advice.value = data.answer;
      // Lưu vào database
      await saveResult(userData.value.username, 'advice', { answer: advice.value, intention: formData.value.intention });
      toast.success('Lời khuyên Thần số học đã được tạo!', { position: 'top-center' });
    } else {
      toast.error('Không thể lấy lời khuyên Thần số học!', { position: 'top-center' });
    }
  } catch (error) {
    console.error('Error fetching numerology:', error);
    toast.error('Có lỗi xảy ra khi lấy lời khuyên Thần số học!', { position: 'top-center' });
  } finally {
    loadingAdvice.value = false;
  }
};

const analyzeRelationship = async (type) => {
  const nameKey = `${type}Name`;
  const birthdateKey = `${type}Birthdate`;
  const resultKey = `${type}Result`;

  if (!relationshipData.value[nameKey]) {
    toast.error(`Vui lòng nhập họ và tên của ${tabs.find(tab => tab.name === type).label.toLowerCase()}!`, { position: 'top-center' });
    return;
  }
  if (!relationshipData.value[birthdateKey]) {
    toast.error(`Vui lòng nhập ngày sinh của ${tabs.find(tab => tab.name === type).label.toLowerCase()}!`, { position: 'top-center' });
    return;
  }
  if (!userData.value.birthdate) {
    toast.error('Không tìm thấy ngày sinh của bạn. Vui lòng cập nhật hồ sơ!', { position: 'top-center' });
    return;
  }

  loadingRelationship.value = true;
  try {
    const encodedUsername = encodeURIComponent(userData.value.username);
    const intention = `Phân tích mức độ hợp nhau giữa ${formData.value.name || userData.value.displayName || 'Người dùng'} sinh ngày ${userData.value.birthdate} và ${relationshipData.value[nameKey]} sinh ngày ${relationshipData.value[birthdateKey]} trong mối quan hệ ${type}.`;

    const response = await fetch('/api/numerology/advanced', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-username': encodedUsername,
      },
      body: JSON.stringify({
        name: formData.value.name || userData.value.displayName || 'Người dùng',
        birthdate: userData.value.birthdate,
        partnerName: relationshipData.value[nameKey], // Thêm họ tên của người kia
        partnerBirthdate: relationshipData.value[birthdateKey], // Thêm ngày sinh của người kia
        intention
      }),
    });

    if (response.ok) {
      const data = await response.json();
      relationshipData.value[resultKey] = data.answer;
      // Lưu vào database
      await saveResult(userData.value.username, `relationship_${type}`, {
        [`${type}Name`]: relationshipData.value[nameKey],
        [`${type}Birthdate`]: relationshipData.value[birthdateKey],
        [`${type}Result`]: data.answer
      });
      toast.success(`Phân tích mức độ hợp nhau với ${tabs.find(tab => tab.name === type).label.toLowerCase()} đã hoàn tất!`, { position: 'top-center' });
    } else {
      toast.error('Không thể phân tích mức độ hợp nhau!', { position: 'top-center' });
    }
  } catch (error) {
    console.error(`Error analyzing ${type} relationship:`, error);
    toast.error('Có lỗi xảy ra khi phân tích mức độ hợp nhau!', { position: 'top-center' });
  } finally {
    loadingRelationship.value = false;
  }
};

// Hàm tách diễn giải và lời khuyên từ answer
const getDescription = (type) => {
  const result = relationshipData.value[`${type}Result`];
  if (!result) return '';
  const sentences = result.split('. ').filter(s => s.trim());
  return sentences.slice(0, -1).join('. ') + (sentences.length > 1 ? '.' : '');
};

const getAdvice = (type) => {
  const result = relationshipData.value[`${type}Result`];
  if (!result) return '';
  const sentences = result.split('. ').filter(s => s.trim());
  return sentences[sentences.length - 1];
};
</script>