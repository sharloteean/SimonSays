window.onload=function(e){
    init();
}
var context;
var sound;

function init() {
    console.log('context loaded')
    var button = document.querySelector('.soundButton');
    button.addEventListener(
        'click',
        play
    );
}

function play() {
    window.AudioContext = window.AudioContext;
    context = new AudioContext();
    sound = context.createOscillator();
    sound.connect(context.destination);
    sound.frequency.value = 200;

    sound.start(0);
    sound.stop(0.5);
    sound.onended = playHandler;
}

function playHandler(){
    context.close();
}
