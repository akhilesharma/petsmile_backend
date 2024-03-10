const { HostModel } = require('../models/hostModel');
const bcrypt = require("bcrypt");
const saltRounds = 10;
exports.requiresHostLogin = async (req, res, next) => {
    let {
        access_token
    } = req.headers;
    if (access_token) {
        let user = await HostModel.findOne({ access_token:access_token });
        // console.log(user);
        if (!user) {
            // status 1000 for If Access token's Error 
            res.status(403).json({ response: {}, messsage: "Host Not Found" });
            return;
        }
        req.userData = user;
        next();
    } else {
        res.status(403).json({ response: {}, messsage: "Access token Missing" });
    }
}



exports.encryptText = async (plaintext) => {
    let encryptedPass = await bcrypt.hash(plaintext, saltRounds);
    return encryptedPass;
}