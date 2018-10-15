import TypeSort from './TypeSort.js'
import FromHightToLowTypeSort from './FromHightToLowTypeSort.js'

export default class Model {

	constructor(sendSizes, storage) {
		const DEFAULT_NUMBER_FILES = 5;
		const DEFAULT_TYPE_SORT = 1;
		this.storage = storage;
		this.sendSizes = sendSizes;
		this.linksArray = this.sendSizes.getValidLinks();
		this.numberFiles = DEFAULT_NUMBER_FILES;
		this.defineTypeSort(DEFAULT_TYPE_SORT);
		this.createArrForRender();
	}

	createArrForRender() {
		if (this.linksArray.length !== 0) {
			this.callEveryFile();
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

	callEveryFile() {
		this.arrayUrlSizeScale = [];
		this.countIteration = 0;
		for (let i = 0; i < this.linksArray.length; i++) {
			this.resolveSizes(this.linksArray[i]);
		}
	}

	resolveSizes(item) {
		Promise.all([this.sendSizes.getSizeFiles(item), this.sendSizes.getScalePic(item)]).then((results) => {
			this.countIteration++;
			this.mergeUrlsSizesScales(item,results[0],results[1]);
			if (this.linksArray.length === this.countIteration) {
				this.setReadyArr(this.arrayUrlSizeScale);
			}
		})
	}

	mergeUrlsSizesScales(url,size,scale) {
		this.arrayUrlSizeScale.push([url,size,scale]);
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

	defineTypeSort(codeSort) {
		if (codeSort === 1) {
			this.sortState = new FromHightToLowTypeSort().getTypeSort;
		} else {
			this.sortState = new TypeSort().getTypeSort;
		}
	}

	getNumberFiles() {
		return this.numberFiles;
	}

	setNumberFiles(number) {
		this.numberFiles = number;
	}

	setNumberFilesToStorage(number) {
		this.storage.setNumberFilesToStorage(number);
      	this.setNumberFiles(number);
    }

    getNumberLinksFromStorage() {
    	return new Promise((resolve) => {
    		this.storage.getNumberLinksFromStorage().then((result) => {
	    		if (result == undefined) {
	                resolve(this.numberFiles);
	            } else {
	                resolve(result);
	            }
    		});
    	});	
    }

    getNumberDownload() {
    	return this.getNumberFiles() > this.getReadyArr().length ? this.getReadyArr().length : this.getNumberFiles();
    }
}