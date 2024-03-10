const { conn, mongoose } = require("../config/db");
const validator = require("validator");

const productCatSchema = mongoose.Schema({

    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Seller'
    },
    product_main_cat :{
        type : mongoose.Schema.Types.ObjectId,
        ref :'productMainCategory'
    },
    product_cat :{
        type: mongoose.Schema.Types.ObjectId,
        ref:'productCategory'
    },
    breed_type :{
        type: mongoose.Schema.Types.ObjectId,
        ref:'productSubCategory'
    },
    product_name :{
        type : String,
        default : ''
    },
    product_price :{
        type : String,
        default : ''
    },

    selling_price :{
        type : String,
        default : ''
    },

    product_discount :{
        type :String,
        default : ''
    },
    product_details: [{
        product_color :{
            type :String,
            default : ''
        },
        product_img:{
            type :String,
            default : ''
        },
    }],

    product_decripton:[
         String
    ],

    product_quantity : {
        type : Number,
        default : 0
    },

    sku_min_limit :{
        type : Number,
        default : 0
    },
    set_status : {
        type : Number,
        default : 0                                // 0 for out of Stock  1 for In Stock
    },
    rating : {
        type : String,
        default : '0'
    },
    // cartData:[{
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref :"userCart",
    // }],

    // hostCartData : [{
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : "hostCart",
    // }]

    weight_size: [{
        weight :{
            type :String,
            default : ''
        },
        size:{
            type :String,
            default : ''
        },
    }],
},
{
    strict: true,
    collection: 'SellerProductList',
    versionKey: false,
    timestamps: true
});

exports.ProductCatModel = mongoose.model('SellerProductList', productCatSchema)