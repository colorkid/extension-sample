chrome.browserAction.onClicked.addListener(() => {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    	chrome.tabs.sendMessage(tabs[0].id,{action:"open_dialog_box"});
  	}); 
});

chrome.runtime.onMessage.addListener(
  	function(request, sender, sendResponse) {
    	if (request.msg == "downloadFiles") {
    		chrome.downloads.download({url:request.url});
    	}
  	});

function suggestReplaceFilename(item, suggest) {
    suggest ({
      	filename: item.filename,
      	conflictAction: 'overwrite'
    });
}

chrome.downloads.onDeterminingFilename.removeListener(suggestReplaceFilename);
chrome.downloads.onDeterminingFilename.addListener(suggestReplaceFilename);     	