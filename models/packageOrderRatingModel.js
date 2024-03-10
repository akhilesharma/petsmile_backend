
var { mongoose, conn } = require('../config/db');

const packageOrderRatingSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    host_id: { 
        type: mongoose.Types.ObjectId,
        ref: 'Host'
    },
    package_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hostPackage'
    },
    booking_id: {
        type: mongoose.Types.ObjectId,
        ref: 'packageBooking'
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
        collection: 'packageOrderRating',
        versionKey: false
    });

exports.PackageOrderRatingModel = mongoose.model('packageOrderRating', packageOrderRatingSchema);