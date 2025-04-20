export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@pinia/nuxt','nuxt-gtag'],
  gtag: {
    id: 'G-8DV4NBC25C',
     config: {
      send_page_view: true,
      debug_mode: true // Bật debug để xem log
    }
  },
  components: true,
  
  hooks: {
    'pages:extend'(pages) {
      const host = process.server ? useRequestHeaders()['host'] : process.client ? window.location.host : '';
      if (host && host.startsWith('dashboard.')) {
        pages.forEach(page => {
          if (page.path.startsWith('/dashboard')) {
            page.path = page.path.replace('/dashboard', '');
          }
        });
      }
    }
  },
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      title: 'AuraTrust - Ứng dụng thần số học cá nhân hoá, tương tác trực quan.', 
      meta: [
        {
          name: 'description', // Sửa lại thành 'description'
          content: 'AuraTrust - Ứng dụng thần số học cá nhân hoá, tương tác trực quan',
        },
      ],
    },
  },
 });