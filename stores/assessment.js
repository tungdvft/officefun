
import { defineStore } from 'pinia';

export const useAssessmentStore = defineStore('assessment', {
  state: () => ({
    discAnswers: {},
    mbtiAnswers: {},
    discCompleted: false,
    mbtiCompleted: false,
  }),
  actions: {
    setDiscAnswer(questionIndex, answer) {
      this.discAnswers[questionIndex] = answer;
      if (process.client) {
        try {
          localStorage.setItem('discAnswers', JSON.stringify(this.discAnswers));
          console.log('Saved discAnswers to localStorage:', this.discAnswers);
        } catch (error) {
          console.error('Error saving discAnswers to localStorage:', error);
        }
      }
    },
    setMbtiAnswer(questionIndex, answer) {
      this.mbtiAnswers[questionIndex] = answer;
      if (process.client) {
        try {
          localStorage.setItem('mbtiAnswers', JSON.stringify(this.mbtiAnswers));
          console.log('Saved mbtiAnswers to localStorage:', this.mbtiAnswers);
        } catch (error) {
          console.error('Error saving mbtiAnswers to localStorage:', error);
        }
      }
    },
    completeDisc() {
      console.log('DISC completed');
      this.discCompleted = true;
      if (process.client) {
        try {
          localStorage.setItem('discCompleted', 'true');
          console.log('Saved discCompleted to localStorage:', this.discCompleted);
        } catch (error) {
          console.error('Error saving discCompleted to localStorage:', error);
        }
      }
    },
    completeMbti() {
      console.log('MBTI completed');
      this.mbtiCompleted = true;
      if (process.client) {
        try {
          localStorage.setItem('mbtiCompleted', 'true');
          console.log('Saved mbtiCompleted to localStorage:', this.mbtiCompleted);
        } catch (error) {
          console.error('Error saving mbtiCompleted to localStorage:', error);
        }
      }
    },
    resetDisc() {
      this.discAnswers = {};
      this.discCompleted = false;
      if (process.client) {
        try {
          localStorage.removeItem('discAnswers');
          localStorage.removeItem('discCompleted');
          console.log('Cleared DISC data from localStorage');
        } catch (error) {
          console.error('Error clearing DISC data from localStorage:', error);
        }
      }
    },
    resetMbti() {
      this.mbtiAnswers = {};
      this.mbtiCompleted = false;
      if (process.client) {
        try {
          localStorage.removeItem('mbtiAnswers');
          localStorage.removeItem('mbtiCompleted');
          console.log('Cleared MBTI data from localStorage');
        } catch (error) {
          console.error('Error clearing MBTI data from localStorage:', error);
        }
      }
    },
    loadFromLocalStorage() {
      if (process.client) {
        try {
          const savedDiscAnswers = localStorage.getItem('discAnswers');
          const savedDiscCompleted = localStorage.getItem('discCompleted');
          const savedMbtiAnswers = localStorage.getItem('mbtiAnswers');
          const savedMbtiCompleted = localStorage.getItem('mbtiCompleted');

          if (savedDiscAnswers) {
            this.discAnswers = JSON.parse(savedDiscAnswers);
            console.log('Loaded discAnswers from localStorage:', this.discAnswers);
          }
          if (savedDiscCompleted === 'true') {
            this.discCompleted = true;
            console.log('Loaded discCompleted from localStorage:', this.discCompleted);
          }
          if (savedMbtiAnswers) {
            this.mbtiAnswers = JSON.parse(savedMbtiAnswers);
            console.log('Loaded mbtiAnswers from localStorage:', this.mbtiAnswers);
          }
          if (savedMbtiCompleted === 'true') {
            this.mbtiCompleted = true;
            console.log('Loaded mbtiCompleted from localStorage:', this.mbtiCompleted);
          }
        } catch (error) {
          console.error('Error loading from localStorage:', error);
        }
      }
    },
  },
});
