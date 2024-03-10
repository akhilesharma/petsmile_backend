const { conn, mongoose } = require("../config/db");
const generateUniqueId = require('generate-unique-id');

const userWalletTransactionSchema = mongoose.Schema({
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
        default: 1  // 1 for add, 2 for substract
    },
    transaction_amount:{
        type: Number,
        default: 0
    },
    booking_type: {
        type: Number,
        default: 1  // 1 for cart, 2 for service, 3 for package, 4 for walletPayment
    },
    booking: {
        user_cart_booking: {
            type: mongoose.Types.ObjectId,
            ref: 'userOrder'
        },
        user_service_booking: {
            type: mongoose.Types.ObjectId,
            ref: 'userServiceBooking'
        },
        package_booking: {
            type: mongoose.Types.ObjectId,
            ref: 'packageBooking'
        }
    },
    transaction_at: {
        type: Number,
        default: new Date().getTime()
    }
},
{
    strict: true,
    collection: 'userWalletTransaction',
    versionKey: false
});

exports.UserWalletTransactionModel = mongoose.model('userWalletTransaction', userWalletTransactionSchema)