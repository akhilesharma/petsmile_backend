var { mongoose, conn } = require('../config/db');

const notificationSchema = new mongoose.Schema({
    uniqe_id: {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        host_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Host'
        },
        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Seller'
        },
        provider_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'serviceProvider'
        },
        admin_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'adminModel'
        },
    },
    title:{
        type:String,
        require:true
    },
    body:{
        type:String,
        require:true
    },
    order_id: {
        user_order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userOrder'
        },
        host_order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'hostOrder'
        },
        host_service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'hostServiceBooking'
        },
        user_service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userServiceBooking'
        },
        package_booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'packageBooking'
        }
    },
    notification_type:{
        type: Number,  // 1 for orderPending, 2 for orderReject, 3 for orderAccepted,  4 for orderItemPacked, 5 for orderDispatched, 6 for orderDelivered, 7 for orderCancelled, 8 for  serviceOrderPending , 9 for serviceOrderReject , 10 for  serviceOrderAccept, 11 serviceOrderServiceStarted, 12 serviceOrderServiceCompleted , 13 serviceOrderUserCancel , 14 packageOrderUserCancel, 15 sellerUpdateProductQuantity 
    },
    type:{
        type: Number,  //1 for user, 2 for host, 3 for seller, 4 for serviceprovider, 5 for admin
    },
    is_read: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Number,
        default: new Date().getTime()
    },
    is_blocked :{
        type : 0     // 0 for Inbclock 1 for Block  
    }

},
    {
        strict: true,
        collection: 'notification',
        versionKey: false
    }
);

exports.NotificationModel = mongoose.model('notification', notificationSchema);
