const { conn, mongoose } = require("../config/db");
const validator = require("validator");

const userWishlistSchema = mongoose.Schema({
    product :{
        seller_product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SellerProductList'
        },
        admin_product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'trackingDevice'
        }
    },
    weight: {
        type: String,
        default: null
    },
    size: {
        type: String,
        default: null
    },
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref :'User'
    }
},
{
    strict: true,
    collection: 'userWishlist',
    versionKey: false,
    timestamps: true
});

exports.UserWishlistModel = mongoose.model('userWishlist', userWishlistSchema);