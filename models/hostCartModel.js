const { conn, mongoose } = require("../config/db");
const validator = require("validator");

const hostCartSchema = mongoose.Schema({
    productMainCategoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'productMainCategory'
    },
    product :{
        seller_product: {
            type : mongoose.Schema.Types.ObjectId,
            ref :'SellerProductList'
        },
        admin_product: {
            type : mongoose.Schema.Types.ObjectId,
            ref :'trackingDevice'
        }
    },
    host: { 
        type : mongoose.Schema.Types.ObjectId,
        ref :'Host',
        default:null
    },
    seller: { 
        seller_id: {
            type : mongoose.Schema.Types.ObjectId,
            ref :'Seller'
        },
        admin_id: {
            type : mongoose.Schema.Types.ObjectId,
            ref :'adminModel'
        },
    },
    quantity:{
        type:Number,
        default:0
    },
    colorId:{
        type : String,
        default:null
    },
    weight: {
        type: String,
        default: null
    },
    size: {
        type: String,
        default: null
    },
    orderId: { 
        type : mongoose.Schema.Types.ObjectId,
        ref :'hostOrder',
    },
    bookingId: { 
        type : mongoose.Schema.Types.ObjectId,
        ref :'hostOrderBooking',
    },
    price:{
        type:Number,
        default:0
    },
    unitPrice:{
        type:Number,
        default:0
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    status: {
        type: Number,
        default: 0  // 0 for cart and 1 for orderPending, 2 for orderReject, 3 for orderAccepted,  4 for itempacked, 5 for dispatched, 6 for delivered, 7 for cancelled
    },
    cancel_reason: {
        type: String
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
    collection: 'hostCart',
    versionKey: false,
    timestamps: true
});

exports.HostCartModel = mongoose.model('hostCart', hostCartSchema)