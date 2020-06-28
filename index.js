var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
let request = require('request');
const { response } = require('express');
const { json } = require('body-parser');

let subscriptionKey =  process.env.REEL_NEWS_BING_SUBSCRIPTION_KEY;
let host = 'https://reelsearch.cognitiveservices.azure.com';
let path = '/bing/v7.0/news/search';
let entities_path = '/bing/v7.0/entities';

let mkt = 'en-US'

var app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
   res.send('ReelNews');
})

app.post('/article', function (req, res) {
    let title = req.body.title
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
            mkt: mkt,
            count: 10
        },
        json: true
    }

    let realML = function(articleText) {
        console.log(articleText)
        let request_params = {
            method: 'POST',
            uri: "https://reelnewsdjango.azurewebsites.net/score",
            body: {
                text: articleText
            },
            headers: {
                'Content-Type': "application/json"
            },
            json: true
        }
        return new Promise(function(resolve, reject){
            request (request_params, function (error, response, body) {
                var leaningText = "Neutral";
                if (body.score == 1) {
                    leaningText = "Left";
                } else if (body.score == 2) {
                    leaningText = "Leans Left";
                } else if (body.score == 4) {
                    leaningText = "Leans Right";
                }else if (body.score == 5) {
                    leaningText = "Right";
                }
                resolve(leaningText);
            })
        })
    }
    
    let ML = function(publisher) {
        if (publisher.includes("CNN")) {
            return "Left";
        } else if (publisher.includes("New York Times")) {
            return "Left";
        } else if (publisher.includes("NBC")) {
            return "Leans Left";
        }else if (publisher.includes("Vox")) {
                return "Left";
        } else if (publisher.includes("MSN")) {
            return "Neutral";
        } else if (publisher.includes("Straits")) {
            return "Leans Right";
        } else if (publisher.includes("Al Jazeera")) {
            return "Leans Left";
        } else if (publisher.includes("PRI")) {
            return "Leans Left";
        }  else if (publisher.includes("YAHOO")) {
            return "Leans Left";
        } else if (publisher.includes("Fox")) {
            return "Right";
        } else if (publisher.includes("Daily Mail")) {
            return "Right";
        } else if (publisher.includes("New York Post")) {
            return "Right";
        } else {
            return "Leans Left";
        }
    }

    request(request_params, function (error, response, body) {

        Promise.all(body.value.map(entry => realML(entry.name)))
        .then(values => {
                let results = body.value.map(function(e, i) {
                    return [e.name, e.url, e.provider[0].name, ML(e.provider[0].name), values[i]]
                    });
                console.log(values);
                console.log(results)
                res.json(results);
            })
    })
})

const port = process.env.PORT || 1337;

var server = app.listen(port, function () {
    
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
