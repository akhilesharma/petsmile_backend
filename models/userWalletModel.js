const { conn, mongoose } = require("../config/db");

const userWalletSchema = mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref :'User',
        default:null
    },
    transaction_type:{
        type: Number,
        default: 1  // 1 for add, 2 for substract
    },
    wallet_amount:{
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
    collection: 'userWallet',
    versionKey: false
});

exports.UserWalletModel = mongoose.model('userWallet', userWalletSchema)