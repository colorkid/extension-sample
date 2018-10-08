import Model from './Model.js'

class Controller {
	
	constructor(DEFAULT_NUMBER_FILES, DEFAULT_TYPE_SORT) {
		if (window && window.top === window) {
			this.model = new Model(DEFAULT_TYPE_SORT, DEFAULT_NUMBER_FILES);
			this.startExtension();
			this.listenerMessages();
		}
	}

	startExtension() {
		chrome.extension.onMessage.addListener((msg, sender, sendResponse) => {
			if (msg.action == 'open_dialog_box') {
				let extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
				if (!location.ancestorOrigins.contains(extensionOrigin)) {
					if (document.querySelector("#downLoadImagesExtension")) {
						return;
					} else {
						this.initFrame();
						this.model.getNumberLinksFromStorage().then((numberFiles) => {
							this.model.setNumberFiles(numberFiles);
						});
						setTimeout(() => this.renderExtension(), 1000);
					}
				}
			}
		});
	}
 
	listenerMessages() {
		window.addEventListener("message", (event) => {
			switch (event.data.message) {
				case "clickOnCountRowsField":
					this.changeOnCountRowsField(event.data.numberFiles);
					break;
				case "clickOnDownloadButton":
					this.model.downloadFiles();
					break;
				case "clickOnCloseButton":
					this.closeExtension();
					break;
				default:
					return;
			}
		});
	}

	renderExtension() {
		this.iframe.contentWindow.postMessage({
			message: "renderExtension", 
			numberFiles: this.model.getNumberFiles(),
			numberDownload: this.model.getNumberDownload(),
			readyArr: this.model.getReadyArr()
		},"*");
	}

	changeOnCountRowsField(number) {
		this.model.setNumberFilesToStorage(event.data.numberFiles);
		this.renderExtension();
	}  

	closeExtension() {
		let iframe = document.querySelector("#downLoadImagesExtension");
		document.body.removeChild(iframe);
	}

	initFrame() {
		this.iframe = document.createElement('iframe');
		this.iframe.src = chrome.runtime.getURL('frame.html');
		this.iframe.id = "downLoadImagesExtension";
		this.iframe.style.cssText = 'border:none;position:fixed;top:0;left:0;right:0;bottom:0;margin:auto;display:flex;justify-content:center; align-items: center; width:100%;max-width:560px;height:90vh;z-index:99999999;';
		document.body.appendChild(this.iframe);    
	}
}

const DEFAULT_TYPE_SORT = 1;
const DEFAULT_NUMBER_FILES = 5;
setTimeout(() => new Controller(DEFAULT_NUMBER_FILES, DEFAULT_TYPE_SORT), 1000);