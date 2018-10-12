import Storage from './Storage.js'
import SendSizes from './SendSizes.js'
import Model from './Model.js'

class Controller {
	
	constructor(DEFAULT_NUMBER_FILES, DEFAULT_TYPE_SORT) {
		if (window && window.top === window) {
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
						this.storage = new Storage();
						this.sendSizes = new SendSizes();
						this.model = new Model(DEFAULT_TYPE_SORT, DEFAULT_NUMBER_FILES, this.sendSizes, this.storage);
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
					this.downloadFiles();
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
		this.changeIframeHeight(this.model.getNumberDownload());
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
		this.iframe.style.cssText = 'background-color:#fff;border: 1px solid #757575;position:fixed;top:5vh;left:0;right:0;margin:0 auto;min-height:285px;max-height:90vh;display:flex;justify-content:center; align-items: center; width:100%;max-width:560px;z-index:99999999;';
		document.body.appendChild(this.iframe);    
	}

	changeIframeHeight(numberFiles) {
		const iframeBodyHeight = 180;
		const heightForItem = 35;
		document.querySelector("#downLoadImagesExtension").style.minHeight = iframeBodyHeight + "px";
		document.querySelector("#downLoadImagesExtension").style.height = (iframeBodyHeight + numberFiles * heightForItem) + "px";
	}

	downloadFiles() {
		for (let i = 0; i < this.model.getNumberDownload(); i++) {
    		chrome.runtime.sendMessage({msg: "downloadFiles", url: this.model.getReadyArr()[i][0]}, function(){});
    	}
	}
}

const DEFAULT_TYPE_SORT = 1;
const DEFAULT_NUMBER_FILES = 5;
setTimeout(() => new Controller(DEFAULT_NUMBER_FILES, DEFAULT_TYPE_SORT), 1000);