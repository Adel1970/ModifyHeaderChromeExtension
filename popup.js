$(function () {
    /**
     * Get all saved headers in one array and the enabled headers in another array.
     * Loop through all headers, for each header, loop through all enabled headers.
     * If the header is enabled, change the header attributes accordingly, otherwise continue looping through the enabled headers.
     * If the end of the enabled headers array was reached, consider the header as disabled and change the attributes accordingly
     */
    chrome.storage.sync.get({headers:[], enabledHeaders:[]}, function(result) {
        var headers = result.headers; 
        var enabledHeaders = result.enabledHeaders;
        for(var i = 0; i<enabledHeaders.length; i++){
            console.log('enabledHeaders[' + i + '].name: ', enabledHeaders[i].name, ' enabledHeaders[' + i + '].value: ', enabledHeaders[i].value)
        }
        headersLoop:
        for (var i = 0; i < headers.length; i++) {
            console.log('headers[' + i + '].name: ', headers[i].name, ' headers[' + i + '].value: ', headers[i].value)
            $('#headerTable tbody tr:last').after(
                '<tr>' + 
                '<td class="headerName" id="name' + i + '">' + headers[i].name + '</td>' + 
                '<td class="headerValue" id="value' + i + '">' + headers[i].value + '</td>' + 
                '<td><button class="enable" id="enable' + i + '" type="button">enable</button></td>' + 
                '<td><button class="remove" id="remove' + i + '" type="button">remove</button></td>' + 
                '</tr>'
            ); 
            enabledHeadersLoop: 
            for(var j = 0; j<enabledHeaders.length; j++){     
                console.log('Entered enabledHeadersLoop \n',
                                'headers['+i+'].name: ', headers[i].name,'headers['+i+'].value: ', headers[i].value,'\n',
                                'enabledHeaders['+j+'].name: ', enabledHeaders[j].name,
                                'enabledHeaders['+j+'].value: ', enabledHeaders[j].value)
                if(headers[i].name === enabledHeaders[j].name && headers[i].value === enabledHeaders[j].value){
                    console.log('Header is enabled ___ CHANGING ATTRIBUTES...');
                    $('#enable'+i).attr({
                        "id":"disable"+i,
                        "class":"disable"
                    });
                    document.getElementById('disable'+i).childNodes[0].nodeValue = 'disable';
                    $('#name'+i).css({"background-color": "#00FA9A"});
                    $('#value'+i).css({"background-color": "#00FA9A"});
                    break enabledHeadersLoop;
                }
                else{
                    while(j < enabledHeaders.length){
                        if(j === enabledHeaders.length - 1){
                            console.log('Header is not enabled ___ CHANGING ATTRIBUTES...');
                            $('#name'+i).css({"background-color": "#EB9999"});
                            $('#value'+i).css({"background-color":"#EB9999"});
                            break enabledHeadersLoop;
                        }
                        else{
                            console.log('Still comparing...');
                            continue enabledHeadersLoop;
                        }
                    }
                    
                }
            }   
        }
    }); 
    $('#addHeader').click(function () {
        var headerName = $('#addName').val(); 
        var headerValue = $('#addValue').val(); 
        chrome.storage.sync.get( {headers:[]}, function(result) {
            var headers = result.headers
            for(var i = 0; i<headers.length; i++){
                if (headers[i].name === headerName && headers[i].value === headerValue){
                    $('#addValue').after('<span class= "error">header already exists</span>');
                    setTimeout(function(){$('span.error').remove();}, 3000);
                    return;
                }
            } 
            var header =  {
                'name':headerName, 
                'value':headerValue
            }
            headers.push(header); 
            $('#headerTable tbody tr:last').after
            (
                '<tr>' + 
                '<td class="headerName">' + headerName + '</td>' + 
                '<td class="headerValue">' + headerValue + '</td>' + 
                '<td><button class="enable" id = "enable'+(headers.length-1)+'" type="button">enable</button></td>' + 
                '<td><button class="remove" id = "remove'+(headers.length-1)+'"type="button">remove</button></td>' + 
                '</tr>'
            ); 
            var id = $('#enable'+(headers.length-1)).attr('id');
            console.log('Id: ', id);
            chrome.storage.sync.set( {headers:headers}, function() {
                chrome.storage.sync.get( {headers:[]}, function(result) {//just for testing, must be omitted
                    for (var i = 0; i < headers.length; i++) {//just for testing, must be omitted
                        console.log('headers[' + i + '].name: ', headers[i].name, ' headers[' + i + '].value: ', headers[i].value)//just for testing, must be omitted
                    }
                }); 
            }); 
        }); 
    }); 
    
    $(document).on('click', '#headerTable tbody tr td button.enable', function(event) {
        //convert button's id and class to 'disable'
        var buttonNumericOrder = event.target.id.slice(-1);
        var newId = "disable"+buttonNumericOrder;
        console.log('buttonNumericOrder for enable: ',buttonNumericOrder )
        $(this).attr({
            "id": newId,
            "class": "disable",
        });
        var changedID = $(this).attr('id');
        var newClass = $(this).attr('class');
        console.log('newId for enable: ', newId, '| newClass for enable: ', newClass, 'changedId: ', changedID);
        document.getElementById(newId).childNodes[0].nodeValue = 'disable'; //faster than $(this).text(), $(this).html() and document.getElementById(newId).innerHTML
        var headerName = $(this).closest('tr').find('.headerName').html(); 
        var headerValue = $(this).closest('tr').find('.headerValue').html();
        var header = {
            'name': headerName,
            'value': headerValue
        }
        chrome.storage.sync.get({enabledHeaders:[]}, function(result){
            var enabledHeaders = result.enabledHeaders;
            enabledHeaders.push(header);
            chrome.storage.sync.set({enabledHeaders:enabledHeaders}, function(){
                chrome.storage.sync.get({enabledHeaders:[]}, function(result){
                    for(var i = 0; i<result.enabledHeaders.length; i++){
                        console.log('enabledHeaders['+i+'].name: ', enabledHeaders[i].name, 
                                    ' enabledHeaders['+i+'].name: ', enabledHeaders[i].value);
                    }
                });
            }); 
            chrome.runtime.sendMessage({
               enabledHeaders: enabledHeaders
            }); 
        }); 
        $(this).closest('tr').find('.headerName').css({"background-color": "#00FA9A"});
        $(this).closest('tr').find('.headerValue').css({"background-color": "#00FA9A"}); 
    }); 

    $(document).on('click', '#headerTable tbody tr td button.remove', function(event) {
        var buttonId = event.target.id;
        disableHeader(buttonId);
        var headerName = $(this).closest('tr').find('.headerName').html(); 
        var headerValue = $(this).closest('tr').find('.headerValue').html(); 
        chrome.storage.sync.get( {headers:[]}, function(result) {
            var headers = result.headers; 
            FindHeaderToRemoveLoop:
            for (var i = 0; i < headers.length; i++) {
                if (headers[i].name === headerName && headers[i].value === headerValue) {                   
                    headers.splice(i,1);
                    chrome.storage.sync.set({headers:headers}, function(){
                        chrome.storage.sync.get({headers:[]}, function(result) {//just for testing, must be omitted
                            for (var i = 0; i < result.headers.length; i++) {
                                console.log('headers[' + i + '].name: ', headers[i].name, 'headers[' + i + '].value: ', headers[i].value)
                            }
                            console.log('headers array length after removing elements: ', result.headers.length)//just for testing, must be omitted
                        });
                    });
                    break FindHeaderToRemoveLoop;  
                }
            }
        }); 
        $(this).closest('tr').remove(); 
    }); 
    $(document).on('click', '#headerTable tfoot tr td button.clearHeaders', function(event){
        console.log('clear function was called'); 
        chrome.storage.sync.clear();
        $('#tbody').html("<tr></tr>");
    });

    $(document).on('click', '#headerTable tbody tr td button.disable', function(event) {
        //convert button's id and class to 'enable'
        var buttonNumericOrder = event.target.id.slice(-1);
        console.log('buttonNumericOrder for disable: ', buttonNumericOrder); 
        var newId = "enable"+buttonNumericOrder;
        $(this).attr({
            "id": newId,
            "class":"enable"
        });
        var changedID = $(this).attr('id');
        var newClass = $(this).attr("class");
        console.log('new ID for disable: '+newId+ '| new class for disable: '+newClass, '| changedID: '+changedID);
        disableHeader(newId);
        $('#'+newId).closest('tr').find('.headerName').css({"background-color":"#EB9999"});
        $('#'+newId).closest('tr').find('.headerValue').css({"background-color":"#EB9999"});
        document.getElementById(newId).childNodes[0].nodeValue = 'enable';
    });

    function disableHeader(buttonId){
        var headerName = $('#'+buttonId).closest('tr').find('.headerName').html();
        var headerValue = $('#'+buttonId).closest('tr').find('.headerValue').html();
        console.log('headerName: ', headerName, 'headerValue: ', headerValue);
        chrome.storage.sync.get({enabledHeaders:[]},function(result){
            var enabledHeaders = result.enabledHeaders;
            FindHeaderToDisableLoop:
            for(var i = 0; i < enabledHeaders.length; i++){
                console.log('Looping through enabledHeaders...','\n',
                            'enabledHeaders['+i+'].name: ',enabledHeaders[i].name,'\n',
                            'enabledHeaders['+i+'].value: ', enabledHeaders[i].value);
                if(enabledHeaders[i].name === headerName && enabledHeaders[i].value === headerValue){
                    console.log('Following element was found: \n',
                                'headerName: '+ enabledHeaders[i].name + ' headerValue: ' + enabledHeaders[i].value +'\n',
                                'removing element...');
                    enabledHeaders.splice(i, 1);
                    chrome.storage.sync.set({enabledHeaders:enabledHeaders}, function(){
                        chrome.storage.sync.get({enabledHeaders:[]}, function(result){
                            for(var i = 0; i < result.enabledHeaders.length; i++){
                                console.log('Element was removed, looping through enabledHeaders...','\n',
                                            'enabledHeaders['+i+'].name: ',enabledHeaders[i].name,'\n',
                                            'enabledHeaders['+i+'].value: ', enabledHeaders[i].value);
                            }
                        });
                    });
                    chrome.runtime.sendMessage({
                        enabledHeaders: enabledHeaders
                    });
                    break FindHeaderToDisableLoop;
                }
            }
        });
    } 
}); 

