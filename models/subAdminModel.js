const { conn, mongoose } = require("../config/db");
const validator = require("validator");

const subAdminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: [validator.isEmail, "please provide a valid email"],
    },
    password: {
        type: String,
        default: "",
    },
    moduleAccess: [], // 1 for dashboard, 2 for userMgmnt, 3 for hostMgmnt, 4 for seller mgmnt
                     // 5 for service Provider mgmnt, 6 for pet category Mgmnt, 7 for tracking device mgmnt, 
                     // 8 for promocode mgmnt, 9 for inventory mgmnt, 10 for product main category, 11 for seller order mgmnt,
                     // 12 for tracking device order mgmnt, 13 for subAdmin mgmnt, 14 for ad mgmnt, 15 for payment mgmnt,
                     // 16 for service category mgmnt
    profileImage: {
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
    isBlocked: {
        type: Number,
        default: 0
    },
    deviceToken: {
        type: String,
        default: null,
    },
    deviceType: {
        type: Number,
        default: null,
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
    createdAt: {
        type: Number,
        default: new Date().getTime(),
    },
    updateAt: {
        type: Number,
        default: new Date().getTime(),
    },
},
    {
        strict: true,
        collection: "subAdmin",
        versionKey: false,
    }
);

exports.SubAdminModel = mongoose.model("subAdmin", subAdminSchema);