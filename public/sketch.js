var socket;
var text = {
    text: ''
};
var editor = CodeMirror.fromTextArea(document.getElementById("code_text"), {
    lineNumbers: true,
    lineWrapping: true,
    indentWithTabs: true,
    mode: "text/x-java",
    matchBrackets: true,
    viewportMargin: Infinity
});
var visualizer = CodeMirror.fromTextArea(document.getElementById("server_text"), {
    lineNumbers: true,
    mode: "text/x-java",
    matchBrackets: true,
    readOnly: true,
    viewportMargin: Infinity
});

function setup(){
    socket = io.connect('http://localhost:8080' || 'https://java-kata-helper.herokuapp.com/');
    var oldVal = "";
    editor.on("change",function(cm,changeObj){
        var currentVal = editor.getValue();
        if(currentVal == oldVal) {
            return;
        }

        oldVal = currentVal;
        socket.emit('text', currentVal);
    });

    socket.on('text', handleReceivedText);
    socket.on('newUser', updateText);
    socket.on('compiled', updateOutput);
}

function updateText(data){
    //todo update visualizer with data
    //var cursorPosition = $('#code_text').prop("selectionStart");
    //$('#code_text').val(data.text);
    //$('#code_text').prop("selectionStart", cursorPosition)
}

function updateOutput(data){
     $('#output').val(data);
}

function handleReceivedText(data){
    console.log(data);
    text.text = data;
    if (data != visualizer.getValue()) {
        visualizer.setValue(data);
    }
}

function pullFromServer() {
    editor.setValue(visualizer.getValue())
}

function compileRun(){
    socket.emit('compile',
        {
            code: editor.getValue(),
            args: $("#args").val()
        });
}