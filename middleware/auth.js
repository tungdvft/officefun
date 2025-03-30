// middleware/auth.js
// export default defineNuxtRouteMiddleware((to, from) => {
//   // Lấy thông tin request headers để kiểm tra subdomain (server-side)
//   const host = process.server ? useRequestHeaders()['host'] : window.location.host;
//   const isDashboardSubdomain = host && host.startsWith('dashboard.');

//   // Kiểm tra username từ localStorage (client-side) hoặc cookie (server-side)
//   let username;
//   if (process.client) {
//     username = localStorage.getItem('username');
//   } else if (process.server) {
//     const cookie = useRequestHeaders()['cookie'];
//     username = cookie ? cookie.split('; ').find(row => row.startsWith('username=')).split('=')[1] : null;
//   }

//   // Danh sách route công khai không cần auth
//   const publicRoutes = ['/login', '/register', '/'];

//   // Kiểm tra nếu đích đến là /dashboard hoặc dùng subdomain dashboard
//   const isDashboardPath = to.path.startsWith('/dashboard') || isDashboardSubdomain;

//   // Nếu chưa đăng nhập và cố truy cập dashboard (path hoặc subdomain), redirect về /login
//   if (!username && isDashboardPath && !publicRoutes.includes(to.path)) {
//     return navigateTo('/login', { redirectCode: 302 });
//   }

//   // Nếu đã đăng nhập mà vào /login hoặc /register, redirect về dashboard
//   if (username && (to.path === '/login' || to.path === '/register')) {
//     return navigateTo('/dashboard', { redirectCode: 302 });
//   }
// });