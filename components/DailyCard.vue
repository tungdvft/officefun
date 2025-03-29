<template>
  <div class="container mx-auto p-4">


    <!-- Tarot 1 lá -->
    <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
      <h2 class="text-xl font-semibold text-purple-700 mb-3 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Quẻ Tarot hôm nay
      </h2>
      <div class="flex justify-center mb-4">
        <div class="relative w-32 h-48 card-container">
          <div
            class="absolute inset-0 bg-cover bg-center rounded-lg card"
            :class="{ 'flip': singleCard.flip }"
            :style="{
              backgroundImage: singleCard.drawn
                ? `url(/cards/${getCardFileName(singleCard.name)})`
                : 'url(/one-card-tarot.jpg)'
            }"
          ></div>
        </div>
      </div>
      <button
        v-if="!hasDrawnSingle"
        @click="drawSingleCardWithSound"
        :disabled="loadingSingle"
        class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
      >
        {{ loadingSingle ? 'Đang rút...' : 'Rút 1 lá' }}
      </button>
      <p v-if="singleCard.drawn" class="text-gray-600 mt-2">
        <strong>Diễn giải:</strong> Lá bài "{{ singleCard.name }}" cho thấy {{ singleCard.meaning.toLowerCase() }} 
      </p>
      <p v-if="singleAdvice" class="text-gray-600 mt-2"><strong>Lời khuyên:</strong> {{ singleAdvice }}</p>
      <audio ref="shuffleSoundSingle" src="/sounds/shuffle.mp3"></audio>
      <audio ref="flipSoundSingle" src="/sounds/flip.mp3"></audio>
    </div>

    <!-- Phần rút bài nâng cao -->
    <div class="mb-6">
      <!-- <h2 class="text-xl font-semibold text-purple-700 mb-3 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Trải bài Tarot nâng cao
      </h2>
      <p class="text-gray-600 mb-4">Mỗi loại trải bài chỉ được rút 1 lần/ngày!</p> -->

      <!-- Trải bài Quá khứ - Hiện tại - Tương lai -->
      <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
        <h3 class="text-lg font-semibold text-blue-700 mb-2"> Trải bài 3 lá Quá khứ - Hiện tại - Tương lai</h3>
        <button
          v-if="!spreadResults['past-present-future']"
          @click="drawSpreadWithSound('past-present-future')"
          :disabled="spreadLimits['past-present-future'] || loadingSpreads['past-present-future']"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 mb-4"
        >
          {{ loadingSpreads['past-present-future'] ? 'Đang rút...' : spreadLimits['past-present-future'] ? 'Đã rút hôm nay!' : 'Rút bài' }}
        </button>
        <div class="mt-4">
          <div class="flex justify-center space-x-4 mb-4">
            <div v-for="(card, index) in defaultCards" :key="index" class="relative w-32 h-48 card-container">
              <div
                class="absolute inset-0 bg-cover bg-center rounded-lg card"
                :class="{ 'flip': cardFlipped['past-present-future'][index] }"
                :style="{
                  backgroundImage: spreadResults['past-present-future'] && cardFlipped['past-present-future'][index]
                    ? `url(/cards/${getCardFileName(spreadResults['past-present-future'].cards[index].text.split(' - ')[0])})`
                    : 'url(/one-card-tarot.jpg)'
                }"
              ></div>
            </div>
          </div>
          <div class="mb-4" v-if="spreadResults['past-present-future']">
            <p v-for="(card, index) in spreadResults['past-present-future'].cards" :key="index" class="text-gray-600">
              <strong>{{ card.position }}:</strong> {{ card.text }}
            </p>
          </div>
          <p v-if="spreadResults['past-present-future']" class="text-gray-600"><strong>Diễn giải tổng quát:</strong> {{ spreadResults['past-present-future'].interpretation }}</p>
          <p v-if="spreadResults['past-present-future']" class="text-gray-600"><strong>Lời khuyên cho hôm nay:</strong> {{ spreadResults['past-present-future'].advice }}</p>
        </div>
      </div>

      <!-- Trải bài Tình yêu -->
      <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
        <h3 class="text-lg font-semibold text-pink-700 mb-2">Trải bài 3 lá Tình yêu</h3>
        <button
          v-if="!spreadResults['love']"
          @click="drawSpreadWithSound('love')"
          :disabled="spreadLimits['love'] || loadingSpreads['love']"
          class="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:bg-gray-400 mb-4"
        >
          {{ loadingSpreads['love'] ? 'Đang rút...' : spreadLimits['love'] ? 'Đã rút hôm nay!' : 'Rút bài' }}
        </button>
        <div class="mt-4">
          <div class="flex justify-center space-x-4 mb-4">
            <div v-for="(card, index) in defaultCards" :key="index" class="relative w-32 h-48 card-container">
              <div
                class="absolute inset-0 bg-cover bg-center rounded-lg card"
                :class="{ 'flip': cardFlipped['love'][index] }"
                :style="{
                  backgroundImage: spreadResults['love'] && cardFlipped['love'][index]
                    ? `url(/cards/${getCardFileName(spreadResults['love'].cards[index].text.split(' - ')[0])})`
                    : 'url(/one-card-tarot.jpg)'
                }"
              ></div>
            </div>
          </div>
          <div class="mb-4" v-if="spreadResults['love']">
            <p v-for="(card, index) in spreadResults['love'].cards" :key="index" class="text-gray-600">
              <strong>{{ card.position }}:</strong> {{ card.text }}
            </p>
          </div>
          <p v-if="spreadResults['love']" class="text-gray-600"><strong>Diễn giải tổng quát:</strong> {{ spreadResults['love'].interpretation }}</p>
          <p v-if="spreadResults['love']" class="text-gray-600"><strong>Lời khuyên cho hôm nay:</strong> {{ spreadResults['love'].advice }}</p>
        </div>
      </div>

      <!-- Trải bài Công việc -->
      <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
        <h3 class="text-lg font-semibold text-green-700 mb-2">Trải bài 3 lá Công việc</h3>
        <button
          v-if="!spreadResults['career']"
          @click="drawSpreadWithSound('career')"
          :disabled="spreadLimits['career'] || loadingSpreads['career']"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 mb-4"
        >
          {{ loadingSpreads['career'] ? 'Đang rút...' : spreadLimits['career'] ? 'Đã rút hôm nay!' : 'Rút bài' }}
        </button>
        <div class="mt-4">
          <div class="flex justify-center space-x-4 mb-4">
            <div v-for="(card, index) in defaultCards" :key="index" class="relative w-32 h-48 card-container">
              <div
                class="absolute inset-0 bg-cover bg-center rounded-lg card"
                :class="{ 'flip': cardFlipped['career'][index] }"
                :style="{
                  backgroundImage: spreadResults['career'] && cardFlipped['career'][index]
                    ? `url(/cards/${getCardFileName(spreadResults['career'].cards[index].text.split(' - ')[0])})`
                    : 'url(/one-card-tarot.jpg)'
                }"
              ></div>
            </div>
          </div>
          <div class="mb-4" v-if="spreadResults['career']">
            <p v-for="(card, index) in spreadResults['career'].cards" :key="index" class="text-gray-600">
              <strong>{{ card.position }}:</strong> {{ card.text }}
            </p>
          </div>
          <p v-if="spreadResults['career']" class="text-gray-600"><strong>Diễn giải tổng quát:</strong> {{ spreadResults['career'].interpretation }}</p>
          <p v-if="spreadResults['career']" class="text-gray-600"><strong>Lời khuyên cho hôm nay:</strong> {{ spreadResults['career'].advice }}</p>
        </div>
      </div>

      <!-- Trải bài Celtic Cross -->
      <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
        <h3 class="text-lg font-semibold text-yellow-700 mb-2">Trải bài 5 lá Celtic Cross</h3>
        <button
          v-if="!spreadResults['celtic-cross']"
          @click="drawSpreadWithSound('celtic-cross')"
          :disabled="spreadLimits['celtic-cross'] || loadingSpreads['celtic-cross']"
          class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:bg-gray-400 mb-4"
        >
          {{ loadingSpreads['celtic-cross'] ? 'Đang rút...' : spreadLimits['celtic-cross'] ? 'Đã rút hôm nay!' : 'Rút bài' }}
        </button>
        <div class="mt-4">
          <div class="flex flex-wrap justify-center space-x-4 mb-4">
            <div v-for="(card, index) in defaultCardsCeltic" :key="index" class="relative w-32 h-48 card-container">
              <div
                class="absolute inset-0 bg-cover bg-center rounded-lg card"
                :class="{ 'flip': cardFlipped['celtic-cross'][index] }"
                :style="{
                  backgroundImage: spreadResults['celtic-cross'] && cardFlipped['celtic-cross'][index]
                    ? `url(/cards/${getCardFileName(spreadResults['celtic-cross'].cards[index].text.split(' - ')[0])})`
                    : 'url(/one-card-tarot.jpg)'
                }"
              ></div>
            </div>
          </div>
          <div class="mb-4" v-if="spreadResults['celtic-cross']">
            <p v-for="(card, index) in spreadResults['celtic-cross'].cards" :key="index" class="text-gray-600">
              <strong>{{ card.position }}:</strong> {{ card.text }}
            </p>
          </div>
          <p v-if="spreadResults['celtic-cross']" class="text-gray-600"><strong>Diễn giải tổng quát:</strong> {{ spreadResults['celtic-cross'].interpretation }}</p>
          <p v-if="spreadResults['celtic-cross']" class="text-gray-600"><strong>Lời khuyên cho hôm nay:</strong> {{ spreadResults['celtic-cross'].advice }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { getCardFileName } from '~/utils/tarotCardMapping';

// Props
const props = defineProps({
  dailyData: { type: Object, required: true },
  userId: [String, Number],
  userGender: String,
});

// State cho user
const localUserId = ref('');
const localUserGender = ref('');

// State cho rút 1 lá
const singleCard = ref({ drawn: false, flip: false, name: '', meaning: '' });
const singleAdvice = ref('');
const hasDrawnSingle = ref(false);
const loadingSingle = ref(false);
const shuffleSoundSingle = ref(null);
const flipSoundSingle = ref(null);

// State cho rút bài nâng cao
const spreadResults = ref({
  'past-present-future': null,
  'love': null,
  'career': null,
  'celtic-cross': null,
});
const spreadLimits = ref({
  'past-present-future': false,
  'love': false,
  'career': false,
  'celtic-cross': false,
});
const loadingSpreads = ref({
  'past-present-future': false,
  'love': false,
  'career': false,
  'celtic-cross': false,
});
const cardFlipped = ref({
  'past-present-future': [false, false, false],
  'love': [false, false, false],
  'career': [false, false, false],
  'celtic-cross': [false, false, false, false, false],
});

// State để kiểm tra user có sẵn sàng không
const isUserReady = ref(false);

// Lá bài mặc định cho các trải bài (chỉ dùng để hiển thị số lượng lá, không cần nội dung cụ thể vì sẽ hiển thị mặt sau)
const defaultCards = ref(Array(3).fill({}));
const defaultCardsCeltic = ref(Array(5).fill({}));

// Hàm phát âm thanh
const playSound = (audioRef, type) => {
  if (audioRef.value) {
    audioRef.value.currentTime = 0;
    audioRef.value.play().catch(error => {
      console.error(`Error playing ${type} sound:`, error);
    });
  }
};

// Hàm điều chỉnh lời khuyên theo giới tính
const adjustAdviceBasedOnGender = (advice) => {
  if (localUserGender.value === 'Other') {
    return `${advice} Hãy cân bằng giữa lý trí và cảm xúc để đưa ra quyết định tốt nhất.`;
  }
  return advice;
};

// Khởi tạo dữ liệu khi userId có giá trị
const initializeData = async () => {
  if (!localUserId.value) {
    console.error('Cannot initialize data: userId is not set');
    return;
  }
  isUserReady.value = true;
  await checkLimit('single');
  await fetchLastDraw('single');
  await fetchSpreadResults();
};

// Kiểm tra lượt rút
const checkLimit = async (type) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const userIdForLimit = type === 'single' ? `${localUserId.value}-single` : localUserId.value;
    const response = await $fetch('/api/tarotLimit', {
      method: 'GET',
      query: { user_id: userIdForLimit, date: today },
    });
    const usedDraws = response.count;
    if (type === 'single') {
      hasDrawnSingle.value = usedDraws >= 1;
    } else {
      const history = await $fetch('/api/tarotHistory', {
        method: 'GET',
        query: { user_id: localUserId.value, date: today },
      });
      history.forEach(entry => {
        spreadLimits.value[entry.spread_type] = true;
      });
    }
  } catch (error) {
    console.error(`Error checking ${type} card limit:`, error);
    toast.error('Lỗi khi kiểm tra lượt bói!');
  }
};

// Load kết quả rút bài nâng cao từ cơ sở dữ liệu
const fetchSpreadResults = async () => {
  if (!localUserId.value) {
    console.error('Invalid userId for fetching spread results:', localUserId.value);
    return;
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const history = await $fetch('/api/tarotHistory', {
      method: 'GET',
      query: { user_id: localUserId.value, date: today },
    });

    history.forEach(entry => {
      spreadLimits.value[entry.spread_type] = true;
      spreadResults.value[entry.spread_type] = entry.data;
      cardFlipped.value[entry.spread_type] = entry.data.cards.map(() => true);
    });
  } catch (error) {
    console.error('Error fetching spread results:', error);
  }
};

// Rút 1 lá với âm thanh và hiệu ứng
const drawSingleCardWithSound = async () => {
  const userIdString = String(localUserId.value);
  if (!userIdString) {
    console.error('Invalid userId for single draw:', userIdString);
    toast.error('Lỗi: Không tìm thấy userId. Vui lòng reload trang!');
    return;
  }

  playSound(shuffleSoundSingle, 'shuffle');
  loadingSingle.value = true;

  const defaultCard = {
    name: 'The Fool',
    meaning: 'Hành trình mới bắt đầu',
  };
  const defaultAdvice = adjustAdviceBasedOnGender(
    'Hôm nay, hãy dành thời gian để tập trung vào mục tiêu cá nhân của bạn. Đừng để những ý kiến trái chiều làm bạn phân tâm. Một bước nhỏ nhưng kiên định sẽ giúp bạn tiến gần hơn đến thành công.'
  );

  try {
    const today = new Date().toISOString().split('T')[0];
    const limitResponse = await $fetch('/api/tarotLimit', {
      method: 'GET',
      query: { user_id: `${userIdString}-single`, date: today },
    });

    if (limitResponse.count >= 1) {
      hasDrawnSingle.value = true;
      return;
    }

    const response = await $fetch('/api/tarot', {
      method: 'POST',
      body: { user_id: `${userIdString}-single`, draw_type: 'single' },
    });

    // Kiểm tra response
    if (!response) {
      throw new Error('No response from /api/tarot');
    }

    if (response.error) {
      throw new Error(`API error: ${response.error}`);
    }

    // Xử lý interpretation để lấy tên lá bài và diễn giải
    let cardName = 'The Fool';
    let cardMeaning = 'Hành trình mới bắt đầu';
    if (typeof response.interpretation === 'string') {
      // Tìm tên lá bài trong interpretation
      const match = response.interpretation.match(/Lá bài hôm nay của bạn là ([^,]+),/);
      if (match && match[1]) {
        cardName = match[1].trim();
        // Lấy phần diễn giải (bỏ phần "Lá bài hôm nay của bạn là [tên lá bài],")
        cardMeaning = response.interpretation.replace(match[0], '').trim();
      } else {
        console.warn('Could not extract card name from interpretation. Using default card.');
        toast.warn('Không thể lấy tên lá bài từ server. Hiển thị lá bài mặc định.');
      }
    } else {
      console.warn('Invalid interpretation field: expected a string, got', typeof response.interpretation);
      toast.warn('Không thể lấy diễn giải từ server. Hiển thị lá bài mặc định.');
    }

    singleCard.value = {
      drawn: false,
      flip: false,
      name: cardName,
      meaning: cardMeaning,
    };
    singleAdvice.value = adjustAdviceBasedOnGender(
      response.advice || defaultAdvice
    );

    setTimeout(() => {
      playSound(flipSoundSingle, 'flip');
      singleCard.value.flip = true;
      singleCard.value.drawn = true;
    }, 500);

    await $fetch('/api/tarotLimit', {
      method: 'POST',
      body: { user_id: `${userIdString}-single`, date: today },
    });

    hasDrawnSingle.value = true;
    toast.success('Bài Tarot 1 lá đã được rút!');
  } catch (error) {
    console.error('Error drawing single card:', error);
    // Hiển thị thông báo lỗi chi tiết hơn
    let errorMessage = 'Lỗi khi rút bài Tarot. Vui lòng thử lại sau!';
    if (error.message.includes('API error')) {
      errorMessage = `Lỗi từ server: ${error.message.replace('API error: ', '')}`;
    } else if (error.message.includes('No response')) {
      errorMessage = 'Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng!';
    }
    toast.error(errorMessage);

    // Sử dụng giá trị mặc định
    singleCard.value = {
      drawn: false,
      flip: false,
      name: defaultCard.name,
      meaning: defaultCard.meaning,
    };
    singleAdvice.value = defaultAdvice;
    setTimeout(() => {
      playSound(flipSoundSingle, 'flip');
      singleCard.value.flip = true;
      singleCard.value.drawn = true;
    }, 500);

    hasDrawnSingle.value = true;
  } finally {
    loadingSingle.value = false;
  }
};

// Rút bài nâng cao với âm thanh và hiệu ứng
const drawSpreadWithSound = async (spreadType) => {
  const userIdString = String(localUserId.value);
  if (!userIdString) {
    console.error('Invalid userId for spread draw:', userIdString);
    toast.error('Lỗi: Không tìm thấy userId. Vui lòng reload trang!');
    return;
  }

  loadingSpreads.value[spreadType] = true;
  try {
    const today = new Date().toISOString().split('T')[0];
    const history = await $fetch('/api/tarotHistory', {
      method: 'GET',
      query: { user_id: userIdString, date: today },
    });

    if (history.some(entry => entry.spread_type === spreadType)) {
      spreadLimits.value[spreadType] = true;
      toast.warn(`Hôm nay bạn đã rút trải bài ${getSpreadTitle(spreadType)}, quay lại sau 0h nhé!`);
      return;
    }

    const response = await $fetch('/api/tarot', {
      method: 'POST',
      body: { user_id: userIdString, draw_type: 'spread', spread_type: spreadType },
    });

    cardFlipped.value[spreadType] = spreadType === 'celtic-cross'
      ? [false, false, false, false, false]
      : [false, false, false];

    spreadResults.value[spreadType] = {
      ...response,
      advice: adjustAdviceBasedOnGender(
        response.advice || 'Hôm nay, bạn nên tập trung vào việc xây dựng mối quan hệ với những người xung quanh. Một cuộc trò chuyện chân thành có thể mở ra cơ hội mới cho bạn.'
      ),
    };

    response.cards.forEach((_, index) => {
      setTimeout(() => {
        playSound(flipSoundSingle, 'flip');
        cardFlipped.value[spreadType][index] = true;
      }, 500 * (index + 1));
    });

    spreadLimits.value[spreadType] = true;
    toast.success(`Trải bài ${getSpreadTitle(spreadType)} đã được rút!`);
  } catch (error) {
    console.error(`Error drawing ${spreadType} spread:`, error);
    toast.error('Lỗi khi rút bài Tarot: ' + (error.message || 'Vui lòng thử lại sau!'));
  } finally {
    loadingSpreads.value[spreadType] = false;
  }
};

// Lấy lần rút bài cuối cùng (cho rút 1 lá)
const fetchLastDraw = async (type) => {
  const userIdString = String(localUserId.value);
  if (!userIdString) {
    console.error('Invalid userId for fetching last draw:', userIdString);
    return;
  }

  try {
    const response = await $fetch('/api/tarotLastDraw', {
      method: 'GET',
      query: { user_id: `${userIdString}-single` },
    });

    if (response && response.data && typeof response.data.interpretation === 'string') {
      let cardName = 'The Fool';
      let cardMeaning = 'Hành trình mới bắt đầu';
      const match = response.data.interpretation.match(/Lá bài hôm nay của bạn là ([^,]+),/);
      if (match && match[1]) {
        cardName = match[1].trim();
        cardMeaning = response.data.interpretation.replace(match[0], '').trim();
      }

      singleCard.value = {
        drawn: true,
        flip: true,
        name: cardName,
        meaning: cardMeaning,
      };
      singleAdvice.value = adjustAdviceBasedOnGender(
        response.data.advice || 'Hôm nay, hãy dành thời gian để tập trung vào mục tiêu cá nhân của bạn. Đừng để những ý kiến trái chiều làm bạn phân tâm. Một bước nhỏ nhưng kiên định sẽ giúp bạn tiến gần hơn đến thành công.'
      );
      hasDrawnSingle.value = true;
    } else {
      console.warn('Invalid last draw response:', response);
    }
  } catch (error) {
    console.error('Error fetching last single draw:', error);
    singleCard.value = { drawn: false, flip: false, name: '', meaning: '' };
    singleAdvice.value = '';
  }
};

// Lấy tiêu đề cho loại trải bài
const getSpreadTitle = (spreadType) => {
  switch (spreadType) {
    case 'past-present-future':
      return 'Quá khứ - Hiện tại - Tương lai';
    case 'love':
      return 'Tình yêu';
    case 'career':
      return 'Công việc';
    case 'celtic-cross':
      return 'Celtic Cross';
    default:
      return spreadType;
  }
};

// Theo dõi thay đổi của props.userId
watch(
  () => props.userId,
  (newUserId) => {
    const userIdString = newUserId != null ? String(newUserId).trim() : '';
    if (userIdString) {
      localUserId.value = userIdString;
      localUserGender.value = props.userGender || 'Unknown';
      initializeData();
    } else {
      console.error('Invalid userId detected:', newUserId);
      toast.error('Lỗi: userId không hợp lệ. Vui lòng reload trang!');
    }
  },
  { immediate: true }
);

// Khởi tạo khi component được mount
onMounted(async () => {
  await initializeData();
});
</script>

<style scoped>
.card-container {
  perspective: 1000px;
}

.card {
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip {
  transform: rotateY(180deg);
}
</style>