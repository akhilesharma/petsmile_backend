const { conn, mongoose } = require("../config/db");
const validator = require("validator");

const productCategory = mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
    },
    categoryImage: {
        type: String,
        // required: true,
    },
    createdAt: {
        type: Number,
        default: new Date().getTime(),
    },
    updateAt: {
        type: Number,
        default: new Date().getTime(),
    },
});

exports.productCategoryAdminModel = mongoose.model("productCategory", productCategory);