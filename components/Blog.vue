<template>
  <section class="py-16 cosmic-bg">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <span class="inline-block px-4 py-1 bg-purple-100 text-purple-900 rounded-full text-sm font-semibold mb-4">BÀI VIẾT MỚI NHẤT</span>
        <h2 class="text-3xl md:text-4xl font-bold text-purple-900">
           <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Kiến Thức</span> Nền Tảng Trong Thần Số Học
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto mt-4">
          Các bài viết hữu ích để bạn nắm được những thông tin cơ bản trước khi tìm hiểu sâu hơn.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
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
              class="text-purple-600 font-medium hover:text-purple-900"
            >
              Đọc tiếp →
            </nuxt-link>
          </div>
        </article>
      </div>
      
      <div class="text-center mt-8">
        <nuxt-link 
          to="/blog" 
          class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 animate-pulse-once shadow-md"
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