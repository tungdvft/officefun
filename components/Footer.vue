<template>
  <footer class="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <!-- Copyright -->
        <div class="text-center md:text-left">
          <p class="text-sm font-semibold">
            © {{ currentYear }} Offitify. All rights reserved.
          </p>
        </div>

        <!-- Social Links + Buy Me a Coffee -->
        <div class="flex space-x-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/10 hover:bg-blue-600 transition-all duration-300"
            aria-label="Facebook"
          >
            <svg class="w-5 h-5 text-gray-800 group-hover:text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M9.1 22v-9.8H6V9.3h3.1V6.7c0-3.1 1.9-4.7 4.6-4.7.9 0 1.8.2 2.7.5v3h-1.8c-1.5 0-1.8.7-1.8 1.8v2.3h3.6l-.5 2.9h-3.1V22H9.1z"
              />
            </svg>
          </a>
          <!-- <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/10 hover:bg-black transition-all duration-300"
            aria-label="X"
          >
            <svg class="w-5 h-5 text-gray-800 group-hover:text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M18.9 5.7c-.7.5-1.5.8-2.3 1A3.3 3.3 0 0013 4.6c-2 0-3.6 1.6-3.6 3.6 0 .3 0 .6.1.9-3-.2-5.7-1.6-7.5-3.8-.3.5-.5 1.1-.5 1.8 0 1.2.6 2.3 1.6 2.9-.6 0-1.2-.2-1.7-.5v.1c0 1.7 1.2 3.2 2.9 3.5-.3.1-.6.2-.9.2-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3 2.3-1.1.9-2.5 1.4-4 1.4H2c1.5 1 3.3 1.6 5.2 1.6 6.2 0 9.6-5.1 9.6-9.6v-.4c.7-.5 1.3-1.1 1.8-1.8-.7.3-1.4.5-2.2.6z"
              />
            </svg>
          </a>
          <a
            href="https://threads.net"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/10 hover:bg-gray-700 transition-all duration-300"
            aria-label="Threads"
          >
            <svg class="w-5 h-5 text-gray-800 group-hover:text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1.7 15.3c-1.6.4-3.2-.2-4.3-1.5-.6-.7-.9-1.6-.7-2.5.4-1.8 2.2-2.8 3.9-2.4 1 .2 1.8.9 2.2 1.8.3.8.2 1.7-.2 2.4-.5.9-1.4 1.5-2.4 1.7-.2 0-.3.1-.5.1zm-1-6.2c-2.2 0-4 1.8-4 4 0 1.2.5 2.3 1.4 3.1 1.2 1.1 2.8 1.5 4.4 1 1.6-.5 2.8-1.8 3.1-3.4.2-1.1-.1-2.2-.8-3.1-.8-1-2-1.6-3.7-1.6zm0-1.5c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5z"
              />
            </svg>
          </a> -->
          <a
            href="https://www.buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/10 hover:bg-yellow-500 transition-all duration-300"
            aria-label="Buy Me a Coffee"
          >
            <svg class="w-5 h-5 text-gray-800 group-hover:text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2C6.5 2 2 6.5 2 12c0 2.2.7 4.2 1.9 5.8-.2 1-.5 1.9-.5 2.9 0 1.7 1.4 3 3.1 3 1 0 1.9-.5 2.5-1.3 1.6.5 3.3.8 5.1.8 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.5-1.1l-.6.6c-.4.4-1 .7-1.6.7-.6 0-1.1-.5-1.1-1.1 0-.7.2-1.4.5-2.1l-.2-.3C3.5 15 3 13.6 3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9zm3-6h-6v-1h6v1zm0-2h-6v-1h6v1zm0-2h-6v-1h6v1z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
/* Không cần CSS vì đã dùng Tailwind */
</style>