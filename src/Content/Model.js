import LinksCreator from './LinksCreator.js'
import TypeSort from './TypeSort.js'
import FromHightToLowTypeSort from './FromHightToLowTypeSort.js'

export default class Model {

	constructor(DEFAULT_TYPE_SORT, DEFAULT_NUMBER_FILES) {
		this.hostProtocol = window.location.protocol;
		this.hostName = window.location.hostname;
		this.numberFiles = DEFAULT_NUMBER_FILES;
		this.defineTypeSort(DEFAULT_TYPE_SORT);
		this.initModel();
	}

	initModel() {
		if (this.getUniqueSrcs().size !== 0) {
			this.mergeUrlSizeScale();
		} else {
			this.setEmptyArrayFiles();
		}
	}

	setEmptyArrayFiles() {
  		this.readyArr = [];
  	}

  	setReadyArr(arrayUrlSizeScale) {
		this.readyArr = this.editFormatSizeFile(arrayUrlSizeScale).sort(this.sortState);
	}

	getReadyArr() {
		return this.readyArr;
	}

	mergeUrlSizeScale() {
		let createdValidLinkArr = this.createValidLink();
		let arrayUrlSizeScale = [];
		let countIteration = 0; 
		for (let i = 0; i < createdValidLinkArr.length; i++) {
			Promise.all([this.findSizeFiles(createdValidLinkArr[i]), this.findScalePic(createdValidLinkArr[i])])
				.then((results) => {
					countIteration++;
					arrayUrlSizeScale.push([createdValidLinkArr[i],results[0],results[1]]);
					if (arrayUrlSizeScale.length === countIteration) {
						this.setReadyArr(arrayUrlSizeScale);
					}
				})
		}
	}

	editFormatSizeFile(size) {
		let arrayFromStorage = size.map((item, i) => {
			if (item[1] === null || item[1] === "error") {
				return [item[0], 0, item[2]]
			} else {
				return [item[0], Math.round((item[1] / 1024) * 100) / 100, item[2]];
			}
		});
		return arrayFromStorage;
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
		let collectLinksArr = this.createSrcsArray();
		return collectLinksArr.map((item) => {
			let linksCreator = new LinksCreator(item);
			return linksCreator.getLink(item, this.hostProtocol, this.hostName);
		});
	}

	createSrcsArray() {
		let srcsSet = this.getUniqueSrcs();
	    let srcsArray = [];
	    srcsSet.forEach((item) => {
	    	srcsArray.push(item);
	    });
	    return srcsArray;
  	}

  	defineTypeSort(codeSort) {
		if (codeSort === 1) {
			this.sortState = new FromHightToLowTypeSort().getTypeSort;
		} else {
			this.sortState = new TypeSort().getTypeSort;
		}
	}

	getUniqueSrcs() {
	    let srcsSet = new Set();
	    document.querySelectorAll("img").forEach((item) => {
	        srcsSet.add(item.getAttribute("src"));
	    });
	    return srcsSet;
	}

	getNumberFiles() {
		return this.numberFiles;
	}

	setNumberFiles(number) {
		this.numberFiles = number;
	}

	setNumberFilesToStorage(number) {
      	chrome.storage.sync.set({number_storage: number}, function() {});
      	this.setNumberFiles(number);
    }

    getNumberLinksFromStorage() {
    	return new Promise((resolve, reject) => {
        	chrome.storage.sync.get("number_storage", (data) => {
            	if (data.number_storage == undefined) {
                	resolve(this.numberFiles);
              	} else {
                	resolve(data.number_storage);
              	}
          	});
      	});
    }

    getNumberDownload() {
    	return this.getNumberFiles() > this.getReadyArr().length ? this.getReadyArr().length : this.getNumberFiles();
    }

    downloadFiles() {
    	for (let i = 0; i < this.getNumberDownload(); i++) {
    		chrome.runtime.sendMessage({msg: "downloadFiles", url: this.getReadyArr()[i][0]}, function(response) {});
    	}
    }
}