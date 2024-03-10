const { mongoose, conn } = require('../config/db');

const serviceCategorySchema = mongoose.Schema(
    {
        category_name: {
            type: String,
            default: null
        },
        category_image: {
            type: String,
            default: null
        },
        is_blocked: {
            type: Number,
            default: 0
        },
        created_at: {
            type: Number,
            default: new Date().getTime()
        },
        modified_at: {
            type: Number,
            default: new Date().getTime()
        }
    }, {
    collection: 'serviceCategory',
    versionKey: false,
    strict: true
});

exports.ServiceCategoryModel = mongoose.model('serviceCategory', serviceCategorySchema);
