module.exports = {
    // HOST: "http://localhost:4200",
    HOST: "http://3.108.206.233:4200",
    // HOSTBACK: "http://localhost:3000",
    HOSTBACK: "http://177.71.138.20:3001",
    accountSid: 'AC04e6ae51ffb4cb1ebdd151228c4220ac',
    authToken: '0def17a5fb6e654620f407771b65a48d',
    twilio_no: '+16194323836',
    authToken: '0def17a5fb6e654620f407771b65a48d',
    defaultOTPExpireTime: 60 * 60 * 1000,
    JWT_PRIVATE_KEY: 'petsmilesupersecret',
    oneDay: 86400,
    port: 3000,
    // S3_AccessKey: 'AKIAQBDEMFC5V6FEBJHS',
    // S3_SecretKey: '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',
    // S3_BucketName: 'jobportalbuckets3',
    // S3_Region: 'ap-south-1',
}

exports.config = {
    JWT_PRIVATE_KEY: "thisissupersecret",
    defaultOTPExpireTime: 15 * 60 * 1000,
    secret: 'supersecret'
}


var { config } = require('../config/config');