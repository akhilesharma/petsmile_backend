const jwt = require('jsonwebtoken'); // used to create, signIn & Verify tokens
const config = require('../config/config'); //require for config files


const { UserModel } = require('../models/userModel');
const { HostModel } = require('../models/hostModel');
const { SellerModel } = require('../models/sellerModel');
const { ServicesModel, ServiceProviderModel } = require('../models/servicesModel');
const { AdminModel } = require('../models/adminModel');

exports.verifyUserToken = async (req, res, next) => {

    let { access_token } = req.headers;
    if (!access_token)
        return res.status(401).send({
            auth: false,
            message: 'No token Provided'
        });

    jwt.verify(access_token, config.JWT_PRIVATE_KEY, async function (err, decoded) {
        if (!err) {
            let user = await UserModel.findOne({ access_token: access_token })
            if (!user) {
                res.status(401).json({ message: "Invalid access_token" });
                return;
            }
            // console.log("hfdhfh");
            req.userData = user;
            next();
        } else {
            return res.status(401).json({ auth: false, message: 'Token has been expired' });
        }
        // if everything is good, save to request for use in other routes
    })
}

exports.verifySellerToken = async (req, res, next) => {

    let { access_token } = req.headers;
    if (!access_token)
        return res.status(401).send({
            auth: false,
            message: 'No token Provided'
        });

    jwt.verify(access_token, config.JWT_PRIVATE_KEY, async function (err, decoded) {
        if (!err) {
            let seller = await SellerModel.findOne({ access_token: access_token })
            if (!seller) {
                res.status(401).json({ message: "Invalid access_token" });
                return;
            }
            req.sellerData = seller;
            next();
        } else {
            return res.status(401).json({ auth: false, message: 'Token has been expired' });
        }
        // if wverything is good, save to request for use in other routes
    })
}

exports.verifyServicesToken = async (req, res, next) => {

    let { access_token } = req.headers;
    if (!access_token)
        return res.status(401).send({
            auth: false,
            message: 'No token Provided'
        });

    jwt.verify(access_token, config.JWT_PRIVATE_KEY, async function (err, decoded) {
        if (!err) {
            let services = await ServiceProviderModel.findOne({ access_token: access_token })
            if (!services) {
                res.status(401).json({ message: "Invalid access_token" });
                return;
            }
            req.servicesData = services;
            next();
        } else {
            return res.status(401).json({ auth: false, message: 'Token has been expired' });
        }
        // if wverything is good, save to request for use in other routes
    })
}

exports.verifyHostToken = async (req, res, next) => {

    let { access_token } = req.headers;
    if (!access_token)
        return res.status(401).send({
            auth: false,
            message: 'No token Provided'
        });

    jwt.verify(access_token, config.JWT_PRIVATE_KEY, async function (err, decoded) {
        if (!err) {
            let host = await HostModel.findOne({ access_token: access_token })
            if (!host) {
                res.status(401).json({ message: "Invalid access_token" });
                return;
            }
            req.hostData = host;
            next();
        } else {
            return res.status(401).json({ auth: false, message: 'Token has been expired' });
        }
        // if wverything is good, save to request for use in other routes
    })
}

exports.verifyAdminToken = async (req, res, next) => {

    let { access_token } = req.headers;
    // console.log(access_token)
    if (!access_token)
        return res.status(401).send({
            auth: false,
            message: 'No token Provided'
        });

    jwt.verify(access_token, config.JWT_PRIVATE_KEY, async function (err, decoded) {
        console.log(err)
        if (!err) {
            let admin = await AdminModel.findOne({ access_token: access_token })
            if (!admin) {
                res.status(401).json({ message: "Invalid access_token" });
                return;
            }
            req.adminData = admin;
            next();
        } else {
            return res.status(401).json({ auth: false, message: 'Token has been expired' });
        }
        // if wverything is good, save to request for use in other routes
    })
}

exports.generateToken = () => {
    // let token = jwt.sign({ access: 'access-' }, config.JWT_PRIVATE_KEY, { expiresIn: '2 days' });
    let token = jwt.sign({ access: 'access-' }, config.JWT_PRIVATE_KEY, {});
    return token;
}