let compression = require('compression');
let express     = require('express');
let bodyParser  = require('body-parser');
let morgan      = require('morgan');
let jwt    = require('jsonwebtoken');
let http = require('http');


let appconfig = require('./app/config/appconfig.js');

let app = express();
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(function (req, res, next) {
    console.log("Request: " + JSON.stringify(req.body));
    next();
});
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

require('./app/token/tokenRoutes')(app, console);
require('./app/location/locationRoutes')(app, console);


let server = http.Server(app);

server.listen(appconfig.apiport, function(){

    console.log('Platform REST API server listening at :' + appconfig.apiport);
});
