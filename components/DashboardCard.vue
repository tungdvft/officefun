<template>
  <div 
    class="p-4 rounded-lg border" 
    :class="{
      'bg-blue-50 border-blue-100': color === 'blue',
      'bg-green-50 border-green-100': color === 'green',
      'bg-purple-50 border-purple-100': color === 'purple',
      'bg-amber-50 border-amber-100': color === 'amber'
    }"
  >
    <p 
      class="text-sm font-medium" 
      :class="{
        'text-blue-800': color === 'blue',
        'text-green-800': color === 'green',
        'text-purple-800': color === 'purple',
        'text-amber-800': color === 'amber'
      }"
    >
      {{ title }}
    </p>
    <p 
      class="text-2xl font-bold" 
      :class="{
        'text-blue-900': color === 'blue',
        'text-green-900': color === 'green',
        'text-purple-900': color === 'purple',
        'text-amber-900': color === 'amber'
      }"
    >
      {{ formattedValue }}
    </p>
    <p 
      v-if="change !== undefined" 
      class="text-xs mt-1" 
      :class="{
        'text-blue-600': color === 'blue',
        'text-green-600': color === 'green',
        'text-purple-600': color === 'purple',
        'text-amber-600': color === 'amber'
      }"
    >
      <template v-if="change >= 0">+</template>
      {{ change }}% so với kỳ trước
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  value: [Number, String],
  change: Number,
  isPercent: Boolean,
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'purple', 'amber'].includes(value)
  }
})

const formattedValue = computed(() => {
  if (props.isPercent) return `${props.value}%`
  return props.value?.toLocaleString() || '0'
})
</script>