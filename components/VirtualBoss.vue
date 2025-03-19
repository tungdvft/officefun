<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Trò chuyện với Sếp Ảo</h2>
    <p class="text-gray-600 mb-4">Hỏi sếp bất cứ gì, nhưng đừng mong sếp trả lời nghiêm túc nhé!</p>

    <p class="text-gray-700 mb-4">Lượt chat còn lại hôm nay: {{ remainingChats }}</p>

    <div class="max-h-64 overflow-y-auto border border-gray-200 rounded-md p-4 bg-gray-50 mb-4">
      <div v-for="(message, index) in messages" :key="index" :class="message.from === 'user' ? 'text-right' : 'text-left'">
        <p
          :class="[
            'inline-block px-4 py-2 rounded-lg mb-2',
            message.from === 'user' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
          ]"
        >
          {{ message.text }}
        </p>
      </div>
    </div>

    <p v-if="isLimitReached" class="text-red-500 mb-2">Hôm nay bạn đã dùng hết 3 lượt, quay lại sau 0h nhé!</p>

    <div class="flex gap-4">
      <input
        v-model="userInput"
        @keyup.enter="sendMessage"
        placeholder="Hỏi sếp đi, ví dụ: 'Sếp ơi, nghỉ được không?'"
        :disabled="isLimitReached || isSending"
        class="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
      />
      <button
        @click="sendMessage"
        :disabled="isLimitReached || isSending"
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:bg-gray-400"
      >
        Gửi
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const userInput = ref('');
const messages = ref([
  { text: 'Chào bạn! Tôi là Sếp Ảo, sẵn sàng trả lời mọi thắc mắc đây!', from: 'boss' },
]);
const remainingChats = ref(3);
const isLimitReached = ref(false);
const isSending = ref(false);

onMounted(async () => {
  await checkLimit();
  await fetchLastReply();
});

async function checkLimit() {
  try {
    const username = localStorage.getItem('username') || 'guest';
    const encodedUsername = encodeURIComponent(username);
    const today = new Date().toISOString().split('T')[0];
    const limitUrl = new URL('/api/bossChatLimit', window.location.origin);
    limitUrl.searchParams.append('date', today);
    const response = await fetch(limitUrl, {
      method: 'GET',
      headers: { 'x-username': encodedUsername },
    });
    const data = await response.json();
    const usedChats = data.count || 0;
    remainingChats.value = 3 - usedChats;
    isLimitReached.value = usedChats >= 3;
  } catch (error) {
    console.error('Error checking boss chat limit:', error);
    remainingChats.value = 3;
  }
}

async function fetchLastReply() {
  try {
    const username = localStorage.getItem('username') || 'guest';
    const encodedUsername = encodeURIComponent(username);
    const response = await fetch('/api/bossLastReply', {
      method: 'GET',
      headers: { 'x-username': encodedUsername },
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.data) {
        messages.value.push({ text: data.data.question, from: 'user' });
        messages.value.push({ text: data.data.reply, from: 'boss' });
      }
    }
  } catch (error) {
    console.error('Error fetching last reply:', error);
  }
}

async function sendMessage() {
  if (!userInput.value.trim() || isSending.value) return;
  isSending.value = true;

  const username = localStorage.getItem('username') || 'guest';
  const encodedUsername = encodeURIComponent(username);
  const today = new Date().toISOString().split('T')[0];

  const limitUrl = new URL('/api/bossChatLimit', window.location.origin);
  limitUrl.searchParams.append('date', today);
  const limitResponse = await fetch(limitUrl, {
    method: 'GET',
    headers: { 'x-username': encodedUsername },
  });
  const limitData = await limitResponse.json();
  if (limitData.count >= 3) {
    isLimitReached.value = true;
    remainingChats.value = 0;
    alert('Hôm nay bạn đã dùng hết 3 lượt chat với Sếp, quay lại sau 0h nhé!');
    isSending.value = false;
    return;
  }

  messages.value.push({ text: userInput.value, from: 'user' });
  const inputToSend = userInput.value;
  userInput.value = '';

  try {
    const response = await fetch('/api/virtualBoss', {
      method: 'POST',
      headers: {
        'x-username': encodedUsername,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: inputToSend }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.reply && data.reply.trim()) {
        messages.value.push({ text: data.reply, from: 'boss' });
      }
      await checkLimit();
    } else if (response.status === 403) {
      const errorData = await response.json();
      alert(errorData.message);
      await checkLimit();
    } else {
      throw new Error('Lỗi từ server');
    }
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
    messages.value.push({
      text: 'Sếp bận họp với cái ghế xoay, để lát trả lời nhé!',
      from: 'boss',
    });
  } finally {
    isSending.value = false;
  }
}
</script>