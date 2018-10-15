import FindSize from './FindSize.js';

export default class ScaleFindSize extends FindSize {

	findSizeFiles(item) {
		return new Promise(function(resolve) {
			let img = document.createElement("img");
  			img.src = item;
  			try {
	  			img.onload = () => {
		  			resolve(img.naturalWidth * img.naturalHeight);
		  		}
		  	} catch (err) {
		  		resolve("error");
		  	}
		});
	}

}