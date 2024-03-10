var { mongoose, conn } = require("../config/db");
// const generateUniqueId = require('generate-unique-id');

const ratingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    device_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trackingDevice",
    },
    rate: {
      type: String,
      default: null,
    },
    review: {
      type: String,
      default: null,
    },
  },
  {
    strict: true,
    collection: "trackingDeviceRating",
    versionKey: false,
    timestamps: true,
  }
);

exports.TrackingDeviceRatingModel = mongoose.model("trackingDeviceRating",ratingSchema);
