var { mongoose, conn } = require('../config/db');

const healthGoalPointSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    seller_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Seller'
    },
    serviceProvider_id: {
        type: mongoose.Types.ObjectId,
        ref: 'ServiceProvider'
    },    
    host_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Host'
    },
    health_goal_point: {
        type: Number,
        default: 0
    },
    // usage_limit_purchase: {
    //     type: String,
    //     default: ''   
    // },
    created_at:{
        type: String,
        default: new Date().getTime()
    }
},
    {
        strict: true,
        collection: 'sethealthpoints',
        versionKey: false,
        timestamps : true
    }
);

exports.HealthGoalPointModel = mongoose.model('sethealthpoints', healthGoalPointSchema);

