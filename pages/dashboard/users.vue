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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span class="text-purple-600 font-medium">{{ user.displayName?.charAt(0) || 'U' }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.displayName || 'Chưa có tên' }}</div>
                    <div class="text-sm text-gray-500">{{ user.profession || '-' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.email || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="user.isPremium" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Premium
                </span>
                <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                  Thường
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ userTokens[user.id]?.balance || 0 }} tokens
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
              <label class="block text-sm font-medium text-gray-700">Tên hiển thị</label>
              <input v-model="editingUser.displayName" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input v-model="editingUser.email" type="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tokens</label>
              <input v-model="editingUser.tokenBalance" type="number" min="0" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
            </div>
            <div>
              <label class="flex items-center">
                <input v-model="editingUser.isPremium" type="checkbox" class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded">
                <span class="ml-2 text-sm text-gray-700">Tài khoản Premium</span>
              </label>
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
definePageMeta({
  layout: 'dashboard'
})

const users = ref([])
const userTokens = ref({})
const showEditModal = ref(false)
const loading = ref(true)
const error = ref(null)

const editingUser = ref({
  id: '',
  displayName: '',
  email: '',
  isPremium: false,
  tokenBalance: 0
})

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1
})
const fetchUserTokens = async (userId) => {
  try {
    const tokenInfo = await $fetch(`/api/token`, {
      query: { userId },
      // Thêm retry logic nếu cần
      retry: 3,
      retryDelay: 1000
    })
    return tokenInfo || { balance: 1000 }
  } catch (error) {
    console.error(`Error fetching tokens for user ${userId}:`, error)
    return { balance: 1000 } // Trả về giá trị mặc định nếu có lỗi
  }
}
// Fetch users and their tokens
const fetchUsers = async () => {
  try {
    loading.value = true
    error.value = null
    
    // 1. Fetch users with pagination
    const usersResponse = await $fetch(`/api/user?page=${pagination.value.page}&limit=${pagination.value.limit}`)
    
    if (usersResponse && usersResponse.data) {
      users.value = Array.isArray(usersResponse.data) ? usersResponse.data : []
      
      // Update pagination info
      if (usersResponse.pagination) {
        pagination.value = {
          page: usersResponse.pagination.page,
          limit: usersResponse.pagination.limit,
          total: usersResponse.pagination.total,
          totalPages: usersResponse.pagination.totalPages
        }
      }
      
      // 2. Fetch tokens for each user - sử dụng Promise.allSettled để xử lý lỗi từng request
      const tokenPromises = users.value.map(user => fetchUserTokens(user.id))
      const tokensResults = await Promise.allSettled(tokenPromises)
      
      const tokensMap = {}
      tokensResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          tokensMap[users.value[index].id] = result.value
        } else {
          console.error('Error fetching token:', result.reason)
          tokensMap[users.value[index].id] = { balance: 1000 } // Giá trị mặc định
        }
      })
      
      userTokens.value = tokensMap
    } else {
      users.value = []
      userTokens.value = {}
    }
  } catch (err) {
    console.error('Failed to fetch users:', err)
    error.value = err.message || 'Failed to load users'
    users.value = []
    userTokens.value = {}
  } finally {
    loading.value = false
  }
}

// Pagination controls
const prevPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--
    fetchUsers()
  }
}

const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++
    fetchUsers()
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    fetchUsers()
  }
}

// Edit user
const editUser = (user) => {
  editingUser.value = {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    isPremium: Boolean(user.isPremium), // Convert to boolean
    tokenBalance: userTokens.value[user.id]?.balance || 0
  }
  showEditModal.value = true
}
// Save user changes
const saveUser = async () => {
  try {
    loading.value = true
    
    // Update user info
    await $fetch(`/api/user/${editingUser.value.id}`, {
      method: 'PUT',
      body: {
        displayName: editingUser.value.displayName,
        email: editingUser.value.email,
        isPremium: editingUser.value.isPremium ? 1 : 0 // Convert to number
      }
    })
    
    // Update token balance
    await $fetch(`/api/token/${editingUser.value.id}`, {
      method: 'PUT',
      body: {
        balance: parseInt(editingUser.value.tokenBalance) || 0
      }
    })
    
    // Refresh data
    await fetchUsers()
    showEditModal.value = false
  } catch (err) {
    console.error('Failed to save user:', err)
    alert('Lỗi khi lưu thay đổi: ' + (err.message || 'Lỗi không xác định'))
  } finally {
    loading.value = false
  }
}

// Delete user
const deleteUser = async (userId) => {
  if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return
  
  try {
    loading.value = true
    await $fetch(`/api/user/${userId}`, { method: 'DELETE' })
    await fetchUsers() // Refresh the list
  } catch (err) {
    console.error('Failed to delete user:', err)
    alert('Lỗi khi xóa người dùng: ' + (err.message || 'Lỗi không xác định'))
  } finally {
    loading.value = false
  }
}

// Initial fetch
onMounted(() => {
  fetchUsers()
})
</script>