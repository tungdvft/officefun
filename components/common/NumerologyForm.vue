<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="field in fields" :key="field.name" :class="field.colSpan">
        <label :for="field.name" class="block text-sm font-medium text-gray-700 mb-1">
          {{ field.label }}
        </label>
        <div class="relative">
          <input
            v-model="formData[field.name]"
            :id="field.name"
            :type="field.type || 'text'"
            :placeholder="field.placeholder || ''"
            :pattern="field.pattern"
            :title="field.title"
            :required="field.required !== false"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <div v-if="field.icon" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <component :is="field.icon" class="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
    <button
      type="submit"
      :disabled="isLoading"
      class="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
    >
      <svg
        v-if="isLoading"
        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {{ isLoading ? loadingText : submitText }}
    </button>
    <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
  </form>
</template>

<script>
import { UserIcon, CalendarIcon } from '@heroicons/vue/outline'

export default {
  name: 'DynamicForm',
  components: {
    UserIcon,
    CalendarIcon
  },
  props: {
    fields: {
      type: Array,
      default: () => [
        {
          name: 'name',
          label: 'Họ và tên',
          type: 'text',
          placeholder: 'Nguyễn Văn A',
          required: true,
          icon: 'UserIcon',
          colSpan: 'md:col-span-1'
        },
        {
          name: 'birthDate',
          label: 'Ngày sinh',
          type: 'text',
          placeholder: 'DD/MM/YYYY',
          pattern: '\\d{2}/\\d{2}/\\d{4}',
          title: 'Định dạng: DD/MM/YYYY (ví dụ: 20/05/1988)',
          required: true,
          icon: 'CalendarIcon',
          colSpan: 'md:col-span-1'
        }
      ]
    },
    initialData: {
      type: Object,
      default: () => ({})
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    submitText: {
      type: String,
      default: 'Xem kết quả'
    },
    loadingText: {
      type: String,
      default: 'Đang phân tích...'
    }
  },
  data() {
    return {
      formData: {}
    }
  },
  created() {
    // Khởi tạo form data từ props
    this.fields.forEach(field => {
      this.$set(this.formData, field.name, this.initialData[field.name] || '')
    })
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', { ...this.formData })
    }
  }
}
</script>