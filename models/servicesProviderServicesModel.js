var { mongoose, conn } = require("../config/db");
// const generateUniqueId = require('generate-unique-id');

const serviceSchema = new mongoose.Schema(
  {
    service_image : {
      type : String,
      default : null
    },
    serviceCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "serviceCategory",
      default: null
    },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "serviceProvider",
      default: null
    },
    price: {
      type: Number,
      default: 0
    },
    experience : {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      default: null
    },
    // workingDaysHours:[{
    //   day:{type:String,default:""},
    //   startTime:{type:String,default:""},
    //   endTime:{type:String,default:""}
    // }]
    workingDaysHours: {
      type: Array,
      default: []
    }
  },
  {
    strict: true,
    collection: "serviceProviderServices",
    versionKey: false,
    timestamps: true,
  }
);

exports.ServiceProviderServicesModel = mongoose.model("serviceProviderServices", serviceSchema);
