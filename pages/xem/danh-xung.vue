<template>
  <div class="container mx-auto">
    <!-- Các phần khác của index.vue -->
    <NicknameGenerator />
  </div>
</template>

<script setup>
import NicknameGenerator from '~/components/NicknameGenerator.vue';
import { useHead } from '@unhead/vue';

definePageMeta({
  layout: 'view'
});

// Thiết lập SEO với useHead
useHead({
  title: 'Tạo Biệt Danh Thần Số Học - Luận Giải Thần Số Học',
  meta: [
    { name: 'description', content: 'Tạo biệt danh độc đáo dựa trên thần số học với ngày sinh và tên của bạn. Khám phá ý nghĩa con số chủ đạo, tra cứu và luận giải thần số học tại luangiathanso.com.' },
    { name: 'keywords', content: 'thần số học, tra cứu thần số học, luận giải thần số học, tạo biệt danh, con số chủ đạo, ý nghĩa ngày sinh' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Tạo Biệt Danh Thần Số Học - Luận Giải Thần Số Học' },
    { property: 'og:description', content: 'Nhập tên và ngày sinh để tạo biệt danh độc đáo và khám phá các phân tích thần số học chi tiết tại luangiathanso.com.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://luangiathanso.com/xem/danh-xung' },
  ],
  link: [
    { rel: 'canonical', href: 'https://luangiathanso.com/xem/danh-xung' },
  ],
});
</script>