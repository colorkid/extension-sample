//const assert = require('assert');
import { assert } from 'chai';
import Model from './Model.js'

const modelTest = new Model(1, 5);
//const assert = require('assert');
//import { one } from './content';
//const modelTest = require('./content').;
//const modelTest = require('./Model');
//const modelTest = require('./Model').Model;
//const linksCreatorTest = require('./LinksCreator');
/*const typeSortTest = require('./TypeSort');
const fromHightToLowTypeSortTest = require('./FromHightToLowTypeSort');*/

//const modelObj = new modelTest();

describe("createSrcsArray", function() {

	it("create Array From Set", function() {
		let set = new Set();
		set.add("one");
		set.add("two");
		set.add("three");
	    assert.equal(createSrcsArray(set), ["one", "two", "three"]);
	});



});

