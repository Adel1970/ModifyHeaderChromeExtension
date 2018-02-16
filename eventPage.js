$(function () {
    var enabledHeaders = [];
    chrome.storage.sync.get({enabledHeaders:[]},function(result){
        enabledHeaders = result.enabledHeaders;
        for(var i = 0; i<enabledHeaders.length; i++){
            console.log('headerName['+i+']: ' + enabledHeaders[i].name, ' headerValue['+i+']: ' + enabledHeaders[i].value); 
        }
    });
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        enabledHeaders = request.enabledHeaders;
        for(var i = 0; i<enabledHeaders.length; i++){
        console.log('headerName['+i+']: ' + enabledHeaders[i].name, ' headerValue['+i+']: ' + enabledHeaders[i].value); 
        }
    }); 
    chrome.webRequest.onBeforeSendHeaders.addListener(
        function (details) {
            enabledHeadersLoop:
            for(var enabledHeader = 0; enabledHeader < enabledHeaders.length; enabledHeader++){
                requestHeadersLoop:
                for (var requestHeader = 0; requestHeader < details.requestHeaders.length; requestHeader++) {
                    console.log('round Nr.'+requestHeader+ '\n',
                                'Before processing any condition: ' + '\n',
                                'details.requestHeaders[' + requestHeader + '].name: ' + details.requestHeaders[requestHeader].name+ '\n', 
                                'details.requestHeaders[' + requestHeader + '].value: ' + details.requestHeaders[requestHeader].value+ '\n',
                                'details.requestHeaders.length: ' + details.requestHeaders.length + '\n',
                                'enabledHeaders['+enabledHeader+'].name: '+ enabledHeaders[enabledHeader].name+ '\n',
                                'enabledHeaders['+enabledHeader+'].value: ', enabledHeaders[enabledHeader].value);
                    if (details.requestHeaders[requestHeader].name === enabledHeaders[enabledHeader].name) {
                        details.requestHeaders[requestHeader].value = enabledHeaders[enabledHeader].value; 
                        console.log('details.requestHeaders[' + requestHeader + '].value was changed to: ' + details.requestHeaders[requestHeader].value)
                        break requestHeadersLoop;
                    }else while(requestHeader < details.requestHeaders.length){
                        if (requestHeader === details.requestHeaders.length -1){
                            details.requestHeaders.splice(details.requestHeaders.length, 0, enabledHeaders[enabledHeader]);
                            console.log('round Nr.'+requestHeader+ '\n',
                                        'RequestHeader reached end of the requestHeaders array ___ ADDING NEW HEADER : ' + '\n',
                                        'details.requestHeaders['+(details.requestHeaders.length-1) +'].name: '+ details.requestHeaders[details.requestHeaders.length-1].name+ '\n', 
                                        'details.requestHeaders['+(details.requestHeaders.length-1) +'].value: ' + details.requestHeaders[details.requestHeaders.length-1].value + '\n',
                                        'details.requestHeaders.length: ' + details.requestHeaders.length+ '\n',
                                        'enabledHeaders['+enabledHeader+'].name: '+ enabledHeaders[enabledHeader].name+ '\n',
                                        'enabledHeaders['+enabledHeader+'].value:', enabledHeaders[enabledHeader].value);
                            // details.requestHeaders = details.requestHeaders.splice(0, details.requestHeaders.length);
                            console.log( 'details.requestHeaders.length: ' + details.requestHeaders.length);
                        break requestHeadersLoop;
                    }
                    else {
                        console.log('round Nr.'+requestHeader+' enabledHeader does not equal requestHeader ___ CONTINUE', '\n',
                        'details.requestHeaders[' + requestHeader + '].name: ' + details.requestHeaders[requestHeader].name+ '\n', 
                        'details.requestHeaders[' + requestHeader + '].value: ' + details.requestHeaders[requestHeader].value+ '\n',
                        'details.requestHeaders.length: ' + details.requestHeaders.length + '\n',
                        'enabledHeaders['+enabledHeader+'].name: '+ enabledHeaders[enabledHeader].name+ '\n',
                        'enabledHeaders['+enabledHeader+'].value: ', enabledHeaders[enabledHeader].value);                      
                        continue requestHeadersLoop;
                    }
                }
            }
        }
    return {requestHeaders:details.requestHeaders}
    },  
    {urls:["https://www.hays.de/"]},
    ["blocking", "requestHeaders"]); 
}); 
