const { conn, mongoose } = require("../config/db");

const userLikeProductSchema = mongoose.Schema({

    user: [{ 
        type : mongoose.Schema.Types.ObjectId,
        ref :'User',
        default: null
    }],

    host: [{ 
        type : mongoose.Schema.Types.ObjectId,
        ref :'Host',
        default: null
    }],

    seller: { 
        type : mongoose.Schema.Types.ObjectId,
        ref :'Seller',
        default:null
    },

    serviceProvider: { 
        type : mongoose.Schema.Types.ObjectId,
        ref :'serviceProvider',
        default:null
    },
    
    product : {
        seller_product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SellerProductList'
        },
        admin_product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'trackingDevice'
        }
    },
    package : {
        host_package : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'hostPackage'
        }
    },

    service : {
        service_provider_services : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'serviceProviderServices'
        }
    },
     admin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'adminModel'
     }
},
{
    strict: true,
    collection: 'userLike',
    versionKey: false,
    timestamps: true
});

exports.userLikeModel = mongoose.model('userLike', userLikeProductSchema);