import LinksCreator from './LinksCreator.js'
import WeightFindSize from './WeightFindSize.js'
import ScaleFindSize from './ScaleFindSize.js'

export default class SendSizes {

	constructor() {
		this.hostProtocol = window.location.protocol;
		this.hostName = window.location.hostname;
	}

	getSizeFiles(item) {
		return new WeightFindSize().findSizeFiles(item);
	}

	getScalePic(item) {
		return new ScaleFindSize().findSizeFiles(item);
	}

	createValidLink() {
		let collectLinksArr = this.createSrcsArray(this.getUniqueSrcs());
		return collectLinksArr.map((item) => {
			let linksCreator = new LinksCreator(item);
			return linksCreator.getLink(item, this.hostProtocol, this.hostName);
		});
	}

	getValidLinks() {
		return this.createValidLink();
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

	getUniqueSrcs() {
	    let srcsSet = new Set();
	    document.querySelectorAll("img").forEach((item) => {
	        srcsSet.add(item.getAttribute("src"));
	    });
	    return srcsSet;
	}

}