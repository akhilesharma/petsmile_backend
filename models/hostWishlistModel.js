const { conn, mongoose } = require("../config/db");

const hostWishlistSchema = mongoose.Schema({

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
    host: {
        type : mongoose.Schema.Types.ObjectId,
        ref :'Host'
    },
},
{
    strict: true,
    collection: 'hostWishlist',
    versionKey: false,
    timestamps: true
});

exports.HostWishlistModel = mongoose.model('hostWishlist', hostWishlistSchema)