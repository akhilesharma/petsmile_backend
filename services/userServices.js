const { UserModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
const authentication = require("../middlewares/authentication");
const config = require("../config/config");
const mongoose = require("mongoose");
const { msg } = require("../modules/messages");
const Joi = require("joi");
const utils = require("../modules/utils");
const _ = require("lodash");
const generateUniqueId = require('generate-unique-id');
const { UserPetManageModel } = require('../models/userPetsManageModel');
const { productCategoryAdminModel } = require('../models/productCategoryAdminModel');
const { productMainCategoryAdminModel } = require("../models/productMainCategoryModel");
const { ProductCatModel } = require("../models/sellerProductModel");
const { UserCartModel } = require("../models/userCartModel");
const { UserWishlistModel } = require("../models/userWishlistModel");
const { UserAddressModel } = require("../models/userAddressModel");
const { PromocodeModel } = require("../models/promocodeModel");
const { UserOrderModel } = require("../models/userOrderModel");
const { UserOrderBookingModel } = require("../models/userOrderBookingModel");
const { AdminModel } = require("../models/adminModel");
const { TrackingDeviceModel } = require("../models/trackingDeviceModal");
const { OrderRatingModel } = require("../models/orderRatingModel");
const { AdvertisementModel } = require("../models/AdvertisementModel");
const { ServiceCategoryModel } = require("../models/serviceCategoryModel");
const { ServiceProviderServicesModel } = require("../models/servicesProviderServicesModel");
const { UserServiceBookingModel } = require("../models/userServiceBookingModel");
const { NotificationModel } = require("../models/notificationModel");
const { SellerModel } = require("../models/sellerModel");
const { ServiceProviderModel } = require("../models/servicesModel");
const { ServiceOrderRatingModel } = require("../models/serviceOrderRatingModel");
const { HostPackageModel } = require("../models/hostPackageModel");
const { HostAddressModel } = require("../models/hostAddressModel");
const { PackageBookingModel } = require("../models/packageBookingModel");
const { HostModel } = require("../models/hostModel");
const { PackageOrderRatingModel } = require("../models/packageOrderRatingModel");
const { SettingModel } = require("../models/settingModel");
const { FaqModel } = require("../models/faqModel");
const { ReportTicketModel } = require("../models/reportTicketModel");
const { HostOrderModel } = require("../models/hostOrderModel");
const { HostServiceBookingModel } = require("../models/hostServiceBookingModel");
const { UserWalletTransactionModel } = require("../models/userWalletTransactionModel");
const { UserWalletModel } = require("../models/userWalletModel");
const { CommissionModel } = require("../models/commissionModel");
const { likeModel, userLikeModel } = require("../models/likeModel");
const { HealthGoalPointModel } = require("../models/setHealthPointModel");
const { UsageLimitPurchaseModel } = require("../models/usageLimitPurchaseModel");
const { HostCartModel } = require("../models/hostCartModel");
const axios = require('axios');
var request = require("request");
const { UserRedeemPointModel } = require("../models/userRedeemPointModel");
const { UserRedeemPointTransactionModel } = require("../models/userRedeemPointTransactionModel");
const { ServiceChargeModel } = require("../models/serviceChargeModel");
const { HostProfileModel } = require('../models/hostProfileModel');


//============================> M1 <============================

exports.uploadFile = async (req) => {
  try {
    let file = req.files;
    if (file && file.images) {
      let images = file.images;
      let images1 = [];
      for (let index = 0; index < images.length; index++) {
        images1[index] = images[index].location;
      }
      return {data: { images: images1 },message: "Success",status: 1
      }
    } else {
      return {data: {},message: "Unable to upload Image",status: 0
      }
    }
    console.log(file);
    return {status: 1,message: "Success",data: file
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

let sendOtp = async (userData) => {
  try {
    let otp = await utils.randomStringGenerator();
    // let otpExpTime = new Date(Date.now() + config.defaultOTPExpireTime);
    userData.otp_info = otp;
    let mobileNumber = userData.country_code + userData.mobile_number;
    console.log(mobileNumber)
    console.log(otp)

    //Send message via Twillio
    let sendData = await utils.sendotp(otp, mobileNumber);
    console.log(sendData)
    // if(sendData){
    return {
      status: 1,
      message: "OTP sent Successfully",
      data: userData
    };
    // }else{
    //   return { status: 0, message: "Mobile number or country code is not valid" };
    // }
  } catch (err) {
    throw new Error(err.message);
  }
};

let sendCartNotification = async (user, sellerIds) => {
  try {

    /* Code for notification start */
    let title = "Order Placed";
    let Notificationbody = "Your order has been placed successfully";
    let device_type = user.device_type;
    let notification = {
      uniqe_id: {
        user_id: user._id
      },
      title: title,
      body: Notificationbody,
      notification_type: 1,
      type: 1,
      created_at: new Date().getTime()
    }
    let sendNotification = await NotificationModel.create(notification);
    sendNotification.save();

    let payload = {
      title: title,
      body: Notificationbody,
      noti_type: 1
    }
    let notify = {
      title: title,
      body: Notificationbody,
      "color": "#f95b2c",
      "sound": true
    }
    if (user.device_token) {
      utils.sendPushNotification(user.device_token, device_type, payload, notify);
    }

    /* Code for notification start to Seller */
    if (sellerIds.length > 0) {
      for (let j = 0; j < sellerIds.length; j++) {
        let sellerId = sellerIds[j];
        let device_token = "";
        let device_type = 1;
        let sellerData = await SellerModel.findOne({ _id: mongoose.Types.ObjectId(sellerIds[j]) }, { device_token: 1, device_type: 1 }).lean();
        if (!sellerData) {
          let adminData = await AdminModel.findOne({}, { email: 1, _id: 1 });
          device_token = adminData.deviceToken;
          device_type = adminData.deviceType;
        } else {
          device_token = sellerData.device_token;
          device_type = sellerData.device_type;
        }
        let sellerTitle = "Order Placed";
        let sellerNotiBody = "New order has been placed by " + user.full_name;

        let sellerNotification = {
          uniqe_id: {
            seller_id: sellerId,
            provider_id: sellerId,
            admin_id: sellerId,
          },
          title: sellerTitle,
          body: sellerNotiBody,
          notification_type: 1,
          type: 3,
          created_at: new Date().getTime()
        }
        let sendNoti = await NotificationModel.create(sellerNotification);
        sendNoti.save();

        let sellerPayload = {
          title: sellerTitle,
          body: sellerNotiBody,
          noti_type: 1
        }
        let sellerNotify = {
          title: sellerTitle,
          body: sellerNotiBody,
          "color": "#f95b2c",
          "sound": true
        }
        if (device_token) {
          utils.sendPushNotification(device_token, device_type, sellerPayload, sellerNotify);
        }
      }
    }

    /* Code for notification end to Seller */

    /* Code for notification start to Admin */
    let admin = await AdminModel.findOne({}, { email: 1, _id: 1 });
    let adminTitle = "Order Placed";
    let NotiBody = "New order has been placed by " + user.full_name;

    let adminNotification = {
      uniqe_id: {
        admin_id: admin._id
      },
      title: adminTitle,
      body: NotiBody,
      notification_type: 1,
      type: 5,
      created_at: new Date().getTime()
    }
    let send_noti = await NotificationModel.create(adminNotification);
    send_noti.save();
    /* Code for notification end */

    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};

let sendNotificationToSeller = async (productIds) => {
  try {
    if (productIds.length > 0) {
      for (let i = 0; i < productIds.length; i++) {
        let product = await ProductCatModel.findOne({ _id: productIds[i] }, { product_quantity: 1, product_name: 1, seller: 1, sku_min_limit: 1 }).lean();
        if (product) {
          let usersold = 0;
          let hostsold = 0;
          let userOrderList = await UserCartModel.find({ "product.seller_product": mongoose.Types.ObjectId(productIds[i]), isDeleted: false, $or: [{ status: 1 }, { status: 3 }, { status: 4 }, { status: 5 }, { status: 6 }, { status: 7 }] }, { quantity: 1 }).lean();
          if (userOrderList.length > 0) {
            usersold = userOrderList.reduce((accumulator, object) => {
              return accumulator + object.quantity;
            }, 0);
          }
          let hostOrderList = await HostCartModel.find({ "product.seller_product": mongoose.Types.ObjectId(productIds[i]), isDeleted: false, $or: [{ status: 1 }, { status: 3 }, { status: 4 }, { status: 5 }, { status: 6 }, { status: 7 }] }, { quantity: 1 }).lean();
          if (hostOrderList.length > 0) {
            hostsold = hostOrderList.reduce((accumulator, object) => {
              return accumulator + object.quantity;
            }, 0);
          }
          let totalSell = Number(usersold) + Number(hostsold)
          // console.log(totalSell)
          let remainingQuantity = (Number(product.product_quantity) - Number(totalSell));
          if (Number(remainingQuantity) <= Number(product.sku_min_limit)) {
            let seller = await SellerModel.findOne({ _id: mongoose.Types.ObjectId(product.seller) }, { _id: 1, device_token: 1, device_type: 1 }).lean();
            /* Code for notification start */
            let title = "Update product quantity";
            let Notificationbody =
              "Quantity of product " +
              product.product_name +
              " is less than SKU limit, please updated quantity";

            let device_type = seller.device_type;
            let notification = {
              uniqe_id: {
                seller_id: seller._id,
                provider_id: seller._id,
              },
              title: title,
              body: Notificationbody,
              notification_type: 15,
              type: 3,
              created_at: new Date().getTime(),
            };
            let sendNotification = await NotificationModel.create(notification);
            sendNotification.save();

            let payload = {
              title: title,
              body: Notificationbody,
              noti_type: 1,
            };
            let notify = {
              title: title,
              body: Notificationbody,
              color: "#f95b2c",
              sound: true,
            };
            if (seller.device_token) {
              utils.sendPushNotification(
                seller.device_token,
                device_type,
                payload,
                notify
              );
            }
            /* Code for notification end */
          }
        }
      }
    }
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
}

let sendServiceBookingNotification = async (user, service_id) => {
  try {
    /* Code for notification start */
    let title = "Order done";
    let Notificationbody = "Thanks for placing service order";
    let device_type = user.device_type;
    let notification = {
      uniqe_id: {
        user_id: user._id,
        host_id: user._id,
      },
      title: title,
      body: Notificationbody,
      notification_type: 8,
      type: 1,
      created_at: new Date().getTime()
    }
    let sendNotification = await NotificationModel.create(notification);
    sendNotification.save();

    let payload = {
      title: title,
      body: Notificationbody,
      noti_type: 1
    }
    let notify = {
      title: title,
      body: Notificationbody,
      "color": "#f95b2c",
      "sound": true
    }
    if (user.device_token) {
      utils.sendPushNotification(user.device_token, device_type, payload, notify);
    }
    /* Code for notification end */
    /* Code for notification start to Seller */
    let provider = await ServiceProviderServicesModel.findOne({ _id: mongoose.Types.ObjectId(service_id) }, { serviceProvider: 1 }).populate('serviceProvider', 'device_type device_token').lean();
    let device_token = provider ? provider.serviceProvider.device_token : "";
    let seller_device_type = provider ? provider.serviceProvider.device_type : "";
    let sellerTitle = "Order Placed";
    let sellerNotiBody = "New order has been placed by " + user.full_name;
    if (provider) {
      let sellerNotification = {
        uniqe_id: {
          seller_id: provider ? provider.serviceProvider._id : "",
          provider_id: provider ? provider.serviceProvider._id : "",
        },
        title: sellerTitle,
        body: sellerNotiBody,
        notification_type: 1,
        type: 3,
        created_at: new Date().getTime()
      }
      let sendNoti = await NotificationModel.create(sellerNotification);
      sendNoti.save();
    }

    let sellerPayload = {
      title: sellerTitle,
      body: sellerNotiBody,
      noti_type: 1
    }
    let sellerNotify = {
      title: sellerTitle,
      body: sellerNotiBody,
      "color": "#f95b2c",
      "sound": true
    }
    if (device_token) {
      utils.sendPushNotification(device_token, seller_device_type, sellerPayload, sellerNotify);
    }
    /* Code for notification end to Seller */

    /* Code for notification start to Admin */
    let admin = await AdminModel.findOne({}, { email: 1, _id: 1 });
    let adminTitle = "Order Placed";
    let NotiBody = "New order has been placed by " + user.full_name;

    let adminNotification = {
      uniqe_id: {
        admin_id: admin._id
      },
      title: adminTitle,
      body: NotiBody,
      notification_type: 1,
      type: 5,
      created_at: new Date().getTime()
    }
    let send_noti = await NotificationModel.create(adminNotification);
    send_noti.save();
    /* Code for notification end */

    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};

function loginCobox() {
  return new Promise(function (resolve, reject) {
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoiZWEzOGYyOTYtY2NkMS00OWVjLWJjMTMtY2M3ZWVjYWUyNWM0IiwiZW1haWwiOiJqdWFuQGdtYWlsLmNvbSIsIm5hbWUiOiJKdWFuIHBlcmV6IiwiaWRfcm9sZSI6MSwiaWRfY29tbWVyY2UiOjEsImlkX3BsYWNlIjpudWxsLCJpc19hY3RpdmUiOnRydWUsImlzX2RlbGV0ZWQiOmZhbHNlLCJyb2xlIjp7ImlkX3JvbGUiOjEsIm5hbWUiOiJBRE1JTl9DT01NRVJDRSIsImxhYmVsIjoiQWRtaW4gR2VuZXJhbCBvZiBjb21tZXJjZSIsImRlc2NyaXB0aW9uIjoiVXNlciBBZG1pbiBnZW5lcmFsIG9mIGNvbW1lcmNlLCBhZG1pbiBhbCBwbGFjZXMuIChOb3QgbmVjZXNhcnkgZmllbGQgaWRfcGxhY2UgaW4gdXNlciIsImlzX2RlbGV0ZWQiOmZhbHNlfSwiY29tbWVyY2UiOnsiaWRfY29tbWVyY2UiOjEsIm5hbWUiOiJSZXB1ZXN0b3MgR2FyYXkiLCJkZXNjcmlwdGlvbiI6IkFib3V0IHRoaXMgY29tbWVyY2UiLCJhZGRyZXNzIjoiQXYgSmF2aWVyIFByYWRvIDQ1NiwgTGEgTW9saW5hLCBMaW1hLCBQZXJ1IiwiZW1haWwiOiJjb250YWN0b0ByZXB1ZXN0b3NnYXJheS5jb20iLCJ0ZWxlcGhvbmUiOiIrNTEgMTIzNDU2Nzg5IiwiaXNfZGVsZXRlZCI6ZmFsc2V9LCJpYXQiOjE2NzI4Mzk2NTcsImV4cCI6MTY3NTQzMTY1N30.06awFiVHMnk-mfOyEoV2JwenDBM5rDsD7j3ja_d8Ta0"
      },
      url: 'https://api.coboxlogistic.com/v0.4.0/auth/login',//'https://api-test.coboxlogistic.com/v0.4.0/auth/login', // Test environment
      body: JSON.stringify({
        "email": "developer@petsworld.pets", // test cred:- "developer@petsworld.pets",
        "password": "petProd$30GoWin" //"t3$stC0mN3Gcp-1"
      })
    };

    request(options, async function (error, response, body) {
      if (!error) {
        console.log('1234')
        resolve(body);
      } else {
        console.log('abcd')
        console.log(error)
        reject(error);
      }
    })
  })
}

function getBudgetGroups(token, seller, user, product, address, cartData) {
  return new Promise(function (resolve, reject) {
    let sellerLatitude = seller.admin_id == null ? ((seller.seller_id && seller.seller_id.latitude) ? seller.seller_id.latitude : 9.1900) : seller.admin_id.latitude;
    let sellerLongitude = seller.admin_id == null ? ((seller.seller_id && seller.seller_id.longitude) ? seller.seller_id.longitude : 75.0152) : seller.admin_id.longitude;
    let sellerName = seller.admin_id == null ? ((seller.seller_id && seller.seller_id.first_name) ? (seller.seller_id.first_name + seller.seller_id.last_name) : "About this budget") : seller.admin_id.name;
    // console.log(product)
    let userLatitude = (address && address.latitude) ? address.latitude : 28.5355;
    let userLongitude = (address && address.longitude) ? address.longitude : 77.3910;

    let productName = product.admin_product == null ? ((product.seller_product && product.seller_product.product_name) ? product.seller_product.product_name : "petsmile product") : product.admin_product.product_name;
    let productId = product.admin_product == null ? ((product.seller_product && product.seller_product._id) ? product.seller_product._id : "12345") : product.admin_product._id;
    let productdescription = product.admin_product == null ? ((product.seller_product && (product.seller_product.product_decripton.length > 0)) ? (product.seller_product.product_decripton[0] && product.seller_product.product_decripton[0] != "" ? product.seller_product.product_decripton[0] : "petsmile product decription..") : "petsmile product decription") : product.admin_product.product_decripton[0];
    let productQuantity = (cartData && cartData.quantity) ? Number(cartData.quantity) : 1;
    let productWeight = (cartData && cartData.weight) ? ((cartData.weight != "") ? (parseInt(cartData.weight)) : 0.5) : 0.5;
    console.log(cartData)
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token,
      },
      url: 'https://api.coboxlogistic.com/v0.4.0/budget-groups', // Test environment
      body: JSON.stringify(
        {
          "origin": {
            "description": sellerName, //"About this budget",
            "geo_lat": sellerLatitude, //-12.038869,
            "geo_lng": sellerLongitude, //-76.932449,
            "id_place": null
          },
          "destiny": {
            "description": user.full_name, //"About this budget",
            "geo_lat": userLatitude, //-12.038869,
            "geo_lng": userLongitude, //-76.932449,
            "id_place": null
          },
          "packages": [
            {
              "id_in_place": productId,
              "name": productName,
              "description": productdescription,
              "quantity": productQuantity,
              "width": 0.5,
              "height": 0.5,
              "package_length": 0.5,
              "weight": productWeight,
              "volume": 0.5
            }
          ]
        })
    };
    console.log(JSON.parse(options.body))
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

let sendTrackingToCobox = async (user, addressId, cartIds) => {
  try {
    let address = await UserAddressModel.findOne({ _id: addressId }, { latitude: 1, longitude: 1 }).lean();

    let respData = await loginCobox();
    let loginData = JSON.parse(respData)
    // console.log(respData);
    let token = loginData ? loginData.token : null;
    if (token) {
      console.log(token)
      if (cartIds.length > 0) {
        let delivery_charge = 0;
        let id_budget = null;
        let distance = 0;
        let time_aprox = 0;
        let dataToSend = [];
        let sellerIds = [];
        for (let i = 0; i < cartIds.length; i++) {
          let allCartData = await UserCartModel.findOne({ _id: mongoose.Types.ObjectId(cartIds[i]) })
            .populate('seller.seller_id', 'latitude longitude first_name last_name')
            .populate('seller.admin_id', 'latitude longitude name').lean();
          // console.log(cartData);
          let seller = allCartData.seller;
          if ((seller.seller_id && seller.seller_id._id) || (seller.admin_id && seller.admin_id._id)) {
            if (seller.seller_id._id) {
              sellerIds.push(seller.seller_id._id + "")
            } else {
              sellerIds.push(seller.admin_id._id + "")
            }
          }
        }
        let uniqSellers = [...new Set(sellerIds)];
        for (let j = 0; j < uniqSellers.length; j++) {
          let cartData = await UserCartModel.findOne({ $or: [{ "seller.seller_id": mongoose.Types.ObjectId(uniqSellers[j]) }, { "seller.admin_id": mongoose.Types.ObjectId(uniqSellers[j]) }], isDeleted: false, status: 0, user: user._id })
            .populate('product.seller_product', 'product_name product_decripton')
            .populate('product.admin_product', 'product_name product_decripton')
            .populate('seller.seller_id', 'latitude longitude first_name last_name')
            .populate('seller.admin_id', 'latitude longitude name')
            .populate('orderId').lean();
          // console.log(cartData);
          let seller = cartData.seller;
          let product = cartData.product;
          // console.log(seller);

          let budget = await getBudgetGroups(token, seller, user, product, address, cartData);
          let budgetData = JSON.parse(budget)
          console.log(budgetData)

          if (budgetData && budgetData.budgets && (budgetData.budgets.length > 0)) {
            id_budget = budgetData ? budgetData.budgets[0].id_budget : null,
              delivery_charge = budgetData ? budgetData.budgets[0].price : 0,
              distance = budgetData ? budgetData.budgets[0].distance : 0
            time_aprox = budgetData ? budgetData.budgets[0].time_aprox : 0
          } else {
            return { status: 0, message: budgetData.message };
          }

          let updateCartData = await UserCartModel.find({ $or: [{ "seller.seller_id": mongoose.Types.ObjectId(uniqSellers[j]) }, { "seller.admin_id": mongoose.Types.ObjectId(uniqSellers[j]) }], isDeleted: false, status: 0, user: user._id }, { _id: 1 }).lean();
          if (updateCartData.length > 0) {
            for (let k = 0; k < updateCartData.length; k++) {
              let updatecart = await UserCartModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(updateCartData[k]._id) }, { $set: { delivery_id_budget: id_budget, delivery_token: token } }, { new: true }).lean();
            }
          }
          dataToSend.push({
            // cart_id: cartIds[i],
            id_budget: id_budget,
            delivery_charge: delivery_charge,
            distance: distance,
            time_aprox: time_aprox
          })
        }
        return dataToSend;
      }
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

function getBudgetGroupsOrder(user, address, cartData) {
  return new Promise(function (resolve, reject) {
    let budget_id = Number(cartData.delivery_id_budget);
    let delivery_token = cartData.delivery_token;
    let sellerName = cartData.seller.admin_id == null ? ((cartData.seller.seller_id && cartData.seller.seller_id.first_name) ? (cartData.seller.seller_id.first_name + cartData.seller.seller_id.last_name) : "About this budget") : cartData.seller.admin_id.name;
    let sellerEmail = cartData.seller.admin_id == null ? ((cartData.seller.seller_id && cartData.seller.seller_id.email) ? (cartData.seller.seller_id.email) : "api@elanapp.com") : cartData.seller.admin_id.email;
    let sellerMobile = cartData.seller.admin_id == null ? ((cartData.seller.seller_id && cartData.seller.seller_id.country_code) ? (cartData.seller.seller_id.country_code + " " + cartData.seller.seller_id.mobile_number) : "About this budget") : cartData.seller.admin_id.countryCode + " " + cartData.seller.admin_id.mobileNumber;
    let sellerAddress = cartData.seller.admin_id == null ? ((cartData.seller.seller_id && cartData.seller.seller_id.storeDetails) ? (cartData.seller.seller_id.storeDetails.location?.address1 + ", " + cartData.seller.seller_id.storeDetails.location?.address2 + ", " + cartData.seller.seller_id.storeDetails.location?.address3) : "Seller Address") : (cartData.seller.admin_id.address + ", " + cartData.seller.admin_id.city + ", " + cartData.seller.admin_id.state + ", " + cartData.seller.admin_id.country);
    let sellerDescription = cartData.seller.admin_id == null ? ((cartData.seller.seller_id && cartData.seller.seller_id.storeDetails) ? (cartData.seller.seller_id.storeDetails?.store_name) : "Store Detail") : cartData.seller.admin_id.name;
    let sellerReference = cartData.seller.admin_id == null ? ((cartData.seller.seller_id && cartData.seller.seller_id.storeDetails) ? (cartData.seller.seller_id.storeDetails.location?.address1) : "Seller Address") : (cartData.seller.admin_id.address);

    var options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + delivery_token,
      },
      url: `https://api.coboxlogistic.com/v0.4.0/budgets/${budget_id}/aprove`, // Test environment
      body: JSON.stringify({
        "origin": {
          "name": sellerName, //"Pedro Perez",
          "description": sellerDescription, //"Dni is",
          "address": sellerAddress, //"Av Javier Prado 456, La Molina, Lima, Peru",
          "reference": sellerReference, //"Close to Av.",
          "email": sellerEmail, //"contacto@repuestosgaray.com",
          "telephone": sellerMobile, //"+51 123456789"
        },
        "destiny": {
          "name": user.full_name, //"Pedro Perez",
          "description": user.full_name, //"Dni is",
          "address": address.house_no + ", " + address.street + ", " + address.city + ", " + address.state + ", " + address.country + ", " + address.postal_code, //"Av Javier Prado 456, La Molina, Lima, Peru",
          "reference": address.house_no + ", " + address.street, //"Close to Av.",
          "email": user.email, //"contacto@repuestosgaray.com",
          "telephone": user.country_code + " " + user.mobile_number, //"+51 123456789"
        }
      })
    };
    // console.log(JSON.parse(options.body))
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

let updateTrackingToCoboxAfterOrder = async (cartIds, user, addressId) => {
  try {
    if (cartIds.length > 0) {
      let id_order = null;
      for (let i = 0; i < cartIds.length; i++) {
        let cartData = await UserCartModel.findOne({ _id: mongoose.Types.ObjectId(cartIds[i]) }, { delivery_id_budget: 1, seller: 1, delivery_token: 1 })
          .populate('seller.seller_id', 'first_name last_name country_code mobile_number email storeDetails latitude longitude first_name last_name')
          .populate('seller.admin_id', 'name email countryCode mobileNumber country state city address latitude longitude name').lean();

        let address = await UserAddressModel.findOne({ _id: addressId }).lean();

        let order = await getBudgetGroupsOrder(user, address, cartData);
        let orderData = JSON.parse(order)
        if (orderData) {
          console.log(orderData);
          id_order = orderData ? orderData.id_order : null;
          let updatecart = await UserCartModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(cartIds[i]) }, { $set: { delivery_id_order: id_order } }, { new: true }).lean();
        }
      }
      return true;
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

let sendPackageBookingNotification = async (user, host_id) => {
  try {

    /* Code for notification start */
    let title = "Package Booked";
    let Notificationbody = "Your package has been booked successfully";
    let device_type = user.device_type;
    let notification = {
      uniqe_id: {
        user_id: user._id
      },
      title: title,
      body: Notificationbody,
      notification_type: 1,
      type: 1,
      created_at: new Date().getTime()
    }
    let sendNotification = await NotificationModel.create(notification);
    sendNotification.save();

    let payload = {
      title: title,
      body: Notificationbody,
      noti_type: 1
    }
    let notify = {
      title: title,
      body: Notificationbody,
      "color": "#f95b2c",
      "sound": true
    }
    if (user.device_token) {
      utils.sendPushNotification(user.device_token, device_type, payload, notify);
    }

    /* Code for notification start to Host */
    let hostData = await HostModel.findOne({ _id: mongoose.Types.ObjectId(host_id) }, { device_token: 1, device_type: 1 }).lean();
    let hostTitle = "Package Booked";
    let hostNotiBody = "New package has been booked by " + user.full_name;

    let hostNotification = {
      uniqe_id: {
        host_id: host_id,
      },
      title: hostTitle,
      body: hostNotiBody,
      notification_type: 1,
      type: 2,
      created_at: new Date().getTime()
    }
    let sendNoti = await NotificationModel.create(hostNotification);
    sendNoti.save();

    let hostPayload = {
      title: hostTitle,
      body: hostNotiBody,
      noti_type: 1
    }
    let hostNotify = {
      title: hostTitle,
      body: hostNotiBody,
      "color": "#f95b2c",
      "sound": true
    }
    if (hostData.device_token) {
      utils.sendPushNotification(hostData.device_token, hostData.device_type, hostPayload, hostNotify);
    }

    /* Code for notification end to Host */

    /* Code for notification start to Admin */
    let admin = await AdminModel.findOne({}, { email: 1, _id: 1 });
    let adminTitle = "Package Booked";
    let NotiBody = "New package has been booked by " + user.full_name;

    let adminNotification = {
      uniqe_id: {
        admin_id: admin._id
      },
      title: adminTitle,
      body: NotiBody,
      notification_type: 1,
      type: 5,
      created_at: new Date().getTime()
    }
    let send_noti = await NotificationModel.create(adminNotification);
    send_noti.save();
    /* Code for notification end */

    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};




exports.registerUser = async (data) => {
  try {
    // const data  = req.body;

    const checkExist = await UserModel.findOne({

      country_code: data.country_code,
      mobile_number: data.mobile_number,

    });
    // console.log("My data",checkExist)

    if (checkExist) {
      return {
        message: "Mobile number already exist",
        status: -1,
      };
    } else {
      let access_token = authentication.generateToken();
      let details = {

        full_name: data.full_name,
        country_code: data.country_code,
        mobile_number: data.mobile_number,
        device_token: data.device_token,
        device_type: data.device_type,

      };



      let saveFirstInfo = await UserModel.create(details);
      let result = await saveFirstInfo.save();

      if (result) {
        let send_otp = await sendOtp(result);
        let update = await UserModel.findOneAndUpdate(
          { _id: result._id },
          { $set: { access_token: access_token, otp_info: send_otp.data.otp_info } },
          { new: true }
        );
        // let update = await UserModel.findOneAndUpdate(
        //   { _id: result._id },
        //   { $set: { access_token: access_token } },
        //   { new: true }
        // );
        if (update) {
          return {
            message: "Created",
            status: 1,
            response: update,
          };
        } else {
          return {
            message: "Not created",
            stattus: 2,
          };
        }
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};


exports.VerifyOtp = async (data, user) => {
  try {

    let userData1 = await UserModel.findById(user._id);
    if (!userData1) throw new Error("No User found");

    // if (data.otp_info === user.otp_info || data.otp_info === "1234") {
    if (data.otp_info === user.otp_info) {
      let update = await UserModel.findOneAndUpdate(
        { _id: user._id },
        { otp_info: "", is_user_verified: true },
        {
          new: true,
        }
      );
      if (update) {
        return {
          message: "OTP verified",
          status: 1,
        };
      }
    } else {
      return {
        message: "Invalid Otp",
        status: 2,
      };
    }
  } catch (error) {
    throw new Error(error);
  }
};



exports.comleteProfile = async (data, user) => {
  try {
    const checkExist = await UserModel.findOne(user._id);

    if (!checkExist) {
      return {
        message: "User does not exist",
        status: -1,
      };
    } else {
      let password = await bcrypt.hash(data.password, 10);
      let details = {
        full_name: data.full_name,
        country_code: data.country_code,
        mobile_number: data.mobile_number,
        email: data.email,
        gender: data.gender,
        password: password,
      };

      let update = await UserModel.findOneAndUpdate({ _id: user._id }, details, {
        new: true,
      });
      if (update) {
        return {
          message: "Created",
          status: 1,
          response: update,
        };
      } else {
        return {
          message: "Not created",
          stattus: 2,
        };
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

exports.resendOtp = async (user) => {
  try {
    // console.log(user)
    // const checkExist = await UserModel.findOne(user._id);
    let checkExist = await UserModel.findOne({ $and: [{ country_code: user.country_code }, { mobile_number: user.mobile_number }] }).lean();

    if (!checkExist) {
      return {
        message: "User does not exist",
        status: -1,
      };
    } else {
      // let otpInfo = 1234;
      console.log(checkExist)
      let send_otp = await sendOtp(checkExist);
      let update = await UserModel.findOneAndUpdate(
        { _id: user._id },
        { $set: { otp_info: send_otp.data.otp_info } },
        { new: true }
      );

      return {
        message: "OTP resent",
        status: 1,
        // data: otpInfo,
        data: send_otp.data.otp_info
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

exports.loginUser = async (data) => {
  try {
    let token = authentication.generateToken();

    const checkExist = await UserModel.findOne({
      country_code: data.country_code,
      mobile_number: data.mobile_number,
    });
    //  console.log("This is data")
    if (checkExist) {

      if (!checkExist.password) {
        return {
          status: -1,
          message: "First Create your password",
          data: {}
        }
      }
      let validPassword = await bcrypt.compare(
        data.password,
        checkExist.password
      );
      // let validPassword = false;
      console.log("working....");


      if (!validPassword) {
        console.log("checkExist", validPassword);
        return {
          status: -1,
          message: "Please enter the correct password.",
          data: {}
        };
      }
      if (checkExist.is_blocked) {
        return {
          status: -1,
          message: "Your account has been blocked",
          data: {}
        };
      }
      // console.log("This is data")
      // console.log("1");

      checkExist.last_login = Date.now();
      checkExist.latitude = data.latitude;
      checkExist.longitude = data.longitude;
      checkExist.location = { coordinates: [data.longitude, data.latitude] };
      checkExist.access_token = token;

      if (data.device_type && data.device_type !== "") {
        checkExist.device_type = data.device_type;
        checkExist.device_token = data.device_token;
      }
      let user1 = checkExist;
      let saveUser = await user1.save();
      if (!saveUser) {
        return {
          status: -1,
          message: "Something sent wrong",
          data: {}
        };
      }

      return {
        status: 1,
        data: checkExist,
        message: "Login Success ",
      };
    } else {
      return {
        status: -1,
        message: "User does not exist",
        data: {}
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

exports.forgotPassword = async (data) => {
  try {

    let token = authentication.generateToken();  

    if (!data.country_code || data.country_code == "")
      return { status: 0, message: "Please enter the country code" };
    if (!data.mobile_number || data.mobile_number == "")
      return { status: 0, message: "Please enter the mobile number" };

    let user = await UserModel.findOne({
      $and: [{
        country_code: data.country_code
      }, {
        mobile_number: data.mobile_number
      }]
    }).exec();

    if (!user) {
      return { status: 0, message: "Mobile number does not exist" };
    }

    let send_otp = await sendOtp(user);   
    // console.log(send_otp)
    let recruiter = await UserModel.findOneAndUpdate({
      $and: [
        {
          country_code: data.country_code,
        },
        {
          mobile_number: data.mobile_number,
        },
      ],
    }, {
      $set: {
        access_token: token,
        otp_info: send_otp.data.otp_info
      }
    }, {
      new: true
    }).exec();


    return { status: 1, data: recruiter, message: "OTP sent" };
  } catch (error) {
    throw new Error(error.message);
  }
};


exports.resetPassword = async (data, userData) => {
  try {
    if (!data.newPassword || data.newPassword == "")
      return { status: 0, message: "New password is required" };
    if (!data.confirmPassword || data.confirmPassword == "")
      return { status: 0, message: "Confirm password is required" };

    if (!userData || userData == null) {
      return { status: 0, message: "Recruiter does not exist" };
    }

    if (data.newPassword == data.confirmPassword) {
      let password = await bcrypt.hash(data.newPassword, 10);
      userData.password = password;
      // user.link_token = '' //remove
      let user = userData;
      let saveuser = user.save();
      if (!saveuser) {
        return { status: 0, message: "Something went Wrong" };
      }
      return { status: 1, message: "Password reset successfully" };
    } else {
      return {
        status: 0,
        message: "Passwords do not match",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.logout = async (user) => {
  try {
    if (!user._id || user._id == '')
      return { status: 0, message: "User does not exist" };

    let updateUser = await UserModel.findOneAndUpdate({ _id: user._id }, { $set: { access_token: '' } }, { new: true });

    if (!updateUser) {
      return { status: 0, message: "Something went Wrong" };
    }
    return { status: 1, message: "Logout successfully" };

  } catch (error) {
    throw new Error(error.message);
  }
};

exports.changePassword = async (user, data) => {
  try {

    let compare = await bcrypt.compare(data.old_password, user.password);
    if (!compare) {
      return {
        status: 0,
        message: "Current Password is not match"
      }
    }

    if (data.old_password == data.password) {
      return {
        status: 0,
        message: "Password must be different"
      }
    }

    let pass = await bcrypt.hash(data.password, 10);

    let result = await UserModel.findByIdAndUpdate({ _id: user._id }, {
      $set: {
        password: pass
      }
    }, {
      new: true
    })
    if (!result) {
      return { status: 0, message: "Something went Wrong" };
    }
    return { status: 1, message: "Password change Successfully", data: result };

  } catch (error) {
    throw new Error(error.message);
  }
};

exports.editProfile = async (user, data) => {
  try {

    if (user.is_email_verified == true) {
      let result = await UserModel.findByIdAndUpdate({ _id: user._id }, {
        $set: {
          full_name: data.full_name,
          email: data.email,
          gender: data.gender
        }
      }, {
        new: true
      })
      if (!result) {
        return { status: 0, message: "Something went Wrong" };
      }
      return { status: 1, message: "Success", data: result };
    } else {
      return { status: 0, message: "Verify Email first" };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.VerifyEmailOtp = async (data, user) => {
  try {

    let userData1 = await UserModel.findById({ _id: user._id });
    console.log(userData1);
    if (!userData1) throw new Error("No User found");
    console.log(userData1);
    if (data.email_otp_verify === user.email_otp_verify || data.email_otp_verify === "1234") {
      let update = await UserModel.findOneAndUpdate(
        { _id: user._id },
        { is_email_verified: true },
        {
          new: true,
        }
      );
      if (update) {
        return {
          message: "Email OTP verified",
          status: 1,
        };
      }
    } else {
      return {
        message: "Invalid Otp",
        status: 2,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.resendEmailOtp = async (data, user) => {
  try {
    const checkExist = await UserModel.findOne(user._id);

    if (!checkExist) {
      return {
        message: "User does not exist",
        status: 2,
      };
    } else {
      let email_otp_verify = 1234;

      return {
        message: "OTP resent",
        status: 1,
        data: email_otp_verify,
      };
    }
  } catch (error) {
    // console.log(error);
    throw new Error(error.message);
  }
};

exports.petsList = async (user) => {
  try {
    let petList = await UserPetManageModel.find({ user: user._id })
      .populate('user')
      .populate('pet_cat')
      .sort({ createdAt: -1 })
      .lean();
    // console.log(petList);

    if (petList) {
      return {
        status: 1,
        response: petList,
        message: "All Pet list"
      }
    } else {
      return {
        status: 0,
        message: "No List Found"
      }
    }
  } catch (error) {
    throw new Error(error.message);

  }
};

exports.productCatList = async () => {
  try {
    let productCategoryList = await productCategoryAdminModel.find()
    if (productCategoryList) {
      return {
        status: 1,
        response: productCategoryList,
        message: "All Product category list"
      }
    } else {
      return {
        status: 0,
        message: "No List Found"
      }
    }
  } catch (error) {
    throw new Error(error.message);

  }
};

exports.addPet = async (user, data) => {
  try {

    let saveProduct = new UserPetManageModel();
    saveProduct.pet_cat = data.pet_cat,
      saveProduct.pet_name = data.pet_name;
    saveProduct.pet_dob = data.pet_dob;
    saveProduct.pet_height = data.pet_height;
    saveProduct.pet_weight = data.pet_weight;
    saveProduct.pet_gender = data.pet_gender;
    saveProduct.pet_special_care = data.pet_special_care;
    saveProduct.treatment = data.treatment,
      saveProduct.vaccine_details = {
        vaccine_name: data.vaccine_name,
        vaccine_date: data.vaccine_date
      }
    saveProduct.upcoming_vaccine = {
      upcoming_vaccine_name: data.upcoming_vaccine_name,
      upcoming_vaccine_date: data.upcoming_vaccine_date
    };
    saveProduct.pet_pic = data.pet_pic;
    saveProduct.user = user._id;

    let result = await saveProduct.save();

    if (result) {
      return {
        message: "Pet Details Added",
        status: 1,
        data: result,
      };
    } else {
      return {
        message: "Pet Details can not be created",
        status: 0,
      };
    }

  } catch (error) {
    throw new Error(error.message);
  }
}

exports.editPets = async (user, data) => {
  try {
    let result = await UserPetManageModel.findByIdAndUpdate({ _id: data._id }, {
      $set: {
        pet_name: data.pet_name,
        pet_dob: data.pet_dob,
        pet_height: data.pet_height,
        pet_weight: data.pet_weight,
        pet_gender: data.pet_gender,
        pet_special_care: data.pet_special_care,
        treatment: data.treatment,
        vaccine_details: {
          vaccine_name: data.vaccine_name,
          vaccine_date: data.vaccine_date,
        },
        upcoming_vaccine: {
          upcoming_vaccine_name: data.upcoming_vaccine_name,
          upcoming_vaccine_date: data.upcoming_vaccine_date,
        },
        pet_pic: data.pet_pic,
      }
    }, {
      new: true
    })
    // console.log(result);
    if (!result) {
      return { status: 0, message: "Something went Wrong" };
    }
    return { status: 1, message: "Success", data: result };

  } catch (error) {
    throw new Error(error.message);

  }
};

exports.getProfile = async (user, data) => {
  try {
    let userProfile = await UserModel.findById({ _id: user._id })
    if (userProfile) {
      return {
        status: 1,
        response: userProfile,
        message: "Profile Details fetch"
      }
    } else {
      return {
        status: 2,
        message: "Not Found"
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getMainProductCat = async () => {
  try {
    let userProfile = await productMainCategoryAdminModel.find({ showUser: true }).lean();
    if (userProfile) {
      return {
        status: 1,
        response: userProfile,
        message: "Main Product List fetch"
      }
    } else {
      return {
        status: 2,
        message: "Not Found"
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getProductCategory = async () => {
  try {
    let data = await productCategoryAdminModel.find({}).lean();
    if (data) {
      return {
        status: 1,
        response: data,
        message: "Product Category Fetch"
      }
    } else {
      return {
        status: 2,
        message: "Not Found"
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getProducts = async (user, body) => {
  try {
    // let data = await ProductCatModel.find({
    //   $and: [
    //     { product_main_cat: body.main_cat_id },
    //     { product_cat: body.cat_id }
    //   ]
    // })
    //   .populate('product_cat')
    //   .populate('product_main_cat')
    //   .populate('breed_type')
    // .populate({
    //   path: 'cartData',
    //   match: {
    //     user: user._id
    //   },
    //   select: "_id quantity"
    // })
    // .lean();

    let data = await ProductCatModel.aggregate([
      { $match: { product_main_cat: mongoose.Types.ObjectId(body.main_cat_id), product_cat: mongoose.Types.ObjectId(body.cat_id), product_quantity: { $gt: 0 }, $expr: { $gt: ["$product_quantity", "$sku_min_limit"] } } },
      {
        $lookup: {
          from: "userCart",
          let: { 'productId': '$_id', 'userId': user._id },
          // let:{'productId':'$_id'},
          pipeline: [
            // {$match:{$expr:{ $and:[{ $or:[{$eq:['$product.seller_product','$$productId']},{$eq:['$product.admin_product','$$productId']}]}] }}}
            { $match: { $expr: { $and: [{ $or: [{ $eq: ['$product.seller_product', '$$productId'] }, { $eq: ['$product.admin_product', '$$productId'] }] }, { $eq: ['$user', '$$userId'] }] } } }
          ],
          as: "userCart"
        }
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "product_cat",
          foreignField: "_id",
          as: "product_cat"
        }
      },
      {
        $lookup: {
          from: "productmaincategories",
          localField: "product_main_cat",
          foreignField: "_id",
          as: "product_main_cat"
        }
      },
      {
        $lookup: {
          from: "productsubcategories",
          localField: "breed_type",
          foreignField: "_id",
          as: "breed_type"
        }
      },
      {
        $lookup: {
          from: "Seller",
          localField: "seller",
          foreignField: "_id",
          as: "seller"
        }
      },
      { $unwind: { path: "$product_cat", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$product_main_cat", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$breed_type", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          cartData: 0,
          hostCartData: 0
        }
      }
      // {
      //   $addFields: {
      //     // totalHomework: { $sum: "$homework" } ,
      //     isCartAdded: {  }
      //   }
      // }
    ]);

    let fav_arr = []
    if (user) {
      let data1 = await UserWishlistModel.find({ user: user._id })
      for (let i = 0; i < data1.length; i++) {
        if (data1[i].product.seller_product) {
          fav_arr.push(data1[i].product.seller_product.toString());
        }
      }
    }

    // data.map(item=>{
    //   item.isCartAdded = (item.userCart[0])?true:false;
    //   item.cartId = (item.userCart[0]) ? item.userCart[0]._id : null;
    //   item.cartQuantity = (item.userCart[0]) ? item.userCart[0].quantity : 0;
    //   item.isfavorite = (fav_arr.length > 0 && fav_arr.includes(item._id.toString())) ? true : false;
    // })

    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let incart = await UserCartModel.findOne({
          $and: [{
            user: mongoose.Types.ObjectId(user._id)
          }, {
            isDeleted: false
          }, {
            status: 0
          }],
          $or: [{
            "product.seller_product": data[i]._id
          }, {
            "product.admin_product": data[i]._id
          }]
        })
        data[i].isCartAdded = incart ? true : false;
        data[i].cartId = incart ? incart._id : null;
        data[i].cartQuantity = incart ? incart.quantity : 0;
        data[i].isfavorite = (fav_arr.length > 0 && fav_arr.includes(data[i]._id.toString())) ? true : false;
      }
    }

    if (data) {
      return {
        status: 1,
        response: data,
        message: "Product Category Fetch"
      }
    } else {
      return {
        status: 2,
        message: "Not Found"
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.addToCart = async (user, data) => {
  try {
    let product;
    product = await ProductCatModel.findOne({ _id: data.product_id })
      .lean();
    if (!product) {
      product = await TrackingDeviceModel.findOne({ _id: data.product_id })
    }
    if (!product) {
      return {
        status: 2,
        message: "Product Not Found"
      }
    }
    /* code for sku limit start */
    var skuLimit = product.sku_min_limit ? product.sku_min_limit : (product.skuNumber ? product.skuNumber : 0);
    let usersold = 0;
    let hostsold = 0;
    let userOrderList = await UserCartModel.find({ "product.seller_product": data.product_id, isDeleted: false, $or: [{ status: 1 }, { status: 3 }, { status: 4 }, { status: 5 }, { status: 6 }, { status: 7 }] }, { quantity: 1 }).lean();
    if (userOrderList.length > 0) {
      usersold = userOrderList.reduce((accumulator, object) => {
        return accumulator + object.quantity;
      }, 0);
    }
    let hostOrderList = await HostCartModel.find({ "product.seller_product": data.product_id, isDeleted: false, $or: [{ status: 1 }, { status: 3 }, { status: 4 }, { status: 5 }, { status: 6 }, { status: 7 }] }, { quantity: 1 }).lean();
    if (hostOrderList.length > 0) {
      hostsold = hostOrderList.reduce((accumulator, object) => {
        return accumulator + object.quantity;
      }, 0);
    }
    let totalSell = Number(usersold) + Number(hostsold)
    let remainingQuantity = (Number(product.product_quantity) - Number(totalSell));

    if (parseInt(skuLimit) >= parseInt(remainingQuantity)) {
      return {
        status: -1,
        message: "Out Of Stock"
      }
    }
    /* code for sku limit start */
    if (parseInt(product.product_quantity) == 0) {
      return {
        status: 2,
        message: "Item not available for purchase"
      }
    }
    let cartAllData = await UserCartModel.findOne({ $or: [{ "product.seller_product": data.product_id }, { "product.admin_product": data.product_id }], user: user._id, isDeleted: false, status: 0 }, { quantity: 1 }).lean();
    if (cartAllData) {
      if (parseInt(cartAllData.quantity) >= parseInt(product.product_quantity)) {
        return {
          status: -1,
          message: "Out of stock"
        }
      }
    }
    let cartData = await UserCartModel.findOne({
      $or: [{ "product.seller_product": data.product_id }, { "product.admin_product": data.product_id }], user: user._id, isDeleted: false, status: 0
    });



    var saveToDb = {
      productMainCategoryId: data.productMainCategoryId,
      user: user._id,
      product: {
        seller_product: data.product_id,
        admin_product: data.product_id,
      },
      seller: {
        seller_id: product.seller,
        admin_id: product.seller,
      },
      unitPrice: product.selling_price,
      quantity: parseInt(data.quantity),
      price: parseInt(data.quantity) * parseFloat(product.selling_price),
      status: 0,
      weight: data.weight,
      size: data.size,
      colorId: data.colorId,
      created_at: new Date().getTime()
    }

    if (!cartData) {
      let cart = await UserCartModel.create(saveToDb);
      cart.save();

      if (!cart) {
        return {
          status: 2,
          message: "Unable to add product to cart"
        }
      }

    } else {
      // if(cartData.colorId != data.colorId){
      //   let cart = await UserCartModel.create(saveToDb);
      //   cart.save();
      //   if (!cart) {
      //     return {
      //       status: 2,
      //       message: "Unable to add product to cart"
      //     }
      //   }
      // }
      cartData.quantity = cartData.quantity + parseInt(data.quantity);
      cartData.price = cartData.unitPrice * cartData.quantity;
      cartData.status = 0;
      cartData.weight = data.weight;
      cartData.size = data.size;
      cartData.colorId = data.colorId;
      let cart = await UserCartModel.findByIdAndUpdate(cartData._id, { $set: cartData }, { new: true }).lean();
      // let cart = await cartData.save();
      if (!cart) {
        return {
          status: 2,
          message: "Something went Wrong, please try later"
        }
      }

    }
    return {
      status: 1,
      message: "Product added to cart successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getCartData = async (user) => {
  try {
    // let data = await UserCartModel.find({ user: user._id })
    //   .populate('product')
    //   .lean();

    let cart = await UserCartModel.find({
      $and: [{
        user: mongoose.Types.ObjectId(user._id)
      }, {
        isDeleted: false
      }, {
        status: 0
      }]
    })
      .populate('product.seller_product', 'product_name product_details product_quantity product_price selling_price product_discount product_decripton')
      .populate('product.admin_product', 'product_name image product_quantity product_price selling_price product_discount product_decripton')
      .lean();

    let serviceCharge = await ServiceChargeModel.findOne({}).lean();

    var cartValues = {
      cartValue: 0,
      deliveryCharge: 0,
      serviceCharge: 0,
      serviceChargePercent: serviceCharge ? serviceCharge.service_charge : 0,
      discount: 0,
      totalPayable: 0
    };
    if (cart.length > 0) {
      let cartUpdate = await _.map(cart, (element) => {
        cartValues.cartValue = cartValues.cartValue + element.price;
        cartValues.totalPayable = cartValues.totalPayable + element.price;
      })
      if (serviceCharge) {
        let discountAmount = (serviceCharge.service_charge * Number(cartValues.totalPayable)) / 100;
        cartValues.serviceCharge = (Math.round(discountAmount * 100) / 100).toFixed(2);
        let remainingAmount = Number(cartValues.totalPayable) + Number(discountAmount);
        cartValues.totalPayable = (Math.round(remainingAmount * 100) / 100).toFixed(2);
      }
    }

    cartValues.totalPayable = (Number(cartValues.totalPayable) + Number(cartValues.deliveryCharge))

    return {
      status: 1,
      response: cart,
      message: "Success",
      cartValues: cartValues
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

exports.addToWishlist = async (user, body) => {
  try {
    let findUser;
    findUser = await ProductCatModel.findOne({ _id: body.product_id }).lean();
    if (!findUser) {
      findUser = await TrackingDeviceModel.findOne({ _id: body.product_id })
    }
    if (!findUser) {
      return {
        status: 2,
        message: "Product Not Found"
      }
    }
    // console.log(findUser)
    let data = await UserWishlistModel.findOne({
      $or: [{ "product.seller_product": body.product_id }, { "product.admin_product": body.product_id }], user: user._id
    });

    let result;
    if (!data) {
      let dataToSave = {
        product: {
          seller_product: body.product_id,
          admin_product: body.product_id,
        },
        weight: body.weight,
        size: body.size,
        user: user._id
      }
      let category = await UserWishlistModel.create(dataToSave);
      let save = await category.save();
      if (save) {
        return {
          status: 1,
          response: save,
          message: "Added Success"
        }
      } else {
        return {
          status: 2,
          message: "Something Went wrong"
        }
      }
    }
    data.product.seller_product = body.product_id;
    data.product.admin_product = body.product_id;
    data.user = user._id;
    result = await data.save();
    if (result) {
      return {
        status: 1,
        response: result,
        message: "Added Success"
      }
    } else {
      return {
        status: 2,
        message: "Something Went wrong"
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getWishlistData = async (user) => {
  try {
    let data = await UserWishlistModel.find({ user: user._id })
      .populate('product.seller_product')
      .populate('product.admin_product')
      .sort({ _id: -1 })
      .lean();
    data.map(item => {
      item.isfavorite = true
    })
    if (data) {
      return {
        status: 1,
        response: data,
        message: "Success"
      }
    } else {
      return {
        status: 2,
        message: "Not Found"
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

exports.removeFromWishlist = async (user, body) => {
  try {
    let deleteData = await UserWishlistModel.findOneAndDelete(
      {
        $or: [{ "product.seller_product": body.product_id }, { "product.admin_product": body.product_id }],
        user: user._id
      }
    );
    if (deleteData) {
      return {
        status: 1,
        message: "Removed from wishlist",
      };
    } else {
      return {
        status: 2,
        message: "Something went wrong",
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

exports.removeFromCart = async (user, body) => {
  try {
    let result = await UserCartModel.findOne({ $or: [{ "product.seller_product": body.product_id }, { "product.admin_product": body.product_id }], user: user._id, isDeleted: false, status: 0 }).lean();
    if (!result) {
      return {
        status: 0,
        message: "Not getting cart data",
      };
    }
    if (result.quantity != 1) {
      result = await UserCartModel.findByIdAndUpdate({ _id: result._id }, {
        $set: {
          quantity: result.quantity - 1,
          price: ((result.quantity - 1) * result.unitPrice)
        }
      }, {
        new: true
      })

      return {
        status: 1,
        message: "Removed from cart",
        // response : result
      };
    } else {
      resultData = await UserCartModel.findByIdAndUpdate(
        { _id: result._id }, {
        $set: {
          quantity: 0,
          isDeleted: true
        }
      }, {
        new: true
      });

      return {
        status: 1,
        message: "Removed from cart",
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

exports.removeCartData = async (user, body) => {
  try {
    let result = await UserCartModel.findOne({ _id: body._id }).lean();
    if (!result) {
      return {
        status: 0,
        message: "Not getting cart data",
      };
    }
    result = await UserCartModel.findByIdAndUpdate({ _id: body._id }, {
      $set: {
        quantity: 0,
        isDeleted: true
      }
    }, {
      new: true
    });
    // let productData = await ProductCatModel.findOneAndUpdate(
    //   {_id:result.product},
    //   { 
    //     $pull: { 'cartData':result._id} 
    //   },
    //   {new:true}
    // )
    return {
      status: 1,
      message: "Removed from cart",
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}


exports.removeAllFromCart = async (user, body) => {
  try {
    let deleteData = await UserCartModel.updateMany(
      { user: user._id, isDeleted: false, status: 0 }, {
      $set: {
        quantity: 0,
        isDeleted: true
      }
    }, {
      multi: true
    });
    if (!deleteData) {
      return {
        status: 2,
        message: "Something went wrong",
      };
    }
    // let productData = await ProductCatModel.findOneAndUpdate(
    //   {_id:result.product},
    //   { 
    //     $pull: { 'cartData':deleteData._id} 
    //   },
    //   {new:true}
    // )
    return {
      status: 1,
      message: "Removed from cart",
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

exports.getAllProducts = async (user, body) => {
  try {
    let { main_cat_id, page } = body;
    let skip = (page <= 1 || !page) ? 0 : (page - 1) * 10;

    // let data = await ProductCatModel.find({product_main_cat:main_cat_id },{},{fields:{hostCartData:0}})
    //   .populate('product_cat')
    //   .populate('product_main_cat')
    //   .populate('breed_type').lean();

    // .populate({
    //   path:'cartData',
    //   match: { user:user._id }
    // })

    let data = await ProductCatModel.aggregate([
      { $match: { product_main_cat: mongoose.Types.ObjectId(main_cat_id), product_quantity: { $gt: 0 }, $expr: { $gt: ["$product_quantity", "$sku_min_limit"] } } },
      {
        $lookup: {
          from: "userCart",
          let: { 'productId': '$_id', 'userId': user._id, 'isDeleted': false, 'status': 0 },
          pipeline: [
            { $match: { $expr: { $and: [{ $or: [{ $eq: ['$product.seller_product', '$$productId'] }, { $eq: ['$product.admin_product', '$$productId'] }] }, { $eq: ['$user', '$$userId'] }, { $eq: ['$isDeleted', '$$isDeleted'] }, { $eq: ['$status', '$$status'] }] } } }
          ],
          as: "userCart"
        }
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "product_cat",
          foreignField: "_id",
          as: "product_cat"
        }
      },
      {
        $lookup: {
          from: "productmaincategories",
          localField: "product_main_cat",
          foreignField: "_id",
          as: "product_main_cat"
        }
      },
      {
        $lookup: {
          from: "productsubcategories",
          localField: "breed_type",
          foreignField: "_id",
          as: "breed_type"
        }
      },
      {
        $lookup: {
          from: "Seller",
          localField: "seller",
          foreignField: "_id",
          as: "seller"
        }
      },
      // {$unwind:"$userCart"},
      {
        $unwind: {
          path: "$product_cat",
          preserveNullAndEmptyArrays: true
        },
      },
      {
        $unwind: {
          path: "$seller",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$product_main_cat",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$breed_type",
          preserveNullAndEmptyArrays: true
        }
      },
      { $skip: skip },
      { $limit: 10 }
    ])
    // console.log(data);

    let data1 = await UserWishlistModel.find({ user: user._id })
    let fav_arr = []
    let new_list = []
    for (let i = 0; i < data1.length; i++) {
      if (data1[i].product.seller_product) {
        fav_arr.push(data1[i].product.seller_product.toString());
      }
    }
    for (let k = 0; k < data.length; k++) {
      new_list.push(data[k]._id.toString());
    }
    // console.log(fav_arr, "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
    for (let j = 0; j < new_list.length; j++) {
      // console.log(new_list[j], "lllllllllllllllllllllllllllllllllllllllllllll")
      if (data[j].userCart.length > 0) {
        data[j].isCartAdded = true
        data[j].cartId = data[j].userCart[0]._id;
        data[j].cartQuantity = data[j].userCart[0].quantity;
      } else {
        data[j].isCartAdded = false
        data[j].cartId = null;
        data[j].cartQuantity = 0;
      }
      if (fav_arr.length > 0 && fav_arr.includes(new_list[j])) {
        data[j].isfavorite = true
      } else {
        data[j].isfavorite = false
      }
      let allRatings = await OrderRatingModel.find({ $or: [{ "product.seller_product": new_list[j] }, { "product.admin_product": new_list[j] }] }, { uniqid: 0, product: 0, order_id: 0 }).lean();
      let avgRating = "0.0";
      if (allRatings.length > 0) {
        let sum = allRatings.reduce((accumulator, object) => {
          return accumulator + object.rating_point;
        }, 0);
        avgRating = (sum / allRatings.length).toFixed(1);
      }
      data[j].rating = avgRating;
      data[j].ratingCount = allRatings.length;

      let liked = await userLikeModel.findOne(
        {
          $or: [{ "product.seller_product": new_list[j] }, { "product.admin_product": new_list[j] }],
          user: user._id
        }
      );
      data[j].is_liked = liked ? 1 : 0;
    }
    if (data) {
      return {
        status: 1,
        response: data,
        message: "Product Category Data"
      }
    } else {
      return {
        status: 2,
        message: "Not Found"
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

//   ############  M4  ###############

// 2. Add Address API
exports.addAddress = async (user, body) => {
  try {
    let address;
    if (body.type == 2) {
      address = await UserAddressModel.findOne({ user: user._id, type: 2 });
      if (!address) {
        address = new UserAddressModel();
      }
    } else {
      address = new UserAddressModel();
    }
    if (!body.latitude || body.latitude == '')
      return { status: 0, message: "Latitude is required" };
    if (!body.longitude || body.longitude == '')
      return { status: 0, message: "Longitude is required" };

    address.house_no = body.house_no;
    address.street = body.street;
    address.city = body.city;
    address.postal_code = body.postal_code;
    address.type = body.type;
    address.user = user._id;
    address.country = body.country;
    address.state = body.state;
    address.country_code = body.country_code;
    address.locality = body.locality;
    address.latitude = body.latitude;
    address.longitude = body.longitude;

    let result = await address.save();
    if (!result) {
      return {
        status: 0,
        message: "Something Went Wrong"
      }
    }
    return {
      status: 1,
      message: "Saved Success",
      response: result
    }

  } catch (error) {
    throw new Error(error.message);
  }
};

exports.editAddress = async (host, body) => {
  try {
    let { _id, house_no, street, city, postal_code, type, country_code, latitude, longitude } = body;
    let result = await UserAddressModel.findByIdAndUpdate(_id, body, { new: true });
    if (!result) {
      return {
        status: 0,
        message: "Something Went Wrong"
      }
    }
    return {
      status: 1,
      message: "update Success",
      response: result
    }

  } catch (error) {
    throw new Error(error.message);
  }
}

// 1. Get Saved Address API
exports.getAddress = async (user) => {
  try {
    let result = await UserAddressModel.find({ user: user._id }).lean();
    if (!result) {
      return {
        status: 0,
        message: "Something Went Wrong"
      }
    }
    return {
      status: 1,
      message: "Fetch Success",
      response: result
    }

  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteAddress = async (user, body) => {
  try {
    let result = await UserAddressModel.findOneAndRemove({ _id: body._id });
    if (!result) {
      return {
        status: 0,
        message: "Address Not Found"
      }
    }
    return {
      status: 1,
      message: "Deleted Success",
      response: {}
    }

  } catch (error) {
    throw new Error(error.message);
  }
};

exports.makeAddressPrimary = async (user, body) => {
  try {
    let updateAddressUpdate = await UserAddressModel.findOne({ _id: body._id });
    if (!updateAddressUpdate) {
      return {
        status: 0,
        message: "Address Not Found"
      }
    }
    updateAddressUpdate = await UserAddressModel.updateMany({ user: user._id }, { primaryAddress: false });
    let result = await UserAddressModel.findOneAndUpdate({ _id: body._id }, { primaryAddress: true }, { new: true });
    if (!result) {
      return {
        status: 0,
        message: "Something Went Wrong"
      }
    }
    return {
      status: 1,
      message: "Address update Success",
      response: {}
    }

  } catch (error) {
    throw new Error(error.message);
  }
};

exports.coupenList = async (user) => {
  try {
    var date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    let todaydate = Date.parse(date);

    let result = await PromocodeModel.aggregate([
      { $match: { is_blocked: false, to: { $gte: todaydate } } }
    ]);
    if (!result) {
      return {
        status: 0,
        message: "Something Went Wrong"
      }
    }

    return {
      status: 1,
      message: "Address update Success",
      response: result
    }

  } catch (error) {
    throw new Error(error.message);
  }
};

exports.applyCoupon = async (user, data) => {
  try {
    if (!data.price || data.price == '')
      return { status: 0, message: "Price is required" };
    if (!data.coupon_code || data.coupon_code == '')
      return { status: 0, message: "Coupon code is required" };

    let currentDate = new Date().getTime();
    let activeCoupon = await PromocodeModel.findOne({ to: { '$gte': currentDate }, couponCode: data.coupon_code, is_blocked: false }, { is_blocked: 0 }).lean();
    if (!activeCoupon) {
      return {
        status: 0, message: "Coupon does not exist or coupon expired"
      };
    }
    if (currentDate > activeCoupon.to) {
      return {
        status: 0, message: "Coupon has expired"
      };
    }

    let NoOfcouponUsed = await UserOrderModel.count({ coupon: mongoose.Types.ObjectId(activeCoupon._id) }).lean();
    if (activeCoupon.orderValueLimit > data.price) {
      return {
        status: 0, message: "This coupon is not applicable on purchase amount less than " + activeCoupon.orderValueLimit
      };
    }

    if (NoOfcouponUsed >= parseInt(activeCoupon.usageLimit)) {
      return {
        status: 0, message: "Coupon has reached its maxm limit"
      };
    }

    let newPrice = data.price;
    let discountAmount = 0;
    if (activeCoupon.discount > 0 && data.price > 0) {
      discountAmount = ((activeCoupon.discount * data.price) / 100);
      newPrice = data.price - discountAmount;
    } else {
      discountAmount = 0;
      newPrice = data.price;
    }

    if (discountAmount >= parseInt(activeCoupon.uptoDiscount)) {
      discountAmount = parseInt(activeCoupon.uptoDiscount);
      newPrice = data.price - parseInt(activeCoupon.uptoDiscount);
    }

    let dataToSend = {
      priceAfterDiscount: newPrice,
      discountAmount: discountAmount
    }
    return {
      message: "Coupon applied successfully",
      status: 1,
      response: dataToSend
    };

  } catch (error) {
    throw new Error(error.message);
  }
};

exports.removeCoupon = async (user, data) => {
  try {
    if (!data.originalPrice || data.originalPrice == '')
      return { status: 0, message: "Original price is required" };
    if (!data.coupon_code || data.coupon_code == '')
      return { status: 0, message: "Coupon code is required" };

    let currentDate = new Date().getTime();
    let activeCoupon = await PromocodeModel.findOne({ to: { '$gte': currentDate }, couponCode: data.coupon_code, is_blocked: false }, { is_blocked: 0 }).lean();
    if (!activeCoupon) {
      return {
        status: 0, message: "Coupon does not exist or coupon expired"
      };
    }

    let dataToSend = {
      priceBeforeDiscount: data.originalPrice,
      discountAmount: 0
    }
    return {
      message: "Coupon removed successfully",
      status: 1,
      response: dataToSend
    };

  } catch (error) {
    throw new Error(error.message);
  }
};

exports.proceedToPay = async (user, data) => {
  try {
    let finalAmount = ((parseFloat(data.cartValue) + parseFloat(data.redeemedAmount) + parseFloat(data.deliveryCharge)) - parseFloat(data.discountAmount))
    let dataToSend = {
      cartValue: data.cartValue,
      redeemedAmount: data.redeemedAmount,
      deliveryCharge: data.deliveryCharge,
      discountAmount: data.discountAmount,
      finalAmount: finalAmount
    }
    return {
      status: 1,
      message: "Success",
      response: dataToSend
    }

  } catch (error) {
    throw new Error(error.message);
  }
};

function doRequest(options) {
  return new Promise(function (resolve, reject) {
    request(options, async function (error, response, body) {
      // if (error) throw new Error(error);
      if (!error) {
        resolve(body);
      } else {
        reject(error);
      }
    })
  })
}

exports.placeOrder = async (user, data) => {
  try {
    let { cartIds, couponCode, totalAmount, paymentOption, discountAmount, deliveryCharge, redeemedAmount, addressId, token } = data;
    var couponData;
    if (couponCode) {
      couponData = await PromocodeModel.findOne({ couponCode: couponCode }, { _id: 1 }).lean();
    }
    var commission = await CommissionModel.findOne({}).lean();
    let serviceCharge = await ServiceChargeModel.findOne({}).lean();
    let unique_booking_id = (generateUniqueId({ length: 7, useLetters: true }).toUpperCase());
    var discount_amount = (cartIds.length > 0) ? (discountAmount / (cartIds.length)) : 0;
    var delivery_charge = (cartIds.length > 0) ? (deliveryCharge / (cartIds.length)) : 0;

    var sellerIds = [];
    var productIds = [];
    if (paymentOption == "AMAZONPAY" || paymentOption == "WALLET") {
      if (cartIds.length > 0) {
        if (paymentOption == "WALLET") {
          // let usagePurchaseLimit = await UsageLimitPurchaseModel.findOne({},{ usage_limit_purchase: 1 }).lean();
          var userWallet = await UserWalletModel.findOne({ user: mongoose.Types.ObjectId(user._id) }, { wallet_amount: 1 }).lean();

          if (userWallet && (userWallet.wallet_amount > 0)) {
            // let userPayableAmount = ((Number(usagePurchaseLimit.usage_limit_purchase) * (Number(userWallet.wallet_amount)))  / 100 )
            // if(Number(totalAmount) >=  Number(userPayableAmount)){
            if (Number(userWallet.wallet_amount) < (Number(totalAmount))) {
              return {
                status: 0,
                message: "You don't have sufficient amount to proceed with WALLET, please try another payment method"
              }
            }
          } else {
            return {
              status: 0,
              message: "You have not sufficient amount to proceed with WALLET, please try another payment method"
            }
          }
        }

        let orderIds = [];
        for (let i = 0; i < cartIds.length; i++) {
          let cartData = await UserCartModel.findOne({ _id: mongoose.Types.ObjectId(cartIds[i]) }, { product: 1, quantity: 1, seller: 1 })
            .populate('product.seller_product', 'selling_price')
            .populate('product.admin_product', 'selling_price').lean();
          let new_price = cartData.product.seller_product ? cartData.product.seller_product.selling_price : cartData.product.admin_product.selling_price;
          let productPrice = parseFloat(new_price);
          let productQuantity = parseInt(cartData.quantity);
          let productTotalAmount = (productPrice * productQuantity).toFixed(2);
          let total_amount = parseFloat(productTotalAmount) + parseFloat(delivery_charge) - parseFloat(discount_amount);

          let dataToSave = {
            user: user._id,
            cart_id: cartIds[i],
            quantity: productQuantity,
            order_id: generateUniqueId({ length: 7, useLetters: true }).toUpperCase(),
            address: addressId,
            coupon: couponData ? couponData._id : null,
            currency: "PEN",
            totalAmount: parseFloat(total_amount),
            deliveryCharge: delivery_charge,
            discountAmount: discount_amount,
            orderStatus: 0,
            paymentStatus: 1,
            payment_options: paymentOption,
            commissionPercent: commission ? commission.commission_percent : 0,
            serviceChargePercent: serviceCharge ? serviceCharge.service_charge : 0
          }

          let res = new UserOrderModel(Object.assign({}, dataToSave));
          let saveOrder = await res.save();
          if (!saveOrder) {
            return {
              status: 0,
              message: "Unable to place order"
            }
          }

          let orderId = saveOrder._id;
          let cart_id = cartIds[i];
          orderIds.push(orderId);
          sellerIds.push(cartData.seller.seller_id)
          productIds.push(cartData.product.seller_product ? cartData.product.seller_product._id : cartData.product.admin_product._id)
          let updateCart = await UserCartModel.updateOne({ _id: mongoose.Types.ObjectId(cart_id) }, { status: 1, orderId: orderId }, { new: true });
          if (!updateCart) {
            return {
              status: 0,
              message: "Unable to update cart"
            }
          }
        }

        let bookingData = {
          user_id: user._id,
          cart_id: cartIds,
          order_id: orderIds,
          total_amount: totalAmount,
          delivery_charge: deliveryCharge,
          redeemed_amount: redeemedAmount,
          coupon_id: couponData ? couponData._id : null,
          discount_amount: discountAmount,
          transaction_id: (generateUniqueId({ length: 15, useLetters: true }).toUpperCase()),
          booking_id: unique_booking_id,
        }

        let response = new UserOrderBookingModel(Object.assign({}, bookingData));
        let saveBooking = await response.save();
        if (!saveBooking) {
          return {
            status: 0,
            message: "Unable to book order"
          }
        }
        let bookingId = saveBooking._id;

        let updateCartData = await UserCartModel.updateMany({ '_id': { '$in': cartIds } }, { bookingId: bookingId }, { new: true });
        let updateOrderData = await UserOrderModel.updateMany({ '_id': { '$in': orderIds } }, { booking_id: bookingId }, { new: true });

        if (!updateCartData && !updateOrderData) {
          return {
            status: 0,
            message: "Unable to update cart and order"
          }
        }

        if (paymentOption == "WALLET") {
          let healthGoalPoint = await HealthGoalPointModel.findOne({}, { health_goal_point: 1 }).lean();
          var userWallet = await UserWalletModel.findOne({ user: mongoose.Types.ObjectId(user._id) }, { wallet_amount: 1 }).lean();

          // let   jo purchase limit hai wo user wallet pe check lagna hai jo amount aayega agar wo amount total amount se jyada aaye to proceed karna hai nhi to error dikhana hai
          // aur man lo user ka total amount 200 rupye tha to uspe hm healthGoalPoint ka percent nikalenge aur 
          // uske wallet me add kr denge

          if (userWallet && (userWallet.wallet_amount > 0)) {
            let userDiscountAmount = ((Number(healthGoalPoint.health_goal_point) * (Number(totalAmount))) / 100)
            let latestWalletAmount = ((Number(userWallet.wallet_amount) + (Number(userDiscountAmount))) - (Number(totalAmount)))
            let dataToUpdateWallet = {
              transaction_type: 2,
              wallet_amount: latestWalletAmount,
              modified_at: new Date().getTime()
            }
            var updateWallet = await UserWalletModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userWallet._id) }, { $set: dataToUpdateWallet }, { new: true }).lean();

            let dataToSaveWallet = {
              user: user._id,
              transaction_id: generateUniqueId({ length: 7, useLetters: true }).toUpperCase(),
              transaction_type: 2,
              transaction_amount: ((Number(totalAmount))) - (Number(userDiscountAmount)),
              booking_type: 4,
              transaction_at: new Date().getTime()
            };

            let myData = new UserWalletTransactionModel(dataToSaveWallet);
            let save = await myData.save();
          }
        }

        await sendCartNotification(user, sellerIds);
        await sendNotificationToSeller(productIds);
        await updateTrackingToCoboxAfterOrder(cartIds, user, addressId);
        // console.log(productIds);
        let dataToSend = {
          bookingId: unique_booking_id
        }
        return { message: "Order placed successfully", status: 1, response: dataToSend };

      } else {
        return {
          status: 0,
          message: "Please add product to cart to place order"
        }
      }
    } else if (paymentOption == "KUSHKI") {
      if (cartIds.length > 0) {
        let orderIds = [];
        var productDetail = [];
        for (let i = 0; i < cartIds.length; i++) {
          let cartData = await UserCartModel.findOne({ _id: mongoose.Types.ObjectId(cartIds[i]) }, { product: 1, quantity: 1, seller: 1 })
            .populate('product.seller_product', 'selling_price')
            .populate('product.admin_product', 'selling_price').lean();
          let new_price = cartData.product.seller_product ? cartData.product.seller_product.selling_price : cartData.product.admin_product.selling_price;
          let productPrice = parseFloat(new_price);
          let productQuantity = parseInt(cartData.quantity);
          let productTotalAmount = (productPrice * productQuantity).toFixed(2);
          let total_amount = parseFloat(productTotalAmount) + parseFloat(delivery_charge) - parseFloat(discount_amount);

          let dataToSave = {
            user: user._id,
            cart_id: cartIds[i],
            quantity: productQuantity,
            order_id: generateUniqueId({ length: 7, useLetters: true }).toUpperCase(),
            address: addressId,
            coupon: couponData ? couponData._id : null,
            currency: "PEN",
            totalAmount: parseFloat(total_amount),
            deliveryCharge: delivery_charge,
            discountAmount: discount_amount,
            orderStatus: -1,
            paymentStatus: 0,
            payment_options: paymentOption,
            commissionPercent: commission ? commission.commission_percent : 0,
            serviceChargePercent: serviceCharge ? serviceCharge.service_charge : 0
          }

          let res = new UserOrderModel(Object.assign({}, dataToSave));
          let saveOrder = await res.save();
          if (!saveOrder) {
            return {
              status: 0,
              message: "Unable to place order"
            }
          }

          let orderId = saveOrder._id;
          let cart_id = cartIds[i];
          orderIds.push(orderId);
          sellerIds.push(cartData.seller.seller_id)
          productIds.push(cartData.product.seller_product ? cartData.product.seller_product._id : cartData.product.admin_product._id)
          let updateCart = await UserCartModel.updateOne({ _id: mongoose.Types.ObjectId(cart_id) }, { orderId: orderId }, { new: true });
          if (!updateCart) {
            return {
              status: 0,
              message: "Unable to update cart"
            }
          }

          let findProduct;
          findProduct = await ProductCatModel.findOne({ _id: cartData.product.seller_product }).lean();
          if (!findProduct) {
            findProduct = await TrackingDeviceModel.findOne({ _id: cartData.product.seller_product }).lean();
          }
          if (findProduct) {
            productDetail.push({
              id: findProduct._id,
              title: findProduct.product_name,
              price: (Number(total_amount) * 1000),
              sku: findProduct._id,  //findProduct.sku_min_limit ? findProduct.sku_min_limit+"" : "0",
              quantity: productQuantity
            });
          }
        }

        let bookingData = {
          user_id: user._id,
          cart_id: cartIds,
          order_id: orderIds,
          total_amount: totalAmount,
          delivery_charge: deliveryCharge,
          redeemed_amount: redeemedAmount,
          coupon_id: couponData ? couponData._id : null,
          discount_amount: discountAmount,
          transaction_id: (generateUniqueId({ length: 15, useLetters: true }).toUpperCase()),
          booking_id: unique_booking_id,
          status: 0
        }

        let bookingResp = new UserOrderBookingModel(Object.assign({}, bookingData));
        let saveBooking = await bookingResp.save();
        if (!saveBooking) {
          return {
            status: 0,
            message: "Unable to book order"
          }
        }
        let bookingId = saveBooking._id;

        let userAddress = await UserAddressModel.findOne({ user: user._id, _id: addressId }).lean();


        /* code for payment gateway start */
        // const dataParams = {
        //   "card": {
        //     "name": "Susheel Kumar",
        //     "number": "4285810016818288",
        //     "expiryMonth": "07",
        //     "expiryYear": "26",
        //     "cvv": "072"
        //   },
        //   "totalAmount": totalAmount,
        //   "currency": "PEN"
        // }

        // const response = await axios({
        //   method: 'post',
        //   url: 'https://api-uat.kushkipagos.com/card/v1/tokens',
        //   data: dataParams,
        //   headers: {'Public-Merchant-Id': '8a5891f55c264eeebbb979cf1951f3d9', 'Content-Type':  'application/json', }
        // });
        // let resp = response.data;
        // console.log(resp);
        // var token = null;
        // if(resp){
        //   token = resp.token
        var options = {
          method: 'POST',
          headers: {
            'Private-Merchant-Id': 'b04cf9ad305849da85dbcdd222e2d717', // Replace with your Private merchant id  //'ebdd6461bdd148bc8b556ccbda5cd450'
            'Content-Type': 'application/json'
          },
          url: 'https://api.kushkipagos.com/card/v1/charges', // Test environment
          body: {
            // token: "V0OzRB100000xhxQB8035251pHLBQsq5", // Replace with the token you recieved
            token: token,
            amount: {
              subtotalIva: 0,
              subtotalIva0: totalAmount,
              ice: 0,
              iva: 0,
              currency: "PEN"
            },
            metadata: {
              bookingID: bookingId
            },
            contactDetails: {
              // documentType: "DNI",
              // documentNumber: "1009283738",
              email: user.email ? user.email : "petsworld@gmail.com",
              firstName: user.full_name,
              lastName: user.full_name,
              phoneNumber: user.country_code + user.mobile_number
            },
            orderDetails: {
              siteDomain: "petsworld.pet",
              shippingDetails: {
                name: user.full_name,
                phone: user.country_code + user.mobile_number,
                address: userAddress ? (userAddress.house_no + "," + userAddress.street) : "",
                city: userAddress ? userAddress.city : "",
                region: userAddress ? userAddress.city : "",
                country: userAddress ? userAddress.country : "",
                zipCode: userAddress ? userAddress.postal_code : ""
              },
              billingDetails: {
                name: user.full_name,
                phone: user.country_code + user.mobile_number,
                address: userAddress ? (userAddress.house_no + "," + userAddress.street) : "",
                city: userAddress ? userAddress.city : "",
                region: userAddress ? userAddress.city : "",
                country: userAddress ? userAddress.country : "",
                zipCode: userAddress ? userAddress.postal_code : ""
              }
            },
            productDetails: {
              product: productDetail
            },
            fullResponse: "v2"
          },
          json: true
        };
        let respData = await doRequest(options);
        if (respData.details && respData.details.transactionStatus == 'APPROVAL') {
          let updateCartData = await UserCartModel.updateMany({ '_id': { '$in': cartIds } }, { status: 1, bookingId: bookingId }, { multi: true });
          let updateOrderData = await UserOrderModel.updateMany({ '_id': { '$in': orderIds } }, { paymentStatus: 1, orderStatus: 0, booking_id: bookingId }, { multi: true });
          let updateBookingData = await UserOrderBookingModel.findOneAndUpdate({ '_id': bookingId }, { transaction_id: respData.transactionReference, status: 1, response: [respData] }, { new: true });
          if (!updateCartData && !updateOrderData && !updateBookingData) {
            return {
              status: 0,
              message: "Unable to update cart and order"
            }
          }

          await sendCartNotification(user, sellerIds)
          await sendNotificationToSeller(productIds);
          await updateTrackingToCoboxAfterOrder(cartIds, user, addressId);

          let dataToSend = {
            bookingId: unique_booking_id
          }
          return { message: "Order placed successfully", status: 1, response: dataToSend };
        } else {
          return { message: "Placing order has been failed, please try again", status: 0, response: { request: options, response: respData, userDetails: userAddress } };
        }
        // }
        /* code for payment gateway end */
      } else {
        return {
          status: 0,
          message: "Please add product to cart to place order"
        }
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getTrackingDeviceProducts = async (user) => {
  try {
    let trackingDeviceProducts = await TrackingDeviceModel.find({ is_blocked: false, product_quantity: { $gt: 0 } }).populate('productMainCategoryId', 'mainCategoryName MainCategoryImage').lean();
    if (!trackingDeviceProducts) {
      return {
        status: 0, message: "No tracking devices found"
      };
    }

    if (trackingDeviceProducts.length > 0) {
      for (let i = 0; i < trackingDeviceProducts.length; i++) {
        let cartCount = await UserCartModel.findOne({ "product.admin_product": trackingDeviceProducts[i]._id, user: user._id, isDeleted: false, status: 0 }, { quantity: 1 }).lean();
        let favProd = await UserWishlistModel.findOne({ user: user._id, "product.admin_product": trackingDeviceProducts[i]._id })

        trackingDeviceProducts[i]['cartQuantity'] = cartCount ? cartCount.quantity : 0;
        trackingDeviceProducts[i]['cartId'] = cartCount ? cartCount._id : null;
        trackingDeviceProducts[i]['isCartAdded'] = cartCount ? true : false;
        trackingDeviceProducts[i]['isfavorite'] = favProd ? true : false;
      }
    }

    let dataToSend = {
      trackingDeviceProducts: trackingDeviceProducts
    }
    return {
      message: "Tracking device products fetched successfully",
      status: 1,
      response: dataToSend
    };

  } catch (error) {
    throw new Error(error.message);
  }
};


exports.cancelOrder = async (user, data) => {
  try {
    if (!user || user._id == '')
      return { status: 0, message: "Login first to cancel order" };
    if (!data || data._id == '')
      return { status: 0, message: "Order id is required" };

    let orderDetails = await UserOrderModel.findOne({ _id: mongoose.Types.ObjectId(data._id) }).lean();
    if (!orderDetails) {
      return {
        status: 0,
        message: "Order does not exists"
      }
    }

    let updateOrder = await UserOrderModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(data._id) }, { $set: { orderStatus: 6, cancel_reason: data.cancel_reason, modified_at: new Date().getTime() } }, { new: true }).lean();
    if (updateOrder) {
      let updateCart = await UserCartModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(updateOrder.cart_id) }, { $set: { status: 7, cancel_reason: data.cancel_reason, modified_at: new Date().getTime() } }, { new: true }).lean();
      if (!updateCart) {
        return {
          status: 0,
          message: "Unable to cancel order"
        }
      } else {
        let cancelCoboxOrder = await utils.cancelCoboxOrder(updateCart, data.cancel_reason);
        let cancelData = (JSON.parse(cancelCoboxOrder));
        if (!cancelData || cancelData.statusCode == 400) {
          return {
            status: 0,
            message: "Order not cancelled by cobox"
          }
        }
      }

      /* Code for notification start to Seller */
      let device_token = "";
      let device_type = 1;
      let sellerData = await SellerModel.findOne({ _id: mongoose.Types.ObjectId(updateCart.seller.seller_id) }, { device_token: 1, device_type: 1 }).lean();
      if (!sellerData) {
        let adminData = await AdminModel.findOne({}, { email: 1, _id: 1 });
        device_token = adminData.deviceToken;
        device_type = adminData.deviceType;
      } else {
        device_token = sellerData.device_token;
        device_type = sellerData.device_type;
      }
      let sellerTitle = "Order cancelled";
      let sellerNotiBody = "Your order with orderId " + updateOrder.order_id + " has been cancelled by " + user.full_name;
      let sellerNotification = {
        uniqe_id: {
          seller_id: updateCart.seller.seller_id,
          provider_id: updateCart.seller.seller_id,
          admin_id: updateCart.seller.seller_id
        },
        title: sellerTitle,
        body: sellerNotiBody,
        notification_type: 1,
        type: 3,
        created_at: new Date().getTime()
      }
      let sendNoti = await NotificationModel.create(sellerNotification);
      sendNoti.save();

      let sellerPayload = {
        title: sellerTitle,
        body: sellerNotiBody,
        noti_type: 1
      }
      let sellerNotify = {
        title: sellerTitle,
        body: sellerNotiBody,
        "color": "#f95b2c",
        "sound": true
      }
      if (device_token) {
        utils.sendPushNotification(device_token, device_type, sellerPayload, sellerNotify);
      }
      /* Code for notification end to Seller */
    }

    return { message: "Order cancelled successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getCancelOrderReasonList = async (user) => {
  try {
    let cancelReasons = [
      "Not good in quality",
      "Price is too high",
      "Not got the exact item as expected"
    ]
    let dataToSend = {
      cancelReasons: cancelReasons
    }

    return { message: "Order cancel reason list fetched successfully", status: 1, response: dataToSend };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getOngoingOrderList = async (user) => {
  try {
    if (!user || user._id == '')
      return { status: 0, message: "Login first to get ongoing order list" };

    let modified_at = new Date().getTime();
    let ongoingOrderList = await UserCartModel.find({ user: mongoose.Types.ObjectId(user._id), isDeleted: false, $or: [{ status: 1 }, { status: 3 }, { status: 4 }, { status: 5 }] }, { orderId: 1, weight: 1, size: 1, colorId: 1, status: 1, delivery_id_order: 1, delivery_token: 1 })
      .populate('orderId', 'quantity order_id currency totalAmount deliveryCharge discountAmount orderStatus paymentStatus created_at payment_options modified_at commissionPercent serviceChargePercent')
      .populate('product.seller_product', 'product_name product_price selling_price product_discount product_details product_decripton product_quantity')
      .populate('product.admin_product', 'product_name image product_quantity product_price selling_price product_discount product_decripton')
      .populate('seller.seller_id', 'first_name last_name')
      .sort({ created_at: -1 }).lean();

    if (ongoingOrderList.length > 0) {
      for (let i = 0; i < ongoingOrderList.length; i++) {
        if (ongoingOrderList[i].status == 5) {
          if (ongoingOrderList[i].delivery_token && ongoingOrderList[i].delivery_id_order) {
            // console.log(ongoingOrderList[i])
            let coboxOrderStatus = await utils.coboxOrderStatus(ongoingOrderList[i].delivery_token, ongoingOrderList[i].delivery_id_order);
            // console.log(coboxOrderStatus)
            if (coboxOrderStatus) {
              let orderData = (JSON.parse(coboxOrderStatus));
              // console.log(orderData)
              if (orderData && orderData.order_status && (orderData.order_status.id_order_status)) {
                if (orderData.order_status.id_order_status == 500) {
                  let updateCart = await UserCartModel.findOneAndUpdate({ _id: ongoingOrderList[i]._id }, { $set: { status: 6, modified_at: modified_at } }, { new: true });
                  if (ongoingOrderList[i].orderId && ongoingOrderList[i].orderId._id) {
                    let updateOrder = await UserOrderModel.findByIdAndUpdate({ _id: ongoingOrderList[i].orderId._id }, { $set: { orderStatus: 5, modified_at: modified_at } }, { new: true });
                  }
                } else if ((orderData.order_status.id_order_status == 600) || (orderData.order_status.id_order_status == 1.100) || (orderData.order_status.id_order_status == 1.200) || (orderData.order_status.id_order_status == 1.300) || (orderData.order_status.id_order_status == 1.400) || (orderData.order_status.id_order_status == 1.500) || (orderData.order_status.id_order_status == 1.600)) {
                  let updateCart = await UserCartModel.findOneAndUpdate({ _id: ongoingOrderList[i]._id }, { $set: { status: 8, modified_at: modified_at } }, { new: true });
                  if (ongoingOrderList[i].orderId && ongoingOrderList[i].orderId._id) {
                    let updateOrder = await UserOrderModel.findByIdAndUpdate({ _id: ongoingOrderList[i].orderId._id }, { $set: { orderStatus: 7, modified_at: modified_at } }, { new: true });
                  }
                }
              }
            }
          }
        }
      }
    }
    let dataToSend = {
      ongoingOrderList: ongoingOrderList
    }
    return { response: dataToSend, message: "Ongoing order list fetch successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getPastOrderList = async (user) => {
  try {
    if (!user || user._id == '')
      return { status: 0, message: "Login first to get past order list" };

    let pastOrderList = await UserCartModel.find({ user: mongoose.Types.ObjectId(user._id), isDeleted: false, $or: [{ status: 2 }, { status: 6 }, { status: 7 }, { status: 8 }] }, { orderId: 1, weight: 1, size: 1, colorId: 1 })
      .populate('orderId', 'quantity order_id currency totalAmount deliveryCharge discountAmount orderStatus paymentStatus created_at payment_options modified_at cancel_reason  commissionPercent serviceChargePercent')
      .populate('product.seller_product', 'product_name product_price selling_price product_discount product_details product_decripton product_quantity')
      .populate('product.admin_product', 'product_name image product_quantity product_price selling_price product_discount product_decripton')
      .populate('seller.seller_id', 'first_name last_name')
      .sort({ created_at: -1 }).lean();

    if (pastOrderList.length > 0) {
      for (let i = 0; i < pastOrderList.length; i++) {
        if (pastOrderList[i].product.admin_product != null || pastOrderList[i].product.seller_product != null) {
          let productId = (pastOrderList[i].product.admin_product == null) ? (pastOrderList[i].product.seller_product._id) : (pastOrderList[i].product.admin_product._id);
          let allRatings = await OrderRatingModel.find({ $or: [{ "product.seller_product": productId }, { "product.admin_product": productId }], "uniqid.user_id": user._id }, { uniqid: 0, product: 0, order_id: 0 }).lean();
          pastOrderList[i]["rating"] = (allRatings.length > 0) ? allRatings : [];
          pastOrderList[i]["invoiceUrl"] = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
        }
      }
    }
    let dataToSend = {
      pastOrderList: pastOrderList
    }
    return { response: dataToSend, message: "Past order list fetch successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getOrderDetails = async (user, data) => {
  try {
    if (!user || user._id == '')
      return { status: 0, message: "Login first to get order details" };
    if (!data || data._id == '')
      return { status: 0, message: "Order id is required" };

    let orderDetails = await UserOrderModel.findOne({ _id: mongoose.Types.ObjectId(data._id) }, { user: 0, booking_id: 0 })
      .populate('address')
      .populate('coupon', 'couponCode')
      .lean();

    if (!orderDetails) {
      return {
        status: 0,
        message: "Unable to fetch order details"
      }
    }
    let cartDetails = null;
    if (data._id && user._id) {
      cartDetails = await UserCartModel.findOne({ user: mongoose.Types.ObjectId(user._id), orderId: mongoose.Types.ObjectId(data._id) }, { currency: 1, price: 1, quantity: 1, unit_price: 1, orderId: 1, weight: 1, size: 1, colorId: 1 })
        .populate('product.seller_product', 'product_name product_price selling_price product_discount product_details product_decripton product_quantity')
        .populate('product.admin_product', 'product_name image product_quantity product_price selling_price product_discount product_decripton')
        .populate('seller.seller_id', 'first_name last_name country_code mobile_number email profile_pic storeDetails')
        .populate('seller.admin_id', 'name email profileImage countryCode mobileNumber country state city address')
        .lean();

      let allRatings = [];
      if (cartDetails) {
        let productId = (cartDetails.product.admin_product == null) ? (cartDetails.product.seller_product._id) : (cartDetails.product.admin_product._id);
        allRatings = await OrderRatingModel.find({ $or: [{ "product.seller_product": productId }, { "product.admin_product": productId }], "uniqid.user_id": user._id }, { uniqid: 0, product: 0, order_id: 0 }).lean();
      }
      orderDetails['productDetails'] = cartDetails;
      orderDetails['productSize'] = cartDetails ? cartDetails.size : null;
      orderDetails['productWeight'] = cartDetails ? cartDetails.weight : null;
      orderDetails['rating'] = (allRatings.length > 0) ? allRatings : [];
      orderDetails["invoiceUrl"] = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    }

    return { response: orderDetails, message: "Order detail fetch successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.addOrderRating = async (user, data) => {
  try {
    if (!data.product_id || data.product_id == '')
      return { status: 0, message: "Product id is required" };
    if (!data.order_id || data.order_id == '')
      return { status: 0, message: "Order id is required" };
    if (!data.rating_point || data.rating_point == '')
      return { status: 0, message: "Rating is required" };
    if (!data.review || data.review == '')
      return { status: 0, message: "Review is required" };

    let dataToSave = {
      uniqid: {
        user_id: user._id,
        host_id: user._id
      },
      product: {
        seller_product: data.product_id,
        admin_product: data.product_id
      },
      order_id: data.order_id,
      rating_point: data.rating_point,
      review: data.review,
      created_at: new Date().getTime()
    }
    let rating = await OrderRatingModel.create(dataToSave);
    let saveRating = rating.save()

    if (!saveRating) {
      return {
        status: 0,
        message: "Unable to add rating"
      }
    }

    return { message: "Rating details added successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getAllRatings = async (user, data) => {
  try {
    if (!data.product_id || data.product_id == '')
      return { status: 0, message: "Product id is required" };

    let allRatings = await OrderRatingModel.find({ $or: [{ "product.seller_product": data.product_id }, { "product.admin_product": data.product_id }] })
      .populate('uniqid.user_id', 'full_name')
      .populate('uniqid.host_id', 'first_name last_name')
      .populate('product.seller_product', 'product_name product_decripton')
      .populate('product.admin_product', 'product_name product_decripton')
      .lean();

    let avgRating = "0.0";
    if (allRatings.length > 0) {
      let sum = allRatings.reduce((accumulator, object) => {
        return accumulator + object.rating_point;
      }, 0);
      avgRating = (sum / allRatings.length).toFixed(1);
    }

    let dataToSend = {
      allRatings: allRatings,
      avgRating: avgRating,
      totalRatings: allRatings.length
    }

    return { response: dataToSend, message: "All ratings fetched successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getAllAdvertisements = async () => {
  try {
    let currentDate = new Date().getTime();
    let allAds = await AdvertisementModel.find({ is_user: true, is_active: true, is_blocked: 0, $and: [{ start_date: { $lte: currentDate } }, { end_date: { $gte: currentDate } }] }, { image: 1 }).sort({ date_created: -1 }).limit(5).lean();

    let dataToSend = {
      allAdvertisements: allAds
    }

    return { response: dataToSend, message: "All advertisements fetched successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getServiceCategoryList = async () => {
  try {
    let serviceCategory = await ServiceCategoryModel.find({ is_blocked: 0 }, { is_blocked: 0, created_at: 0, modified_at: 0 }).lean();

    let dataToSend = {
      allCategories: serviceCategory
    }

    return { response: dataToSend, message: "All service categories fetched successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getServiceProviderServicesList = async (data) => {
  try {
    if (!data.service_category || data.service_category == '')
      return { status: 0, message: "Service category is required" };

    let services = await ServiceProviderServicesModel.find({ serviceCategory: mongoose.Types.ObjectId(data.service_category) })
      .populate('serviceProvider', 'first_name last_name country_code mobile_number email profile_pic location').lean();

    if (services.length > 0) {
      for (let i = 0; i < services.length; i++) {
        let allRatings = await ServiceOrderRatingModel.find({ service_id: services[i]._id }).lean();
        let avgRating = "0.0";
        if (allRatings.length > 0) {
          let sum = allRatings.reduce((accumulator, object) => {
            return accumulator + object.rating_point;
          }, 0);
          avgRating = (sum / allRatings.length).toFixed(1);

        }
        services[i].avgRating = avgRating;
      }
    }

    let dataToSend = {
      allServices: services
    }

    return { response: dataToSend, message: "All services fetched successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getServiceDetails = async (user, data) => {
  try {
    if (!data.service_id || data.service_id == '')
      return { status: 0, message: "Service id is required" };

    let service = await ServiceProviderServicesModel.findOne({ _id: mongoose.Types.ObjectId(data.service_id) })
      .populate('serviceProvider', 'first_name last_name country_code mobile_number email profile_pic location').lean();

    let address = await UserAddressModel.findOne({ user: user._id, primaryAddress: true }, { user: 0, createdAt: 0, updatedAt: 0 }).lean();
    if (service) {
      service.address = address ? address : null;
    }
    let allRatings = await ServiceOrderRatingModel.find({ service_id: service._id }).lean();
    let avgRating = "0.0";
    if (allRatings.length > 0) {
      let sum = allRatings.reduce((accumulator, object) => {
        return accumulator + object.rating_point;
      }, 0);
      avgRating = (sum / allRatings.length).toFixed(1);
    }

    service.avgRating = avgRating;
    service.ratingCount = allRatings.length;

    let dataToSend = {
      serviceDetails: service
    }

    return { response: dataToSend, message: "Service details fetched successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.bookService = async (user, data) => {
  try {
    let { service_category, service_id, address, total_amount, booking_date, booking_time, additional_note, payment_option, token } = data;

    if (!service_category || service_category == '')
      return { status: 0, message: "Service category is required" };
    if (!service_id || service_id == '')
      return { status: 0, message: "Service id is required" };
    if (!address || address == '')
      return { status: 0, message: "Address id is required" };
    if (!total_amount || total_amount == '')
      return { status: 0, message: "Total amount is required" };
    if (!booking_date || booking_date == '')
      return { status: 0, message: "Booking date is required" };
    if (!booking_time || booking_time == '')
      return { status: 0, message: "Booking time is required" };
    if (!payment_option || payment_option == '')
      return { status: 0, message: "Payment option is required" };

    let serviceProvider = await ServiceProviderServicesModel.findOne({ _id: mongoose.Types.ObjectId(service_id) }, { serviceProvider: 1 }).lean();
    // console.log(serviceProvider)
    let serviceProviderId = serviceProvider ? serviceProvider.serviceProvider : null;
    var commission = await CommissionModel.findOne({}).lean();
    let serviceCharge = await ServiceChargeModel.findOne({}).lean();

    if (payment_option == 'COD') {
      let dataToSave = {
        user: user._id,
        service_category,
        service_provider: serviceProviderId,
        service_id,
        booking_id: generateUniqueId({ length: 7, useLetters: true }).toUpperCase(),
        address,
        total_amount,
        booking_date,
        booking_time,
        additional_note,
        booking_status: 1,
        payment_status: 1,
        created_at: new Date().getTime(),
        payment_option,
        modified_at: new Date().getTime(),
        commissionPercent: commission ? commission.commission_percent : 0,
        serviceChargePercent: serviceCharge ? serviceCharge.service_charge : 0
      }
      let booking = await UserServiceBookingModel.create(dataToSave);
      let savebooking = booking.save()

      if (!savebooking) {
        return {
          status: 0,
          message: "Unable to add booking"
        }
      }
      await sendServiceBookingNotification(user, service_id);

      return { message: "Booking completed successfully", status: 1 };
    } else if (payment_option == "KUSHKI") {
      let userAddress = await UserAddressModel.findOne({ user: user._id, _id: address });
      let bookingId = generateUniqueId({ length: 7, useLetters: true }).toUpperCase();

      let productDetail = [{
        id: service_id,
        title: serviceProvider.description,
        price: (Number(total_amount) * 1000),
        sku: service_id,
        quantity: 1
      }];

      /* code for payment gateway start */
      // const dataParams = {
      //   "card": {
      //     "name": "Susheel Kumar",
      //     "number": "4285810016818288",
      //     "expiryMonth": "07",
      //     "expiryYear": "26",
      //     "cvv": "072"
      //   },
      //   "totalAmount": Number(total_amount),
      //   "currency": "PEN"
      // }

      // const response = await axios({
      //   method: 'post',
      //   url: 'https://api-uat.kushkipagos.com/card/v1/tokens',
      //   data: dataParams,
      //   headers: {'Public-Merchant-Id': '8a5891f55c264eeebbb979cf1951f3d9', 'Content-Type':  'application/json', }
      // });

      // let resp = response.data;
      // console.log(resp);
      // var localtoken = null;
      // if(resp){
      //   localtoken = resp.token
      var options = {
        method: 'POST',
        headers: {
          'Private-Merchant-Id': 'b04cf9ad305849da85dbcdd222e2d717', // Replace with your Private merchant id  //'ebdd6461bdd148bc8b556ccbda5cd450',
          'Content-Type': 'application/json'
        },
        url: 'https://api.kushkipagos.com/card/v1/charges', // Test environment
        body: {
          // token: "V0OzRB100000xhxQB8035251pHLBQsq5", // Replace with the token you recieved
          token: token,
          // token: localtoken,
          amount: {
            subtotalIva: 0,
            subtotalIva0: Number(total_amount),
            ice: 0,
            iva: 0,
            currency: "PEN"
          },
          metadata: {
            bookingID: bookingId
          },
          contactDetails: {
            // documentType: "DNI",
            // documentNumber: "1009283738",
            email: user.email ? user.email : "petsworld@gmail.com",
            firstName: user.full_name,
            lastName: user.full_name,
            phoneNumber: user.country_code + user.mobile_number
          },
          orderDetails: {
            siteDomain: "petsworld.pet",
            shippingDetails: {
              name: user.full_name,
              phone: user.country_code + user.mobile_number,
              address: userAddress ? (userAddress.house_no + "," + userAddress.street) : "",
              city: userAddress ? userAddress.city : "",
              region: userAddress ? userAddress.city : "",
              country: userAddress ? userAddress.country : "",
              zipCode: userAddress ? userAddress.postal_code : ""
            },
            billingDetails: {
              name: user.full_name,
              phone: user.country_code + user.mobile_number,
              address: userAddress ? (userAddress.house_no + "," + userAddress.street) : "",
              city: userAddress ? userAddress.city : "",
              region: userAddress ? userAddress.city : "",
              country: userAddress ? userAddress.country : "",
              zipCode: userAddress ? userAddress.postal_code : ""
            }
          },
          productDetails: {
            product: productDetail
          },
          fullResponse: "v2"
        },
        json: true
      };
      let respData = await doRequest(options);
      // console.log(respData)
      if (respData.details && respData.details.transactionStatus == 'APPROVAL') {
        let dataToSave = {
          user: user._id,
          service_category,
          service_provider: serviceProviderId,
          service_id,
          booking_id: bookingId,
          address,
          total_amount,
          booking_date,
          booking_time,
          additional_note,
          booking_status: 1,
          payment_status: 1,
          created_at: new Date().getTime(),
          payment_option,
          payment_response: [respData],
          modified_at: new Date().getTime(),
          commissionPercent: commission ? commission.commission_percent : 0,
          serviceChargePercent: serviceCharge ? serviceCharge.service_charge : 0
        };
        let booking = await UserServiceBookingModel.create(dataToSave);
        let savebooking = booking.save();

        if (!savebooking) {
          return {
            status: 0,
            message: "Unable to add booking",
          };
        }

        await sendServiceBookingNotification(user, service_id);

        return { message: "Booking completed successfully", status: 1 };
      } else {
        return { message: "Booking has been failed, please try again", status: 0, response: { request: options, response: respData, hostDetails: userAddress } };
      }
      // }

    } else if (payment_option == 'PAYPAL') {
      let dataToSave = {
        user: user._id,
        service_category,
        service_provider: serviceProviderId,
        service_id,
        booking_id: generateUniqueId({ length: 7, useLetters: true }).toUpperCase(),
        address,
        total_amount,
        booking_date,
        booking_time,
        additional_note,
        booking_status: 0,
        payment_status: 0,
        created_at: new Date().getTime(),
        payment_option,
        modified_at: new Date().getTime(),
        commissionPercent: commission ? commission.commission_percent : 0,
        serviceChargePercent: serviceCharge ? serviceCharge.service_charge : 0
      }
      let booking = await UserServiceBookingModel.create(dataToSave);
      let savebooking = booking.save()

      if (!savebooking) {
        return {
          status: 0,
          message: "Unable to add booking"
        }
      }
      let dataToSend = {
        bookingId: booking._id
      }
      return { message: "Booking payment is pending currently", response: dataToSend, status: 1 };
    } else if (payment_option == 'WALLET') {
      let usagePurchaseLimit = await UsageLimitPurchaseModel.findOne({}, { usage_limit_purchase: 1 }).lean();
      var userWallet = await UserWalletModel.findOne({ user: mongoose.Types.ObjectId(user._id) }, { wallet_amount: 1 }).lean();

      if (userWallet && (userWallet.wallet_amount > 0)) {
        let userPayableAmount = ((Number(usagePurchaseLimit.usage_limit_purchase) * (Number(userWallet.wallet_amount))) / 100)
        if (Number(total_amount) >= Number(userPayableAmount)) {
          return {
            status: 0,
            message: "You don't have sufficient amount to proceed with WALLET, please try another payment method"
          }
        }
      } else {
        return {
          status: 0,
          message: "You have not sufficient amount to proceed with WALLET, please try another payment method"
        }
      }

      let dataToSave = {
        user: user._id,
        service_category,
        service_provider: serviceProviderId,
        service_id,
        booking_id: generateUniqueId({ length: 7, useLetters: true }).toUpperCase(),
        address,
        total_amount,
        booking_date,
        booking_time,
        additional_note,
        booking_status: 1,
        payment_status: 1,
        created_at: new Date().getTime(),
        payment_option,
        modified_at: new Date().getTime(),
        commissionPercent: commission ? commission.commission_percent : 0,
        serviceChargePercent: serviceCharge ? serviceCharge.service_charge : 0
      }
      let booking = await UserServiceBookingModel.create(dataToSave);
      let savebooking = booking.save()

      if (!savebooking) {
        return {
          status: 0,
          message: "Unable to add booking"
        }
      } else {
        var userWalletData = await UserWalletModel.findOne({ user: mongoose.Types.ObjectId(user._id) }, { wallet_amount: 1 }).lean();

        if (userWalletData && (userWalletData.wallet_amount > 0)) {
          let latestWalletAmount = (Number(userWalletData.wallet_amount) - (Number(total_amount)))
          let dataToUpdateWallet = {
            transaction_type: 2,
            wallet_amount: latestWalletAmount,
            modified_at: new Date().getTime()
          }
          var updateWallet = await UserWalletModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userWalletData._id) }, { $set: dataToUpdateWallet }, { new: true }).lean();

          let dataToSaveWallet = {
            user: user._id,
            transaction_id: generateUniqueId({ length: 7, useLetters: true }).toUpperCase(),
            transaction_type: 2,
            transaction_amount: (Number(total_amount)),
            booking_type: 4,
            transaction_at: new Date().getTime()
          };

          let myData = new UserWalletTransactionModel(dataToSaveWallet);
          let save = await myData.save();
        }
      }
      await sendServiceBookingNotification(user, service_id);

      return { message: "Booking completed successfully", status: 1 };
    } else {
      return {
        status: 0,
        message: "Please choose payment option to proceed with booking"
      }
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.filterServices = async (user, data) => {
  try {
    if (!data.service_category || data.service_category == '')
      return { status: 0, message: "Service category is required" };
    if (!data.minm_experience || data.minm_experience == '')
      return { status: 0, message: "Minimum experience is required" };
    if (!data.maxm_experience || data.maxm_experience == '')
      return { status: 0, message: "Maximum experience is required" };
    if (!data.rating || data.rating == '')
      return { status: 0, message: "Rating is required" };

    let query = { serviceCategory: mongoose.Types.ObjectId(data.service_category) }

    // if(data.rating == 0){
    query = { ...query, $and: [{ experience: { $gte: Number(data.minm_experience) } }, { experience: { $lte: Number(data.maxm_experience) } }] }
    // }
    let services = await ServiceProviderServicesModel.find(query)
      .populate('serviceProvider', 'first_name last_name country_code mobile_number email profile_pic location').lean();

    if (services.length > 0) {
      for (let i = 0; i < services.length; i++) {
        let allRatings = await ServiceOrderRatingModel.find({ service_id: services[i]._id }).lean();
        let avgRating = "0.0";
        if (allRatings.length > 0) {
          let sum = allRatings.reduce((accumulator, object) => {
            return accumulator + object.rating_point;
          }, 0);
          avgRating = (sum / allRatings.length).toFixed(1);

        }
        services[i].avgRating = avgRating;
      }
    }
    if (Number(data.rating) == 0) {
      services = _.filter(services, (item) => Number(item.avgRating) < 1);
    } else if (Number(data.rating) == 1) {
      services = _.filter(services, (item) => ((Number(item.avgRating) >= 1) && (Number(item.avgRating) < 2)));
    } else if (Number(data.rating) == 2) {
      services = _.filter(services, (item) => ((Number(item.avgRating) >= 2) && (Number(item.avgRating) < 3)));
    } else if (Number(data.rating) == 3) {
      services = _.filter(services, (item) => ((Number(item.avgRating) >= 3) && (Number(item.avgRating) < 4)));
    } else if ((Number(data.rating) == 4)) {
      services = _.filter(services, (item) => ((Number(item.avgRating) >= 4) && (Number(item.avgRating) < 5)));
    } else if ((Number(data.rating) == 5)) {
      services = _.filter(services, (item) => ((Number(item.avgRating) >= 5)));
    } else {
      services = services;
    }
    // services = _.filter(services, (item) => Number(item.avgRating) >= Number(data.rating));

    let dataToSend = {
      filteredServices: services
    }

    return { response: dataToSend, message: "Services filtered successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.confirmPaypalBooking = async (user, data) => {
  try {
    if (!data.bookingId || data.bookingId == '')
      return { status: 0, message: "Booking id is required" };

    let dataToUpdate = {
      payment_response: data.response,
      booking_status: 1,
      payment_status: 1,
      modified_at: new Date().getTime()
    }

    let updateBooking = await UserServiceBookingModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(data.bookingId) }, { $set: dataToUpdate }, { new: true }).lean();
    if (!updateBooking) {
      return {
        status: 0,
        message: "Unable to confirm booking"
      }
    }
    /* Code for notification start */
    let title = "Order payment done";
    let Notificationbody = "Thanks for placing service order";
    let device_type = user.device_type;
    let notification = {
      uniqe_id: {
        user_id: user._id,
        host_id: user._id,
      },
      title: title,
      body: Notificationbody,
      notification_type: 8,
      type: 1,
      created_at: new Date().getTime()
    }
    let sendNotification = await NotificationModel.create(notification);
    sendNotification.save();

    let payload = {
      title: title,
      body: Notificationbody,
      noti_type: 1
    }
    let notify = {
      title: title,
      body: Notificationbody,
      "color": "#f95b2c",
      "sound": true
    }
    if (user.device_token) {
      utils.sendPushNotification(user.device_token, device_type, payload, notify);
    }
    /* Code for notification end */
    /* Code for notification start to Seller */

    let provider = await ServiceProviderServicesModel.findOne({ _id: mongoose.Types.ObjectId(updateBooking.service_id) }, { serviceProvider: 1 }).populate('serviceProvider', 'device_type device_token').lean();
    let device_token = provider ? provider.serviceProvider.device_token : "";
    let seller_device_type = provider ? provider.serviceProvider.device_type : "";
    let sellerTitle = "Order Placed";
    let sellerNotiBody = "New order has been placed by " + user.full_name;
    if (provider) {
      let sellerNotification = {
        uniqe_id: {
          seller_id: provider ? provider.serviceProvider._id : "",
          provider_id: provider ? provider.serviceProvider._id : "",
        },
        title: sellerTitle,
        body: sellerNotiBody,
        notification_type: 1,
        type: 3,
        created_at: new Date().getTime()
      }
      let sendNoti = await NotificationModel.create(sellerNotification);
      sendNoti.save();
    }

    let sellerPayload = {
      title: sellerTitle,
      body: sellerNotiBody,
      noti_type: 1
    }
    let sellerNotify = {
      title: sellerTitle,
      body: sellerNotiBody,
      "color": "#f95b2c",
      "sound": true
    }
    if (device_token) {
      utils.sendPushNotification(device_token, seller_device_type, sellerPayload, sellerNotify);
    }
    /* Code for notification end to Seller */

    /* Code for notification start to Admin */
    let admin = await AdminModel.findOne({}, { email: 1, _id: 1 });
    let adminTitle = "Order Placed";
    let NotiBody = "New order has been placed by " + user.full_name;

    let adminNotification = {
      uniqe_id: {
        admin_id: admin._id
      },
      title: adminTitle,
      body: NotiBody,
      notification_type: 1,
      type: 5,
      created_at: new Date().getTime()
    }
    let send_noti = await NotificationModel.create(adminNotification);
    send_noti.save();
    /* Code for notification end */

    return { message: "Booking confirmed successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getNotificationList = async (user) => {
  try {

    let notifications = await NotificationModel.find({ "uniqe_id.user_id": mongoose.Types.ObjectId(user._id) }, { uniqe_id: 0 }).sort({ created_at: -1 }).lean();
    if (!notifications) {
      return {
        status: 0,
        message: "Unable to get notifications"
      }
    }
    let dataToSend = {
      notificationList: notifications
    }

    return { message: "Notification list fetched successfully", status: 1, response: dataToSend };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.readNotification = async (user, data) => {
  try {
    if (!data._id || data._id == '')
      return { status: 0, message: "Notification id is required" };

    let notification = await NotificationModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(data._id) }, { $set: { is_read: 1 } }, { new: true }).lean();
    if (!notification) {
      return {
        status: 0,
        message: "Unable to update notification"
      }
    }

    return { message: "Notification read successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getOngoingServiceOrderList = async (user) => {
  try {
    if (!user._id || user._id == '')
      return { status: 0, message: "Login first to get onging service order list" };

    let getBookings = await UserServiceBookingModel.find({ user: mongoose.Types.ObjectId(user._id), payment_status: 1, $or: [{ booking_status: 1 }, { booking_status: 3 }, { booking_status: 4 }] })
      .populate('service_category', 'category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description",
        populate: [{
          path: 'serviceProvider',
          model: 'serviceProvider',
          select: 'first_name last_name country_code mobile_number email location profile_pic'
        }]
      })
      .populate('address')
      .sort({ created_at: -1 }).lean();

    if (!getBookings) {
      return {
        status: 0,
        message: "Unable to get booking"
      }
    }
    let dataToSend = {
      ongoingServiceOrderList: getBookings
    }
    return { message: "Onging service order list fetched successfully", status: 1, response: dataToSend };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getPastServiceOrderList = async (user) => {
  try {
    if (!user._id || user._id == '')
      return { status: 0, message: "Login first to get onging service order list" };

    let getBookings = await UserServiceBookingModel.find({ user: mongoose.Types.ObjectId(user._id), payment_status: 1, $or: [{ booking_status: 2 }, { booking_status: 5 }, { booking_status: 6 }] })
      .populate('service_category', 'category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description",
        populate: [{
          path: 'serviceProvider',
          model: 'serviceProvider',
          select: 'first_name last_name country_code mobile_number email location profile_pic'
        }]
      })
      .populate('address')
      .sort({ created_at: -1 }).lean();

    if (getBookings.length > 0) {
      for (let i = 0; i < getBookings.length; i++) {
        // console.log(getBookings[i])
        let service_id = getBookings[i].service_id ? getBookings[i].service_id._id : null;
        if (service_id != null) {
          let allRatings = await ServiceOrderRatingModel.find({ service_id: service_id, "uniqid.user_id": user._id, "booking.user_booking": getBookings[i]._id }, { uniqid: 0, booking: 0, service_provider_id: 0 }).lean();
          getBookings[i]['rating'] = (allRatings.length > 0) ? allRatings : [];
        }
      }
    }

    if (!getBookings) {
      return {
        status: 0,
        message: "Unable to get booking"
      }
    }
    let dataToSend = {
      pastServiceOrderList: getBookings
    }
    return { message: "Past service order list fetched successfully", status: 1, response: dataToSend };
  } catch (err) {
    throw new Error(err.message);
  }
};


exports.cancelServiceOrder = async (user, data) => {
  try {
    if (!user || user._id == '')
      return { status: 0, message: "Login first to cancel order" };
    if (!data || data._id == '')
      return { status: 0, message: "Booking id is required" };

    let orderDetails = await UserServiceBookingModel.findOne({ _id: mongoose.Types.ObjectId(data._id) }).lean();
    if (!orderDetails) {
      return {
        status: 0,
        message: "Order does not exists"
      }
    }

    let updateOrder = await UserServiceBookingModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(data._id) }, { $set: { booking_status: 6, cancel_reason: data.cancel_reason, modified_at: new Date().getTime() } }, { new: true }).lean();
    if (updateOrder) {
      /* Code for notification start to Seller */
      let serviceId = updateOrder.service_id;
      let device_token = "";
      let device_type = 1;
      let serviceData = await ServiceProviderServicesModel.findOne({ _id: mongoose.Types.ObjectId(serviceId) }, { serviceProvider: 1 })
        .populate('serviceProvider', '_id device_token device_type').lean();

      if (serviceData) {
        device_token = serviceData.serviceProvider.device_token;
        device_type = serviceData.serviceProvider.device_type;

        let sellerTitle = "Order cancelled";
        let sellerNotiBody = "Your order with bookingId " + updateOrder.booking_id + " has been cancelled by " + user.full_name;
        let sellerNotification = {
          uniqe_id: {
            seller_id: serviceData.serviceProvider._id,
            provider_id: serviceData.serviceProvider._id
          },
          title: sellerTitle,
          body: sellerNotiBody,
          order_id: {
            user_order: data._id,
            host_order: data._id,
          },
          notification_type: 13,
          type: 3,
          created_at: new Date().getTime()
        }
        let sendNoti = await NotificationModel.create(sellerNotification);
        sendNoti.save();

        let sellerPayload = {
          title: sellerTitle,
          body: sellerNotiBody,
          noti_type: 1
        }
        let sellerNotify = {
          title: sellerTitle,
          body: sellerNotiBody,
          "color": "#f95b2c",
          "sound": true
        }
        if (device_token) {
          utils.sendPushNotification(device_token, device_type, sellerPayload, sellerNotify);
        }
      }
      /* Code for notification end to Seller */
    }

    return { message: "Booking cancelled successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getServiceOrderDetails = async (user, data) => {
  try {
    if (!user || user._id == '')
      return { status: 0, message: "Login first to get order details" };
    if (!data || data._id == '')
      return { status: 0, message: "Booking id is required" };

    let orderDetails = await UserServiceBookingModel.findOne({ _id: mongoose.Types.ObjectId(data._id) }, { user: 0 })
      .populate('service_category', 'category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices",
        populate: [{
          path: 'serviceProvider',
          model: 'serviceProvider',
          select: 'first_name last_name country_code mobile_number email location profile_pic'
        }]
      })
      .populate('address')
      .sort({ created_at: -1 }).lean();

    if (!orderDetails) {
      return {
        status: 0,
        message: "Unable to fetch service order details"
      }
    }
    if (data._id && user._id) {
      let service_id = orderDetails.service_id ? orderDetails.service_id._id : null;
      if (service_id != null) {
        let allRatings = await ServiceOrderRatingModel.find({ service_id: service_id, "uniqid.user_id": user._id, "booking.user_booking": data._id }, { uniqid: 0, booking: 0, service_provider_id: 0 }).lean();
        orderDetails['rating'] = (allRatings.length > 0) ? allRatings : [];
      }
    }
    let dataToSend = {
      orderDetails: orderDetails
    }
    return { response: dataToSend, message: "Service order detail fetch successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.addServiceOrderRating = async (user, data) => {
  try {
    if (!data.service_provider_id || data.service_provider_id == '')
      return { status: 0, message: "Service provider id is required" };
    if (!data.service_id || data.service_id == '')
      return { status: 0, message: "Service id is required" };
    if (!data.booking_id || data.booking_id == '')
      return { status: 0, message: "Booking id is required" };
    if (!data.rating_point || data.rating_point == '')
      return { status: 0, message: "Rating is required" };
    // if (!data.review || data.review == '')
    //   return { status: 0, message: "Review is required" };

    let ratingData = await ServiceOrderRatingModel.findOne({ service_id: data.service_id, "uniqid.user_id": user._id, "booking.user_booking": data.booking_id }, { _id: 1 }).lean();
    if (ratingData) {
      return {
        status: 2,
        message: "You have already given review to this service"
      }
    } else {
      let dataToSave = {
        uniqid: {
          user_id: user._id,
          host_id: user._id
        },
        service_provider_id: data.service_provider_id,
        service_id: data.service_id,
        booking: {
          user_booking: data.booking_id,
          host_booking: data.booking_id
        },
        rating_point: data.rating_point,
        review: data.review,
        created_at: new Date().getTime()
      }
      let rating = await ServiceOrderRatingModel.create(dataToSave);
      let saveRating = rating.save()

      if (!saveRating) {
        return {
          status: 0,
          message: "Unable to add rating"
        }
      } else {
        let updateorder = await UserServiceBookingModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(data.booking_id) }, { $set: { is_rated: true, service_rating: rating._id } }, { new: true }).lean();
      }

      return { message: "Rating details added successfully", status: 1 };
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getServiceRatings = async (user, data) => {
  try {
    if (!data.service_id || data.service_id == '')
      return { status: 0, message: "Service id is required" };

    let allRatings = await ServiceOrderRatingModel.find({ service_id: data.service_id }, { booking: 0 })
      .populate('uniqid.user_id', 'full_name')
      .populate('uniqid.host_id', 'first_name last_name')
      .populate('service_provider_id', 'first_name last_name country_code mobile_number email location')
      .populate('service_id', 'service_image price experience description')
      .lean();

    let avgRating = "0.0";
    if (allRatings.length > 0) {
      let sum = allRatings.reduce((accumulator, object) => {
        return accumulator + object.rating_point;
      }, 0);
      avgRating = (sum / allRatings.length).toFixed(1);
    }

    let dataToSend = {
      allRatings: allRatings,
      avgRating: avgRating,
      ratingCount: allRatings.length
    }

    return { response: dataToSend, message: "All ratings fetched successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getCancelServiceOrderReasonList = async (user) => {
  try {
    let cancelReasons = [
      "Not a right fit, the service is not for them",
      "Price is too high",
      "Not got the exact service as expected",
      "Not realizing the value proposition",
      "Poor utilization and/or adoption",
      "Not completed in time"
    ]
    let dataToSend = {
      cancelReasons: cancelReasons
    }

    return { message: "Service order cancel reason list fetched successfully", status: 1, response: dataToSend };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getPackageList = async () => {
  try {
    let packageList = await HostPackageModel.find()
      .populate('host', "first_name last_name country_code mobile_number email profile_pic location")
      .populate('breed', 'subCategoryName')
      .lean()
      .sort({ createdAt: -1 })

    if (!packageList) {
      return {
        status: 0,
        message: "No list found"
      }
    } else {
      if (packageList.length > 0) {
        for (let i = 0; i < packageList.length; i++) {
          let address = null;
          let avgRating = "0.0";
          let allRatings = 0;
          if (packageList[i] && packageList[i].host) {
            // address = await HostAddressModel.findOne({ host: mongoose.Types.ObjectId(packageList[i].host._id), primaryAddress: true  }).lean();
            address = await HostProfileModel.findOne({ host: mongoose.Types.ObjectId(packageList[i].host._id) }, { address: 1 }).lean();

            allRatings = await PackageOrderRatingModel.find({ package_id: mongoose.Types.ObjectId(packageList[i]._id) }, { rating_point: 1, review: 1, created_at: 1 }).lean();

            if (allRatings.length > 0) {
              let sum = allRatings.reduce((accumulator, object) => {
                return accumulator + object.rating_point;
              }, 0);
              avgRating = (sum / allRatings.length).toFixed(1);
            }

          }
          packageList[i]['address'] = address ? address.address : null
          packageList[i].avgRating = avgRating;
          packageList[i].ratingCount = allRatings.length;
        }
      }

      return {
        status: 1,
        message: "Package list fetch successfully",
        response: packageList
      }
    }
  } catch (error) {
    throw new Error(error.message)
  }
};

exports.viewPackage = async (data) => {
  try {

    if (!data._id || data._id == '')
      return { status: 0, message: "Package id is required" };

    let viewPackage = await HostPackageModel.findOne({ _id: data._id })
      .populate('host', "first_name last_name country_code mobile_number email profile_pic location")
      .populate('breed', 'subCategoryName')
      .lean()


    if (!viewPackage) {
      return {
        status: 0,
        message: "Something went Wrong"
      }
    } else {
      if (viewPackage.host) {
        let address = await HostAddressModel.findOne({ host: mongoose.Types.ObjectId(viewPackage.host._id), primaryAddress: true }).lean();
        if (address) {
          viewPackage.address = address ? address : null
        } else {
          viewPackage.address = null
        }
      }
      let ratingCount = await PackageOrderRatingModel.countDocuments({ package_id: mongoose.Types.ObjectId(viewPackage._id) }).lean();
      viewPackage.ratingCount = ratingCount;

      return {
        status: 1,
        message: "Data fetch successfully",
        response: viewPackage
      }
    }

  } catch (error) {
    throw new Error(error.message)
  }
}

exports.viewPackageWithToken = async (user, data) => {
  try {

    if (!data._id || data._id == '')
      return { status: 0, message: "Package id is required" };

    let viewPackage = await HostPackageModel.findOne({ _id: data._id })
      .populate('host', "first_name last_name country_code mobile_number email profile_pic location")
      .populate('breed', 'subCategoryName')
      .lean()


    if (!viewPackage) {
      return {
        status: 0,
        message: "Something went Wrong"
      }
    } else {
      if (viewPackage.host) {
        let address = await HostProfileModel.findOne({ host: mongoose.Types.ObjectId(viewPackage.host._id) }, { address: 1 }).lean();
        if (address) {
          viewPackage.address = address ? address.address : null
        } else {
          viewPackage.address = null
        }
      }
      let ratingCount = await PackageOrderRatingModel.countDocuments({ package_id: mongoose.Types.ObjectId(viewPackage._id) }).lean();
      viewPackage.ratingCount = ratingCount;

      let likeData = await userLikeModel.findOne({
        "package.host_package": data._id, user: user._id
      })
      viewPackage.is_liked = likeData ? 1 : 0;

      return {
        status: 1,
        message: "Data fetch successfully",
        response: viewPackage
      }
    }

  } catch (error) {
    throw new Error(error.message)
  }
}

exports.bookPackage = async (user, data) => {
  try {
    let { package_id, host_id, pet_id, couponCode, discount_amount, payable_amount, service_date, service_duration, payment_option, address, token } = data;
    var couponData;
    if (couponCode) {
      couponData = await PromocodeModel.findOne({ couponCode: couponCode }, { _id: 1 }).lean();
    }
    let unique_booking_id = (generateUniqueId({ length: 7, useLetters: true }).toUpperCase());
    var commission = await CommissionModel.findOne({}).lean();
    let serviceCharge = await ServiceChargeModel.findOne({}).lean();

    if (payment_option == "COD") {
      let dataToSave = {
        user: user._id,
        package_id: package_id,
        host_id: host_id,
        pet_id: pet_id,
        booking_id: unique_booking_id,
        coupon: couponData ? couponData._id : null,
        discount_amount: discount_amount,
        currency: "PEN",
        payable_amount: parseFloat(payable_amount),
        service_date: service_date,
        service_duration: service_duration,
        booking_status: 1,
        payment_status: 1,
        payment_option: payment_option,
        address: address,
        created_at: new Date().getTime(),
        modified_at: new Date().getTime(),
        commissionPercent: commission ? commission.commission_percent : 0,
        serviceChargePercent: serviceCharge ? serviceCharge.service_charge : 0
      }

      let res = new PackageBookingModel(Object.assign({}, dataToSave));
      let saveOrder = await res.save();
      if (!saveOrder) {
        return {
          status: 0,
          message: "Unable to place order"
        }
      }
      await sendPackageBookingNotification(user, host_id);

      return { message: "Booking done successfully", status: 1 };
    } else if (payment_option == "KUSHKI") {
      let userAddress = await UserAddressModel.findOne({ user: user._id, _id: address });
      let packageData = await HostPackageModel.findOne({ _id: package_id }, { package_name: 1 }).lean();

      let productDetail = [{
        id: package_id,
        title: packageData ? packageData.package_name : "",
        price: (Number(payable_amount) * 1000),
        sku: package_id,
        quantity: 1
      }];

      /* code for payment gateway start */
      // const dataParams = {
      //   "card": {
      //     "name": "Susheel Kumar",
      //     "number": "4285810016818288",
      //     "expiryMonth": "07",
      //     "expiryYear": "26",
      //     "cvv": "072"
      //   },
      //   "totalAmount": Number(payable_amount),
      //   "currency": "PEN"
      // }

      // const response = await axios({
      //   method: 'post',
      //   url: 'https://api-uat.kushkipagos.com/card/v1/tokens',
      //   data: dataParams,
      //   headers: {'Public-Merchant-Id': '8a5891f55c264eeebbb979cf1951f3d9', 'Content-Type':  'application/json', }
      // });

      // let resp = response.data;
      // console.log(resp);
      // var localtoken = null;
      // if(resp){
      //   localtoken = resp.token
      var options = {
        method: 'POST',
        headers: {
          'Private-Merchant-Id': 'b04cf9ad305849da85dbcdd222e2d717', // Replace with your Private merchant id //'ebdd6461bdd148bc8b556ccbda5cd450'
          'Content-Type': 'application/json'
        },
        url: 'https://api.kushkipagos.com/card/v1/charges', // Test environment
        body: {
          // token: "V0OzRB100000xhxQB8035251pHLBQsq5", // Replace with the token you recieved
          token: token,
          // token: localtoken,
          amount: {
            subtotalIva: 0,
            subtotalIva0: Number(payable_amount),
            ice: 0,
            iva: 0,
            currency: "PEN"
          },
          metadata: {
            bookingID: unique_booking_id
          },
          contactDetails: {
            // documentType: "DNI",
            // documentNumber: "1009283738",
            email: user.email ? user.email : "petsworld@gmail.com",
            firstName: user.full_name,
            lastName: user.full_name,
            phoneNumber: user.country_code + user.mobile_number
          },
          orderDetails: {
            siteDomain: "petsworld.pet",
            shippingDetails: {
              name: user.full_name,
              phone: user.country_code + user.mobile_number,
              address: userAddress ? (userAddress.house_no + "," + userAddress.street) : "",
              city: userAddress ? userAddress.city : "",
              region: userAddress ? userAddress.city : "",
              country: userAddress ? userAddress.country : "",
              zipCode: userAddress ? userAddress.postal_code : ""
            },
            billingDetails: {
              name: user.full_name,
              phone: user.country_code + user.mobile_number,
              address: userAddress ? (userAddress.house_no + "," + userAddress.street) : "",
              city: userAddress ? userAddress.city : "",
              region: userAddress ? userAddress.city : "",
              country: userAddress ? userAddress.country : "",
              zipCode: userAddress ? userAddress.postal_code : ""
            }
          },
          productDetails: {
            product: productDetail
          },
          fullResponse: "v2"
        },
        json: true
      };
      let respData = await doRequest(options);
      console.log(respData)
      if (respData.details && respData.details.transactionStatus == 'APPROVAL') {
        let dataToSave = {
          user: user._id,
          package_id: package_id,
          host_id: host_id,
          pet_id: pet_id,
          booking_id: unique_booking_id,
          coupon: couponData ? couponData._id : null,
          discount_amount: discount_amount,
          currency: "PEN",
          payable_amount: parseFloat(payable_amount),
          service_date: service_date,
          service_duration: service_duration,
          booking_status: 1,
          payment_status: 1,
          payment_option: payment_option,
          payment_response: [respData],
          address: address,
          created_at: new Date().getTime(),
          modified_at: new Date().getTime(),
          commissionPercent: commission ? commission.commission_percent : 0,
          serviceChargePercent: serviceCharge ? serviceCharge.service_charge : 0
        }

        let res = new PackageBookingModel(Object.assign({}, dataToSave));
        let saveOrder = await res.save();
        if (!saveOrder) {
          return {
            status: 0,
            message: "Unable to book package"
          }
        }

        await sendPackageBookingNotification(user, host_id);

        return { message: "Booking completed successfully", status: 1 };
      } else {
        return { message: "Booking has been failed, please try again", status: 0, response: { request: options, response: respData, hostDetails: userAddress } };
      }
      // }

    } else if (payment_option == "PAYPAL") {
      let dataToSave = {
        user: user._id,
        package_id: package_id,
        host_id: host_id,
        pet_id: pet_id,
        booking_id: unique_booking_id,
        coupon: couponData ? couponData._id : null,
        discount_amount: discount_amount,
        currency: "PEN",
        payable_amount: parseFloat(payable_amount),
        service_date: service_date,
        service_duration: service_duration,
        booking_status: 0,
        payment_status: 0,
        payment_option: payment_option,
        address: address,
        created_at: new Date().getTime(),
        modified_at: new Date().getTime(),
        commissionPercent: commission ? commission.commission_percent : 0,
        serviceChargePercent: serviceCharge ? serviceCharge.service_charge : 0
      }

      let res = new PackageBookingModel(Object.assign({}, dataToSave));
      let saveOrder = await res.save();
      if (!saveOrder) {
        return {
          status: 0,
          message: "Unable to place order"
        }
      }
      let dataToSend = {
        bookingId: res._id
      }
      return { message: "Booking payment is pending currently", response: dataToSend, status: 1 };
    } else if (payment_option == 'WALLET') {
      let usagePurchaseLimit = await UsageLimitPurchaseModel.findOne({}, { usage_limit_purchase: 1 }).lean();
      var userWallet = await UserWalletModel.findOne({ user: mongoose.Types.ObjectId(user._id) }, { wallet_amount: 1 }).lean();

      if (userWallet && (userWallet.wallet_amount > 0)) {
        let userPayableAmount = ((Number(usagePurchaseLimit.usage_limit_purchase) * (Number(userWallet.wallet_amount))) / 100)
        if (Number(payable_amount) >= Number(userPayableAmount)) {
          return {
            status: 0,
            message: "You don't have sufficient amount to proceed with WALLET, please try another payment method"
          }
        }
      } else {
        return {
          status: 0,
          message: "You have not sufficient amount to proceed with WALLET, please try another payment method"
        }
      }

      let dataToSave = {
        user: user._id,
        package_id: package_id,
        host_id: host_id,
        pet_id: pet_id,
        booking_id: unique_booking_id,
        coupon: couponData ? couponData._id : null,
        discount_amount: discount_amount,
        currency: "PEN",
        payable_amount: parseFloat(payable_amount),
        service_date: service_date,
        service_duration: service_duration,
        booking_status: 1,
        payment_status: 1,
        payment_option: payment_option,
        address: address,
        created_at: new Date().getTime(),
        modified_at: new Date().getTime(),
        commissionPercent: commission ? commission.commission_percent : 0,
        serviceChargePercent: serviceCharge ? serviceCharge.service_charge : 0
      }

      let res = new PackageBookingModel(Object.assign({}, dataToSave));
      let saveOrder = await res.save();
      if (!saveOrder) {
        return {
          status: 0,
          message: "Unable to place order"
        }
      } else {
        var userWalletData = await UserWalletModel.findOne({ user: mongoose.Types.ObjectId(user._id) }, { wallet_amount: 1 }).lean();

        if (userWalletData && (userWalletData.wallet_amount > 0)) {
          let latestWalletAmount = (Number(userWalletData.wallet_amount) - (Number(payable_amount)))
          let dataToUpdateWallet = {
            transaction_type: 2,
            wallet_amount: latestWalletAmount,
            modified_at: new Date().getTime()
          }
          var updateWallet = await UserWalletModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userWalletData._id) }, { $set: dataToUpdateWallet }, { new: true }).lean();

          let dataToSaveWallet = {
            user: user._id,
            transaction_id: generateUniqueId({ length: 7, useLetters: true }).toUpperCase(),
            transaction_type: 2,
            transaction_amount: (Number(payable_amount)),
            booking_type: 4,
            transaction_at: new Date().getTime()
          };

          let myData = new UserWalletTransactionModel(dataToSaveWallet);
          let save = await myData.save();
        }
      }
      await sendPackageBookingNotification(user, host_id);

      return { message: "Booking done successfully", status: 1 };
    } else {
      return {
        status: 0,
        message: "Please choose payment option to proceed with booking"
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.filterPackage = async (user, data) => {
  try {
    let { min_duration, max_duration, verified_host, price, rating } = data;
    let query = {};
    if (min_duration && max_duration) {
      query = { $and: [{ duration: { $gte: min_duration } }, { duration: { $lte: max_duration } }] }
    }

    let packageList = await HostPackageModel.find(query)
      .populate('host', "first_name last_name country_code mobile_number email profile_pic location is_verified_by_admin")
      .populate('breed', 'subCategoryName')
      .lean()
      .sort({ price: price })

    if (packageList.length > 0) {
      for (let i = 0; i < packageList.length; i++) {
        let address = null;
        if (packageList[i].host) {
          address = await HostAddressModel.findOne({ host: mongoose.Types.ObjectId(packageList[i].host._id) }).lean();
        }
        packageList[i]['address'] = address ? address : null

        let allRatings = await PackageOrderRatingModel.find({ package_id: mongoose.Types.ObjectId(packageList[i]._id) }, { rating_point: 1, review: 1, created_at: 1 }).lean();
        let avgRating = "0.0";
        if (allRatings.length > 0) {
          let sum = allRatings.reduce((accumulator, object) => {
            return accumulator + object.rating_point;
          }, 0);
          avgRating = (sum / allRatings.length).toFixed(1);
        }
        packageList[i].avgRating = avgRating;
        packageList[i].ratingCount = allRatings.length;
      }
    }

    if (Number(rating) == 0) {
      packageList = _.filter(packageList, (item) => Number(item.avgRating) < 1);
    } else if (Number(rating) == 1) {
      packageList = _.filter(packageList, (item) => ((Number(item.avgRating) >= 1) && (Number(item.avgRating) < 2)));
    } else if (Number(rating) == 2) {
      packageList = _.filter(packageList, (item) => ((Number(item.avgRating) >= 2) && (Number(item.avgRating) < 3)));
    } else if (Number(rating) == 3) {
      packageList = _.filter(packageList, (item) => ((Number(item.avgRating) >= 3) && (Number(item.avgRating) < 4)));
    } else if ((Number(rating) == 4) || (Number(rating) == 5)) {
      packageList = _.filter(packageList, (item) => ((Number(item.avgRating) >= 4) && (Number(item.avgRating) <= 5)));
    } else {
      packageList = packageList;
    }

    if (verified_host == 1) {
      packageList = _.filter(packageList, (item) => item.host.is_verified_by_admin == 1);
    }

    let dataToSend = {
      filteredPackage: packageList
    }
    return {
      status: 1,
      message: "Package filtered successfully",
      response: dataToSend
    }


  } catch (error) {
    throw new Error(error.message)
  }
}

exports.confirmPaypalPackageBooking = async (user, data) => {
  try {
    if (!data.bookingId || data.bookingId == '')
      return { status: 0, message: "Booking id is required" };

    let dataToUpdate = {
      payment_response: data.response,
      booking_status: 1,
      payment_status: 1,
      modified_at: new Date().getTime()
    }

    let updateBooking = await PackageBookingModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(data.bookingId) }, { $set: dataToUpdate }, { new: true }).lean();
    if (!updateBooking) {
      return {
        status: 0,
        message: "Unable to confirm booking"
      }
    }

    /* Code for notification start */
    let title = "Package Booked";
    let Notificationbody = "Your package has been booked successfully";
    let device_type = user.device_type;
    let notification = {
      uniqe_id: {
        user_id: user._id
      },
      title: title,
      body: Notificationbody,
      notification_type: 1,
      type: 1,
      created_at: new Date().getTime()
    }
    let sendNotification = await NotificationModel.create(notification);
    sendNotification.save();

    let payload = {
      title: title,
      body: Notificationbody,
      noti_type: 1
    }
    let notify = {
      title: title,
      body: Notificationbody,
      "color": "#f95b2c",
      "sound": true
    }
    if (user.device_token) {
      utils.sendPushNotification(user.device_token, device_type, payload, notify);
    }

    let host_id = updateBooking.host_id;
    /* Code for notification start to Host */
    let hostData = await HostModel.findOne({ _id: mongoose.Types.ObjectId(host_id) }, { device_token: 1, device_type: 1 }).lean();
    let hostTitle = "Package Booked";
    let hostNotiBody = "New package has been booked by " + user.full_name;

    let hostNotification = {
      uniqe_id: {
        host_id: host_id,
      },
      title: hostTitle,
      body: hostNotiBody,
      notification_type: 1,
      type: 2,
      created_at: new Date().getTime()
    }
    let sendNoti = await NotificationModel.create(hostNotification);
    sendNoti.save();

    let hostPayload = {
      title: hostTitle,
      body: hostNotiBody,
      noti_type: 1
    }
    let hostNotify = {
      title: hostTitle,
      body: hostNotiBody,
      "color": "#f95b2c",
      "sound": true
    }
    if (hostData.device_token) {
      utils.sendPushNotification(hostData.device_token, hostData.device_type, hostPayload, hostNotify);
    }

    /* Code for notification end to Host */

    /* Code for notification start to Admin */
    let admin = await AdminModel.findOne({}, { email: 1, _id: 1 });
    let adminTitle = "Package Booked";
    let NotiBody = "New package has been booked by " + user.full_name;

    let adminNotification = {
      uniqe_id: {
        admin_id: admin._id
      },
      title: adminTitle,
      body: NotiBody,
      notification_type: 1,
      type: 5,
      created_at: new Date().getTime()
    }
    let send_noti = await NotificationModel.create(adminNotification);
    send_noti.save();
    /* Code for notification end */

    return { message: "Booking confirmed successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.activePackageBookingList = async (user) => {
  try {
    var date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    let todaydate = Date.parse(date);

    let getBooking = await PackageBookingModel.find({ user: mongoose.Types.ObjectId(user._id), service_date: { $gte: todaydate }, $or: [{ booking_status: 1 }, { booking_status: 2 }, { booking_status: 3 }], payment_status: 1 }, {
      payment_status: 0, payment_response: 0
    })
      .populate({
        path: 'package_id', model: "hostPackage", select: "package_name package_img pet_size description breed",
        populate: [{
          path: 'breed',
          model: 'productSubCategory',
          select: 'subCategoryName'
        }]
      })
      .populate('host_id', 'first_name last_name country_code mobile_number email profile_pic location')
      .populate('pet_id', 'package_name pet_name pet_dob pet_height pet_weight pet_gender pet_special_care treatment pet_pic')
      .populate('coupon', 'couponCode discount usageLimit uptoDiscount orderValueLimit')
      .lean();

    if (!getBooking) {
      return {
        status: 0,
        message: "No booking found"
      }
    }
    if (getBooking.length > 0) {
      for (let i = 0; i < getBooking.length; i++) {
        console.log(getBooking[i].address)
        let address = await HostAddressModel.findOne({ host: mongoose.Types.ObjectId(getBooking[i].host_id._id) }).lean();
        console.log(address)

        getBooking[i]['hostAddress'] = address ? address : null
      }
    }
    let dataToSend = {
      activePackageBookings: getBooking
    }

    return { message: "Package booking list fetched successfully", status: 1, response: dataToSend };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.closedPackageBookingList = async (user) => {
  try {
    let getBooking = await PackageBookingModel.find({ user: mongoose.Types.ObjectId(user._id), $or: [{ booking_status: 4 }, { booking_status: 5 }], payment_status: 1 }, {
      payment_status: 0, payment_response: 0
    })
      .populate({
        path: 'package_id', model: "hostPackage", select: "package_name package_img pet_size description breed",
        populate: [{
          path: 'breed',
          model: 'productSubCategory',
          select: 'subCategoryName'
        }]
      })
      .populate('host_id', 'first_name last_name country_code mobile_number email profile_pic location')
      .populate('pet_id', 'package_name pet_name pet_dob pet_height pet_weight pet_gender pet_special_care treatment pet_pic')
      .populate('coupon', 'couponCode discount usageLimit uptoDiscount orderValueLimit')
      .lean();

    if (!getBooking) {
      return {
        status: 0,
        message: "No booking found"
      }
    }
    if (getBooking.length > 0) {
      for (let i = 0; i < getBooking.length; i++) {
        let address = await HostAddressModel.findOne({ host: mongoose.Types.ObjectId(getBooking[i].host_id._id) }).lean();
        getBooking[i]['hostAddress'] = address ? address : null

        let rating = await PackageOrderRatingModel.findOne({ user_id: mongoose.Types.ObjectId(user._id), booking_id: mongoose.Types.ObjectId(getBooking[i]._id) }, { rating_point: 1, review: 1, created_at: 1 }).lean();
        getBooking[i]['rating'] = rating ? rating : null
      }
    }
    let dataToSend = {
      closedPackageBookings: getBooking
    }

    return { message: "Package booking list fetched successfully", status: 1, response: dataToSend };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getProductList = async (body) => {
  try {
    let data = await ProductCatModel.aggregate([
      { $match: { product_main_cat: mongoose.Types.ObjectId(body.main_cat_id), product_cat: mongoose.Types.ObjectId(body.cat_id) } },
      {
        $lookup: {
          from: "userCart",
          let: { 'productId': '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $or: [{ $eq: ['$product.seller_product', '$$productId'] }, { $eq: ['$product.admin_product', '$$productId'] }] }] } } }
          ],
          as: "userCart"
        }
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "product_cat",
          foreignField: "_id",
          as: "product_cat"
        }
      },
      {
        $lookup: {
          from: "productmaincategories",
          localField: "product_main_cat",
          foreignField: "_id",
          as: "product_main_cat"
        }
      },
      {
        $lookup: {
          from: "productsubcategories",
          localField: "breed_type",
          foreignField: "_id",
          as: "breed_type"
        }
      },
      { $unwind: { path: "$product_cat", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$product_main_cat", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$breed_type", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          cartData: 0,
          hostCartData: 0
        }
      }
    ]);

    let fav_arr = []
    data.map(item => {
      // item.isCartAdded = (item.userCart[0])?true:false;
      // item.cartId = (item.userCart[0]) ? item.userCart[0]._id : null;
      // item.cartQuantity = (item.userCart[0]) ? item.userCart[0].quantity : 0;
      // item.isfavorite = (fav_arr.length > 0 && fav_arr.includes(item._id.toString())) ? true : false;
      item.cartQuantity = 0;
      item.cartId = null;
      item.isCartAdded = false;
      item.isfavorite = false;
    })

    if (data) {
      return {
        status: 1,
        response: data,
        message: "Product Category Fetch"
      }
    } else {
      return {
        status: 2,
        message: "Not Found"
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllProductList = async (body) => {
  try {
    let { main_cat_id, page } = body;
    let skip = (page <= 1 || !page) ? 0 : (page - 1) * 10;

    let data = await ProductCatModel.aggregate([
      { $match: { product_main_cat: mongoose.Types.ObjectId(main_cat_id), product_quantity: { $gt: 0 }, $expr: { $gt: ["$product_quantity", "$sku_min_limit"] } } },
      {
        $lookup: {
          from: "userCart",
          let: { 'productId': '$_id', 'isDeleted': false, 'status': 0 },
          pipeline: [
            { $match: { $expr: { $and: [{ $or: [{ $eq: ['$product.seller_product', '$$productId'] }, { $eq: ['$product.admin_product', '$$productId'] }] }, { $eq: ['$isDeleted', '$$isDeleted'] }, { $eq: ['$status', '$$status'] }] } } }

          ],
          as: "userCart"
        }
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "product_cat",
          foreignField: "_id",
          as: "product_cat"
        }
      },
      {
        $lookup: {
          from: "productmaincategories",
          localField: "product_main_cat",
          foreignField: "_id",
          as: "product_main_cat"
        }
      },
      {
        $lookup: {
          from: "productsubcategories",
          localField: "breed_type",
          foreignField: "_id",
          as: "breed_type"
        }
      },
      { $unwind: "$product_cat" },
      { $unwind: "$product_main_cat" },
      { $unwind: "$breed_type" },
      { $skip: skip },
      { $limit: 10 }
    ])

    let fav_arr = []
    let new_list = []
    for (let k = 0; k < data.length; k++) {
      new_list.push(data[k]._id.toString());
    }
    for (let j = 0; j < new_list.length; j++) {
      data[j].isCartAdded = false
      data[j].cartId = null;
      data[j].cartQuantity = 0;
      data[j].isfavorite = false
    }
    if (data) {
      return {
        status: 1,
        response: data,
        message: "Product Category Data"
      }
    } else {
      return {
        status: 2,
        message: "Not Found"
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getTrackingDeviceProductList = async (user) => {
  try {
    let trackingDeviceProducts = await TrackingDeviceModel.find({ is_blocked: false, product_quantity: { $gt: 0 } }).populate('productMainCategoryId', 'mainCategoryName MainCategoryImage').lean();
    if (!trackingDeviceProducts) {
      return {
        status: 0, message: "No tracking devices found"
      };
    }

    if (trackingDeviceProducts.length > 0) {
      for (let i = 0; i < trackingDeviceProducts.length; i++) {
        trackingDeviceProducts[i]['cartQuantity'] = 0;
        trackingDeviceProducts[i]['cartId'] = null;
        trackingDeviceProducts[i]['isCartAdded'] = false;
        trackingDeviceProducts[i]['isfavorite'] = false;
      }
    }

    let dataToSend = {
      trackingDeviceProducts: trackingDeviceProducts
    }
    return {
      message: "Tracking device products fetched successfully",
      status: 1,
      response: dataToSend
    };

  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getServiceDetailsSkip = async (data) => {
  try {
    if (!data.service_id || data.service_id == '')
      return { status: 0, message: "Service id is required" };

    let service = await ServiceProviderServicesModel.findOne({ _id: mongoose.Types.ObjectId(data.service_id) })
      .populate('serviceProvider', 'first_name last_name country_code mobile_number email profile_pic location').lean();

    if (service) {
      service.address = null;
    }
    let dataToSend = {
      serviceDetails: service
    }

    return { response: dataToSend, message: "Service details fetched successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.packageBookingDetails = async (user, data) => {
  try {
    if (!data.booking_id || data.booking_id == '')
      return { status: 0, message: "Booking id is required" };

    let getBooking = await PackageBookingModel.findOne({ _id: mongoose.Types.ObjectId(data.booking_id) }, {
      payment_status: 0, payment_response: 0
    })
      .populate({
        path: 'package_id', model: "hostPackage", select: "package_name package_img pet_size description breed",
        populate: [{
          path: 'breed',
          model: 'productSubCategory',
          select: 'subCategoryName'
        }]
      })
      .populate('host_id', 'first_name last_name country_code mobile_number email profile_pic location')
      .populate('pet_id', 'package_name pet_name pet_dob pet_height pet_weight pet_gender pet_special_care treatment pet_pic')
      .populate('coupon', 'couponCode discount usageLimit uptoDiscount orderValueLimit')
      .lean();

    if (!getBooking) {
      return {
        status: 0,
        message: "Booking not found"
      }
    }
    if (getBooking) {
      let address = await HostAddressModel.findOne({ host: mongoose.Types.ObjectId(getBooking.host_id._id) }).lean();
      getBooking.hostAddress = address ? address : null

      let rating = await PackageOrderRatingModel.findOne({ user_id: mongoose.Types.ObjectId(user._id), booking_id: mongoose.Types.ObjectId(data.booking_id) }, { rating_point: 1, review: 1, created_at: 1 }).lean();
      getBooking.rating = rating ? rating : null


    }
    let dataToSend = {
      packageBookingDetails: getBooking
    }

    return { message: "Package booking details fetched successfully", status: 1, response: dataToSend };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.cancelPackageBooking = async (user, data) => {
  try {
    if (!user || user._id == '')
      return { status: 0, message: "Login first to cancel order" };
    if (!data || data._id == '')
      return { status: 0, message: "Booking id is required" };

    let orderDetails = await PackageBookingModel.findOne({ _id: mongoose.Types.ObjectId(data._id) }).lean();
    if (!orderDetails) {
      return {
        status: 0,
        message: "Package order does not exists"
      }
    }

    let updateOrder = await PackageBookingModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(data._id) }, { $set: { booking_status: 5, cancel_reason: data.cancel_reason, modified_at: new Date().getTime() } }, { new: true }).lean();
    if (updateOrder) {
      /* Code for notification start to host */
      let hostId = updateOrder.host_id;
      let device_token = "";
      let device_type = 1;
      let hostData = await HostModel.findOne({ _id: mongoose.Types.ObjectId(hostId) }, { device_token: 1, device_type: 1 }).lean();

      if (hostData) {
        device_token = hostData.device_token;
        device_type = hostData.device_type;

        let hostTitle = "Booking cancelled";
        let hostNotiBody = "Your booking with bookingId " + updateOrder.booking_id + " has been cancelled by " + user.full_name;
        let hostNotification = {
          uniqe_id: {
            host_id: hostData._id
          },
          title: hostTitle,
          body: hostNotiBody,
          order_id: {
            package_booking: data._id
          },
          notification_type: 14,
          type: 2,
          created_at: new Date().getTime()
        }
        let sendNoti = await NotificationModel.create(hostNotification);
        sendNoti.save();

        let hostPayload = {
          title: hostTitle,
          body: hostNotiBody,
          noti_type: 1
        }
        let hostNotify = {
          title: hostTitle,
          body: hostNotiBody,
          "color": "#f95b2c",
          "sound": true
        }
        if (device_token) {
          utils.sendPushNotification(device_token, device_type, hostPayload, hostNotify);
        }
      }
      /* Code for notification end to host */
    }

    return { message: "Booking cancelled successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.addPackageBookingRating = async (user, data) => {
  try {
    if (!data.host_id || data.host_id == '')
      return { status: 0, message: "Host id is required" };
    if (!data.package_id || data.package_id == '')
      return { status: 0, message: "Package id is required" };
    if (!data.booking_id || data.booking_id == '')
      return { status: 0, message: "Booking id is required" };
    if (!data.rating_point || data.rating_point == '')
      return { status: 0, message: "Rating is required" };

    let ratingData = await PackageOrderRatingModel.findOne({ package_id: data.package_id, user_id: user._id, booking_id: data.booking_id }, { _id: 1 }).lean();
    if (ratingData) {
      return {
        status: 2,
        message: "You have already given review to this package"
      }
    } else {
      let dataToSave = {
        user_id: user._id,
        host_id: data.host_id,
        package_id: data.package_id,
        booking_id: data.booking_id,
        rating_point: data.rating_point,
        review: data.review,
        created_at: new Date().getTime()
      }
      let rating = await PackageOrderRatingModel.create(dataToSave);
      let saveRating = rating.save()

      if (!saveRating) {
        return {
          status: 0,
          message: "Unable to add rating"
        }
      } else {
        let updateorder = await PackageBookingModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(data.booking_id) }, { $set: { is_rated: true, package_rating: rating._id } }, { new: true }).lean();
      }

      return { message: "Rating details added successfully", status: 1 };
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getPackageRatings = async (user, data) => {
  try {
    if (!data.package_id || data.package_id == '')
      return { status: 0, message: "Package id is required" };

    let allRatings = await PackageOrderRatingModel.find({ package_id: data.package_id }, { booking_id: 0 })
      .populate('user_id', 'full_name')
      .populate('host_id', 'first_name last_name country_code mobile_number email location')
      .populate({
        path: 'package_id', model: "hostPackage", select: "package_name package_img pet_size description breed",
        populate: [{
          path: 'breed',
          model: 'productSubCategory',
          select: 'subCategoryName'
        }]
      })
      .lean();

    let avgRating = "0.0";
    if (allRatings.length > 0) {
      let sum = allRatings.reduce((accumulator, object) => {
        return accumulator + object.rating_point;
      }, 0);
      avgRating = (sum / allRatings.length).toFixed(1);
    }


    let dataToSend = {
      allRatings: allRatings,
      avgRating: avgRating,
      ratingCount: allRatings.length
    }

    return { response: dataToSend, message: "All ratings fetched successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getCancelPackageBookingReasonList = async () => {
  try {
    let cancelReasons = [
      "Not a right match, the package service is not for them",
      "Price is too high",
      "Not got the exact service as expected",
      "Not realizing the value proposition",
      "Poor utilization and/or adoption",
      "Not completed in time"
    ]
    let dataToSend = {
      cancelReasons: cancelReasons
    }

    return { message: "Package booking cancel reason list fetched successfully", status: 1, response: dataToSend };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getTermCondition = async () => {
  try {
    var getTerm = await SettingModel.findOne().lean();

    if (!getTerm || getTerm.length < 1) {
      return 'Unable to fetch term & condition';
    }

    // return { message: "Term & conditions Fetched successfully", status: 1, response: getTerm.term_condition };
    return getTerm.term_condition;



  } catch (error) {
    return {
      status: 0,
      message: error.message
    }
  }
}

exports.getAboutUsPage = async () => {
  try {
    var getTerm = await SettingModel.findOne().lean();

    if (!getTerm || getTerm.length < 1) {
      return 'Unable to fetch about us page';
    }

    return getTerm.about_us;


  } catch (error) {
    return {
      status: 0,
      message: error.message
    }
  }
}

exports.getContactUsPage = async () => {
  try {
    var getTerm = await SettingModel.findOne().lean();

    if (!getTerm || getTerm.length < 1) {
      return 'Unable to fetch contact us page';
    }

    return getTerm.contact_us;


  } catch (error) {
    return {
      status: 0,
      message: error.message
    }
  }
}

exports.getPrivacyPolicy = async () => {
  try {
    var getTerm = await SettingModel.findOne().lean();

    if (!getTerm || getTerm.length < 1) {
      return 'Unable to fetch privacy policy';
    }

    return getTerm.privacy_policy;


  } catch (error) {
    return {
      status: 0,
      message: error.message
    }
  }
}

exports.getFaqList = async () => {
  try {
    var getFaq = await FaqModel.find().lean();

    return getFaq;

  } catch (error) {
    return {
      status: -1,
      message: error.message
    }
  }
}

exports.getFaqPage = async () => {
  try {
    var getTerm = await SettingModel.findOne().lean();

    if (!getTerm || getTerm.length < 1) {
      return 'Unable to fetch faq';
    }

    return getTerm.faq;


  } catch (error) {
    return {
      status: 0,
      message: error.message
    }
  }
}

exports.generateTicket = async (user, data) => {
  try {
    if (!data.booking_id || data.booking_id == '')
      return { status: 0, message: "Booking id is required" };
    if (!data.complaint_type || data.complaint_type == '')
      return { status: 0, message: "Complaint type is required" };
    if (!data.complaint || data.complaint == '')
      return { status: 0, message: "Complaint is required" };


    let dataToSave = {
      uniqid: {
        user_id: user._id
      },
      complaint_type: data.complaint_type,
      booking: {
        user_cart_booking: data.booking_id,
        user_service_booking: data.booking_id,
        package_booking: data.booking_id,
        host_cart_booking: data.booking_id,
        host_service_booking: data.booking_id
      },
      complaint: data.complaint,
      ticket_id: (generateUniqueId({ length: 7, useLetters: true }).toUpperCase()),
      ticket_status: 1,
      created_at: new Date().getTime(),
      modified_at: new Date().getTime()
    }
    let ticket = await ReportTicketModel.create(dataToSave);
    let saveticket = ticket.save()

    if (!saveticket) {
      return {
        status: 0,
        message: "Unable to raise complaint"
      }
    }

    return { message: "Complaint raised successfully", status: 1 };

  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getOrderId = async (user, data) => {
  try {

    if (!data.complaint_type || data.complaint_type == '')
      return { status: 0, message: "Complaint type is required" };

    let orderId = [];

    if (data.complaint_type == 1) {
      orderId = await UserOrderModel.find({}, { order_id: 1 }).lean();
    } else if (data.complaint_type == 2) {
      orderId = await UserServiceBookingModel.find({}, { booking_id: 1 }).lean();
    } else if (data.complaint_type == 3) {
      orderId = await PackageBookingModel.find({}, { booking_id: 1 }).lean();
    } else if (data.complaint_type == 4) {
      orderId = await HostOrderModel.find({}, { order_id: 1 }).lean();
    } else if (data.complaint_type == 5) {
      orderId = await HostServiceBookingModel.find({}, { booking_id: 1 }).lean();
    }

    let dataToSend = {
      orderId: orderId
    }

    return { message: "OrderId fetched successfully", status: 1, response: dataToSend };

  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getTicketList = async (user) => {
  try {

    let tickets = await ReportTicketModel.find({ "uniqid.user_id": mongoose.Types.ObjectId(user._id) }, { uniqid: 0 })
      .populate('booking.user_cart_booking', 'order_id')
      .populate('booking.user_service_booking', 'booking_id')
      .populate('booking.package_booking', 'booking_id')
      .populate('booking.host_cart_booking', 'order_id')
      .populate('booking.host_service_booking', 'booking_id')
      .lean();

    let dataToSend = {
      ticketList: tickets
    }

    return { message: "Ticket list fetched successfully", status: 1, response: dataToSend };

  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getWalletTransactions = async (user) => {
  try {

    var userWallet = await UserWalletModel.findOne({ user: mongoose.Types.ObjectId(user._id) }).lean();
    var walletTransactions = await UserWalletTransactionModel.find({ user: mongoose.Types.ObjectId(user._id) }, { booking: 0 }).sort({ transaction_at: -1 }).lean();

    let dataToSend = {
      walletTransactions: walletTransactions,
      walletAmount: userWallet ? userWallet.wallet_amount : 0
    }

    return { message: "Transaction list fetched successfully", status: 1, response: dataToSend };
  } catch (err) {
    throw new Error(err.message);
  }
};


exports.getRefundList = async (user, data) => {
  try {
    if (!data.sortType || data.sortType == "")
      return { status: 0, message: "Sort type is required" };

    var commission = await CommissionModel.findOne({}).lean();
    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    let todayStart = Date.parse(start);
    let weekStart = todayStart - 7 * 86400000;
    let monthStart = todayStart - 30 * 86400000;

    var productQuery = { user: user._id, paymentStatus: 1, is_refunded: true, $or: [{ orderStatus: 1 }, { orderStatus: 6 }] }
    var serviceQuery = { user: user._id, payment_status: 1, is_refunded: true, $or: [{ booking_status: 2 }, { booking_status: 6 }] }
    var packageQuery = { user: user._id, payment_status: 1, is_refunded: true, $or: [{ booking_status: 5 }] }

    if (data.sortType == 0) {
      productQuery = { ...productQuery }
      serviceQuery = { ...serviceQuery }
      packageQuery = { ...packageQuery }
    } else if (data.sortType == 1) {
      productQuery = { ...productQuery, created_at: { $gte: todayStart } }
      serviceQuery = { ...serviceQuery, created_at: { $gte: todayStart } }
      packageQuery = { ...packageQuery, created_at: { $gte: todayStart } }
    } else if (data.sortType == 2) {
      productQuery = { ...productQuery, created_at: { $gte: weekStart } }
      serviceQuery = { ...serviceQuery, created_at: { $gte: weekStart } }
      packageQuery = { ...packageQuery, created_at: { $gte: weekStart } }
    } else if (data.sortType == 3) {
      productQuery = { ...productQuery, created_at: { $gte: monthStart } }
      serviceQuery = { ...serviceQuery, created_at: { $gte: monthStart } }
      packageQuery = { ...packageQuery, created_at: { $gte: monthStart } }
    } else if (data.sortType == 4) {
      if (!data.startDate || data.startDate == "")
        return { status: 0, message: "Start date is required" };
      if (!data.endDate || data.endDate == "")
        return { status: 0, message: "End date is required" };

      productQuery = { ...productQuery, $and: [{ created_at: { $gte: data.startDate } }, { created_at: { $lte: data.endDate } }] }
      serviceQuery = { ...serviceQuery, $and: [{ created_at: { $gte: data.startDate } }, { created_at: { $lte: data.endDate } }] }
      packageQuery = { ...packageQuery, $and: [{ created_at: { $gte: data.startDate } }, { created_at: { $lte: data.endDate } }] }
    }

    var userOrder = await UserOrderModel.find(productQuery, { order_id: 1, totalAmount: 1, created_at: 1, cart_id: 1, user: 1, is_refunded: 1 })
      .populate('user', 'full_name country_code mobile_number email').lean();
    if (userOrder.length > 0) {
      for (let i = 0; i < userOrder.length; i++) {
        let cartData = await UserCartModel.findOne({ _id: mongoose.Types.ObjectId(userOrder[i].cart_id) }, { seller: 1 })
          .populate('seller.seller_id', 'first_name last_name country_code mobile_number email profile_pic')
          .populate('seller.admin_id', 'name email profileImage countryCode mobileNumber profileImage')
          .lean();

        userOrder[i].commission = commission ? commission.commission_percent : 0;
        userOrder[i]['seller'] = cartData ? cartData.seller : null;
        let discountAmount = (commission.commission_percent * userOrder[i].totalAmount) / 100;
        let remainingAmount = Number(userOrder[i].totalAmount) - Number(discountAmount);

        userOrder[i]['payoutAmount'] = (Math.round(remainingAmount * 100) / 100).toFixed(2);
      }
    }

    var userService = await UserServiceBookingModel.find(serviceQuery, { booking_id: 1, total_amount: 1, created_at: 1, service_provider: 1, user: 1, is_refunded: 1 })
      .populate('user', 'full_name country_code mobile_number email')
      .populate('service_provider', 'first_name last_name country_code mobile_number email profile_pic').lean();

    if (userService.length > 0) {
      for (let j = 0; j < userService.length; j++) {
        userService[j].commission = commission ? commission.commission_percent : 0;
        let discountAmount = (commission.commission_percent * userService[j].total_amount) / 100;
        let remainingAmount = Number(userService[j].total_amount) - Number(discountAmount);
        userService[j]['payoutAmount'] = (Math.round(remainingAmount * 100) / 100).toFixed(2);
      }
    }

    var userPackage = await PackageBookingModel.find(packageQuery, { booking_id: 1, payable_amount: 1, created_at: 1, host_id: 1, user: 1, is_refunded: 1 })
      .populate('user', 'full_name country_code mobile_number email')
      .populate('host_id', 'first_name last_name country_code mobile_number email profile_pic').lean();

    if (userPackage.length > 0) {
      for (let j = 0; j < userPackage.length; j++) {
        userPackage[j].commission = commission ? commission.commission_percent : 0;
        let discountAmount = (commission.commission_percent * userPackage[j].payable_amount) / 100;
        let remainingAmount = Number(userPackage[j].payable_amount) - Number(discountAmount);
        userPackage[j]['payoutAmount'] = (Math.round(remainingAmount * 100) / 100).toFixed(2);
      }
    }

    let allData = [...userOrder, ...userService, ...userPackage]
    if (allData.length > 0) {
      allData = _.orderBy(allData, (item) => item.created_at, ["desc"]);
    }

    return {
      status: 1,
      message: "Refund list fetched successfully",
      response: allData,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.userLikeProduct = async (user, body) => {

  try {
    let checkSellerProduct = await ProductCatModel.findOne({ _id: body.product_id }).lean();

    if (!checkSellerProduct) {
      checkSellerProduct = await TrackingDeviceModel.findOne({ _id: body.product_id }).lean();
    }

    if (!checkSellerProduct) {
      return {
        status: 0,
        message: "Product Not Found"
      }
    }

    let data = await userLikeModel.findOne({
      $or: [{ "product.seller_product": body.product_id }, { "product.admin_product": body.product_id }]
    })


    if (!data) {
      let dataToSave = {
        product: {
          seller_product: body.product_id,
          admin_product: body.product_id,
        },
        user: user._id
      }
      let likeData = await userLikeModel.create(dataToSave);
      let save = await likeData.save();
      if (save) {
        return {
          status: 1,
          message: "You Liked this Product"
        }
      } else {
        return {
          status: 2,
          message: "Something Went wrong"
        }
      }
    } else {
      let likeData = await userLikeModel.findOne({
        $or: [{ "product.seller_product": body.product_id }, { "product.admin_product": body.product_id }], user: user._id
      })
      if (!likeData) {
        let likeData = await userLikeModel.findOneAndUpdate({ _id: data._id }, { $push: { user: user._id } }, { new: true }).lean();
        if (!likeData) {
          return {
            status: 2,
            message: "Unable to like product"
          }
        }
      }
      return {
        status: 1,
        message: "You Liked this Product"
      }
    }
  } catch (error) {
    throw new Error(error.message)
  }

}

exports.userUnlikeProduct = async (user, body) => {
  try {
    let dissLike = await userLikeModel.findOne(
      {
        $or: [{ "product.seller_product": body.product_id }, { "product.admin_product": body.product_id }],
        user: user._id
      }
    );
    if (dissLike) {
      let dislikeData = await userLikeModel.findOneAndUpdate({ _id: dissLike._id }, { $pull: { user: mongoose.Types.ObjectId(user._id) } }, { new: true }).lean();
      if (!dislikeData) {
        return {
          status: 2,
          message: "Unable to dislike product"
        }
      }
      return {
        status: 1,
        message: "Removed from like",
      };
    } else {
      return {
        status: 2,
        message: "Like the product first to unlike it",
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

exports.userLikePackage = async (user, body) => {

  try {
    let checkHostPackage = await HostPackageModel.findOne({ _id: body.package_id }).lean();

    if (!checkHostPackage) {
      return {
        status: 0,
        message: "Package Not Found"
      }
    }

    let data = await userLikeModel.findOne({
      $or: [{ "package.host_package": body.package_id }]
    })


    if (!data) {
      let dataToSave = {
        package: {
          host_package: body.package_id,
        },
        user: user._id
      }
      let likeData = await userLikeModel.create(dataToSave);
      let save = await likeData.save();
      if (save) {
        return {
          status: 1,
          message: "You Liked this Package"
        }
      } else {
        return {
          status: 2,
          message: "Something Went wrong"
        }
      }
    } else {
      let likeData = await userLikeModel.findOne({
        $or: [{ "package.host_package": body.package_id }], user: user._id
      })
      if (!likeData) {
        let likeData = await userLikeModel.findOneAndUpdate({ _id: data._id }, { $push: { user: user._id } }, { new: true }).lean();
        if (!likeData) {
          return {
            status: 2,
            message: "Unable to like Package"
          }
        }
      }
      return {
        status: 1,
        message: "You Liked this Package"
      }
    }
  } catch (error) {
    throw new Error(error.message)
  }

}

exports.userUnlikePackage = async (user, body) => {
  try {
    let dissLike = await userLikeModel.findOne(
      {
        $or: [{ "package.host_package": body.package_id }],
        user: user._id
      }
    );
    if (dissLike) {
      let dislikeData = await userLikeModel.findOneAndUpdate({ _id: dissLike._id }, { $pull: { user: mongoose.Types.ObjectId(user._id) } }, { new: true }).lean();
      if (!dislikeData) {
        return {
          status: 2,
          message: "Unable to dislike package"
        }
      }
      return {
        status: 1,
        message: "Removed from like",
      };
    } else {
      return {
        status: 2,
        message: "Like the package first to unlike it",
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

exports.userLikeService = async (user, body) => {

  try {
    let checkServiceId = await ServiceProviderServicesModel.findOne({ _id: body.service_id }).lean();

    if (!checkServiceId) {
      return {
        status: 0,
        message: "Service Not Found"
      }
    }

    let data = await userLikeModel.findOne({
      $or: [{ "service.service_provider_services": body.service_id }]
    })


    if (!data) {
      let dataToSave = {
        service: {
          service_provider_services: body.service_id,
        },
        user: user._id
      }
      let likeData = await userLikeModel.create(dataToSave);
      let save = await likeData.save();
      if (save) {
        return {
          status: 1,
          message: "You Liked this Service"
        }
      } else {
        return {
          status: 2,
          message: "Something Went wrong"
        }
      }
    } else {
      let likeData = await userLikeModel.findOne({
        $or: [{ "service.service_provider_services": body.package_id }], user: user._id
      })
      if (!likeData) {
        let likeData = await userLikeModel.findOneAndUpdate({ _id: data._id }, { $push: { user: user._id } }, { new: true }).lean();
        if (!likeData) {
          return {
            status: 2,
            message: "Unable to like Service"
          }
        }
      }
      return {
        status: 1,
        message: "You Liked this Service"
      }
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

exports.userUnlikeService = async (user, body) => {
  try {
    let dissLike = await userLikeModel.findOne(
      {
        $or: [{ "service.service_provider_services": body.service_id }],
        user: user._id
      }
    );
    if (dissLike) {
      let dislikeData = await userLikeModel.findOneAndUpdate({ _id: dissLike._id }, { $pull: { user: mongoose.Types.ObjectId(user._id) } }, { new: true }).lean();
      if (!dislikeData) {
        return {
          status: 2,
          message: "Unable to dislike Service"
        }
      }
      return {
        status: 1,
        message: "Removed from like",
      };
    } else {
      return {
        status: 2,
        message: "Like the service first to unlike it",
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

exports.filterAllProducts = async (user, body) => {
  try {
    let { main_cat_id, filter_rating, filter_price, cat_id } = body;
    // let skip = (page <= 1 || !page)?  0:(page-1)*10;
    let query = { product_main_cat: mongoose.Types.ObjectId(body.main_cat_id) }
    if (cat_id && cat_id != "") {
      query = { product_main_cat: mongoose.Types.ObjectId(body.main_cat_id), product_cat: mongoose.Types.ObjectId(cat_id) }
    }
    let data = await ProductCatModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "userCart",
          let: { 'productId': '$_id', 'userId': user._id, 'isDeleted': false, 'status': 0 },
          pipeline: [
            { $match: { $expr: { $and: [{ $or: [{ $eq: ['$product.seller_product', '$$productId'] }, { $eq: ['$product.admin_product', '$$productId'] }] }, { $eq: ['$user', '$$userId'] }, { $eq: ['$isDeleted', '$$isDeleted'] }, { $eq: ['$status', '$$status'] }] } } }
          ],
          as: "userCart"
        }
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "product_cat",
          foreignField: "_id",
          as: "product_cat"
        }
      },
      {
        $lookup: {
          from: "productmaincategories",
          localField: "product_main_cat",
          foreignField: "_id",
          as: "product_main_cat"
        }
      },
      {
        $lookup: {
          from: "productsubcategories",
          localField: "breed_type",
          foreignField: "_id",
          as: "breed_type"
        }
      },
      { $unwind: "$product_cat" },
      { $unwind: "$product_main_cat" },
      { $unwind: "$breed_type" },
      // {$skip:skip},
      // {$limit:10}
    ])

    let data1 = await UserWishlistModel.find({ user: user._id })
    let fav_arr = []
    let new_list = []
    for (let i = 0; i < data1.length; i++) {
      if (data1[i].product.seller_product) {
        fav_arr.push(data1[i].product.seller_product.toString());
      }
    }
    for (let k = 0; k < data.length; k++) {
      new_list.push(data[k]._id.toString());
    }
    for (let j = 0; j < new_list.length; j++) {
      if (data[j].userCart.length > 0) {
        data[j].isCartAdded = true
        data[j].cartId = data[j].userCart[0]._id;
        data[j].cartQuantity = data[j].userCart[0].quantity;
      } else {
        data[j].isCartAdded = false
        data[j].cartId = null;
        data[j].cartQuantity = 0;
      }
      if (fav_arr.length > 0 && fav_arr.includes(new_list[j])) {
        data[j].isfavorite = true
      } else {
        data[j].isfavorite = false
      }
      let allRatings = await OrderRatingModel.find({ $or: [{ "product.seller_product": new_list[j] }, { "product.admin_product": new_list[j] }] }, { uniqid: 0, product: 0, order_id: 0 }).lean();
      let avgRating = "0";
      if (allRatings.length > 0) {
        let sum = allRatings.reduce((accumulator, object) => {
          return accumulator + object.rating_point;
        }, 0);
        avgRating = (sum / allRatings.length);
      }
      data[j].rating = Math.round(avgRating * 10) / 10;;
      data[j].ratingCount = allRatings.length;

      let liked = await userLikeModel.findOne(
        {
          $or: [{ "product.seller_product": new_list[j] }, { "product.admin_product": new_list[j] }],
          user: user._id
        }
      );
      data[j].is_liked = liked ? 1 : 0;
    }

    if (Number(filter_rating) == 0) {
      data = _.filter(data, (item) => Number(item.rating) < 1);
    } else if (Number(filter_rating) == 1) {
      data = _.filter(data, (item) => ((Number(item.rating) >= 1) && (Number(item.rating) < 2)));
    } else if (Number(filter_rating) == 2) {
      data = _.filter(data, (item) => ((Number(item.rating) >= 2) && (Number(item.rating) < 3)));
    } else if (Number(filter_rating) == 3) {
      data = _.filter(data, (item) => ((Number(item.rating) >= 3) && (Number(item.rating) < 4)));
    } else if ((Number(filter_rating) == 4) || (Number(filter_rating) == 5)) {
      data = _.filter(data, (item) => ((Number(item.rating) >= 4) && (Number(item.rating) <= 5)));
    } else {
      data = data;
    }

    if (filter_price && filter_price != "") {
      if (filter_price == -1) {
        data = _.orderBy(data, item => Number(item.selling_price), ['desc']);
      } else {
        data = _.orderBy(data, item => Number(item.selling_price), ['asc']);
      }
    }

    if (data) {
      return {
        status: 1,
        response: data,
        message: "Product filtered successfully"
      }
    } else {
      return {
        status: 2,
        message: "Not Found"
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.filterProducts = async (user, body) => {
  try {
    let data = await ProductCatModel.aggregate([
      { $match: { product_main_cat: mongoose.Types.ObjectId(body.main_cat_id), product_cat: mongoose.Types.ObjectId(body.cat_id) } },
      {
        $lookup: {
          from: "userCart",
          let: { 'productId': '$_id', 'userId': user._id },
          pipeline: [
            { $match: { $expr: { $and: [{ $or: [{ $eq: ['$product.seller_product', '$$productId'] }, { $eq: ['$product.admin_product', '$$productId'] }] }, { $eq: ['$user', '$$userId'] }] } } }
          ],
          as: "userCart"
        }
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "product_cat",
          foreignField: "_id",
          as: "product_cat"
        }
      },
      {
        $lookup: {
          from: "productmaincategories",
          localField: "product_main_cat",
          foreignField: "_id",
          as: "product_main_cat"
        }
      },
      {
        $lookup: {
          from: "productsubcategories",
          localField: "breed_type",
          foreignField: "_id",
          as: "breed_type"
        }
      },
      { $unwind: { path: "$product_cat", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$product_main_cat", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$breed_type", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          cartData: 0,
          hostCartData: 0
        }
      }
    ]);

    let fav_arr = []
    if (user) {
      let data1 = await UserWishlistModel.find({ user: user._id })
      for (let i = 0; i < data1.length; i++) {
        if (data1[i].product.seller_product) {
          fav_arr.push(data1[i].product.seller_product.toString());
        }
      }
    }

    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let incart = await UserCartModel.findOne({
          $and: [{
            user: mongoose.Types.ObjectId(user._id)
          }, {
            isDeleted: false
          }, {
            status: 0
          }],
          $or: [{
            "product.seller_product": data[i]._id
          }, {
            "product.admin_product": data[i]._id
          }]
        })
        data[i].isCartAdded = incart ? true : false;
        data[i].cartId = incart ? incart._id : null;
        data[i].cartQuantity = incart ? incart.quantity : 0;
        data[i].isfavorite = (fav_arr.length > 0 && fav_arr.includes(data[i]._id.toString())) ? true : false;
      }
    }

    if (body.filter_rating || body.filter_rating != "") {
      data = _.filter(data, (item) => Number(item.rating) >= Number(body.filter_rating));
    }
    if (body.filter_price || body.filter_price != "") {
      if (body.filter_price == -1) {
        data = _.orderBy(data, item => Number(item.selling_price), ['desc']);
      } else {
        data = _.orderBy(data, item => Number(item.selling_price), ['asc']);
      }
    }

    if (data) {
      return {
        status: 1,
        response: data,
        message: "Product Category Fetch"
      }
    } else {
      return {
        status: 2,
        message: "Not Found"
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};


exports.searchAllProducts = async (user, body) => {
  try {
    let { main_cat_id, name } = body;

    let data = await ProductCatModel.aggregate([
      { $match: { product_main_cat: mongoose.Types.ObjectId(main_cat_id), product_quantity: { $gt: 0 }, $expr: { $gt: ["$product_quantity", "$sku_min_limit"] }, product_name: { $regex: name, $options: 'i' } } },
      {
        $lookup: {
          from: "userCart",
          let: { 'productId': '$_id', 'userId': user._id, 'isDeleted': false, 'status': 0 },
          pipeline: [
            { $match: { $expr: { $and: [{ $or: [{ $eq: ['$product.seller_product', '$$productId'] }, { $eq: ['$product.admin_product', '$$productId'] }] }, { $eq: ['$user', '$$userId'] }, { $eq: ['$isDeleted', '$$isDeleted'] }, { $eq: ['$status', '$$status'] }] } } }
          ],
          as: "userCart"
        }
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "product_cat",
          foreignField: "_id",
          as: "product_cat"
        }
      },
      {
        $lookup: {
          from: "productmaincategories",
          localField: "product_main_cat",
          foreignField: "_id",
          as: "product_main_cat"
        }
      },
      {
        $lookup: {
          from: "productsubcategories",
          localField: "breed_type",
          foreignField: "_id",
          as: "breed_type"
        }
      },
      {
        $lookup: {
          from: "Seller",
          localField: "seller",
          foreignField: "_id",
          as: "seller"
        }
      },
      {
        $unwind: {
          path: "$product_cat",
          preserveNullAndEmptyArrays: true
        },
      },
      {
        $unwind: {
          path: "$seller",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$product_main_cat",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$breed_type",
          preserveNullAndEmptyArrays: true
        }
      }
    ])

    let data1 = await UserWishlistModel.find({ user: user._id })
    let fav_arr = []
    let new_list = []
    for (let i = 0; i < data1.length; i++) {
      if (data1[i].product.seller_product) {
        fav_arr.push(data1[i].product.seller_product.toString());
      }
    }
    for (let k = 0; k < data.length; k++) {
      new_list.push(data[k]._id.toString());
    }
    for (let j = 0; j < new_list.length; j++) {
      if (data[j].userCart.length > 0) {
        data[j].isCartAdded = true
        data[j].cartId = data[j].userCart[0]._id;
        data[j].cartQuantity = data[j].userCart[0].quantity;
      } else {
        data[j].isCartAdded = false
        data[j].cartId = null;
        data[j].cartQuantity = 0;
      }
      if (fav_arr.length > 0 && fav_arr.includes(new_list[j])) {
        data[j].isfavorite = true
      } else {
        data[j].isfavorite = false
      }
      let allRatings = await OrderRatingModel.find({ $or: [{ "product.seller_product": new_list[j] }, { "product.admin_product": new_list[j] }] }, { uniqid: 0, product: 0, order_id: 0 }).lean();
      let avgRating = "0.0";
      if (allRatings.length > 0) {
        let sum = allRatings.reduce((accumulator, object) => {
          return accumulator + object.rating_point;
        }, 0);
        avgRating = (sum / allRatings.length).toFixed(1);
      }
      data[j].rating = avgRating;
      data[j].ratingCount = allRatings.length;

      let liked = await userLikeModel.findOne(
        {
          $or: [{ "product.seller_product": new_list[j] }, { "product.admin_product": new_list[j] }],
          user: user._id
        }
      );
      data[j].is_liked = liked ? 1 : 0;
    }
    if (data) {
      return {
        status: 1,
        response: data,
        message: "Product Category Data"
      }
    } else {
      return {
        status: 2,
        message: "Not Found"
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.searchPackageList = async (body) => {
  try {
    let { name } = body
    let packageList = await HostPackageModel.find({ package_name: { $regex: name, $options: 'i' } })
      .populate('host', "first_name last_name country_code mobile_number email profile_pic location")
      .populate('breed', 'subCategoryName')
      .lean()
      .sort({ createdAt: -1 })

    if (!packageList) {
      return {
        status: 0,
        message: "No list found"
      }
    } else {
      if (packageList.length > 0) {
        for (let i = 0; i < packageList.length; i++) {
          let address = await HostAddressModel.findOne({ host: mongoose.Types.ObjectId(packageList[i].host._id), primaryAddress: true }).lean();
          packageList[i]['address'] = address ? address : null

          let allRatings = await PackageOrderRatingModel.find({ package_id: mongoose.Types.ObjectId(packageList[i]._id) }, { rating_point: 1, review: 1, created_at: 1 }).lean();
          let avgRating = "0.0";
          if (allRatings.length > 0) {
            let sum = allRatings.reduce((accumulator, object) => {
              return accumulator + object.rating_point;
            }, 0);
            avgRating = (sum / allRatings.length).toFixed(1);
          }
          packageList[i].avgRating = avgRating;
          packageList[i].ratingCount = allRatings.length;
        }
      }

      return {
        status: 1,
        message: "Package list fetch successfully",
        response: packageList
      }
    }
  } catch (error) {
    throw new Error(error.message)
  }
};

exports.searchServiceProviderServicesList = async (data) => {
  try {
    let { name } = data;

    let serviceProvider = await ServiceProviderModel.find({ $or: [{ first_name: { $regex: name, $options: 'i' } }, { last_name: { $regex: name, $options: 'i' } }] }).select('_id').lean();
    let ids = [];
    let services = [];
    if (serviceProvider.length > 0) {
      serviceProvider.map(e => ids.push(e._id))
    }
    if (ids.length > 0) {
      services = await ServiceProviderServicesModel.find({ serviceProvider: { $in: ids } })
        .populate('serviceProvider', 'first_name last_name country_code mobile_number email profile_pic location').lean();

      if (services.length > 0) {
        for (let i = 0; i < services.length; i++) {
          let allRatings = await ServiceOrderRatingModel.find({ service_id: services[i]._id }).lean();
          let avgRating = "0.0";
          if (allRatings.length > 0) {
            let sum = allRatings.reduce((accumulator, object) => {
              return accumulator + object.rating_point;
            }, 0);
            avgRating = (sum / allRatings.length).toFixed(1);

          }
          services[i].avgRating = avgRating;
        }
      }
    }

    let dataToSend = {
      allServices: services
    }

    return { response: dataToSend, message: "All services fetched successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};


exports.searchProductGlobally = async (body) => {
  try {
    let { name } = body;

    let data = await ProductCatModel.aggregate([
      { $match: { product_quantity: { $gt: 0 }, $expr: { $gt: ["$product_quantity", "$sku_min_limit"] }, product_name: { $regex: name, $options: 'i' } } },
      {
        $lookup: {
          from: "userCart",
          let: { 'productId': '$_id', 'isDeleted': false, 'status': 0 },
          pipeline: [
            { $match: { $expr: { $and: [{ $or: [{ $eq: ['$product.seller_product', '$$productId'] }, { $eq: ['$product.admin_product', '$$productId'] }] }, { $eq: ['$isDeleted', '$$isDeleted'] }, { $eq: ['$status', '$$status'] }] } } }
          ],
          as: "userCart"
        }
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "product_cat",
          foreignField: "_id",
          as: "product_cat"
        }
      },
      {
        $lookup: {
          from: "productmaincategories",
          localField: "product_main_cat",
          foreignField: "_id",
          as: "product_main_cat"
        }
      },
      {
        $lookup: {
          from: "productsubcategories",
          localField: "breed_type",
          foreignField: "_id",
          as: "breed_type"
        }
      },
      {
        $lookup: {
          from: "Seller",
          localField: "seller",
          foreignField: "_id",
          as: "seller"
        }
      },
      {
        $unwind: {
          path: "$product_cat",
          preserveNullAndEmptyArrays: true
        },
      },
      {
        $unwind: {
          path: "$seller",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$product_main_cat",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$breed_type",
          preserveNullAndEmptyArrays: true
        }
      },
    ])
    let new_list = [];
    if (data.length > 0) {
      for (let k = 0; k < data.length; k++) {
        new_list.push(data[k]._id.toString());
      }
      for (let j = 0; j < new_list.length; j++) {
        data[j].isCartAdded = false
        data[j].cartId = null;
        data[j].cartQuantity = 0;
        data[j].isfavorite = false
        data[j].rating = "0.0";
        data[j].ratingCount = 0;
        data[j].is_liked = 0;
      }
    }
    if (data) {
      return {
        status: 1,
        response: data,
        message: "Product searched successfully"
      }
    } else {
      return {
        status: 2,
        message: "Not Found"
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.topupWallet = async (user, body) => {
  try {
    let { amount, payment_option, token } = body;
    if (!amount || amount == "")
      return { status: 0, message: "Amount is required" };
    if (!payment_option || payment_option == "")
      return { status: 0, message: "Payment option is required" };
    if (!token || token == "")
      return { status: 0, message: "Token is required" };

    if (payment_option == "KUSHKI") {
      let userAddress = await UserAddressModel.findOne({ user: user._id });
      let transactionId = generateUniqueId({ length: 7, useLetters: true }).toUpperCase();

      let productDetail = [{
        id: "1",
        title: "Wallet_topup",
        price: (Number(amount) * 1000),
        sku: "1",
        quantity: 1
      }];

      /* code for payment gateway start */
      // const dataParams = {
      //   "card": {
      //     "name": "Susheel Kumar",
      //     "number": "4285810016818288",
      //     "expiryMonth": "07",
      //     "expiryYear": "26",
      //     "cvv": "072"
      //   },
      //   "totalAmount": Number(amount),
      //   "currency": "PEN"
      // }

      // const response = await axios({
      //   method: 'post',
      //   url: 'https://api-uat.kushkipagos.com/card/v1/tokens',
      //   data: dataParams,
      //   headers: {'Public-Merchant-Id': '8a5891f55c264eeebbb979cf1951f3d9', 'Content-Type':  'application/json', }
      // });

      // let resp = response.data;
      // console.log(resp);
      // var localtoken = null;
      // if(resp){
      //   localtoken = resp.token
      var options = {
        method: 'POST',
        headers: {
          'Private-Merchant-Id': 'b04cf9ad305849da85dbcdd222e2d717', // Replace with your Private merchant id //'ebdd6461bdd148bc8b556ccbda5cd450'
          'Content-Type': 'application/json'
        },
        url: 'https://api.kushkipagos.com/card/v1/charges', // Test environment
        body: {
          // token: "V0OzRB100000xhxQB8035251pHLBQsq5", // Replace with the token you recieved
          token: token,
          // token: localtoken,
          amount: {
            subtotalIva: 0,
            subtotalIva0: Number(amount),
            ice: 0,
            iva: 0,
            currency: "PEN"
          },
          metadata: {
            bookingID: transactionId
          },
          contactDetails: {
            // documentType: "DNI",
            // documentNumber: "1009283738",
            email: user.email ? user.email : "petsworld@gmail.com",
            firstName: user.full_name,
            lastName: user.full_name,
            phoneNumber: user.country_code + user.mobile_number
          },
          orderDetails: {
            siteDomain: "petsworld.pet",
            shippingDetails: {
              name: user.full_name,
              phone: user.country_code + user.mobile_number,
              address: userAddress ? (userAddress.house_no + "," + userAddress.street) : "",
              city: userAddress ? userAddress.city : "",
              region: userAddress ? userAddress.city : "",
              country: userAddress ? userAddress.country : "",
              zipCode: userAddress ? userAddress.postal_code : ""
            },
            billingDetails: {
              name: user.full_name,
              phone: user.country_code + user.mobile_number,
              address: userAddress ? (userAddress.house_no + "," + userAddress.street) : "",
              city: userAddress ? userAddress.city : "",
              region: userAddress ? userAddress.city : "",
              country: userAddress ? userAddress.country : "",
              zipCode: userAddress ? userAddress.postal_code : ""
            }
          },
          productDetails: {
            product: productDetail
          },
          fullResponse: "v2"
        },
        json: true
      };
      let respData = await doRequest(options);
      if (respData.details && respData.details.transactionStatus == 'APPROVAL') {
        var userWallet = await UserWalletModel.findOne({ user: mongoose.Types.ObjectId(user._id) }, { wallet_amount: 1 }).lean();

        if (userWallet && (userWallet.wallet_amount >= 0)) {
          let latestWalletAmount = (Number(userWallet.wallet_amount) + (Number(amount)))
          let dataToUpdateWallet = {
            transaction_type: 1,
            wallet_amount: latestWalletAmount,
            modified_at: new Date().getTime()
          }
          var updateWallet = await UserWalletModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userWallet._id) }, { $set: dataToUpdateWallet }, { new: true }).lean();
        } else {
          let latestWalletAmount = (Number(amount))
          let dataToUpdateWallet = {
            user: user._id,
            transaction_type: 1,
            wallet_amount: latestWalletAmount,
            created_at: new Date().getTime(),
            modified_at: new Date().getTime()
          }
          let myWalletData = new UserWalletModel(dataToUpdateWallet);
          let savewallet = await myWalletData.save();
        }
        let dataToSaveWallet = {
          user: user._id,
          transaction_id: transactionId,
          transaction_type: 1,
          transaction_amount: (Number(amount)),
          booking_type: 4,
          transaction_at: new Date().getTime()
        };

        let myData = new UserWalletTransactionModel(dataToSaveWallet);
        let save = await myData.save();

        return {
          status: 1,
          message: "Top-up done successfully"
        }
      } else {
        return { message: "Booking has been failed, please try again", status: 0, response: { request: options, response: respData, hostDetails: userAddress } };
      }
    } else {
      return { message: "Please choose payment option to proceed with topup", status: 0, response: {} };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.loginWithSocialAccount = async (data) => {
  if (!data.social_id || data.social_id == '') {
    return {
      status: -1,
      message: "Login failed"
    };
  }
  let isLogin = await UserModel.findOne({
    social_id: data.social_id
  }).lean();
  let access_token = authentication.generateToken();
  if (!isLogin) {
    let details = {
      full_name: data.full_name,
      email: data.email,
      device_token: data.device_token,
      device_type: data.device_type,
      social_id: data.social_id,
      social_type: data.social_type,
      is_user_verified: true,
      access_token: access_token
    };

    let saveFirstInfo = await UserModel.create(details);
    let result = await saveFirstInfo.save();

    if (result) {
      let update = await UserModel.findOneAndUpdate(
        { _id: result._id },
        { $set: { access_token: access_token } },
        { new: true }
      );
      if (update) {
        return {
          message: "Created",
          status: 1,
          response: update,
        };
      } else {
        return {
          message: "Not created",
          status: 2,
        };
      }
    }
  }
  data.is_user_verified = true;
  data.access_token = access_token;
  let updateUser = await UserModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(isLogin._id) }, data, { new: true });
  return {
    status: 1,
    response: updateUser,
    message: "User found"
  };

}


exports.getRedeemTransactions = async (user) => {
  try {

    var userRedeemPoint = await UserRedeemPointModel.findOne({ user: mongoose.Types.ObjectId(user._id) }).lean();
    var redeemPointTransactions = await UserRedeemPointTransactionModel.find({ user: mongoose.Types.ObjectId(user._id) }, { user_cart_booking: 0 }).sort({ transaction_at: -1 }).lean();

    let dataToSend = {
      redeemPointTransactions: redeemPointTransactions,
      redeemPoint: userRedeemPoint ? userRedeemPoint.redeem_point : 0
    }

    return { message: "Redeem transaction list fetched successfully", status: 1, response: dataToSend };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.redeemPoint = async (user, data) => {
  try {
    let { amount } = data;
    if (!amount || amount == "")
      return { status: 0, message: "Amount is required" };

    var userRedeemPoint = await UserRedeemPointModel.findOne({ user: mongoose.Types.ObjectId(user._id) }).lean();
    if (!userRedeemPoint || (Number(userRedeemPoint.redeem_point) == 0)) {
      return {
        status: 0,
        message: "You have not sufficient point to redeem"
      }
    }
    let usagePurchaseLimit = await UsageLimitPurchaseModel.findOne({}, { usage_limit_purchase: 1 }).lean();
    let userPayableAmount = ((Number(usagePurchaseLimit.usage_limit_purchase) * (Number(userRedeemPoint.redeem_point))) / 100)

    if (Number(amount) >= Number(userPayableAmount)) {
      return {
        status: 0,
        message: "You can not redeem amount more than " + (userPayableAmount.toFixed(1))
      }
    } else {
      let latestRedeemAmount = (Number(userRedeemPoint.redeem_point) - (Number(amount)))
      let dataToUpdateRedeem = {
        redeem_type: 2,
        redeem_point: Number(latestRedeemAmount),
        modified_at: new Date().getTime()
      }
      var updateRedeem = await UserRedeemPointModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userRedeemPoint._id) }, { $set: dataToUpdateRedeem }, { new: true }).lean();

      let dataToSaveWallet = {
        user: user._id,
        transaction_id: generateUniqueId({ length: 7, useLetters: true }).toUpperCase(),
        transaction_type: 2,
        redeem_amount: Number(amount),
        booking_type: 1,
        transaction_at: new Date().getTime()
      };

      let myData = new UserRedeemPointTransactionModel(dataToSaveWallet);
      let save = await myData.save();

      let dataToSend = {
        redeemedAmount: amount
      }

      return { message: "Amount redeemed successfully", status: 1, response: dataToSend };
    }


  } catch (err) {
    throw new Error(err.message);
  }
};

exports.deleteAccount = async (user) => {
  try {

    var deleteUser = await UserModel.findOneAndDelete({ _id: mongoose.Types.ObjectId(user._id) }).lean();

    return { message: "Account deleted successfully", status: 1 };

  } catch (err) {
    throw new Error(err.message);
  }
};

exports.calculateServiceCharge = async (user, data) => {
  try {
    let { amount } = data;
    if (!amount || amount == "")
      return { status: 0, message: "Amount is required" };

    let serviceChargeAmount = 0;
    let serviceCharge = await ServiceChargeModel.findOne({}).lean();
    if (serviceCharge) {
      let discountAmount = (serviceCharge.service_charge * Number(amount)) / 100;
      serviceChargeAmount = (Math.round(discountAmount * 100) / 100).toFixed(2);
      let remainingAmount = Number(amount) + Number(discountAmount);
      amount = (Math.round(remainingAmount * 100) / 100).toFixed(2);
    } else {
      serviceChargeAmount = serviceChargeAmount,
        amount = amount
    }

    let dataToSave = {
      serviceChargeAmount: serviceChargeAmount,
      finalAmount: amount,
      serviceChargePercent: serviceCharge ? serviceCharge.service_charge : 0
    }
    return { message: "Account deleted successfully", status: 1, response: dataToSave };

  } catch (err) {
    throw new Error(err.message);
  }
};

exports.calculateDeliveryCharge = async (user, data) => {
  try {
    let { cartIds, addressId } = data;
    if (!cartIds || cartIds.length == 0)
      return { status: 0, message: "Cart id is required" };
    if (!addressId || addressId == "")
      return { status: 0, message: "Address id is required" };

    let deliveryCharge = await sendTrackingToCobox(user, addressId, cartIds);
    // console.log(deliveryCharge)

    let dataToSend = {
      deliveryCharge
    }
    return { message: "All delivery details fetched successfully", status: 1, response: dataToSend };

  } catch (err) {
    throw new Error(err.message);
  }
};


exports.sendOtpToVerifyMobileNumber = async (user, body) => {
  try {
    // console.log(user)
    // const checkExist = await UserModel.findOne(user._id);
    let { country_code, mobile_number } = body;
    let checkExist = await UserModel.findOne({ _id: user._id }).lean();

    if (!checkExist) {
      return {
        message: "User does not exist",
        status: -1,
      };
    }
    // let otpInfo = 1234;
    console.log(checkExist)
    checkExist.mobile_number = mobile_number;
    checkExist.country_code = country_code;
    let send_otp = await sendOtp(checkExist);
    let update = await UserModel.findOneAndUpdate(
      { _id: user._id },
      { $set: { otp_info: send_otp.data.otp_info, country_code: country_code, mobile_number: mobile_number } },
      { new: true }
    );

    return {
      message: "OTP resent",
      status: 1,
      // data: otpInfo,
      data: send_otp.data.otp_info
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

exports.verifyMobileNumber = async (data, user) => {
  try {

    let { otp } = data;
    let userData1 = await UserModel.findById(user._id);
    if (!userData1) throw new Error("No User found");

    // if (data.otp_info === user.otp_info || data.otp_info === "1234") {
    if (otp == user.otp_info) {
      let update = await UserModel.findOneAndUpdate(
        { _id: user._id },
        { otp_info: "", is_mobile_verified: true },
        {
          new: true,
        }
      );
      if (update) {
        return {
          message: "OTP verified",
          status: 1,
        };
      }
    } else {
      return {
        message: "Invalid Otp",
        status: 2,
      };
    }
  } catch (error) {
    throw new Error(error);
  }
};
