<template>
  <div class="container mx-auto">
    <!-- Các phần khác của index.vue -->
    <CareerGuidance />
  </div>
</template>

<script setup>
import CareerGuidance from '~/components/CareerGuidance.vue';
import { useHead } from '@unhead/vue';

definePageMeta({
  layout: 'view'
});

// Thiết lập SEO với useHead
useHead({
  title: 'Hướng Dẫn Nghề Nghiệp Thần Số Học - Luận Giải Thần Số Học',
  meta: [
    { name: 'description', content: 'Khám phá định hướng nghề nghiệp phù hợp dựa trên thần số học với ngày sinh và thông tin cá nhân. Tra cứu và luận giải thần số học tại luangiathanso.com.' },
    { name: 'keywords', content: 'thần số học, tra cứu thần số học, luận giải thần số học, hướng dẫn nghề nghiệp, con số chủ đạo, ý nghĩa ngày sinh' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Hướng Dẫn Nghề Nghiệp Thần Số Học - Luận Giải Thần Số Học' },
    { property: 'og:description', content: 'Nhập ngày sinh và thông tin để nhận hướng dẫn nghề nghiệp theo thần số học và khám phá phân tích chi tiết tại luangiathanso.com.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://luangiathanso.com/xem/dinh-huong-nghe-nghiep' },
  ],
  link: [
    { rel: 'canonical', href: 'https://luangiathanso.com/xem/dinh-huong-nghe-nghiep' },
  ],
});
</script>