const { conn, mongoose } = require("../config/db");
const validator = require("validator");

const userCartSchema = mongoose.Schema({
    productMainCategoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'productMainCategory'
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    seller: {
        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Seller'
        },
        admin_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'adminModel'
        },
    },
    quantity: {
        type: Number,
        default: 0
    },
    colorId: {
        type: String,
        default: null
    },
    weight: {
        type: String,
        default: null
    },
    size: {
        type: String,
        default: null
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userOrder',
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userOrderBooking',
    },
    price: {
        type: Number,
        default: 0
    },
    unitPrice: {
        type: Number,
        default: 0
    },
    delivery_id_budget: {
        type: String
    },
    delivery_id_order: {
        type: String
    },
    delivery_token: {
        type: String
    },
    cancel_reason: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: Number,
        default: 0 // Sushil sir   0 for cart and 1 for orderPending, 2 for orderReject, 3 for orderAccepted,  4 for itempacked(intransit), 5 for dispatched, 6 for delivered, 7 for cancelled by user, 8 cancelled by cobox
    },
    cancel_reason: {
        type: String
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
        collection: 'userCart',
        versionKey: false,
        timestamps: true
    });

exports.UserCartModel = mongoose.model('userCart', userCartSchema)