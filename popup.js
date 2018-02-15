$(function () {
    chrome.storage.sync.get( {headers:[]}, function(result) {
        var headers = result.headers; 
        console.log('row headers array', headers); 
        for (var i = 0; i < headers.length; i++) {
            console.log('headers[' + i + ']:', headers[i]); 
            console.log('headers[' + i + '].name: ', headers[i].name, ' headers[' + i + '].value: ', headers[i].value)
            $('#headerTable tr:last').after(
                '<tr>' + 
                '<td class="nameClass" id="name' + i + '">' + headers[i].name + '</td>' + 
                '<td class="valueClass" id="value' + i + '">' + headers[i].value + '</td>' + 
                '<td><button class="enable" id="enable' + i + '" type="button">enable</button></td>' + 
                '<td><button class="remove" id="remove'+i+'" type="button">remove</button></td>' +
                '</tr>'); 
                console.log($('.enable').attr('id'))
        }
    }); 
    $('#addHeader').click(function () {
        var name = $('#addName').val(); 
        var value = $('#addValue').val(); 
        $('#headerTable tr:last').after(
            '<tr>' + 
            '<td class="nameClass">' + name + '</td>' + 
            '<td class="valueClass">' + value + '</td>' + 
            '<td><button class="enable" type="submit">enable</button></td>' + 
            '<td><button class="remove" type="button">remove</button></td>' +
            '</tr>'); 
        chrome.storage.sync.get({headers:[]}, function(result) {
        var headers = result.headers; 
        var header =  {
            'name':name, 
            'value':value
        }
        headers.push(header); 
        chrome.storage.sync.set( {headers:headers}, function() {
            chrome.storage.sync.get( {headers:[]}, function(result) {//just for testing, must be omitted
                for (var i = 0; i < headers.length; i++) {
                    console.log('headers[' + i + ']:', headers[i]); 
                    console.log('headers[' + i + '].name: ', headers[i].name, ' headers[' + i + '].value: ', headers[i].value) //just for testing, must be omitted
                }}); 
        }); 
    }); 
}); 
    
    $(document).on('click', '#headerTable tbody tr td button.enable', function(event){
        console.log('click function');
        var headerName = $(this).closest('tr').find('.nameClass').html(); 
        var headerValue = $(this).closest('tr').find('.valueClass').html(); 
        console.log('click function headerName: ', headerName, '\n', 'click function headerValue: ', headerValue); 
        chrome.runtime.sendMessage( {
                headerName: headerName,
                headerValue: headerValue
        }); 
    }); 
    $(document).on('click', '#headerTable tbody tr td button.remove', function(event){
        console.log('remove function called');
        var buttonId = event.target.id;
        console.log('buttonId: ', buttonId);
        var IndexOfButtonNumericOrder = event.target.id.lastIndexOf('e') +1;
        console.log('buttonNumericOrderIndex:', IndexOfButtonNumericOrder);
        var buttonNumericOrder = event.target.id.substring(IndexOfButtonNumericOrder, buttonId.length);
             $(this).closest('tr').remove();
        console.log('buttonNumericOrder: ',buttonNumericOrder);
        chrome.storage.sync.get({headers:[]}, function(result){
            var headers = result.headers;
            for (var i = 0; i < headers.length; i++) {
                console.log('headers[' + i + '].name: ', headers[i].name, ' headers[' + i + '].value: ', headers[i].value)
            }
            // if()
            // buttonNumericOrder = --buttonNumericOrder;
            // console.log('ButtonNumericOrder after decrementing: ',buttonNumericOrder)
            headers.splice(buttonNumericOrder, 1);
            // console.log('headers[' + buttonNumericOrder + '].name: ', headers[buttonNumericOrder].name, 'headers[' + buttonNumericOrder + '].value: ', headers[buttonNumericOrder].value)
            chrome.storage.sync.set({headers: headers}, function(){
                chrome.storage.sync.get({headers:[]}, function(result){//just for testing, must be omitted
                    for (var i = 0; i < headers.length; i++) {
                        console.log('headers[' + i + '].name: ', headers[i].name, 'headers[' + i + '].value: ', headers[i].value)
                    }
                    console.log('headers array after removing elements: ', result.headers.length)//just for testing, must be omitted
                });
            });
        });
   
    });
}); 
