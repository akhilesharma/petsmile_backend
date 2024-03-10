const { conn, mongoose } = require("../config/db");
const generateUniqueId = require('generate-unique-id');

const userPackageBookingSchema = mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref :'User',
        default:null
    },
    package_id: {
        type: mongoose.Types.ObjectId,
        ref: 'hostPackage'
    },
    host_id: {
        type: mongoose.Types.ObjectId,
        ref: "Host"
    },
    pet_id: {
        type: mongoose.Types.ObjectId,
        ref: 'UserPetManage'
    },
    booking_id: {
        type: String,
        default: generateUniqueId({
            length: 7,
            useLetters: true
        }).toUpperCase()
    },
    coupon:{
        type : mongoose.Schema.Types.ObjectId,
        ref :'Promocode',
        default:null
    },
    discount_amount:{
        type:Number,
        default:0
    },
    currency:{
        type:String,
        default: "USD"
    },
    payable_amount:{
        type:Number,
        default:0
    },
    service_date:{
        type:Number,
        default:  new Date().getTime()
    },
    service_duration:{
        type:Number,
        default: 1  //in days
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
        default: 1  // 1 for confirmed , 2 for petReceived , 3 for  petStaying, 4 petReturned , 5 bookingCancelled  
    },
    payment_status:{
        type:Number,
        default:0   // 0 for pending , 1 for complete , 2 failed 
    },
    payment_option: {
        type: String,
        enum: ['COD', 'PAYPAL', 'KUSHKI', 'WALLET'],
        default: 'COD'
    },
    payment_response:[],
    is_rated: {
        type: Boolean,
        default: false
    },
    cancel_reason: {
        type: String
    },
    address:{
        type : mongoose.Schema.Types.ObjectId,
        ref :'userAddress',
        default:null
    },
    package_rating: {
        type: mongoose.Types.ObjectId,
        ref: 'packageOrderRating'
    },
    transaction_id: {
        type: String,
        default: generateUniqueId({
            length: 14,
            useLetters: true
        })
    },
    is_refunded: {
        type: Boolean,
        default: false
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
    collection: 'packageBooking',
    versionKey: false
});

exports.PackageBookingModel = mongoose.model('packageBooking', userPackageBookingSchema)