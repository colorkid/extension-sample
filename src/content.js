import messaging from 'utility/messaging';

// TODO create div, inject results
// messaging.addMessageHandlers({
//   'showResults': (results) => { ... }
// });

const DOMLoaded = () => {
  return new Promise((resolve) => {
    if (document.readyState === 'complete'
      || document.readyState === 'loaded'
      || document.readyState === 'interactive') {
      resolve();
    } else {
      window.addEventListener('DOMContentLoaded', resolve);
    }
  });
};

DOMLoaded().then(() => {
  // TODO disable for production
  messaging.sendToExtension({ name: 'test', payload: `Content loaded for ${document.title}` });
});