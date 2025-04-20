<template>
  <div class="container mx-auto">
    <!-- Các phần khác của index.vue -->
    <BabyName />
  </div>
</template>

<script setup>
import BabyName from '~/components/BabyName.vue';
definePageMeta({
  layout: 'view'
});
</script>