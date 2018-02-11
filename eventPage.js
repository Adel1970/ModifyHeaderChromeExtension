chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        console.log("Request URL:" + details.url)
        return {cancel: true}; 
    },
    {urls: ["https://www.hays.de/"]},
    ["blocking"]);

