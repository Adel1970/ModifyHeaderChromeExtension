$(function () {
    console.log('headerValue: ' + $('#value').val()); 
chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        // console.log("Request URL:" + details.url)
        for (var i = 0; i < details.requestHeaders.length;  ++i) {
            if (details.requestHeaders[i].name === 'User-Agent') {
                // console.log(details.requestHeaders[i]);
                // console.log('details.requestHeaders.length'+ details.requestHeaders.length);
                // details.requestHeaders.splice(i, 1, {'User-Agent': 'ranorex'});
                details.requestHeaders[i].value =  'ranorex'; 
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
