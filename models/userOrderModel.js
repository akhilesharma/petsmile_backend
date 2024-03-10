const { conn, mongoose } = require("../config/db");
const generateUniqueId = require('generate-unique-id');
// const validator = require("validator");

const userOrderSchema = mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref :'User',
        default:null
    },
    cart_id: {
        type: mongoose.Types.ObjectId,
        ref: 'userCart'
    },
    quantity: {
        type: Number,
        default: 1
    },
    order_id: {
        type: String,
        default: generateUniqueId({
            length: 7,
            useLetters: true
        }).toUpperCase()
    },
    address:{
        type : mongoose.Schema.Types.ObjectId,
        ref :'userAddress',
        default:null
    },
    coupon:{
        type : mongoose.Schema.Types.ObjectId,
        ref :'Promocode',
        default:null
    },
    currency:{
        type:String,
        default: null
    },
    totalAmount:{
        type:Number,
        default:0
    },
    deliveryCharge:{
        type:Number,
        default:0
    },
    discountAmount:{
        type:Number,
        default:0
    },
    commissionPercent: {
        type: Number,
        default: 0
    },
    serviceChargePercent: {
        type: Number,
        default: 0
    },
    orderStatus:{
        type:Number,
        default:0   // 0 for pending , 1 for reject , 2 for  accept, 3 packed , 4 dispached , 5 delivered , 6 user cancel, 7 cancelled by cobox
    },
    paymentStatus:{
        type:Number,
        default:0   // 0 for pending , 1 for complete , 2 failed 
    },
    created_at: {
        type: Number,
        default: new Date().getTime()
    },
    booking_id: {
        type: mongoose.Types.ObjectId,
        ref: 'userOrderBooking'
    },
    payment_options: {
        type: String,
        enum: ['AMAZONPAY', 'CARD', 'PAYPAL', 'WALLET', 'KUSHKI'],
        default: 'AMAZONPAY'
    },
    // intransit_on: {
    //     type: Number,
    // },
    // dispatch_on: {
    //     type: Number,
    // },
    // shipping_on: {
    //     type: Number,
    // },
    // arriving_on: {
    //     type: Number,
    // },
    // out_for_delivery_on: {
    //     type: Number,
    // },
    // delivered_on: {
    //     type: Number,
    // },
    // cancelled_on: {
    //     type: Number,
    // },
    is_rated: {
        type: Boolean,
        default: false
    },
    is_refunded: {
        type: Boolean,
        default: false
    },
    cancel_reason: {
        type: String
    },
    invoice_url: {
        type: String
    },
    modified_at: {
        type: Number,
        default: new Date().getTime()
    }
},
{
    strict: true,
    collection: 'userOrder',
    versionKey: false
});

exports.UserOrderModel = mongoose.model('userOrder', userOrderSchema)