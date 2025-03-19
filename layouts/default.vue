<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
// Header script như trên
</script>

<style scoped>
/* Không cần CSS vì đã dùng Tailwind */
</style>