<template>
  <div class="container mx-auto">
    <!-- Các phần khác của index.vue -->
    <ChildNumerology />
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue';
import ChildNumerology from '~/components/ChildNumerology.vue';

definePageMeta({
  layout: 'view'
});

// Thiết lập SEO với useHead
useHead({
  title: 'Thần Số Học Trẻ Em - Phân Tích và Tư Vấn Cho Trẻ',
  meta: [
    { name: 'description', content: 'Khám phá thần số học trẻ em để hiểu tính cách, tiềm năng và định hướng phát triển cho con bạn. Nhận tư vấn chi tiết dựa trên ngày sinh và tên.' },
    { name: 'keywords', content: 'thần số học trẻ em, phân tích thần số học cho trẻ, tư vấn thần số học trẻ em, con số chủ đạo trẻ em, định hướng phát triển trẻ' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Thần Số Học Trẻ Em - Hiểu Biết và Phát Triển Tiềm Năng' },
    { property: 'og:description', content: 'Tìm hiểu tiềm năng và tính cách của trẻ qua thần số học. Nhập ngày sinh và tên để nhận phân tích chi tiết.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://luangiathanso.com/xem/than-so-hoc-tre-em' },
  ],
  link: [
    { rel: 'canonical', href: 'https://luangiathanso.com/xem/than-so-hoc-tre-em' },
  ],
});
</script>