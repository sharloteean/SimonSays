var os = require('os');
var server=require('../../server/http.js');

server.deploy(
    {
        verbose: false,
        port: 6174,
        root:'./SimonSays/'
    }
);
