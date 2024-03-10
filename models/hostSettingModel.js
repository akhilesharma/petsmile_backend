var { mongoose, conn } = require('../config/db');

var hostSettingScheme = new mongoose.Schema({
    about_us: {
        type: String
    },
    term_condition: {
        type: String
    },
    contact_us: {
        type: String,
    },
    privacy_policy: {
        type: String,
    },
    help : {
        type : String
    },
    faq : {
        type : String
    },
}, {
        strict: true,
        collection: 'hostsetting',
        versionKey: false
    });

exports.HostSettingModel = mongoose.model('hostsetting', hostSettingScheme);
