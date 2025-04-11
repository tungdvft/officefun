<template>
  <section class="mb-16">
    <div class="container mx-auto">
      <h2 class="text-3xl font-bold text-center mb-8 text-purple-800">Bài Viết Mới Nhất</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Render 3 bài viết đầu tiên -->
        <article 
          v-for="(article, index) in latestArticles" 
          :key="index"
          class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300"
        >
          <img 
            :src="article.image" 
            :alt="article.alt" 
            class="w-full h-48 object-cover"
          >
          <div class="p-6">
            <span class="text-sm text-purple-600">Thần Số Học</span>
            <h3 class="text-xl font-bold mt-2 mb-3 text-gray-800">{{ article.title }}</h3>
            <p class="text-gray-600 mb-4">{{ article.excerpt }}</p>
            <nuxt-link 
              :to="`/blog/${article.slug}`" 
              class="text-purple-600 font-medium hover:text-purple-800"
            >
              Đọc tiếp →
            </nuxt-link>
          </div>
        </article>
      </div>
      
      <div class="text-center mt-8">
        <nuxt-link 
          to="/blog" 
          class="inline-block bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          Xem Tất Cả Bài Viết <i class="fas fa-arrow-right ml-2"></i>
        </nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
import articles from '@/data/articles.js'

export default {
  data() {
    return {
      articles: articles
    }
  },
  computed: {
    latestArticles() {
      // Lấy 3 bài viết đầu tiên
      return this.articles.slice(0, 3)
    }
  }
}
</script>