var { mongoose, conn } = require("../config/db");

const hostPackageSchema = new mongoose.Schema(
  {
    host : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Host",
        default: null,
    },
    
    package_name: {
      type: String,
      default: null,
    },

    package_img: {
      type: String,
      default: null,
    },

    breed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "productSubCategory",
      default: null,
    },

    pet_size: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      default: null,
    },

    price: {
      type: Number,
      default: 0,
    },

    duration : {
        type : Number,
        default : 0
    },
    available_facilities : {
      type: String,
      default: null,
    }
  },
  {
    strict: true,
    collection: "hostPackage",
    versionKey: false,
    timestamps: true,
  }
);

exports.HostPackageModel = mongoose.model("hostPackage",hostPackageSchema);
