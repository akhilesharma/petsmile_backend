var { mongoose, conn } = require('../config/db');

const userNotificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        default: ''   
    },
    body: {
        type: String,
        default: ''   
    },
    type: {
        type: Number,
        default: 0 // 0 for user, 1 for seller, 2 for admin   
    },
    created_at:{
        type: String,
        default: new Date().getTime()
    }
},
    {
        strict: true,
        collection: 'userNotification',
        versionKey: false
    }
);

exports.UserNotificationModel = mongoose.model('userNotification', userNotificationSchema);

