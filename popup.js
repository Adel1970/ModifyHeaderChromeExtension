$(function () {
    chrome.storage.sync.get(['name', 'value'], function(items) {
        $('#name').html(items.name); 
        $('#value').html(items.value); 
    }); 
    $('#addHeader').click(function () {
        // chrome.storage.sync.get(['name', 'value'], function(items) {
        var name = $('#addName').val(); 
        var value = $('#addValue').val(); 
        chrome.storage.sync.set({'name':name});
        chrome.storage.sync.set({'value':value});
                $('#name').text(name); 
                $('#value').text(value); 
            })
    }); 

