
var { mongoose, conn } = require('../config/db');

const orderRatingSchema = new mongoose.Schema({
    uniqid: {
        user_id: { 
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        host_id: { 
            type: mongoose.Types.ObjectId,
            ref: 'Host'
        }
    },
    product: {
        seller_product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SellerProductList'
        },
        admin_product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'trackingDevice'
        }
    },
    order_id: {
        type: mongoose.Types.ObjectId,
        ref: 'order'
    },
    rating_point: {
        type: Number
    },
    review: {
        type: String
    },
    created_at: {
        type: Number,
        default: new Date().getTime()
    }
},
    {
        strict: true,
        collection: 'orderRating',
        versionKey: false
    });

exports.OrderRatingModel = mongoose.model('orderRating', orderRatingSchema);