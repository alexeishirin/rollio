var express = require('express');
var path = require('path');
var compression = require('compression');
var oauth2 = require('salesforce-oauth2');
var requestLib = require('request');

var callbackUrl = "localhost:8080/api/salesforce/oauth/callback",
    consumerKey = "3MVG9A2kN3Bn17huP7U2.vrcoDFZjUhnQBEoKVs_aHq678Hub3_j5H2OvlAM6NsbsIBwbf4qugv5T6d4Brua0",//"3MVG9ZL0ppGP5UrBuRuxBhrbA9O1BLUOR0SavvPOlKsfpE5zl2EpaIfl1a.h19vlX6_VgnS5p261KJT7_8sYn",
    consumerSecret = "1244794002532689121";

var port = 8080;
var app = express();
app.use(compression());
app.use(express.static(path.resolve(__dirname, '../public')));

app.get("/api/salesforce/oauth/callback", function (request, response){
    var authorizationCode = request.param('code');
    console.log("called back");
    console.log(request.param('code'));

    oauth2.authenticate({
        redirect_uri: callbackUrl,
        client_id: consumerKey,
        // client_secret: consumerSecret,
        code: authorizationCode
    }, function(error, payload) {
        console.log("!!!!Error: " + JSON.stringify(error, null, 4));
        console.log(payload);
            requestLib.post({url:'https://rollio-production.herokuapp.com/v1/token',
                    method: "POST",
                    json:
                    {
                        "access_token": payload.access_token, // Access token received from Salesforce authentication
                        "client_id": consumerKey, // Salesforce client ID
                        "identity_url": payload.id, // From Salesforce
                        "instance_url": payload.instance_url, // From Salesforce
                        "refresh_token": payload.refresh_token, // From Salesforce
                        "user_id": "005280000037z8AAAQ" // From Salesforce
                    }
                },
                function (error, resp, body) {
                    console.log(error);
                    response.json(body);
                }
            );
    });

});

app.get("/api/salesforce/login", function (request, response){
    var uri = oauth2.getAuthorizationUrl({
        redirect_uri: callbackUrl,
        client_id: consumerKey,
        scope: 'refresh_token'
    });

    return response.redirect(uri);
});

app.get("/api/rollio/token", function (req, response){
    var debrief = req.param('debrief');
    requestLib.post({url:'https://rollio-production.herokuapp.com/v1/token',
            method: "POST",
            json:
            {
                "access_token": "00D28000001JdRo!AREAQAzt95t_ur5L1Mek5C9uTdk9fA0.j1PCpQ9dhQOCDD2cDubkmbCMc0BM553FRVNsyvP9qo9HR04DW0VNWtETdYYuK2r.", // Access token received from Salesforce authentication
                "client_id": "3MVG9ZL0ppGP5UrBuRuxBhrbA9O1BLUOR0SavvPOlKsfpE5zl2EpaIfl1a.h19vlX6_VgnS5p261KJT7_8sYn", // Salesforce client ID
                "identity_url": 'https://login.salesforce.com/id/00D28000001JdRoEAK/005280000037z8AAAQ', // From Salesforce
                "instance_url": 'https://ap2.salesforce.com', // From Salesforce
                "refresh_token": "00D28000001JdRo!AREAQAzt95t_ur5L1Mek5C9uTdk9fA0.j1PCpQ9dhQOCDD2cDubkmbCMc0BM553FRVNsyvP9qo9HR04DW0VNWtETdYYuK2r.", // From Salesforce
                "user_id": "005280000037z8AAAQ" // From Salesforce
            }
        },
        function (error, resp, body) {
            console.log(error);
            response.json(body);
        }
    );
});

app.get("/api/chat", function (req, response){
    var debrief = req.param('debrief');
    requestLib({url: 'https://rollio-develop.herokuapp.com/v1/bdcf2377-d344-4777-a225-2e512fe57d96/chat',
            headers: {
                'Content-Type': 'application/json'
            },
            json : {
                "debrief": "this is it"
            },
            method: 'POST'
        },
        function (error, resp, body) {
            console.log(error);
            response.json(body);
        }
    );
});

app.get('/*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('This express app is listening on port:' + port);
});
