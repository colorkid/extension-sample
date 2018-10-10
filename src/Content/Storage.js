export default class Storage {

	setNumberFilesToStorage(number) {
		chrome.storage.sync.set({number_storage: number}, function() {});
	}

	getNumberLinksFromStorage() {
    	return new Promise((resolve) => {
        	chrome.storage.sync.get("number_storage", (data) => {
                resolve(data.number_storage);
          	});
      	});
    }
}