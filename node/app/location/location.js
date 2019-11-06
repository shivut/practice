let request = require('request');
let apiconfig = require('../config/apiplatform');
let utils = require('../common/utils');
let Q = require('q');

exports.getLastLocation = function(req, callback) {
    let token = req.body.token;
    let vehicleno = req.body.vehicleno;

    let reqjson = {
        token: token,
        vehicleno: vehicleno
    }

    utils.fireAPI("/api/reports/vehiclenolastlocation", reqjson, function(err, data, msg) {
        if (!err) {

            let lat = data.lat;
            let lng = data.lng;
            let alti = data.alti;
            let speed = data.speed;
            let heading = data.heading;
            let ignstatus = data.ignstatus;
            let time = data.commtimestamp;

            let locationinfo = {
                lat, lng, alti, speed, heading, ignstatus, time
            }
            callback(null, locationinfo, "Get lastlocation successfull");

        } else {
            msg = "Get lastlocation failed";
            callback(msg, data, msg, err["responsecode"]);
        }
    });
};

exports.getLocationHistory = function (req, callback) {

    let vehicleno = req.body.vehicleno;
    let token = req.body.token;
    let startime = req.body.starttime;
    let endtime = req.body.endtime;

    let reqjson = {
        token: token,
        vehicleno: vehicleno,
        starttime: startime,
        endtime: endtime
    }

    utils.fireAPI("/api/reports/rtgps/trackhistoryvehno", reqjson, function(err, data, msg) {
        if (!err) {

            let results = [];
            for (let idx in data){
                let time = data[idx]['time'];
                let lat = data[idx]['latitude'];
                let lng = data[idx]['longitude'];
                let alti = data[idx]['alti'];
                let speed = data[idx]['speed'];
                let heading = data[idx]['heading'];
                let ignstatus = data[idx]['ignstatus'] == 1 ? "on": "off";
                let vehbattery = data[idx]['vehbattery'];
                results.push({time, lat, lng, alti, speed, heading, ignstatus, vehbattery});
            }

            callback(null, results, "Got location history");

        } else {
            msg = "Get lastlocation failed";
            callback(msg, data, msg, err["responsecode"]);
        }
    });
};

exports.getDistance = function(req, callback) {
    let token = req.body.token;
    let vehicleno = req.body.vehicleno;
    let starttime = req.body.starttime;
    let endtime = req.body.endtime;

    let reqjson = { token, vehicleno, starttime, endtime}

    utils.fireAPI("/api/reports/getdistanceforvehno", reqjson, function(err, data, msg) {
	//console.log(err, data, msg);
        if (!err) {

            let distance = data.distance;
            
            let distanceInfo = { distance }

            callback(null, distanceInfo, "Get distance successfull");

        } else {
            msg = "Get distance failed";
            callback(msg, data, msg, err["responsecode"]);
        }
    });
};

let getVehiclesByLatLngHelper = function(token, vehiclelist, results, lat, lng, radius, callback) {
    // console.log(results);
    if (vehiclelist.length) {
        let vehicleno = vehiclelist[0]['vehicleno'];
        // console.log(vehicleno);
        let vehicleid = vehiclelist[0]['vehicleid'];
        let lastlocbody = { token, vehicleid }

        utils.fireAPI("/api/reports/vehiclelastlocation", lastlocbody, function(err, data2, msg) {
            // console.log(err, data2, msg);
            vehiclelist.shift();
            if (!err) {
    
                let lat2 = data2.lat;
                let lng2 = data2.lng;
                let time = data2.commtimestamp;

                let dist = utils.getDistance(lat, lng, lat2, lng2);
                if (dist <= radius) {
                    results.push({time, lat2, lng2, vehicleno});
                }
            }
            getVehiclesByLatLngHelper(token, vehiclelist, results, lat, lng, radius, callback);
        });
    } else {
        callback(null, results, "Get nearby vehicles successfull");
    }
}

exports.getVehiclesByLatLng = function(req, callback) {
    let token = req.body.token;
    let lat = req.body.lat;
    let lng = req.body.lng;
    let radius = req.body.radius;

    let reqjson = { token, groupid: 2 }

    utils.fireAPI("/api/vehicle/getmyvds", reqjson, function(err, data, msg) {
        if (!err) {
            getVehiclesByLatLngHelper(token, data, [], lat, lng, radius, function(err, results, msg) {
                callback(err, results, msg);
            });

        } else {
            msg = "Get nearby vehicles failed";
            callback(msg, data, msg, err["responsecode"]);
        }
    });
};
