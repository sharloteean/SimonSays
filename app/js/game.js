'use strict';

window.onload=function(e){
    init();
};

let simon = [];
let simonStored = [];
let answer = false;
let highScore = 0;

const delayTime = 400;

const colors = {
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

let colorArray = [];

function init() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
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

    localStorage.highScore = localStorage.highScore || 0;

    const start = document.body.querySelector('.start');
    const reset = document.body.querySelector('.reset');

    const game = document.body.querySelector('.game');
    const highScore = document.body.querySelector('.highScore');
    highScore.innerHTML = `HIGH SCORE : ${localStorage.highScore}`;
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
    const score = document.querySelector('.score');
    const highScore = document.body.querySelector('.highScore');
    simonStored = [];
    simon = [];
    add();
    score.innerHTML = `SCORE: 0`;
}

function resetGame(){
    const score = document.querySelector('.score');
    const highScore = document.body.querySelector('.highScore');
    simonStored = [];
    simon = [];
    score.innerHTML = `SCORE: 0`;
    highScore.innerHTML = 'HIGH SCORE : 0';
    localStorage.highScore = 0;
}

function clickHandler(e){
    const number = colors[e.target.parentNode.className][e.target.className].value;
    if(answer === true){
        answer = false;
        play(colors[e.target.parentNode.className][e.target.className].frequency);
        changeState(e.target.className,'on');
        answerHandler(number);
    }
}

function allocateData(){
    let count = 0;
    let freq = 200;
    for(let i in colors){
        for(let j in colors[i]){
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
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = freq;
    gainNode.gain.value = 1;
    oscillator.start();

    oscillator.stop(delayTime/1000);
    oscillator.onended = function closeContext(){
        context.close();
    };
}

function changeState(elementID, className){
    const element = document.querySelector(`.${elementID}`);

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
        return
    }
    window.events.trigger(
        'wrong'
    );
}

function correctHandler(){
    const score = document.querySelector('.score');
    const highScore = document.body.querySelector('.highScore');
    answer = true;
    simon.shift();
    if(simon.length === 0){
        changeState('gameBody', 'right');
        score.innerHTML = `SCORE: ${simonStored.length}`;
        if(simonStored.length > Number(localStorage.highScore)){
            localStorage.highScore = simonStored.length;
            highScore.innerHTML = `HIGH SCORE :${localStorage.highScore}`;
        }
        setTimeout(
            function(){
                add();
            },
            delayTime + 300
        );
    }
}

function wrongHandler(){
    simonStored = [];
    simon = [];
    const element = document.querySelector('.gameBody');

    element.classList.toggle('wrong');
    setTimeout(
        function(){
            element.classList.toggle('wrong');
        },
        delayTime + 200
    );
}
