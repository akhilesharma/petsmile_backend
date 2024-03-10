const { conn, mongoose } = require("../config/db");
const validator = require("validator");

const userAddressSchema = mongoose.Schema({

    user: { 
        type : mongoose.Schema.Types.ObjectId,
        ref :'User',
        default:null
    },
    house_no : { 
        type : String,
        default:null
    },
    street : { 
        type : String,
        default:null
    },
    city : { 
        type : String,
        default:null
    },
    locality : { 
        type : String,
        default:null
    },
    // country_code:{
    //     type : String,
    //     default:null
    // },
    country:{
        type : String,
        default:null
    },
    state:{
        type : String,
        default:null
    },
    postal_code : { 
        type : String,
        default:null
    },
    latitude:{ 
        type : Number,
        required: true
    },
    longitude:{ 
        type : Number,
        required: true
    },
    type:{ 
        type : Number,    // 1 for shipping  // 2 bulling
        default:0
    },
    primaryAddress:{
        type:Boolean,
        default:false
    }
},
{
    strict: true,
    collection: 'userAddress',
    versionKey: false,
    timestamps: true
});

exports.UserAddressModel = mongoose.model('userAddress', userAddressSchema);