const { conn, mongoose } = require("../config/db");
const generateUniqueId = require('generate-unique-id');
// const validator = require("validator");

const hostOrderSchema = mongoose.Schema({
    host:{
        type : mongoose.Schema.Types.ObjectId,
        ref :'Host',
        default:null
    },
    cart_id: {
        type: mongoose.Types.ObjectId,
        ref: 'hostCart'
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
        ref :'hostAddress',
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
        default:0  // 0 for pending , 1 for reject , 2 for  accept, 3 packed , 4 dispached , 5 delivered , 6 user cancel 
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
        ref: 'hostOrderBooking'
    },
    payment_options: {
        type: String,
        enum: ['AMAZONPAY', 'CARD', 'PAYPAL','KUSHKI'],
        default: 'AMAZONPAY'
    },
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
    modified_at: {
        type: Number,
        default: new Date().getTime()
    }
},
{
    strict: true,
    collection: 'hostOrder',
    versionKey: false
});

exports.HostOrderModel = mongoose.model('hostOrder', hostOrderSchema)