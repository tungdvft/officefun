<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
      <button class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
        Thêm người dùng
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>

    <div v-else-if="users.length > 0" class="bg-white shadow rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày sinh</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span class="text-purple-600 font-medium">{{ user.fullname?.charAt(0) || 'U' }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.fullname || 'Chưa có tên' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.email || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.birthdate || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.tokens || 0 }} tokens
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="editUser(user)" class="text-purple-600 hover:text-purple-900 mr-3">Sửa</button>
                <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button @click="prevPage" :disabled="pagination.page === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Trước
          </button>
          <button @click="nextPage" :disabled="pagination.page === pagination.totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Sau
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Hiển thị <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
              đến <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
              trong tổng <span class="font-medium">{{ pagination.total }}</span> kết quả
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button @click="prevPage" :disabled="pagination.page === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Trước</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button v-for="page in pagination.totalPages" :key="page" @click="goToPage(page)" :class="{'bg-purple-50 border-purple-500 text-purple-600 z-10': pagination.page === page, 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': pagination.page !== page}" class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                {{ page }}
              </button>
              <button @click="nextPage" :disabled="pagination.page === pagination.totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Sau</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white shadow rounded-lg p-6 text-center">
      <p class="text-gray-500">Không tìm thấy người dùng nào</p>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Chỉnh sửa người dùng</h3>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveUser">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Họ tên</label>
              <input v-model="editingUser.fullname" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input v-model="editingUser.email" type="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Ngày sinh</label>
              <input v-model="editingUser.birthdate" type="date" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tokens</label>
              <input v-model.number="editingUser.tokens" type="number" min="0" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" @click="showEditModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Hủy
            </button>
            <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'dashboard'
});

const users = ref([]);
const showEditModal = ref(false);
const loading = ref(true);
const error = ref(null);

const editingUser = ref({
  id: '',
  fullname: '',
  email: '',
  birthdate: '',
  tokens: 0
});

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1
});

// Fetch users
const fetchUsers = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Gọi API users.get.js để lấy danh sách người dùng
    const response = await $fetch(`/api/users?page=${pagination.value.page}&limit=${pagination.value.limit}`, {
      method: 'GET',
      headers: {
        // Thêm headers xác thực nếu cần
      }
    });

    if (response.success && response.data.users) {
      users.value = response.data.users;
      // Cập nhật thông tin phân trang
      pagination.value.total = users.value.length; // Giả sử API trả về tổng số
      pagination.value.totalPages = Math.ceil(pagination.value.total / pagination.value.limit);
    } else {
      users.value = [];
      throw new Error('Không có dữ liệu người dùng');
    }
  } catch (err) {
    console.error('Lỗi khi lấy danh sách người dùng:', err);
    error.value = err.message || 'Không thể tải danh sách người dùng';
    users.value = [];
  } finally {
    loading.value = false;
  }
};

// Pagination controls
const prevPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--;
    fetchUsers();
  }
};

const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++;
    fetchUsers();
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page;
    fetchUsers();
  }
};

// Edit user
const editUser = (user) => {
  editingUser.value = {
    id: user.id,
    fullname: user.fullname,
    email: user.email,
    birthdate: user.birthdate,
    tokens: user.tokens || 0
  };
  showEditModal.value = true;
};

// Save user changes
const saveUser = async () => {
  try {
    loading.value = true;

    // Gọi API users/[id].patch.js để cập nhật thông tin người dùng
    await $fetch(`/api/users/${editingUser.value.id}`, {
      method: 'PATCH',
      body: {
        fullname: editingUser.value.fullname,
        birthdate: editingUser.value.birthdate,
        tokens: parseInt(editingUser.value.tokens) || 0
      }
    });

    // Làm mới danh sách người dùng
    await fetchUsers();
    showEditModal.value = false;
  } catch (err) {
    console.error('Lỗi khi lưu thay đổi:', err);
    alert('Lỗi khi lưu thay đổi: ' + (err.message || 'Lỗi không xác định'));
  } finally {
    loading.value = false;
  }
};

// Delete user
const deleteUser = async (userId) => {
  if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

  try {
    loading.value = true;
    // Giả sử có API DELETE, bạn có thể cần tạo API này
    await $fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    });
    await fetchUsers(); // Làm mới danh sách
  } catch (err) {
    console.error('Lỗi khi xóa người dùng:', err);
    alert('Lỗi khi xóa người dùng: ' + (err.message || 'Lỗi không xác định'));
  } finally {
    loading.value = false;
  }
};

// Initial fetch
onMounted(() => {
  fetchUsers();
});
</script>