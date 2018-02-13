$(function () {
    var headerName, headerValue; 
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    headerName = request.headerName; 
    headerValue = request.headerValue; 
    console.log('headerName: ' + request.headerName, ' headerValue: ' + request.headerValue); 
}); 
console.log('headerName: ' + headerName, ' headerValue: ' + headerValue); 
 chrome.webRequest.onBeforeSendHeaders.addListener(
        function (details) {
            for (var i = 0; i < details.requestHeaders.length; i++) {
                    console.log('details.requestHeaders[' + i + '].name: ' + details.requestHeaders[i].name, 'details.requestHeaders[' + i + '].value: ' + details.requestHeaders[i].value)
                if (details.requestHeaders[i].name === headerName) {
                    // console.log(details.requestHeaders[i]);
                    // console.log('details.requestHeaders.length'+ details.requestHeaders.length);
                    // details.requestHeaders.splice(i, 1, {'User-Agent': 'ranorex'});
                    // console.log("request.headerValue Before: ", request.headerValue);
                    details.requestHeaders[i].value = headerValue; 
                    console.log('details.requestHeaders[' + i + '].value inside if statement: ' + details.requestHeaders[i].value)
                    // console.log("request.headerValue after: ", request.headerValue);
                    // console.log(details.requestHeaders[i]);
                    // console.log('details.requestHeaders.length'+ details.requestHeaders.length);
                    break; 
                }
            }
        return {requestHeaders:details.requestHeaders}
    },  {urls:["https://www.hays.de/"]},
        ["blocking", "requestHeaders"]); 
    }); 
