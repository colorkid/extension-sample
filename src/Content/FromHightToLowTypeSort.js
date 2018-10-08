import TypeSort from './TypeSort.js';

export default class FromHightToLowTypeSort extends TypeSort{

	getTypeSort(a, b) {
		if (a[2] < b[2]) return 1;
		if (a[2] > b[2]) return -1;
	}

}