<template>
  <div>
    <NumerologyBrandName />
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue';
import NumerologyBrandName from '~/components/NumerologyBrandName.vue';

definePageMeta({
  layout: 'view',
  middleware: ['auth']
});

// Thiết lập SEO với useHead
useHead({
  title: 'Đặt Tên Thương Hiệu Theo Thần Số Học - Tư Vấn Tên Thương Hiệu Ý Nghĩa',
  meta: [
    { name: 'description', content: 'Đặt tên thương hiệu ý nghĩa với thần số học. Nhận tư vấn chuyên sâu để chọn tên thương hiệu phù hợp, mang lại may mắn và thành công.' },
    { name: 'keywords', content: 'đặt tên thương hiệu, đặt tên thương hiệu theo thần số học, tư vấn đặt tên thương hiệu, tên thương hiệu ý nghĩa, thần số học doanh nghiệp' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Đặt Tên Thương Hiệu Theo Thần Số Học - Tên Ý Nghĩa, Thành Công' },
    { property: 'og:description', content: 'Khám phá cách đặt tên thương hiệu dựa trên thần số học để mang lại may mắn và thịnh vượng cho doanh nghiệp của bạn.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://luangiaithanso.com/xem/ten-thuong-hieu' },
  ],
  link: [
    { rel: 'canonical', href: 'https://luangiaithanso.com/xem/ten-thuong-hieu' },
  ],
});
</script>