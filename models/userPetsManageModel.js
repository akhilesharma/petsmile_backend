var { mongoose, conn } = require('../config/db');

const userPetManageSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    pet_cat:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "productCategory"
    },
    pet_name: {
        type: String,
        default: ""
    },
    pet_dob: {
        type: String,
        default: ""
    },
    pet_height: {
        type: String,
        default: ""
    },
    pet_weight: {
        type: String,
        default: ""
    },
    pet_gender: {
        type: String,
        default: ""
    },
    pet_special_care: {
        type: String,
        default: ""
    },
    treatment : {
        type : String,
        default : ""
    },
    vaccine_details :{
        vaccine_name: {
            type: String,
            default: ""
        },
        vaccine_date: {
            type: String,
            default: ""
        },
    },
    upcoming_vaccine : {
        upcoming_vaccine_name:{
            type : String,
            default : ""
        },
        upcoming_vaccine_date:{
            type : String,
            default : ""
        },
    },
   
    pet_pic:{
        type : String,
        default : ""
    },
    is_blocked: {
        type: Boolean,
        default: false
    },
    is_user_verified: {
        type: Boolean,
        default: false
    },
},
    {
        strict: true,
        collection: 'UserPetManage',
        versionKey: false,
        timestamps: true
    }
);

exports.UserPetManageModel = mongoose.model('UserPetManage', userPetManageSchema);