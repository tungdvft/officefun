<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-12">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-8 relative">
      <!-- Loading bar -->
      <div
        v-if="loading"
        class="absolute top-0 left-0 h-1 bg-blue-500 animate-loading-bar rounded-t-xl"
        :style="{ width: loadingProgress + '%' }"
      ></div>

      <!-- Tiêu đề -->
      <h1
        class="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500 mb-8"
      >
        Hồ sơ của bạn
      </h1>

      <!-- Thông tin user -->
      <div class="space-y-6">
        <!-- Username -->
        <div class="flex items-center gap-4">
          <label class="w-1/3 text-gray-700 font-semibold">Tên đăng nhập</label>
          <div class="w-2/3 p-3 bg-gray-100 rounded-lg text-gray-800">
            {{ userData.username }}
          </div>
        </div>

        <!-- Display Name -->
        <div class="flex items-center gap-4">
          <label class="w-1/3 text-gray-700 font-semibold">Tên hiển thị</label>
          <input
            v-model="displayName"
            type="text"
            placeholder="Nhập tên hiển thị của bạn"
            class="w-2/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="loading"
          />
        </div>

        <!-- Birthdate -->
        <div class="flex items-center gap-4">
          <label class="w-1/3 text-gray-700 font-semibold">Ngày sinh</label>
          <div class="w-2/3 p-3 bg-gray-100 rounded-lg text-gray-800">
            {{ userData.birthdate }}
          </div>
        </div>

        <!-- Profession -->
        <div class="flex items-center gap-4">
          <label class="w-1/3 text-gray-700 font-semibold">Ngành nghề</label>
          <div class="w-2/3 p-3 bg-gray-100 rounded-lg text-gray-800">
            {{ userData.profession }}
          </div>
        </div>
      </div>

      <!-- Nút lưu -->
      <div class="mt-8 flex justify-center">
        <button
          @click="saveProfile"
          class="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all shadow-md"
          :disabled="loading"
        >
          {{ loading ? 'Đang lưu...' : 'Lưu tên hiển thị' }}
        </button>
      </div>

      <!-- Nút quay lại -->
      <div class="mt-6 text-center">
        <NuxtLink
          to="/"
          class="text-blue-500 hover:underline font-semibold transition-colors"
        >
          Quay lại trang chủ
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { toast } from 'vue3-toastify';

const userData = ref({ username: '', birthdate: '', profession: '', displayName: '' });
const displayName = ref('');
const loading = ref(false);
const loadingProgress = ref(0);

onMounted(async () => {
  if (process.client) {
    const username = localStorage.getItem('username') || 'Guest';
    try {
      const userResponse = await $fetch('/api/user', {
        method: 'GET',
        query: { username },
      });

      if (userResponse && !userResponse.error) {
        userData.value = {
          username: userResponse.username,
          birthdate: userResponse.birthdate,
          profession: userResponse.profession,
          displayName: userResponse.displayName,
        };
        displayName.value = userResponse.displayName || userResponse.username;
      } else {
        toast.error('Không tìm thấy thông tin user. Vui lòng đăng nhập lại.', {
          position: 'top-center',
        });
        navigateTo('/login');
      }
    } catch (error) {
      console.error('Profile.vue - Error fetching user data:', error);
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.', {
        position: 'top-center',
      });
      navigateTo('/login');
    }
  }
});

async function saveProfile() {
  if (!displayName.value.trim()) {
    toast.error('Vui lòng nhập tên hiển thị!', {
      position: 'top-center',
    });
    return;
  }

  loading.value = true;
  loadingProgress.value = 0;

  const progressInterval = setInterval(() => {
    if (loadingProgress.value < 90) {
      loadingProgress.value += 10;
    }
  }, 100);

  try {
    const username = localStorage.getItem('username');
    await $fetch('/api/user', {
      method: 'POST',
      body: {
        username,
        birthdate: userData.value.birthdate,
        profession: userData.value.profession,
        displayName: displayName.value,
      },
    });

    toast.success('Cập nhật tên hiển thị thành công!', {
      position: 'top-center',
    });
    loadingProgress.value = 100;

    // Cập nhật local userData
    userData.value.displayName = displayName.value;
  } catch (error) {
    console.error('Profile.vue - Error updating profile:', error);
    toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.', {
      position: 'top-center',
    });
  } finally {
    clearInterval(progressInterval);
    loading.value = false;
  }
}

definePageMeta({
  layout: 'default',
});
</script>

<style scoped>
.animate-loading-bar {
  transition: width 0.3s ease-in-out;
}
</style>