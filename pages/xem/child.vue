<template>
  <div class="container mx-auto">
    <!-- Các phần khác của index.vue -->
    <ChildNumerology />
  </div>
</template>

<script setup>
import ChildNumerology from '~/components/ChildNumerology.vue';
definePageMeta({
  layout: 'dashboard'
});
</script>