import messaging from 'utility/messaging';

class ExtensionBackground {
  constructor() {

    chrome.browserAction.onClicked.addListener(() => this.onBrowserAction());
    messaging.addMessageHandlers({
      'test': (payload) => this.notify(payload)
    });
  }

  onBrowserAction() {
    this.notify('Hey!');
  }

  notify(msg) {
    chrome.notifications.getAll((old) => {
      Object.keys(old).forEach((id) => {
        chrome.notifications.clear(id);
      });
    });

    chrome.notifications.create(null, {
      type: 'basic',
      title: 'Test Extension',
      message: msg,
      iconUrl: chrome.runtime.getURL('res/icon48.png')
    }, (id) => setTimeout(() => chrome.notifications.clear(id), 5000));
  }
}

window.app = new ExtensionBackground();
export default window.app;
