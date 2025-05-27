<template>
  <div>
    <NumerologyRecommendation />
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue';
import NumerologyRecommendation from '~/components/NumerologyRecommendation.vue';

definePageMeta({
  layout: 'view'
});

// Thiết lập SEO với useHead
useHead({
  title: 'Thần Số Học Mỗi Ngày - Dự Đoán và Tư Vấn Hàng Ngày',
  meta: [
    { name: 'description', content: 'Khám phá dự đoán thần số học mỗi ngày để nhận tư vấn chi tiết, giúp bạn định hướng và tối ưu hóa cuộc sống dựa trên con số chủ đạo.' },
    { name: 'keywords', content: 'thần số học mỗi ngày, dự đoán thần số học hàng ngày, tư vấn thần số học hàng ngày, con số chủ đạo, thần số học' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Thần Số Học Mỗi Ngày - Dự Đoán Hàng Ngày' },
    { property: 'og:description', content: 'Nhận dự đoán và tư vấn thần số học mỗi ngày để hiểu rõ hơn về vận mệnh và cơ hội của bạn.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://luangiathanso.com/xem/than-so-hoc-moi-ngay' },
  ],
  link: [
    { rel: 'canonical', href: 'https://luangiathanso.com/xem/than-so-hoc-moi-ngay' },
  ],
});
</script>