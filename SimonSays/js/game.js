window.onload=function(e){
    init();
};

var simon = [];
var simonStored = [];
var start;
var reset;
var answer = false;

var delayTime = 400;

var colors = {
    green:{
        lightGreen:{},
        lightMediumGreen:{},
        darkMediumGreen:{},
        darkGreen:{}
    },
    blue:{
        lightBlue: {},
        lightMediumBlue: {},
        darkMediumBlue: {},
        darkBlue:{}
    },
    purple: {
        lightPurple: {},
        lightMediumPurple: {},
        darkMediumPurple: {},
        darkPurple:{}
    },
    red: {
        lightRed: {},
        lightMediumRed: {},
        darkMediumRed: {},
        darkRed:{}
    }
};

var colorArray = [];

function init() {
    window.events = new window.pubsub();

    window.events.on(
        'ask',
        askHandler
    );

    window.events.on(
        'correct',
        correctHandler
    );

    window.events.on(
        'wrong',
        wrongHandler
    );

    var start = document.querySelector('.start');
    var reset = document.querySelector('.reset');

    var game = document.querySelector('.game');

    start.addEventListener(
        'click',
        startGame
    );

    reset.addEventListener(
        'click',
        resetGame
    );

    game.addEventListener(
        'click',
        clickHandler
    );

    allocateData();
}

function startGame(){
    var score = document.getElementById('count');
    add();
    score.innerHTML = 0;
}

function resetGame(){
    var score = document.getElementById('count');
    simonStored = [];
    simon = [];
    score.innerHTML = 0;
}

function clickHandler(e){
    var number = colors[e.target.parentNode.className][e.target.className].value;
    if(answer === true){
        answer = false;
        play(colors[e.target.parentNode.className][e.target.className].frequency);
        changeState(e.target.className,'on');
        answerHandler(number);
    }
}

function allocateData(){
    var count = 0;
    var freq = 200;
    for(var i in colors){
        for(var j in colors[i]){
            colors[i][j].frequency = freq;
            freq = freq + 25;
            colorArray[count] = {
                color : i,
                shade : j,
                info : colors[i][j]
            };
            colors[i][j].value = count;
            count++;
        }
    }
}

function add(){

    simonStored.push(Math.round((Math.random() * 100) % 15));
    simon = simonStored.slice();

    console.log('stored array :',simonStored);

    window.events.trigger(
        'ask'
    );
}

function askHandler(){
    if(simon.length === 0){
        simon = simonStored.slice();
        answer = true;
        return;
    }

    play(colorArray[simon[0]].info.frequency);
    changeState(colorArray[simon[0]].shade, 'on');

    setTimeout(
        function(){
            simon.shift();
            window.events.trigger(
                'ask'
            );
        },
        delayTime
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
    //     //if((Date.now() - now) > 185){
    //         gainNode.gain.value = Math.sin(period * ((Date.now() - now)/100));
    //     //}
    // }

    oscillator.stop(delayTime/1000);
    oscillator.onended = function closeContext(){
        context.close();
    };
}

function changeState(elementID, className){
    var element = document.querySelector('.'+ elementID);

    element.classList.toggle(className);

    setTimeout(
        function(){
            element.classList.toggle(className);
        },
        delayTime
    );
}

function answerHandler(response){
    if (Number(response) === simon[0]){
        window.events.trigger(
            'correct'
        );
    }else{
        window.events.trigger(
            'wrong'
        );
    }
}

function correctHandler(){
    var score = document.getElementById('count');
    answer = true;
    simon.shift();
    if(simon.length === 0){
        changeState('gameBody', 'right');
        setTimeout(
            function(){
                add();
            },
            delayTime + 300
        );
    }
    score.innerHTML = simonStored.length;
}

function wrongHandler(){
    console.log('lol wrong!');
    simonStored = [];
    simon = [];
    var element = document.querySelector('.gameBody');

    element.classList.toggle('wrong');
    setTimeout(
        function(){
            element.classList.toggle('wrong');
        },
        (delayTime + 200)
    );
}
