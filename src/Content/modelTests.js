const sinon = require('sinon');
import { assert } from 'chai';
import Model from './Model.js'

const mockObjSendSizes = {
	findSizeFiles() {
		return new Promise((resolve) => {
			resolve("5087")
		});
	},
	findScalePic() {
		return new Promise((resolve) => {
			resolve(21120)
		});
	},
	getValidLinks() {
		return [];
	}
}

const mockObjStorage = {
	setNumberFilesToStorage() {
		return;
	},
	getNumberLinksFromStorage() {
		return new Promise((resolve) => {
			resolve("Hello promise")
		});
	}
}

let md = new Model(1, 5, mockObjSendSizes, mockObjStorage);

describe("method setEmptyArrayFiles", function() {
	it("setEmptyArrayFiles when the model did not yet have", function() {
		md.setEmptyArrayFiles();
		assert.equal(md.readyArr.length, 0);
	});
	it("setEmptyArrayFiles when the model already had a readyArr", function() {
		md.readyArr = [["1"], ["2"]];
		md.setEmptyArrayFiles();
		assert.equal(md.readyArr.length, 0);
	});
});

describe("method createArrForRender", function() {
	it("createArrForRender when page dont have imges", function() {
		let spy = sinon.spy(md, "callEveryFile");
		md.linksArray = [];
		md.createArrForRender();
		assert.isTrue(spy.notCalled);
		spy.restore();
	});
	it("createArrForRender when page have some imges", function() {
		let spy = sinon.spy(md, "callEveryFile");
		md.linksArray = [1,2];
		md.createArrForRender();
		assert.isTrue(spy.called);
		spy.restore();
	});
});

describe("method setReadyArr", function() {
	it("works when arrayUrlSizeScale.length > 1", function() {
		md.setReadyArr([
			["https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", "151", 209],
		  	["https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_272x92dp.png", "13504", 100096],
		  	["https://www.gstatic.com/inputtools/images/tia.png", "5087", 21120]
		]);
		assert.isTrue(md.readyArr[0][2] === 100096);
	});
	it("works when arrayUrlSizeScale.length === 1", function() {
		md.setReadyArr([["https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", "5087", 21120]]);
		assert.isTrue(md.readyArr[0][2] === 21120);
	});
});

describe("method getReadyArr", function() {
	it("check on equality", function() {
		md.readyArr = ["a",7,"b"];
		assert.deepEqual(md.readyArr, md.getReadyArr());
	});
	it("if empty array", function() {
		md.readyArr = [];
		assert.isTrue(md.getReadyArr().length === 0);
	});
})

describe("method editFormatSizeFile", function() {
	it("works with arrayUrlSizeScale.length > 1", function() {
		let arrResult = md.editFormatSizeFile([
			["https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", "5087", 21120],
			["https://www.gstatic.com/inputtools/images/tia.png", "151", 209]
		]);
		assert.isTrue(arrResult[1][1] === 0.15 && arrResult[0][1] === 4.97);
	});
	it("works with arrayUrlSizeScale.length === 1", function() {
		let arrResult = md.editFormatSizeFile([["https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", "5087", 21120]]);
		assert.isTrue(arrResult[0][1] === 4.97);
	});
	it("works if before convert size is number", function() {
		let arrResult = md.editFormatSizeFile([["https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", 5087, 21120]]);
		assert.isTrue(arrResult[0][1] === 4.97);
	});
});

describe("method defineTypeSort", function() {
	it("works with code of not 1", function() {
		md.defineTypeSort(2);
		assert.deepEqual([[0,7],[0,2],[0,1],[0,77],[0,2],[0,531],[0,34],[0,9]].sort(md.sortState), [[0,1],[0,2],[0,2],[0,7],[0,9],[0,34],[0,77],[0,531]]);
	});
	it("works with code of 1", function() {
		md.defineTypeSort(1);
		assert.deepEqual([[0,0,7],[0,0,2],[0,0,1],[0,0,77],[0,0,2],[0,0,531],[0,0,34],[0,0,9]].sort(md.sortState), [[0,0,531],[0,0,77],[0,0,34],[0,0,9],[0,0,7],[0,0,2],[0,0,2],[0,0,1]]);
	});
});

describe("method getNumberFiles", function() {
	it("works with number", function() {
		md.numberFiles = 99;
		assert.equal(md.getNumberFiles(), 99);
	});
	it("works with characters", function() {
		md.numberFiles = "99";
		assert.equal(md.getNumberFiles(), "99");
	});
});

describe("method setNumberFiles", function() {
	it("works with number", function() {
		md.setNumberFiles(122);
		assert.equal(md.getNumberFiles(), 122);
	});
	it("works with characters", function() {
		md.setNumberFiles("122");
		assert.equal(md.getNumberFiles(), "122");
	});
});

describe("method getNumberDownload", function() {
	it("works if numberFiles > readyArr.length", function() {
		md.numberFiles = 7;
		md.readyArr = [1,2];
		assert.equal(md.getNumberDownload(), 2);
	});
	it("works if readyArr.length === 0", function() {
		md.numberFiles = 3;
		md.readyArr = [];
		assert.equal(md.getNumberDownload(), 0);
	});
	it("works if readyArr.length > numberFiles", function() {
		md.numberFiles = 2;
		md.readyArr = [1,2,3,4,5,6,7,8];
		assert.equal(md.getNumberDownload(), 2);
	});
});

describe("method setNumberFilesToStorage", function() {
	it("workw with number", function() {
		md.setNumberFilesToStorage(7);
		assert.isTrue(md.numberFiles === 7);
	});
	it("workw with characters", function() {
		md.setNumberFilesToStorage("hello world");
		assert.isTrue(md.numberFiles === "hello world");
	});
});

describe("method getNumberLinksFromStorage", function() {
	it("check on the correct return of the promise", function() {
		md.getNumberLinksFromStorage().then((result) => {
			assert.isTrue(result === "Hello promise");
		});
	});
});

describe("method callEveryFile", function() {
	it("works when linksArray > 1", function() {
		md.linksArray = [1,2,3,4,5,6,7];
		let spy = sinon.spy(md, "resolveSizes");
		md.callEveryFile();
		assert.isTrue(spy.callCount === 7);
		spy.restore();
	});
	it("works when linksArray === 0", function() {
		md.linksArray = [];
		let spy = sinon.spy(md, "resolveSizes");
		md.callEveryFile();
		assert.isTrue(spy.notCalled);
		spy.restore();
	});
	it("works when linksArray === 1", function() {
		md.linksArray = [1];
		let spy = sinon.spy(md, "resolveSizes");
		md.callEveryFile();
		assert.isTrue(spy.callCount === 1);
		spy.restore();
	});
});

describe("method resolveSizes", function() {
	it("check on findSizeFiles resolve", function() {
		let spy = sinon.spy(md.sendSizes, "findSizeFiles");
		md.resolveSizes();
		assert.isTrue(spy.called);
		spy.restore();
	});
	it("check on findScalePic resolve", function() {
		let spy = sinon.spy(md.sendSizes, "findScalePic");
		md.resolveSizes();
		assert.isTrue(spy.called);
		spy.restore();
	});
});

describe("method mergeUrlsSizesScales", function() {
	it("works when count of pic is 1", function() {
		md.arrayUrlSizeScale = [];
		md.mergeUrlsSizesScales("https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", "5087", 21120);
		assert.deepEqual(md.arrayUrlSizeScale, [["https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", "5087", 21120]]);
	});
	it("works when count of pic is 0", function() {
		md.arrayUrlSizeScale = [];
		md.mergeUrlsSizesScales();
		assert.deepEqual(md.arrayUrlSizeScale, [[undefined, undefined, undefined]]);
	});
	it("works when count of pic is more then 1", function() {
		md.arrayUrlSizeScale = [];
		md.mergeUrlsSizesScales("https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", "5087", 21120);
		md.mergeUrlsSizesScales("https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", "1111", 222);
		assert.deepEqual(md.arrayUrlSizeScale, [["https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", "5087", 21120],["https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", "1111", 222]]);
	});
		it("works with unusual arguments", function() {
		md.arrayUrlSizeScale = [];
		md.mergeUrlsSizesScales(222, null, "undefined");
		assert.deepEqual(md.arrayUrlSizeScale, [[222, null, "undefined"]]);
	});
});