export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image'],
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
      title: 'Offitify - Ứng dụng bói tarot, thần số học cá nhân hoá, tương tác trực quan.', // Thêm thẻ title
      meta: [
        {
          name: 'description', // Sửa lại thành 'description'
          content: 'Offitify - Ứng dụng bói tarot, thần số học cá nhân hoá, tương tác trực quan.',
        },
      ],
    },
  },
  plugins: [{ src: '~/plugins/vue3-toastify.client.js', mode: 'client' },'~/plugins/fontawesome.js'],
});