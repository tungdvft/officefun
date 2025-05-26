export default defineNuxtConfig({
  compatibilityDate: '2024-11-25',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@pinia/nuxt', 'nuxt-gtag'],
  gtag: {
    id: 'G-8DV4NBC25C',
    config: {
      send_page_view: true,
      debug_mode: process.env.NODE_ENV !== 'production',
    },
  },
  runtimeConfig: {
    public: {
      // gaPropertyId: 'G-8DV4NBC25C', // Không cần vì đã có gtag.id
    },
  },
  components: true,
  hooks: {
    'pages:extend'(pages) {
      const host = process.server
        ? useRequestHeaders()['host']
        : process.client
          ? window.location.host
          : '';
      if (host && host.startsWith('dashboard.')) {
        pages.forEach((page) => {
          if (page.path.startsWith('/dashboard')) {
            page.path = page.path.replace('/dashboard', '');
          }
        });
      }
    },
  },
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      title: 'Luận giải thần số học - Ứng dụng cá nhân hoá, tương tác trực quan',
      meta: [
        {
          name: 'description',
          content:
            'Khám phá thần số học với ứng dụng cá nhân hoá, cung cấp luận giải chi tiết và tương tác trực quan.',
        },
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
  nitro: {
    preset: 'node-server', // Đảm bảo chạy trên Node.js server
    serveStatic: true, // Phục vụ file tĩnh
    devServer: {
      watch: ['~/data/**/*'], // Theo dõi thay đổi file JSON
    },
  },
  vite: {
    server: {
      host: '0.0.0.0', // Dùng cho dev mode
      port: parseInt(process.env.PORT || '3000'), // Dùng PORT từ env
    },
  },
});