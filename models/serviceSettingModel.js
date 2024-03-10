var { mongoose, conn } = require('../config/db');

var serviceSettingScheme = new mongoose.Schema({
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
    legal : {
        type : String
    },
    faq : {
        type : String
    },
}, {
        strict: true,
        collection: 'servicesetting',
        versionKey: false
    });

exports.ServiceSettingModel = mongoose.model('servicesetting', serviceSettingScheme);
