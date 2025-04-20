<!-- pages/dashboard/index.vue -->
<template>
  <div class="container mx-auto">
  
    <SuccessMap />
  </div>
</template>

<script setup>
import SuccessMap from '~/components/SuccessMap.vue';
definePageMeta({
  layout: 'view'
});
</script>