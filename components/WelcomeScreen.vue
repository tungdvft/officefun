<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
    <form @submit.prevent="submitForm" class="bg-white p-8 rounded-xl shadow-lg w-96">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Welcome!</h1>
      
      <div class="mb-4">
        <input 
          v-model="form.username" 
          type="text" 
          placeholder="Username" 
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
      </div>

      <div class="mb-4">
        <input 
          v-model="form.birthdate" 
          type="date" 
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
      </div>

      <div class="mb-6">
        <select 
          v-model="form.profession" 
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Chọn ngành nghề</option>
          <option value="it">IT</option>
          <option value="marketing">Marketing</option>
          <option value="hr">HR</option>
        </select>
      </div>

      <button 
        type="submit" 
        class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
      >
        Bắt đầu
      </button>
    </form>
  </div>
</template>

<script setup>
const form = reactive({
  username: '',
  birthdate: '',
  profession: ''
})

const router = useRouter()

async function submitForm() {
    // Lưu vào localStorage
    if (process.client) {
        localStorage.setItem('username', form.username)
  }
  
  
  // Lưu vào SQLite
  await $fetch('/api/user', {
    method: 'POST',
    body: form
  })
  
}
</script>