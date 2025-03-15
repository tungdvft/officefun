<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <Header />

    <!-- Main content -->
    <main class="flex-1">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue'
</script>