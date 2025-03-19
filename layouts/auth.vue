<template>
  <div class="min-h-screen bg-gray-100">
    <slot />
  </div>
</template>

<script setup>
// Không áp dụng middleware auth cho layout này
definePageMeta({
  middleware: [], // Không yêu cầu middleware
});
</script>