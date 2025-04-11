<template>
  <div class="container mx-auto">
    <!-- Các phần khác của index.vue -->
    <WeddingDate />
  </div>
</template>

<script setup>
import WeddingDate from '~/components/WeddingDate.vue';
definePageMeta({
  layout: 'dashboard'
});
</script>
