var { mongoose, conn } = require('../config/db');

const promocodeSchema = new mongoose.Schema({

    couponCode: {
        type: String,
        default: ''
    },
    discount: {
        type: String,
        default: ''
    },
    from: {
        type: Number,
        default: 0
    },
    to: {
        type: Number,
        default: 0
    },
    codeType: {
        type: String,
        default: ''
    },
    usageLimit: {
        type: String,
        default: ''
    },
    uptoDiscount: {
        type: String,
        default: ''
    },
    orderValueLimit: {
        type: String,
        default: ''
    },
    is_blocked: {
        type: Boolean,
        default: false
    },

},
    {
        strict: true,
        collection: 'Promocode',
        versionKey: false,
        timestamps: true
    }
);

exports.PromocodeModel = mongoose.model('Promocode', promocodeSchema);
