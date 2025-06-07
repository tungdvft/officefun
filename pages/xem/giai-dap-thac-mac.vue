<template>
  <div class="container mx-auto">
    <!-- Các phần khác của index.vue -->
    <ConsultNumerology />
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue';
import ConsultNumerology from '~/components/ConsultNumerology.vue';

definePageMeta({
  layout: 'view',
  middleware: ['auth']
});

// Thiết lập SEO với useHead
useHead({
  title: 'Giải Đáp Thắc Mắc Thần Số Học - Tư Vấn và Hỏi Đáp Chi Tiết',
  meta: [
    { name: 'description', content: 'Giải đáp mọi thắc mắc về thần số học, từ con số chủ đạo đến ý nghĩa các chỉ số. Nhận tư vấn chi tiết để hiểu rõ hơn về bản thân qua hỏi đáp thần số học.' },
    { name: 'keywords', content: 'giải đáp thắc mắc thần số học, tư vấn thần số học, hỏi đáp thần số học, ý nghĩa con số chủ đạo, thần số học chi tiết' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Giải Đáp Thắc Mắc Thần Số Học - Tư Vấn Chi Tiết' },
    { property: 'og:description', content: 'Tìm hiểu ý nghĩa thần số học và nhận giải đáp chi tiết cho mọi thắc mắc của bạn qua dịch vụ tư vấn chuyên sâu.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://luangiaithanso.com/xem/giai-dap-thac-mac' },
  
  ],
  link: [
    { rel: 'canonical', href: 'https://luangiaithanso.com/xem/giai-dap-thac-mac' },
  ],
});
</script>