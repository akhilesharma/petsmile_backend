var { mongoose, conn } = require('../config/db');

let faqSchema =  new mongoose.Schema({
    type:{
        type: Number,
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
    collection: 'faq',
    versionKey: false
})

exports.FaqModel = mongoose.model('faq' , faqSchema)