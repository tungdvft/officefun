import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    fullname: "",
    birthdate: "",
    numerologyData: null,
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchNumerology({ fullname, birthdate }) {
      this.isLoading = true;
      this.error = null;
      this.numerologyData = null;

      try {
        // Lưu thông tin người dùng
        this.fullname = fullname;
        this.birthdate = birthdate;

        // Gọi API
        const response = await fetch("/api/overview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fullname.trim(),
            birthDate: birthdate.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error(`API trả về lỗi: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        if (data) {
          this.numerologyData = data;
        } else {
          throw new Error("Response rỗng hoặc không hợp lệ");
        }
      } catch (err) {
        this.error = err.message || "Có lỗi xảy ra khi gọi API. Vui lòng thử lại.";
        console.error("Lỗi:", err);
      } finally {
        this.isLoading = false;
      }
    },
    clearUserInfo() {
      this.fullname = "";
      this.birthdate = "";
      this.numerologyData = null;
      this.error = null;
    },
  },
});