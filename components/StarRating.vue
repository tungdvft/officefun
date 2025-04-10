<template>
  <div class="flex">
    <svg 
      v-for="i in 5" 
      :key="i" 
      :class="['w-5 h-5', i <= rating ? 'text-yellow-400' : 'text-gray-300']"
      viewBox="0 0 24 24"
    >
      <path 
        d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 Z"
        fill="currentColor"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    rating: {
      type: Number,
      required: true,
      validator: value => value >= 0 && value <= 5
    }
  }
}
</script>