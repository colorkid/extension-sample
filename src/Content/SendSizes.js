import LinksCreator from './LinksCreator.js'

export default class SendSizes {

	constructor() {
		this.hostProtocol = window.location.protocol;
		this.hostName = window.location.hostname;
	}

	findSizeFiles(item) {
		return new Promise(function(resolve, reject) {			
			let xhr = new XMLHttpRequest();
			xhr.open('GET', item, true);
			xhr.send();
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						if (item.indexOf("data:image/gif;base64,") === -1) {
						    resolve(xhr.getResponseHeader('Content-Length'));
						} else {
						    let base64str = item.substr(item.indexOf('data:image/gif;base64,')).substr(22);
						    resolve(atob(base64str).length);
						}
					} else {
						resolve("error");
					}
				}
			};
			
		});	
	}

	findScalePic(item) {
		return new Promise(function(resolve) {
			let img = document.createElement("img");
  			img.src = item;
  			try {
	  			img.onload = () => {
		  			resolve(img.width * img.height);
		  		}
		  	} catch (err) {
		  		resolve("error");
		  	}
		});
	}

	createValidLink() {
		let collectLinksArr = this.createSrcsArray(this.getUniqueSrcs());
		return collectLinksArr.map((item) => {
			let linksCreator = new LinksCreator(item);
			return linksCreator.getLink(item, this.hostProtocol, this.hostName);
		});
	}

	createSrcsArray(srcsSet) {
	    let srcsArray = [];
	    srcsSet.forEach((item) => {
	    	if (item) {
	    		srcsArray.push(item);
	    	}
	    });
	    return srcsArray;
  	}

  	getNumberImgsOnPage() {
  		return this.getUniqueSrcs().size;
  	}

	getUniqueSrcs() {
	    let srcsSet = new Set();
	    document.querySelectorAll("img").forEach((item) => {
	        srcsSet.add(item.getAttribute("src"));
	    });
	    return srcsSet;
	}

}