
var { mongoose, conn } = require('../config/db');

const serviceOrderRatingSchema = new mongoose.Schema({
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
    service_provider_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'serviceProvider'
    },
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'serviceProviderServices'
    },
    booking: {
        user_booking: {
            type: mongoose.Types.ObjectId,
            ref: 'userServiceBooking'
        },
        host_booking: {
            type: mongoose.Types.ObjectId,
            ref: 'hostOrderBooking'
        }
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
        collection: 'serviceOrderRating',
        versionKey: false
    });

exports.ServiceOrderRatingModel = mongoose.model('serviceOrderRating', serviceOrderRatingSchema);