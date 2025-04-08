import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  const { name, birthDate } = await readBody(event);

  if (!name || !birthDate) {
    throw createError({ statusCode: 400, statusMessage: 'Thiếu thông tin: name và birthDate là bắt buộc.' });
  }

  // Gọi 5 API song song
  const [coreResult, innerResult, timeResult, fateResult, growthResult] = await Promise.all([
    $fetch('/api/overview/core-numbers', { method: 'POST', body: { name, birthDate } }),
    $fetch('/api/overview/inner-numbers', { method: 'POST', body: { name, birthDate } }),
    $fetch('/api/overview/time-numbers', { method: 'POST', body: { name, birthDate } }),
    $fetch('/api/overview/fate-numbers', { method: 'POST', body: { name, birthDate } }),
    $fetch('/api/overview/growth-numbers', { method: 'POST', body: { name, birthDate } })
  ]);

  // Tổng hợp kết quả
  const numbers = {
    ...coreResult.numbers,
    ...innerResult.numbers,
    ...timeResult.numbers,
    ...fateResult.numbers,
    ...growthResult.numbers
  };
  const interpretations = {
    ...coreResult.interpretations,
    ...innerResult.interpretations,
    ...timeResult.interpretations,
    ...fateResult.interpretations,
    ...growthResult.interpretations
  };
  const overview = growthResult.overview;

  return {
    numerology: {
      name,
      birthDate,
      profile: {
        numbers,
        interpretations,
        overview
      }
    },
    meta: {
      processedIn: `${Date.now() - startTime}ms`,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
      source: 'xai-grok'
    }
  };
});