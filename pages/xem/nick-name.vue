<template>
  <div class="container mx-auto">
    <!-- Các phần khác của index.vue -->
    <NicknameGenerator />
  </div>
</template>

<script setup>
import NicknameGenerator from '~/components/NicknameGenerator.vue';
definePageMeta({
  layout: 'view'
});
</script>
