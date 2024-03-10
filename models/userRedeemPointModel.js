const { conn, mongoose } = require("../config/db");

const userRedeemPointSchema = mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref :'User',
        default:null
    },
    redeem_type:{
        type: Number,
        default: 1  // 1 for earned, 2 for redeemed
    },
    redeem_point:{
        type: Number,
        default: 0
    },
    created_at: {
        type: Number,
        default: new Date().getTime()
    },
    modified_at: {
        type: Number,
        default: new Date().getTime()
    }
},
{
    strict: true,
    collection: 'userRedeemPoint',
    versionKey: false
});

exports.UserRedeemPointModel = mongoose.model('userRedeemPoint', userRedeemPointSchema)