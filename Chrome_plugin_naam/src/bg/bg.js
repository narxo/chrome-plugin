chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getStatus")
      sendResponse({status: localStorage.getItem('store.settings.titles')});
    else
      sendResponse({}); // snub them.
});