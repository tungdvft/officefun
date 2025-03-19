<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
      <svg class="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Quản lý công việc
    </h2>

    <!-- Form thêm task -->
    <form @submit.prevent="addTask" class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label for="taskTitle" class="block text-gray-700 mb-2">Tiêu đề</label>
        <input
          v-model="taskTitle"
          type="text"
          id="taskTitle"
          placeholder="VD: Gửi báo cáo"
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <div>
        <label for="taskDescription" class="block text-gray-700 mb-2">Mô tả</label>
        <input
          v-model="taskDescription"
          type="text"
          id="taskDescription"
          placeholder="Chi tiết công việc..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div>
        <label for="dueDate" class="block text-gray-700 mb-2">Hạn chót</label>
         <VueDatePicker
            v-model="dueDate"
            id="dueDate"
            :enableTimePicker="false"
           
            class="w-full"
           
          />
        <!-- <input
          v-model="dueDate"
          type="date"
          id="dueDate"
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        /> -->
      </div>
      <button
        type="submit"
        class="md:col-span-3 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        :disabled="loading"
      >
        {{ loading ? 'Đang thêm...' : 'Thêm công việc' }}
      </button>
    </form>

    <!-- Kanban Board -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gray-100 p-4 rounded-lg">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Chưa làm</h3>
        <div v-if="pendingTasks.length > 0" class="space-y-2">
          <div v-for="task in pendingTasks" :key="task.id" class="task-card">
            <p class="font-semibold">{{ task.title }}</p>
            <p v-if="task.description" class="text-sm text-gray-600">{{ task.description }}</p>
            <p class="text-xs text-gray-500">Hạn: {{ formatDate(task.due_date) }}</p>
            <div class="mt-2 flex justify-between">
              <button @click="updateTaskStatus(task, 'in_progress')" class="text-blue-500 hover:text-blue-700">
                Bắt đầu
              </button>
              <button @click="removeTask(task.id)" class="text-red-500 hover:text-red-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-600 text-sm">Chưa có task nào.</p>
      </div>

      <div class="bg-yellow-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold text-yellow-700 mb-2">Đang làm</h3>
        <div v-if="inProgressTasks.length > 0" class="space-y-2">
          <div v-for="task in inProgressTasks" :key="task.id" class="task-card">
            <p class="font-semibold">{{ task.title }}</p>
            <p v-if="task.description" class="text-sm text-gray-600">{{ task.description }}</p>
            <p class="text-xs text-gray-500">Hạn: {{ formatDate(task.due_date) }}</p>
            <div class="mt-2 flex justify-between">
              <button @click="updateTaskStatus(task, 'completed')" class="text-green-500 hover:text-green-700">
                Hoàn thành
              </button>
              <button @click="removeTask(task.id)" class="text-red-500 hover:text-red-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-600 text-sm">Chưa có task nào.</p>
      </div>

      <div class="bg-green-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold text-green-700 mb-2">Hoàn thành</h3>
        <div v-if="completedTasks.length > 0" class="space-y-2">
          <div v-for="task in completedTasks" :key="task.id" class="task-card">
            <p class="font-semibold text-gray-500 line-through">{{ task.title }}</p>
            <p v-if="task.description" class="text-sm text-gray-600 line-through">{{ task.description }}</p>
            <p class="text-xs text-gray-500">Hạn: {{ formatDate(task.due_date) }}</p>
            <div class="mt-2 flex justify-between">
              <button @click="updateTaskStatus(task, 'pending')" class="text-blue-500 hover:text-blue-700">
                Làm lại
              </button>
              <button @click="removeTask(task.id)" class="text-red-500 hover:text-red-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-600 text-sm">Chưa có task nào.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { toast } from 'vue3-toastify';
import VueDatePicker from '@vuepic/vue-datepicker'; // Import VueDatePicker
import '@vuepic/vue-datepicker/dist/main.css'; // Import CSS mặc định
const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
});

const taskTitle = ref('');
const taskDescription = ref('');
const dueDate = ref(new Date().toISOString().split('T')[0]);
const tasks = ref([]);
const loading = ref(false);

const pendingTasks = computed(() => tasks.value.filter(task => task.status === 'pending'));
const inProgressTasks = computed(() => tasks.value.filter(task => task.status === 'in_progress'));
const completedTasks = computed(() => tasks.value.filter(task => task.status === 'completed'));

async function addTask() {
  if (!taskTitle.value.trim()) return;

  loading.value = true;
  try {
    const response = await $fetch('/api/tasks', {
      method: 'POST',
      body: {
        user_id: props.userId,
        title: taskTitle.value,
        description: taskDescription.value,
        due_date: dueDate.value,
      },
    });
    toast.success('Đã thêm công việc!', { position: 'top-center' });
    taskTitle.value = '';
    taskDescription.value = '';
    dueDate.value = new Date().toISOString().split('T')[0];
    await fetchTasks();
  } catch (error) {
    console.error('Error adding task:', error);
    toast.error('Lỗi khi thêm công việc!', { position: 'top-center' });
  } finally {
    loading.value = false;
  }
}

async function updateTaskStatus(task, newStatus) {
  try {
    await $fetch('/api/tasks', {
      method: 'PUT',
      body: {
        id: task.id,
        user_id: props.userId,
        status: newStatus,
      },
    });
    await fetchTasks();
  } catch (error) {
    console.error('Error updating task status:', error);
    toast.error('Lỗi khi cập nhật trạng thái!', { position: 'top-center' });
  }
}

async function removeTask(taskId) {
  if (!confirm('Bạn có chắc muốn xóa công việc này?')) return;

  try {
    await $fetch('/api/tasks', {
      method: 'DELETE',
      body: {
        id: taskId,
        user_id: props.userId,
      },
    });
    toast.success('Đã xóa công việc!', { position: 'top-center' });
    await fetchTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
    toast.error('Lỗi khi xóa công việc!', { position: 'top-center' });
  }
}

async function fetchTasks() {
  if (!props.userId) {
    return;
  }
  try {
    const taskList = await $fetch('/api/tasks', {
      method: 'GET',
      query: { user_id: props.userId },
    });
    tasks.value = Array.isArray(taskList) ? taskList : [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    toast.error('Lỗi khi tải công việc!', { position: 'top-center' });
  }
}

// Hàm formatDate
function formatDate(dateString) {
  return new Date(dateString).toLocaleString('vi-VN', { dateStyle: 'medium' });
}

onMounted(() => {
  fetchTasks();
});

watch(() => props.userId, (newUserId) => {
  if (newUserId) {
    fetchTasks();
  }
});
</script>

<style scoped>
.task-card {
  @apply bg-white p-3 rounded-md shadow-sm border border-gray-200;
}
</style>