var { mongoose, conn } = require("../config/db");

const serviceChargeSchema = new mongoose.Schema(
  {
    service_charge: {
      type: Number,
      default: 0
    },
    modified_at: {
      type: Number,
      default: new Date().getTime()
    }
  },
  {
    strict: true,
    collection: "serviceCharge",
    versionKey: false,
  }
);

exports.ServiceChargeModel = mongoose.model("serviceCharge", serviceChargeSchema);
