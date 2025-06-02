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
    },
    setMbtiAnswer(questionIndex, answer) {
      this.mbtiAnswers[questionIndex] = answer;
    },
    completeDisc() {
      console.log('DISC completed'); // Debug
      this.discCompleted = true;
    },
    completeMbti() {
      console.log('MBTI completed'); // Debug
      this.mbtiCompleted = true;
    },
    resetDisc() {
      this.discAnswers = {};
      this.discCompleted = false;
    },
    resetMbti() {
      this.mbtiAnswers = {};
      this.mbtiCompleted = false;
    },
  },
});