window.onload=function(e){
    init();
};

var simon = [];
var simonStored = [];
var start;
var reset;
var answer = false;

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

    allocateFrequency();
}

function startGame(){
    add();
}

function resetGame(){
    console.log('the game will be reset');
}

function clickHandler(e){
    if(answer === true){
        changeState(e.target.parentNode.className, e.target.className);
        answer = false;
    }
}

function allocateFrequency(){
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
            count++;
        }
    }
}

function add(){

    simonStored.unshift(Math.round((Math.random() * 100) % 15));
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
    changeState(colorArray[simon[0]].color,colorArray[simon[0]].shade);
    
    setTimeout(
        function(){
            simon.shift();

            window.events.trigger(
                'ask'
            );
        },
        300
    );
}

function play(freq){
    window.AudioContext = window.AudioContext;
    var context = new AudioContext();
    var sound = context.createOscillator();
    sound.connect(context.destination);
    sound.frequency.value = freq;

    sound.start(0);
    sound.stop(0.3);
    sound.onended = function closeContext(){
        context.close();
    };
}

function changeState(color, shade){
    var element = document.querySelector('.'+ shade);

    element.classList.toggle('on');

    setTimeout(
        function(){
            element.classList.toggle('on');
        },
        300
    );
}

function answerHandler(answer){
    if (Number(answer) == simon[0]){
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
    simon.shift();
    answer = true;
    if(simon.length === 0){
        add();
        return;
    }
}

function wrongHandler(){
    console.log('wrong');
    simonStored = [];
    simon = [];
    add();
}
