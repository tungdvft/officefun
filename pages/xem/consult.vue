<template>
  <div class="container mx-auto">
    <!-- Các phần khác của index.vue -->
    <ConsultNumerology />
  </div>
</template>

<script setup>
import ConsultNumerology from '~/components/ConsultNumerology.vue';
definePageMeta({
  layout: 'view'
});
</script>