const { mongoose, conn } = require('../config/db');
const generateUniqueId = require('generate-unique-id');

const reportTicketSchema = mongoose.Schema(
    {
        uniqid: {
            user_id: { 
                type: mongoose.Types.ObjectId,
                ref: 'User'
            },
            host_id: { 
                type: mongoose.Types.ObjectId,
                ref: 'Host'
            },
            service_provider: {
                type: mongoose.Types.ObjectId,
                ref: 'serviceProvider'
            },
            seller_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Seller'
            },
            admin_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'adminModel'
            }
        },
        complaint_type: {
            type: String,
            default: "1" // 1 for user_cart_booking, 2 for user_service_booking, 3 for package_booking, 4 for host_cart_booking, 5 for host_service_booking
        },
        booking: {
            user_cart_booking: {
                type: mongoose.Types.ObjectId,
                ref: 'userOrder'
            },
            user_service_booking: {
                type: mongoose.Types.ObjectId,
                ref: 'userServiceBooking'
            },
            package_booking: {
                type: mongoose.Types.ObjectId,
                ref: 'packageBooking'
            },
            host_cart_booking: {
                type: mongoose.Types.ObjectId,
                ref: 'hostOrder'
            },
            host_service_booking: {
                type: mongoose.Types.ObjectId,
                ref: 'hostServiceBooking'
            },
        },
        complaint: {
            type: String,
            default: null
        },
        ticket_id: {
            type: String,
            default: generateUniqueId({ length: 7,useLetters: true }).toUpperCase()
        },
        ticket_status: {
            type: Number,
            default: 1  // 1 for open, 2 for closed
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
    collection: 'reportTicket',
    versionKey: false,
    strict: true
});

exports.ReportTicketModel = mongoose.model('reportTicket', reportTicketSchema);
