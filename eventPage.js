$(function () {
    var enabledHeaders = [];
    chrome.storage.sync.get({enabledHeaders:[]},function(result){
        enabledHeaders = result.enabledHeaders;
        for(var i = 0; i<enabledHeaders.length; i++){
            console.log('headerName['+i+']: ' + enabledHeaders[i].name, ' headerValue['+i+']: ' + enabledHeaders[i].value); 
        }
    });
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        enabledHeaders = enabledHeaders.push(request.enabledHeaders);
        for(var i = 0; i<enabledHeaders.length; i++){
        console.log('headerName['+i+']: ' + enabledHeaders[i].name, ' headerValue['+i+']: ' + enabledHeaders[i].value); 
        }
    }); 
    chrome.webRequest.onBeforeSendHeaders.addListener(
        function (details) {
            for(var i = 0; i<enabledHeaders.length; i++){
                for (var j = 0; j < details.requestHeaders.length; j++) {
                    console.log('details.requestHeaders[' + j + '].name: ' + details.requestHeaders[j].name, 'details.requestHeaders[' + j + '].value: ' + details.requestHeaders[j].value)
                    if (details.requestHeaders[j].name === enabledHeaders[i].name) {
                        details.requestHeaders[j].value = enabledHeaders[i].value; 
                        console.log('details.requestHeaders[' + j + '].value inside if statement: ' + details.requestHeaders[j].value)
                        break; 
                    }else{
                        details.requestHeaders.push(enabledHeaders[i]);
                        break;
                    }
                }
            }
    return {requestHeaders:details.requestHeaders}
    },  
    {urls:["https://www.hays.de/"]},
    ["blocking", "requestHeaders"]); 
}); 
