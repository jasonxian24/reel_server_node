var express = require('express');
var bodyParser = require('body-parser');
let request = require('request');
const { response } = require('express');

var app = express();

let subscriptionKey =  process.env['REEL_NEWS_BING_SUBSCRIPTION_KEY'];
let host = 'https://reelsearch.cognitiveservices.azure.com';
let path = '/bing/v7.0/news/search';
let term = 'Microsoft';
let mkt = 'en-US'

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
   console.log("Title: %s, Publisher: %s", req.body.title, req.body.publisher);
   res.send("Thanks!");
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})