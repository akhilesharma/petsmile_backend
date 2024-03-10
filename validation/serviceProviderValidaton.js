const { Joi } = require('celebrate');

let serviceProvider = {

    REGISTERSERVICEPROVIDER: Joi.object().keys({
        country_code: Joi.string().required(),
        mobile_number: Joi.string().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        device_token: Joi.string().required(),
        device_type: Joi.string().required()
    }),

    OTP: Joi.object().keys({
        otp: Joi.string().required()
    }),

    COMPLETEPROFILE: Joi.object().keys({
        email: Joi.string().required(),
        // store_name: Joi.string().required(),
        address1: Joi.string().required(),
        address2: Joi.string().optional(),
        address3: Joi.string().optional(),
        idProof: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
    }),

    BANKSECUTITY: Joi.object().keys({
        accountHolderName: Joi.string().required(),
        accountNumber: Joi.string().required(),
        bankCard: Joi.string().required(),
        password: Joi.string().required(),
        bankAccountName : Joi.string().required()
    }),

    FORGETPASSWORD: Joi.object().keys({
        country_code: Joi.string().required(),
        mobile_number: Joi.string().required()
    }),

    RESETPASSWORD: Joi.object().keys({
        newPassword: Joi.string().required(),
        confirmPassword: Joi.string().required()
    }),

    LOGIN: Joi.object().keys({
        country_code: Joi.string().required(),
        mobile_number: Joi.string().required(),
        password: Joi.string().required(),
        device_token: Joi.string().optional()
    }),

    EDITPROFILE: Joi.object().keys({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().required(),
        profile_pic: Joi.string().required(),
        // address1: Joi.string().required(),
        // address2: Joi.string().optional(),
        // address3: Joi.string().optional(),
        // idProof: Joi.string().required(),
    }),

    EDITADDRESS: Joi.object().keys({
        // first_name: Joi.string().required(),
        // last_name: Joi.string().required(),
        // email: Joi.string().required(),
        // profile_pic: Joi.string().required(),
        address1: Joi.string().required(),
        address2: Joi.string().optional(),
        address3: Joi.string().optional(),
        idProof: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
    }),

    CHANGEPASSWORD: Joi.object().keys({
        old_password: Joi.string().required(),
        password: Joi.string().required(),
    }),

    ADDPRODUCT: Joi.object().keys({
        product_cat: Joi.string().required(),
        product_name: Joi.string().required(),
        breed_type: Joi.string().required(),
        product_price: Joi.string().required(),
        selling_price: Joi.string().required(),
        product_discount: Joi.string().required(),
        product_color: Joi.string().required(),
        product_img: Joi.string().required(),
        product_decripton: Joi.array().required(),
    }),

    EDITPRODUCT: Joi.object().keys({
        _id: Joi.string().required(),
        product_cat: Joi.string().required(),
        product_name: Joi.string().required(),
        breed_type: Joi.string().required(),
        product_price: Joi.string().required(),
        selling_price: Joi.string().required(),
        product_discount: Joi.string().required(),
        product_color: Joi.string().required(),
        product_img: Joi.string().required(),
        product_decripton: Joi.array().required(),
    }),

    ADDSERVICES: Joi.object().keys({
        service_image: Joi.string().required(),
        workingDaysHours: Joi.array().required(),
        serviceCategory: Joi.string().required(),
        price: Joi.number().required(),
        experience : Joi.number().required(),
        description: Joi.string().required()
    }),

    EDITSERVICES : Joi.object().keys({
        _id : Joi.string().required(),
        service_image: Joi.string().required(),
        workingDaysHours: Joi.array().required(),
        serviceCategory: Joi.string().required(),
        price: Joi.number().required(),
        experience : Joi.number().required(),
        description: Joi.string().required()
    }),

}

module.exports = serviceProvider
