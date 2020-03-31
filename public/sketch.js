var socket;
var text = {
    text: ''
};

function setup(){
    socket = io.connect('https://java-kata-helper.herokuapp.com/' || 'http://localhost:8080');
    var oldVal = "";
    $('#code_text').on("keyup", function() {
        var currentVal = $(this).val();
        if(currentVal == oldVal) {
            return; //check to prevent multiple simultaneous triggers
        }

        oldVal = currentVal;
        //action to be performed on textarea changed
        socket.emit('text', currentVal);
    });

    socket.on('text', handleReceivedText);
    socket.on('newUser', updateText);
}

function updateText(data){
    var cursorPosition = $('#code_text').prop("selectionStart");
    $('#code_text').val(data.text);
    $('#code_text').prop("selectionStart", cursorPosition)
}

function handleReceivedText(data){
    console.log(data);
    text.text = data;

    if (data != $('#code_text').val()) {
        var cursorPosition = $('#code_text').prop("selectionStart");
        $('#code_text').val(data);
        $('#code_text').prop("selectionStart", cursorPosition)
        $('#code_text').prop("selectionEnd", cursorPosition)
    }
}


