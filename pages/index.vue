<template>
  <div>
    <WelcomeScreen v-if="!username" :set-username="setUsername" />
    <MainScreen v-else />
  </div>
</template>

<script setup>
import WelcomeScreen from '~/components/WelcomeScreen.vue'
import MainScreen from '~/components/MainScreen.vue'

const username = ref(null)

// Chỉ chạy localStorage ở phía client
if (process.client) {
  username.value = localStorage.getItem('username')
}

// Hàm để cập nhật username
function setUsername(newUsername) {
  username.value = newUsername
  if (process.client) {
    localStorage.setItem('username', newUsername)
  }
}
</script>