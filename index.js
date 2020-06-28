var express = require('express');
var bodyParser = require('body-parser');
let request = require('request');
const { response } = require('express');
const { json } = require('body-parser');

var app = express();

let subscriptionKey =  process.env.REEL_NEWS_BING_SUBSCRIPTION_KEY;
let host = 'https://reelsearch.cognitiveservices.azure.com';
let path = '/bing/v7.0/news/search';
let term = 'Microsoft';
let mkt = 'en-US'


// const http = require('http');

// const server = http.createServer((request, response) => {
//     response.writeHead(200, {"Content-Type": "text/plain"});
//     response.end("Hello World!");
// });

// const port = process.env.PORT || 1337;
// server.listen(port);

// console.log("Server running at http://localhost:%d", port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
   res.send('ReelNews');
})

app.get('/search', function (req, res) {

    let request_params = {
        method: 'GET',
        uri: host + path,
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey
        },
        qs: {
            q: term,
            mkt: mkt
        },
        json: true
    }

    request(request_params, function (error, response, body) {
        console.log(body)
    })
})

app.post('/article', function (req, res) {
    let title = req.body.title
    console.log("POOP")
    console.log(title)
    //let publisher = req.body.publisher;
    let request_params = {
        method: 'GET',
        uri: host + path,
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey
        },
        qs: {
            q: title,
            mkt: mkt
        },
        json: true
    }

    

    request(request_params, function (error, response, body) {
        console.log("Value: "+body.value)
        console.log("Title: "+body.title)
        let results = body.value.map(entry => [
            entry.name, entry.url, entry.provider[0].name
        ]
        );
        console.log(body);
        res.json(results);
    })
})

const port = process.env.PORT || 1337;

var server = app.listen(port, function () {
    
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
