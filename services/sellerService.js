const { SellerModel } = require("../models/sellerModel");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const authentication = require("../middlewares/authentication");
const pdf = require("pdf-creator-node");
const config = require("../config/config");
const {
  productCategoryAdminModel,
} = require("../models/productCategoryAdminModel");
const {
  productSubCategoryAdminModel,
} = require("../models/productSubCategoryAdminModel");
const { ProductCatModel } = require("../models/sellerProductModel");
const {
  productMainCategoryAdminModel,
} = require("../models/productMainCategoryModel");
const { HostOrderBookingModel } = require("../models/hostOrderBookingModel");
const { UserOrderBookingModel } = require("../models/userOrderBookingModel");
const { result } = require("lodash");
const { HostOrderModel } = require("../models/hostOrderModel");
const { UserOrderModel } = require("../models/userOrderModel");
const fs = require("fs");
const path = require("path");
const { UserCartModel } = require("../models/userCartModel");
const { HostCartModel } = require("../models/hostCartModel");
const { CommissionModel } = require("../models/commissionModel");

const { ServiceProviderModel } = require("../models/servicesModel");
const { NotificationModel } = require("../models/notificationModel");
const utils = require("../modules/utils");
var _ = require("lodash");
const Excel = require('exceljs');
const generateUniqueId = require("generate-unique-id");

const { SellerSettingModel } = require("../models/sellerSettingModel");
const { userLikeModel } = require("../models/likeModel");
const { AdvertisementModel } = require("../models/AdvertisementModel");
const { UserRedeemPointModel } = require("../models/userRedeemPointModel");
const { HealthGoalPointModel } = require("../models/setHealthPointModel");
const { UserRedeemPointTransactionModel } = require("../models/userRedeemPointTransactionModel");

var aws = require('aws-sdk');


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


let sendOtp = async (SellerData) => {
  try {
    let otp = await utils.randomStringGenerator();
    let otpExpTime = new Date(Date.now() + config.defaultOTPExpireTime);
    SellerData.otp_info = {
      otp: otp,
      expTime: otpExpTime,
    };

    let mobileNumber = SellerData.country_code + SellerData.mobile_number;
    //Send message via Twillio
    let send = await utils.sendotp(SellerData.otp_info.otp, mobileNumber);
    return {
      status: 1,
      message: "OTP sent Successfully",
      data: SellerData,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.registerSeller = async (data) => {
  try {
    // const data  = req.body;

    const checkExist = await SellerModel.findOne({
      country_code: data.country_code,
      mobile_number: data.mobile_number,
    });
    // console.log("My data",checkExist)

    if (checkExist) {
      return {
        message: "Mobile number already exist",
        status: 0,
      };
    } else {
      let access_token = authentication.generateToken();
      let details = {
        first_name: data.first_name,
        last_name: data.last_name,
        country_code: data.country_code,
        mobile_number: data.mobile_number,
        device_token: data.device_token,
        device_type: data.device_type,
      };

      let saveFirstInfo = await SellerModel.create(details);
      let result = await saveFirstInfo.save();

      if (result) {
        let resOtp = await sendOtp(result);
        let otpInfo = resOtp.data.otp_info;
        let update = await SellerModel.findOneAndUpdate(
          { _id: result._id },
          {
            $set: {
              access_token: access_token,
              // otp_info: {
              //   otp: "1234",
              //   expTime: Date.now(), //otp expiry time
              // },
              otp_info: otpInfo
            },
          },
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
            stattus: 0,
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
    let userData1 = await SellerModel.findById(user._id);
    if (!userData1) throw new Error("No User found");
    // console.log(data.otp_info, user.otp_info);

    // if (data.otp === user.otp_info.otp || data.otp === "1234") {
    if (data.otp === user.otp_info.otp) {
      // console.log("1");
      (userData1.is_otp_verified = true),
        (userData1.otp_info = {
          otp: null,
          expTime: null,
        });
      let update = await SellerModel.findOneAndUpdate(
        { _id: user._id },
        userData1,
        {
          new: true,
        }
      );

      if (!update) {
        return {
          message: "Failed",
          status: 0,
        };
      }
      return {
        message: "OTP verified",
        status: 1,
      };
    } else {
      // console.log("2");
      return {
        message: "Invalid Otp",
        status: 0,
      };
    }
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

exports.resendOtp = async (user) => {
  try {
    const checkExist = await SellerModel.findOne({ country_code: user.country_code, mobile_number: user.mobile_number }).lean();
    console.log(checkExist)
    if (!checkExist) {
      return {
        message: "User does not exist",
        status: -1,
      };
    } else {
      let resOtp = await sendOtp(checkExist);
      checkExist.otp_info = resOtp.data.otp_info;
      // checkExist.otp_info = {
      //   otp: "1234",
      // };

      let result =  await SellerModel.findOneAndUpdate({ _id: checkExist._id }, { $set: checkExist },{ new:true }).lean();
      if (!result) {
        return {
          message: "Failed",
          status: 0,
        };
      }

      return {
        message: "OTP resent",
        status: 1,
        data: {},
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

exports.comleteProfile = async (data, user) => {
  try {
    // console.log(user);
    const checkExist = await SellerModel.findOne({ _id: user._id });

    if (!checkExist) {
      return {
        message: "User does not exist",
        status: 0,
      };
    } else {
      checkExist.email = data.email;
      checkExist.storeDetails = {
        store_name: data.store_name,
        location: {
          address1: data.address1,
          address2: data.address2,
          address3: data.address3,
        },
      };
      checkExist.documents = {
        idProof: data.idProof,
        shopLicense: data.shopLicense,
      };
      checkExist.is_profile_created = true;
      checkExist.latitude = data.latitude;
      checkExist.longitude = data.longitude;

      // let update = await SellerModel.findOneAndUpdate({_id:user._id}, checkExist, {
      //     new: true,
      // });
      let update = await checkExist.save();
      if (update) {
        return {
          message: "Created",
          status: 1,
          response: update,
        };
      } else {
        return {
          message: "Not created",
          stattus: 0,
        };
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

exports.bankSecurityAdd = async (data, user) => {
  try {
    // console.log(user);
    let checkExist = await SellerModel.findOne({ _id: user._id });

    if (!checkExist) {
      return {
        message: "User does not exist",
        status: 0,
      };
    } else {
      checkExist.bankDetails = {
        accountHolderName: data.accountHolderName,
        accountNumber: data.accountNumber,
        bankCard: data.bankCard,
        bankAccountName : data.bankAccountName
      };
      let pass = await bcrypt.hash(data.password, 10);
      // console.log(pass);
      checkExist.password = pass;
      checkExist.is_bank_details_added = true;

      // let update = await SellerModel.findOneAndUpdate(user._id, checkExist, {
      //     new: true,
      // });
      let update = await checkExist.save();
      if (update) {
        return {
          message: "Created",
          status: 1,
          response: update,
        };
      } else {
        return {
          message: "Not created",
          stattus: 0,
        };
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

exports.forgotPassword = async (data) => {
  try {
    if (!data.country_code || data.country_code == "")
      return { status: 0, message: "Please enter the country code" };
    if (!data.mobile_number || data.mobile_number == "")
      return { status: 0, message: "Please enter the mobile number" };

    let access_token = authentication.generateToken();
    let seller = await SellerModel.findOne({
      $and: [{
        country_code: data.country_code
      }, {
        mobile_number: data.mobile_number  
      }]
    }).exec();
    if (!seller) {
      return { status: 0, message: "Mobile number does not exist" };
    }

    let send_otp = await sendOtp(seller);

    let recruiter = await SellerModel.findOneAndUpdate(
      {
        $and: [
          {
            country_code: data.country_code,
          },
          {
            mobile_number: data.mobile_number,
          },
        ],
      },
      {
        $set: {
          // otp_info: {
          //   otp: "1234",
          // },
          otp_info: send_otp.data.otp_info,
          access_token: access_token,
        },
      },
      { new: true, fields: { _id: 1, access_token: 1 } }
    ).exec();

    if (!recruiter) {
      return { status: 0, message: "Mobile number does not exist" };
    }

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
      let seller = userData;
      let saveuser = seller.save();
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

exports.login = async (data) => {
  try {
    let token = authentication.generateToken();

    let findProfile = await SellerModel.findOne({
      mobile_number: data.mobile_number,
      country_code: data.country_code,
    });
    if (!findProfile) {
      return {
        message: "User not Found",
        status: 0,
      };
    }
    if (!findProfile.password) {
      return {
        message: "First create Your password and profile",
        status: 1,
        data: findProfile,
      };
    }
    let comapir = await bcrypt.compare(data.password, findProfile.password);

    if (!comapir) {
      return {
        message: "Inavlid Login",
        status: 0,
      };
    }
    let findProfile1 = await SellerModel.findOneAndUpdate(
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
    if (!findProfile1) {
      return {
        message: "User not Found",
        status: 0,
      };
    }
    if (findProfile1.is_verified_by_admin == 0) {
      return {
          status: 0,
          message: "Account is not verified yet",
          data: findProfile1
      };
  }
    return {
      message: "Login Success",
      data: findProfile1,
      status: 1,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

//============================> M2 <============================

exports.logout = async (seller) => {
  try {
    if (!seller._id || seller._id == "")
      return { status: 0, message: "Seller does not exist" };

    let updateSellerModel = await SellerModel.findOneAndUpdate(
      { _id: seller._id },
      { $set: { access_token: "" } },
      { new: true }
    );

    if (!updateSellerModel) {
      return { status: 0, message: "Something went Wrong" };
    }
    return { status: 1, message: "Logout successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.editProfile = async (seller, data) => {
  try {
    // console.log(seller);
    let result = await SellerModel.findByIdAndUpdate(
      { _id: seller._id },
      {
        $set: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          profile_pic: data.profile_pic,
          // idProof: data.idProof,
          // location: [{
          //     address: data.address1
          // }, {
          //     address: data.address2
          // }, {
          //     address: data.address3
          // }]
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

exports.editAddress = async (seller, data) => {
  try {
    let result = await SellerModel.findByIdAndUpdate(
      { _id: seller._id },
      {
        $set: {
          documents: {
            idProof: data.idProof,
            shopLicense: data.shopLicense,
          },
          storeDetails: {
            // store_name: seller.storeDetails?.store_name,
            store_name: data.store_name,

            location: {
              // type: { type: String, default: "Points" },
              address1: data.address1,
              address2: data.address2,
              address3: data.address3,
            },
          },
          latitude: data.latitude,
          longitude: data.longitude
        },
      },
      {
        new: true,
      }
    ).lean();
    if (!result) {
      return { status: 0, message: "Something went Wrong" };
    }
    return { status: 1, message: " Address edited successful", data: result };
  } catch (error) {}
};

exports.changePassword = async (seller, data) => {
  try {
    let compare = await bcrypt.compare(data.old_password, seller.password);
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

    let result = await SellerModel.findByIdAndUpdate(
      { _id: seller._id },
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

exports.productCatList = async () => {
  try {
    let productCategoryList = await productCategoryAdminModel
      .find()
      .sort({ _id: -1 });
    if (productCategoryList) {
      return {
        status: 1,
        response: productCategoryList,
        message: "All Product category list",
      };
    } else {
      return {
        status: 2,
        message: "No List Found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.productSubCatList = async (seller, data) => {
  try {
    let productSubCategoryList = await productSubCategoryAdminModel.find({
      categoryId: data.cat_id,
    });
    if (productSubCategoryList) {
      return {
        status: 1,
        response: productSubCategoryList,
        message: "All Product Sub-category list",
      };
    } else {
      return {
        status: 0,
        message: "No List Found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.addSellerProduct = async (seller, data) => {
  try {
    let saveProduct = new ProductCatModel();

    saveProduct.product_main_cat = data.product_main_cat;
    saveProduct.product_cat = data.product_cat;
    saveProduct.product_name = data.product_name;
    saveProduct.breed_type = data.breed_type;
    saveProduct.product_price = data.product_price;
    saveProduct.selling_price = data.selling_price;
    saveProduct.product_discount = data.product_discount;
    // saveProduct.product_color =  data.product_color;
    // saveProduct.product_img = data.product_img;
    saveProduct.product_decripton = data.product_decripton;
    saveProduct.seller = seller._id;
    saveProduct.product_details = data.product_details;
    saveProduct.weight_size = data.weight_size;

    let result = await saveProduct.save();

    if (result) {
      return {
        message: "Product Added",
        status: 1,
        response: saveProduct,
      };
    } else {
      return {
        message: "Product can not be created",
        status: 0,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.editSellerProduct = async (seller, data) => {
  try {
    // console.log(seller);
    let result = await ProductCatModel.findByIdAndUpdate(
      { _id: data._id },
      {
        $set: {
          product_main_cat : data.product_main_cat,
          product_cat: data.product_cat,
          product_name: data.product_name,
          breed_type: data.breed_type,
          product_price: data.product_price,
          selling_price: data.selling_price,
          product_discount: data.product_discount,
          // product_color : data.product_color,
          // product_img : data.product_img,
          product_decripton: data.product_decripton,
          product_details: data.product_details,
          weight_size : data.weight_size
        },
      },
      {
        new: true,
      }
    );
    if (!result) {
      return { status: 0, message: "Something went Wrong" };
    }
    return { status: 1, message: "Product edit successfully", data: result };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.sellerAllProductList = async (seller) => {
  try {
    let SellerProductList = await ProductCatModel.find({ seller: seller._id })
      .populate("seller")
      .populate("product_main_cat")
      .populate("product_cat")
      .populate("breed_type")
      .lean();

      if(SellerProductList.length > 0){
        for(let i=0; i < SellerProductList.length; i++){
          let likedData = await userLikeModel.findOne({ "product.seller_product": SellerProductList[i]._id }).lean();
          SellerProductList[i]['totalLike'] = likedData ? (Number(likedData.user.length) + Number(likedData.host.length)) : 0
          let usersold = 0;
          let hostsold = 0;
          let userOrderList = await UserCartModel.find({ "seller.seller_id": mongoose.Types.ObjectId(seller._id), "product.seller_product": SellerProductList[i]._id, isDeleted: false , $or: [{status: 1},{status: 3},{status: 4},{status: 5},{status: 6},{status: 7}] },{ quantity: 1 }).lean();
          if(userOrderList.length > 0){
            usersold = userOrderList.reduce((accumulator, object) => {
              return accumulator + object.quantity;
            }, 0);
          }
          let hostOrderList = await HostCartModel.find({ "seller.seller_id": mongoose.Types.ObjectId(seller._id), "product.seller_product": SellerProductList[i]._id, isDeleted: false , $or: [{status: 1},{status: 3},{status: 4},{status: 5},{status: 6},{status: 7}] },{ quantity: 1 }).lean();
          if(hostOrderList.length > 0){
            hostsold = hostOrderList.reduce((accumulator, object) => {
              return accumulator + object.quantity;
            }, 0);
          }
          let totalSell = Number(usersold) + Number(hostsold)
          let remainingQuantity = (Number(SellerProductList[i].product_quantity) - Number(totalSell));
          SellerProductList[i]['remainingQuantity'] = remainingQuantity
        }
      }

    if (SellerProductList) {
      return {
        status: 1,
        response: SellerProductList,
        message: "All Product list",
      };
    } else {
      return {
        status: 0,
        message: "No List Found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteSellerProduct = async (seller, data) => {
  try {
    let productData = await ProductCatModel.findById({ _id: data._id });
    if (!productData) {
      return {
        status: -1,
        message: "Category does not exist",
      };
    } else {
      let deleteData = await ProductCatModel.findByIdAndDelete(productData._id);
      if (deleteData) {
        return {
          status: 1,
          message: "Product deleted success",
          response: deleteData.data,
        };
      } else {
        return {
          status: 2,
          message: "Category not deleted",
        };
      }
    }
  } catch (error) {}
};

exports.getProfile = async (seller, data) => {
  try {
    let sellerprofile = await SellerModel.findById({ _id: seller._id });
    if (sellerprofile) {
      return {
        status: 1,
        response: sellerprofile,
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

exports.productMainCat = async () => {
  try {
    let productCategoryList = await productMainCategoryAdminModel.find();
    if (productCategoryList) {
      return {
        status: 1,
        response: productCategoryList,
        message: "Main category List Fetch",
      };
    } else {
      return {
        status: 2,
        message: "No List Found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

//============================> M3 <============================

exports.updateSellerProductQuantity = async (seller, data) => {
  try {
    // console.log(seller);
    let result = await ProductCatModel.findByIdAndUpdate(
      { _id: data._id },
      {
        $set: {
          product_quantity: data.product_quantity,
        },
      },
      {
        new: true,
      }
    );
    if (!result) {
      return { status: 0, message: "Something went Wrong" };
    }
    if(result){
      if(Number(result.product_quantity) <= Number(result.sku_min_limit)){
        /* Code for notification start */
            let title = "Update product quantity";
            let Notificationbody =
              "Quantity of product " +
              result.product_name +
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
    
    return { status: 1, message: "Quantity Updated", data: result };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateSkuMinLimit = async (seller, data) => {
  try {
    // console.log(seller);
    let result = await ProductCatModel.findByIdAndUpdate(
      { _id: data._id },
      {
        $set: {
          sku_min_limit: data.sku_min_limit,
        },
      },
      {
        new: true,
      }
    );
    if (!result) {
      return { status: 0, message: "Something went Wrong" };
    }
    if(result){
      if(Number(result.product_quantity) <= Number(result.sku_min_limit)){
        /* Code for notification start */
            let title = "Update product quantity";
            let Notificationbody =
              "Quantity of product " +
              result.product_name +
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
    
    return { status: 1, message: "SKU Limit Updated", data: result };
  } catch (error) {
    throw new Error(error.message);
  }
};

//============================> M4 <============================

exports.updateProductStatus = async (seller, data) => {
  try {
    // console.log(seller);
    let result = await ProductCatModel.findByIdAndUpdate(
      { _id: data._id },
      {
        $set: {
          set_status: data.set_status,
        },
      },
      {
        new: true,
      }
    );
    if (!result) {
      return { status: 0, message: "Something went Wrong" };
    }
    return { status: 1, message: "Status changed", data: result };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getOrders = async (seller, data) => {
  try {
    let { status } = data;
    let checkArray = [];
    if (status == 0) {
      checkArray[0] = 0;
    } else if (status == 1) {
      checkArray[0] = 2;
      checkArray[1] = 3;
      checkArray[2] = 4;
    } else {
      checkArray[0] = 1;
      checkArray[1] = 5;
      checkArray[2] = 6;
      checkArray[3] = 7;
    }
    let result1 = await HostOrderBookingModel.aggregate([
      { $unwind: "$order_id" },

      {
        $lookup: {
          from: "Host",
          localField: "host_id",
          foreignField: "_id",
          as: "host_id",
        },
      },

      {
        $lookup: {
          from: "hostOrder",
          let: { orderId: "$order_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$orderId"] } } },
            {
              $lookup: {
                from: "hostAddress",
                localField: "address",
                foreignField: "_id",
                as: "address",
              },
            },
            {
              $lookup: {
                from: "hostCart",
                let: { hostCart: "$cart_id" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$hostCart"] } } },
                  {
                    $lookup: {
                      from: "SellerProductList",
                      localField: "product.seller_product",
                      foreignField: "_id",
                      as: "product",
                    },
                  },
                  {
                    $unwind: { path: "$product" },
                  },
                ],
                as: "cart_id",
              },
            },
            {
              $unwind: { path: "$address", preserveNullAndEmptyArrays: true },
            },
            {
              $unwind: { path: "$cart_id", preserveNullAndEmptyArrays: true },
            },
          ],
          as: "orderDetails",
        },
      },
      {
        $unwind: { path: "$orderDetails", preserveNullAndEmptyArrays: true },
      },

      {
        $match: {
          $and: [
            // {"orderDetails.cart_id.seller.seller._id":seller._id},
            {
              $or: [
                { "orderDetails.cart_id.seller.seller_id": seller._id },
                { "orderDetails.cart_id.seller": seller._id },
              ],
            },
            { "orderDetails.orderStatus": { $in: checkArray } },
          ],
        },
      },
      // {
      //   $group: {
      //     _id: "$_id",
      //     cart_id: { $first: "$cart_id" },
      //     host_id: { $first: "$host_id" },
      //     user_id: { $first: "$user_id" },
      //     order_id: { $push: "$orderDetails" },
      //     total_amount: { $first: "$total_amount" },
      //     delivery_charge: { $first: "$delivery_charge" },
      //     coupon_id: { $first: "$coupon_id" },
      //     discount_amount: { $first: "$discount_amount" },
      //     transaction_id: { $first: "$transaction_id" },
      //     booking_id: { $first: "$booking_id" },
      //     status: { $first: "$status" },
      //     created_at: { $first: "$created_at" },
      //     modified_at: { $first: "$modified_at" },
      //   },
      // },
    ]);

    let result2 = await UserOrderBookingModel.aggregate([
      { $unwind: "$order_id" },

      {
        $lookup: {
          from: "User",
          localField: "user_id",
          foreignField: "_id",
          as: "user_id",
        },
      },
      {
        $lookup: {
          from: "userOrder",
          let: { orderId: "$order_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$orderId"] } } },
            {
              $lookup: {
                from: "userAddress",
                localField: "address",
                foreignField: "_id",
                as: "address",
              },
            },
            {
              $lookup: {
                from: "userCart",
                let: { userCart: "$cart_id" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$userCart"] } } },
                  {
                    $lookup: {
                      from: "SellerProductList",
                      localField: "product.seller_product",
                      foreignField: "_id",
                      as: "product",
                    },
                  },
                  {
                    $unwind: {
                      path: "$product",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                ],
                as: "cart_id",
              },
            },
            {
              $unwind: { path: "$address", preserveNullAndEmptyArrays: true },
            },
            {
              $unwind: { path: "$cart_id", preserveNullAndEmptyArrays: true },
            },
          ],
          as: "orderDetails",
        },
      },
      {
        $unwind: { path: "$orderDetails", preserveNullAndEmptyArrays: true },
      },
      // {
      //   $unwind: { path: "$user_id", preserveNullAndEmptyArrays: true },
      // },
      {
        $match: {
          $and: [
            {
              $or: [
                { "orderDetails.cart_id.seller.seller_id": seller._id },
                { "orderDetails.cart_id.seller": seller._id },
              ],
            },
            { "orderDetails.orderStatus": { $in: checkArray } },
          ],
        },
      },
      // {
      //   $group: {
      //     _id: "$_id",
      //     cart_id: { $first: "$cart_id" },
      //     host_id: { $first: "$host_id" },
      //     user_id: { $first: "$user_id" },
      //     order_id: { $push: "$orderDetails" },
      //     total_amount: { $first: "$total_amount" },
      //     delivery_charge: { $first: "$delivery_charge" },
      //     coupon_id: { $first: "$coupon_id" },
      //     discount_amount: { $first: "$discount_amount" },
      //     transaction_id: { $first: "$transaction_id" },
      //     booking_id: { $first: "$booking_id" },
      //     status: { $first: "$status" },
      //     created_at: { $first: "$created_at" },
      //     modified_at: { $first: "$modified_at" },
      //   },
      // },
    ]);

    let result = result1.concat(result2).sort(function (a, b) {
      return b.created_at - a.created_at;
    });
    result.reverse();
    // console.log(result2);

    if (!result) {
      return { status: 0, message: "Something went Wrong" };
    }
    return {
      status: 1,
      message: "Pending list fetched",
      data: { result, length: result.length },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateOrderStatus = async (seller, data) => {
  try {
    let modified_at = new Date().getTime();
    var productName = "";
    var userId = "";
    let result = await HostOrderModel.findByIdAndUpdate(
      { _id: data.order_id },
      {
        $set: {
          orderStatus: Number(data.status),
          modified_at: modified_at,
        },
      },
      {
        new: true,
      }
    );
    if (result) {
      let hostcart = await HostCartModel.findOneAndUpdate(
        { _id: result.cart_id },
        {
          $set: {
            status: Number(data.status) + 1,
            modified_at: modified_at,
          },
        },
        {
          new: true,
        }
      );
      let product = await ProductCatModel.findOne(
        { _id: hostcart.product.seller_product },
        { product_name: 1 }
      ).lean();
      productName =  product ? product.product_name: "";
      userId = hostcart.host;

    }
    if (!result) {
      result = await UserOrderModel.findByIdAndUpdate(
        { _id: data.order_id },
        {
          $set: {
            orderStatus: Number(data.status),
            modified_at: modified_at,
          },
        },
        {
          new: true,
        }
      );
      if (result) {
        let usercart = await UserCartModel.findOneAndUpdate(
          { _id: result.cart_id },
          {
            $set: {
              status: Number(data.status) + 1,
              modified_at: modified_at,
            },
          },
          {
            new: true,
          }
        );
        let product = await ProductCatModel.findOne(
          { _id: usercart.product.seller_product },
          { product_name: 1 }
        ).lean();
        productName = product ? product.product_name: "";
        userId = usercart.user;

        /* code for cashback start */
        if(Number(data.status) == 5){
          let healthGoalPoint = await HealthGoalPointModel.findOne({},{ health_goal_point: 1 }).lean();
          var userRedeem = await UserRedeemPointModel.findOne({  user: mongoose.Types.ObjectId(result.user) },{ redeem_point: 1 }).lean();
          var userDiscountAmount = ((Number(healthGoalPoint.health_goal_point) * (Number(result.totalAmount)))  / 100 )

          if(userRedeem){
            let latestRedeemAmount =  ((Number(userRedeem.redeem_point) + (Number(userDiscountAmount))))
            let dataToUpdateRedeem = {
              redeem_type: 1,
              redeem_point: latestRedeemAmount,
              modified_at: new Date().getTime()
            }
            var updateRedeem = await UserRedeemPointModel.findOneAndUpdate({  _id: mongoose.Types.ObjectId(userRedeem._id) },{ $set: dataToUpdateRedeem }, { new: true }).lean();
          }else{
            let latestRedeemAmount = Number(userDiscountAmount)
            let dataToSaveRedeem = {
              user: result.user,
              redeem_type: 1,
              redeem_point: latestRedeemAmount,
              created_at: new Date().getTime(),
              modified_at: new Date().getTime()
            }
            let myRedeemData = new UserRedeemPointModel(dataToSaveRedeem);
            let redeemsave = await myRedeemData.save();
          }
          let dataToSaveWallet = {
            user: result.user,
            transaction_id: generateUniqueId({ length: 7,useLetters: true }).toUpperCase(),
            transaction_type: 1,
            redeem_amount: Number(userDiscountAmount),
            booking_type: 1,
            user_cart_booking: result._id,
            transaction_at: new Date().getTime()
          };
      
          let myData = new UserRedeemPointTransactionModel(dataToSaveWallet);
          let save = await myData.save();
        }
      /* code for cashback end */
      }
    }

    if (!result) {
      return { status: 0, message: "Something went Wrong" };
    }
    let utilStatus = utils.getOrderStatus(Number(data.status) + 1);
    /* Code for notification start */
    let title = "Order status updated";
    let Notificationbody =
      "Status for order for product " +
      productName +
      " has been updated. Status:- " +
      utilStatus;
    let device_type = seller.device_type;
    let notification = {
      uniqe_id: {
        user_id: userId,
        host_id: userId,
      },
      title: title,
      body: Notificationbody,
      order_id: {
        user_order: data.order_id,
        host_order: data.order_id,
      },
      notification_type: Number(data.status) + 1,
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
    return { status: 1, message: "Status changed", data: result };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.generateInvoice = async (seller, data) => {
  try {
    let { id } = data;

    let result = await HostOrderModel.findById(id)
      .populate("address")
      .populate("coupon")
      .populate({
        path: "cart_id",
        populate: [
          {
            path: "product.seller_product",
            model: "SellerProductList",
          },
        ],
      })
      .lean();

    if (!result) {
      result = await UserOrderModel.findById(id)
        .populate("address")
        .populate("coupon")
        .populate({
          path: "cart_id",
          populate: [
            {
              path: "product.seller_product",
              model: "SellerProductList",
            },
          ],
        })
        .lean();
    }
    if (!result) {
      return { status: 0, message: "Something went Wrong" };
    }

    // console.log(seller);
    let html = fs.readFileSync(
      path.join(__dirname, "../dist/invoice/invoice.html")
    );
    console.log(path.join(__dirname, "../dist/invoice/invoice.html"));
    let document = {
      html: html,
      data: {
        // users: users,
        seller: seller,
        data: result,
      },
      path: "./output.pdf",
      type: "",
    };
    let options = {
      format: "A3",
      orientation: "portrait",
      border: "10mm",
    };
    pdf
      .create(document, options)
      .then((res) => {
        console.log(":::::::::::::::::::::::");
      })
      .catch((err) => {
        console.log("errorororororklfjhkgjkgjk");
        console.log(err);
      });

    return { status: 1, message: "Invoice Generate", data: { seller, result } };
  } catch (error) {
    throw new Error(error.message);
  }
};

//============================> M5 <============================

exports.getPaymentList = async (seller) => {
  try {
    let hostPayment = await HostCartModel.find(
      {
        "seller.seller_id": seller._id,
      },
      { isDeleted: 0, createdAt: 0, updatedAt: 0, seller: 0 }
    )
      .populate(
        "product.seller_product",
        "product_name product_price selling_price product_discount product_details product_decripton product_quantity"
      )
      .populate(
        "product.admin_product",
        "product_name image product_quantity product_price selling_price product_discount product_decripton"
      )
      .populate({
        path: "orderId",
        match: {
          paymentStatus: 1,
        },
        select:
          "quantity order_id currency totalAmount deliveryCharge discountAmount orderStatus created_at payment_options is_rated modified_at",
      })
      .populate("host", "first_name last_name mobile_number email profile_pic")
      .populate(
        "bookingId",
        "total_amount delivery_charge coupon_id discount_amount transaction_id booking_id created_at modified_at status"
      )
      .lean();

    // let host = hostPayment.filter(item=>{
    //   return (item.orderId != null);
    // })

    let userPayment = await UserCartModel.find(
      {
        "seller.seller_id": seller._id,
      },
      { isDeleted: 0, createdAt: 0, updatedAt: 0, seller: 0 }
    )
      .populate(
        "product.seller_product",
        "product_name product_price selling_price product_discount product_details product_decripton product_quantity"
      )
      .populate(
        "product.admin_product",
        "product_name image product_quantity product_price selling_price product_discount product_decripton"
      )
      .populate({
        path: "orderId",
        match: {
          paymentStatus: 1,
        },
        select:
          "quantity order_id currency totalAmount deliveryCharge discountAmount orderStatus created_at payment_options is_rated modified_at",
      })
      .populate("user", "full_name country_code mobile_number email")
      .populate(
        "bookingId",
        "total_amount delivery_charge coupon_id discount_amount transaction_id booking_id created_at modified_at status"
      )
      .lean();

    // let user = userPayment.filter(item=>{
    //   return (item.orderId != null);
    // })

    let result = hostPayment
      .concat(userPayment)
      .sort(
        function (a, b) {
          return b.created_at - a.created_at;
        },
        { created_at: -1 }
      )
      .filter((item) => {
        return item.orderId != null;
      });
    let total_revenue = "23423";
    let pending_payments = "74875";
    if (result) {
      return {
        status: 1,
        response: result,
        message: "Payment List Fetch",
        total_revenue,
        pending_payments,
      };
    } else {
      return {
        status: 2,
        message: "No List Found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.filterPayment = async (seller, data) => {
  try {
    if (!data.sortType || data.sortType == "")
      return { status: 0, message: "Sort type is required" };

    if (data.sortType == "3") {
      if (!data.startDate || data.startDate == "")
        return { status: 0, message: "Start date is required" };
      if (!data.endDate || data.endDate == "")
        return { status: 0, message: "End date is required" };
    }

    let hostPayment = await HostCartModel.find(
      {
        "seller.seller_id": seller._id,
      },
      { isDeleted: 0, createdAt: 0, updatedAt: 0, seller: 0 }
    )
      .populate(
        "product.seller_product",
        "product_name product_price selling_price product_discount product_details product_decripton product_quantity"
      )
      .populate(
        "product.admin_product",
        "product_name image product_quantity product_price selling_price product_discount product_decripton"
      )
      .populate({
        path: "orderId",
        match: {
          paymentStatus: 1,
        },
        select:
          "quantity order_id currency totalAmount deliveryCharge discountAmount orderStatus created_at payment_options is_rated modified_at",
      })
      .populate("host", "first_name last_name mobile_number email profile_pic")
      .populate(
        "bookingId",
        "total_amount delivery_charge coupon_id discount_amount transaction_id booking_id created_at modified_at status"
      )
      .lean();

    let userPayment = await UserCartModel.find(
      {
        "seller.seller_id": seller._id,
      },
      { isDeleted: 0, createdAt: 0, updatedAt: 0, seller: 0 }
    )
      .populate(
        "product.seller_product",
        "product_name product_price selling_price product_discount product_details product_decripton product_quantity"
      )
      .populate(
        "product.admin_product",
        "product_name image product_quantity product_price selling_price product_discount product_decripton"
      )
      .populate({
        path: "orderId",
        match: {
          paymentStatus: 1,
        },
        select:
          "quantity order_id currency totalAmount deliveryCharge discountAmount orderStatus created_at payment_options is_rated modified_at",
      })
      .populate("user", "full_name country_code mobile_number email")
      .populate(
        "bookingId",
        "total_amount delivery_charge coupon_id discount_amount transaction_id booking_id created_at modified_at status"
      )
      .lean();

    let result = hostPayment
      .concat(userPayment)
      .sort(
        function (a, b) {
          return b.created_at - a.created_at;
        },
        { created_at: -1 }
      )
      .filter((item) => {
        return item.orderId != null;
      });
    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    let todayStart = Date.parse(start);
    let weekStart = todayStart - 7 * 86400000;
    let monthStart = todayStart - 30 * 86400000;

    if (data.sortType == 0) {
      result = _.filter(result, (item) => item.orderId.created_at > todayStart);
    } else if (data.sortType == 1) {
      result = _.filter(result, (item) => item.orderId.created_at > weekStart);
    } else if (data.sortType == 2) {
      result = _.filter(result, (item) => item.orderId.created_at > monthStart);
    } else if (data.sortType == 3) {
      result = _.filter(
        result,
        (item) =>
          item.orderId.created_at > data.startDate &&
          item.orderId.created_at < data.endDate
      );
    } else {
      result = result;
    }

    if (result) {
      return {
        status: 1,
        response: result,
        message: "Payment Filter Data",
      };
    } else {
      return {
        status: 2,
        message: "No Data Found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getDashboardData = async (seller, data) => {
  try {
    if (!data.sortType || data.sortType == "")
      return { status: 0, message: "Sort type is required" };

    if (data.sortType == "4") {
      if (!data.startDate || data.startDate == "")
        return { status: 0, message: "Start date is required" };
      if (!data.endDate || data.endDate == "")
        return { status: 0, message: "End date is required" };
    }

    var totalProductAdded = 0;
    var totalOrders = 0;
    var newOrders = 0;
    var ongoingOrders = 0;
    var completedOrders = 0;
    var totalRevenue = 0;
    var notificationCount = 0;

    var commission = await CommissionModel.findOne(
      {},
      { commission_percent: 1 }
    ).lean();

    // ALL DATA
    if (data.sortType == "0") {
      totalProductAdded = await ProductCatModel.countDocuments({
        seller: mongoose.Types.ObjectId(seller._id),
      }).lean();

      let hostOrders = await HostCartModel.countDocuments({
        "seller.seller_id": seller._id,
        status: { $ne: 0 },
      }).lean();
      let userOrders = await UserCartModel.countDocuments({
        "seller.seller_id": seller._id,
        status: { $ne: 0 },
      }).lean();
      totalOrders = hostOrders + userOrders;

      let hostNewOrders = await HostCartModel.countDocuments({
        "seller.seller_id": seller._id,
        status: 1,
      }).lean();
      let userNewOrders = await UserCartModel.countDocuments({
        "seller.seller_id": seller._id,
        status: 1,
      }).lean();
      newOrders = hostNewOrders + userNewOrders;

      let hostOngoingOrders = await HostCartModel.countDocuments({
        "seller.seller_id": seller._id,
        $or: [{ status: 3 }, { status: 4 }, { status: 5 }],
      }).lean();
      let userOngoingOrders = await UserCartModel.countDocuments({
        "seller.seller_id": seller._id,
        $or: [{ status: 3 }, { status: 4 }, { status: 5 }],
      }).lean();
      ongoingOrders = hostOngoingOrders + userOngoingOrders;

      let hostCompletedOrders = await HostCartModel.countDocuments({
        "seller.seller_id": seller._id,
        status: 6,
      }).lean();
      let userCompletedOrders = await UserCartModel.countDocuments({
        "seller.seller_id": seller._id,
        status: 6,
      }).lean();
      completedOrders = hostCompletedOrders + userCompletedOrders;

      let hostOrdersPrice = await HostCartModel.find(
        { "seller.seller_id": seller._id, status: 6 },
        { price: 1 }
      ).lean();
      let userOrdersPrice = await UserCartModel.find(
        { "seller.seller_id": seller._id, status: 6 },
        { price: 1 }
      ).lean();

      let hostAmountAfterCommission = 0;
      let userAmountAfterCommission = 0;
      if (hostOrdersPrice.length > 0) {
        let sum = hostOrdersPrice.reduce((accumulator, object) => {
          return accumulator + object.price;
        }, 0);
        hostAmountAfterCommission =
          sum - (sum * commission.commission_percent) / 100;
      }
      if (userOrdersPrice.length > 0) {
        let sum = userOrdersPrice.reduce((accumulator, object) => {
          return accumulator + object.price;
        }, 0);
        userAmountAfterCommission =
          sum - (sum * commission.commission_percent) / 100;
      }

      totalRevenue = (
        hostAmountAfterCommission + userAmountAfterCommission
      ).toFixed(2);

      let notification = await NotificationModel.countDocuments({
        "uniqe_id.seller_id": seller._id,
        is_read: 0,
      }).lean();
      notificationCount = notification;
      // console.log(notificationCount);
    }
    // notificationCount = 15;

    let dataToSend = {
      total_products_added: totalProductAdded,
      total_products_orders: totalOrders,
      new_orders: newOrders,
      ongoing_orders: ongoingOrders,
      completed_orders: completedOrders,
      total_revenue: totalRevenue,
      notificationCount: notificationCount,
    };

    return {
      status: 1,
      response: dataToSend,
      message: "Dashboard details fectched successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getNotificationList = async (seller) => {
  try {
    let notifications = await NotificationModel.find(
      { "uniqe_id.seller_id": mongoose.Types.ObjectId(seller._id) },
      { uniqe_id: 0 }
    )
      .sort({ created_at: 1 })
      .lean();

      let unreadNotifications = await NotificationModel.countDocuments(
        { "uniqe_id.seller_id": mongoose.Types.ObjectId(seller._id), is_read: 0 }).lean();
    if (!notifications) {
      return {
        status: 0,
        message: "Unable to get notifications",
      };
    }
    let dataToSend = {
      notificationList: notifications,
      unreadNotifications: unreadNotifications
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

exports.readAllNotification = async (seller) => {
  try {
    if (!service || service._id == "")
      return {
        status: 0,
        message: "Login first to read Notification",
      };

    let updateNotification = await NotificationModel.updateMany(
      { "uniqe_id.seller_id": seller._id, is_read: 0 },
      { $set: { is_read: 1 } },
      { new: true }
    ).lean();

    if (!updateNotification) {
      return {
        status: 0,
        message: "No notification left to read",
      };
    } else {
      return {
        status: 1,
        message: "Notification read successfully",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

//============================> M12 <============================

exports.getTermCondition = async () => {
  try {
    var getTerm = await SellerSettingModel.findOne().lean();

    if (!getTerm || getTerm.length < 1) {
      return "Unable to fetch term & condition";
    }

    // return { message: "Term & conditions Fetched successfully", status: 1, response: getTerm.term_condition };
    return getTerm.term_condition;
  } catch (error) {
    return {
      status: 0,
      message: error.message,
    };
  }
};

exports.getPrivacyPolicy = async () => {
  try {
      var getTerm = await SellerSettingModel.findOne().lean();

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
};

exports.getAboutUs = async () => {
  try {
      var getTerm = await SellerSettingModel.findOne().lean();

      if (!getTerm || getTerm.length < 1) {
          return 'Unable to fetch AboutUs';
      }
      
    return getTerm.about_us;


  } catch (error) {
      return {
          status: 0,
          message: error.message
      }
  }
};

exports.getLegal = async () => {
  try {
      var getTerm = await SellerSettingModel.findOne().lean();

      if (!getTerm || getTerm.length < 1) {
          return 'Unable to fetch Legal';
      }
      
    return getTerm.legal;


  } catch (error) {
      return {
          status: 0,
          message: error.message
      }
  }
};

exports.getAllAdvertisements = async () => {
  try {
    let currentDate = new Date().getTime();
    let allAds = await AdvertisementModel.find({ is_seller : true, is_active: true, is_blocked : 0, $and: [{ start_date: { $lte: currentDate }},{ end_date: { $gte: currentDate }} ] }).sort({date_created : -1}).limit(5).lean();

    let dataToSend = {
      allAdvertisements: allAds 
    }

    return { response: dataToSend, message: "All advertisements fetched successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

function uploadToBucket(params) {
  return new Promise(function (resolve, reject) {
    aws.config.update({
      secretAccessKey: "P0Z84jEVGanry1mD6XzgQkTPVmoJ2biV5WnFTFJS",
      accessKeyId: 'AKIA2JVEV34P34HOHNEF',
      region: 'sa-east-1'
    });
    const s3 = new aws.S3();

    s3.upload(params, function(err, response) {
      if(err){
        reject(err);
      }else{
        resolve(response.Location);
      }
    });
  })
}

exports.getSellerReport = async(seller, data)=>{
  try {
    if (!data.sortType || data.sortType == "")
      return { status: 0, message: "Sort type is required" };

    if (data.sortType == "3") {
      if (!data.startDate || data.startDate == "")
        return { status: 0, message: "Start date is required" };
      if (!data.endDate || data.endDate == "")
        return { status: 0, message: "End date is required" };
    }
    var ongoingOrders = [];
    var cancelledOrders = [];
    var completedOrders = [];
    var allOrders = [];

    let workbook = new Excel.Workbook()
    let worksheet;
    if(data.ongoing == "1"){
      worksheet = workbook.addWorksheet('Ongoing Orders Sheet');
      
      let hostPayment = await HostCartModel.find({
        "seller.seller_id": mongoose.Types.ObjectId(seller._id),
        isDeleted: false,
        $or: [{status: 1},{status: 3},{status: 4},{status: 5}],
      })
      .populate('product.seller_product', 'product_name product_price selling_price product_discount product_details product_decripton product_quantity')
      .populate('product.admin_product', 'product_name image product_quantity product_price selling_price product_discount product_decripton')
      .populate('host', 'first_name last_name country_code mobile_number')
      .populate({
        path: 'orderId', model: "hostOrder", select: "quantity order_id currency totalAmount deliveryCharge discountAmount orderStatus paymentStatus created_at payment_options modified_at address",
        populate: [{
          path: 'address',
          model: 'hostAddress',
          select: 'full_name mobile_number house_no street locality city country state postal_code'
        }]
      })
      .sort({ created_at: -1 }).lean();
  
      let userPayment = await UserCartModel.find({ "seller.seller_id": mongoose.Types.ObjectId(seller._id), isDeleted: false , $or: [{status: 1},{status: 3},{status: 4},{status: 5}]})
      .populate('product.seller_product', 'product_name product_price selling_price product_discount product_details product_decripton product_quantity')
      .populate('product.admin_product', 'product_name image product_quantity product_price selling_price product_discount product_decripton')
      .populate('user', 'full_name country_code mobile_number')
      .populate({
        path: 'orderId', model: "userOrder", select: "quantity order_id currency totalAmount deliveryCharge discountAmount orderStatus paymentStatus created_at payment_options modified_at address",
        populate: [{
          path: 'address',
          model: 'userAddress',
          select: 'full_name mobile_number house_no street locality city country state postal_code'
        }]
      })
      .sort({ created_at: -1 }).lean();
  
      ongoingOrders = hostPayment.concat(userPayment).sort(
        function (a, b) {
          return b.created_at - a.created_at;
        },
        { created_at: -1 }
      );
    }else if(data.cancelled == "1"){
      worksheet = workbook.addWorksheet('Cancelled Orders Sheet');

      let hostPayment = await HostCartModel.find({
        "seller.seller_id": mongoose.Types.ObjectId(seller._id),
        isDeleted: false,
        $or: [{status: 7}],
      })
      .populate('product.seller_product', 'product_name product_price selling_price product_discount product_details product_decripton product_quantity')
      .populate('product.admin_product', 'product_name image product_quantity product_price selling_price product_discount product_decripton')
      .populate('host', 'first_name last_name country_code mobile_number')
      .populate({
        path: 'orderId', model: "hostOrder", select: "quantity order_id currency totalAmount deliveryCharge discountAmount orderStatus paymentStatus created_at payment_options modified_at address",
        populate: [{
          path: 'address',
          model: 'hostAddress',
          select: 'full_name mobile_number house_no street locality city country state postal_code'
        }]
      })
      .sort({ created_at: -1 }).lean();
  
      let userPayment = await UserCartModel.find({ "seller.seller_id": mongoose.Types.ObjectId(seller._id), isDeleted: false , $or: [{status: 7}]})
      .populate('product.seller_product', 'product_name product_price selling_price product_discount product_details product_decripton product_quantity')
      .populate('product.admin_product', 'product_name image product_quantity product_price selling_price product_discount product_decripton')
      .populate('user', 'full_name country_code mobile_number')
      .populate({
        path: 'orderId', model: "userOrder", select: "quantity order_id currency totalAmount deliveryCharge discountAmount orderStatus paymentStatus created_at payment_options modified_at address",
        populate: [{
          path: 'address',
          model: 'userAddress',
          select: 'full_name mobile_number house_no street locality city country state postal_code'
        }]
      })
      .sort({ created_at: -1 }).lean();
  
      cancelledOrders = hostPayment.concat(userPayment).sort(
        function (a, b) {
          return b.created_at - a.created_at;
        },
        { created_at: -1 }
      );
    }else if(data.completed == "1"){
      worksheet = workbook.addWorksheet('Completed Orders Sheet');

      let hostPayment = await HostCartModel.find({
        "seller.seller_id": mongoose.Types.ObjectId(seller._id),
        isDeleted: false,
        $or: [{status: 6}],
      })
      .populate('product.seller_product', 'product_name product_price selling_price product_discount product_details product_decripton product_quantity')
      .populate('product.admin_product', 'product_name image product_quantity product_price selling_price product_discount product_decripton')
      .populate('host', 'first_name last_name country_code mobile_number')
      .populate({
        path: 'orderId', model: "hostOrder", select: "quantity order_id currency totalAmount deliveryCharge discountAmount orderStatus paymentStatus created_at payment_options modified_at address",
        populate: [{
          path: 'address',
          model: 'hostAddress',
          select: 'full_name mobile_number house_no street locality city country state postal_code'
        }]
      })
      .sort({ created_at: -1 }).lean();
  
      let userPayment = await UserCartModel.find({ "seller.seller_id": mongoose.Types.ObjectId(seller._id), isDeleted: false , $or: [{status: 6}]})
      .populate('product.seller_product', 'product_name product_price selling_price product_discount product_details product_decripton product_quantity')
      .populate('product.admin_product', 'product_name image product_quantity product_price selling_price product_discount product_decripton')
      .populate('user', 'full_name country_code mobile_number')
      .populate({
        path: 'orderId', model: "userOrder", select: "quantity order_id currency totalAmount deliveryCharge discountAmount orderStatus paymentStatus created_at payment_options modified_at address",
        populate: [{
          path: 'address',
          model: 'userAddress',
          select: 'full_name mobile_number house_no street locality city country state postal_code'
        }]
      })
      .sort({ created_at: -1 }).lean();
  
      completedOrders = hostPayment.concat(userPayment).sort(
        function (a, b) {
          return b.created_at - a.created_at;
        },
        { created_at: -1 }
      );
    }else if(data.all == "1"){
      worksheet = workbook.addWorksheet('All Orders Sheet');
      
      let hostPayment = await HostCartModel.find({
        "seller.seller_id": mongoose.Types.ObjectId(seller._id),
        isDeleted: false,
        $or: [{status: 1},{status: 2},{status: 3},{status: 4},{status: 5},{status: 6},{status: 7}],
      })
      .populate('product.seller_product', 'product_name product_price selling_price product_discount product_details product_decripton product_quantity')
      .populate('product.admin_product', 'product_name image product_quantity product_price selling_price product_discount product_decripton')
      .populate('host', 'first_name last_name country_code mobile_number')
      .populate({
        path: 'orderId', model: "hostOrder", select: "quantity order_id currency totalAmount deliveryCharge discountAmount orderStatus paymentStatus created_at payment_options modified_at address",
        populate: [{
          path: 'address',
          model: 'hostAddress',
          select: 'full_name mobile_number house_no street locality city country state postal_code'
        }]
      })
      .sort({ created_at: -1 }).lean();
  
      let userPayment = await UserCartModel.find({ "seller.seller_id": mongoose.Types.ObjectId(seller._id), isDeleted: false , $or: [{status: 1},{status: 2},{status: 3},{status: 4},{status: 5},{status: 6},{status: 7}]})
      .populate('product.seller_product', 'product_name product_price selling_price product_discount product_details product_decripton product_quantity')
      .populate('product.admin_product', 'product_name image product_quantity product_price selling_price product_discount product_decripton')
      .populate('user', 'full_name country_code mobile_number')
      .populate({
        path: 'orderId', model: "userOrder", select: "quantity order_id currency totalAmount deliveryCharge discountAmount orderStatus paymentStatus created_at payment_options modified_at address",
        populate: [{
          path: 'address',
          model: 'userAddress',
          select: 'full_name mobile_number house_no street locality city country state postal_code'
        }]
      })
      .sort({ created_at: -1 }).lean();

      allOrders = hostPayment.concat(userPayment).sort(
        function (a, b) {
          return b.created_at - a.created_at;
        },
        { created_at: -1 }
      );
    }

    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    let todayStart = Date.parse(start);
    let weekStart = todayStart - 7 * 86400000;
    let monthStart = todayStart - 30 * 86400000;

    if (data.sortType == 0) {
      if(ongoingOrders.length > 0){
        ongoingOrders = _.filter(ongoingOrders, (item) => item.created_at > todayStart);
      }
      if(cancelledOrders.length > 0){
        cancelledOrders = _.filter(cancelledOrders, (item) => item.created_at > todayStart);
      }
      if(completedOrders.length > 0){
        completedOrders = _.filter(completedOrders, (item) => item.created_at > todayStart);
      }
      if(allOrders.length > 0){
        allOrders = _.filter(allOrders, (item) => item.created_at > todayStart);
      }
    } else if (data.sortType == 1) {
      if(ongoingOrders.length > 0){
        ongoingOrders = _.filter(ongoingOrders, (item) => item.created_at > weekStart);
      }
      if(cancelledOrders.length > 0){
        cancelledOrders = _.filter(cancelledOrders, (item) => item.created_at > weekStart);
      }
      if(completedOrders.length > 0){
        completedOrders = _.filter(completedOrders, (item) => item.created_at > weekStart);
      }
      if(allOrders.length > 0){
        allOrders = _.filter(allOrders, (item) => item.created_at > weekStart);
      }
    } else if (data.sortType == 2) {
      if(ongoingOrders.length > 0){
        ongoingOrders = _.filter(ongoingOrders, (item) => item.created_at > monthStart);
      }
      if(cancelledOrders.length > 0){
        cancelledOrders = _.filter(cancelledOrders, (item) => item.created_at > monthStart);
      }
      if(completedOrders.length > 0){
        completedOrders = _.filter(completedOrders, (item) => item.created_at > monthStart);
      }
      if(allOrders.length > 0){
        allOrders = _.filter(allOrders, (item) => item.created_at > monthStart);
      }
    } else if (data.sortType == 3) {
      if(ongoingOrders.length > 0){
        ongoingOrders = _.filter(ongoingOrders, (item) => ((item.created_at > data.startDate) && (item.created_at < data.endDate)));
      }
      if(cancelledOrders.length > 0){
        cancelledOrders = _.filter(cancelledOrders, (item) => ((item.created_at > data.startDate) && (item.created_at < data.endDate)));
      }
      if(completedOrders.length > 0){
        completedOrders = _.filter(completedOrders, (item) => ((item.created_at > data.startDate) && (item.created_at < data.endDate)));
      }
      if(allOrders.length > 0){
        allOrders = _.filter(allOrders, (item) => ((item.created_at > data.startDate) && (item.created_at < data.endDate)));
      }
   } else {
      ongoingOrders = ongoingOrders,
      cancelledOrders = cancelledOrders,
      completedOrders = completedOrders,
      allOrders = allOrders
   }
    let dataToSend = {
      ongoingOrderList : ongoingOrders,
      cancelledOrderList : cancelledOrders,
      completedOrderList: completedOrders,
      allOrderList : allOrders
    }

    let columns = [
      { header: 'Sr No.', key: 'srNo', width: 10 },
      { header: 'Booking Id', key: 'booking_id', width: 20 },
      { header: 'Product Name', key: 'product_name', width: 32 },
      { header: 'User Name', key: 'user_name', width: 32 },
      { header: 'Mobile Number', key: 'mobile_number', width: 15 },
      { header: 'House number', key: 'house_no', width: 15 },
      { header: 'Street', key: 'street', width: 15 },
      { header: 'Locality', key: 'locality', width: 15 },
      { header: 'City', key: 'city', width: 15 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'Country', key: 'country', width: 15 },
      { header: 'Currency', key: 'currency', width: 15 },
      { header: 'Total Amount', key: 'total_amount', width: 15 },
      { header: 'Booking Date', key: 'booking_date', width: 35 },
      { header: 'Payment Status', key: 'payment_status', width: 35 },
      { header: 'Payment Option', key: 'payment_option', width: 15 },
      { header: 'Booking Status', key: 'booking_status', width: 35 },
    ];

    function getUserName(index,arrayName){
      if(dataToSend[arrayName][index].host){
        if(dataToSend[arrayName][index].host.first_name && dataToSend[arrayName][index].host.last_name){
          return `${dataToSend[arrayName][index].host.first_name} ${dataToSend[arrayName][index].host.last_name}`
        }else if(dataToSend[arrayName][index].host.first_name){
          return `${dataToSend[arrayName][index].host.first_name}`
        }else if(dataToSend[arrayName][index].host.last_name){
          return `${dataToSend[arrayName][index].host.last_name}`
        }else{
          return "";
        }
      }else{
        if(dataToSend[arrayName][index].user.full_name){
          return `${dataToSend[arrayName][index].user.full_name}`
        }else{
          return "";
        }
      }
    }

    function getContactNumber(index,arrayName){
      if(dataToSend[arrayName][index].host){
        if(dataToSend[arrayName][index].host.country_code && dataToSend[arrayName][index].host.mobile_number){
          return `${dataToSend[arrayName][index].host.country_code} ${dataToSend[arrayName][index].host.mobile_number}`
        }else if(dataToSend[arrayName][index].host.country_code){
          return `${dataToSend[arrayName][index].host.country_code}`
        }else if(dataToSend[arrayName][index].host.mobile_number){
          return `${dataToSend[arrayName][index].host.mobile_number}`
        }else{
          return "";
        }
      }else{
        if(dataToSend[arrayName][index].user.country_code && dataToSend[arrayName][index].user.mobile_number){
          return `${dataToSend[arrayName][index].user.country_code} ${dataToSend[arrayName][index].user.mobile_number}`
        }else if(dataToSend[arrayName][index].user.country_code){
          return `${dataToSend[arrayName][index].user.country_code}`
        }else if(dataToSend[arrayName][index].user.mobile_number){
          return `${dataToSend[arrayName][index].user.mobile_number}`
        }else{
          return "";
        }
      }
    }

    function getBookingStatus(index,arrayName){
        if(dataToSend[arrayName][index].status){
           return utils.getOrderStatus(Number(dataToSend[arrayName][index].status))
        }else{
          return "";
        }
    }

    function getPaymentStatus(index,arrayName){
        if(dataToSend[arrayName][index].orderId?.paymentStatus){
           return `${utils.getServicePaymentStatus(Number(dataToSend[arrayName][index].orderId?.paymentStatus))}`
        }else{
          return "";
        }
    }

    function getConvertedDate(index,arrayName){
        if(dataToSend[arrayName][index].orderId?.created_at){
           return `${(new Date(Number(dataToSend[arrayName][index].orderId?.created_at)))}`
        }else{
          return "";
        }
    }

    if(data.ongoing == "1"){
      worksheet.columns = columns;
      for (let index = 0; index < dataToSend.ongoingOrderList.length; index++) {
        let setDataInExcel = {};
        setDataInExcel.srNo = index+1;
        setDataInExcel.booking_id = dataToSend.ongoingOrderList[index]?.orderId.order_id;
        setDataInExcel.product_name = (dataToSend.ongoingOrderList[index]?.product?.seller_product) ? dataToSend.ongoingOrderList[index]?.product?.seller_product?.product_name: (dataToSend.ongoingOrderList[index]?.product?.admin_product ? dataToSend.ongoingOrderList[index]?.product?.admin_product?.product_name : "");
        setDataInExcel.user_name = getUserName(index,'ongoingOrderList');
        setDataInExcel.mobile_number = getContactNumber(index,'ongoingOrderList');
        setDataInExcel.house_no = (dataToSend.ongoingOrderList[index]?.orderId?.address?.house_no) ? dataToSend.ongoingOrderList[index]?.orderId?.address.house_no:'';
        setDataInExcel.street = (dataToSend.ongoingOrderList[index]?.orderId?.address?.street)?dataToSend.ongoingOrderList[index]?.orderId?.address.street:'';
        setDataInExcel.locality = (dataToSend.ongoingOrderList[index]?.orderId?.address?.locality)?dataToSend.ongoingOrderList[index]?.orderId?.address.locality:'';
        setDataInExcel.city = (dataToSend.ongoingOrderList[index]?.orderId?.address?.city)?dataToSend.ongoingOrderList[index]?.orderId?.address.city:'';
        setDataInExcel.state = (dataToSend.ongoingOrderList[index]?.orderId?.address?.state)?dataToSend.ongoingOrderList[index]?.orderId?.address.state:'';
        setDataInExcel.country = (dataToSend.ongoingOrderList[index]?.orderId?.address?.country)?dataToSend.ongoingOrderList[index]?.orderId?.address.country:'';
        setDataInExcel.currency = (dataToSend.ongoingOrderList[index]?.orderId?.currency) ? dataToSend.ongoingOrderList[index]?.orderId?.currency:''; 
        setDataInExcel.total_amount = (dataToSend.ongoingOrderList[index]?.orderId?.totalAmount) ? dataToSend.ongoingOrderList[index]?.orderId?.totalAmount:'';
        setDataInExcel.booking_date =  getConvertedDate(index,'ongoingOrderList');
        setDataInExcel.payment_status =  getPaymentStatus(index,'ongoingOrderList');
        setDataInExcel.payment_option = (dataToSend.ongoingOrderList[index]?.orderId?.payment_options) ? dataToSend.ongoingOrderList[index]?.orderId?.payment_options : '';
        setDataInExcel.booking_status =  getBookingStatus(index,'ongoingOrderList');
        // console.log(setDataInExcel)
        worksheet.addRow(setDataInExcel);
      }
    }else if(data.cancelled == "1"){
      worksheet.columns = columns;
      for (let index = 0; index < dataToSend.cancelledOrderList.length; index++) {
        let setDataInExcel = {};
        setDataInExcel.srNo = index+1;
        setDataInExcel.booking_id = dataToSend.cancelledOrderList[index]?.orderId.order_id;
        setDataInExcel.product_name = (dataToSend.cancelledOrderList[index]?.product?.seller_product) ? dataToSend.cancelledOrderList[index]?.product?.seller_product?.product_name: (dataToSend.cancelledOrderList[index]?.product?.admin_product ? dataToSend.cancelledOrderList[index]?.product?.admin_product?.product_name : "");
        setDataInExcel.user_name = getUserName(index,'cancelledOrderList');
        setDataInExcel.mobile_number = getContactNumber(index,'cancelledOrderList');
        setDataInExcel.house_no = (dataToSend.cancelledOrderList[index]?.orderId?.address?.house_no) ? dataToSend.cancelledOrderList[index]?.orderId?.address.house_no:'';
        setDataInExcel.street = (dataToSend.cancelledOrderList[index]?.orderId?.address?.street)?dataToSend.cancelledOrderList[index]?.orderId?.address.street:'';
        setDataInExcel.locality = (dataToSend.cancelledOrderList[index]?.orderId?.address?.locality)?dataToSend.cancelledOrderList[index]?.orderId?.address.locality:'';
        setDataInExcel.city = (dataToSend.cancelledOrderList[index]?.orderId?.address?.city)?dataToSend.cancelledOrderList[index]?.orderId?.address.city:'';
        setDataInExcel.state = (dataToSend.cancelledOrderList[index]?.orderId?.address?.state)?dataToSend.cancelledOrderList[index]?.orderId?.address.state:'';
        setDataInExcel.country = (dataToSend.cancelledOrderList[index]?.orderId?.address?.country)?dataToSend.cancelledOrderList[index]?.orderId?.address.country:'';
        setDataInExcel.currency = (dataToSend.cancelledOrderList[index]?.orderId?.currency) ? dataToSend.cancelledOrderList[index]?.orderId?.currency:''; 
        setDataInExcel.total_amount = (dataToSend.cancelledOrderList[index]?.orderId?.totalAmount) ? dataToSend.cancelledOrderList[index]?.orderId?.totalAmount:'';
        setDataInExcel.booking_date =  getConvertedDate(index,'cancelledOrderList');
        setDataInExcel.payment_status =  getPaymentStatus(index,'cancelledOrderList');
        setDataInExcel.payment_option = (dataToSend.cancelledOrderList[index]?.orderId?.payment_options) ? dataToSend.cancelledOrderList[index]?.orderId?.payment_options : '';
        setDataInExcel.booking_status =  getBookingStatus(index,'cancelledOrderList');
        // console.log(setDataInExcel)
        worksheet.addRow(setDataInExcel);
      }
    }else if(data.completed == "1"){
      worksheet.columns = columns;
      for (let index = 0; index < dataToSend.completedOrderList.length; index++) {
        let setDataInExcel = {};
        setDataInExcel.srNo = index+1;
        setDataInExcel.booking_id = dataToSend.completedOrderList[index]?.orderId.order_id;
        setDataInExcel.product_name = (dataToSend.completedOrderList[index]?.product?.seller_product) ? dataToSend.completedOrderList[index]?.product?.seller_product?.product_name: (dataToSend.completedOrderList[index]?.product?.admin_product ? dataToSend.completedOrderList[index]?.product?.admin_product?.product_name : "");
        setDataInExcel.user_name = getUserName(index,'completedOrderList');
        setDataInExcel.mobile_number = getContactNumber(index,'completedOrderList');
        setDataInExcel.house_no = (dataToSend.completedOrderList[index]?.orderId?.address?.house_no) ? dataToSend.completedOrderList[index]?.orderId?.address.house_no:'';
        setDataInExcel.street = (dataToSend.completedOrderList[index]?.orderId?.address?.street)?dataToSend.completedOrderList[index]?.orderId?.address.street:'';
        setDataInExcel.locality = (dataToSend.completedOrderList[index]?.orderId?.address?.locality)?dataToSend.completedOrderList[index]?.orderId?.address.locality:'';
        setDataInExcel.city = (dataToSend.completedOrderList[index]?.orderId?.address?.city)?dataToSend.completedOrderList[index]?.orderId?.address.city:'';
        setDataInExcel.state = (dataToSend.completedOrderList[index]?.orderId?.address?.state)?dataToSend.completedOrderList[index]?.orderId?.address.state:'';
        setDataInExcel.country = (dataToSend.completedOrderList[index]?.orderId?.address?.country)?dataToSend.completedOrderList[index]?.orderId?.address.country:'';
        setDataInExcel.currency = (dataToSend.completedOrderList[index]?.orderId?.currency) ? dataToSend.completedOrderList[index]?.orderId?.currency:''; 
        setDataInExcel.total_amount = (dataToSend.completedOrderList[index]?.orderId?.totalAmount) ? dataToSend.completedOrderList[index]?.orderId?.totalAmount:'';
        setDataInExcel.booking_date =  getConvertedDate(index,'completedOrderList');
        setDataInExcel.payment_status =  getPaymentStatus(index,'completedOrderList');
        setDataInExcel.payment_option = (dataToSend.completedOrderList[index]?.orderId?.payment_options) ? dataToSend.completedOrderList[index]?.orderId?.payment_options : '';
        setDataInExcel.booking_status =  getBookingStatus(index,'completedOrderList');
        // console.log(setDataInExcel)
        worksheet.addRow(setDataInExcel);
      }
    }else if(data.all == "1"){
      worksheet.columns = columns;
      for (let index = 0; index < dataToSend.allOrderList.length; index++) {
        let setDataInExcel = {};
        setDataInExcel.srNo = index+1;
        setDataInExcel.booking_id = dataToSend.allOrderList[index]?.orderId.order_id;
        setDataInExcel.product_name = (dataToSend.allOrderList[index]?.product?.seller_product) ? dataToSend.allOrderList[index]?.product?.seller_product?.product_name: (dataToSend.allOrderList[index]?.product?.admin_product ? dataToSend.allOrderList[index]?.product?.admin_product?.product_name : "");
        setDataInExcel.user_name = getUserName(index,'allOrderList');
        setDataInExcel.mobile_number = getContactNumber(index,'allOrderList');
        setDataInExcel.house_no = (dataToSend.allOrderList[index]?.orderId?.address?.house_no) ? dataToSend.allOrderList[index]?.orderId?.address.house_no:'';
        setDataInExcel.street = (dataToSend.allOrderList[index]?.orderId?.address?.street)?dataToSend.allOrderList[index]?.orderId?.address.street:'';
        setDataInExcel.locality = (dataToSend.allOrderList[index]?.orderId?.address?.locality)?dataToSend.allOrderList[index]?.orderId?.address.locality:'';
        setDataInExcel.city = (dataToSend.allOrderList[index]?.orderId?.address?.city)?dataToSend.allOrderList[index]?.orderId?.address.city:'';
        setDataInExcel.state = (dataToSend.allOrderList[index]?.orderId?.address?.state)?dataToSend.allOrderList[index]?.orderId?.address.state:'';
        setDataInExcel.country = (dataToSend.allOrderList[index]?.orderId?.address?.country)?dataToSend.allOrderList[index]?.orderId?.address.country:'';
        setDataInExcel.currency = (dataToSend.allOrderList[index]?.orderId?.currency) ? dataToSend.allOrderList[index]?.orderId?.currency:''; 
        setDataInExcel.total_amount = (dataToSend.allOrderList[index]?.orderId?.totalAmount) ? dataToSend.allOrderList[index]?.orderId?.totalAmount:'';
        setDataInExcel.booking_date =  getConvertedDate(index,'allOrderList');
        setDataInExcel.payment_status =  getPaymentStatus(index,'allOrderList');
        setDataInExcel.payment_option = (dataToSend.allOrderList[index]?.orderId?.payment_options) ? dataToSend.allOrderList[index]?.orderId?.payment_options : '';
        setDataInExcel.booking_status =  getBookingStatus(index,'allOrderList');
        // console.log(setDataInExcel)
        worksheet.addRow(setDataInExcel);
      }
    }

    // for uploading file to local server
    // excelFile = await workbook.xlsx.writeFile('./upload/' + seller._id + '_Analytics.xlsx');
    // let url = config.HOSTBACK + '/upload/' + seller._id + '_Analytics.xlsx';
 
    // for uploading file to aws server
    let randomNumber = await utils.randomReportStringGenerator();
    const buffer = await workbook.xlsx.writeBuffer();
    const params = {
      Key: seller._id+"_"+ randomNumber +"_Analytics.xlsx",
      Body: buffer,
      Bucket: 'petsworldbucket',
      ContentType: 'application/vnd.ms-excel',
    };

    let awsUrl = await uploadToBucket(params)

    return { response: dataToSend, message: "All report fetched successfully", status: 1, url: awsUrl };

  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteAccount = async (user) => {
  try {
  
    var deleteUser = await SellerModel.findOneAndDelete({  _id: mongoose.Types.ObjectId(user._id) }).lean();
        
    return {  message: "Account deleted successfully", status: 1  };

  } catch (err) {
    throw new Error(err.message);
  }
};

exports.updateSellerData = async (seller, data) => {
  try {
    let { unique_id, evidence_id } = data;

    let result = await SellerModel.findOneAndUpdate({ _id: seller._id },{ $set: { unique_id: unique_id, evidence_id: evidence_id } },{ new: true }).lean();
    if(!result){
      return { status: 0, message: "Unable to update data" };
    }
    return {  message: "Data updated successfully", status: 1 };

  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getOrderDetails = async (seller, data) => {
  try {
    if (!data.order_id || data.order_id == "")
      return { status: 0, message: "Order id is required" };

    let modified_at = new Date().getTime();
    let cartData = null;
    let orderStatus = 0;
    let result = await HostOrderModel.findOne({ _id: data.order_id })
      .populate('host', 'first_name last_name country_code mobile_number').populate('coupon').populate('address').lean();
    if (result) {
      cartData = await HostCartModel.findOne({ _id: result.cart_id })
      .populate(
        "product.seller_product",
        "product_name product_price selling_price product_discount product_details product_decripton product_quantity"
      )
      .populate(
        "product.admin_product",
        "product_name image product_quantity product_price selling_price product_discount product_decripton"
      ).lean();
      
    }
    if (!result) {
      result = await UserOrderModel.findOne({ _id: data.order_id })
        .populate('user', 'full_name country_code mobile_number').populate('coupon').populate('address').lean();
      if (result) {
        cartData = await UserCartModel.findOne({ _id: result.cart_id })
        .populate(
          "product.seller_product",
          "product_name product_price selling_price product_discount product_details product_decripton product_quantity"
        )
        .populate(
          "product.admin_product",
          "product_name image product_quantity product_price selling_price product_discount product_decripton"
        ).lean();

        if(cartData && cartData.status == 5){
          if(cartData && cartData.delivery_id_order && cartData.delivery_token){
            // console.log(cartData.delivery_id_order)
            // console.log(cartData.delivery_token)
            let coboxOrderStatus = await utils.coboxOrderStatus(cartData.delivery_token, cartData.delivery_id_order);
            // console.log(coboxOrderStatus)
            if(coboxOrderStatus){
              let orderData = (JSON.parse(coboxOrderStatus));
              console.log(orderData)
              if(orderData && orderData.order_status && (orderData.order_status.id_order_status)){
                orderStatus = orderData.order_status.id_order_status;
                if(orderData.order_status.id_order_status == 500){
                  let updateCart = await UserCartModel.findOneAndUpdate({ _id: cartData._id },{ $set: { status: 6, modified_at: modified_at }}, { new: true });
                  if(data.order_id){
                    let updateOrder = await UserOrderModel.findByIdAndUpdate({ _id: data.order_id },{$set: { orderStatus: 5, modified_at: modified_at }},{ new: true });
                  } 
                }else if((orderData.order_status.id_order_status == 600) || (orderData.order_status.id_order_status == 1.100) ||(orderData.order_status.id_order_status == 1.200) ||(orderData.order_status.id_order_status == 1.300) ||(orderData.order_status.id_order_status == 1.400) ||(orderData.order_status.id_order_status == 1.500) ||(orderData.order_status.id_order_status == 1.600)){
                  let updateCart = await UserCartModel.findOneAndUpdate({ _id: cartData._id },{ $set: { status: 8, modified_at: modified_at }}, { new: true });
                  if(data.order_id){
                    let updateOrder = await UserOrderModel.findByIdAndUpdate({ _id: data.order_id },{$set: { orderStatus: 7, modified_at: modified_at }},{ new: true });
                  }
                }
              }
            }
          }
        }
      }
    }

    if (!result) {
      return { status: 0, message: "Something went Wrong" };
    }
    result.orderDetails = cartData;
    result.coboxOrderStatus = orderStatus;
    return { status: 1, message: "Order details fetched successfully", data: result };
  } catch (error) {
    throw new Error(error.message);
  }
};
