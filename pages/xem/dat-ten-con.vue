<template>
  <div>
    <BabyNameGenerator />
  </div>
</template>

<script setup>
import BabyNameGenerator from '~/components/BabyNameGenerator.vue';
import { useHead } from '@unhead/vue';

definePageMeta({
  layout: 'view',
  middleware: ['auth']
});

// Thiết lập SEO với useHead
useHead({
  title: 'Tạo Tên Bé Theo Thần Số Học - Luận Giải Thần Số Học',
  meta: [
    { name: 'description', content: 'Tạo tên cho bé ý nghĩa dựa trên thần số học với ngày sinh và thông tin cá nhân. Khám phá ý nghĩa con số chủ đạo, tra cứu và luận giải thần số học tại luangiathanso.com.' },
    { name: 'keywords', content: 'thần số học, tra cứu thần số học, luận giải thần số học, tạo tên cho bé, con số chủ đạo, ý nghĩa ngày sinh' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Tạo Tên Bé Theo Thần Số Học - Luận Giải Thần Số Học' },
    { property: 'og:description', content: 'Nhập ngày sinh và thông tin để tạo tên bé ý nghĩa theo thần số học và khám phá phân tích chi tiết tại luangiathanso.com.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://luangiathanso.com/xem/dat-ten-con' },
  ],
  link: [
    { rel: 'canonical', href: 'https://luangiathanso.com/xem/dat-ten-con' },
  ],
});
</script>