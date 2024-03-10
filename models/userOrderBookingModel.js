const { mongoose, conn } = require('../config/db');
const generateUniqueId = require('generate-unique-id');

const userOrderBookingSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        cart_id: [{
            type: mongoose.Types.ObjectId,
            ref: 'userCart'
        }],
        order_id: [{
            type: mongoose.Types.ObjectId,
            ref: 'userOrder'
        }],
        total_amount: {
            type: Number,
            default: 0
        },
        delivery_charge: {
            type: Number,
            default: 0
        },
        redeemed_amount: {
            type: Number,
            default: 0
        },
        coupon_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Promocode'
        },
        discount_amount: {
            type: Number,
            default: 0
        },
        transaction_id: {
            type: String,
            default: ''
        },
        booking_id: {
            type: String,
            default: ''
        },
        created_at: {
            type: Number,
            default: new Date().getTime()
        },
        modified_at: {
            type: Number,
            default: new Date().getTime()
        },
        status: {
            type: Number,
            default: 1
        },
        response: []
    }, {
    collection: 'userOrderBooking',
    versionKey: false,
    strict: true
});

exports.UserOrderBookingModel = mongoose.model('userOrderBooking', userOrderBookingSchema);
