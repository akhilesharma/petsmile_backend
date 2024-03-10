const { mongoose, conn } = require('../config/db');
const generateUniqueId = require('generate-unique-id');

const hostOrderBookingSchema = mongoose.Schema(
    {
        host_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Host'
        },
        cart_id: [{
            type: mongoose.Types.ObjectId,
            ref: 'hostCart'
        }],
        order_id: [{
            type: mongoose.Types.ObjectId,
            ref: 'hostOrder'
        }],
        total_amount: {
            type: Number,
            default: 0
        },
        delivery_charge: {
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
        }
    }, {
    collection: 'hostOrderBooking',
    versionKey: false,
    strict: true
});

exports.HostOrderBookingModel = mongoose.model('hostOrderBooking', hostOrderBookingSchema);
