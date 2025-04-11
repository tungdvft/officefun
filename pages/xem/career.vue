<template>
  <div class="container mx-auto">
    <!-- Các phần khác của index.vue -->
    <CareerGuidance />
  </div>
</template>

<script setup>
import CareerGuidance from '~/components/CareerGuidance.vue';
definePageMeta({
  layout: 'dashboard'
});
</script>