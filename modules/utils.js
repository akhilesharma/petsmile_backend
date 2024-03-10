const bcrypt = require("bcrypt");
const saltRounds = 10;
// var base64ToImage = require('base64-to-image');
var path = require("path");
var express = require('express');
var twilio = require('twilio');
var FCM = require('fcm-node');
var request = require("request");
// var sns = require('aws-node-sns');

const { accountSid,authToken,twilio_no } = require('../config/config');

exports.encryptText = async (plaintext) => {
    let encryptedPass = await bcrypt.hash(plaintext, saltRounds);
    return encryptedPass;
}

exports.compare = async (plaintext, encryptText) => {
    let matched = await bcrypt.compare(plaintext, encryptText);
    return matched;
}



exports.randomStringGenerator = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

exports.randomReportStringGenerator = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

exports.randomreferralCode = () => {
    return Math.random().toString(36).substring(7);
};

exports.sendotp =  (varification_code, mobile_number) => {
    var accountSid = "AC62892ca73eb7b1af54f485f511930e5d"; // Your Account SID from www.twilio.com/console
    var authToken = "e5806f7f8a5eeca2b6eac450ce48ca7a";   // Your Auth Token from www.twilio.com/console
    var twilio_no = "+13023035846";
    //console.log("AccountSid :",twilio_no );
    var client = new twilio(accountSid, authToken);
    client.messages.create({
        body: "your one time password(OTP) is  " + varification_code,
        to: mobile_number, // Text this number
        from: twilio_no // From a valid Twilio number
    }).then( async (message) => {
      console.log(message)
      console.log(message.sid)
        return  message.sid;
    }).catch(async (error)=>{
        // Handle any error from any of the steps...
        console.error('Buying the number failed. Reason: ',error);
        if(error.code == 21614 || error.code == 21211)
          // return await error.status;
            {throw new Error(`${mobile_number} not a valid mobile Number`)};
        throw new Error(error.message);
        // return error.status;
    });
}

// exports.sendotp = async ( text , mobile ) => {
//     sns.createClient({       
//         accessKeyId: "AKIAW4ZTJFPM7CG7EJ44",
//         secretAccessKey: "pTqEOVrKS+4rRXGgqyjZ+X/i9kUft4oTSf1WLLrt",
//         region: "me-south-1"  
//     });
//     let message = "your one time password (OTP) for petSmile account is  " + text + "  valid for 2 days do not disclose it";

//     sns.sendSMS(message , mobile , "petSmile" , 'Transactional' ,  function(error, data){
//         if (error){
//             console.log('eroorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr' , error)
//         }else{
//             console.log('MessageID' , data)
//         }
//     });
// }

exports.sendmail = function (email_id, subject, message) {
    var mail_config = {
        "SMTP_HOST": "smtp.mandrillapp.com",
        "SMTP_PORT": 587,
        "SMTP_USER": "elanapp", //default
        "SMTP_PASS": "XiP8fWlOdE_I4tA7wRcceg"
        //"SMTP_PASS" : mail_config.SMTP_PASS
    }
    var mailer = nodemailer.createTransport({
        // service: 'SendGrid',
        host: mail_config.SMTP_HOST,
        port: mail_config.SMTP_PORT,
        auth: {
            user: mail_config.SMTP_USER,
            pass: mail_config.SMTP_PASS
        }
    });
    mailer.sendMail({
        from: "api@elanapp.com",
        to: email_id,
        cc: "susheel.kumar@fluper.in",
        // cc: "anchal.goyal@fluper.in",
        subject: subject,
        template: "text",
        html: message
    }, (error, response) => {

        if (error) {
            console.log(error);
            //  res.send({ message: "Email not send " });
        } else {
            console.log(response);
            // resolve({ message: "Email send successfully" });
        }
        mailer.close();
        //res.send("Response send successfully");
    });
}

exports.sendPushNotification = function (token, device_type, payload, notify) {
    // let notify = {
    //   // "content-available": 1,
    //     title: title,
    //     body: body,
    //     // click_action: "FCM_PLUGIN_ACTIVITY",
    //     "color": "#f95b2c",
    //     "sound": true,
    //     // "badge": "0",
    //     // "alert" : "",
    // }

    let serverKey = "AAAAR1d6NMY:APA91bGYkT7piYXQCSs4AkuOc_2nFYyEdFvs8tqxPQs5Z5CWgRYBw9swrbCK1beTizxzuwuGgyE3nj_xAeqj1XZFN2_2pSH-E3Grp9MLCO4aTdoZ1uPHe3DniXOAEM8fONnLmjUrwvsk";

    console.log("send notification Android calling");
    var fcm = new FCM(serverKey);
    var message = {
        to: token,
        collapse_key: 'your_collapse_key',
        notification: notify,
        data: payload,
    };
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("=======================Android error comming===================")
            console.log(null, err);
        } else {
            console.log("=======================Android===================")
            console.log(null, response);            
        }
    });
}

//push notification for Ios
exports.sendPushNotificationForIos = function (token, device_type, payload) {
    console.log(token, "314234")
    device_token = token
    var options = {
        token: {
            key: path.join(__dirname, 'Modules', '../IOSKEY.p8'),
            keyId: "H97WA3FWVQ",  //Key Id heree
            teamId: "3P74WQ98DA" //TeamId Id heree
        },
        development: true
    };
    var apnProvider = new apn.Provider(options);
    var note = new apn.Notification();
    note.payload = payload
    note.alert = "DriverRequest"
    note.topic = 'com.fluper.DentSwift'  //Topic here
    note.contentAvailable = 1
    note.sound = 'default'
    apnProvider.send(note, device_token).then((result) => {
        if (result) {
            console.log(result, 'IOS Notification SEND');
        } else {
            console.log('Driver IOS -- something went wrong!!!!!');
        }
    });
}

exports.getOrderStatus = function (status) {
    switch (status) {
        case 1:
          status = "Order Pending"
          break;
        case 2:
          status = "Order Rejected"
          break;
        case 3:
          status = "Order Accepted"
          break;
        case 4:
          status = "Item Packed"
          break;  
        case 5:
          status = "Item Dispatched"
          break;
        case 6:
          status = "Delivered"
          break;  
        case 7:
          status = "Cancelled"
          break; 
        default: 
          status = "Order Pending" 
    }
    return status;
}

exports.getServiceOrderStatus = function (status) {
    switch (status) {
        case 1:
          status = "Order Pending"
          break;
        case 2:
          status = "Order Rejected"
          break;
        case 3:
          status = "Order Accepted"
          break;
        case 4:
          status = "Service Started"
          break;  
        case 5:
          status = "Service Completed"
          break;
        case 6:
          status = "Cancelled"
          break; 
        default: 
          status = "Order Pending" 
    }
    return status;
}

exports.getServicePaymentStatus = function (status) {
    switch (status) {
        case 0:
          status = "Payment Pending"
          break;
        case 1:
          status = "Payment Completed"
          break;
        case 2:
          status = "Payment Failed"
          break; 
        default: 
          status = "Payment Completed" 
    }
    return status;
}

exports.cancelCoboxOrder = function (cartData, cancelReason) {
  let delivery_token = cartData.delivery_token;
  let orderId =  cartData.delivery_id_order;
  return new Promise(function (resolve, reject) {
    var options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+ delivery_token,
      },
      url: `https://api.coboxlogistic.com/v0.4.0/orders/${orderId}/orders-status/cancel`, // Test environment
      body: JSON.stringify({
        "observation": cancelReason,
        "commentary": cancelReason    
      })
    };
    // console.log((options))
    request(options, async function (error, response, body) {
        if (!error) {
          resolve(body);
        } else {
          reject(error);
        }
    })
  })
}

exports.coboxOrderStatus = function (delivery_token, delivery_id_order) {
  return new Promise(function (resolve, reject) {
    var options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+ delivery_token,
      },
      url: `https://api.coboxlogistic.com/v0.4.0/orders/${delivery_id_order}`, // Test environment
    };
    request(options, async function (error, response, body) {
        if (!error) {
          resolve(body);
        } else {
          reject(error);
        }
    })
  })
}