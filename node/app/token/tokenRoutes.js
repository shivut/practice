module.exports = function(app, console){
    let utils = require('../common/utils.js');
    let tokenjs = require('./token');

    app.post('/api/yedvanshitech/gettoken', function (req, res, next) {
        utils.verifyapiargs(req.body, res, next, ['username', 'password']);
    }, function (req, res) {
        tokenjs.getToken(req, utils.generalCallback(res))
    });
};
