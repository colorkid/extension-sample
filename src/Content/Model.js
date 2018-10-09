import SendSizes from './SendSizes.js'
import Storage from './Storage.js'
import TypeSort from './TypeSort.js'
import FromHightToLowTypeSort from './FromHightToLowTypeSort.js'

export default class Model {

	constructor(DEFAULT_TYPE_SORT, DEFAULT_NUMBER_FILES) {
		this.storage = new Storage();
		this.sendSizes = new SendSizes();
		this.linksArray = this.sendSizes.createValidLink();
		this.numberFiles = DEFAULT_NUMBER_FILES;
		this.defineTypeSort(DEFAULT_TYPE_SORT);
		this.initModel();
	}

	initModel() {
		if (this.sendSizes.getNumberImgsOnPage().size !== 0) {
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
		let arrayUrlSizeScale = [];
		let countIteration = 0; 
		for (let i = 0; i < this.linksArray.length; i++) {
			Promise.all([this.sendSizes.findSizeFiles(this.linksArray[i]), this.sendSizes.findScalePic(this.linksArray[i])])
				.then((results) => {
					countIteration++;
					arrayUrlSizeScale.push([this.linksArray[i],results[0],results[1]]);
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
    	return new Promise((resolve, reject) => {
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