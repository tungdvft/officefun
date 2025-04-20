<template>
  <div class="container mx-auto">
    <!-- Các phần khác của index.vue -->
    <CompatibilityNumerology />
  </div>
</template>

<script setup>
import CompatibilityNumerology from '~/components/CompatibilityNumerology.vue';
definePageMeta({
  layout: 'view'
});
</script>