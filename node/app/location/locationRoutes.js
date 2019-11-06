module.exports = function(app, console) {
    let utils = require('../common/utils');
    let locationjs = require('./location');
    let token = require('../token/token');

    app.post('/api/yedvanshitech/getlastlocation',  function (req, res, next) {
            utils.verifyapiargs(req.body, res, next, ['vehicleno', 'token']);
        },  function (req, res) {
            locationjs.getLastLocation(req, utils.generalCallback(res));
        }
    );

    app.post('/api/yedvanshitech/getlocationhistory', function (req, res, next) {
            utils.verifyapiargs(req.body, res, next, ['vehicleno', 'starttime', 'endtime', 'token']);
        },  function (req, res) {
            locationjs.getLocationHistory(req, utils.generalCallback(res));
        }
    );

    app.post('/api/yedvanshitech/getdistance', function (req, res, next) {
            utils.verifyapiargs(req.body, res, next, ['vehicleno', 'token', 'starttime', 'endtime']);
        },  function (req, res) {
            locationjs.getDistance(req, utils.generalCallback(res));
        }
    );


    app.post('/api/yedvanshitech/getnearbyvehicles', function (req, res, next) {
        utils.verifyapiargs(req.body, res, next, ['token', 'lat', 'lng', 'radius']);
    },  function (req, res) {
        locationjs.getVehiclesByLatLng(req, utils.generalCallback(res));
    }
);
};
