const { conn, mongoose } = require("../config/db");
const validator = require("validator");

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        // unique: true,
        validate: [validator.isEmail, "please provide a valid email"],
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: null,
    },
    profileType: {
        type: String,
        default: null,
    },
    countryCode: {
        type: String,
        default: null,
    },
    mobileNumber: {
        type: String,
        default: null,
    },
    country: {
        type: String,
        default: null,
    },
    state: {
        type: String,
        default: null,
    },
    city: {
        type: String,
        default: null,
    },
    address: {
        type: String,
        default: null,
    },
    deviceToken: {
        type: String,
        default: null,
    },
    deviceType: {
        type: Number,
        default: null,
    },
    isProfileCreated: {
        type: Boolean,
        default: false,
    },
    varificationCode: {
        type: Number,
        default: 1234,
    },
    isOtpVarified: {
        type: Boolean,
        default: false,
    },
    access_token: {
        type: String,
        default: null,
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    createdAt: {
        type: Number,
        default: new Date().getTime(),
    },
    updateAt: {
        type: Number,
        default: new Date().getTime(),
    },
});

exports.AdminModel = mongoose.model("adminModel", adminSchema);