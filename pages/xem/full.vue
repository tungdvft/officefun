<template>
  <div class="container mx-auto">
    <!-- Các phần khác của index.vue -->
    <NumerologyFullReport />
  </div>
</template>

<script setup>
import NumerologyFullReport from '~/components/NumerologyFullReport.vue';
definePageMeta({
  layout: 'dashboard'
});
</script>