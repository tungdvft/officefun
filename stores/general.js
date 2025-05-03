import { defineStore } from 'pinia';

export const useGeneralStore = defineStore('general', {
  state: () => ({
    fullname: '',
    birthdate: '',
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchNumerology({ fullname, birthdate }) {
      this.isLoading = true;
      this.error = null;

      try {
        // Validate inputs
        if (!fullname || !birthdate) {
          throw new Error('Vui lòng nhập đầy đủ họ tên và ngày sinh!');
        }

        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthdate)) {
          throw new Error('Ngày sinh không đúng định dạng (DD/MM/YYYY)!');
        }

        const [day, month, year] = birthdate.split('/').map(Number);
        const dateObj = new Date(year, month - 1, day);
        if (
          dateObj.getDate() !== day ||
          dateObj.getMonth() + 1 !== month ||
          year < 1900 ||
          year > 2025
        ) {
          throw new Error('Ngày sinh không hợp lệ!');
        }

        // Store the data
        this.fullname = fullname;
        this.birthdate = birthdate;

        // Simulate an API call or processing (replace with actual logic if needed)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err) {
        this.error = err.message;
        throw err; // Rethrow to handle in component
      } finally {
        this.isLoading = false;
      }
    },

    clearData() {
      this.fullname = '';
      this.birthdate = '';
      this.error = null;
      this.isLoading = false;
    },
  },

  getters: {
    hasData: (state) => !!state.fullname && !!state.birthdate,
  },
});