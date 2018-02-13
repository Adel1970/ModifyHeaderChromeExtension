chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        var headerName = request.headerName;
    console.log('headerName: ' + request.headerName, ' headerValue: ' + request.headerValue);
     
chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        // console.log("Request URL:" + details.url)
        for (var i = 0; i < details.requestHeaders.length;  ++i) {
            if (details.requestHeaders[i].name === request.headerName) {
                // console.log(details.requestHeaders[i]);
                // console.log('details.requestHeaders.length'+ details.requestHeaders.length);
                // details.requestHeaders.splice(i, 1, {'User-Agent': 'ranorex'});
                details.requestHeaders[i].value =  request.headerValue; 
                // console.log(details.requestHeaders[i]);
                // console.log('details.requestHeaders.length'+ details.requestHeaders.length);
                break; 
            }
        }
        // console.log('details.requestHeaders'+ details.requestHeaders.toString());
        // console.log('details.requestHeaders.length'+ details.requestHeaders.length);
        return {requestHeaders:details.requestHeaders}
    },  {urls:["https://www.hays.de/"]},
        ["blocking", "requestHeaders"]); 
    });
