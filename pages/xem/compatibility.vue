<template>
  <div class="container mx-auto">
    <!-- Các phần khác của index.vue -->
    <CompatibilityForm />
  </div>
</template>

<script setup>
import CompatibilityForm from '~/components/CompatibilityForm.vue';
definePageMeta({
  layout: 'view'
});
</script>