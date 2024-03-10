const { conn, mongoose } = require("../config/db");

const hostAddressSchema = mongoose.Schema({

    host: { 
        type : mongoose.Schema.Types.ObjectId,
        ref :'Host',
        default:null
    },
    full_name:{
        type : String,
        default:null
    },
    mobile_number:{
        type : String,
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
    locality : { 
        type : String,
        default:null
    },
    city : { 
        type : String,
        default:null
    },
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
    primaryAddress:{
        type:Boolean,
        default:false
    },
    latitude:{ 
        type : Number,
        required: true
    },
    longitude:{ 
        type : Number,
        required: true
    },
},
{
    strict: true,
    collection: 'hostAddress',
    versionKey: false,
    timestamps: true
});

exports.HostAddressModel = mongoose.model('hostAddress', hostAddressSchema);