const { conn, mongoose } = require("../config/db");
const validator = require("validator");

const productSubCategory = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productCategory'
    },
    subCategoryName: {
        type: String,
        required: true,
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

exports.productSubCategoryAdminModel = mongoose.model("productSubCategory", productSubCategory);