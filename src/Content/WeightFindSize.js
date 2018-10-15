import FindSize from './FindSize.js';

export default class WeightFindSize extends FindSize {

	findSizeFiles(item) {
		return new Promise(function(resolve) {			
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

}