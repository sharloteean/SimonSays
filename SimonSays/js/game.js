window.onload=function(e){
    init();
};

var event = null;
var simon = [];
var simonStored = [];

function init() {
    var event = new window.pubsub();

    event.on(
        'ask',
        askHandler
    );

    event.on(
        'correct',
        correctHandler
    );

    event.on(
        'wrong',
        wrongHandler
    );
}

function add(){
    simonStored.unshift(Math.round((Math.random() * 100) % 3));
    simon = simonStored.slice();

    console.log('stored array :',simonStored);

    event.trigger(
        'ask'
    );
}

function askHandler(){
    console.log('asked');
}

function answerHandler(answer){
    if (Number(answer) == simon[0]){
        event.trigger(
            'correct'
        );
    }else{
        event.trigger(
            'wrong'
        );
    }
}

function correctHandler(){
    simon.shift();
    if(simon.length === 0){
        add();
        return;
    }

    event.trigger(
        'ask'
    );
}

function wrongHandler(){
    console.log('wrong');
    simonStored = [];
    simon = [];
    add();
}
