<template>
  <div class="article-detail">
    <div class="container mx-auto py-12 px-4 max-w-4xl">
      <!-- Hiển thị bài viết chi tiết -->
      <article v-if="article">
        <h1 class="text-3xl font-bold text-purple-900 mb-6">{{ article.title }}</h1>
        <img :src="article.image" :alt="article.alt" class="w-full h-64 object-cover mb-8 rounded-lg">
        
        <div class="prose max-w-none" v-html="article.content"></div>
        
        <div class="mt-8 pt-6 border-t border-gray-200">
          <nuxt-link 
            to="/bai-viet" 
            class="text-purple-600 hover:text-purple-900 font-medium"
          >
            ← Quay lại danh sách bài viết
          </nuxt-link>
        </div>
      </article>
      
      <!-- Hiển thị khi không tìm thấy bài viết -->
      <div v-else class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-700 mb-4">Bài viết không tồn tại</h2>
        <nuxt-link 
          to="/bai-viet" 
          class="text-purple-600 hover:text-purple-900 font-medium"
        >
          Quay lại danh sách bài viết
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// Lấy danh sách bài viết - không cần .value vì import trực tiếp
import articles from '@/data/articles.js'

const route = useRoute()
const { slug } = route.params

// Tìm bài viết - articles là array thông thường, không phải ref
const article = articles.find(a => a.slug === slug)

if (!article) {
  throw createError({ 
    statusCode: 404, 
    statusMessage: 'Bài viết không tồn tại',
    fatal: true
  })
}

useHead({
  title: article.title,
  meta: [
    { name: 'description', content: article.excerpt }
  ]
})
</script>
<style>
/* Thêm các style cần thiết cho nội dung bài viết */
.prose h2 {
  @apply text-2xl font-bold text-purple-900 mb-4 mt-8;
}
.prose p {
  @apply mb-4;
}
.prose ul {
  @apply list-disc pl-6 mb-4 space-y-2;
}
</style>