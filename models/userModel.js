var { mongoose, conn } = require('../config/db');

const userSchema = new mongoose.Schema({

    full_name: {
        type: String,
        default: ''
    },
    country_code: {
        type: String,
        default: ""
    },
    mobile_number: {
        type: String,
        default: null,
    },
    is_mobile_verified: {
        type: Boolean,
        default: false
    },
    otp_info: {
        type: String,
        default: "1234"
    },
    // ,
    // otp_info: {
    //     otp: {type:String},
    //     expTime: {type:Date}  //otp expiry time
    // },
    email: {
        type: String,
        default: null,
    },

    email_otp_verify: {
        type: String,
        default: "1234"
    },

    is_email_verified: {
        type: Boolean,
        default: false
    },

    gender: {
        type: String,
        default: ''
    },
    password: {
        type: String,
    },
    is_blocked: {
        type: Boolean,
        default: false
    },
    is_user_verified: {
        type: Boolean,
        default: false
    },
    device_type: {
        type: Number,
        default: 1        // 1 for Android, 2 for IOS, 3 for Web
    },
    device_token: {
        type: String,
        default: null
    },
    // latitude : {
    //     type : String,
    //     default : null
    // },
    // longitude : {
    //     type : String,
    //     default : null
    // },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    },

    access_token: {
        type: String,
        default: null
    },

    last_login: {
        type: Number,
        default: Date.now()
    },
    social_id: {
        type: String,
        default: ''
    },
    social_type: {
        type: Number,
        default: 0   // 1 for google, 2 for facebook, 3 for apple
    },
},
    {
        strict: true,
        collection: 'User',
        versionKey: false,
        timestamps: true
    }
);

exports.UserModel = mongoose.model('User', userSchema);

