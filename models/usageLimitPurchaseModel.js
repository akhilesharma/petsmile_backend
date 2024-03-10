var { mongoose, conn } = require('../config/db');

const usageLimitPurchaseSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    seller_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Seller'
    },
    serviceProvider_id: {
        type: mongoose.Types.ObjectId,
        ref: 'serviceProvider'
    },    
    host_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Host'
    },
    usage_limit_purchase: {
        type: Number,
        default: 0   
    },
    created_at:{
        type: String,
        default: new Date().getTime()
    },
},
    {
        strict: true,
        collection: 'usagePurchaseLimit',
        versionKey: false,
    }
);

exports.UsageLimitPurchaseModel = mongoose.model('usagePurchaseLimit', usageLimitPurchaseSchema);

