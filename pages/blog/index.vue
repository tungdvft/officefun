<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-50 to-white">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6"><span class="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent" data-v-0d994878="">Khám phá</span> thế giới thần số học</h1>
        <p class="text-xl max-w-2xl mx-auto mb-8 opacity-90">
          Các bài viết chuyên sâu giúp bạn hiểu rõ về bản thân và vận mệnh thông qua những con số
        </p>
        <!-- <div class="max-w-md mx-auto relative">
          <input 
            type="text" 
            placeholder="Tìm kiếm bài viết..." 
            class="w-full py-3 px-6 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
          <button class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div> -->
      </div>
    </section>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-16">
      <!-- Featured Post -->
      <div class="mb-16 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <img 
          :src="articles[0].image" 
          :alt="articles[0].alt" 
          class="w-full h-64 md:h-80 object-cover"
        >
        <div class="p-6 md:p-8">
          <div class="flex items-center mb-4">
            <span class="bg-purple-100 text-purple-900 text-xs font-semibold px-3 py-1 rounded-full">NỔI BẬT</span>
            <span class="ml-4 text-gray-500 text-sm">Bài viết mới nhất</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-purple-900 mb-4">
            <NuxtLink :to="`/blog/${articles[0].slug}`" class="hover:text-purple-600 transition-colors">
              {{ articles[0].title }}
            </NuxtLink>
          </h2>
          <p class="text-gray-700 mb-6">
            {{ articles[0].excerpt }}
          </p>
          <NuxtLink 
            :to="`/blog/${articles[0].slug}`"
            class="inline-flex items-center text-purple-600 font-medium hover:text-purple-900"
          >
            Đọc tiếp
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Posts -->
      <h2 class="text-2xl font-bold text-purple-900 mb-8 pb-4 border-b border-purple-100">Tất Cả Bài Viết</h2>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Render các bài viết từ thứ 2 trở đi -->
        <article 
          v-for="(article, index) in articles.slice(1)" 
          :key="article.id"
          class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <NuxtLink :to="`/blog/${article.slug}`">
            <img 
              :src="article.image" 
              :alt="article.alt" 
              class="w-full h-48 object-cover"
            >
          </NuxtLink>
          <div class="p-6">
            <div class="flex items-center mb-3">
              <span class="text-purple-600 text-sm font-medium">THẦN SỐ HỌC</span>
              <span class="mx-2 text-gray-300">•</span>
              <span class="text-gray-500 text-sm">Bài {{ index + 2 }}</span>
            </div>
            <h3 class="text-xl font-bold text-purple-900 mb-3">
              <NuxtLink :to="`/blog/${article.slug}`" class="hover:text-purple-600 transition-colors">
                {{ article.title }}
              </NuxtLink>
            </h3>
            <p class="text-gray-600 mb-4 line-clamp-2">
              {{ article.excerpt }}
            </p>
            <NuxtLink 
              :to="`/blog/${article.slug}`"
              class="inline-flex items-center text-purple-600 text-sm font-medium hover:text-purple-900"
            >
              Đọc tiếp
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup>
import articles from '@/data/articles.js'

// Sắp xếp bài viết mới nhất lên đầu (nếu cần)
const sortedArticles = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date))
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>