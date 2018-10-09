import { assert } from 'chai'
import Model from './Model.js'

function CreateSendSizes(arr, getNumberImgsOnPage, findSizeFiles, findScalePic) {
	this.createValidLink = function(arr) {
		return arr;
	};
	this.getNumberImgsOnPage = function(getNumberImgsOnPage) {
		if (getNumberImgsOnPage == false || getNumberImgsOnPage == undefined) {
			return 0;
		} else {
			return getNumberImgsOnPage;
		}
	};
	this.findSizeFiles = function(findSizeFiles) {
		return new Promise(function(resolve, reject) {
			resolve(findSizeFiles);
		});
	};
	this.findScalePic = function(findScalePic) {
		return new Promise(function(resolve) {
			resolve(findScalePic);
		})
	};
}

//Default data
let createdValidLink = [
	"https://s0.rbk.ru/v6_top_pics/resized/810x405_crop/media/img/2/62/755390238487622.jpeg",
	"https://s0.rbk.ru/v6_top_pics/resized/810x405_crop/media/img/5/87/755390186653875.jpeg",
	"https://s0.rbk.ru/v6_top_pics/resized/810x405_crop/media/img/6/09/755390673142096.jpg"
];

let ss = new CreateSendSizes(createdValidLink, 3, "4684", 328050);

describe("method initModel", function() {
	it("initModel when page dont have img", function() {
		let ss = new CreateSendSizes(createdValidLink, 0, "4684", 328050);
		let md = new Model(1,7,ss);
		md.initModel();
		assert.equal(md.readyArr.length, 0);
	});
});

describe("method setEmptyArrayFiles", function() {
	it("setEmptyArrayFiles when the model did not yet have", function() {
		let md = new Model(1,7,ss);
		md.setEmptyArrayFiles();
		assert.equal(md.readyArr.length, 0);
	});
	it("setEmptyArrayFiles when the model already had a readyArr", function() {
		let md = new Model(1,7,ss);
		md.readyArr = createdValidLink;
		md.setEmptyArrayFiles();
		assert.equal(md.readyArr.length, 0);
	});
});

describe("method editFormatSizeFile", function() {
	it("works with arrConveSize.length > 1", function() {
		let md = new Model(1,7,ss);
		let arrConveSize = [
			["https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", "5087", 21120],
			["https://www.gstatic.com/inputtools/images/tia.png", "151", 209]
		];
		let arrResult = md.editFormatSizeFile(arrConveSize);
		assert.isTrue(arrResult[1][1] === 0.15 && arrResult[0][1] === 4.97);
	});
	it("works with arrConveSize.length === 1", function() {
		let md = new Model(1,7,ss);
		let arrConveSize = [
			["https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", "5087", 21120]
		];
		let arrResult = md.editFormatSizeFile(arrConveSize);
		assert.isTrue(arrResult[0][1] === 4.97);
	});
	it("works if before convert size is number", function() {
		let md = new Model(1,7,ss);
		let arrConveSize = [["https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", 5087, 21120]];
		let arrResult = md.editFormatSizeFile(arrConveSize);
		assert.isTrue(arrResult[0][1] === 4.97);
	});
});

describe("method getNumberFiles", function() {
	it("works with number", function() {
		let md = new Model(1,99,ss);
		assert.equal(md.getNumberFiles(), 99);
	});
	it("works with characters", function() {
		let md = new Model(1,"99",ss);
		assert.equal(md.getNumberFiles(), "99");
	});
});

describe("method setNumberFiles", function() {
	it("works with number", function() {
		let md = new Model(1,9,ss);
		md.setNumberFiles(122);
		assert.equal(md.getNumberFiles(), 122);
	});
	it("works with characters", function() {
		let md = new Model(1,9,ss);
		md.setNumberFiles("122");
		assert.equal(md.getNumberFiles(), "122");
	});
});

describe("method setNumberFiles", function() {
	it("works with number", function() {
		let md = new Model(1,9,ss);
		md.setNumberFiles(122);
		assert.equal(md.getNumberFiles(), 122);
	});
	it("works with characters", function() {
		let md = new Model(1,9,ss);
		md.setNumberFiles("122");
		assert.equal(md.getNumberFiles(), "122");
	});
});

describe("method getNumberDownload", function() {
	it("works if numberFiles > readyArr.length", function() {
		let md = new Model(1,3,ss);
		let readyArrMoreNumberDownload = [1,2];
		md.readyArr = readyArrMoreNumberDownload;
		assert.equal(md.getNumberDownload(), 2);
	});
	it("works if readyArr.length === 0", function() {
		let md = new Model(1,3,ss);
		md.setEmptyArrayFiles();
		assert.equal(md.getNumberDownload(), 0);
	});
	it("works if readyArr.length > numberFiles", function() {
		let md = new Model(1,3,ss);
		let readyArrMoreNumberDownload = [1,2,3,4,5,6,7,8];
		md.readyArr = readyArrMoreNumberDownload;
		assert.equal(md.getNumberDownload(), 3);
	});
});

describe("defineTypeSort", function() {
	it("works with code of not 1", function() {
		let md = new Model(1,9,ss);
		md.defineTypeSort(2);
		assert.deepEqual([[0,7],[0,2],[0,1],[0,77],[0,2],[0,531],[0,34],[0,9]].sort(md.sortState), [[0,1],[0,2],[0,2],[0,7],[0,9],[0,34],[0,77],[0,531]]);
	});
	it("works with code of 1", function() {
		let md = new Model(2,9,ss);
		md.defineTypeSort(1);
		assert.deepEqual([[0,0,7],[0,0,2],[0,0,1],[0,0,77],[0,0,2],[0,0,531],[0,0,34],[0,0,9]].sort(md.sortState), [[0,0,531],[0,0,77],[0,0,34],[0,0,9],[0,0,7],[0,0,2],[0,0,2],[0,0,1]]);
	});
});

describe("setReadyArr", function() {
	it("works when arrForSetMethod.length > 1", function() {
		let md = new Model(1,9,ss);
		let arrForSetMethod = [
			["https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", "5087", 21120],
		  	["https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_272x92dp.png", "13504", 100096],
		  	["https://www.gstatic.com/inputtools/images/tia.png", "151", 209]
		];
		md.setReadyArr(arrForSetMethod);
		assert.isTrue(md.readyArr[0][2] === 100096);
	});

	it("works when arrForSetMethod.length === 1", function() {
		let md = new Model(1,9,ss);
		let arrForSetMethod = [
			["https://www.google.ru//images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", "5087", 21120],
		];
		md.setReadyArr(arrForSetMethod);
		assert.isTrue(md.readyArr[0][2] === 21120);
	});
});

describe("getReadyArr", function() {
	it("check return", function() {
		let md = new Model(1,9,ss);
		assert.deepEqual(md.readyArr, md.getReadyArr());
	});
});