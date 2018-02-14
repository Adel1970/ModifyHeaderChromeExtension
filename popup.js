$(function () {
    chrome.storage.sync.get( {headers:[]}, function(result) {
        var headers = result.headers; 
        console.log('row headers array', headers); 
        for (var i = 0; i < headers.length; i++) {
            console.log('headers[' + i + ']:', headers[i]); 
            console.log('headers[' + i + '].name: ', headers[i].name, 'headers[' + i + '].value: ', headers[i].value)
            $('#headerTable tr:last').after(
                '<tr>' + 
                '<td class="nameClass" id="name' + i + '">' + headers[i].name + '</td>' + 
                '<td class="valueClass" id="value' + i + '">' + headers[i].value + '</td>' + 
                '<td ><button class="enable" id="enable' + i + '" type="button">enable</button></td>' + 
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
            '</tr>'); 
        chrome.storage.sync.get( {headers:[]}, function(result) {
        var headers = result.headers; 
        var header =  {
            'name':name, 
            'value':value
        }
        headers.push(header); 
        chrome.storage.sync.set( {headers:headers}, function() {
            chrome.storage.sync.get( {headers:[]}, function(result) {
                console.log('headers array after calling set: ' + result.headers); 
            }); 
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
}); 
