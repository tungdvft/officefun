<template>
  <div class="container mx-auto">
    <!-- Các phần khác của index.vue -->
    <WeddingDate />
  </div>
</template>

<script setup>
import WeddingDate from '~/components/WeddingDate.vue';
import { useHead } from '@unhead/vue';

definePageMeta({
  layout: 'view',
  middleware: ['auth']
});

// Thiết lập SEO với useHead
useHead({
  title: 'Chọn Ngày Cưới Thần Số Học - Luận Giải Thần Số Học',
  meta: [
    { name: 'description', content: 'Tìm ngày cưới lý tưởng dựa trên thần số học với ngày sinh của bạn. Khám phá ý nghĩa con số chủ đạo, tra cứu và luận giải thần số học tại luangiathanso.com.' },
    { name: 'keywords', content: 'thần số học, tra cứu thần số học, luận giải thần số học, chọn ngày cưới, con số chủ đạo, ý nghĩa ngày sinh' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Chọn Ngày Cưới Thần Số Học - Luận Giải Thần Số Học' },
    { property: 'og:description', content: 'Nhập ngày sinh để tìm ngày cưới phù hợp theo thần số học và khám phá các phân tích chi tiết tại luangiathanso.com.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://luangiathanso.com/xem/chon-ngay-cuoi' },
  ],
  link: [
    { rel: 'canonical', href: 'https://luangiathanso.com/xem/chon-ngay-cuoi' },
  ],
});
</script>