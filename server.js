var os = require('os');
var server=require('node-http-server');

server.deploy(
    {
        verbose: false,
        port: 6174,
        root:'./app'
    }
);
