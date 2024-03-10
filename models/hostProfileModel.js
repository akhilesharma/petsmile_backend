var { mongoose, conn } = require('../config/db');
// const generateUniqueId = require('generate-unique-id');

const hostSchema = new mongoose.Schema({

    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Host'
    },
    documents: {
        idProof: {
            type: String
        },
        shopLicense: {
            type: String
        }
    },
    bankDetails: {
        accountHolderName: {
            type: String
        },
        accountNumber: {
            type: String
        },
        bankCard: {
            type: String
        }
    },
    address: {
        streetAddress: {
            type: String
        },
        apt_suite: {
            type: String
        },
        city: {
            type: String
        },
        country: {
            type: String
        },
        zip: {
            type: String
        },
        latitude:{ 
            type : Number
        },
        longitude:{ 
            type : Number
        },
    }


},
    {
        strict: true,
        collection: 'HostProfile',
        versionKey: false,
        timestamps: true
    }
);

exports.HostProfileModel = mongoose.model('HostProfile', hostSchema);
