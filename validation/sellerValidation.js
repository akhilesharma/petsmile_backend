const { Joi } = require("celebrate");

let seller = {
  REGISTERSELLER: Joi.object().keys({
    country_code: Joi.string().required(),
    mobile_number: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    device_token: Joi.string().required(),
    device_type: Joi.string().required(),
  }),
  OTP: Joi.object().keys({
    otp: Joi.string().required(),
  }),
  COMPLETEPROFILE: Joi.object().keys({
    email: Joi.string().required(),
    store_name: Joi.string().required(),
    address1: Joi.string().required(),
    address2: Joi.string().optional(),
    address3: Joi.string().optional(),
    idProof: Joi.string().required(),
    shopLicense: Joi.string().required(),
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
    mobile_number: Joi.string().required(),
  }),
  RESETPASSWORD: Joi.object().keys({
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  }),
  LOGIN: Joi.object().keys({
    country_code: Joi.string().required(),
    mobile_number: Joi.string().required(),
    password: Joi.string().required(),
    device_token : Joi.string().optional(),
  }),
  EDITPROFILE: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    profile_pic: Joi.string().optional().allow('').allow(null),
    // address1: Joi.string().required(),
    // address2: Joi.string().optional(),
    // address3: Joi.string().optional(),
    // idProof: Joi.string().required(),
  }),

  EDITADDRESS: Joi.object().keys({

    address1: Joi.string().required(),
    address2: Joi.string().optional(),
    address3: Joi.string().optional(),
    idProof: Joi.string().required(),
    shopLicense: Joi.string().required(),
    store_name: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }),

  CHANGEPASSWORD: Joi.object().keys({
    old_password: Joi.string().required(),
    password: Joi.string().required(),
  }),

  ADDPRODUCT: Joi.object().keys({
    product_main_cat: Joi.string().optional(),
    product_cat: Joi.string().required(),
    product_name: Joi.string().required(),
    breed_type: Joi.string().required(),
    product_price: Joi.string().required(),
    selling_price: Joi.string().required(),
    product_discount: Joi.string().required(),
    // product_color : Joi.array().required(),
    // product_img : Joi.array().required(),
    product_decripton: Joi.array().required(),
    product_details: Joi.array().required(),
    weight_size : Joi.array().required()
  }),

  EDITPRODUCT: Joi.object().keys({
    _id: Joi.string().required(),
    product_main_cat: Joi.string().optional(),
    product_cat: Joi.string().required(),
    product_name: Joi.string().required(),
    breed_type: Joi.string().required(),
    product_price: Joi.string().required(),
    selling_price: Joi.string().required(),
    product_discount: Joi.string().required(),
    product_color: Joi.string().required(),
    product_img: Joi.string().required(),
    product_decripton: Joi.array().required(),
    weight_size : Joi.array().required()
  }),

  DELETEPRODUCT: Joi.object().keys({
    _id: Joi.string().required()
  }),

  UPDATEPRODUCTQUANTITY: Joi.object().keys({
    _id: Joi.string().required(),
    product_quantity: Joi.number().required()
  }),

  UPDATESKULMINLIMIT: Joi.object().keys({
    _id: Joi.string().required(),
    sku_min_limit: Joi.number().required()
  }),

  UPDATEPRODUCTSTATUS: Joi.object().keys({
    _id: Joi.string().required(),
    set_status: Joi.number().required()
  }),
  PENDINGORDERS: Joi.object().keys({
    status: Joi.number().required()
  }),
  UPDATEORDERSTATUS: Joi.object().keys({
    status: Joi.number().required(),
    order_id: Joi.string().required()
  }),
  GENERATEINVOICE: Joi.object().keys({
    _id: Joi.string().required()
  }),

};

module.exports = seller;
