$(function () {
    var enabledHeaders = [];
    /**
     * Loads all enabled headers from chrome storage.
     */
    chrome.storage.sync.get({enabledHeaders:[]},function(result){
        enabledHeaders = result.enabledHeaders;
        chrome.browserAction.setBadgeText({"text":enabledHeaders.length.toString()});
        for(var i = 0; i<enabledHeaders.length; i++){//just for debugging, must be omitted
            console.log('headerName['+i+']: ' + enabledHeaders[i].name, ' headerValue['+i+']: ' + enabledHeaders[i].value); 
        }
    });
    /**
     * Receives the enabled headers array form popup.js (if new headers are enabled/disabled).
     */
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        enabledHeaders = request.enabledHeaders;
        chrome.browserAction.setBadgeText({"text":enabledHeaders.length.toString()});
        for(var i = 0; i<enabledHeaders.length; i++){//just for debugging, must be omitted
        console.log('headerName['+i+']: ' + enabledHeaders[i].name, ' headerValue['+i+']: ' + enabledHeaders[i].value); 
        }
    }); 
    /**
     * Loops through all enabled headers, for each enabled header, loops through the request headers.
     * If the request header's name and the enabled header's name are the same, changes the request header's value to enabled header's value, otherwise contiues looping. 
     * If the end of the request headers array is reached without finding any request header that has the same name, adds the enabled header to the request headers array.
     * @param urls all urls (temporarly)
     * @param
     * @returns reqestHeaders  
     */
    chrome.webRequest.onBeforeSendHeaders.addListener(
        function (details) {
            enabledHeadersLoop:
            for(var i = 0; i < enabledHeaders.length; i++) {
                requestHeadersLoop:
                for (var j = 0; j < details.requestHeaders.length; j++) {
                    console.log('round Nr.'+j+ '\n',//just for debugging, must be omitted
                                'Before processing any condition: ' + '\n',
                                'details.requestHeaders[' + j + '].name: ' + details.requestHeaders[j].name+ '\n', 
                                'details.requestHeaders[' + j + '].value: ' + details.requestHeaders[j].value+ '\n',
                                'details.requestHeaders.length: ' + details.requestHeaders.length + '\n',
                                'enabledHeaders['+i+'].name: '+ enabledHeaders[i].name+ '\n',
                                'enabledHeaders['+i+'].value: ', enabledHeaders[i].value);
                    if (details.requestHeaders[j].name === enabledHeaders[i].name) {
                        details.requestHeaders[j].value = enabledHeaders[i].value; 
                        console.log('details.requestHeaders[' + j + '].value was changed to: ' + details.requestHeaders[j].value)
                        break requestHeadersLoop;
                    }
                    else {
                        while(j < details.requestHeaders.length) {
                            if (j === details.requestHeaders.length -1) {
                                details.requestHeaders.splice(details.requestHeaders.length, 0, enabledHeaders[i]);
                                console.log('round Nr.'+j+ '\n',
                                            'RequestHeader reached end of the requestHeaders array ___ ADDING NEW HEADER...');
                                // details.requestHeaders = details.requestHeaders.splice(0, details.requestHeaders.length);
                                console.log( 'details.requestHeaders.length: ' + details.requestHeaders.length);
                                break requestHeadersLoop;
                            }
                            else {
                                console.log('round Nr.'+j+' enabledHeader does not equal requestHeader ___ CONTINUE');
                                continue requestHeadersLoop;
                            }
                        }
                    }
                }
            }   
            return {requestHeaders:details.requestHeaders}
        },  
        {urls: ["<all_urls>"]},
        ["blocking", "requestHeaders"]);
}); 
