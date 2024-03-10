const { conn, mongoose } = require("../config/db");
const generateUniqueId = require('generate-unique-id');

const userServiceBookingSchema = mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref :'User',
        default:null
    },
    service_category: {
        type: mongoose.Types.ObjectId,
        ref: 'serviceCategory'
    },
    service_provider: {
        type: mongoose.Types.ObjectId,
        ref: 'serviceProvider'
    },
    service_id: {
        type: mongoose.Types.ObjectId,
        ref: 'serviceProviderServices'
    },
    booking_id: {
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
    currency:{
        type:String,
        default: "USD"
    },
    total_amount:{
        type:Number,
        default:0
    },
    booking_date:{
        type:Number,
        default:  new Date().getTime()
    },
    booking_time:{
        type:Number,
        default:  new Date().getTime()
    },
    additional_note:{
        type:String,
        default: null
    },
    commissionPercent: {
        type: Number,
        default: 0
    },
    serviceChargePercent: {
        type: Number,
        default: 0
    },
    booking_status:{
        type:Number,
        default:0   // 1 for pending , 2 for sellerReject , 3 for  sellerAccept, 4 Start service time , 5 complete (end service time),  6 userCancel  
    },
    payment_status:{
        type:Number,
        default:0   // 0 for pending , 1 for complete , 2 failed 
    },
    created_at: {
        type: Number,
        default: new Date().getTime()
    },
    payment_option: {
        type: String,
        enum: ['COD', 'CARD', 'PAYPAL', 'KUSHKI', 'WALLET'],
        default: 'COD'
    },
    payment_response:[],
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
    service_rating: {
        type: mongoose.Types.ObjectId,
        ref: 'serviceOrderRating'
    },
    modified_at: {
        type: Number,
        default: new Date().getTime()
    }
},
{
    strict: true,
    collection: 'userServiceBooking',
    versionKey: false
});

exports.UserServiceBookingModel = mongoose.model('userServiceBooking', userServiceBookingSchema)