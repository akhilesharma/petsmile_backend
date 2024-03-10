const { Joi } = require('celebrate');
const { join } = require('path');

let user = {
    LOGIN: Joi.object().keys({
        country_code: Joi.string().required(),
        mobile_number: Joi.string().required(),
        password: Joi.string().required(),
        device_type: Joi.string().required(),
        device_token: Joi.string().required(),
    }),

    CREATEUSER: Joi.object().keys({
        full_name: Joi.string().required(),
        mobile: Joi.string().required(),
        country_code: Joi.string().required(),
        mobile_number: Joi.string().required(),
        email: Joi.string().required(),
        gender: Joi.string().required(),
        password: Joi.string().required(),
        device_token: Joi.string().required(),
        device_type: Joi.string().required()
    }),

    CHANGEPASSWORD: Joi.object().keys({
        old_password: Joi.string().required(),
        password: Joi.string().required(),
    }),

    EDITPROFILE: Joi.object().keys({
        full_name: Joi.string().required(),
        email: Joi.string().required(),
        gender: Joi.string().required(),
    }),

    ADDPET: Joi.object().keys({
        pet_cat: Joi.string().required(),
        pet_name: Joi.string().required(),
        pet_dob: Joi.number().required(),
        pet_height: Joi.number().required(),
        pet_weight: Joi.number().required(),
        pet_gender: Joi.string().optional(),
        pet_special_care: Joi.string().required(),
        vaccine_name: Joi.string().optional().allow(null).allow(""),
        vaccine_date: Joi.string().optional().allow(null).allow(""),
        upcoming_vaccine_name: Joi.allow(null).allow('').optional(),
        upcoming_vaccine_date: Joi.allow(null).allow('').optional(),
        pet_pic: Joi.string().optional(),
    }),

    EDITPET: Joi.object().keys({
        _id: Joi.string().required(),
        pet_cat: Joi.string().required(),
        pet_name: Joi.string().required(),
        pet_dob: Joi.number().required(),
        pet_height: Joi.number().required(),
        pet_weight: Joi.number().required(),
        pet_gender: Joi.string().optional(),
        pet_special_care: Joi.string().required(),
        vaccine_name: Joi.string().optional().allow(null).allow(""),
        vaccine_date: Joi.string().optional().allow(null).allow(""),
        upcoming_vaccine_name: Joi.string().optional(),
        upcoming_vaccine_date: Joi.string().optional(),
        pet_pic: Joi.string().optional(),
    }),
    ADDTOCART: Joi.object().keys({
        productMainCategoryId: Joi.string().required(),
        product_id: Joi.string().required(),
        quantity: Joi.number().optional(),
        colorId: Joi.string().optional().allow(null).allow(""),
        weight: Joi.string().optional().allow(null).allow(""),
        size: Joi.string().optional().allow(null).allow("")
    }),
    ADDADDRESS: Joi.object().keys({
        house_no: Joi.string().required(),
        street: Joi.string().required(),
        city: Joi.string().required(),
        postal_code: Joi.string().optional().allow(null).allow(""),
        type: Joi.number().required(),
        country: Joi.string().required(),
        state: Joi.string().required(),
        locality: Joi.string().optional(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
    }),
    EDITADDRESS: Joi.object().keys({
        house_no: Joi.string().optional(),
        street: Joi.string().optional(),
        city: Joi.string().optional(),
        postal_code: Joi.string().optional(),
        type: Joi.number().optional(),
        country: Joi.string().optional(),
        state: Joi.string().optional(),
        locality: Joi.string().optional(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        _id: Joi.string().required()
    }),
    DELETEADDRESS: Joi.object().keys({
        _id: Joi.string().required()
    }),
    PRIMARYADDRESS: Joi.object().keys({
        _id: Joi.string().required()
    }),
    APPLYCOUPON: Joi.object().keys({
        price: Joi.number().required(),
        coupon_code: Joi.string().required()
    }),
    REMOVECOUPON: Joi.object().keys({
        originalPrice: Joi.number().required(),
        priceAfterDiscount: Joi.number().required(),
        coupon_code: Joi.string().required()
    }),
    PROCEEDTOPAY: Joi.object().keys({
        cartValue: Joi.number().required(),
        redeemedAmount: Joi.number().required(),
        discountAmount: Joi.number().optional().allow(""),
        deliveryCharge: Joi.number().optional().allow(""),
    }),
    PLACEORDER: Joi.object().keys({
        cartIds: Joi.array().required(),
        couponCode: Joi.string().optional().allow(""),
        totalAmount: Joi.number().required(),
        paymentOption: Joi.string().required(),
        discountAmount: Joi.number().required(),
        deliveryCharge: Joi.number().required(),
        redeemedAmount: Joi.number().required(),
        addressId: Joi.string().required(),
        token: Joi.string().optional().allow("")
    }),
    BOOKPACKAGE: Joi.object().keys({
        package_id: Joi.string().required(),
        host_id: Joi.string().required(),
        pet_id: Joi.string().required(),
        coupon: Joi.string().optional().allow(""),
        discount_amount: Joi.number().optional(),
        payable_amount: Joi.number().required(),
        service_date: Joi.number().required(),
        service_duration: Joi.number().optional(),
        payment_option: Joi.string().required(),
        address: Joi.string().required(),
        token: Joi.string().optional().allow("")
    }),
    SENDOTPTOVERIFYMOBILENUMBER: Joi.object().keys({
        country_code: Joi.string().required(),
        mobile_number: Joi.number().required()
    }),
    VERIFYMOBILENUMBER: Joi.object().keys({
        otp: Joi.number().required(),
    }),
}

module.exports = user