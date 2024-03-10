const { HostModel } = require("../models/hostModel");

const bcrypt = require("bcrypt");
const authentication = require("../middlewares/authentication");
const config = require("../config/config");
const mongoose = require("mongoose");
const { msg } = require("../modules/messages");
const Joi = require("joi");
const _ = require("lodash");
const utils = require("../modules/utils");
const generateUniqueId = require("generate-unique-id");

const { HostProfileModel } = require("../models/hostProfileModel");
const {
  productMainCategoryAdminModel,
} = require("../models/productMainCategoryModel");
const {
  productCategoryAdminModel,
} = require("../models/productCategoryAdminModel");
const { ProductCatModel } = require("../models/sellerProductModel");
const { HostCartModel } = require("../models/hostCartModel");
const { HostWishlistModel } = require("../models/hostWishlistModel");
const { HostAddressModel } = require("../models/hostAddressModel");
const { PromocodeModel } = require("../models/promocodeModel");
const { HostOrderModel } = require("../models/hostOrderModel");
const { HostOrderBookingModel } = require("../models/hostOrderBookingModel");
const { AdminModel } = require("../models/adminModel");
const { NotificationModel } = require("../models/notificationModel");
const { TrackingDeviceModel } = require("../models/trackingDeviceModal");
const { OrderRatingModel } = require("../models/orderRatingModel");
const { AdvertisementModel } = require("../models/AdvertisementModel");
const { ServiceCategoryModel } = require("../models/serviceCategoryModel");
const { ServiceProviderModel } = require("../models/servicesModel");
const {
  ServiceProviderServicesModel,
} = require("../models/servicesProviderServicesModel");
const {
  HostServiceBookingModel,
} = require("../models/hostServiceBookingModel");
const { SellerModel } = require("../models/sellerModel");
const {
  ServiceOrderRatingModel,
} = require("../models/serviceOrderRatingModel");
const { HostPackageModel } = require("../models/hostPackageModel");
const {
  productSubCategoryAdminModel,
} = require("../models/productSubCategoryAdminModel");
const { PackageBookingModel } = require("../models/packageBookingModel");
const { response } = require("express");
const { CommissionModel } = require("../models/commissionModel");
const { HostSettingModel } = require("../models/hostSettingModel");
const { HostFaqModel } = require("../models/hostFaqModel");
const { join } = require("lodash");
const { userLikeModel } = require("../models/likeModel");
const { PackageOrderRatingModel } = require("../models/packageOrderRatingModel");
const { UserCartModel } = require("../models/userCartModel");
const { ServiceChargeModel } = require("../models/serviceChargeModel");

var request = require("request");
const axios = require('axios');

let sendOtp = async (HostData) => {
  try {
    let otp = await utils.randomStringGenerator();
    let otpExpTime = new Date(Date.now() + config.defaultOTPExpireTime);
    HostData.otp_info = {
      otp: otp,
      expTime: otpExpTime,
    };

    let mobileNumber = HostData.country_code + HostData.mobile_number;
    //Send message via Twillio
    let send = await utils.sendotp(HostData.otp_info.otp, mobileNumber);
    return {
      status: 1,
      message: "OTP sent Successfully",
      data: HostData,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

let sendCartNotification = async (user, sellerIds) => {
  try {
    
      /* Code for notification start */
      let title = "Order Placed";
      let Notificationbody =
        "Your order has been placed successfully";
      let device_type = user.device_type;
      let notification = {
        uniqe_id: {
          host_id: user._id,
        },
        title: title,
        body: Notificationbody,
        notification_type: 1,
        type: 2,
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
      if (user.device_token) {
        utils.sendPushNotification(
          user.device_token,
          device_type,
          payload,
          notify
        );
      }

      /* Code for notification start to Seller */
      if (sellerIds.length > 0) {
        for (let j = 0; j < sellerIds.length; j++) {
          let sellerId = sellerIds[j];
          let device_token = "";
          let device_type = 1;
          let sellerData = await SellerModel.findOne(
            { _id: mongoose.Types.ObjectId(sellerIds[j]) },
            { device_token: 1, device_type: 1 }
          ).lean();
          if (!sellerData) {
            let adminData = await AdminModel.findOne(
              {},
              { email: 1, _id: 1 }
            );
            device_token = adminData.deviceToken;
            device_type = adminData.deviceType;
          } else {
            device_token = sellerData.device_token;
            device_type = sellerData.device_type;
          }
          let sellerTitle = "Order Placed";
          let sellerNotiBody =
            "New order has been placed by " +
            user.first_name +
            " " +
            user.last_name;

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
            created_at: new Date().getTime(),
          };
          let sendNoti = await NotificationModel.create(sellerNotification);
          sendNoti.save();

          let sellerPayload = {
            title: sellerTitle,
            body: sellerNotiBody,
            noti_type: 1,
          };
          let sellerNotify = {
            title: sellerTitle,
            body: sellerNotiBody,
            color: "#f95b2c",
            sound: true,
          };
          if (device_token) {
            utils.sendPushNotification(
              device_token,
              device_type,
              sellerPayload,
              sellerNotify
            );
          }
        }
      }

      /* Code for notification end to Seller */

      /* Code for notification start to Admin */
      let admin = await AdminModel.findOne({}, { email: 1, _id: 1 });
      let adminTitle = "Order Placed";
      let NotiBody =
        "New order has been placed by " +
        user.first_name +
        " " +
        user.last_name;

      let adminNotification = {
        uniqe_id: {
          admin_id: admin._id,
        },
        title: adminTitle,
        body: NotiBody,
        notification_type: 1,
        type: 5,
        created_at: new Date().getTime(),
      };
      let send_noti = await NotificationModel.create(adminNotification);
      send_noti.save();
      /* Code for notification end */

    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};

let sendNotificationToSeller = async (productIds) => {
  try{
    if(productIds.length > 0){
      for(let i=0; i < productIds.length; i++){
        let product = await ProductCatModel.findOne({ _id: productIds[i] },{ product_quantity: 1, product_name: 1, seller:1 }).lean();
        if(product){
          let userOrderList = await UserCartModel.find({ "product.seller_product": mongoose.Types.ObjectId(productIds[i]), isDeleted: false , $or: [{status: 1},{status: 3},{status: 4},{status: 5},{status: 6},{status: 7}] },{ quantity: 1 }).lean();
            let usersold = userOrderList.reduce((accumulator, object) => {
              return accumulator + object.quantity;
            }, 0);
            let hostOrderList = await HostCartModel.find({ "product.seller_product": mongoose.Types.ObjectId(productIds[i]), isDeleted: false , $or: [{status: 1},{status: 3},{status: 4},{status: 5},{status: 6},{status: 7}] },{ quantity: 1 }).lean();
            let hostsold = hostOrderList.reduce((accumulator, object) => {
              return accumulator + object.quantity;
            }, 0);
            let totalSell = Number(usersold) + Number(hostsold)
            // console.log(totalSell)
          if(Number(totalSell) >= Number(product.product_quantity)){
            let seller = await SellerModel.findOne({ _id: mongoose.Types.ObjectId(product.seller) },{ _id: 1, device_token: 1 ,device_type: 1 }).lean();
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

let sendServiceBookingNotification = async (host, service_id) => {
  try {
      /* Code for notification start */
      let title = "Order done";
      let Notificationbody = "Thanks for placing service order";
      let device_type = host.device_type;
      let notification = {
        uniqe_id: {
          user_id: host._id,
          host_id: host._id,
        },
        title: title,
        body: Notificationbody,
        notification_type: 8,
        type: 1,
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
      if (host.device_token) {
        utils.sendPushNotification(
          host.device_token,
          device_type,
          payload,
          notify
        );
      }
      /* Code for notification end */
      /* Code for notification start to Seller */
      let provider = await ServiceProviderServicesModel.findOne(
        { _id: mongoose.Types.ObjectId(service_id) },
        { serviceProvider: 1 }
      )
        .populate("serviceProvider", "device_type device_token")
        .lean();
      let device_token = provider ? provider.serviceProvider.device_token : "";
      let seller_device_type = provider
        ? provider.serviceProvider.device_type
        : "";
      let sellerTitle = "Order Placed";
      let sellerNotiBody =
        "New order has been placed by " +
        host.first_name +
        " " +
        host.last_name;
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
          created_at: new Date().getTime(),
        };
        let sendNoti = await NotificationModel.create(sellerNotification);
        sendNoti.save();
      }

      let sellerPayload = {
        title: sellerTitle,
        body: sellerNotiBody,
        noti_type: 1,
      };
      let sellerNotify = {
        title: sellerTitle,
        body: sellerNotiBody,
        color: "#f95b2c",
        sound: true,
      };
      if (device_token) {
        utils.sendPushNotification(
          device_token,
          seller_device_type,
          sellerPayload,
          sellerNotify
        );
      }
      /* Code for notification end to Seller */

      /* Code for notification start to Admin */
      let admin = await AdminModel.findOne({}, { email: 1, _id: 1 });
      let adminTitle = "Order Placed";
      let NotiBody =
        "New order has been placed by " +
        host.first_name +
        " " +
        host.last_name;

      let adminNotification = {
        uniqe_id: {
          admin_id: admin._id,
        },
        title: adminTitle,
        body: NotiBody,
        notification_type: 1,
        type: 5,
        created_at: new Date().getTime(),
      };
      let send_noti = await NotificationModel.create(adminNotification);
      send_noti.save();
      /* Code for notification end */

    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.uploadFile = async (req) => {
  try {
    let file = req.files;
    if (file && file.images) {
      let images = file.images;
      let images1 = [];
      for (let index = 0; index < images.length; index++) {
        images1[index] = images[index].location;
      }
      return {
        data: { images: images1 },
        message: "Success",
        status: 1,
      };
    } else {
      return {
        data: {},
        message: "Unable to upload Image",
        status: 0,
      };
    }
    console.log(file);
    return {
      status: 1,
      message: "Success",
      data: file,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.registerHost = async (req) => {
  try {
    let data = req.body;
    if (!data.term_condition) {
      return {
        status: 0,
        message: "Please check Term And Condition",
      };
    }

    let isUserExist = await HostModel.findOne({
      $or: [
        { mobile_number: data.mobile_number, country_code: data.country_code },
        { email: data.email },
      ],
    }).lean();
    var result = null;
    if(!isUserExist){
      let res = new HostModel();

      let pass = await bcrypt.hash(data.password, 10);
  
      res.first_name = data.first_name;
      res.last_name = data.last_name;
      res.email = data.email;
      res.country_code = data.country_code;
      res.mobile_number = data.mobile_number;
      res.password = pass;
      res.device_token = data.device_token;
      res.device_type = data.device_type;
      res.otp_info = {
        otp: "123456",
        expTime: new Date().getTime(), //otp expiry time
      };
      res.location = {
        coordinates: [data.latitude, data.longitude],
      };
      res.latitude = data.latitude;
      res.longitude = data.longitude;
      res.access_token = authentication.generateToken();
  
      let resOtp = await sendOtp(res);
      res.otp_info = resOtp.data.otp_info;
  
      result = await res.save();
      if (!result || (result == null)) {
        return {
          status: 0,
          message: "Data saved Failed",
        };
      }
    }else if (isUserExist && (isUserExist.is_otp_verified == true)) {
      return {
        status: 0,
        message: "User Already Exist",
      };
    }else{
      result = await HostModel.findOneAndUpdate({ _id: isUserExist._id },{ access_token : authentication.generateToken() },{ new: true }).lean();
    }

   

    let dataToSend = {
      first_name: result ? result.first_name : "",
      last_name: result ? result.last_name : "",
      email: result ? result.email : "",
      country_code: result ? result.country_code : "",
      mobile_number: result ? result.mobile_number : "",
      device_token: result ? result.device_token : "",
      device_type: result ? result.device_type : "",
      access_token: result ? result.access_token : "",
      location: result ? result.location : "",
    };
    return {
      status: 1,
      message: "Register Successfully",
      data: dataToSend,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.verifyOtp = async (req) => {
  try {
    let { otp } = req.body;
    let userData = req.userData;
    if (!userData.otp_info.otp) {
      return {
        status: 0,
        message: "Otp has been Expired",
      };
    }
    if (userData.otp_info.otp != otp) {
      return {
        status: 0,
        message: "Please Enter Valid Otp",
      };
    }

    userData.otp_info = {
      otp: null,
      expTime: Date.now()
    };
    userData.is_otp_verified = true;
    let res = await HostModel.findOneAndUpdate(
      {
        _id: userData._id,
      },
      userData,
      { new: true }
    );
    if (!res) {
      return {
        status: 0,
        message: "Query Failed",
      };
    }
    return {
      status: 1,
      message: "Otp Verified Successfully",
      data: {},
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.createHostProfile = async (req) => {
  try {
    let data = req.body;
    let userData = req.userData;

    let findProfile = await HostProfileModel.findById({
      _id: userData._id,
    }).lean();
    if (!findProfile) {
      findProfile = new HostProfileModel();
    }

    findProfile.host = userData._id;
    findProfile.documents = {
      idProof: data.idProof,
      shopLicense: data.shopLicense,
    };
    findProfile.bankDetails = {
      accountHolderName: data.accountHolderName,
      accountNumber: data.accountNumber,
      bankCard: data.bankCard,
    };
    findProfile.address = {
      streetAddress: data.streetAddress,
      apt_suite: data.apt_suite,
      city: data.city,
      country: data.country,
      zip: data.zip,
      latitude: data.latitude,
      longitude: data.longitude,
    };

    let result = await findProfile.save();
    if (!result) {
      return {
        status: 0,
        message: "Data saved Failed",
      };
    }

    return {
      status: 1,
      message: "Profile Created Successfully",
      data: result,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.login = async (req) => {
  try {
    let data = req.body;

    let token = authentication.generateToken();

    let findProfile = await HostModel.findOneAndUpdate(
      {
        mobile_number: data.mobile_number,
        country_code: data.country_code,
      },
      {
        $set: {
          access_token: token,
          device_token: data.device_token,
        },
      },
      { new: true }
    );
    if (!findProfile) {
      return {
        message: "User not Found",
        status: 0,
      };
    }
    if (findProfile.is_otp_verified == false) {
      return {
        message: "First Complete your profile",
        data: { token: findProfile.access_token, is_otp_verified: findProfile.is_otp_verified },
        status: 2,
      };
    }

    let comapir = await bcrypt.compare(data.password, findProfile.password);
    if (!comapir) {
      return {
        message: "Inavlid Login credentials",
        status: 0,
      };
    }

    let result = await HostProfileModel.findOne({
      host: findProfile._id,
    }).populate("host");
    if (!result) {
      return {
        message: "First Complete your profile",
        data: { token: findProfile.access_token },
        status: 2,
      };
    }
    return {
      message: "Login Successfully",
      data: result,
      status: 1,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.forgetPassword = async (req) => {
  try {
    let data = req.body;

    let token = authentication.generateToken();

    let host = await HostModel.findOne({
      $and: [{
        country_code: data.country_code
      }, {
        mobile_number: data.mobile_number  
      }]
    }).exec();
    if (!host) {
      return { status: 0, message: "Mobile number does not exist" };
    }

    let send_otp = await sendOtp(host);

    let findProfile = await HostModel.findOneAndUpdate(
      {
        mobile_number: data.mobile_number,
        country_code: data.country_code,
      },
      {
        $set: {
          access_token: token,
          // otp_info: {
          //   otp: "123456",
          // },
          otp_info: send_otp.data.otp_info
        },
      },
      {
        new: true,
        fields: {
          access_token: 1,
          _id: 1,
        },
      }
    );
    if (!findProfile) {
      return {
        message: "User not Found",
        status: 0,
      };
    }

    return {
      message: "Otp Send Successfully",
      data: findProfile,
      status: 1,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.createNewPassword = async (req) => {
  try {
    let data = req.body;
    let userData = req.userData;

    if (data.password != data.confirmPassword) {
      return {
        message: "Password and Confirm Password must be same",
        status: 0,
      };
    }

    let genPass = await bcrypt.hash(data.password, 10);

    let findProfile = await HostModel.findByIdAndUpdate(
      {
        _id: userData._id,
      },
      {
        $set: {
          password: genPass,
        },
      },
      {
        new: true,
        fields: {
          _id: 1,
        },
      }
    );
    if (!findProfile) {
      return {
        message: "User not Found",
        status: 0,
      };
    }

    return {
      message: "Password Reset Successfully",
      data: findProfile,
      status: 1,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.resendOtp = async (user) => {
  try {
    // console.log(user);
    let checkExist = await HostModel.findOne({ _id: user._id });
    if (!checkExist) {
      return {
        message: "Host does not exist",
        status: -1,
      };
    } else {
      let resOtp = await sendOtp(checkExist);
      checkExist.otp_info = resOtp.data.otp_info;
      // checkExist.otp_info = {
      //   otp: "123456",
      // };

      let result = await checkExist.save();
      if (!result) {
        return {
          message: "Failed",
          status: 0,
        };
      }

      return {
        message: "OTP Re-sent Successfully",
        status: 1,
        data: { result },
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

exports.logout = async (host) => {
  try {
    if (!host._id || host._id == "")
      return { status: 0, message: "Host does not exist" };

    let updatehostModel = await HostModel.findOneAndUpdate(
      { _id: host._id },
      { $set: { access_token: "" } },
      { new: true }
    );

    if (!updatehostModel) {
      return { status: 0, message: "Something went Wrong" };
    }
    return { status: 1, message: "Logout successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.editProfile = async (host, data) => {
  try {
    let result = await HostModel.findByIdAndUpdate(
      { _id: host._id },
      {
        $set: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          profile_pic: data.profile_pic,
          latitude: data.latitude,
          longitude: data.longitude
        },
      },
      {
        new: true,
      }
    );
    if (!result) {
      return { status: 0, message: "Something went Wrong" };
    }
    return { status: 1, message: "Success", data: result };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.changePassword = async (host, data) => {
  try {
    let compare = await bcrypt.compare(data.old_password, host.password);
    if (!compare) {
      return {
        status: 0,
        message: "Current Password is not match",
      };
    }

    if (data.old_password == data.password) {
      return {
        status: 0,
        message: "Password must be different",
      };
    }

    let pass = await bcrypt.hash(data.password, 10);

    let result = await HostModel.findByIdAndUpdate(
      { _id: host._id },
      {
        $set: {
          password: pass,
        },
      },
      {
        new: true,
      }
    );
    if (!result) {
      return { status: 0, message: "Something went Wrong" };
    }
    return { status: 1, message: "Password change Successfully", data: result };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getProfile = async (host, data) => {
  try {
    let hostProfile = await HostModel.findById({ _id: host._id });
    if (hostProfile) {
      return {
        status: 1,
        response: hostProfile,
        message: "Profile Details fetch",
      };
    } else {
      return {
        status: 2,
        message: "Not Found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getMainProductCat = async (host) => {
  try {
    let userProfile = await productMainCategoryAdminModel.find({ showHost: true }).lean();
    if (userProfile) {
      return {
        status: 1,
        response: userProfile,
        message: "Main Product List fetch",
      };
    } else {
      return {
        status: 2,
        message: "Not Found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getProductCategory = async (host) => {
  try {
    let data = await productCategoryAdminModel.find({}).lean();
    if (data) {
      return {
        status: 1,
        response: data,
        message: "Product Category Fetch",
      };
    } else {
      return {
        status: 2,
        message: "Not Found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getProducts = async (host, body) => {
  try {
    // console.log(user);
    // let data = await ProductCatModel.find({
    //   $and: [
    //     { product_main_cat: body.main_cat_id },
    //     { product_cat: body.cat_id }
    //   ]
    // },{hostCartData:0,cartData:0})
    //   .populate('product_cat')
    //   .populate('product_main_cat')
    //   .populate('breed_type').lean();

    // .populate({
    //   path: 'hostCartData',
    //   match: {
    //     host: host._id
    //   },
    //   select: "_id quantity"
    // })
    // .lean();

    let data = await ProductCatModel.aggregate([
      {
        $match: {
          product_main_cat: mongoose.Types.ObjectId(body.main_cat_id),
          product_cat: mongoose.Types.ObjectId(body.cat_id),
          product_quantity: { $gt :0 }, $expr: {$gt: ["$product_quantity", "$sku_min_limit"]}
        },
      },
      {
        $lookup: {
          from: "hostCart",
          let: { productId: "$_id", hostId: host._id },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $or: [
                        { $eq: ["$product.seller_product", "$$productId"] },
                        { $eq: ["$product.admin_product", "$$productId"] },
                      ],
                    },
                    { $eq: ["$host", "$$hostId"] },
                  ],
                },
              },
            },
          ],
          as: "hostCart",
        },
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "product_cat",
          foreignField: "_id",
          as: "product_cat",
        },
      },
      {
        $lookup: {
          from: "productmaincategories",
          localField: "product_main_cat",
          foreignField: "_id",
          as: "product_main_cat",
        },
      },
      {
        $lookup: {
          from: "productsubcategories",
          localField: "breed_type",
          foreignField: "_id",
          as: "breed_type",
        },
      },
      {
        $lookup:{
          from:"Seller",
          localField:"seller",
          foreignField:"_id",
          as:"seller"
        }
      },
      // {$unwind:"$hostCart"},
      { $unwind: { path: "$product_cat", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },
      
      {
        $unwind: {
          path: "$product_main_cat",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $unwind: { path: "$breed_type", preserveNullAndEmptyArrays: true } },
      
      { $project: { hostCartData: 0, cartData: 0 } }, // Return all but the specified fields
    ]);

    let data1 = await HostWishlistModel.find({ host: host._id });
    let fav_arr = [];
    for (let i = 0; i < data1.length; i++) {
      if (data1[i].product.seller_product) {
        fav_arr.push(data1[i].product.seller_product.toString());
      }
    }
    // data.map((item) => {
    //   item.isCartAdded = item.hostCart[0] ? true : false;
    //   item.cartId = item.hostCart[0] ? item.hostCart[0]._id : null;
    //   item.cartQuantity = item.hostCart[0] ? item.hostCart[0].quantity : 0;
    //   item.isfavorite =
    //     fav_arr.length > 0 && fav_arr.includes(item._id.toString())
    //       ? true
    //       : false;
    // });

    if(data.length > 0){
      for(let i=0; i < data.length; i++){
        let incart = await HostCartModel.findOne({
          $and: [{
            host: mongoose.Types.ObjectId(host._id)
          }, {
            isDeleted: false
          }, {
               status :0
          }],
          $or:[{
            "product.seller_product": data[i]._id
          },{
            "product.admin_product": data[i]._id
          }]
        })
        data[i].isCartAdded = incart ? true: false;
        data[i].cartId = incart ? incart._id : null;
        data[i].cartQuantity = incart ? incart.quantity : 0;
        data[i].isfavorite = (fav_arr.length > 0 && fav_arr.includes(data[i]._id.toString())) ? true : false;
      }
    }
    if (data) {
      return {
        status: 1,
        response: data,
        message: "Product Category Fetch",
      };
    } else {
      return {
        status: 2,
        message: "Not Found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.addToCart = async (host, data) => {
  try {
    let product;
    product = await ProductCatModel.findOne({ _id: data.product_id }).lean();
    if (!product) {
      product = await TrackingDeviceModel.findOne({ _id: data.product_id });
    }
    if (!product) {
      return {
        status: 2,
        message: "Product Not Found",
      };
    }
    let skuLimit = product.sku_min_limit ? product.sku_min_limit : product.skuNumber;
    if(parseInt(skuLimit) >= parseInt(product.product_quantity)){
      return {
        status: -1,
        message: "Out Of Stock"
      }
    }
    if(parseInt(product.product_quantity) == 0){
      return {
        status: 2,
        message: "Item not available for purchase"
      }
    }

    let cartAllData = await HostCartModel.findOne(
      {
        $or: [
          { "product.seller_product": data.product_id },
          { "product.admin_product": data.product_id },
        ],
        host: host._id,
        isDeleted: false,
        status: 0,
      },
      { quantity: 1 }
    ).lean();
    if (cartAllData) {
      if (
        parseInt(cartAllData.quantity) >= parseInt(product.product_quantity)
      ) {
        return {
          status: -1,
          message: "Out of stock",
        };
      }
    }

    let cartData = await HostCartModel.findOne({
      $and: [
        {
          $or: [
            { "product.seller_product": data.product_id },
            { "product.admin_product": data.product_id },
          ],
          host: host._id,
          isDeleted: false,
          status: 0
        },
      ],
    });
    var saveToDb = {
      productMainCategoryId: data.productMainCategoryId,
      host: host._id,
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
    };
    let cart;
    if (!cartData) {
      cart = await HostCartModel.create(saveToDb);
      cart.save();

      if (!cart) {
        return {
          status: 2,
          message: "Unable to add product to cart",
        };
      }
    } else {
      // else if (cartData.colorId != data.colorId) {
      //   cart = await HostCartModel.create(saveToDb);
      //   cart.save();
      //   if (!cart) {
      //     return {
      //       status: 2,
      //       message: "Unable to add product to cart",
      //     };
      //   }
      // }

      cartData.quantity = cartData.quantity + parseInt(data.quantity);
      cartData.price = cartData.unitPrice * cartData.quantity;
      cartData.status = 0;
      cartData.weight = data.weight;
      cartData.size = data.size;
      cartData.colorId = data.colorId;

      cart = await HostCartModel.findByIdAndUpdate(
        cartData._id,
        { $set: cartData },
        { new: true }
      ).lean();
      // let cart = await cartData.save();
      if (!cart) {
        return {
          status: 2,
          message: "Something went Wrong, please try later",
        };
      }
    }
    return {
      status: 1,
      message: "Product added to cart successfully",
      response: cart,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getCartData = async (host) => {
  try {
    let cart = await HostCartModel.find({
      $and: [
        {
          host: mongoose.Types.ObjectId(host._id),
        },
        {
          isDeleted: false,
        },
        {
          status: 0,
        },
      ],
    })
      .populate(
        "product.seller_product",
        "product_name product_details product_quantity product_price selling_price product_discount product_decripton"
      )
      .populate(
        "product.admin_product",
        "product_name image product_quantity product_price selling_price product_discount product_decripton"
      )
      .lean();

    let serviceCharge = await ServiceChargeModel.findOne({}).lean();

    var cartValues = {
      cartValue: 0,
      deliveryCharge: 10,
      serviceCharge: 0,
      serviceChargePercent: serviceCharge ? serviceCharge.service_charge: 0,
      discount: 0,
      totalPayable: 0,
    };
    if (cart.length > 0) {
      let cartUpdate = await _.map(cart, (element) => {
        cartValues.cartValue = cartValues.cartValue + element.price;
        cartValues.totalPayable = cartValues.totalPayable + element.price;
      });
      if(serviceCharge){
        let discountAmount = (serviceCharge.service_charge * Number(cartValues.totalPayable)) / 100;
        cartValues.serviceCharge = (Math.round(discountAmount * 100) / 100).toFixed(2);
        let remainingAmount = Number(cartValues.totalPayable) + Number(discountAmount);
        cartValues.totalPayable = (Math.round(remainingAmount * 100) / 100).toFixed(2);
      }
    }
    cartValues.totalPayable = (Number(cartValues.totalPayable) + Number(cartValues.deliveryCharge))

    if (cart) {
      return {
        status: 1,
        response: cart,
        message: "Success",
        cartValues: cartValues,
      };
    } else {
      return {
        status: 2,
        message: "Not Found",
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

exports.addToWishlist = async (host, body) => {
  try {
    let findhost;
    findhost = await ProductCatModel.findOne({ _id: body.product_id }).lean();
    if (!findhost) {
      findhost = await TrackingDeviceModel.findOne({ _id: body.product_id });
    }
    if (!findhost) {
      return {
        status: 2,
        message: "Product Not Found",
      };
    }
    let data = await HostWishlistModel.findOne({
      $or: [
        { "product.seller_product": body.product_id },
        { "product.admin_product": body.product_id },
      ],
      host: host._id,
    });
    if (!data) {
      let dataToSave = {
        product: {
          seller_product: body.product_id,
          admin_product: body.product_id,
        },
        weight: body.weight,
        size: body.size,
        host: host._id,
      };
      let category = await HostWishlistModel.create(dataToSave);
      let save = await category.save();
      if (save) {
        return {
          status: 1,
          response: save,
          message: "Added Success",
        };
      } else {
        return {
          status: 2,
          message: "Something Went wrong",
        };
      }
    }
    data.product.seller_product = body.product_id;
    data.product.admin_product = body.product_id;
    data.host = host._id;
    result = await data.save();
    if (result) {
      return {
        status: 1,
        response: result,
        message: "Added Success",
      };
    } else {
      return {
        status: 2,
        message: "Something Went wrong",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getWishlistData = async (host) => {
  try {
    let data = await HostWishlistModel.find({ host: host._id })
      .populate("product.seller_product")
      .populate("product.admin_product")
      .sort({ _id: -1 })
      .lean();
    data.map((item) => {
      item.isfavorite = true;
    });
    if (data) {
      return {
        status: 1,
        response: data,
        message: "Success",
      };
    } else {
      return {
        status: 2,
        message: "Not Found",
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

exports.removeFromWishlist = async (host, body) => {
  try {
    let deleteData = await HostWishlistModel.findOneAndDelete({
      $or: [
        { "product.seller_product": body.product_id },
        { "product.admin_product": body.product_id },
      ],
      host: host._id,
    });
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
};

exports.removeFromCart = async (host, body) => {
  try {
    let deleteData = await HostCartModel.findByIdAndUpdate(
      { _id: body._id },
      {
        $set: {
          quantity: 0,
          isDeleted: true,
        },
      },
      {
        new: true,
      }
    );
    if (deleteData) {
      return {
        status: 1,
        message: "Removed from cart",
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
};

exports.decreaseCartData = async (host, body) => {
  try {
    let result = await HostCartModel.findOne({
      $or: [
        { "product.seller_product": body.product_id },
        { "product.admin_product": body.product_id },
      ],
      host: host._id,
      isDeleted: false,
      status: 0,
    }).lean();
    if (!result) {
      return {
        status: 0,
        message: "Not getting cart data",
      };
    }
    if (result.quantity != 1) {
      result = await HostCartModel.findByIdAndUpdate(
        { _id: result._id },
        {
          $set: {
            quantity: result.quantity - 1,
            price: (result.quantity - 1) * result.unitPrice,
          },
        },
        {
          new: true,
        }
      );
      return {
        status: 1,
        message: "Removed from cart",
        response: result,
      };
    } else {
      result = await HostCartModel.findByIdAndUpdate(
        { _id: result._id },
        {
          $set: {
            quantity: 0,
            isDeleted: true,
          },
        },
        {
          new: true,
        }
      );
      // console.log(result);
      // let productData = await ProductCatModel.findOneAndUpdate(
      //   { _id: result.product },
      //   {
      //     $pull: { 'hostCartData': result._id }
      //   },
      //   { new: true }
      // )
      return {
        status: 1,
        message: "Removed from cart",
        // response : result
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

exports.removeAllFromCart = async (host, body) => {
  try {
    let deleteData = await HostCartModel.updateMany(
      { host: host._id, isDeleted: false, status: 0 },
      {
        $set: {
          quantity: 0,
          isDeleted: true,
        },
      },
      {
        multi: true,
      }
    );
    if (deleteData) {
      return {
        status: 1,
        message: "Removed from Cart",
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
};

exports.getAllProducts = async (host, body) => {
  try {
    // console.log(user);
    // let data = await ProductCatModel.find({
    //   product_main_cat: body.main_cat_id
    // })
    //   .populate('product_cat')
    //   .populate('product_main_cat')
    //   .populate('breed_type').lean();
    // .populate({
    //   path: 'hostCartData',
    //   match: { host: host._id }
    // })
    // .lean();
    let { page } = body;
    let skip = (page <= 1 || !page)?0:(page-1)*10;
    
    let data = await ProductCatModel.aggregate([
      { $match: { product_main_cat: mongoose.Types.ObjectId(body.main_cat_id), product_quantity: { $gt :0 }, $expr: {$gt: ["$product_quantity", "$sku_min_limit"]}  } },
      {
        $lookup: {
          from: "hostCart",
          let: {
            productId: "$_id",
            hostId: host._id,
            isDeleted: false,
            status: 0,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $or: [
                        { $eq: ["$product.seller_product", "$$productId"] },
                        { $eq: ["$product.admin_product", "$$productId"] },
                      ],
                    },
                    { $eq: ["$host", "$$hostId"] },
                    { $eq: ["$isDeleted", "$$isDeleted"] },
                    { $eq: ["$status", "$$status"] },
                  ],
                },
              },
            },
          ],
          as: "hostCart",
        },
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "product_cat",
          foreignField: "_id",
          as: "product_cat",
        },
      },
      {
        $lookup: {
          from: "productmaincategories",
          localField: "product_main_cat",
          foreignField: "_id",
          as: "product_main_cat",
        },
      },
      {
        $lookup: {
          from: "productsubcategories",
          localField: "breed_type",
          foreignField: "_id",
          as: "breed_type",
        },
      },
      {
        $lookup:{
          from:"Seller",
          localField:"seller",
          foreignField:"_id",
          as:"seller"
        }
      },
      // {$unwind:"$hostCart"},
      { $unwind: "$product_cat" },
      { $unwind: "$product_main_cat" },
      { $unwind: "$breed_type" },
      { $unwind: "$seller" },
      

      { $project: { hostCartData: 0, cartData: 0 } }, // Return all but the specified fields
      {$skip:skip},
      {$limit:10},
    ]);

    let data1 = await HostWishlistModel.find({ host: host._id });
    let fav_arr = [];
    let new_list = [];
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
      if (data[j].hostCart.length > 0) {
        data[j].isCartAdded = true;
        data[j].cartId = data[j].hostCart[0]._id;
        data[j].cartQuantity = data[j].hostCart[0].quantity;
      } else {
        data[j].isCartAdded = false;
        data[j].cartId = null;
        data[j].cartQuantity = 0;
      }
      if (fav_arr.length > 0 && fav_arr.includes(new_list[j])) {
        data[j].isfavorite = true;
      } else {
        data[j].isfavorite = false;
      }
      let allRatings = await OrderRatingModel.find({ $or:[{ "product.seller_product": new_list[j] },{ "product.admin_product": new_list[j] }] },{ uniqid: 0, product:0, order_id: 0 }).lean();
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
          $or: [{"product.seller_product": new_list[j]},{"product.admin_product": new_list[j]}],
          host: host._id
        }
      );
      data[j].is_liked = liked ? 1 : 0;
    }
    if (data) {
      return {
        status: 1,
        response: data,
        message: "Product Category Data",
      };
    } else {
      return {
        status: 2,
        message: "Not Found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.addAdress = async (host, body) => {
  try {
    let address;
    address = new HostAddressModel();
    address.house_no = body.house_no;
    address.street = body.street;
    address.locality = body.locality;
    address.city = body.city;
    address.postal_code = body.postal_code;
    address.host = host._id;
    address.country = body.country;
    address.state = body.state;
    address.mobile_number = body.mobile_number;
    address.full_name = body.full_name;
    address.latitude = body.latitude;
    address.longitude = body.longitude;

    let result = await address.save();
    // console.log(result);
    if (!result) {
      return {
        status: 0,
        message: "Something Went Wrong",
      };
    }
    return {
      status: 1,
      message: "Saved Success",
      response: result,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.editAdress = async (host, body) => {
  try {
    let { address_id } = body;
    let result = await HostAddressModel.findByIdAndUpdate(address_id, body, {
      new: true,
    });
    console.log(result);
    if (!result) {
      return {
        status: 0,
        message: "Something Went Wrong",
      };
    }
    return {
      status: 1,
      message: "update Success",
      response: result,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAdressList = async (host, body) => {
  try {
    let saveAddress = await HostAddressModel.find({ host: host._id })
      .lean()
      .sort({ _id: -1 });
    if (!saveAddress) {
      return {
        status: 2,
        message: "Something went wrong",
      };
    } else {
      return {
        status: 1,
        message: "Add address successfully",
        response: saveAddress,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteAddress = async (host, body) => {
  try {
    let result = await HostAddressModel.findByIdAndDelete(body._id);
    if (!result) {
      return {
        status: 2,
        message: "Address Not Found",
      };
    }
    return {
      status: 1,
      message: "Deleted Success",
      response: {},
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.makePrimaryAddress = async (host, body) => {
  try {
    let updateAddressUpdate = await HostAddressModel.findOne({ _id: body._id });
    if (!updateAddressUpdate) {
      return {
        status: 2,
        message: "Address Not Found",
      };
    }
    updateAddressUpdate = await HostAddressModel.updateMany(
      { host: host._id },
      { primaryAddress: false }
    );
    let result = await HostAddressModel.findOneAndUpdate(
      { _id: body._id },
      { primaryAddress: true },
      { new: true }
    );
    if (!result) {
      return {
        status: 0,
        message: "Something Went Wrong",
      };
    }
    return {
      status: 1,
      message: "Address update Success",
      response: {},
    };
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
      { $match: { is_blocked: false, to: { $gte: todaydate } }},
    ]);
    if (!result) {
      return {
        status: 0,
        message: "Something Went Wrong",
      };
    }
    return {
      status: 1,
      message: "Coupon List !!",
      response: result,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.applyCoupon = async (host, data) => {
  try {
    if (!data.price || data.price == "")
      return { status: 0, message: "Price is required" };
    if (!data.coupon_code || data.coupon_code == "")
      return { status: 0, message: "Coupon code is required" };

    let currentDate = new Date().getTime();
    let activeCoupon = await PromocodeModel.findOne(
      {
        to: { $gte: currentDate },
        couponCode: data.coupon_code,
        is_blocked: false,
      },
      { is_blocked: 0 }
    ).lean();
    if (!activeCoupon) {
      return {
        status: 0,
        message: "Coupon does not exist or coupon expired",
      };
    }
    if (currentDate > activeCoupon.to) {
      return {
        status: 0,
        message: "Coupon has expired",
      };
    }

    let NoOfcouponUsed = await HostOrderModel.count({
      coupon: mongoose.Types.ObjectId(activeCoupon._id),
    }).lean();
    if (activeCoupon.orderValueLimit > data.price) {
      return {
        status: 0,
        message:
          "This coupon is not applicable on purchase amount leass than " +
          activeCoupon.orderValueLimit,
      };
    }

    if (NoOfcouponUsed >= parseInt(activeCoupon.usageLimit)) {
      return {
        status: 0,
        message: "Coupon has reached its maxm limit",
      };
    }

    let newPrice = data.price;
    let discountAmount = 0;
    if (activeCoupon.discount > 0 && data.price > 0) {
      discountAmount = (activeCoupon.discount * data.price) / 100;
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
      discountAmount: discountAmount,
    };
    return {
      message: "Coupon applied successfully",
      status: 1,
      response: dataToSend,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.removeCoupon = async (host, data) => {
  try {
    if (!data.originalPrice || data.originalPrice == "")
      return { status: 0, message: "Original price is required" };
    if (!data.coupon_code || data.coupon_code == "")
      return { status: 0, message: "Coupon code is required" };

    let currentDate = new Date().getTime();
    let activeCoupon = await PromocodeModel.findOne(
      {
        to: { $gte: currentDate },
        couponCode: data.coupon_code,
        is_blocked: false,
      },
      { is_blocked: 0 }
    ).lean();
    if (!activeCoupon) {
      return {
        status: 0,
        message: "Coupon does not exist or coupon expired",
      };
    }

    let dataToSend = {
      priceBeforeDiscount: data.originalPrice,
      discountAmount: 0,
    };
    return {
      message: "Coupon removed successfully",
      status: 1,
      response: dataToSend,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.proceedToPay = async (user, data) => {
  try {
    let finalAmount =
      parseFloat(data.cartValue) +
      parseFloat(data.deliveryCharge) -
      parseFloat(data.discountAmount);
    let dataToSend = {
      cartValue: data.cartValue,
      deliveryCharge: data.deliveryCharge,
      discountAmount: data.discountAmount,
      finalAmount: finalAmount,
    };
    return {
      status: 1,
      message: "Success",
      response: dataToSend,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

function doRequest(options) {
  return new Promise(function (resolve, reject) {
    request(options, async function (error, response, body) {
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
    let {
      cartIds,
      couponCode,
      totalAmount,
      paymentOption,
      discountAmount,
      deliveryCharge,
      redeemedAmount,
      addressId,
      token
    } = data;
    var couponData;
    if (couponCode) {
      couponData = await PromocodeModel.findOne(
        { couponCode: couponCode },
        { _id: 1 }
      ).lean();
    }
    var commission = await CommissionModel.findOne({}).lean();
    let serviceCharge = await ServiceChargeModel.findOne({}).lean();
    let unique_booking_id = generateUniqueId({
      length: 7,
      useLetters: true,
    }).toUpperCase();
    var discount_amount =
      cartIds.length > 0 ? discountAmount / cartIds.length : 0;
    var delivery_charge =
      cartIds.length > 0 ? deliveryCharge / cartIds.length : 0;

    var sellerIds = [];
    var productIds = [];
    if (paymentOption == "AMAZONPAY") {
      if (cartIds.length > 0) {
        let orderIds = [];
        for (let i = 0; i < cartIds.length; i++) {
          let cartData = await HostCartModel.findOne(
            { _id: mongoose.Types.ObjectId(cartIds[i]) },
            { product: 1, quantity: 1, seller: 1 }
          )
            .populate("product.seller_product", "selling_price")
            .populate("product.admin_product", "selling_price")
            .lean();

          let new_price = cartData.product.seller_product
            ? cartData.product.seller_product.selling_price
            : cartData.product.admin_product.selling_price;
          let productPrice = parseFloat(new_price);
          let productQuantity = parseInt(cartData.quantity);

          let productTotalAmount = (productPrice * productQuantity).toFixed(2);
          let total_amount =
            parseFloat(productTotalAmount) +
            parseFloat(delivery_charge) -
            parseFloat(discount_amount);
          let dataToSave = {
            host: user._id,
            cart_id: cartIds[i],
            quantity: productQuantity,
            order_id: generateUniqueId({
              length: 7,
              useLetters: true,
            }).toUpperCase(),
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
          };

          let res = new HostOrderModel(Object.assign({}, dataToSave));
          let saveOrder = await res.save();
          if (!saveOrder) {
            return {
              status: 0,
              message: "Unable to place order",
            };
          }

          let orderId = saveOrder._id;
          let cart_id = cartIds[i];
          orderIds.push(orderId);
          sellerIds.push(cartData.seller.seller_id);
          productIds.push(cartData.product.seller_product ? cartData.product.seller_product._id : cartData.product.admin_product._id)
          let updateCart = await HostCartModel.updateOne(
            { _id: mongoose.Types.ObjectId(cart_id) },
            { status: 1, orderId: orderId },
            { new: true }
          );
          if (!updateCart) {
            return {
              status: 0,
              message: "Unable to update cart",
            };
          }
        }

        let bookingData = {
          host_id: user._id,
          cart_id: cartIds,
          order_id: orderIds,
          total_amount: totalAmount,
          delivery_charge: deliveryCharge,
          coupon_id: couponData ? couponData._id : null,
          discount_amount: discountAmount,
          transaction_id: generateUniqueId({
            length: 15,
            useLetters: true,
          }).toUpperCase(),
          booking_id: unique_booking_id,
        };

        let response = new HostOrderBookingModel(
          Object.assign({}, bookingData)
        );
        let saveBooking = await response.save();
        if (!saveBooking) {
          return {
            status: 0,
            message: "Unable to book order",
          };
        }
        let bookingId = saveBooking._id;

        let updateCartData = await HostCartModel.updateMany(
          { _id: { $in: cartIds } },
          { bookingId: bookingId },
          { new: true }
        );
        let updateOrderData = await HostOrderModel.updateMany(
          { _id: { $in: orderIds } },
          { booking_id: bookingId },
          { new: true }
        );

        if (!updateCartData && !updateOrderData) {
          return {
            status: 0,
            message: "Unable to update cart and order",
          };
        }

        await sendCartNotification(user, sellerIds);
        await sendNotificationToSeller(productIds);

        let dataToSend = {
          bookingId: unique_booking_id,
        };
        return {
          message: "Order placed successfully",
          status: 1,
          response: dataToSend,
        };
      } else {
        return {
          status: 0,
          message: "Please add product to cart to place order",
        };
      }
    }else if(paymentOption == "KUSHKI"){
      if(cartIds.length > 0){
        let orderIds = [];
        var productDetail = [];
        for(let i = 0; i < cartIds.length; i++){
          let cartData = await HostCartModel.findOne({ _id: mongoose.Types.ObjectId(cartIds[i]) },{ product: 1, quantity: 1, seller: 1 })
            .populate('product.seller_product', 'selling_price')
            .populate('product.admin_product', 'selling_price').lean();
          let new_price  = cartData.product.seller_product ? cartData.product.seller_product.selling_price : cartData.product.admin_product.selling_price;
          let productPrice =  parseFloat(new_price);
          let productQuantity = parseInt(cartData.quantity);
          let productTotalAmount = (productPrice * productQuantity).toFixed(2);
          let total_amount = parseFloat(productTotalAmount) + parseFloat(delivery_charge) - parseFloat(discount_amount);

          let dataToSave = {
            host: user._id,
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

          let res = new HostOrderModel(Object.assign({}, dataToSave));
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
          let updateCart = await HostCartModel.updateOne({ _id: mongoose.Types.ObjectId(cart_id) }, { orderId: orderId },{new: true});
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
              sku: findProduct._id, //findProduct.sku_min_limit ? findProduct.sku_min_limit+"" : "0",
              quantity: productQuantity
            });
          }
        }

        let bookingData = {
          host_id: user._id,
          cart_id: cartIds,
          order_id: orderIds,
          total_amount: totalAmount,
          delivery_charge: deliveryCharge,
          // redeemed_amount: redeemedAmount,
          coupon_id: couponData ? couponData._id : null,
          discount_amount: discountAmount,
          transaction_id: (generateUniqueId({length: 15,useLetters: true}).toUpperCase()),
          booking_id: unique_booking_id,
          status: 0
        }

        let bookingResp = new HostOrderBookingModel(Object.assign({}, bookingData));
        let saveBooking = await bookingResp.save();
        if (!saveBooking) {
          return {
            status: 0,
            message: "Unable to book order"
          }
        }
        let bookingId = saveBooking._id;

        let hostAddress = await HostAddressModel.findOne({ host: user._id, _id: addressId });
      

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
        // var localtoken = null;
        // if(resp){
        //   // localtoken = resp.token
          var options = {
              method: 'POST',
              headers: {
                'Private-Merchant-Id': 'b04cf9ad305849da85dbcdd222e2d717',  // Replace with your Private merchant id //'ebdd6461bdd148bc8b556ccbda5cd450',
                'Content-Type': 'application/json'
              },
              url: 'https://api.kushkipagos.com/card/v1/charges', // Test environment
              body: {
                // token: "V0OzRB100000xhxQB8035251pHLBQsq5", // Replace with the token you recieved
                token: token,
                // token: localtoken,
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
                  firstName: user.first_name,
                  lastName: user.last_name,
                  phoneNumber:  user.country_code+user.mobile_number
                },
                orderDetails: {
                  siteDomain: "petsworld.pet",
                  shippingDetails: {
                    name: user.first_name+" "+user.last_name,
                    phone: user.country_code+user.mobile_number,
                    address: hostAddress ? (hostAddress.house_no + "," +hostAddress.street) : "",
                    city: hostAddress ? hostAddress.city: "",
                    region: hostAddress ? hostAddress.city: "",
                    country: hostAddress ? hostAddress.country: "",
                    zipCode: hostAddress ? hostAddress.postal_code: ""
                  },
                  billingDetails: {
                    name:  user.first_name+" "+user.last_name,
                    phone: user.country_code+user.mobile_number,
                    address: hostAddress ? (hostAddress.house_no+ "," +hostAddress.street) : "",
                    city: hostAddress ? hostAddress.city: "",
                    region: hostAddress ? hostAddress.city: "",
                    country: hostAddress ? hostAddress.country: "",
                    zipCode: hostAddress ? hostAddress.postal_code: ""
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
          if(respData.details && respData.details.transactionStatus == 'APPROVAL'){
            let updateCartData = await HostCartModel.updateMany({'_id': {'$in': cartIds }}, { status: 1, bookingId: bookingId },{multi: true});
            let updateOrderData = await HostOrderModel.updateMany({'_id': {'$in': orderIds }}, { paymentStatus: 1, orderStatus: 0, booking_id: bookingId },{multi: true});
            let updateBookingData = await HostOrderBookingModel.findOneAndUpdate({'_id': bookingId }, { transaction_id: respData.transactionReference, status:1, response: [respData] },{new: true});
            if (!updateCartData && !updateOrderData && !updateBookingData) {
              return {
                status: 0,
                message: "Unable to update cart and order"
              }
            }

            await sendCartNotification(user, sellerIds) 
            await sendNotificationToSeller(productIds);
      
            let dataToSend = {
              bookingId: unique_booking_id
            }
            return { message: "Order placed successfully", status: 1, response: dataToSend };            
          }else{
            return { message: "Placing order has been failed, please try again", status: 0, response: { request: options, response: respData ,hostDetails: hostAddress } };
          }
        // }
        /* code for payment gateway end */
      }else {
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

exports.getTrackingDeviceProducts = async (host) => {
  try {
    let trackingDeviceProducts = await TrackingDeviceModel.find({
      is_blocked: false,
      product_quantity: { $gt: 0 },
    })
      .populate("productMainCategoryId", "mainCategoryName MainCategoryImage")
      .lean();
    if (!trackingDeviceProducts) {
      return {
        status: 0,
        message: "No tracking devices found",
      };
    }

    if (trackingDeviceProducts.length > 0) {
      for (let i = 0; i < trackingDeviceProducts.length; i++) {
        let cartCount = await HostCartModel.findOne(
          {
            "product.admin_product": trackingDeviceProducts[i]._id,
            host: host._id,
            isDeleted: false,
            status: 0,
          },
          { quantity: 1 }
        ).lean();
        let favProd = await HostWishlistModel.findOne({
          host: host._id,
          "product.admin_product": trackingDeviceProducts[i]._id,
        });

        trackingDeviceProducts[i]["cartQuantity"] = cartCount
          ? cartCount.quantity
          : 0;
        trackingDeviceProducts[i]["cartId"] = cartCount ? cartCount._id : null;
        trackingDeviceProducts[i]["isCartAdded"] = cartCount ? true : false;
        trackingDeviceProducts[i]["isfavorite"] = favProd ? true : false;
      }
    }

    let dataToSend = {
      trackingDeviceProducts: trackingDeviceProducts,
    };
    return {
      message: "Tracking device products fetched successfully",
      status: 1,
      response: dataToSend,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.cancelOrder = async (host, data) => {
  try {
    if (!host || host._id == "")
      return { status: 0, message: "Login first to cancel order" };
    if (!data || data._id == "")
      return { status: 0, message: "Order id is required" };

    let orderDetails = await HostOrderModel.findOne({
      _id: mongoose.Types.ObjectId(data._id),
    }).lean();
    if (!orderDetails) {
      return {
        status: 0,
        message: "Order does not exists",
      };
    }

    let updateOrder = await HostOrderModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(data._id) },
      {
        $set: {
          orderStatus: 6,
          cancel_reason: data.cancel_reason,
          modified_at: new Date().getTime(),
        },
      },
      { new: true }
    ).lean();
    if (updateOrder) {
      let updateCart = await HostCartModel.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(updateOrder.cart_id) },
        {
          $set: {
            status: 7,
            cancel_reason: data.cancel_reason,
            modified_at: new Date().getTime(),
          },
        },
        { new: true }
      ).lean();
      if (!updateCart) {
        return {
          status: 0,
          message: "Unable to cancel order",
        };
      }
      /* Code for notification start to Seller */
      let device_token = "";
      let device_type = 1;
      let sellerData = await SellerModel.findOne(
        { _id: mongoose.Types.ObjectId(updateCart.seller.seller_id) },
        { device_token: 1, device_type: 1 }
      ).lean();
      if (!sellerData) {
        let adminData = await AdminModel.findOne({}, { email: 1, _id: 1 });
        device_token = adminData.deviceToken;
        device_type = adminData.deviceType;
      } else {
        device_token = sellerData.device_token;
        device_type = sellerData.device_type;
      }
      let sellerTitle = "Order cancelled";
      let sellerNotiBody =
        "Your order with orderId " +
        updateOrder.order_id +
        " has been cancelled by " +
        host.first_name +
        " " +
        host.last_name;
      let sellerNotification = {
        uniqe_id: {
          seller_id: updateCart.seller.seller_id,
          provider_id: updateCart.seller.seller_id,
          admin_id: updateCart.seller.seller_id,
        },
        title: sellerTitle,
        body: sellerNotiBody,
        notification_type: 1,
        type: 3,
        created_at: new Date().getTime(),
      };
      let sendNoti = await NotificationModel.create(sellerNotification);
      sendNoti.save();

      let sellerPayload = {
        title: sellerTitle,
        body: sellerNotiBody,
        noti_type: 1,
      };
      let sellerNotify = {
        title: sellerTitle,
        body: sellerNotiBody,
        color: "#f95b2c",
        sound: true,
      };
      if (device_token) {
        utils.sendPushNotification(
          device_token,
          device_type,
          sellerPayload,
          sellerNotify
        );
      }
      /* Code for notification end to Seller */
    }

    return { message: "Order cancelled successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getCancelOrderReasonList = async (host) => {
  try {
    let cancelReasons = [
      "Not good in quality",
      "Price is too high",
      "Not got the exact item as expected",
    ];
    let dataToSend = {
      cancelReasons: cancelReasons,
    };

    return {
      message: "Order cancel reason list fetched successfully",
      status: 1,
      response: dataToSend,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getOngoingOrderList = async (host) => {
  try {
    if (!host || host._id == "")
      return { status: 0, message: "Login first to get ongoing order list" };

    let ongoingOrderList = await HostCartModel.find(
      {
        host: mongoose.Types.ObjectId(host._id),
        isDeleted: false,
        $or: [{ status: 1 }, { status: 3 }, { status: 4 }, { status: 5 }],
      },
      { orderId: 1, weight:1, size:1, colorId: 1 }
    )
      .populate(
        "orderId",
        "quantity order_id currency totalAmount deliveryCharge discountAmount orderStatus paymentStatus created_at payment_options modified_at"
      )
      .populate(
        "product.seller_product",
        "product_name product_price selling_price product_discount product_details product_decripton product_quantity"
      )
      .populate(
        "product.admin_product",
        "product_name image product_quantity product_price selling_price product_discount product_decripton"
      )
      .populate(
        'seller.seller_id', 'first_name last_name'
      )
      .sort({ created_at: -1 })
      .lean();

    let dataToSend = {
      ongoingOrderList: ongoingOrderList,
    };
    return {
      response: dataToSend,
      message: "Ongoing order list fetch successfully",
      status: 1,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getPastOrderList = async (host) => {
  try {
    if (!host || host._id == "")
      return { status: 0, message: "Login first to get past order list" };

    let pastOrderList = await HostCartModel.find(
      {
        host: mongoose.Types.ObjectId(host._id),
        isDeleted: false,
        $or: [{ status: 2 }, { status: 6 }, { status: 7 }],
      },
      { orderId: 1, weight:1, size:1, colorId: 1 }
    )
      .populate(
        "orderId",
        "quantity order_id currency totalAmount deliveryCharge discountAmount orderStatus paymentStatus created_at payment_options modified_at"
      )
      .populate(
        "product.seller_product",
        "product_name product_price selling_price product_discount product_details product_decripton product_quantity"
      )
      .populate(
        "product.admin_product",
        "product_name image product_quantity product_price selling_price product_discount product_decripton"
      )
      .populate(
        'seller.seller_id', 'first_name last_name'
      )
      .sort({ created_at: -1 })
      .lean();

    if (pastOrderList.length > 0) {
      for (let i = 0; i < pastOrderList.length; i++) {
        if(pastOrderList[i].product.admin_product != null && pastOrderList[i].product.seller_product != null){
          let productId =
            pastOrderList[i].product.admin_product == null
              ? pastOrderList[i].product.seller_product._id
              : pastOrderList[i].product.admin_product._id;
          let allRatings = await OrderRatingModel.find(
            {
              $or: [
                { "product.seller_product": productId },
                { "product.admin_product": productId },
              ],
              "uniqid.host_id": host._id,
            },
            { uniqid: 0, product: 0, order_id: 0 }
          ).lean();
          pastOrderList[i]["rating"] = allRatings.length > 0 ? allRatings : [];
          pastOrderList[i]["invoiceUrl"] =
            "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
        }
      }
    }

    let dataToSend = {
      pastOrderList: pastOrderList,
    };
    return {
      response: dataToSend,
      message: "Past order list fetch successfully",
      status: 1,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getOrderDetails = async (host, data) => {
  try {
    if (!host || host._id == "")
      return { status: 0, message: "Login first to get order details" };
    if (!data || data._id == "")
      return { status: 0, message: "Order id is required" };

    let orderDetails = await HostOrderModel.findOne(
      { _id: mongoose.Types.ObjectId(data._id) },
      { host: 0, booking_id: 0 }
    )
      .populate("address")
      .populate("coupon", "couponCode")
      .lean();

    if (!orderDetails) {
      return {
        status: 0,
        message: "Unable to fetch order details",
      };
    }
    let cartDetails = null;
    if (data._id && host._id) {
      cartDetails = await HostCartModel.findOne(
        {
          host: mongoose.Types.ObjectId(host._id),
          orderId: mongoose.Types.ObjectId(data._id),
        },
        { currency: 1, price: 1, quantity: 1, unit_price: 1, orderId: 1, weight:1, size:1, colorId: 1 }
      )
        .populate(
          "product.seller_product",
          "product_name product_price selling_price product_discount product_details product_decripton product_quantity"
        )
        .populate(
          "product.admin_product",
          "product_name image product_quantity product_price selling_price product_discount product_decripton"
        )
        .populate('seller.seller_id', 'first_name last_name')
        .populate('seller.admin_id', 'name')
        .lean();

      let allRatings = [];
      if (cartDetails) {
        let productId =
          cartDetails.product.admin_product == null
            ? cartDetails.product.seller_product._id
            : cartDetails.product.admin_product._id;
        allRatings = await OrderRatingModel.find(
          {
            $or: [
              { "product.seller_product": productId },
              { "product.admin_product": productId },
            ],
            "uniqid.host_id": host._id,
          },
          { uniqid: 0, product: 0, order_id: 0 }
        ).lean();
      }

      orderDetails["productDetails"] = cartDetails;
      orderDetails["productWeight"] = cartDetails ? cartDetails.weight: null;
      orderDetails["productSize"] = cartDetails ? cartDetails.size : null;
      orderDetails["rating"] = allRatings.length > 0 ? allRatings : [];
      orderDetails["invoiceUrl"] =
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    }

    return {
      response: orderDetails,
      message: "Order detail fetch successfully",
      status: 1,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.addOrderRating = async (host, data) => {
  try {
    if (!data.product_id || data.product_id == "")
      return { status: 0, message: "Product id is required" };
    if (!data.order_id || data.order_id == "")
      return { status: 0, message: "Order id is required" };
    if (!data.rating_point || data.rating_point == "")
      return { status: 0, message: "Rating is required" };
    if (!data.review || data.review == "")
      return { status: 0, message: "Review is required" };

    let dataToSave = {
      uniqid: {
        user_id: host._id,
        host_id: host._id,
      },
      product: {
        seller_product: data.product_id,
        admin_product: data.product_id,
      },
      order_id: data.order_id,
      rating_point: data.rating_point,
      review: data.review,
      created_at: new Date().getTime(),
    };
    let rating = await OrderRatingModel.create(dataToSave);
    let saveRating = rating.save();

    if (!saveRating) {
      return {
        status: 0,
        message: "Unable to add rating",
      };
    }

    return { message: "Rating details added successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getAllRatings = async (host, data) => {
  try {
    if (!data.product_id || data.product_id == "")
      return { status: 0, message: "Product id is required" };

    let allRatings = await OrderRatingModel.find({
      $or: [
        { "product.seller_product": data.product_id },
        { "product.admin_product": data.product_id },
      ],
    })
      .populate("uniqid.user_id", "full_name")
      .populate("uniqid.host_id", "first_name last_name")
      .populate("product.seller_product", "product_name product_decripton")
      .populate("product.admin_product", "product_name product_decripton")
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
      totalRatings: allRatings.length,
    };

    return {
      response: dataToSend,
      message: "All ratings fetched successfully",
      status: 1,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getAllAdvertisements = async (host) => {
  try {
    let currentDate = new Date().getTime();
    let allAds = await AdvertisementModel.find({
      is_host : true,
      is_active: true,
      is_blocked : 0,
      $and: [
        { start_date: { $lte: currentDate } },
        { end_date: { $gte: currentDate } },
      ],
    },
    {
      image : 1
    })
    .sort({date_created : -1})
    .limit(5)
    .lean();

    let dataToSend = {
      allAdvertisements: allAds,
    };

    return {
      response: dataToSend,
      message: "All advertisements fetched successfully",
      status: 1,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getServiceCategoryList = async (host) => {
  try {
    let serviceCategory = await ServiceCategoryModel.find(
      { is_blocked: 0 },
      { is_blocked: 0, created_at: 0, modified_at: 0 }
    ).lean();

    let dataToSend = {
      allCategories: serviceCategory,
    };

    return {
      response: dataToSend,
      message: "All service categories fetched successfully",
      status: 1,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getServiceProviderServicesList = async (data) => {
  try {
    if (!data.service_category || data.service_category == "")
      return { status: 0, message: "Service category is required" };

    let services = await ServiceProviderServicesModel.find({
      serviceCategory: mongoose.Types.ObjectId(data.service_category),
    })
      .populate(
        "serviceProvider",
        "first_name last_name country_code mobile_number email profile_pic location"
      )
      .lean();

    if(services.length > 0){
      for(let i=0; i< services.length; i++){
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
      allServices: services,
    };

    return {
      response: dataToSend,
      message: "All services fetched successfully",
      status: 1,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getServiceDetails = async (host, data) => {
  try {
    if (!data.service_id || data.service_id == "")
      return { status: 0, message: "Service id is required" };

    let service = await ServiceProviderServicesModel.findOne({
      _id: mongoose.Types.ObjectId(data.service_id),
    })
      .populate(
        "serviceProvider",
        "first_name last_name country_code mobile_number email profile_pic location"
      )
      .lean();

    let address = await HostAddressModel.findOne(
      { host: host._id, primaryAddress: true },
      { host: 0, createdAt: 0, updatedAt: 0 }
    ).lean();

    let otherServices = await ServiceProviderServicesModel.find({
      serviceCategory: mongoose.Types.ObjectId(service.serviceCategory),
      _id: { $ne: mongoose.Types.ObjectId(data.service_id) },
    })
      .limit(5)
      .populate(
        "serviceProvider",
        "first_name last_name country_code mobile_number email profile_pic location"
      )
      .lean();

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
    service.address = address;
    let dataToSend = {
      serviceDetails: service,
      otherServices: otherServices,
    };

    return {
      response: dataToSend,
      message: "Service details fetched successfully",
      status: 1,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.bookService = async (host, data) => {
  try {
    let {
      service_category,
      service_id,
      address,
      total_amount,
      booking_date,
      booking_time,
      additional_note,
      payment_option,
      token
    } = data;

    if (!service_category || service_category == "")
      return { status: 0, message: "Service category is required" };
    if (!service_id || service_id == "")
      return { status: 0, message: "Service id is required" };
    if (!address || address == "")
      return { status: 0, message: "Address id is required" };
    if (!total_amount || total_amount == "")
      return { status: 0, message: "Total amount is required" };
    if (!booking_date || booking_date == "")
      return { status: 0, message: "Booking date is required" };
    if (!booking_time || booking_time == "")
      return { status: 0, message: "Booking time is required" };
    if (!payment_option || payment_option == "")
      return { status: 0, message: "Payment option is required" };

    let serviceProvider = await ServiceProviderServicesModel.findOne(
      { _id: mongoose.Types.ObjectId(service_id) },
      { serviceProvider: 1, description:1 }
    ).lean();
    let serviceProviderId = serviceProvider
      ? serviceProvider.serviceProvider
      : null;

    var commission = await CommissionModel.findOne({}).lean();
    let serviceCharge = await ServiceChargeModel.findOne({}).lean();

    if (payment_option == "COD") {
      let dataToSave = {
        host: host._id,
        service_category,
        service_provider: serviceProviderId,
        service_id,
        booking_id: generateUniqueId({
          length: 7,
          useLetters: true,
        }).toUpperCase(),
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
      };
      let booking = await HostServiceBookingModel.create(dataToSave);
      let savebooking = booking.save();

      if (!savebooking) {
        return {
          status: 0,
          message: "Unable to add booking",
        };
      }
    
      await sendServiceBookingNotification(host, service_id);

      return { message: "Booking completed successfully", status: 1 };
    } else if (payment_option == "KUSHKI") {
      let hostAddress = await HostAddressModel.findOne({ host: host._id, _id: address });
      let bookingId = generateUniqueId({ length: 7, useLetters: true }).toUpperCase();

      let productDetail = [{
        id: service_id,
        title: serviceProvider.description,
        price: (Number(total_amount) * 1000),
        sku:  service_id,
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
            'Private-Merchant-Id': 'b04cf9ad305849da85dbcdd222e2d717', // Replace with your Private merchant id // 'ebdd6461bdd148bc8b556ccbda5cd450',
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
              email: host.email ? host.email : "petsworld@gmail.com",
              firstName: host.first_name,
              lastName: host.last_name,
              phoneNumber:  host.country_code+host.mobile_number
            },
            orderDetails: {
              siteDomain: "petsworld.pet",
              shippingDetails: {
                name: host.first_name+" "+host.last_name,
                phone: host.country_code+host.mobile_number,
                address: hostAddress ? (hostAddress.house_no + "," +hostAddress.street) : "",
                city: hostAddress ? hostAddress.city: "",
                region: hostAddress ? hostAddress.city: "",
                country: hostAddress ? hostAddress.country: "",
                zipCode: hostAddress ? hostAddress.postal_code: ""
              },
              billingDetails: {
                name:  host.first_name+" "+host.last_name,
                phone: host.country_code+host.mobile_number,
                address: hostAddress ? (hostAddress.house_no+ "," +hostAddress.street) : "",
                city: hostAddress ? hostAddress.city: "",
                region: hostAddress ? hostAddress.city: "",
                country: hostAddress ? hostAddress.country: "",
                zipCode: hostAddress ? hostAddress.postal_code: ""
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
      if(respData.details && respData.details.transactionStatus == 'APPROVAL'){
        let dataToSave = {
          host: host._id,
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
        let booking = await HostServiceBookingModel.create(dataToSave);
        let savebooking = booking.save();
  
        if (!savebooking) {
          return {
            status: 0,
            message: "Unable to add booking",
          };
        }
      
        await sendServiceBookingNotification(host, service_id);
  
        return { message: "Booking completed successfully", status: 1 };            
      }else{
        return { message: "Booking has been failed, please try again", status: 0, response: { request: options, response: respData ,hostDetails: hostAddress } };
      }
    // }
      
    }else if (payment_option == "PAYPAL") {
      let dataToSave = {
        host: host._id,
        service_category,
        service_provider: serviceProviderId,
        service_id,
        booking_id: generateUniqueId({
          length: 7,
          useLetters: true,
        }).toUpperCase(),
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
      };
      let booking = await HostServiceBookingModel.create(dataToSave);
      let savebooking = booking.save();

      if (!savebooking) {
        return {
          status: 0,
          message: "Unable to add booking",
        };
      }
      let dataToSend = {
        bookingId: booking._id,
      };
      return {
        message: "Booking payment is pending currently",
        response: dataToSend,
        status: 1,
      };
    } else {
      return {
        status: 0,
        message: "Please choose payment option to proceed with booking",
      };
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.filterServices = async (host, data) => {
  try {
    if (!data.service_category || data.service_category == "")
      return { status: 0, message: "Service category is required" };
    if (!data.minm_experience || data.minm_experience == "")
      return { status: 0, message: "Minimum experience is required" };
    if (!data.maxm_experience || data.maxm_experience == "")
      return { status: 0, message: "Maximum experience is required" };
    if (!data.rating || data.rating == "")
      return { status: 0, message: "Rating is required" };

    let query = {
      serviceCategory: mongoose.Types.ObjectId(data.service_category),
    };

    // if (data.rating == 0) {
      query = {
        ...query,
        $and: [
          { experience: { $gte: Number(data.minm_experience) } },
          { experience: { $lte: Number(data.maxm_experience) } },
        ],
      };
    // }
    let services = await ServiceProviderServicesModel.find(query)
      .populate(
        "serviceProvider",
        "first_name last_name country_code mobile_number email profile_pic location"
      )
      .lean();

      if(services.length > 0){
        for(let i=0; i< services.length; i++){
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
      if(Number(data.rating) == 0){
        services = _.filter(services, (item) => Number(item.avgRating) < 1);
      }else if(Number(data.rating) == 1){
        services = _.filter(services, (item) => ((Number(item.avgRating) >= 1) && (Number(item.avgRating) < 2)));
      }else if(Number(data.rating) == 2){
        services = _.filter(services, (item) => ((Number(item.avgRating) >= 2) && (Number(item.avgRating) < 3)));
      }else if(Number(data.rating) == 3){
        services = _.filter(services, (item) => ((Number(item.avgRating) >= 3) && (Number(item.avgRating) < 4)));
      }else if((Number(data.rating) == 4)){
        services = _.filter(services, (item) => ((Number(item.avgRating) >= 4) && (Number(item.avgRating) < 5)));
      }else if((Number(data.rating) == 5)){
        services = _.filter(services, (item) => ((Number(item.avgRating) >= 5)));
      }else{
        services = services;
      }

      // services = _.filter(services, (item) => Number(item.avgRating) >= Number(data.rating));

    let dataToSend = {
      filteredServices: services,
    };

    return {
      response: dataToSend,
      message: "Services filtered successfully",
      status: 1,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.confirmPaypalBooking = async (host, data) => {
  try {
    if (!data.bookingId || data.bookingId == "")
      return { status: 0, message: "Booking id is required" };

    let dataToUpdate = {
      payment_response: data.response,
      booking_status: 1,
      payment_status: 1,
      modified_at: new Date().getTime(),
    };

    let updateBooking = await HostServiceBookingModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(data.bookingId) },
      { $set: dataToUpdate },
      { new: true }
    ).lean();
    if (!updateBooking) {
      return {
        status: 0,
        message: "Unable to confirm booking",
      };
    }
    /* Code for notification start */
    let title = "Order payment done through PAYPAL";
    let Notificationbody = "Thanks for placing service order";
    let device_type = host.device_type;
    let notification = {
      uniqe_id: {
        user_id: host._id,
        host_id: host._id,
      },
      title: title,
      body: Notificationbody,
      notification_type: 8,
      type: 1,
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
    if (host.device_token) {
      utils.sendPushNotification(
        host.device_token,
        device_type,
        payload,
        notify
      );
    }
    /* Code for notification end */
    /* Code for notification start to Seller */
    let provider = await ServiceProviderServicesModel.findOne(
      { _id: mongoose.Types.ObjectId(updateBooking.service_id) },
      { serviceProvider: 1 }
    )
      .populate("serviceProvider", "device_type device_token")
      .lean();
    let device_token = provider ? provider.serviceProvider.device_token : "";
    let seller_device_type = provider
      ? provider.serviceProvider.device_type
      : "";
    let sellerTitle = "Order Placed";
    let sellerNotiBody =
      "New order has been placed by " +
      host.first_name +
      " " +
      host.last_name;
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
        created_at: new Date().getTime(),
      };
      let sendNoti = await NotificationModel.create(sellerNotification);
      sendNoti.save();
    }

    let sellerPayload = {
      title: sellerTitle,
      body: sellerNotiBody,
      noti_type: 1,
    };
    let sellerNotify = {
      title: sellerTitle,
      body: sellerNotiBody,
      color: "#f95b2c",
      sound: true,
    };
    if (device_token) {
      utils.sendPushNotification(
        device_token,
        seller_device_type,
        sellerPayload,
        sellerNotify
      );
    }
    /* Code for notification end to Seller */

    /* Code for notification start to Admin */
    let admin = await AdminModel.findOne({}, { email: 1, _id: 1 });
    let adminTitle = "Order Placed";
    let NotiBody =
      "New order has been placed by " +
      host.first_name +
      " " +
      host.last_name;

    let adminNotification = {
      uniqe_id: {
        admin_id: admin._id,
      },
      title: adminTitle,
      body: NotiBody,
      notification_type: 1,
      type: 5,
      created_at: new Date().getTime(),
    };
    let send_noti = await NotificationModel.create(adminNotification);
    send_noti.save();
    /* Code for notification end */
    return { message: "Booking confirmed successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getNotificationList = async (host) => {
  try {
    let notifications = await NotificationModel.find(
      { "uniqe_id.host_id": mongoose.Types.ObjectId(host._id) },
      { uniqe_id: 0 }
    )
      .sort({ created_at: -1 })
      .lean();
    if (!notifications) {
      return {
        status: 0,
        message: "Unable to get notifications",
      };
    }
    let dataToSend = {
      notificationList: notifications,
      notificationCount: notifications.length
    };

    return {
      message: "Notification list fetched successfully",
      status: 1,
      response: dataToSend,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.readNotification = async (host, data) => {
  try {
    if (!data._id || data._id == "")
      return { status: 0, message: "Notification id is required" };

    let notification = await NotificationModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(data._id) },
      { $set: { is_read: 1 } },
      { new: true }
    ).lean();
    if (!notification) {
      return {
        status: 0,
        message: "Unable to update notification",
      };
    }

    return { message: "Notification read successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getOngoingServiceOrderList = async (host) => {
  try {
    if (!host._id || host._id == "")
      return {
        status: 0,
        message: "Login first to get onging service order list",
      };

    let getBookings = await HostServiceBookingModel.find({
      host: mongoose.Types.ObjectId(host._id),
      payment_status: 1,
      $or: [
        { booking_status: 1 },
        { booking_status: 3 },
        { booking_status: 4 },
      ],
    })
      .populate("service_category", "category_name category_image")
      .populate({
        path: "service_id",
        model: "serviceProviderServices",
        select: "service_image serviceProvider price experience  description",
        populate: [
          {
            path: "serviceProvider",
            model: "serviceProvider",
            select:
              "first_name last_name country_code mobile_number email location profile_pic",
          },
        ],
      })
      .populate("address")
      .sort({ booking_date: 1 })
      .lean();

    if (!getBookings) {
      return {
        status: 0,
        message: "Unable to get booking",
      };
    }
    let dataToSend = {
      ongoingServiceOrderList: getBookings,
    };
    return {
      message: "Onging service order list fetched successfully",
      status: 1,
      response: dataToSend,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getPastServiceOrderList = async (host) => {
  try {
    if (!host._id || host._id == "")
      return {
        status: 0,
        message: "Login first to get onging service order list",
      };

    let getBookings = await HostServiceBookingModel.find({
      host: mongoose.Types.ObjectId(host._id),
      payment_status: 1,
      $or: [
        { booking_status: 2 },
        { booking_status: 5 },
        { booking_status: 6 },
      ],
    })
      .populate("service_category", "category_name category_image")
      .populate({
        path: "service_id",
        model: "serviceProviderServices",
        select: "service_image serviceProvider price experience  description",
        populate: [
          {
            path: "serviceProvider",
            model: "serviceProvider",
            select:
              "first_name last_name country_code mobile_number email location profile_pic",
          },
        ],
      })
      .populate("address")
      .sort({ modified_at: -1 })
      .lean();

    if (getBookings.length > 0) {
      for (let i = 0; i < getBookings.length; i++) {
        let service_id = getBookings[i].service_id
          ? getBookings[i].service_id._id
          : null;
        if (service_id != null) {
          let allRatings = await ServiceOrderRatingModel.find(
            {
              service_id: service_id,
              "uniqid.host_id": host._id,
              "booking.host_booking": getBookings[i]._id,
            },
            { uniqid: 0, booking: 0, service_provider_id: 0 }
          ).lean();
          getBookings[i]["rating"] = allRatings.length > 0 ? allRatings : [];
        }
      }
    }

    if (!getBookings) {
      return {
        status: 0,
        message: "Unable to get booking",
      };
    }
    let dataToSend = {
      pastServiceOrderList: getBookings,
    };
    return {
      message: "Past service order list fetched successfully",
      status: 1,
      response: dataToSend,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.cancelServiceOrder = async (host, data) => {
  try {
    if (!host || host._id == "")
      return { status: 0, message: "Login first to cancel order" };
    if (!data || data._id == "")
      return { status: 0, message: "Booking id is required" };

    let orderDetails = await HostServiceBookingModel.findOne({
      _id: mongoose.Types.ObjectId(data._id),
    }).lean();
    if (!orderDetails) {
      return {
        status: 0,
        message: "Order does not exists",
      };
    }

    let updateOrder = await HostServiceBookingModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(data._id) },
      {
        $set: {
          booking_status: 6,
          cancel_reason: data.cancel_reason,
          modified_at: new Date().getTime(),
        },
      },
      { new: true }
    ).lean();
    if (updateOrder) {
      /* Code for notification start to Seller */
      let serviceId = updateOrder.service_id;
      let device_token = "";
      let device_type = 1;
      let serviceData = await ServiceProviderServicesModel.findOne(
        { _id: mongoose.Types.ObjectId(serviceId) },
        { serviceProvider: 1 }
      )
        .populate("serviceProvider", "_id device_token device_type")
        .lean();

      if (serviceData) {
        device_token = serviceData.serviceProvider.device_token;
        device_type = serviceData.serviceProvider.device_type;

        let sellerTitle = "Order cancelled";
        let sellerNotiBody =
          "Your order with bookingId " +
          updateOrder.booking_id +
          " has been cancelled by " +
          host.first_name +
          " " +
          host.last_name;
        let sellerNotification = {
          uniqe_id: {
            seller_id: serviceData.serviceProvider._id,
            provider_id: serviceData.serviceProvider._id,
          },
          title: sellerTitle,
          body: sellerNotiBody,
          order_id: {
            user_order: data._id,
            host_order: data._id,
          },
          notification_type: 13,
          type: 3,
          created_at: new Date().getTime(),
        };
        let sendNoti = await NotificationModel.create(sellerNotification);
        sendNoti.save();

        let sellerPayload = {
          title: sellerTitle,
          body: sellerNotiBody,
          noti_type: 1,
        };
        let sellerNotify = {
          title: sellerTitle,
          body: sellerNotiBody,
          color: "#f95b2c",
          sound: true,
        };
        if (device_token) {
          utils.sendPushNotification(
            device_token,
            device_type,
            sellerPayload,
            sellerNotify
          );
        }
      }
      /* Code for notification end to Seller */
    }

    return { message: "Booking cancelled successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getServiceOrderDetails = async (host, data) => {
  try {
    if (!host || host._id == "")
      return { status: 0, message: "Login first to get order details" };
    if (!data || data._id == "")
      return { status: 0, message: "Booking id is required" };

    let orderDetails = await HostServiceBookingModel.findOne(
      { _id: mongoose.Types.ObjectId(data._id) },
      { host: 0 }
    )
      .populate("service_category", "category_name category_image")
      .populate({
        path: "service_id",
        model: "serviceProviderServices",
        populate: [
          {
            path: "serviceProvider",
            model: "serviceProvider",
            select:
              "first_name last_name country_code mobile_number email location profile_pic",
          },
        ],
      })
      .populate("address")
      .sort({ created_at: -1 })
      .lean();

    if (!orderDetails) {
      return {
        status: 0,
        message: "Unable to fetch service order details",
      };
    }
    if (data._id && host._id) {
      let service_id = orderDetails.service_id
        ? orderDetails.service_id._id
        : null;
      if (service_id != null) {
        let allRatings = await ServiceOrderRatingModel.find(
          {
            service_id: service_id,
            "uniqid.host_id": host._id,
            "booking.host_booking": data._id,
          },
          { uniqid: 0, booking: 0, service_provider_id: 0 }
        ).lean();
        orderDetails["rating"] = allRatings.length > 0 ? allRatings : [];
      }
    }
    let dataToSend = {
      orderDetails: orderDetails,
    };
    return {
      response: dataToSend,
      message: "Service order detail fetch successfully",
      status: 1,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.addServiceOrderRating = async (host, data) => {
  try {
    if (!data.service_provider_id || data.service_provider_id == "")
      return { status: 0, message: "Service provider id is required" };
    if (!data.service_id || data.service_id == "")
      return { status: 0, message: "Service id is required" };
    if (!data.booking_id || data.booking_id == "")
      return { status: 0, message: "Booking id is required" };
    if (!data.rating_point || data.rating_point == "")
      return { status: 0, message: "Rating is required" };
    // if (!data.review || data.review == '')
    //   return { status: 0, message: "Review is required" };

    let ratingData = await ServiceOrderRatingModel.findOne(
      {
        service_id: data.service_id,
        "uniqid.host_id": host._id,
        "booking.host_booking": data.booking_id,
      },
      { _id: 1 }
    ).lean();
    if (ratingData) {
      return {
        status: 2,
        message: "You have already given review to this service",
      };
    } else {
      let dataToSave = {
        uniqid: {
          user_id: host._id,
          host_id: host._id,
        },
        service_provider_id: data.service_provider_id,
        service_id: data.service_id,
        booking: {
          user_booking: data.booking_id,
          host_booking: data.booking_id,
        },
        rating_point: data.rating_point,
        review: data.review,
        created_at: new Date().getTime(),
      };
      let rating = await ServiceOrderRatingModel.create(dataToSave);
      let saveRating = rating.save();

      if (!saveRating) {
        return {
          status: 0,
          message: "Unable to add rating",
        };
      } else {
        let updateorder = await HostServiceBookingModel.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(data.booking_id) },
          { $set: { is_rated: true, service_rating: rating._id } },
          { new: true }
        ).lean();
      }

      return { message: "Rating details added successfully", status: 1 };
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getServiceRatings = async (host, data) => {
  try {
    if (!data.service_id || data.service_id == "")
      return { status: 0, message: "Service id is required" };

    let allRatings = await ServiceOrderRatingModel.find(
      { service_id: data.service_id },
      { booking: 0 }
    )
      .populate("uniqid.user_id", "full_name")
      .populate("uniqid.host_id", "first_name last_name")
      .populate(
        "service_provider_id",
        "first_name last_name country_code mobile_number email location"
      )
      .populate("service_id", "service_image price experience description")
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
    };

    return {
      response: dataToSend,
      message: "All ratings fetched successfully",
      status: 1,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getCancelServiceOrderReasonList = async (host) => {
  try {
    let cancelReasons = [
      "Not a right fit, the service is not for them",
      "Price is too high",
      "Not got the exact service as expected",
      "Not realizing the value proposition",
      "Poor utilization and/or adoption",
      "Not completed in time",
    ];
    let dataToSend = {
      cancelReasons: cancelReasons,
    };

    return {
      message: "Service order cancel reason list fetched successfully",
      status: 1,
      response: dataToSend,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.addPackage = async (host, data) => {
  try {
    let addPackage = new HostPackageModel();

    addPackage.package_name = data.package_name;
    addPackage.package_img = data.package_img;
    addPackage.breed = data.breed;
    addPackage.pet_size = data.pet_size;
    addPackage.description = data.description;
    addPackage.price = data.price;
    addPackage.duration = data.duration;
    addPackage.available_facilities = data.available_facilities;
    addPackage.host = host._id;

    // addPackage.available_facilities = Array.isArray(data.available_facilities)?data.available_facilities:JSON.parse(data.available_facilities);

    let result = await addPackage.save();

    if (!result) {
      return {
        status: 0,
        message: "Package can not be created",
      };
    } else {
      return {
        status: 1,
        message: "Package added Successfully",
        response: result,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getPackage = async (host) => {
  try {
    let packageList = await HostPackageModel.find({ host: host._id })
      .populate("breed", "subCategoryName")
      .sort({ createdAt: -1 })
      .lean();

      if(packageList.length > 0){
        for(let i=0; i < packageList.length; i++){
          let likedData = await userLikeModel.findOne({ "package.host_package": packageList[i]._id }).lean();
          packageList[i]['totalLike'] = likedData ? (Number(likedData.user.length)) : 0

          let allRatings = await PackageOrderRatingModel.find({ package_id: mongoose.Types.ObjectId(packageList[i]._id) },{ rating_point: 1, review: 1, created_at: 1 }).lean();
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
  
    if (!packageList) {
      return {
        status: 0,
        message: "No Package List Found",
      };
    } else {
      return {
        status: 1,
        message: "Package List Fetch Successfully",
        response: packageList,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getBreedList = async (host) => {
  try {
    let breedList = await productSubCategoryAdminModel
      .find({}, { categoryId: 0 })
      .lean();

    if (!breedList) {
      return {
        status: 0,
        message: "No list Found",
      };
    } else {
      return {
        status: 1,
        message: "Breed list fetch successfully",
        response: breedList,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.editPackage = async (host, data) => {
  try {
    let result = await HostPackageModel.findByIdAndUpdate(
      { _id: data._id },
      {
        $set: {
          package_name: data.package_name,
          package_img: data.package_img,
          breed: data.breed,
          pet_size: data.pet_size,
          description: data.description,
          price: data.price,
          duration: data.duration,
          available_facilities: data.available_facilities,
        },
      },
      {
        new: true,
      }
    ).lean();
    // available_facilities : Array.isArray(data.available_facilities)?data.available_facilities:JSON.parse(data.available_facilities)

    if (!result) {
      return {
        status: 0,
        message: "Unable to edit Package",
      };
    } else {
      return {
        status: 1,
        message: "Package updated successfully",
        response: result,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.viewPackge = async (host, data) => {
  try {
    if (!data._id || data._id == "")
      return { status: 0, message: "Package id is required" };

    let result = await HostPackageModel.findOne({ _id: data._id })
      .populate("breed", "subCategoryName")
      .lean();

    if (!result) {
      return {
        status: 0,
        message: "Can not view",
      };
    } else {
      let ratingCount = await PackageOrderRatingModel.countDocuments({ package_id: mongoose.Types.ObjectId(result._id) }).lean();
      result.ratingCount = ratingCount;

      return {
        status: 1,
        message: "Package details page",
        response: result,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deletePackage = async (host, data) => {
  try {
    if (!data._id || data._id == "")
      return { status: 0, message: "Package id is required" };

    let result = await HostPackageModel.findByIdAndDelete({ _id: data._id });

    if (!result) {
      return {
        status: 0,
        message: "Unable to delete package",
      };
    } else {
      return {
        status: 1,
        message: "Package delete successfully",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.newServicesList = async (host) => {
  try {
    let newDate = Date.now();

    let newServices = await PackageBookingModel.find({
      host_id: host._id,
      booking_status: 1,
      service_date: { $gte: newDate },
    })
      .populate("package_id", "package_name description")
      .populate("user", "full_name")
      .sort({ created_at: -1 })
      .lean();

    if (!newServices) {
      return {
        status: 0,
        message: "No List Found",
      };
    } else {
      return {
        status: 1,
        message: "New Package List Fetch successfully",
        response: newServices,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.activeServicesList = async (host) => {
  try {
    let newDate = Date.now();
    // console.log(newDate);

    let newServices = await PackageBookingModel.find({
      // host_id : host._id,
      // booking_status : { $in :[1, 2, 3] },
      payment_status: 1,
      // service_date : { $gte : newDate },
      $and: [
        { host_id: host._id },
        {
          $or: [
            {
              booking_status: { $in: [2, 3] },
            },
            {
              service_date: { $lte: newDate },
            },
          ],
        },
      ],
    })
      .populate("package_id")
      .populate("user", "full_name")
      .populate("pet_id")
      .sort({ created_at: -1 })
      .lean();

    let result = newServices.filter((item) => {
      if (item.package_id && item.package_id.duration) {
        let serviceDate = new Date(item.service_date);
        console.log(
          serviceDate.setDate(
            serviceDate.getDate() + item.package_id.duration
          ) +
            "  " +
            newDate
        );
        if (
          serviceDate.setDate(
            serviceDate.getDate() + item.package_id.duration
          ) >= newDate
        ) {
          return item;
        }
      }
    });

    if (!result) {
      return {
        status: 0,
        message: "No List Found",
      };
    } else {
      return {
        status: 1,
        message: "Active Packages List Fetch successfully",
        response: result,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.pastServicesList = async (host) => {
  try {
    let newDate = Date.now();
    // console.log(newDate);

    let newServices = await PackageBookingModel.find({
      host_id: host._id,
      booking_status: { $in: [4, 5] },
      payment_status: 1,
      // service_date : { $gte : newDate }
      // booking_status : { $in :[4,5] },
      // service_date : { $gte : newDate }
      // $and:[
      //   {host_id : host._id},
      //   {
      //     $or:[
      //       {
      //         booking_status : { $in :[4, 5] },
      //       }
      //     ]
      //   }
      // ]
    })
      .populate("package_id")
      .populate("user", "full_name")
      .populate("pet_id")
      .populate("package_rating",'rating_point review')
      .sort({ created_at: -1 })
      .lean();

    // let result = newServices.filter(item=>{
    //   if(item.package_id && item.package_id.duration){
    //     let serviceDate = new Date(item.service_date);
    //     console.log(serviceDate.setDate(serviceDate.getDate() + item.package_id.duration) +"  "+ newDate)
    //     if(serviceDate.setDate(serviceDate.getDate() + item.package_id.duration) <= newDate){
    //       return item;
    //     }
    //   }
    // })

    if (!newServices) {
      return {
        status: 0,
        message: "No List Found",
      };
    } else {
      return {
        status: 1,
        message: "Past Package List Fetch successfully",
        response: newServices,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.viewPackgeDetails = async (host, data) => {
  try {
    let viewData = await PackageBookingModel.findOne({
      _id: data._id,
      host_id: host._id,
    })
      .populate({
        path: "package_id",
        model: "hostPackage",
        select: "package_name package_img pet_size description breed",
        populate: [
          {
            path: "breed",
            model: "productSubCategory",
            select: "subCategoryName",
          },
        ],
      })
      .populate("user", "full_name")
      .populate("pet_id")
      .populate("package_rating",'rating_point review')
      .lean();

    if (!viewData) {
      return {
        status: 0,
        message: "Not Found...!!!",
      };
    }
    return {
      status: 1,
      message: "Data Fetch Successfully",
      response: viewData,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateServicesStatus = async (host, data) => {
  try {
    let status = await PackageBookingModel.findByIdAndUpdate(
      { _id: data._id },
      {
        $set: {
          booking_status: data.booking_status,
        },
      },
      { new: true }
    );

    if (!status) {
      return {
        status: 0,
        message: "Cann't Update",
      };
    } else {
      return {
        status: 1,
        message: "Booking Status Updated successfully",
        response: status,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.packagesPayment = async (host) => {
  try {
    let payment = await PackageBookingModel.find({ host_id : host._id, payment_status: 1 })
      .populate("user", "full_name")
      .populate("package_rating", "rating_point review")
      .sort({ created_at: -1 })
      .lean();

    let commission = await CommissionModel.findOne({}).lean();
    console.log(commission);
    payment.map((pData) => {
      let payAmount = pData.payable_amount;
      let commission1 = commission.commission_percent;
      let comPercent = (payAmount * commission1) / 100;
      comPercent = comPercent.toFixed(2);
      payAmount = payAmount - comPercent;
      pData.commission_percent = commission1;
      pData.payableAmountAfterCommission = payAmount;
    });

    if (!payment) {
      return {
        status: 0,
        message: "List not found",
      };
    }
    return {
      status: 1,
      message: "Payment list fetch successfully",
      response: payment,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.filterPackagePaymentList = async (host, data) => {
  try {
    if (!data.sortType || data.sortType == "")
      return { status: 0, message: "Sort type is required" };

    if (data.sortType == "3") {
      if (!data.startDate || data.startDate == "")
        return { status: 0, message: "Start date is required" };
      if (!data.endDate || data.endDate == "")
        return { status: 0, message: "End date is required" };
    }

    // let total_revenue = '0'
    // let pending_payments= '0'

    let payment = await PackageBookingModel.find({
      host_id: host._id,
      payment_status: 1,
    })
      .populate("user", "full_name")
      .populate("package_rating", "rating_point review")
      .sort({ created_at: -1 })
      .lean();

    let commission = await CommissionModel.findOne({}).lean();

    payment.map((pData) => {
      let payAmount = pData.payable_amount;
      let commission1 = commission.commission_percent;
      let comPercent = (payAmount * commission1) / 100;
      comPercent = comPercent.toFixed(2);
      payAmount = payAmount - comPercent;
      pData.commission_percent = commission1;
      pData.payableAmountAfterCommission = payAmount;
    });

    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    let todayStart = Date.parse(start);
    let weekStart = todayStart - 7 * 86400000;
    let monthStart = todayStart - 30 * 86400000;

    if (data.sortType == 0) {
      payment = _.filter(payment, (item) => item.created_at > todayStart);
    } else if (data.sortType == 1) {
      payment = _.filter(payment, (item) => item.created_at > weekStart);
    } else if (data.sortType == 2) {
      payment = _.filter(payment, (item) => item.created_at > monthStart);
    } else if (data.sortType == 3) {
      payment = _.filter(
        payment,
        (item) =>
          item.created_at >= data.startDate && item.created_at <= data.endDate
      );
    } else {
      payment = payment;
    }

    if (!payment) {
      return {
        status: 0,
        message: "No Data Found",
      };
    } else {
      return {
        status: 1,
        message: "Filtered Data",
        response: payment,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.pendingPayout = async (host, data) => {
  try {
    if (!data.sortType || data.sortType == "")
      return { status: 0, message: "Sort type is required" };

    var commission = await CommissionModel.findOne({}).lean();
    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    let todayStart = Date.parse(start);
    let weekStart = todayStart - 7 * 86400000;
    let monthStart = todayStart - 30 * 86400000;

    var productQuery = { host: host._id, paymentStatus: 1,is_refunded: { $ne: true }, $or: [{ orderStatus: 1 }, { orderStatus: 6 }] }
    var serviceQuery = { host: host._id, payment_status: 1,is_refunded: { $ne: true }, $or: [{ booking_status: 2 }, { booking_status: 6 }] }

    if(data.sortType == 0){
      productQuery = { ...productQuery }
      serviceQuery = { ...serviceQuery }
    }else if(data.sortType == 1){
      productQuery = { ...productQuery, created_at: { $gte : todayStart } }
      serviceQuery = { ...serviceQuery, created_at: { $gte : todayStart } }
    }else if(data.sortType == 2){
      productQuery = { ...productQuery, created_at: { $gte : weekStart } }
      serviceQuery = { ...serviceQuery, created_at: { $gte : weekStart } }
    }else if(data.sortType == 3){
      productQuery = { ...productQuery, created_at: { $gte : monthStart } }
      serviceQuery = { ...serviceQuery, created_at: { $gte : monthStart } }
    }else if(data.sortType == 4){
      if (!data.startDate || data.startDate == "")
        return { status: 0, message: "Start date is required" };
      if (!data.endDate || data.endDate == "")
        return { status: 0, message: "End date is required" };

      productQuery = { ...productQuery, $and: [ { created_at: { $gte : data.startDate } }, { created_at: { $lte : data.endDate } }]}
      serviceQuery = { ...serviceQuery, $and: [ { created_at: { $gte : data.startDate } }, { created_at: { $lte : data.endDate } }]}

    }

    var hostOrder = await HostOrderModel.find( productQuery , { order_id: 1, totalAmount:1, created_at:1, cart_id:1 }).lean();
    if(hostOrder.length > 0){
      for(let i=0; i< hostOrder.length; i++){
        let cartData = await HostCartModel.findOne({ _id: mongoose.Types.ObjectId(hostOrder[i].cart_id) },{ seller: 1 })
          .populate('seller.seller_id', 'first_name last_name country_code mobile_number email profile_pic')
          .populate('seller.admin_id', 'name email profileImage countryCode mobileNumber profileImage')
          .lean();
          
          hostOrder[i].commission = commission ? commission.commission_percent : 0;
          hostOrder[i]['seller'] = cartData ? cartData.seller : null;
          let discountAmount = (commission.commission_percent * hostOrder[i].totalAmount) / 100;
          let remainingAmount = Number(hostOrder[i].totalAmount) - Number(discountAmount);

          hostOrder[i]['payoutAmount'] = (Math.round(remainingAmount * 100) / 100).toFixed(2);
      }
    }

    var hostService = await HostServiceBookingModel.find( serviceQuery , { booking_id: 1, total_amount:1, created_at:1, service_provider:1 })
        .populate('service_provider', 'first_name last_name country_code mobile_number email profile_pic').lean();

    if(hostService.length > 0){
      for(let j=0; j< hostService.length; j++){
        hostService[j].commission = commission ? commission.commission_percent : 0;
        let discountAmount = (commission.commission_percent * hostService[j].total_amount) / 100;
        let remainingAmount = Number(hostService[j].total_amount) - Number(discountAmount);
        hostService[j]['payoutAmount'] = (Math.round(remainingAmount * 100) / 100).toFixed(2);
      }
    }

    let allData = [...hostOrder, ...hostService]
    if(allData.length > 0){
      allData = _.orderBy(allData, (item) => item.created_at, ["desc"]);
    }

    return {
      status: 1,
      message: "Pending payout fetched successfully",
      response: allData,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.hostTermCondition = async () => {
  try {
      var getTerm = await HostSettingModel.findOne().lean();

      if (!getTerm || getTerm.length < 1) {
          return 'Unable to fetch term & condition';
      }

    // return { message: "Term & conditions Fetched successfully", status: 1, response: getTerm.term_condition };
    return  getTerm.term_condition;


  } catch (error) {
      return {
          status: 0,
          message: error.message
      }
  }
};

exports.hostAboutUs = async () => {
  try {
      var getTerm = await HostSettingModel.findOne().lean();

      if (!getTerm || getTerm.length < 1) {
          return 'Unable to fetch term & condition';
      }

    // return { message: "About us Fetched successfully", status: 1, response: getTerm.about_us };
    return  getTerm.about_us;

  } catch (error) {
      return {
          status: 0,
          message: error.message
      }
  }
};

exports.hostContactUs = async () => {
  try {
      var getTerm = await HostSettingModel.findOne().lean();

      if (!getTerm || getTerm.length < 1) {
          return 'Unable to fetch term & condition';
      }

    // return { message: "Contact us Fetched successfully", status: 1, response: getTerm.contact_us };
    return  getTerm.help;


  } catch (error) {
      return {
          status: 0,
          message: error.message
      }
  }
};

exports.hostPrivacyPolicy = async () => {
  try {
      var getTerm = await HostSettingModel.findOne().lean();

      if (!getTerm || getTerm.length < 1) {
          return 'Unable to fetch term & condition';
      }

    // return { message: "Privacy Policy Fetched successfully", status: 1, response: getTerm.privacy_policy };
    return  getTerm.privacy_policy;

  } catch (error) {
      return {
          status: 0,
          message: error.message
      }
  }
};

exports.getHostFaqList = async () => {
  try {
      var getFaq = await HostFaqModel.find().lean();

      if (!getFaq || getFaq.length < 1) {
          return {
              status: 0,
              message: 'Something went wrong or no question answer'
          }
      }

      let dataToSend = {
        faqList: getFaq
      }

    return { message: "FAQ Fetched successfully", status: 1, response: dataToSend };

  } catch (error) {
      return {
          status: -1,
          message: error.message
      }
  }
}

exports.getHostFaq = async () => {
  try {
      var getTerm = await HostSettingModel.findOne().lean();

      if (!getTerm || getTerm.length < 1) {
          return 'Unable to fetch faq';
      }

    return  getTerm.faq;

  } catch (error) {
      return {
          status: 0,
          message: error.message
      }
  }
};

exports.getDashboardData = async (host, data) => {
  try {
    if (!data.sortType || data.sortType == "")
      return { status: 0, message: "Sort type is required" };

    if (data.sortType == "4") {
      if (!data.startDate || data.startDate == "")
        return { status: 0, message: "Start date is required" };
      if (!data.endDate || data.endDate == "")
        return { status: 0, message: "End date is required" };
    }

    let activeBookingQuery = { host_id: mongoose.Types.ObjectId(host._id), payment_status: 1, $or: [{ booking_status: 1 },{ booking_status: 2 },{ booking_status: 3 }] }
    let completedBookingQuery = { host_id: mongoose.Types.ObjectId(host._id), payment_status: 1, $or: [{ booking_status: 4 }] }
    let cancelledBookingQuery = { host_id: mongoose.Types.ObjectId(host._id), payment_status: 1, $or: [{ booking_status: 5 }] }
    let totalPackagesQuery = { host: mongoose.Types.ObjectId(host._id) }

    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    let todayStart = Date.parse(start);
    let weekStart = todayStart - 7 * 86400000;
    let monthStart = todayStart - 30 * 86400000;

    if(data.sortType == 0){
      activeBookingQuery = { ...activeBookingQuery }
      completedBookingQuery = { ...completedBookingQuery }
      cancelledBookingQuery = { ...cancelledBookingQuery }
      totalPackagesQuery = { ...totalPackagesQuery }
    }else if(data.sortType == 1){
      activeBookingQuery = { ...activeBookingQuery, created_at: { $gte: todayStart } }
      completedBookingQuery = { ...completedBookingQuery, created_at: { $gte: todayStart } }
      cancelledBookingQuery = { ...cancelledBookingQuery, created_at: { $gte: todayStart } }
      totalPackagesQuery = { ...totalPackagesQuery, createdAt: { $gte: todayStart } }
    }else if(data.sortType == 2){
      activeBookingQuery = { ...activeBookingQuery, created_at: { $gte: weekStart } }
      completedBookingQuery = { ...completedBookingQuery, created_at: { $gte: weekStart } }
      cancelledBookingQuery = { ...cancelledBookingQuery, created_at: { $gte: weekStart } }
      totalPackagesQuery = { ...totalPackagesQuery, createdAt: { $gte: weekStart } }
    }else if(data.sortType == 3){
      activeBookingQuery = { ...activeBookingQuery, created_at: { $gte: monthStart } }
      completedBookingQuery = { ...completedBookingQuery, created_at: { $gte: monthStart } }
      cancelledBookingQuery = { ...cancelledBookingQuery, created_at: { $gte: monthStart } }
      totalPackagesQuery = { ...totalPackagesQuery, createdAt: { $gte: monthStart } }
    }else if(data.sortType == 4){
      activeBookingQuery = { ...activeBookingQuery, $and:[{created_at: { $gte: data.startDate }},{created_at: { $lte: data.endDate }}] }
      completedBookingQuery = { ...completedBookingQuery, $and:[{created_at: { $gte: data.startDate }},{created_at: { $lte: data.endDate }}]}
      cancelledBookingQuery = { ...cancelledBookingQuery, $and:[{created_at: { $gte: data.startDate }},{created_at: { $lte: data.endDate }}] }
      totalPackagesQuery = { ...totalPackagesQuery, $and:[{createdAt: { $gte: data.startDate }},{createdAt: { $lte: data.endDate }}] }
    }

    let activeBooking = await PackageBookingModel.countDocuments(activeBookingQuery).lean();
    let completedBooking = await PackageBookingModel.countDocuments(completedBookingQuery).lean();
    let cancelledBooking = await PackageBookingModel.countDocuments(cancelledBookingQuery).lean();
    let totalPackages = await HostPackageModel.countDocuments(totalPackagesQuery).lean();

    //code for graph start
    let todayPayableAmount = "0";
    let yesterdayPayableAmount = "0";
    let twoDaysBackPayableAmount = "0";
    let threeDaysBackPayableAmount = "0";
    let fourDaysBackPayableAmount = "0";
    let fiveDaysBackPayableAmount = "0";
    let sixDaysBackPayableAmount = "0";

    let yesterdayStart = todayStart - 1 * 86400000;
    let twoDaysBackStart = todayStart - 2 * 86400000;
    let threeDaysBackStart = todayStart - 3 * 86400000;
    let fourDaysBackStart = todayStart - 4 * 86400000;
    let fiveDaysBackStart = todayStart - 5 * 86400000;
    let sixDaysBackStart = todayStart - 6 * 86400000;

    var commission = await CommissionModel.findOne({}).lean();
    let completedHostTodayBooking = await PackageBookingModel.find({ host_id: mongoose.Types.ObjectId(host._id), payment_status: 1, $or: [{ booking_status: 4 }], created_at: { $gte: todayStart }},{ payable_amount: 1 }).lean();
    if (completedHostTodayBooking.length > 0) {
      let todaySum = completedHostTodayBooking.reduce((accumulator, object) => {
        return accumulator + object.payable_amount;
      }, 0);
      let todayDiscountAmount = (commission.commission_percent * todaySum) / 100;
      todayPayableAmount = (Number(todaySum) - Number(todayDiscountAmount)).toFixed(2);
    }
    let completedHostYesterdayBooking = await PackageBookingModel.find({ host_id: mongoose.Types.ObjectId(host._id), payment_status: 1, $or: [{ booking_status: 4 }], $and:[{created_at: { $gte: yesterdayStart }},{created_at: { $lt: todayStart }}]},{ payable_amount: 1 }).lean();
    if (completedHostYesterdayBooking.length > 0) {
      let yesterdaySum = completedHostYesterdayBooking.reduce((accumulator, object) => {
        return accumulator + object.payable_amount;
      }, 0);
      let yestDiscountAmount = (commission.commission_percent * yesterdaySum) / 100;
      yesterdayPayableAmount = (Number(yesterdaySum) - Number(yestDiscountAmount)).toFixed(2);
    }
    let completedTwoDaysBackBooking = await PackageBookingModel.find({ host_id: mongoose.Types.ObjectId(host._id), payment_status: 1, $or: [{ booking_status: 4 }], $and:[{created_at: { $gte: twoDaysBackStart }},{created_at: { $lt: yesterdayStart }}]},{ payable_amount: 1 }).lean();
    if (completedTwoDaysBackBooking.length > 0) {
      let twoDaysBackSum = completedTwoDaysBackBooking.reduce((accumulator, object) => {
        return accumulator + object.payable_amount;
      }, 0);
      let twoDaysBackDiscountAmount = (commission.commission_percent * twoDaysBackSum) / 100;
      twoDaysBackPayableAmount = (Number(twoDaysBackSum) - Number(twoDaysBackDiscountAmount)).toFixed(2);
    }
    let completedThreeDaysBackBooking = await PackageBookingModel.find({ host_id: mongoose.Types.ObjectId(host._id), payment_status: 1, $or: [{ booking_status: 4 }], $and:[{created_at: { $gte: threeDaysBackStart }},{created_at: { $lt: twoDaysBackStart }}]},{ payable_amount: 1 }).lean();
    if (completedThreeDaysBackBooking.length > 0) {
      let threeDaysBackSum = completedThreeDaysBackBooking.reduce((accumulator, object) => {
        return accumulator + object.payable_amount;
      }, 0);
      let threeDaysBackDiscountAmount = (commission.commission_percent * threeDaysBackSum) / 100;
      threeDaysBackPayableAmount = (Number(threeDaysBackSum) - Number(threeDaysBackDiscountAmount)).toFixed(2);
    }
    let completedFourDaysBackBooking = await PackageBookingModel.find({ host_id: mongoose.Types.ObjectId(host._id), payment_status: 1, $or: [{ booking_status: 4 }], $and:[{created_at: { $gte: fourDaysBackStart }},{created_at: { $lt: threeDaysBackStart }}]},{ payable_amount: 1 }).lean();
    if (completedFourDaysBackBooking.length > 0) {
      let fourDaysBackSum = completedFourDaysBackBooking.reduce((accumulator, object) => {
        return accumulator + object.payable_amount;
      }, 0);
      let fourDaysBackDiscountAmount = (commission.commission_percent * fourDaysBackSum) / 100;
      fourDaysBackPayableAmount = (Number(fourDaysBackSum) - Number(fourDaysBackDiscountAmount)).toFixed(2);
    }
    let completedFiveDaysBackBooking = await PackageBookingModel.find({ host_id: mongoose.Types.ObjectId(host._id), payment_status: 1, $or: [{ booking_status: 4 }], $and:[{created_at: { $gte: fiveDaysBackStart }},{created_at: { $lt: fourDaysBackStart }}]},{ payable_amount: 1 }).lean();
    if (completedFiveDaysBackBooking.length > 0) {
      let fiveDaysBackSum = completedFiveDaysBackBooking.reduce((accumulator, object) => {
        return accumulator + object.payable_amount;
      }, 0);
      let fiveDaysBackDiscountAmount = (commission.commission_percent * fiveDaysBackSum) / 100;
      fiveDaysBackPayableAmount = (Number(fiveDaysBackSum) - Number(fiveDaysBackDiscountAmount)).toFixed(2);
    }
    let completedSixDaysBackBooking = await PackageBookingModel.find({ host_id: mongoose.Types.ObjectId(host._id), payment_status: 1, $or: [{ booking_status: 4 }], $and:[{created_at: { $gte: sixDaysBackStart }},{created_at: { $lt: fiveDaysBackStart }}]},{ payable_amount: 1 }).lean();
    if (completedSixDaysBackBooking.length > 0) {
      let sixDaysBackSum = completedSixDaysBackBooking.reduce((accumulator, object) => {
        return accumulator + object.payable_amount;
      }, 0);
      let sixDaysBackDiscountAmount = (commission.commission_percent * sixDaysBackSum) / 100;
      sixDaysBackPayableAmount = (Number(sixDaysBackSum) - Number(sixDaysBackDiscountAmount)).toFixed(2);
    }
    //code for graph end


    let dataToSend = {
      activeBooking,
      completedBooking,
      cancelledBooking,
      totalPackages,
      graphData: {
        todayPayableAmount,
        yesterdayPayableAmount,
        twoDaysBackPayableAmount,
        threeDaysBackPayableAmount,
        fourDaysBackPayableAmount,
        fiveDaysBackPayableAmount,
        sixDaysBackPayableAmount
      }
    }

    return {
      status: 1,
      message: "Dashboard data fetch successfully",
      response: dataToSend,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};


exports.getRefundList = async (host, data) => {
  try {
    if (!data.sortType || data.sortType == "")
      return { status: 0, message: "Sort type is required" };

    var commission = await CommissionModel.findOne({}).lean();
    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    let todayStart = Date.parse(start);
    let weekStart = todayStart - 7 * 86400000;
    let monthStart = todayStart - 30 * 86400000;

    var productQuery = { host: host._id, paymentStatus: 1, is_refunded: true, $or: [{ orderStatus: 1 }, { orderStatus: 6 }] }
    var serviceQuery = { host: host._id, payment_status: 1, is_refunded: true, $or: [{ booking_status: 2 }, { booking_status: 6 }] }

    if(data.sortType == 0){
      productQuery = { ...productQuery }
      serviceQuery = { ...serviceQuery }
    }else if(data.sortType == 1){
      productQuery = { ...productQuery, created_at: { $gte : todayStart } }
      serviceQuery = { ...serviceQuery, created_at: { $gte : todayStart } }
    }else if(data.sortType == 2){
      productQuery = { ...productQuery, created_at: { $gte : weekStart } }
      serviceQuery = { ...serviceQuery, created_at: { $gte : weekStart } }
    }else if(data.sortType == 3){
      productQuery = { ...productQuery, created_at: { $gte : monthStart } }
      serviceQuery = { ...serviceQuery, created_at: { $gte : monthStart } }
    }else if(data.sortType == 4){
      if (!data.startDate || data.startDate == "")
        return { status: 0, message: "Start date is required" };
      if (!data.endDate || data.endDate == "")
        return { status: 0, message: "End date is required" };

      productQuery = { ...productQuery, $and: [ { created_at: { $gte : data.startDate } }, { created_at: { $lte : data.endDate } }]}
      serviceQuery = { ...serviceQuery, $and: [ { created_at: { $gte : data.startDate } }, { created_at: { $lte : data.endDate } }]}

    }

    var hostOrder = await HostOrderModel.find( productQuery , { order_id: 1, totalAmount:1, created_at:1, cart_id:1, is_refunded:1 }).lean();
    if(hostOrder.length > 0){
      for(let i=0; i< hostOrder.length; i++){
        let cartData = await HostCartModel.findOne({ _id: mongoose.Types.ObjectId(hostOrder[i].cart_id) },{ seller: 1 })
          .populate('seller.seller_id', 'first_name last_name country_code mobile_number email profile_pic')
          .populate('seller.admin_id', 'name email profileImage countryCode mobileNumber profileImage')
          .lean();
          
          hostOrder[i].commission = commission ? commission.commission_percent : 0;
          hostOrder[i]['seller'] = cartData ? cartData.seller : null;
          let discountAmount = (commission.commission_percent * hostOrder[i].totalAmount) / 100;
          let remainingAmount = Number(hostOrder[i].totalAmount) - Number(discountAmount);

          hostOrder[i]['payoutAmount'] = (Math.round(remainingAmount * 100) / 100).toFixed(2);
      }
    }

    var hostService = await HostServiceBookingModel.find( serviceQuery , { booking_id: 1, total_amount:1, created_at:1, service_provider:1, is_refunded:1 })
        .populate('service_provider', 'first_name last_name country_code mobile_number email profile_pic').lean();

    if(hostService.length > 0){
      for(let j=0; j< hostService.length; j++){
        hostService[j].commission = commission ? commission.commission_percent : 0;
        let discountAmount = (commission.commission_percent * hostService[j].total_amount) / 100;
        let remainingAmount = Number(hostService[j].total_amount) - Number(discountAmount);
        hostService[j]['payoutAmount'] = (Math.round(remainingAmount * 100) / 100).toFixed(2);
      }
    }

    let allData = [...hostOrder, ...hostService]
    if(allData.length > 0){
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

exports.hostLikeProduct = async(host, body)=>{
  try {
    let checkSellerProduct  = await ProductCatModel.findOne({_id : body.product_id}).lean();
    if(!checkSellerProduct){
      checkSellerProduct = await TrackingDeviceModel.findOne({_id : body.product_id}).lean();
    }
    if(!checkSellerProduct){
      return{
        status : 0,
        message : "Product Not Found"
      }
    }

    let data = await userLikeModel.findOne({
      $or : [{"product.seller_product": body.product_id},{"product.admin_product": body.product_id}]
    })


    if (!data) {
      let dataToSave = {
        product: {
          seller_product:  body.product_id,
          admin_product:  body.product_id,
        },
        host: host._id
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
    }else{
      let likeData = await userLikeModel.findOne({
        $or : [{"product.seller_product": body.product_id},{"product.admin_product": body.product_id}], host: host._id
      })
      if(!likeData){
        let likeData = await userLikeModel.findOneAndUpdate({ _id: data._id }, { $push: { host: host._id }  },{ new: true }).lean();
        if(!likeData){
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

exports.hostUnlikeProduct = async (host, body) => {
  try {
    let dissLike = await userLikeModel.findOne(
      {
        $or: [{"product.seller_product": body.product_id},{"product.admin_product": body.product_id}],
        host:host._id
      }
    );
    if (dissLike) {
      let dislikeData = await userLikeModel.findOneAndUpdate({ _id: dissLike._id }, { $pull: { host: mongoose.Types.ObjectId(host._id) }  },{ new: true }).lean();
      if(!dislikeData){
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

exports.hostLikeService = async(host, body)=>{

  try {
    let checkSellerProduct  = await ServiceProviderServicesModel.findOne({_id : body.service_id}).lean();
    
    if(!checkSellerProduct){
      return{
        status : 0,
        message : "Service Not Found"
      }
    }

    let data = await userLikeModel.findOne({
      $or : [{"service.service_provider_services": body.service_id}]
    })

    if (!data) {
      let dataToSave = {
        service: {
          service_provider_services:  body.service_id,
        },
        host: host._id
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
    }else{
      let likeData = await userLikeModel.findOne({
        $or : [{"service.service_provider_services": body.product_id}], host: host._id
      })
      if(!likeData){
        let likeData = await userLikeModel.findOneAndUpdate({ _id: data._id }, { $push: { host: host._id }  },{ new: true }).lean();
        if(!likeData){
          return {
            status: 2,
            message: "Unable to like service"
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

exports.hostUnlikeService = async (host, body) => {
  try {
    let dissLike = await userLikeModel.findOne(
      {
        $or: [{"service.service_provider_services": body.service_id}],
        host:host._id
      }
    );
    if (dissLike) {
      let dislikeData = await userLikeModel.findOneAndUpdate({ _id: dissLike._id }, { $pull: { host: mongoose.Types.ObjectId(host._id) }  },{ new: true }).lean();
      if(!dislikeData){
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

exports.filterAllProducts = async (host, body) => {
  try {
    let { filter_rating, filter_price, cat_id } = body;
    // let skip = (page <= 1 || !page)?0:(page-1)*10;
    let  query = { product_main_cat: mongoose.Types.ObjectId(body.main_cat_id)  }
    if(cat_id && cat_id != ""){
      query = { product_main_cat: mongoose.Types.ObjectId(body.main_cat_id), product_cat: mongoose.Types.ObjectId(cat_id)  }
    }
    let data = await ProductCatModel.aggregate([
      { $match:  query },
      {
        $lookup: {
          from: "hostCart",
          let: {
            productId: "$_id",
            hostId: host._id,
            isDeleted: false,
            status: 0,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $or: [
                        { $eq: ["$product.seller_product", "$$productId"] },
                        { $eq: ["$product.admin_product", "$$productId"] },
                      ],
                    },
                    { $eq: ["$host", "$$hostId"] },
                    { $eq: ["$isDeleted", "$$isDeleted"] },
                    { $eq: ["$status", "$$status"] },
                  ],
                },
              },
            },
          ],
          as: "hostCart",
        },
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "product_cat",
          foreignField: "_id",
          as: "product_cat",
        },
      },
      {
        $lookup: {
          from: "productmaincategories",
          localField: "product_main_cat",
          foreignField: "_id",
          as: "product_main_cat",
        },
      },
      {
        $lookup: {
          from: "productsubcategories",
          localField: "breed_type",
          foreignField: "_id",
          as: "breed_type",
        },
      },
      { $unwind: "$product_cat" },
      { $unwind: "$product_main_cat" },
      { $unwind: "$breed_type" },
      

      { $project: { hostCartData: 0, cartData: 0 } }, // Return all but the specified fields
      // {$skip:skip},
      // {$limit:10},
    ]);

    let data1 = await HostWishlistModel.find({ host: host._id });
    let fav_arr = [];
    let new_list = [];
    for (let i = 0; i < data1.length; i++) {
      if (data1[i].product.seller_product) {
        fav_arr.push(data1[i].product.seller_product.toString());
      }
    }
    for (let k = 0; k < data.length; k++) {
      new_list.push(data[k]._id.toString());
    }
    for (let j = 0; j < new_list.length; j++) {
      if (data[j].hostCart.length > 0) {
        data[j].isCartAdded = true;
        data[j].cartId = data[j].hostCart[0]._id;
        data[j].cartQuantity = data[j].hostCart[0].quantity;
      } else {
        data[j].isCartAdded = false;
        data[j].cartId = null;
        data[j].cartQuantity = 0;
      }
      if (fav_arr.length > 0 && fav_arr.includes(new_list[j])) {
        data[j].isfavorite = true;
      } else {
        data[j].isfavorite = false;
      }
      let allRatings = await OrderRatingModel.find({ $or:[{ "product.seller_product": new_list[j] },{ "product.admin_product": new_list[j] }] },{ uniqid: 0, product:0, order_id: 0 }).lean();
        let avgRating = "0";
        if (allRatings.length > 0) {
          let sum = allRatings.reduce((accumulator, object) => {
            return accumulator + object.rating_point;
          }, 0);
          avgRating = (sum / allRatings.length);
        }
        data[j].rating = Math.round (avgRating * 10) / 10;
        data[j].ratingCount = allRatings.length;

      let liked = await userLikeModel.findOne(
        {
          $or: [{"product.seller_product": new_list[j]},{"product.admin_product": new_list[j]}],
          host: host._id
        }
      );
      data[j].is_liked = liked ? 1 : 0;
    }

    // if(filter_rating != ""){
      if(Number(filter_rating) == 0){
        data = _.filter(data, (item) => Number(item.rating) < 1);
      }else if(Number(filter_rating) == 1){
        data = _.filter(data, (item) => ((Number(item.rating) >= 1) && (Number(item.rating) < 2)));
      }else if(Number(filter_rating) == 2){
        data = _.filter(data, (item) => ((Number(item.rating) >= 2) && (Number(item.rating) < 3)));
      }else if(Number(filter_rating) == 3){
        data = _.filter(data, (item) => ((Number(item.rating) >= 3) && (Number(item.rating) < 4)));
      }else if((Number(filter_rating) == 4) || (Number(filter_rating) == 5)){
        data = _.filter(data, (item) => ((Number(item.rating) >= 4) && (Number(item.rating) <= 5)));
      }else{
        data = data;
      }
    // }
    if(filter_price && filter_price != ""){
      if(filter_price == -1){
        data = _.orderBy(data, item => Number(item.selling_price), ['desc']);
      }else{
        data = _.orderBy(data, item => Number(item.selling_price), ['asc']);
      }
    }

    if (data) {
      return {
        status: 1,
        response: data,
        message: "Product Category Data",
      };
    } else {
      return {
        status: 2,
        message: "Not Found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.filterProducts = async (host, body) => {
  try {
    let data = await ProductCatModel.aggregate([
      {
        $match: {
          product_main_cat: mongoose.Types.ObjectId(body.main_cat_id),
          product_cat: mongoose.Types.ObjectId(body.cat_id),
        },
      },
      {
        $lookup: {
          from: "hostCart",
          let: { productId: "$_id", hostId: host._id },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $or: [
                        { $eq: ["$product.seller_product", "$$productId"] },
                        { $eq: ["$product.admin_product", "$$productId"] },
                      ],
                    },
                    { $eq: ["$host", "$$hostId"] },
                  ],
                },
              },
            },
          ],
          as: "hostCart",
        },
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "product_cat",
          foreignField: "_id",
          as: "product_cat",
        },
      },
      {
        $lookup: {
          from: "productmaincategories",
          localField: "product_main_cat",
          foreignField: "_id",
          as: "product_main_cat",
        },
      },
      {
        $lookup: {
          from: "productsubcategories",
          localField: "breed_type",
          foreignField: "_id",
          as: "breed_type",
        },
      },
      { $unwind: { path: "$product_cat", preserveNullAndEmptyArrays: true } },
      {
        $unwind: {
          path: "$product_main_cat",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $unwind: { path: "$breed_type", preserveNullAndEmptyArrays: true } },
      { $project: { hostCartData: 0, cartData: 0 } }, // Return all but the specified fields
    ]);

    let data1 = await HostWishlistModel.find({ host: host._id });
    let fav_arr = [];
    for (let i = 0; i < data1.length; i++) {
      if (data1[i].product.seller_product) {
        fav_arr.push(data1[i].product.seller_product.toString());
      }
    }
    data.map((item) => {
      item.isCartAdded = item.hostCart[0] ? true : false;
      item.cartId = item.hostCart[0] ? item.hostCart[0]._id : null;
      item.cartQuantity = item.hostCart[0] ? item.hostCart[0].quantity : 0;
      item.isfavorite =
        fav_arr.length > 0 && fav_arr.includes(item._id.toString())
          ? true
          : false;
    });


    if(body.filter_rating || body.filter_rating != ""){
      data = _.filter(data, (item) => Number(item.rating) >= Number(body.filter_rating));
    }
    if(body.filter_price || body.filter_price != ""){
      if(body.filter_price == -1){
        data = _.orderBy(data, item => Number(item.selling_price), ['desc']);
      }else{
        data = _.orderBy(data, item => Number(item.selling_price), ['asc']);
      }
    }
    
    if (data) {
      return {
        status: 1,
        response: data,
        message: "Product Category Fetch",
      };
    } else {
      return {
        status: 2,
        message: "Not Found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.searchAllProducts = async (host, body) => {
  try {
   
    let { name } = body;
    
    let data = await ProductCatModel.aggregate([
      { $match: { product_main_cat: mongoose.Types.ObjectId(body.main_cat_id), product_quantity: { $gt :0 }, $expr: {$gt: ["$product_quantity", "$sku_min_limit"]}, product_name: { $regex: name, $options: 'i' }} },
      {
        $lookup: {
          from: "hostCart",
          let: {
            productId: "$_id",
            hostId: host._id,
            isDeleted: false,
            status: 0,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $or: [
                        { $eq: ["$product.seller_product", "$$productId"] },
                        { $eq: ["$product.admin_product", "$$productId"] },
                      ],
                    },
                    { $eq: ["$host", "$$hostId"] },
                    { $eq: ["$isDeleted", "$$isDeleted"] },
                    { $eq: ["$status", "$$status"] },
                  ],
                },
              },
            },
          ],
          as: "hostCart",
        },
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "product_cat",
          foreignField: "_id",
          as: "product_cat",
        },
      },
      {
        $lookup: {
          from: "productmaincategories",
          localField: "product_main_cat",
          foreignField: "_id",
          as: "product_main_cat",
        },
      },
      {
        $lookup: {
          from: "productsubcategories",
          localField: "breed_type",
          foreignField: "_id",
          as: "breed_type",
        },
      },
      {
        $lookup:{
          from:"Seller",
          localField:"seller",
          foreignField:"_id",
          as:"seller"
        }
      },
      { $unwind: "$product_cat" },
      { $unwind: "$product_main_cat" },
      { $unwind: "$breed_type" },
      { $unwind: "$seller" },
      

      { $project: { hostCartData: 0, cartData: 0 } }, // Return all but the specified fields
    ]);

    let data1 = await HostWishlistModel.find({ host: host._id });
    let fav_arr = [];
    let new_list = [];
    for (let i = 0; i < data1.length; i++) {
      if (data1[i].product.seller_product) {
        fav_arr.push(data1[i].product.seller_product.toString());
      }
    }
    for (let k = 0; k < data.length; k++) {
      new_list.push(data[k]._id.toString());
    }
    for (let j = 0; j < new_list.length; j++) {
      if (data[j].hostCart.length > 0) {
        data[j].isCartAdded = true;
        data[j].cartId = data[j].hostCart[0]._id;
        data[j].cartQuantity = data[j].hostCart[0].quantity;
      } else {
        data[j].isCartAdded = false;
        data[j].cartId = null;
        data[j].cartQuantity = 0;
      }
      if (fav_arr.length > 0 && fav_arr.includes(new_list[j])) {
        data[j].isfavorite = true;
      } else {
        data[j].isfavorite = false;
      }
      let allRatings = await OrderRatingModel.find({ $or:[{ "product.seller_product": new_list[j] },{ "product.admin_product": new_list[j] }] },{ uniqid: 0, product:0, order_id: 0 }).lean();
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
          $or: [{"product.seller_product": new_list[j]},{"product.admin_product": new_list[j]}],
          host: host._id
        }
      );
      data[j].is_liked = liked ? 1 : 0;
    }
    if (data) {
      return {
        status: 1,
        response: data,
        message: "Product Category Data",
      };
    } else {
      return {
        status: 2,
        message: "Not Found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.searchPackage = async (host, body) => {
  try {
    let { name } = body;
    let packageList = await HostPackageModel.find({ host: host._id, package_name: { $regex: name, $options: 'i' } })
      .populate("breed", "subCategoryName")
      .sort({ createdAt: -1 })
      .lean();

      if(packageList.length > 0){
        for(let i=0; i < packageList.length; i++){
          let likedData = await userLikeModel.findOne({ "package.host_package": packageList[i]._id }).lean();
          packageList[i]['totalLike'] = likedData ? (Number(likedData.user.length)) : 0

          let allRatings = await PackageOrderRatingModel.find({ package_id: mongoose.Types.ObjectId(packageList[i]._id) },{ rating_point: 1, review: 1, created_at: 1 }).lean();
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
  
    if (!packageList) {
      return {
        status: 0,
        message: "No Package List Found",
      };
    } else {
      return {
        status: 1,
        message: "Package List Fetch Successfully",
        response: packageList,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.searchServiceProviderServicesList = async (data) => {
  try {
    let { name } = data;
    
    let serviceProvider = await ServiceProviderModel.find({ $or:[{ first_name: { $regex: name, $options: 'i' } },{ last_name: { $regex: name, $options: 'i' } }] }).select('_id').lean();
    let ids = [];
    let services = [];
    if(serviceProvider.length > 0){
      serviceProvider.map(e => ids.push(e._id))
    }
    if(ids.length > 0){
      services = await ServiceProviderServicesModel.find({ serviceProvider: { $in: ids }})
          .populate('serviceProvider', 'first_name last_name country_code mobile_number email profile_pic location').lean();

      if(services.length > 0){
        for(let i=0; i< services.length; i++){
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
      {$match:{ product_quantity: { $gt :0 }, $expr: {$gt: ["$product_quantity", "$sku_min_limit"]}, product_name: { $regex: name, $options: 'i' }}},
      {
        $lookup:{
          from:"userCart",
          let:{'productId':'$_id', 'isDeleted': false, 'status': 0 },
          pipeline:[
            {$match:{$expr:{ $and: [{ $or:[{$eq:['$product.seller_product','$$productId']},{$eq:['$product.admin_product','$$productId']}]},{$eq:['$isDeleted','$$isDeleted']},{$eq:['$status','$$status']} ] }}}
          ],
          as:"userCart"
        }
      },
      {
        $lookup:{
          from:"productcategories",
          localField:"product_cat",
          foreignField:"_id",
          as:"product_cat"
        }
      },
      {
        $lookup:{
          from:"productmaincategories",
          localField:"product_main_cat",
          foreignField:"_id",
          as:"product_main_cat"
        }
      },
      {
        $lookup:{
          from:"productsubcategories",
          localField:"breed_type",
          foreignField:"_id",
          as:"breed_type"
        }
      },
      {
        $lookup:{
          from:"Seller",
          localField:"seller",
          foreignField:"_id",
          as:"seller"
        }
      },
      {
        $unwind:{
          path:"$product_cat",
          preserveNullAndEmptyArrays:true
        },
      },
      {
        $unwind:{
          path:"$seller",
          preserveNullAndEmptyArrays:true
        }
      },
      {
        $unwind:{
          path:"$product_main_cat",
          preserveNullAndEmptyArrays:true
        }
      },
      {
        $unwind:{
          path:"$breed_type",
          preserveNullAndEmptyArrays:true
        }
      },
    ])
    let new_list = [];
    if(data.length > 0){
      for (let k = 0; k < data.length; k++) {
        new_list.push(data[k]._id.toString());
      }
      for (let j = 0; j < new_list.length; j++) {
        data[j].isCartAdded = false
        data[j].cartId = null;
        data[j].cartQuantity = 0;
        data[j].isfavorite  = false
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

exports.deleteAccount = async (user) => {
  try {
  
    var deleteUser = await HostModel.findOneAndDelete({  _id: mongoose.Types.ObjectId(user._id) }).lean();
        
    return {  message: "Account deleted successfully", status: 1  };

  } catch (err) {
    throw new Error(err.message);
  }
};

exports.calculateServiceCharge = async (user, data) => {
  try {
    let { amount } = data;
    if (!amount || amount == "")
      return { status: 0, message: "Amount is required" };

    let  serviceChargeAmount = 0;
    let serviceCharge = await ServiceChargeModel.findOne({}).lean();
    if(serviceCharge){
      let discountAmount = (serviceCharge.service_charge * Number(amount)) / 100;
      serviceChargeAmount = (Math.round(discountAmount * 100) / 100).toFixed(2);
      let remainingAmount = Number(amount) + Number(discountAmount);
      amount = (Math.round(remainingAmount * 100) / 100).toFixed(2);
    }else{
      serviceChargeAmount= serviceChargeAmount,
      amount = amount
    }

    let dataToSave = {
      serviceChargeAmount: serviceChargeAmount,
      finalAmount: amount,
      serviceChargePercent: serviceCharge ? serviceCharge.service_charge :0
    }
    return {  message: "Account deleted successfully", status: 1, response: dataToSave };

  } catch (err) {
    throw new Error(err.message);
  }
};

exports.updateHostData = async (host, data) => {
  try {
    let { unique_id, evidence_id } = data;

    let result = await HostModel.findOneAndUpdate({ _id: host._id },{ $set: { unique_id: unique_id, evidence_id: evidence_id } },{ new: true }).lean();
    if(!result){
      return { status: 0, message: "Unable to update data" };
    }
    return {  message: "Data updated successfully", status: 1 };

  } catch (err) {
    throw new Error(err.message);
  }
};