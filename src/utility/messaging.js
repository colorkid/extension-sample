// Provides simple promise-based wrapper over browser native message system

export class Messaging {
  constructor(context) {
    this.context = context || 'default';
    this.messageHandlers = {};
    this.subscribeToMessages();
  }

  sendToTab(tab, msg) {
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, msg, resolve);
    });
  }

  sendToExtension(msg) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(msg, resolve);
    });
  }

  setContext(v) {
    this.context = v;
  }

  addMessageHandlers(handlers) {
    Object.keys(handlers).forEach((msg) => {
      this.messageHandlers[msg] = handlers[msg];
    });
  }

  removeMessageHandler(key) {
    delete this.messageHandlers[key];
  }

  subscribeToMessages() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (!message.name) {
        sendResponse(`Invalid message: ${JSON.stringify(message)}`);
      } else if (!this.messageHandlers[message.name]) {
        sendResponse(`Handler not registered for ${message.name}`);
      } else {
        Promise.resolve(this.messageHandlers[message.name](message.payload, sender.tab))
          .then((result) => {
            sendResponse(result, null);
          })
          .catch((error) => {
            sendResponse(null, error.message || error);
          });
      }
    });
  }
}

export default new Messaging();
