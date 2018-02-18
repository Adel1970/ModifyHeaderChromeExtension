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
            for(var i = 0; i < enabledHeaders.length; i++) {
                requestHeadersLoop:
                for (var j = 0; j < details.requestHeaders.length; j++) {
                    console.log('round Nr.'+j+ '\n',
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
                                            'RequestHeader reached end of the requestHeaders array ___ ADDING NEW HEADER : ' + '\n',
                                            'details.requestHeaders['+(details.requestHeaders.length-1) +'].name: '+ details.requestHeaders[details.requestHeaders.length-1].name+ '\n', 
                                            'details.requestHeaders['+(details.requestHeaders.length-1) +'].value: ' + details.requestHeaders[details.requestHeaders.length-1].value + '\n',
                                            'details.requestHeaders.length: ' + details.requestHeaders.length+ '\n',
                                            'enabledHeaders['+i+'].name: '+ enabledHeaders[i].name+ '\n',
                                            'enabledHeaders['+i+'].value:', enabledHeaders[i].value);
                                // details.requestHeaders = details.requestHeaders.splice(0, details.requestHeaders.length);
                                console.log( 'details.requestHeaders.length: ' + details.requestHeaders.length);
                                break requestHeadersLoop;
                            }
                            else {
                                console.log('round Nr.'+j+' enabledHeader does not equal requestHeader ___ CONTINUE', '\n',
                                'details.requestHeaders[' + j + '].name: ' + details.requestHeaders[j].name+ '\n', 
                                'details.requestHeaders[' + j + '].value: ' + details.requestHeaders[j].value+ '\n',
                                'details.requestHeaders.length: ' + details.requestHeaders.length + '\n',
                                'enabledHeaders['+i+'].name: '+ enabledHeaders[i].name+ '\n',
                                'enabledHeaders['+i+'].value: ', enabledHeaders[i].value);                      
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
