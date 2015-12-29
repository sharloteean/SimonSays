window.onload=function(e){
    init();
};

function init(){
    var game = document.querySelector('.game');

    game.addEventListener(
        'click',
        play
    );
}

function play(freq){
    window.AudioContext = window.AudioContext;
    var context = new AudioContext();
    var oscillator = context.createOscillator();
    var gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = freq;

    gainNode.gain.value = 1;

    // var now = Date.now();
    // var period =(6 / (Math.PI * 2));

    oscillator.start();

    // while((Date.now() - now) < 370){
    //     if((Date.now() - now) > 185){
    //         gainNode.gain.value = Math.sin(period * ((Date.now() - now)/100));
    //         console.log((Date.now() - now) < 370 && (Date.now() - now) > 185);
    //     }
    // }

    oscillator.stop(delayTime);
    oscillator.onended = function closeContext(){
        context.close();
    };
}
