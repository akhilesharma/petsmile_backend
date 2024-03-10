var { mongoose, conn } = require('../config/db');
// const generateUniqueId = require('generate-unique-id');

const hostSchema = new mongoose.Schema({

    first_name: {
        type: String,
        default: ''
    },
    last_name: {
        type: String,
        default: ''
    },
    country_code: {
        type: String
    },
    mobile_number: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    profile_pic:{
        type: String,
        default: '' 
    },
    is_verified_by_admin: {
        type: Number,
        default: 0 // 0 Pending , 1 for Verified , 2 Rejected
    },
    is_blocked: {
        type: Boolean,
        default: false
    },
    access_token: {
        type: String,
        default: ''
    },
    device_type: {
        type: Number,
        default: 1
    },      // 1 for Android, 2 for IOS, 3 for Web
    device_token: {
        type: String,
        default: null
    },
    location: {
        type: { type: String, default: "Points" },
        coordinates: [Number]
    },
    is_active: {
        type: Boolean,
        default: false
    },
    profile_pic: {
        type: String,
        default: ''
    },
    unique_id: {
        type: String,
        default: ''
    },
    evidence_id: {
        type: String,
        default: ''
    },
    otp_info: {
        otp: { type: String },
        expTime: { type: Date }  //otp expiry time
    },
    is_otp_verified: {
        type: Boolean,
        default: false
    },
    latitude:{ 
        type : Number,
        required: true
    },
    longitude:{ 
        type : Number,
        required: true
    },
},
    {
        strict: true,
        collection: 'Host',
        versionKey: false,
        timestamps: true
    }
);

exports.HostModel = mongoose.model('Host', hostSchema);
