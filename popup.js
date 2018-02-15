$(function () {
    chrome.storage.sync.get({headers:[], enabledHeaders:[]}, function(result) {
        var headers = result.headers; 
        var enabledHeaders = result.enabledHeaders;
        for(var i = 0; i<enabledHeaders.length; i++){
            console.log('enabledHeaders[' + i + '].name: ', enabledHeaders[i].name, ' enabledHeaders[' + i + '].value: ', enabledHeaders[i].value)
        }
        console.log('row headers array', headers); 
        for (var i = 0; i < headers.length; i++) {
            console.log('headers[' + i + ']:', headers[i]); 
            console.log('headers[' + i + '].name: ', headers[i].name, ' headers[' + i + '].value: ', headers[i].value)
            $('#headerTable tr:last').after(
                '<tr>' + 
                '<td class="nameClass" id="name' + i + '">' + headers[i].name + '</td>' + 
                '<td class="valueClass" id="value' + i + '">' + headers[i].value + '</td>' + 
                '<td><button class="enable" id="enable' + i + '" type="button">enable</button></td>' + 
                '<td><button class="remove" id="remove' + i + '" type="button">remove</button></td>' + 
                '</tr>'
            ); 
            for(var j = 0; j<enabledHeaders.length; j++){     
                if(headers[i].name === enabledHeaders[j].name && headers[i].value === enabledHeaders[j].value){
                    $('#name'+i).css({"background-color": "#00FA9A"});
                    $('#value'+i).css({"background-color": "#00FA9A"});
                }   
            }   
        }
    }); 
    $('#addHeader').click(function () {
        var headerName = $('#addName').val(); 
        var headerValue = $('#addValue').val(); 
        $('#headerTable tr:last').after
        (
            '<tr>' + 
            '<td class="nameClass">' + headerName + '</td>' + 
            '<td class="valueClass">' + headerValue + '</td>' + 
            '<td><button class="enable" type="button">enable</button></td>' + 
            '<td><button class="remove" type="button">remove</button></td>' + 
            '</tr>'
        ); 
        chrome.storage.sync.get( {headers:[]}, function(result) {
            var headers = result.headers; 
            var header =  {
                'name':headerName, 
                'value':headerValue
            }
            headers.push(header); 
            chrome.storage.sync.set( {headers:headers}, function() {
                chrome.storage.sync.get( {headers:[]}, function(result) {//just for testing, must be omitted
                    for (var i = 0; i < headers.length; i++) {
                        console.log('headers[' + i + ']:', headers[i]); 
                        console.log('headers[' + i + '].name: ', headers[i].name, ' headers[' + i + '].value: ', headers[i].value)//just for testing, must be omitted
                    }
                }); 
            }); 
        }); 
    }); 
    
    $(document).on('click', '#headerTable tbody tr td button.enable', function(event) {
        console.log('click function'); 
        var headerName = $(this).closest('tr').find('.nameClass').html(); 
        var headerValue = $(this).closest('tr').find('.valueClass').html();
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
                        console.log('enabledHeaders['+i+'].name: ', enabledHeaders[i].name, ' enabledHeaders['+i+'].name: ', enabledHeaders[i].value);
                    }
                });
            }); 
            chrome.runtime.sendMessage({
               enabledHeaders: enabledHeaders
            }); 
        }); 
        $(this).closest('tr').find('.nameClass').css({"background-color": "#00FA9A"});
        $(this).closest('tr').find('.valueClass').css({"background-color": "#00FA9A"}); 
    }); 

    $(document).on('click', '#headerTable tbody tr td button.remove', function(event) {
        var headerName = $(this).closest('tr').find('.nameClass').html(); 
        var headerValue = $(this).closest('tr').find('.valueClass').html(); 
        chrome.storage.sync.get( {headers:[]}, function(result) {
            var headers = result.headers; 
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
                    break;  
                }
            }
        }); 
        $(this).closest('tr').remove(); 
    }); 
    $(document).on('click', '#headerTable tfoot tr td button.clearHeaders', function(event){
        console.log('clear function was called'); 
        chrome.storage.sync.clear();
        $('#tbody').empty()
    });
}); 

