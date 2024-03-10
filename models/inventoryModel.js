var { mongoose, conn } = require('../config/db');
// const generateUniqueId = require('generate-unique-id');

const inventorySchema = new mongoose.Schema({

    trackingDeviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trackingDevice'
    },
    stock: {
        type: String,
        default: 0
    },
    minStock: {
        type: Number,
        default: 0
    },
    stockStatus: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Number,
        default: new Date().getTime(),
    },
    updateAt: {
        type: Number,
        default: new Date().getTime(),
    },
})

exports.inventoryModel = mongoose.model("inventoryModel", inventorySchema);
