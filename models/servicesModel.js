var { mongoose, conn } = require("../config/db");
// const generateUniqueId = require('generate-unique-id');

const serviceSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      default: "",
    },
    country_code: {
      type: String,
    },
    mobile_number: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    is_verified_by_admin: {
      type: Number,
      default: 0, // 0 for Unverified , 1 for Verified
    },
    is_blocked: {
      type: Boolean,
      default: false
    },
    access_token: {
      type: String,
      default: "",
    },
    device_type: {
      type: Number,
      default: 1,
    }, // 1 for Android, 2 for IOS, 3 for Web
    device_token: {
      type: String,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    profile_pic: {
      type: String,
      default: "",
    },
    otp_info: {
      otp: { type: String },
      expTime: { type: Date }, //otp expiry time
    },
    is_otp_verified: {
      type: Boolean,
      default: false,
    },

    is_profile_created: {
      type: Boolean,
      default: false
    },

    is_bank_details_added: {
      type: Boolean,
      default: false
    },

    documents: {
      idProof: {
        type: String,
      }
    },
    location: {
      // type: { type: String, default: "Points" },
      address1: { type: String, default: null },
      address2: { type: String, default: null },
      address3: { type: String, default: null },
      coordinates: [Number]
  },

    bankDetails: {
      bankAccountName : {
        type : String
      },
      accountHolderName: {
        type: String,
      },
      accountNumber: {
        type: String,
      },
      bankCard: {
        type: String,
      },
    },
    unique_id: {
      type: String,
      default: ''
    },
    evidence_id: {
        type: String,
        default: ''
    },
    latitude : {
      type : Number,
      default : null
    },
    longitude : {
        type : Number,
        default : null
    },
  },
  {
    strict: true,
    collection: "serviceProvider",
    versionKey: false,
    timestamps: true,
  }
);

exports.ServiceProviderModel = mongoose.model("serviceProvider", serviceSchema);
