$(function () {
    /**
     * Gets all saved headers in one array and the enabled headers in another array.
     * Loops through all headers, for each header, loop through all enabled headers.
     * If the header is enabled, changes the header properties accordingly, otherwise continues looping through the enabled headers.
     * If the end of the enabled headers array is reached, considers the header as disabled and changes the properties accordingly.
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
            if(enabledHeaders.length === 0){
                $('#name'+i).addClass('disabled');
                $('#value'+i).addClass('disabled');
            }
            enabledHeadersLoop: 
            for(var j = 0; j<enabledHeaders.length; j++){     
                console.log('Entered enabledHeadersLoop \n',//just for debugging, must be omitted
                                'headers['+i+'].name: ', headers[i].name,'headers['+i+'].value: ', headers[i].value,'\n',
                                'enabledHeaders['+j+'].name: ', enabledHeaders[j].name,
                                'enabledHeaders['+j+'].value: ', enabledHeaders[j].value)
                if(headers[i].name === enabledHeaders[j].name && headers[i].value === enabledHeaders[j].value){
                    console.log('Header is enabled ___ CHANGING PROPERTIES...');
                    $('#enable'+i).prop({
                        "id":"disable"+i,
                        "class":"disable"
                    });
                    document.getElementById('disable'+i).childNodes[0].nodeValue = 'disable';
                    $('#name'+i).addClass('enabled');
                    $('#value'+i).addClass('enabled');
                    break enabledHeadersLoop;
                }
                else{
                    while(j < enabledHeaders.length){
                        if(j === enabledHeaders.length - 1){
                            console.log('Header is not enabled ___ CHANGING PROPERTIES...');
                            $('#name'+i).addClass('disabled');
                            $('#value'+i).addClass('disabled');
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
    /**
     * Gets all saved headers 
     * If any header has the same name and value as headername & headervalue, returns undefined. 
     * Otherwise adds the new header to the headers array, and saves it in chrome storage.
     */
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
            headers.splice(headers.length, 0, header); 
            $('#headerTable tbody tr:last').after 
            (
                '<tr>' + 
                '<td class="headerName">' + headerName + '</td>' + 
                '<td class="headerValue">' + headerValue + '</td>' + 
                '<td><button class="enable" id = "enable'+(headers.length-1)+'" type="button">enable</button></td>' + 
                '<td><button class="remove" id = "remove'+(headers.length-1)+'"type="button">remove</button></td>' + 
                '</tr>'
            ); 
            var id = $('#enable'+(headers.length-1)).prop('id');
            console.log('Id: ', id);
            chrome.storage.sync.set( {headers:headers}, function() {
                chrome.storage.sync.get( {headers:[]}, function(result) {//just for debugging, must be omitted
                    for (var i = 0; i < headers.length; i++) {//just for debugging, must be omitted
                        console.log('headers[' + i + '].name: ', headers[i].name, ' headers[' + i + '].value: ', headers[i].value)//just for debugging, must be omitted
                    }
                }); 
            }); 
        }); 
    }); 
    /**
    * Gets all enabled headers.
    * Adds the new enabled header to the enabled headers array and saves it back into chrome storage. 
    */	
    $(document).on('click', '#headerTable tbody tr td button.enable', function(event) {
        //convert button's id and class to 'disable'
        var id = event.target.id;
        var indexOfButtonNumericOrder = id.lastIndexOf('e')+1;
        var buttonNumericOrder = id.substring(indexOfButtonNumericOrder, id.length);
        var newId = "disable"+buttonNumericOrder;
        console.log('id: ', id, 'indexOfButtonNumericOrder: ', indexOfButtonNumericOrder, 'buttonNumericOrder for enable: ',buttonNumericOrder )
        $(this).prop({
            "id": newId,
            "class": "disable",
        });
        var newClass = $(this).prop('class');
        console.log('newId for enable: ', newId, '| newClass for enable: ', newClass);
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
                    for(var i = 0; i<result.enabledHeaders.length; i++){//just for debugging, must be omitted
                        console.log('enabledHeaders['+i+'].name: ', enabledHeaders[i].name, //just for debugging, must be omitted
                                    ' enabledHeaders['+i+'].name: ', enabledHeaders[i].value);//just for debugging, must be omitted
                    }
                });
            }); 
            chrome.runtime.sendMessage({
               enabledHeaders: enabledHeaders
            }); 
        }); 
        $(this).closest('tr').find('.headerName').removeClass('disabled').addClass('enabled');
        $(this).closest('tr').find('.headerValue').removeClass('disabled').addClass('enabled');
    }); 
    /**
     * Removes the header from enabledHeaders array (if it's saved there).
     * Finds header's name and value that are in the same row of the remove button.
     * Gets the saved headers. 
     * Removes the first found header that has the same name and value in the remove button's row.  
     * Saves the headers array back into chrome storage. 
     */
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
                        chrome.storage.sync.get({headers:[]}, function(result) {//just for debugging, must be omitted
                            for (var i = 0; i < result.headers.length; i++) {//just for debugging, must be omitted
                                console.log('headers[' + i + '].name: ', headers[i].name, 'headers[' + i + '].value: ', headers[i].value)
                            }
                            console.log('headers array length after removing elements: ', result.headers.length)//just for debugging, must be omitted
                        });
                    });
                    break FindHeaderToRemoveLoop;  
                }
            }
        }); 
        $(this).closest('tr').remove(); 
    }); 

    /**
     * Deletes all headers & enabledHeaders from chrome storage.
     * Chrome.storage.sync.clear() will also work, but it cannot be used here, since there is another urls array (In progress, not in this repository) that must be deleted separately from headers & enabledHeaders arrays (clear() will delete everything).
     */
    $(document).on('click', '#headerTable tfoot tr td button.clearHeaders', function(event){
        console.log('clear function was called'); 
        chrome.storage.sync.get({headers:[], enabledHeaders: []},function(result){
            var headers = result.headers;
            var enabledHeaders = result.enabledHeaders;

            headers.splice(0,headers.length);
            enabledHeaders.splice(0, enabledHeaders.length);
            chrome.storage.sync.set({enabledHeaders: enabledHeaders, headers: headers}, function(){
                chrome.storage.sync.get({headers:[], enabledHeaders: []}, function(result){
                    console.log('headers.length: ', result.headers.length,'enabledHeaders.length: ', result.enabledHeaders.length)
                })
            })
        })
        $('#tbody').html("<tr></tr>");
    });

    /**
     * Changes the id and class of the button to enable. 
     * Calls disableHeader to actually disable the header.
     * Changes the class of the relative row to disabled(for css).
     */
    $(document).on('click', '#headerTable tbody tr td button.disable', function(event) {
        var id = event.target.id;
        var indexOfButtonNumericOrder = id.lastIndexOf('e') + 1;
        var buttonNumericOrder = id.substring(indexOfButtonNumericOrder, id.length);
        console.log('id: ', id, 'indexOfButtonNumericOrder: ', indexOfButtonNumericOrder,'buttonNumericOrder for disable: ', buttonNumericOrder); 
        var newId = "enable"+buttonNumericOrder;
        $(this).prop({
            "id": newId,
            "class":"enable"
        });
        var newClass = $(this).prop("class");//just for debugging, must be omitted
        console.log('new ID for disable: '+newId+ '| new class for disable: '+newClass);//just for debugging, must be omitted
        disableHeader(newId);
        $('#'+newId).closest('tr').find('.headerName').removeClass('enabled').addClass('disabled');
        $('#'+newId).closest('tr').find('.headerValue').removeClass('enabled').addClass('disabled');
        document.getElementById(newId).childNodes[0].nodeValue = 'enable';
    });

    /**
     * Same logic as for remove header.
     * Gets saved enabled headers from chrome storage. 
     * Removes the first found enabled header that has the same name and value as the header to be removed.
     * saves the enabled headers array in chrome storage.
     * @param {*} buttonId 
     */
    function disableHeader(buttonId){
        var headerName = $('#'+buttonId).closest('tr').find('.headerName').html();
        var headerValue = $('#'+buttonId).closest('tr').find('.headerValue').html();
        console.log('headerName: ', headerName, 'headerValue: ', headerValue);
        chrome.storage.sync.get({enabledHeaders:[]},function(result){
            var enabledHeaders = result.enabledHeaders;
            FindHeaderToDisableLoop:
            for(var i = 0; i < enabledHeaders.length; i++){
                console.log('Looping through enabledHeaders...','\n',//just for debugging, must be omitted
                            'enabledHeaders['+i+'].name: ',enabledHeaders[i].name,'\n',
                            'enabledHeaders['+i+'].value: ', enabledHeaders[i].value);
                if(enabledHeaders[i].name === headerName && enabledHeaders[i].value === headerValue){
                    console.log('Following element was found: \n',
                                'headerName: '+ enabledHeaders[i].name + ' headerValue: ' + enabledHeaders[i].value +'\n',
                                'removing element...');
                    enabledHeaders.splice(i, 1);
                    chrome.storage.sync.set({enabledHeaders:enabledHeaders}, function(){
                        chrome.storage.sync.get({enabledHeaders:[]}, function(result){//just for debugging, must be omitted
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

