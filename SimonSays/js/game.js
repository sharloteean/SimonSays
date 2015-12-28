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
    add();
}

function resetGame(){
    simonStored = [];
    simon = [];
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
    var sound = context.createOscillator();
    sound.connect(context.destination);
    sound.frequency.value = freq;

    sound.start(0);
    sound.stop(delayTime/1000);
    sound.onended = function closeContext(){
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
