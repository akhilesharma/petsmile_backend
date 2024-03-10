const { conn, mongoose } = require("../config/db");
const validator = require("validator");

const productMainCategory = mongoose.Schema({
    mainCategoryName: {
        type: String,
        required: true,
    },
    MainCategoryImage: {
        type: String,
        // required: true,
    },
    colorSelected: {
        type: Boolean,
        default: false
    },
    showUser: {
        type: Boolean,
        default: false
    },
    showHost: {
        type: Boolean,
        default: false
    },
    orderNumber :{
        type : Number,
        default : null
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

exports.productMainCategoryAdminModel = mongoose.model("productMainCategory", productMainCategory);