const { Joi } = require("celebrate");

let host = {
  CREATEHOST: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    country_code: Joi.string().required(),
    mobile_number: Joi.string().required(),
    password: Joi.string().required(),
    confirm_password: Joi.string().required(),
    device_token: Joi.string().required(),
    device_type: Joi.string().required(),
    term_condition: Joi.boolean().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }),
  VERIFYOTP: Joi.object().keys({
    otp: Joi.string().required(),
  }),
  CREATEHOSTPROFILE: Joi.object().keys({
    idProof: Joi.string().required(),
    shopLicense: Joi.string().required(),
    accountHolderName: Joi.string().required(),
    accountNumber: Joi.string().required(),
    bankCard: Joi.string().required(),
    streetAddress: Joi.string().required(),
    apt_suite :Joi.string().allow(null).allow('').optional(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    zip: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }),
  LOGIN: {
    mobile_number: Joi.string().required(),
    country_code: Joi.string().required(),
    password: Joi.string().required(),
    device_token: Joi.string().optional()
  },
  FORGETPASSWORD: {
    mobile_number: Joi.string().required(),
    country_code: Joi.string().required(),
  },
  CREATENEWPASSWORD: {
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  },
  EDITPROFILE: {
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    profile_pic: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  },

  CHANGEPASSWORD: {
    old_password: Joi.string().required(),
    password: Joi.string().required(),
  },
  
  ADDTOCART:Joi.object().keys({
    productMainCategoryId: Joi.string().required(),
    product_id : Joi.string().required(),
    quantity: Joi.number().required(),
    colorId:Joi.string().optional().allow(null).allow(""),
    weight : Joi.string().optional(),
    size : Joi.string().optional(),
  }),

  ADDTOWISHLIST:Joi.object().keys({
    product_id : Joi.string().required(),
    weight : Joi.string().optional(),
    size : Joi.string().optional(),
    // quantity: Joi.number().required()
  }),
  APPLYCOUPON:Joi.object().keys({
    price:Joi.number().required(),
    coupon_code:Joi.string().required()
  }),
  REMOVECOUPON:Joi.object().keys({
      originalPrice:Joi.number().required(),
      priceAfterDiscount:Joi.number().required(),
      coupon_code:Joi.string().required()
  }),
  PROCEEDTOPAY:Joi.object().keys({
      cartValue:Joi.number().required(),
      discountAmount:Joi.number().optional(),
      deliveryCharge:Joi.number().optional(),
  }),
  PLACEORDER:Joi.object().keys({
      cartIds:Joi.array().required(),
      couponCode:Joi.string().optional().allow(""),
      totalAmount:Joi.number().required(),
      paymentOption:Joi.string().required(),
      discountAmount:Joi.number().required(),
      deliveryCharge:Joi.number().required(),
      addressId:Joi.string().required(),
      token:Joi.string().optional().allow("")
  }),
  ADDPACKAGE : Joi.object().keys({
    package_name : Joi.string().required(),
    package_img : Joi.string().required(),
    breed : Joi.string().required(),
    pet_size : Joi.number().required(),
    description : Joi.string().required(),
    price : Joi.number().required(),
    duration : Joi.number().required(),
    available_facilities : Joi.string().optional()
  }),
   
  EDITPACKAGE : Joi.object().keys({
    _id : Joi.string().required(),
    package_name : Joi.string().required(),
    package_img : Joi.string().required(),
    breed : Joi.string().required(),
    pet_size : Joi.number().required(),
    description : Joi.string().required(),
    price : Joi.number().required(),
    duration : Joi.number().required(),
    available_facilities : Joi.string().optional()
  }),

  VIEWPACKAGEDETAILS : Joi.object().keys({
    _id : Joi.string().required(),
  }),
};

module.exports = host;
