const functions = require("firebase-functions");
const config = functions.config()

function checkToken(req) {
    if (
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token')
        || (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
        if (req.headers.authorization.split(' ')[1] === config.env.asc_token) { return true }
        else return false
    }
    return false;
}



module.exports = checkToken