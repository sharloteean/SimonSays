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
        light:{},
        lightMedium:{},
        darkMedium:{},
        dark:{}
    },
    blue:{
        light : {},
        lightMedium: {},
        darkMedium: {},
        dark:{}
    },
    purple: {
        light : {},
        lightMedium: {},
        darkMedium: {},
        dark:{}
    },
    red: {
        light : {},
        lightMedium: {},
        darkMedium: {},
        dark:{}
    }
};

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
    colors.red.button = document.querySelector('.red');
    colors.purple.button = document.querySelector('.purple');
    colors.blue.button = document.querySelector('.blue');
    colors.green.button = document.querySelector('.green');

    colors.red.name = 'red';
    colors.purple.name = 'purple';
    colors.blue.name = 'blue';
    colors.green.name = 'green';

    start.addEventListener(
        'click',
        startGame
    );

    colors.red.button.addEventListener(
        'click',
        clickHandler
    );

    colors.purple.button.addEventListener(
        'click',
        clickHandler
    );

    colors.blue.button.addEventListener(
        'click',
        clickHandler
    );

    colors.green.button.addEventListener(
        'click',
        clickHandler
    );

    reset.addEventListener(
        'click',
        resetGame
    );
}

function startGame(){
    add();
}

function resetGame(){
    console.log('the game will be reset');
}

function clickHandler(e){
    console.log(this.className);
    if(answer === true){
        play(200);
        answer = false;
        answerHandler(0);
    }
}


function add(){

    simonStored.unshift(Math.round((Math.random() * 100) % 3));
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
    switch (simon[0]) {
        case 0:
            colors.purple.button.classList.toggle('on');
            play(200);
            setTimeout(
                function(){
                    colors.purple.button.classList.toggle(
                        'on'
                    );
                    simon.shift();
                    window.events.trigger(
                        'ask'
                    );
                },
                800
            );
            break;
        case 1:
            colors.red.button.classList.toggle('on');
            play(225);
            setTimeout(
                function(){
                    colors.red.button.classList.toggle(
                        'on'
                    );
                    simon.shift();
                    window.events.trigger(
                        'ask'
                    );
                },
                800
            );
            break;
        case 2:
            colors.blue.button.classList.toggle('on');
            play(250);
            setTimeout(
                function(){
                    colors.blue.button.classList.toggle(
                        'on'
                    );
                    simon.shift();
                    window.events.trigger(
                        'ask'
                    );
                },
                800
            );
            break;
        case 3:
            colors.green.button.classList.toggle('on');
            play(275);
            setTimeout(
                function(){
                    colors.green.button.classList.toggle(
                        'on'
                    );
                    simon.shift();
                    window.events.trigger(
                        'ask'
                    );
                },
                800
            );
            break;
    }
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

function play(freq){
    window.AudioContext = window.AudioContext;
    var context = new AudioContext();
    var sound = context.createOscillator();
    sound.connect(context.destination);
    sound.frequency.value = freq;

    sound.start(0);
    sound.stop(0.5);
    sound.onended = function closeContext(){
        context.close();
    };
}
