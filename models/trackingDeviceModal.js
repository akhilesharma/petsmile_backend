var { mongoose, conn } = require("../config/db");
// const generateUniqueId = require('generate-unique-id');

const trackingSchema = new mongoose.Schema(
  {
    seller:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'adminModel'
    },
    productMainCategoryId: {
      type: mongoose.Types.ObjectId,
      ref: 'productMainCategory'
    },
    skuNumber: {
      type: String,
      default: "",
    },
    product_name: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    product_quantity: {
      type: Number,
      default: 0,
    },
    product_price: {
      type: String,
      default: "",
    },
    selling_price: {
      type: String,
      default: "",
    },
    product_discount: {
      type: String,
      default: "",
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
    product_decripton:[
      String
    ]
  },
  {
    strict: true,
    collection: "trackingDevice",
    versionKey: false,
    timestamps: true,
  }
);

exports.TrackingDeviceModel = mongoose.model("trackingDevice", trackingSchema);
