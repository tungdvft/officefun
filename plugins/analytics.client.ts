export default defineNuxtPlugin(() => {
  if (process.client) {
    window.gtag('event', 'test_event', {
      'event_category': 'debug',
      'event_label': 'Test GA4 connection'
    });
    console.log('GA4 Debug Event Sent');
  }
});