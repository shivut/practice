let apiconfig = require('../config/apiplatform');
let request = require('request');
let utils = require('../common/utils');

exports.getToken = function (req, callback) {
    let tokenurl = apiconfig.url + '/gettoken';
    let headers = {
        'Content-Type': 'application/json'
    };

    let username = req.body.username;
    let password = req.body.password;

    //console.log("token "  + JSON.stringify(token));

    let postData = JSON.stringify({

        "user": {
            "username": username,
            "password": password,
            "type": "localuser"
        }
    });

    request.post({url: tokenurl , headers:headers , body: postData}, function(err,httpResponse, body){

        if(err == null){

            if(httpResponse["statusCode"] != 200){
                console.log("Error:  " + JSON.stringify(body));
                callback("Unable to get token", null, "Unable to get token");
                return;
            }

            //console.log("body " + JSON.stringify(body));
            let responseJson = JSON.parse(body);
            let token = responseJson['data']['token'];

            callback(null, {token: token}, "Got token");
        }
        else{
            console.log("Error: " + JSON.stringify(body));
            callback("Error while getting fuel", null, "Error while getting fuel");
        }
    });
};

exports.verifyToken = function(req, res, next) {

    // utils.callAPIPlatform("/verifytoken", req.body, function(err, data, msg) {
    //     if (!err) {
    //         next();
    //     } else {
    //         let isAuthFailure = utils.isAuthFailure(msg);
    //         utils.failReply(err, msg, res);
    //     }
    // });


    requrl = apiconfig.url+"/verifytoken"

    let options = {
        uri: requrl,
        method: 'POST',
        json: req.body
    };

    request(options, function (err, response, body) {
        if (!err){

            let msg = body.msg;

            if (response.statusCode == 401) {
                console.log("Error " + JSON.stringify(body));
                utils.authFailure(msg, res);
            } else {
                next();
            }

        } else {
            console.log("Error " + JSON.stringify(body));
            console.log("Error " + err);
            utils.failReply(err, body, res);
        }
    });
}