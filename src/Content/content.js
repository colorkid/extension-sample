import Storage from './Storage.js'
import SendSizes from './SendSizes.js'
import Model from './Model.js'

class Controller {
	
	constructor() {
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
						this.model = new Model(new SendSizes(), new Storage());
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
		this.iframe.style.backgroundColor = "#fff";
		this.iframe.style.border = "1px solid #757575";
		this.iframe.style.position = "fixed";
		this.iframe.style.top = "5vh";
		this.iframe.style.left = "0";
		this.iframe.style.right = "0";
		this.iframe.style.margin = "0 auto";
		this.iframe.style.minHeight = "285px";
		this.iframe.style.maxHeight = "90vh";
		this.iframe.style.display = "flex";
		this.iframe.style.justifyContent = "center";
		this.iframe.style.alignItems = "center";
		this.iframe.style.width = "100%";
		this.iframe.style.maxWidth = "560px";
		this.iframe.style.zIndex = "99999999";
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
    		chrome.runtime.sendMessage({action: "downloadFiles", url: this.model.getReadyArr()[i][0]}, function(){});
    	}
	}
}

setTimeout(() => new Controller(), 1000);