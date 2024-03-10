const { conn, mongoose } = require("../config/db");
const generateUniqueId = require('generate-unique-id');

const userRedeemPointTransactionSchema = mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref :'User',
        default:null
    },
    transaction_id: {
        type: String,
        default: generateUniqueId({ length: 7,useLetters: true }).toUpperCase()
    },
    transaction_type:{
        type: Number,
        default: 1  // 1 for earned, 2 for redeemed
    },
    redeem_amount:{
        type: Number,
        default: 0
    },
    booking_type: {
        type: Number,
        default: 1  // 1 for cart, 2 for walletPayment
    },
    user_cart_booking: {
        type: mongoose.Types.ObjectId,
        ref: 'userOrder'
    },
    transaction_at: {
        type: Number,
        default: new Date().getTime()
    }
},
{
    strict: true,
    collection: 'userRedeemPointTransaction',
    versionKey: false
});

exports.UserRedeemPointTransactionModel = mongoose.model('userRedeemPointTransaction', userRedeemPointTransactionSchema)