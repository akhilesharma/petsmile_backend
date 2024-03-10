var { mongoose, conn } = require("../config/db");

const advertisementSchema = new mongoose.Schema(
  {
    adv_name: {
      type: String,
      default: "",
    },

    image: {
      type: String,
    },
    is_user : {
      type : Boolean,
      default : false
    },
    is_host : {
      type : Boolean,
      default : false
    },
    is_seller : {
      type : Boolean,
      default : false
    },
    is_service : {
      type : Boolean,
      default : false
    },
    start_date: {
      type: Number,
      default: new Date().getTime(),
    },
    end_date: {
      type: Number,
      default: new Date().getTime(),
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    date_created: {
      type: Number,
      default: new Date().getTime(),
    },
    is_blocked: {
      type: Number,
      default: 0,
    },
  },
  {
    strict: true,
    collection: "advertisement",
    versionKey: false,
  }
);

exports.AdvertisementModel = mongoose.model(
  "advertisement",
  advertisementSchema
);
