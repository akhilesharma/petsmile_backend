var { mongoose, conn } = require('../config/db');

let HostFaqSchema =  new mongoose.Schema({
    type:{
        type:String,
        require:true  // 1 for profile, 2 for payment, 3 for order, 4 for tracking
    },
    question:{
        type:String,
        require:true
    },
    answer:{
        type:String,
        require:true
    },
    created_on: {
        type: Number,
        default: new Date().getTime()
    }
},{
    strict: true,
    collection: 'hostfaq',
    versionKey: false
})

exports.HostFaqModel = mongoose.model('hostfaq' , HostFaqSchema)