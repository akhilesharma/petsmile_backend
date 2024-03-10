var { mongoose, conn } = require("../config/db");

const commssionSchema = new mongoose.Schema(
  {
    commission_percent: {
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
    collection: "commission",
    versionKey: false,
  }
);

exports.CommissionModel = mongoose.model("commission", commssionSchema);
