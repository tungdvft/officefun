<template>
  <div class="container mx-auto">
    <!-- Các phần khác của index.vue -->
    <CompatibilityForm />
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue';
import CompatibilityForm from '~/components/CompatibilityForm.vue';

definePageMeta({
  layout: 'view'
});

// Thiết lập SEO với useHead
useHead({
  title: 'Kiểm Tra Hợp Nhau - Thần Số Học Luận Giải Vợ Chồng, Người Yêu, Đối Tác',
  meta: [
    { name: 'description', content: 'Kiểm tra mức độ hợp nhau giữa vợ chồng, người yêu, hoặc đối tác dựa trên thần số học. Nhập ngày sinh và tên để nhận phân tích chi tiết về sự hòa hợp.' },
    { name: 'keywords', content: 'kiểm tra hợp nhau, kiểm tra hợp nhau vợ chồng, kiểm tra hợp nhau người yêu, kiểm tra hợp nhau đối tác, thần số học, luận giải hợp nhau' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Kiểm Tra Hợp Nhau - Thần Số Học cho Vợ Chồng, Người Yêu, Đối Tác' },
    { property: 'og:description', content: 'Tìm hiểu mức độ hòa hợp giữa bạn và vợ chồng, người yêu, hoặc đối tác qua phân tích thần số học chi tiết.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://luangiaithanso.com/xem/kiem-tra-hop-nhau' },
  
  ],
  link: [
    { rel: 'canonical', href: 'https://luangiaithanso.com/xem/kiem-tra-hop-nhau' },
  ],
});
</script>