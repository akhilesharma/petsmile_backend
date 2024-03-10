const { AdminModel } = require("../models/adminModel");
const { UserModel } = require("../models/userModel");
const { HostModel } = require("../models/hostModel");
const { HostProfileModel } = require("../models/hostProfileModel");
const { SellerModel } = require("../models/sellerModel");
const { ServiceProviderModel } = require("../models/servicesModel");
const {
  productMainCategoryAdminModel,
} = require("../models/productMainCategoryModel");
const { inventoryModel } = require("../models/inventoryModel");
const {
  productCategoryAdminModel,
} = require("../models/productCategoryAdminModel");
const {
  productSubCategoryAdminModel,
} = require("../models/productSubCategoryAdminModel");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/authentication");
const utils = require("../modules/utils");
const { default: mongoose } = require("mongoose");

const { TrackingDeviceModel } = require("../models/trackingDeviceModal");
const { PromocodeModel } = require("../models/promocodeModel");
const { HostOrderBookingModel } = require("../models/hostOrderBookingModel");
const { UserOrderBookingModel } = require("../models/userOrderBookingModel");
const { UserCartModel } = require("../models/userCartModel");
const { HostCartModel } = require("../models/hostCartModel");
const { UserOrderModel } = require("../models/userOrderModel");
const { HostOrderModel } = require("../models/hostOrderModel");
const { AdvertisementModel } = require("../models/AdvertisementModel");
const { OrderRatingModel } = require("../models/orderRatingModel");
const { ServiceCategoryModel } = require("../models/serviceCategoryModel");
const { CommissionModel } = require("../models/commissionModel");
const { SubAdminModel } = require("../models/subAdminModel");
const {
  HostServiceBookingModel,
} = require("../models/hostServiceBookingModel");
const {
  UserServiceBookingModel,
} = require("../models/userServiceBookingModel");
const {
  ServiceOrderRatingModel,
} = require("../models/serviceOrderRatingModel");
const { PackageBookingModel } = require("../models/packageBookingModel");
const { HostAddressModel } = require("../models/hostAddressModel");
const { HostPackageModel } = require("../models/hostPackageModel");
const { SettingModel } = require("../models/settingModel");
const { FaqModel } = require("../models/faqModel");
const { SellerFaqModel } = require("../models/sellerFaqModel");
const { ServiceFaqModel } = require("../models/serviceFaqModel");

const _ = require("lodash");
var pdf = require("html-pdf");
var html_to_pdf = require("html-pdf-node");
var fs = require("fs");
const aws = require("../middlewares/aws-s3");
const path = require("path");
const { HostSettingModel } = require("../models/hostSettingModel");
const { SellerSettingModel } = require("../models/sellerSettingModel");
const { ServiceSettingModel } = require("../models/serviceSettingModel");
const { HostFaqModel } = require("../models/hostFaqModel");
const serviceProvider = require("../validation/serviceProviderValidaton");
const { NotificationModel } = require("../models/notificationModel");
const FCM = require("fcm-node/lib/fcm");
const { UserWalletTransactionModel } = require("../models/userWalletTransactionModel");
const { UserWalletModel } = require("../models/userWalletModel");
const generateUniqueId = require('generate-unique-id');
const { ReportTicketModel } = require("../models/reportTicketModel");
const { UserNotificationModel, HealthGoalPointModel } = require("../models/setHealthPointModel");
const { UsageLimitPurchaseModel } = require("../models/usageLimitPurchaseModel");
const { UserRedeemPointModel } = require("../models/userRedeemPointModel");
const { UserRedeemPointTransactionModel } = require("../models/userRedeemPointTransactionModel");
const { ServiceChargeModel } = require("../models/serviceChargeModel");


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

exports.registerAdmin = async (data) => {
  try {
    let emailExist = await AdminModel.findOne({
      email: data.email,
    });

    if (emailExist) throw new Error("Email already exist");

    const token = auth.generateToken();
    // console.log("Token", token);

      data.profileType = "1";
      data.isProfileCreated = true;
      data.password = await bcrypt.hash(data.password, 10);
    
      let dataToSave = {
      name: data.name,
      email: data.email,
      countryCode: data.countryCode,
      mobileNumber: data.mobileNumber,
      peofileType: data.peofileType,
      isProfileCreated: data.isProfileCreated,
      password: data.password,
    };

    let myData = new AdminModel(dataToSave);

    let save = await myData.save();

    if (save) {
      let update = await AdminModel.findOneAndUpdate(
        { email: save.email },
        { $set: { access_token: token } },
        { new: true }
      );
      return {
        message: "Data created successfully",
        response: update,
        status: 1,
      };
    } else {
      return {
        message: "Not created ",
        status: 2,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};


exports.loginAdmin = async (data) => {
  try {
    let adminData = await AdminModel.findOne({ email: data.email });
    var isSubAdmin = 0;
    if (!adminData) {
       adminData = await SubAdminModel.findOne({ email: data.email });
    }
    if (!adminData) {
      return { message: "Invalid login email", status: -1 };
    } else {
      let checkPassword = false;
      let subAdminData = await SubAdminModel.findOne({ email: data.email });
      if (subAdminData) {
        isSubAdmin = 1;
        if (subAdminData.password == data.password) {
          checkPassword = true;
        }
        if (subAdminData.isBlocked == 1) {
          return { message: "Your account has been blocked", status: -1 };
        }
      } else {
        checkPassword = await bcrypt.compare(data.password, adminData.password);
      }
      if (checkPassword) {
        data.updateAt = new Date().getTime();

        let access_token = auth.generateToken();
        console.log("Access token", access_token);
        let dataToSave = {
          updateAt: data.updateAt,
          access_token: access_token,
        };
        let update;
        if (isSubAdmin == 1) {
          update = await SubAdminModel.findOneAndUpdate(
            subAdminData._id,
            dataToSave,
            { new: true }
          ).lean(true);
        } else {
          update = await AdminModel.findOneAndUpdate(
            adminData._id,
            dataToSave,
            { new: true }
          ).lean(true);
        }

        if (update) {
          let res = { isSubAdmin: isSubAdmin, ...update };
          return {
            message: "Logged in successfully",
            response: res,
            status: 1,
          };
        }
      } else {
        return {
          message: "Incorrect password.",
          status: 2,
        };
      }
    }
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

exports.forgetPassword = async (data) => {
  try {
    let adminData = await AdminModel.findOne({ email: data.email }).select(
      "varificationCode email"
    );

    if (!adminData) {
      return {
        message: "Email does not exist.",
        status: 3,
      };
    }

    // const token = auth.generateToken();

    // let update = await AdminModel.findOneAndUpdate(
    //   adminData._id,
    //   { $set: { access_token: token } },
    //   { new: true }
    // ).select("varificationCode");

    if (adminData) {
      return {
        message: "OTP has been sent to the email",
        response: adminData,
        status: 1,
      };
    } else {
      return {
        message: "Error occured",
        status: 2,
      };
    }
  } catch (error) {
    throw new Error("Something went wrong");
  }
};



exports.verifyOTP = async (data) => {
  try {
    if (!data.varificationCode || data.varificationCode == "")
      return { status: 0, message: "Please enter OTP" };
    console.log(data.varificationCode);
    let admin = await AdminModel.findOne({
      varificationCode: data.varificationCode,
    });
    if (admin) {
      return {
        message: "OTP verified Successfully",
        status: 1,
        response: admin,
      };
    } else {
      return {
        message: "Invalid OTP",
        status: 2,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.resetPassword = async (data) => {
  try {
    // console.log(data)
    if (!data.email || data.email == "")
      return { status: 0, message: "email is required" };
    if (!data.newPassword || data.newPassword == "")
      return { status: 0, message: "New password is required" };
    if (!data.confirmPassword || data.confirmPassword == "")
      return { status: 0, message: "Confirm password is required" };
    let adminData = await AdminModel.findOne({ email: data.email });

    console.log("this is data", adminData);
    console.log("this is data", data);

    if (!adminData || adminData == null) {
      return { status: 0, message: "Admin does not exist" };
    }
    let checkPassword =
      (await bcrypt.compare(data.newPassword, adminData.password)) &&
      (await bcrypt.compare(data.confirmPassword, adminData.password));
    if (checkPassword) {
      return {
        status: 0,
        message: "Old Password and new Password should not be same",
      };
    }
    // throw new Error("Old password and new password are same")

    if (data.newPassword == data.confirmPassword) {
      let password = await bcrypt.hash(data.newPassword, 10);
      adminData.password = password;
      // user.link_token = '' //remove
      let admin = adminData;
      let saveuser = admin.save();
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

exports.allUser = async () => {
  try {
    let userData = await UserModel.find();
    if (userData) {
      return {
        status: 1,
        response: userData,
        message: "All users",
      };
    } else {
      return {
        status: 2,
        message: "No users",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.blockUser = async (data) => {
  try {
    let userData = await UserModel.findById({ _id: data._id });
    console.log("Body data", data, userData);

    if (!userData) throw new Error("User doesnot exist");

    let update = await UserModel.findByIdAndUpdate(
      userData._id,
      { $set: { is_blocked: data.is_blocked } },
      { new: true }
    );
    console.log("updated data", update);

    if (update.is_blocked == true) {
      return {
        message: "User Blocked",
        status: 1,
        response: update,
      };
    }
    return {
      message: "User unBlocked",
      status: 2,
      response: update,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// storeData = await productModel.aggregate([{
//     $match: {
//         store_id: storeId,
//         is_delete: false,
//     },
// },
// {
//     $lookup: {
//         from: "category",
//         localField: "category_id",
//         foreignField: "_id",
//         as: "category_id",
//     },
// },
// {
//     $unwind: {
//         path: "$category_id",
//         preserveNullAndEmptyArrays: true,
//     },
// }

exports.allHost = async () => {
  try {
    let hostData = await HostProfileModel.aggregate([
      {
        $lookup: {
          from: "Host",
          localField: "host",
          foreignField: "_id",
          as: "host_id",
        },
      },
      { $sort : { createdAt : -1 } }
    ]);
    if (hostData) {
      return {
        status: 1,
        response: hostData,
        message: "All Hosts",
      };
    } else {
      return {
        status: 2,
        message: "No Hosts",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.acceptRejectHost = async (data) => {
  try {
    let hostData = await HostProfileModel.findById(data._id);

    console.log("Host profile data", hostData);

    if (!hostData) throw new Error("Host doesnot exist");

    let updateHost = await HostModel.findByIdAndUpdate(hostData.host, {
      $set: { is_verified_by_admin: data.is_verified_by_admin },
    });
    console.log("Host data", updateHost);

    let updateHost1 = await HostProfileModel.findById(data._id);

    if (data.is_verified_by_admin == 1) {
      return {
        status: 1,
        message: "Host Accepted",
        response: updateHost1,
      };
    }
    if (data.is_verified_by_admin == 2) {
      return {
        status: 2,
        message: "Host Rejected",
        response: updateHost1,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.blockUnblockHost = async (data) => {
  try {
    let hostData = await HostProfileModel.findById({ _id: data._id });
    console.log("Host data", hostData);

    if (!hostData) throw new Error("Host does not exist");

    let update = await HostModel.findByIdAndUpdate(
      hostData.host,
      { $set: { is_blocked: data.is_blocked } },
      { new: true }
    );
    console.log("updated data", update);

    if (update.is_blocked == true) {
      return {
        message: "Host Blocked",
        status: 1,
        response: update,
      };
    }
    return {
      message: "Host unBlocked",
      status: 2,
      response: update,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.allSeller = async () => {
  try {
    let sellerData = await SellerModel.find();
    if (sellerData) {
      return {
        status: 1,
        message: "All Sellers",
        response: sellerData,
      };
    } else {
      return {
        status: 2,
        message: "No Sellers",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.acceptRejectSeller = async (data) => {
  try {
    let sellerData = await SellerModel.findById(data._id);

    if (!sellerData) throw new Error("Seller doesnot exist");

    let updateSeller = await SellerModel.findByIdAndUpdate(sellerData._id, {
      $set: { is_verified_by_admin: data.is_verified_by_admin },
    });
    let updatedSeller1 = await SellerModel.findById(data._id);
    if (data.is_verified_by_admin == 1) {
      return {
        status: 1,
        message: "Seller Accepted",
        response: updatedSeller1,
      };
    }
    if (data.is_verified_by_admin == 2) {
      return {
        status: 2,
        message: "Seller Rejected",
        response: updatedSeller1,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.blockUnblockSeller = async (data) => {
  try {
    let sellerData = await SellerModel.findById({ _id: data._id });
    console.log("Body data", data, sellerData);

    if (!sellerData) throw new Error("Seller doesnot exist");

    let update = await SellerModel.findByIdAndUpdate(
      sellerData._id,
      { $set: { is_blocked: data.is_blocked } },
      { new: true }
    );
    console.log("updated data", update);

    if (update.is_blocked == true) {
      return {
        message: "Seller Blocked",
        status: 1,
        response: update,
      };
    }
    return {
      message: "Seller unBlocked",
      status: 2,
      response: update,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.allService = async () => {
  try {
    let serviceData = await ServiceProviderModel.find();
    if (serviceData) {
      return {
        status: 1,
        message: "All Servide Data",
        response: serviceData,
      };
    } else {
      return {
        status: 2,
        message: "No data",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.acceptRejectService = async (data) => {
  try {
    let serviceData = await ServiceProviderModel.findById(data._id);

    if (!serviceData) throw new Error("Seller doesnot exist");

    let updateSeller = await ServiceProviderModel.findByIdAndUpdate(
      serviceData._id,
      { $set: { is_verified_by_admin: data.is_verified_by_admin } }
    );
    let updatedService1 = await ServiceProviderModel.findById(data._id);
    if (data.is_verified_by_admin == 1) {
      return {
        status: 1,
        message: "Service Accepted",
        response: updatedService1,
      };
    }
    if (data.is_verified_by_admin == 2) {
      return {
        status: 2,
        message: "Service Rejected",
        response: updatedService1,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.blockUnblockService = async (data) => {
  try {
    let serviceData = await ServiceProviderModel.findById({ _id: data._id });
    console.log("Body data", data, serviceData);

    if (!serviceData) throw new Error("Seller doesnot exist");

    let update = await ServiceProviderModel.findByIdAndUpdate(
      serviceData._id,
      { $set: { is_blocked: data.is_blocked } },
      { new: true }
    );
    console.log("updated data", update);

    if (update.is_blocked == true) {
      return {
        message: "Service Blocked",
        status: 1,
        response: update,
      };
    }
    return {
      message: "Service unBlocked",
      status: 2,
      response: update,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.createCategory = async (data, files) => {
  try {
    let categoryExist = await productCategoryAdminModel.findOne({
      categoryName: data.categoryName,
    });
    if (categoryExist) {
      return {
        status: -1,
        message: "Category already exist",
      };
    } else {
      if (files) {
        if (files.categoryImage != null) {
          data.categoryImage = files.categoryImage[0].location;
        }
      }
      let category = await productCategoryAdminModel.create(data);
      let save = await category.save();

      if (save) {
        return {
          status: 1,
          message: "Category Created",
          response: save,
        };
      } else {
        return {
          status: 2,
          message: "Category Not Created",
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.categoryList = async () => {
  try {
    let data = await productCategoryAdminModel.find();
    if (data) {
      return {
        status: 1,
        message: "All Product Category data",
        response: data,
      };
    } else {
      return {
        status: 2,
        message: "Not found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.editCategory = async (data, files) => {
  try {
    let categoryData = await productCategoryAdminModel.findById(data._id);
    console.log("This is data", categoryData);
    if (!categoryData) {
      return {
        status: -1,
        message: "Category does not exist",
      };
    } else {
      if (files) {
        if (files.categoryImage != null) {
          data.categoryImage = files.categoryImage[0].location;
        }
      }
      let update = await productCategoryAdminModel.findByIdAndUpdate(
        categoryData._id,
        data,
        { new: true }
      );

      if (update) {
        return {
          status: 1,
          message: "Category updated",
          response: update,
        };
      } else {
        return {
          status: 2,
          message: "Category not updated",
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteCategory = async (data) => {
  try {
    let catData = await productCategoryAdminModel.findById(data._id);
    if (!catData) {
      return {
        status: -1,
        message: "Category does not exist",
      };
    } else {
      let deleteData = await productCategoryAdminModel.findByIdAndDelete(
        catData._id
      );
      if (deleteData) {
        return {
          status: 1,
          message: "Category deleted",
        };
      } else {
        return {
          status: 2,
          message: "Category not deleted",
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.addSubCategory = async (data) => {
  try {
    if (
      data.categoryId == null ||
      data.categoryId == "" ||
      data.categoryId == undefined
    )
      throw new Error("Category Id is required");
    if (
      data.subCategoryName == null ||
      data.subCategoryName == "" ||
      data.subCategoryName == undefined
    )
      throw new Error("Sub Category Name  is required");

    let subCat = await productSubCategoryAdminModel.findOne({
      subCategoryName: data.subCategoryName,
    });

    if (subCat) {
      return {
        status: -1,
        message: "Sub Category already Exist",
      };
    } else {
      let mySubCat = await productSubCategoryAdminModel.create(data);

      if (mySubCat) {
        return {
          message: "Sub Category created",
          status: 1,
          response: mySubCat,
        };
      } else {
        return {
          message: "Sub Category not created",
          status: 2,
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.productSubCatList = async () => {
  try {
    let subCat = await productSubCategoryAdminModel.find();
    if (subCat) {
      return {
        status: 1,
        message: "Sub Category List",
        response: subCat,
      };
    } else {
      return {
        status: 2,
        message: "Sub Category not found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.editProductSubCat = async (data) => {
  try {
    if (
      data.categoryId == null ||
      data.categoryId == "" ||
      data.categoryId == undefined
    )
      throw new Error("Category Id is required");
    if (
      data.subCategoryName == null ||
      data.subCategoryName == "" ||
      data.subCategoryName == undefined
    )
      throw new Error("Sub Category Name  is required");

    let subCat = await productSubCategoryAdminModel.findById(data._id);
    console.log("This is my data", subCat);
    if (!subCat) {
      return {
        status: -1,
        message: "Sub Category does not exist",
      };
    } else {
      let update = await productSubCategoryAdminModel.findByIdAndUpdate(
        subCat._id,
        data,
        { new: true }
      );

      if (update) {
        return {
          status: 1,
          message: "Sub category Updated ",
          response: update,
        };
      } else {
        return {
          status: 2,
          message: "Not Updated ",
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.subCatDelete = async (data) => {
  try {
    let subCat = await productSubCategoryAdminModel.findByIdAndDelete(data._id);
    if (!subCat) {
      return {
        status: -1,
        message: "Sub Category does not exist",
      };
    } else {
      if (subCat) {
        return {
          status: 1,
          message: "Sub Category deleted",
          response: subCat,
        };
      } else {
        return {
          status: 2,
          message: "Sub Category Not deleted",
        };
      }
    }
  } catch (error) {}
};

exports.addTrackingDevice = async (data, files) => {
  try {
    let categoryExist = await TrackingDeviceModel.findOne({
      product_name: data.product_name,
    });
    if (categoryExist) {
      return {
        status: -1,
        message: "Device already exist",
      };
    } else {
      if (files) {
        if (files.image != null) {
          data.image = files.image[0].location;
        }
      }
      data.productMainCategoryId = "628b25df43143e1f54c5f797";
      let category = await TrackingDeviceModel.create(data);
      let save = await category.save();

      if (save) {
        return {
          status: 1,
          message: "Tracking Device Created",
          response: save,
        };
      } else {
        return {
          status: 2,
          message: "Tracking Device Not Created",
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.editTrackingDevice = async (data, files) => {
  try {
    let categoryExist = await TrackingDeviceModel.findOne({ _id: data._id });
    if (!categoryExist) {
      return {
        status: -1,
        message: "Device does not exist",
      };
    } else {
      if (files) {
        if (files.image != null) {
          data.image = files.image[0].location;
        }
      }

      let save = await TrackingDeviceModel.findByIdAndUpdate(data._id, data, {
        new: true,
      });

      if (save) {
        return {
          status: 1,
          message: "Tracking Device Updated",
          response: save,
        };
      } else {
        return {
          status: 2,
          message: "Tracking Device Not Updated",
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.trackingDeviceList = async () => {
  try {
    let subCat = await TrackingDeviceModel.find({}).sort({ _id: -1 }).lean();

    if (subCat.length > 0) {
      for (let i = 0; i < subCat.length; i++) {
        let allRatings = await OrderRatingModel.find(
          { "product.admin_product": subCat[i]._id },
          { rating_point: 1 }
        ).lean();
        if (allRatings.length > 0) {
          let sum = allRatings.reduce((accumulator, object) => {
            return accumulator + object.rating_point;
          }, 0);
          subCat[i].avgRating = (sum / allRatings.length).toFixed(1);
        } else {
          subCat[i].avgRating = "0.0";
        }
      }
    }
    if (subCat) {
      return {
        status: 1,
        message: "Tracking Device List",
        response: subCat,
      };
    } else {
      return {
        status: 2,
        message: "Tracking Device not found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteTrackingDevice = async (data) => {
  try {
    let catData = await TrackingDeviceModel.findById(data._id);
    if (!catData) {
      return {
        status: -1,
        message: "Tracking Device does not exist",
      };
    } else {
      let deleteData = await TrackingDeviceModel.findByIdAndDelete(catData._id);
      if (deleteData) {
        return {
          status: 1,
          message: "Tracking Device deleted",
        };
      } else {
        return {
          status: 2,
          message: "Tracking Device not deleted",
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.blockUnblockTrackingDevice = async (data) => {
  try {
    let userData = await TrackingDeviceModel.findById({ _id: data._id });

    if (!userData) throw new Error("Tracking Device doesnot exist");

    let update = await TrackingDeviceModel.findByIdAndUpdate(
      userData._id,
      { $set: { is_blocked: data.is_blocked } },
      { new: true }
    );

    if (update.is_blocked == true) {
      return {
        message: "Tracking Device Blocked",
        status: 1,
        response: update,
      };
    } else {
      return {
        message: "Tracking Device unBlocked",
        status: 1,
        response: update,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.productMainCategory = async (data, files) => {
  try {
    let categoryExist = await productMainCategoryAdminModel.findOne({
      mainCategoryName: data.mainCategoryName,
    });
    if (categoryExist) {
      return {
        status: -1,
        message: "Category already exist",
      };
    } else {
      if (files) {
        if (files.MainCategoryImage != null) {
          data.MainCategoryImage = files.MainCategoryImage[0].location;
        }
      }
      let category = await productMainCategoryAdminModel.create(data);
      let save = await category.save();

      if (save) {
        return {
          status: 1,
          message: "Category Created",
          response: save,
        };
      } else {
        return {
          status: 2,
          message: "Category Not Created",
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.mainCategoryList = async () => {
  try {
    let data = await productMainCategoryAdminModel
      .find()
      .sort({ orderNumber: 1 })
      .lean();
    if (data) {
      return {
        status: 1,
        message: "All Main Product Category data",
        response: data,
      };
    } else {
      return {
        status: 2,
        message: "Not found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.editMainCategory = async (data, files) => {
  try {
    let categoryData = await productMainCategoryAdminModel.findById(data._id);
    console.log("This is data", categoryData);
    if (!categoryData) {
      return {
        status: -1,
        message: "Category does not exist",
      };
    } else {
      if (files) {
        if (files.MainCategoryImage != null) {
          data.MainCategoryImage = files.MainCategoryImage[0].location;
        }
      }
      let update = await productMainCategoryAdminModel.findByIdAndUpdate(
        categoryData._id,
        data,
        { new: true }
      );

      if (update) {
        return {
          status: 1,
          message: "Category updated",
          response: update,
        };
      } else {
        return {
          status: 2,
          message: "Category not updated",
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteMainCategory = async (data) => {
  try {
    let catData = await productMainCategoryAdminModel.findById(data._id);
    if (!catData) {
      return {
        status: -1,
        message: "Category does not exist",
      };
    } else {
      let deleteData = await productMainCategoryAdminModel.findByIdAndDelete(
        catData._id
      );
      if (deleteData) {
        return {
          status: 1,
          message: "Category deleted",
        };
      } else {
        return {
          status: 2,
          message: "Category not deleted",
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.InventoryList = async () => {
  try {
    let data = await inventoryModel.find().populate("trackingDeviceId");
    if (data) {
      return {
        status: 1,
        message: "All Promocode data",
        response: data,
      };
    } else {
      return {
        status: 2,
        message: "Not found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.addInventory = async (data) => {
  try {
    if (
      data.trackingDeviceId == null ||
      data.trackingDeviceId == "" ||
      data.trackingDeviceId == undefined
    )
      throw new Error("tracking Device Id is required");
    if (data.stock == null || data.stock == "" || data.stock == undefined)
      throw new Error("Number of stock is required");

    if (
      data.minStock == null ||
      data.minStock == "" ||
      data.minStock == undefined
    )
      throw new Error("Minimum stock is required");

    let dataOjb = {
      trackingDeviceId: data.trackingDeviceId,
      stock: data.stock,
      minStock: data.minStock,
      stockStatus: data.stockStatus,
    };

    let dataExist = await inventoryModel.findOne({
      trackingDeviceId: data.trackingDeviceId,
    });

    if (dataExist) {
      let updateInventory = await inventoryModel.findByIdAndUpdate(
        dataExist._id,
        { $set: { stock: data.stock, minStock: data.minStock } },
        { new: true }
      );
      let update = await TrackingDeviceModel.findByIdAndUpdate(
        dataExist.trackingDeviceId,
        { $set: { quantity: data.stock } },
        { new: true }
      );
      if (update) {
        return {
          message: "Added successfully",
          status: 1,
          response: [updateInventory, update],
        };
      } else {
        return {
          message: "Something went wrong",
          status: 2,
        };
      }
    } else {
      let saveData = await inventoryModel.create(dataOjb);

      let myData = await saveData.save();

      if (myData) {
        let update = await TrackingDeviceModel.findByIdAndUpdate(
          myData.trackingDeviceId,
          { $set: { quantity: data.stock } },
          { new: true }
        );
        if (update) {
          return {
            message: "Added successfully",
            status: 1,
            response: [myData, update],
          };
        } else {
          return {
            message: "Something went wrong",
            status: 2,
          };
        }
      } else {
        return {
          message: "Unable to save data",
          status: 3,
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateInventoryStatus = async (data) => {
  try {
    let inventoryData = await inventoryModel.findById(data._id);
    console.log("This is data", inventoryData);
    if (!inventoryData) {
      return {
        status: -1,
        message: "Inventory not exist",
      };
    } else {
      let update = await inventoryModel.findByIdAndUpdate(
        inventoryData._id,
        { $set: { stockStatus: data.stockStatus } },
        { new: true }
      );

      if (update.stockStatus == 1) {
        return {
          status: 1,
          message: "Inventory is active",
          response: update,
        };
      } else if (update.stockStatus == 0) {
        return {
          status: 2,
          message: "Deactivated Inventory",
          response: update,
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.addPromocode = async (data) => {
  try {
    let categoryExist = await PromocodeModel.findOne({
      couponCode: data.couponCode,
    });
    if (categoryExist) {
      return {
        status: -1,
        message: "Promocode already exist",
      };
    } else {
      let category = await PromocodeModel.create(data);
      let save = await category.save();

      if (save) {
        return {
          status: 1,
          message: "Promocode Created",
          response: save,
        };
      } else {
        return {
          status: 2,
          message: "Promocode Not Created",
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.editPromocode = async (data) => {
  try {
    let categoryData = await PromocodeModel.findById(data._id);
    if (!categoryData) {
      return {
        status: -1,
        message: "Promocode does not exist",
      };
    } else {
      let update = await PromocodeModel.findByIdAndUpdate(
        categoryData._id,
        data,
        { new: true }
      );

      if (update) {
        return {
          status: 1,
          message: "Promocode updated",
          response: update,
        };
      } else {
        return {
          status: 2,
          message: "Promocode not updated",
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.promocodeList = async () => {
  try {
    let data = await PromocodeModel.find({});
    if (data) {
      return {
        status: 1,
        message: "All Promocode data",
        response: data,
      };
    } else {
      return {
        status: 2,
        message: "Not found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deletePromocode = async (data) => {
  try {
    let catData = await PromocodeModel.findById(data._id);
    if (!catData) {
      return {
        status: -1,
        message: "Promocode does not exist",
      };
    } else {
      let deleteData = await PromocodeModel.findByIdAndDelete(catData._id);
      if (deleteData) {
        return {
          status: 1,
          message: "Promocode deleted",
        };
      } else {
        return {
          status: 2,
          message: "Promocode not deleted",
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.blockPromocode = async (data) => {
  try {
    let userData = await PromocodeModel.findById({ _id: data._id });

    if (!userData) {
      return {
        message: "Pormo Code does not exist",
      };
    } else {
      let update = await PromocodeModel.findByIdAndUpdate(
        userData._id,
        { $set: { is_blocked: data.is_blocked } },
        { new: true }
      );

      if (update.is_blocked == true) {
        return {
          message: "Promo Code Blocked",
          status: 1,
          response: update,
        };
      } else if (update.is_blocked == false) {
        return {
          message: "Promo Code Un-Blocked",
          status: 2,
          response: update,
        };
      }
      return {
        status: 3,
        message: "Status not updated",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.showToUser = async (data) => {
  try {
    let { showUser } = data;

    let dataExist = await productMainCategoryAdminModel.findById({
      _id: data._id,
    });

    if (!dataExist) throw new Error("No data found with this Id");

    let update = await productMainCategoryAdminModel.findByIdAndUpdate(
      dataExist._id,
      { showUser: showUser },
      { new: true }
    );
    console.log("Update data", update, data);

    if (update) {
      if (update.showUser == 1) {
        return {
          status: 1,
          message: "Show to User is visible",
          response: update,
        };
      } else if (update.showUser == 0) {
        return {
          status: 1,
          message: "Show to User is invisible",
          response: update,
        };
      }
    } else {
      return {
        status: 2,
        message: "Unable to update Show to user",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.showToHost = async (data) => {
  try {
    let { showHost } = data;

    let dataExist = await productMainCategoryAdminModel.findById({
      _id: data._id,
    });

    if (!dataExist) throw new Error("No data found with this Id");

    let update = await productMainCategoryAdminModel.findByIdAndUpdate(
      dataExist._id,
      { showHost: showHost },
      { new: true }
    );

    if (update) {
      if (update.showHost == 1) {
        return {
          status: 1,
          message: "Show to Host is visible",
          response: update,
        };
      } else if (update.showHost == 0) {
        return {
          status: 1,
          message: "Show to Host is invisible",
          response: update,
        };
      }
    } else {
      return {
        status: 2,
        message: "Unable to update Show to Host",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.sellerOrderHostUserList = async () => {
  try {
    let userOrderList = await UserCartModel.find({
      status: { $ne: 0 },
      isDeleted: false,
      orderId: { $exists: true },
    })
      .populate("product")
      .populate("user", "full_name country_code mobile_number")
      .populate(
        "product.seller_product",
        "product_name product_details product_quantity product_price selling_price product_discount product_decripton"
      )
      .populate(
        "product.admin_product",
        "product_name image product_quantity product_price selling_price product_discount product_decripton"
      )
      .populate(
        "seller.seller_id",
        "storeDetails first_name last_name country_code mobile_number email"
      )
      .populate("bookingId")
      .populate({
        path: "orderId",
        model: "userOrder",
        populate: [
          {
            path: "address",
            model: "userAddress",
          },
        ],
      })
      .lean();

    let hostOrderList = await HostCartModel.find({
      status: { $ne: 0 },
      isDeleted: false,
      orderId: { $exists: true },
    })
      .populate("product")
      .populate("host", "first_name last_name country_code mobile_number email")
      .populate(
        "product.admin_product",
        "product_name image product_quantity product_price selling_price product_discount product_decripton"
      )
      .populate(
        "product.seller_product",
        "product_name product_details product_quantity product_price selling_price product_discount product_decripton"
      )
      .populate(
        "seller.admin_id",
        "storeDetails first_name last_name country_code mobile_number email"
      )
      .populate("bookingId")
      .populate({
        path: "orderId",
        model: "hostOrder",
        populate: [
          {
            path: "address",
            model: "hostAddress",
          },
        ],
      })
      .lean();

    let result = userOrderList.concat(hostOrderList);

    return {
      status: 1,
      message: "All order list",
      response: result,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.trackingOrderList = async () => {
  try {
    let userOrderList = await UserCartModel.find({
      productMainCategoryId: mongoose.Types.ObjectId(
        "628b25df43143e1f54c5f797"
      ),
      status: { $ne: 0 },
      isDeleted: false,
      orderId: { $exists: true },
    })
      .populate("product")
      .populate("user", "full_name country_code mobile_number")
      .populate(
        "product.seller_product",
        "product_name product_details product_quantity product_price selling_price product_discount product_decripton"
      )
      .populate(
        "product.admin_product",
        "product_name image product_quantity product_price selling_price product_discount product_decripton"
      )
      .populate(
        "seller.seller_id",
        "storeDetails first_name last_name country_code mobile_number email"
      )
      .populate("bookingId")
      .populate({
        path: "orderId",
        model: "userOrder",
        populate: [
          {
            path: "address",
            model: "userAddress",
          },
        ],
      })
      .lean();

    let hostOrderList = await HostCartModel.find({
      productMainCategoryId: mongoose.Types.ObjectId(
        "628b25df43143e1f54c5f797"
      ),
      status: { $ne: 0 },
      isDeleted: false,
      orderId: { $exists: true },
    })
      .populate("product")
      .populate("host", "first_name last_name country_code mobile_number email")
      .populate(
        "product.admin_product",
        "product_name image product_quantity product_price selling_price product_discount product_decripton"
      )
      .populate(
        "product.seller_product",
        "product_name product_details product_quantity product_price selling_price product_discount product_decripton"
      )
      .populate(
        "seller.admin_id",
        "storeDetails first_name last_name country_code mobile_number email"
      )
      .populate("bookingId")
      .populate({
        path: "orderId",
        model: "hostOrder",
        populate: [
          {
            path: "address",
            model: "hostAddress",
          },
        ],
      })
      .lean();

    let result = userOrderList.concat(hostOrderList);

    return {
      status: 1,
      message: "All order list",
      response: result,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.trackingUserOrderAcceptReject = async (data) => {
  try {
    let { status } = data;

    let exist = await UserCartModel.findById({ _id: data._id });

    if (!exist) {
      return {
        status: -1,
        message: "No data found",
      };
    }

    let update = await UserCartModel.findByIdAndUpdate(
      exist._id,
      { $set: { status } },
      { new: true }
    );

    console.log("Updated data", update);

    if (update.status == 3) {
      let userOrder = await UserOrderModel.findByIdAndUpdate(
        update.orderId,
        { $set: { orderStatus: 2 } },
        { new: true }
      );
      let updatedUserOrder = await userOrder.save();

      console.log("User order accepted", updatedUserOrder);

      return {
        status: 1,
        message: "Accepted",
        response: update,
      };
    } else if (update.status == 2) {
      let userOrder = await UserOrderModel.findByIdAndUpdate(
        update.orderId,
        { $set: { orderStatus: 1 } },
        { new: true }
      );
      let updatedUserOrder = await userOrder.save();

      console.log("User order rejected", updatedUserOrder);
      return {
        status: 1,
        message: "Rejected ",
        response: update,
      };
    } else {
      return {
        status: 2,
        message: "Unable to perform operation",
        response: update,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.trackingHostOrderAcceptReject = async (data) => {
  try {
    let { status } = data;

    let exist = await HostCartModel.findById({ _id: data._id });

    if (!exist) {
      return {
        status: -1,
        message: "No data found",
      };
    }

    let update = await HostCartModel.findByIdAndUpdate(
      exist._id,
      { $set: { status } },
      { new: true }
    );

    console.log("Updated data", update);

    if (update.status == 3) {
      let userOrder = await HostOrderModel.findOneAndUpdate(
        { cart_id: update._id },
        { $set: { orderStatus: 2 } },
        { new: true }
      );
      // let updatedUserOrder = await userOrder.save()

      console.log("Host order accepted", userOrder);

      return {
        status: 1,
        message: "Accepted",
        response: update,
      };
    } else if (update.status == 2) {
      let userOrder = await HostOrderModel.findOneAndUpdate(
        { cart_id: update._id },
        { $set: { orderStatus: 1 } },
        { new: true }
      );
      // let updatedUserOrder = await userOrder.save()

      console.log("Host order rejected", userOrder);
      return {
        status: 1,
        message: "Rejected ",
        response: update,
      };
    } else {
      return {
        status: 2,
        message: "Unable to perform operation",
        response: update,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.onGoingStatusForUser = async (data) => {
  try {
    let { status } = data;

    let exist = await UserCartModel.findById({ _id: data._id });

    if (!exist) {
      return {
        status: -1,
        message: "No data found",
      };
    }

    let update = await UserCartModel.findByIdAndUpdate(
      exist._id,
      { $set: { status } },
      { new: true }
    );

    console.log("Exist data", update);

    if (update.status == 4) {
      let userOrder = await UserOrderModel.findByIdAndUpdate(update.orderId, {
        $set: { orderStatus: 3 },
      });
      let updatedUserOrder = await userOrder.save();

      console.log("User order accepted", updatedUserOrder);

      return {
        status: 1,
        message: "Item packed",
        response: update,
      };
    } else if (update.status == 5) {
      let userOrder = await UserOrderModel.findByIdAndUpdate(update.orderId, {
        $set: { orderStatus: 4 },
      });
      let updatedUserOrder = await userOrder.save();

      console.log("User order rejected", updatedUserOrder);
      return {
        status: 1,
        message: "Dispatched ",
        response: update,
      };
    } else if (update.status == 6) {
      let userOrder = await UserOrderModel.findByIdAndUpdate(update.orderId, {
        $set: { orderStatus: 5 },
      });
      let updatedUserOrder = await userOrder.save();

      console.log("User order rejected", updatedUserOrder);
      return {
        status: 1,
        message: "Delivered ",
        response: update,
      };
    } else if (update.status == 7) {
      let userOrder = await UserOrderModel.findByIdAndUpdate(update.orderId, {
        $set: { orderStatus: 6 },
      });
      let updatedUserOrder = await userOrder.save();

      console.log("User order rejected", updatedUserOrder);
      return {
        status: 1,
        message: "Cancelled",
        response: update,
      };
    } else {
      return {
        status: 2,
        message: "Unable to perform operation",
        response: update,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.onGoingStatusForHost = async (data) => {
  try {
    let { status } = data;

    let exist = await HostCartModel.findById({ _id: data._id });

    if (!exist) {
      return {
        status: -1,
        message: "No data found",
      };
    }

    let update = await HostCartModel.findByIdAndUpdate(
      exist._id,
      { $set: { status } },
      { new: true }
    );

    console.log("Exist data", update);

    if (update.status == 4) {
      let userOrder = await HostOrderModel.findOneAndUpdate(update.orderId, {
        $set: { orderStatus: 3 },
      });
      let updatedUserOrder = await userOrder.save();

      console.log("Host order accepted", updatedUserOrder);

      return {
        status: 1,
        message: "Item packed",
        response: update,
      };
    } else if (update.status == 5) {
      let userOrder = await HostOrderModel.findOneAndUpdate(
        { cart_id: update._id },
        { $set: { orderStatus: 4 } }
      );
      let updatedUserOrder = await userOrder.save();

      console.log("Host order rejected", updatedUserOrder);
      return {
        status: 1,
        message: "Dispatched ",
        response: update,
      };
    } else if (update.status == 6) {
      let userOrder = await HostOrderModel.findOneAndUpdate(
        { cart_id: update._id },
        { $set: { orderStatus: 5 } }
      );
      let updatedUserOrder = await userOrder.save();

      console.log("Host order rejected", updatedUserOrder);
      return {
        status: 1,
        message: "Delivered ",
        response: update,
      };
    } else if (update.status == 7) {
      let userOrder = await HostOrderModel.findOneAndUpdate(
        { cart_id: update._id },
        { $set: { orderStatus: 6 } }
      );
      let updatedUserOrder = await userOrder.save();

      console.log("Host order rejected", updatedUserOrder);
      return {
        status: 1,
        message: "Delivered ",
        response: update,
      };
    } else {
      return {
        status: 2,
        message: "Unable to perform operation",
        response: update,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateTrackingUserOrderStatus = async (data) => {
  try {
    let { status } = data;

    let exist = await UserCartModel.findById({ _id: data._id }).lean();
    if (!exist) {
      return {
        status: -1,
        message: "No data found",
      };
    }
    let currentDate = new Date().getTime();
    var updateCart = await UserCartModel.findByIdAndUpdate(
      exist._id,
      { $set: { status: Number(status), modified_at: currentDate } },
      { new: true }
    ).lean();
    if (!updateCart) {
      return {
        status: -1,
        message: "Unable to update order status",
      };
    }
    let userOrder = await UserOrderModel.findByIdAndUpdate(
      updateCart.orderId,
      { $set: { orderStatus: Number(status) - 1, modified_at: currentDate } },
      { new: true }
    ).lean();
    if (!userOrder) {
      return {
        status: -1,
        message: "Unable to update order status, please try again",
      };
    }

    var orderStatus = await utils.getOrderStatus(Number(status));

    /* code for cashback start */
      // if(Number(status) == 6){
      //   let healthGoalPoint = await HealthGoalPointModel.findOne({},{ health_goal_point: 1 }).lean();
      //   var userRedeem = await UserRedeemPointModel.findOne({  user: mongoose.Types.ObjectId(userOrder.user) },{ redeem_point: 1 }).lean();
      //   var userDiscountAmount = ((Number(healthGoalPoint.health_goal_point) * (Number(userOrder.totalAmount)))  / 100 )

      //   if(userRedeem){
      //     let latestRedeemAmount =  ((Number(userRedeem.redeem_point) + (Number(userDiscountAmount))))
      //     let dataToUpdateRedeem = {
      //       redeem_type: 1,
      //       redeem_point: latestRedeemAmount,
      //       modified_at: new Date().getTime()
      //     }
      //     var updateRedeem = await UserRedeemPointModel.findOneAndUpdate({  _id: mongoose.Types.ObjectId(userRedeem._id) },{ $set: dataToUpdateRedeem }, { new: true }).lean();
      //   }else{
      //     let latestRedeemAmount = Number(userDiscountAmount)
      //     let dataToSaveRedeem = {
      //       user: userOrder.user,
      //       redeem_type: 1,
      //       redeem_point: latestRedeemAmount,
      //       created_at: new Date().getTime(),
      //       modified_at: new Date().getTime()
      //     }
      //     let myRedeemData = new UserRedeemPointModel(dataToSaveRedeem);
      //     let redeemsave = await myRedeemData.save();
      //   }
      //   let dataToSaveWallet = {
      //     user: userOrder.user,
      //     transaction_id: generateUniqueId({ length: 7,useLetters: true }).toUpperCase(),
      //     transaction_type: 1,
      //     redeem_amount: Number(userDiscountAmount),
      //     booking_type: 1,
      //     user_cart_booking: userOrder._id,
      //     transaction_at: new Date().getTime()
      //   };
    
      //   let myData = new UserRedeemPointTransactionModel(dataToSaveWallet);
      //   let save = await myData.save();
      // }
    /* code for cashback end */



    /*
    var invoiceUrl = "";
    if(data.status == "6"){
      var htmlCreated = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Invoice</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
        </head>
        <style>
          .container-fluid{
            padding: 0px 40px!important;
          }
          p{
              margin-bottom: 5px;
          }
          .date{
              font-size: 12px;
              float: right;
          }
          .invoice-text{
              padding-left: 75px;
          }
          .top-left-details p , .top-right-details p{
              font-size: 13px;
          } 
          .top-left-details ,  .top-right-details{
              max-width: 400px;
              width: 267px;
          }
          .borderLine {
            width: 1px;
            height: auto;
            background: #c8c9ca;
            margin: 23px 0px;
          }
          table tr td:nth-child(1) {
              text-align: left;
              border-left: none;
          }
          table tr td:last-child { 
              border-right: none;
          }
          .table tr:first-child {
            border-top: 0;
          }
          .table tr:last-child {
            border-bottom: 0;
          }
          .table{
              font-size: 13px;
          }
          .total-row{
              border-bottom: 1px solid black;
          }
          .total-row td{
              border:none;
              padding: 12px 0px;
          }
          @media (max-width:425px) {
            .top-details{
              display: block!important;
            }
            .borderLine{
              display: none!important;
            }
            .authorized{
              display: block!important;
              text-align: left!important;
            }
          }
        </style>
        <body>
          <div class="container-fluid mt-2">
            <div class="row">
              <div class="col-12">
                  <div class="title text-center">
                      <h3 ><span class="invoice-text">Invoice</span> <span class="date">June 22, 2022</span></h3>
                  </div>
              </div>  
            </div>
            <div class="row mt-3">
              <div class="col-12  mt-3">
                  <div class="top-details d-flex justify-content-between " >  
                      <div class="top-left-details py-2 ">
                          <p><span>Store Name :</span>  <span> Pets's World Store</span>  </p>
                          <p><span>Address :</span>  <span> 9HW5+JMP,Chontabamba, Iquitos 19210, Peru</span>  </p>
                      </div>
                      <div class="top-right-details py-2">
                          <p><strong><span>Order ID :</span>  <span> #HD8474j</span> </strong> </p>
                          <p><span>Order Date & Time :</span>  <span> June 22,2022,3:38 pm</span>  </p>
                          <p><span>Payment Method:</span>  <span> Cash</span>  </p>
                      </div>
                  </div>
              </div>
              <hr>
            </div>
            <div class="row ">
              <div class="col-12  ">
                  <div class="top-details d-flex justify-content-between " > 
                      <div class="top-left-details py-2 ">
                          <p><strong>User Details</strong></p>
                          <p><span>User Name :</span>  <span> Rahul Sharma</span>  </p>
                          <p><span>Contact Number :</span>  <span> +644-889-2430</span>  </p>
                          <p><span>Email :</span>  <span> sharmarahul484@gmail.com</span>  </p>
                      </div>
                      <div class="borderLine d-block py-2">
                      </div>
                      <div class="top-right-details py-2">
                          <p><strong>Shipping Address</strong></p>
                          <p><span>C 142, Sector 63 RD, C Block, Sector 63, Noida, Uttar Pradesh, 201301</span> </p>
                      </div>
                  </div>
              </div>
              <hr>
            </div>
            <div class="row">
              <div class="col-12">
                  <div class="summary-heading">
                      <p><strong>Order Summary</strong></p>
                  </div>
                  <table class="table table-bordered table-sm text-center">
                      <tbody>
                        <tr>
                          <td>Description of Goods </td>
                          <td>Qty</td>
                          <td>Price</td>
                          <td>Tax($)</td>
                          <td>Total</td>
                        </tr>
                        <tr>
                          <td>iphone 12 max pro</td>
                          <td>1</td>
                          <td>$ 330</td>
                          <td>$ 330</td>
                          <td>$ 330</td>
                        </tr>
                        <tr>
                          <td>iphone 12 max pro</td>
                          <td>1</td>
                          <td>$ 330</td>
                          <td>$ 330</td>
                          <td>$ 330</td>
                        </tr>
                        <tr class="total-row" >
                          <td colspan="2"><Strong>Total</Strong></td>
                          <td> <strong> $ 330</strong></td>
                          <td> <strong> $ 330</strong></td>
                          <td> <strong> $ 330</strong></td>
                        </tr>
                        <tr>
                          <td style="border:none" colspan="3"><Strong></Strong></td>
                          <td style="border:none"> <strong> Grand Total</strong></td>
                          <td style="border:none"> <strong> $ 686.00</strong></td>
                        </tr>
                      </tbody>
                    </table>
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-12  ">
                  <div class="top-details d-flex justify-content-between " >
                      <div class="top-left-details py-2 ">
                          <img src="img/pet_world_logo.svg" alt="" width="100">
                          <p class="text-uppercase mt-3">certified that the particulars given above are true and correct terms & conditions/remarks(if any) This is a computer generated invoice  </p>
                      </div>
                      <div class="top-right-details text-end authorized d-flex justify-content-end align-items-end py-2">
                          <p>Authourized Signatory </p>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </body>
      </html>`;

      var options = { format: 'Letter', landscape:true };
      let file = { content: htmlCreated };
      await html_to_pdf.generatePdf(file, options).then(async pdfBuffer => {
      // pdf.create(htmlCreated, options).toBuffer(function(err, buffer){
      // pdf.create(htmlCreated).toStream(function(err, stream){
        // stream.pipe(fs.createWriteStream('myinvoice.pdf'));
        // stream.pipe(fs.createWriteStream(path.join(__dirname, '../', '/views/myinvoice.pdf')));
        // stream.pipe(fs.createWriteStream('./../views/myinvoice.pdf'));

        const params = {
                      Key: 'mynewinvoice.pdf',
                      Body: pdfBuffer,
                      Bucket: 'petsworldbucket',
                      ContentType: 'application/pdf',
                  };
        // // invoiceUrl = await aws.uploadPdf(Number(status));
        var aws = require('aws-sdk');
        aws.config.update({
            secretAccessKey: "P0Z84jEVGanry1mD6XzgQkTPVmoJ2biV5WnFTFJS",
            accessKeyId: 'AKIA2JVEV34P34HOHNEF',
            region: 'sa-east-1'
        });
        var s3 = new aws.S3();

        s3.upload(params, async function(err, response) {
          if(err){
            console.log(err)
          }
          invoiceUrl = await response.Location;
          let updateOrder = await UserOrderModel.findByIdAndUpdate(updateCart.orderId, { $set: { invoice_url: response.Location } }, { new: true }).lean();
        });
      });
      
    }
    // */
    return {
      status: 1,
      message: orderStatus,
      response: updateCart,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateTrackingHostOrderStatus = async (data) => {
  try {
    let { status } = data;

    let exist = await HostCartModel.findById({ _id: data._id }).lean();
    if (!exist) {
      return {
        status: -1,
        message: "No data found",
      };
    }
    let currentDate = new Date().getTime();

    let update = await HostCartModel.findByIdAndUpdate(
      exist._id,
      { $set: { status: Number(status), modified_at: currentDate } },
      { new: true }
    ).lean();
    if (!update) {
      return {
        status: -1,
        message: "Unable to update order status",
      };
    }
    let userOrder = await HostOrderModel.findByIdAndUpdate(
      update.orderId,
      { $set: { orderStatus: Number(status) - 1, modified_at: currentDate } },
      { new: true }
    ).lean();
    if (!userOrder) {
      return {
        status: -1,
        message: "Unable to update order status, please try again",
      };
    }

    let orderStatus = utils.getOrderStatus(Number(status));

    return {
      status: 1,
      message: orderStatus,
      response: update,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.addAdvertisement = async (data) => {
  try {
    if (!data.adv_name || data.adv_name == "")
      return { status: 0, message: "Ad Name is required" };

    if (!data.image || data.image == "")
      return { status: 0, message: "Ad image is required" };

    if (!data.start_date || data.start_date == "")
      return { status: 0, message: "Ad start date is required" };

    if (!data.end_date || data.end_date == "")
      return { status: 0, message: "Ad end date is required" };

    let dataToSave = {
      adv_name: data.adv_name,
      image: data.image,
      is_user : data.is_user,
      is_host : data.is_host,
      is_seller : data.is_seller,
      is_service : data.is_service,
      start_date: data.start_date,
      end_date: data.end_date,
      date_created: new Date().getTime(),
    };

    let myData = new AdvertisementModel(dataToSave);
    let save = await myData.save();

    if (save) {
      return {
        message: "Advertisement added successfully",
        response: save,
        status: 1,
      };
    } else {
      return {
        message: "Not added ",
        status: 2,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.editAdvertisement = async (data) => {
  try {
    if (!data.adv_name || data.adv_name == "")
      return { status: 0, message: "Ad Name is required" };

    if (!data.image || data.image == "")
      return { status: 0, message: "Ad image is required" };

    if (!data.start_date || data.start_date == "")
      return { status: 0, message: "Ad start date is required" };

    if (!data.end_date || data.end_date == "")
      return { status: 0, message: "Ad end date is required" };

    let advData = await AdvertisementModel.findById(
      mongoose.Types.ObjectId(data._id)
    );
    if (advData) {
      let dataToUpdate = {
        adv_name: data.adv_name,
        image: data.image,
        is_user : data.is_user,
        is_host : data.is_host,
        is_seller : data.is_seller,
        is_service : data.is_service,
        start_date: data.start_date,
        end_date: data.end_date,
      };
      let advertisement = await AdvertisementModel.findByIdAndUpdate(
        mongoose.Types.ObjectId(data._id),
        dataToUpdate,
        { new: true }
      );
      if (!advertisement) {
        return { status: 0, message: "Something went Wrong,Please try later." };
      }
      return {
        status: 1,
        message: "Advertisement updated successfully",
        data: advertisement,
      };
    } else {
      return { status: 0, message: "Advertisement does not exist" };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteAdvertisement = async (data) => {
  try {
    let advData = await AdvertisementModel.findById(data._id);
    if (!advData) {
      return {
        status: -1,
        message: "Advertisement does not exist",
      };
    } else {
      let deleteData = await AdvertisementModel.findByIdAndDelete(advData._id);
      if (deleteData) {
        return {
          status: 1,
          message: "Advertisement deleted Successfully",
        };
      } else {
        return {
          status: 2,
          message: "Advertisement can not deleted",
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getadvertisement = async () => {
  try {
    let userData = await AdvertisementModel.find()
      .sort({ date_created: -1 })
      .lean();
    if (userData) {
      return {
        status: 1,
        response: userData,
        message: "Advertisement List fetched",
      };
    } else {
      return {
        status: 2,
        message: "No Advertisement found ",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.blockUnblockAdverisement = async (data) => {
  try {
    if (!data._id || data._id == "") {
      throw new Error("unsufficient Parameters");
    }
    let product = await AdvertisementModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(data._id),
      { is_blocked: data.status },
      { new: true }
    );
    if (!product) {
      return { status: -1, message: "Something went Wrong, Please try later." };
    }
    let stat = data.status == "1" ? "blocked" : "unblocked";
    return { status: 1, message: `Advertisement ${stat} successfully` };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllAdminProductReviews = async (data) => {
  try {
    if (!data.product_id || data.product_id == "")
      return { status: 0, message: "Product id is required" };

    let allRatings = await OrderRatingModel.find(
      { "product.admin_product": data.product_id },
      { product: 0, order_id: 0 }
    )
      .populate("uniqid.user_id", "full_name ")
      .populate("uniqid.host_id", "first_name last_name profile_pic")
      .lean();

    if (!allRatings) {
      return {
        status: 2,
        message: "No reviews found",
      };
    }
    return {
      status: 1,
      data: allRatings,
      message: "Review List fetched successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.viewOrderAllRatingReview = async (data) => {
  try {
    if (!data.product_id || data.product_id == "")
      return { status: 0, message: "Product id is required" };
    if (!data.order_id || data.order_id == "")
      return { status: 0, message: "Order id is required" };
    if (!data.user_id || data.user_id == "")
      return { status: 0, message: "User id is required" };

    let allRatings = await OrderRatingModel.find(
      {
        $or: [
          { "product.seller_product": data.product_id },
          { "product.admin_product": data.product_id },
        ],
        order_id: data.order_id,
        $or: [
          { "uniqid.user_id": data.user_id },
          { "uniqid.host_id": data.user_id },
        ],
      },
      { product: 0, order_id: 0 }
    )
      .populate("uniqid.user_id", "full_name ")
      .populate("uniqid.host_id", "first_name last_name profile_pic")
      .lean();

    if (!allRatings) {
      return {
        status: 2,
        message: "No reviews found",
      };
    }
    return {
      status: 1,
      data: allRatings,
      message: "Review List fetched successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.addServiceCategory = async (data) => {
  try {
    if (!data.category_name || data.category_name == "")
      return { status: 0, message: "Category Name is required" };

    if (!data.category_image || data.category_image == "")
      return { status: 0, message: "Category image is required" };

    let dataToSave = {
      category_name: data.category_name,
      category_image: data.category_image,
      created_at: new Date().getTime(),
    };

    let myData = new ServiceCategoryModel(dataToSave);
    let save = await myData.save();

    if (save) {
      return {
        message: "Category added successfully",
        status: 1,
      };
    } else {
      return {
        message: "Not added ",
        status: 0,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.editServiceCategory = async (data) => {
  try {
    if (!data._id || data._id == "")
      return { status: 0, message: "Category id is required" };
    if (!data.category_name || data.category_name == "")
      return { status: 0, message: "Category Name is required" };
    if (!data.category_image || data.category_image == "")
      return { status: 0, message: "Category image is required" };

    let categoryData = await ServiceCategoryModel.findById(
      mongoose.Types.ObjectId(data._id)
    );
    if (categoryData) {
      let dataToUpdate = {
        category_name: data.category_name,
        category_image: data.category_image,
        modified_at: new Date().getTime(),
      };
      let category = await ServiceCategoryModel.findByIdAndUpdate(
        mongoose.Types.ObjectId(data._id),
        dataToUpdate,
        { new: true }
      );
      if (!category) {
        return { status: 0, message: "Something went Wrong,Please try later." };
      }
      return {
        status: 1,
        message: "Category updated successfully",
        data: category,
      };
    } else {
      return { status: 0, message: "Category does not exist" };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteServiceCategory = async (data) => {
  try {
    let category = await ServiceCategoryModel.findById(data._id);
    if (!category) {
      return {
        status: -1,
        message: "Category does not exist",
      };
    } else {
      let deleteData = await ServiceCategoryModel.findByIdAndDelete(
        category._id
      );
      if (deleteData) {
        return {
          status: 1,
          message: "Category deleted Successfully",
        };
      } else {
        return {
          status: 0,
          message: "Category can not be deleted",
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getServiceCategoryList = async () => {
  try {
    let categories = await ServiceCategoryModel.find()
      .sort({ created_at: -1 })
      .lean();
    if (categories) {
      return {
        status: 1,
        data: categories,
        message: "Service category list fetched successfully",
      };
    } else {
      return {
        status: 0,
        message: "No category found ",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.blockUnblockServiceCategory = async (data) => {
  try {
    if (!data._id || data._id == "") {
      throw new Error("unsufficient Parameters");
    }
    let category = await ServiceCategoryModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(data._id),
      { is_blocked: data.status },
      { new: true }
    );
    if (!category) {
      return { status: -1, message: "Something went Wrong, Please try later." };
    }
    let stat = data.status == "1" ? "blocked" : "unblocked";
    return { status: 1, message: `Category ${stat} successfully` };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateCommission = async (data) => {
  try {
    if (!data.commission_percent || data.commission_percent == "")
      return { status: 0, message: "Commission percent is required" };
    /*
        // code for add commission
        let dataToSave = {
          commission_percent : data.commission_percent,
          modified_at: new Date().getTime()
        };
    
        let myData = new CommissionModel(dataToSave);
        let save = await myData.save();
      */
    let CommissionData = await CommissionModel.findById(
      mongoose.Types.ObjectId(data._id)
    );
    if (CommissionData) {
      let dataToUpdate = {
        commission_percent: data.commission_percent,
        modified_at: new Date().getTime(),
      };
      let commission = await CommissionModel.findByIdAndUpdate(
        data._id,
        dataToUpdate,
        { new: true }
      );
      if (!commission) {
        return { status: 0, message: "Something went Wrong,Please try later." };
      }
      return {
        status: 1,
        message: "Commission updated successfully",
        data: commission,
      };
    } else {
      return { status: 0, message: "Commission does not exist" };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getCommission = async () => {
  try {
    let commission = await CommissionModel.findOne().lean();
    if (commission) {
      return {
        status: 1,
        data: commission,
        message: "Commission fetched successfully",
      };
    } else {
      return {
        status: 0,
        message: "No commission found ",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.trackingOrderPaymentList = async () => {
  try {
    let userOrderList = await UserCartModel.find(
      {
        productMainCategoryId: mongoose.Types.ObjectId(
          "628b25df43143e1f54c5f797"
        ),
        status: 6,
        isDeleted: false,
        orderId: { $exists: true },
      },
      { product: 0, seller: 0 }
    )
      .populate("user", "full_name country_code mobile_number")
      .populate("orderId")
      .populate("bookingId", "transaction_id")
      .lean();

    let hostOrderList = await HostCartModel.find(
      {
        productMainCategoryId: mongoose.Types.ObjectId(
          "628b25df43143e1f54c5f797"
        ),
        status: 6,
        isDeleted: false,
        orderId: { $exists: true },
      },
      { product: 0, seller: 0 }
    )
      .populate("host", "first_name last_name country_code mobile_number email")
      .populate("orderId")
      .populate("bookingId", "transaction_id")
      .lean();

    let result = userOrderList.concat(hostOrderList);

    return {
      status: 1,
      message: "All order list",
      data: result,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.sellerOrderPaymentList = async () => {
  try {
    let userOrderList = await UserCartModel.find(
      {
        productMainCategoryId: {
          $ne: mongoose.Types.ObjectId("628b25df43143e1f54c5f797"),
        },
        status: 6,
        isDeleted: false,
        orderId: { $exists: true },
      },
      { product: 0, seller: 0 }
    )
      .populate("user", "full_name country_code mobile_number")
      .populate("orderId")
      .populate("bookingId", "transaction_id")
      .lean();

    let hostOrderList = await HostCartModel.find(
      {
        productMainCategoryId: {
          $ne: mongoose.Types.ObjectId("628b25df43143e1f54c5f797"),
        },
        status: 6,
        isDeleted: false,
        orderId: { $exists: true },
      },
      { product: 0, seller: 0 }
    )
      .populate("host", "first_name last_name country_code mobile_number email")
      .populate("orderId")
      .populate("bookingId", "transaction_id")
      .lean();

    let result = userOrderList.concat(hostOrderList);
    // let commission = await CommissionModel.findOne().lean();
    if(result.length > 0){
      for(let i=0; i < result.length; i++){
        let netAmount = result[i].orderId ? result[i].orderId.totalAmount: 0;
        let commission = result[i].orderId ? result[i].orderId.commissionPercent: 0;
        if(Number(netAmount) > 0){
          let commissionAmount = (Number(commission) * Number(netAmount)) / 100;
          result[i]['commissionAmount'] = (Math.round(commissionAmount * 100) / 100).toFixed(2);
          result[i]['payableAmount'] = (Math.round((netAmount - commissionAmount) * 100) / 100).toFixed(2);
        }
      }
    }

    let dataToSend = {
      orderList: result
      // commission: commission.commission_percent,
    };

    return {
      status: 1,
      message: "All order list",
      data: dataToSend,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.addSubAdmin = async (data) => {
  try {
    if (!data.name || data.name == "")
      return { status: 0, message: "Sub admin name is required" };
    if (!data.email || data.email == "")
      return { status: 0, message: "Sub admin email is required" };
    if (!data.countryCode || data.countryCode == "")
      return { status: 0, message: "Country code is required" };
    if (!data.mobileNumber || data.mobileNumber == "")
      return { status: 0, message: "Mobile number is required" };
    // if (!data.password || data.password == '')
    //   return { status: 0, message: "Password is required" };
    if (!data.moduleAccess || data.moduleAccess.length == 0)
      return {
        status: 0,
        message: "Please provide access to atleast one module",
      };

    const token = auth.generateToken();

    let dataToSave = {
      name: data.name,
      email: data.email,
      countryCode: data.countryCode,
      mobileNumber: data.mobileNumber,
      password: data.password,
      moduleAccess: data.moduleAccess,
      access_token: token,
      isOtpVarified: true,
      deviceType: 4,
      createdAt: new Date().getTime(),
      updateAt: new Date().getTime(),
    };

    let myData = new SubAdminModel(dataToSave);
    let save = await myData.save();

    if (save) {
      return {
        message: "Sub admin created successfully",
        status: 1,
      };
    } else {
      return {
        message: "Not added",
        status: 0,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.editSubAdmin = async (data) => {
  try {
    if (!data._id || data._id == "")
      return { status: 0, message: "Subadmin id is required" };
    if (!data.name || data.name == "")
      return { status: 0, message: "Sub admin name is required" };
    if (!data.email || data.email == "")
      return { status: 0, message: "Sub admin email is required" };
    if (!data.countryCode || data.countryCode == "")
      return { status: 0, message: "Country code is required" };
    if (!data.mobileNumber || data.mobileNumber == "")
      return { status: 0, message: "Mobile number is required" };
    // if (!data.password || data.password == '')
    //   return { status: 0, message: "Password is required" };
    if (!data.moduleAccess || data.moduleAccess.length == 0)
      return {
        status: 0,
        message: "Please provide access to atleast one module",
      };

    let subAdminData = await SubAdminModel.findById(
      mongoose.Types.ObjectId(data._id)
    );
    if (subAdminData) {
      let dataToUpdate = {
        name: data.name,
        email: data.email,
        countryCode: data.countryCode,
        mobileNumber: data.mobileNumber,
        password: data.password,
        moduleAccess: data.moduleAccess,
        updateAt: new Date().getTime(),
      };
      let subAdmin = await SubAdminModel.findByIdAndUpdate(
        mongoose.Types.ObjectId(data._id),
        dataToUpdate,
        { new: true }
      );
      if (!subAdmin) {
        return { status: 0, message: "Something went Wrong,Please try later." };
      }
      return {
        status: 1,
        message: "SubAdmin updated successfully",
        data: subAdmin,
      };
    } else {
      return { status: 0, message: "SubAdmin does not exist" };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getSubAdminList = async () => {
  try {
    let subAdmin = await SubAdminModel.find().sort({ createdAt: -1 }).lean();
    if (subAdmin) {
      return {
        status: 1,
        data: subAdmin,
        message: "Sub admin list fetched successfully",
      };
    } else {
      return {
        status: 0,
        message: "No sub admin found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.blockUnblockSubAdmin = async (data) => {
  try {
    if (!data._id || data._id == "") {
      throw new Error("unsufficient Parameters");
    }
    let subAdmin = await SubAdminModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(data._id),
      { isBlocked: data.status },
      { new: true }
    );
    if (!subAdmin) {
      return { status: -1, message: "Something went Wrong, Please try later." };
    }
    let stat = data.status == "1" ? "blocked" : "unblocked";
    return { status: 1, message: `SubAdmin ${stat} successfully` };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getNewBookedServices = async () => {
  try {
    let bookedUserServices = await UserServiceBookingModel.find({
      booking_status: 1,
      payment_status: 1,
    })
      .populate("user", "full_name country_code mobile_number email")
      .populate("service_category", "category_name category_image")
      .populate({
        path: "service_id",
        model: "serviceProviderServices",
        populate: [
          {
            path: "serviceProvider",
            model: "serviceProvider",
            select:
              "first_name last_name country_code mobile_number email location",
          },
        ],
      })
      .populate("address")
      .sort({ created_at: -1 })
      .lean();

    let bookedHostServices = await HostServiceBookingModel.find({
      booking_status: 1,
      payment_status: 1,
    })
      .populate("host", "first_name last_name country_code mobile_number email")
      .populate("service_category", "category_name category_image")
      .populate({
        path: "service_id",
        model: "serviceProviderServices",
        populate: [
          {
            path: "serviceProvider",
            model: "serviceProvider",
            select:
              "first_name last_name country_code mobile_number email location",
          },
        ],
      })
      .populate("address")
      .sort({ created_at: -1 })
      .lean();

    let allBookings = [...bookedUserServices, ...bookedHostServices];
    allBookings = _.orderBy(allBookings, (item) => item.created_at, ["desc"]);

    let dataToSend = {
      newBookings: allBookings,
    };
    if (allBookings) {
      return {
        status: 1,
        data: dataToSend,
        message: "New booking list fetched successfully",
      };
    } else {
      return {
        status: 0,
        message: "No booking found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getOngoingBookedServices = async () => {
  try {
    let bookedUserServices = await UserServiceBookingModel.find({
      $or: [{ booking_status: 3 }, { booking_status: 4 }],
      payment_status: 1,
    })
      .populate("user", "full_name country_code mobile_number email")
      .populate("service_category", "category_name category_image")
      .populate({
        path: "service_id",
        model: "serviceProviderServices",
        populate: [
          {
            path: "serviceProvider",
            model: "serviceProvider",
            select:
              "first_name last_name country_code mobile_number email location",
          },
        ],
      })
      .populate("address")
      .sort({ created_at: -1 })
      .lean();

    let bookedHostServices = await HostServiceBookingModel.find({
      $or: [{ booking_status: 3 }, { booking_status: 4 }],
      payment_status: 1,
    })
      .populate("host", "first_name last_name country_code mobile_number email")
      .populate("service_category", "category_name category_image")
      .populate({
        path: "service_id",
        model: "serviceProviderServices",
        populate: [
          {
            path: "serviceProvider",
            model: "serviceProvider",
            select:
              "first_name last_name country_code mobile_number email location",
          },
        ],
      })
      .populate("address")
      .sort({ created_at: -1 })
      .lean();

    let allBookings = [...bookedUserServices, ...bookedHostServices];
    allBookings = _.orderBy(allBookings, (item) => item.created_at, ["desc"]);

    let dataToSend = {
      newBookings: allBookings,
    };
    if (allBookings) {
      return {
        status: 1,
        data: dataToSend,
        message: "Ongoing booking list fetched successfully",
      };
    } else {
      return {
        status: 0,
        message: "No booking found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getPastBookedServices = async () => {
  try {
    let bookedUserServices = await UserServiceBookingModel.find({
      $or: [
        { booking_status: 2 },
        { booking_status: 5 },
        { booking_status: 6 },
      ],
      payment_status: 1,
    })
      .populate("user", "full_name country_code mobile_number email")
      .populate("service_category", "category_name category_image")
      .populate({
        path: "service_id",
        model: "serviceProviderServices",
        populate: [
          {
            path: "serviceProvider",
            model: "serviceProvider",
            select:
              "first_name last_name country_code mobile_number email location",
          },
        ],
      })
      .populate("address")
      .sort({ created_at: -1 })
      .lean();

    let bookedHostServices = await HostServiceBookingModel.find({
      $or: [
        { booking_status: 2 },
        { booking_status: 5 },
        { booking_status: 6 },
      ],
      payment_status: 1,
    })
      .populate("host", "first_name last_name country_code mobile_number email")
      .populate("service_category", "category_name category_image")
      .populate({
        path: "service_id",
        model: "serviceProviderServices",
        populate: [
          {
            path: "serviceProvider",
            model: "serviceProvider",
            select:
              "first_name last_name country_code mobile_number email location",
          },
        ],
      })
      .populate("address")
      .sort({ created_at: -1 })
      .lean();

    let allBookings = [...bookedUserServices, ...bookedHostServices];
    allBookings = _.orderBy(allBookings, (item) => item.created_at, ["desc"]);

    let dataToSend = {
      newBookings: allBookings,
    };
    if (allBookings) {
      return {
        status: 1,
        data: dataToSend,
        message: "Past booking list fetched successfully",
      };
    } else {
      return {
        status: 0,
        message: "No booking found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getBookedServicesPayment = async () => {
  try {
    let bookedUserServices = await UserServiceBookingModel.find(
      { payment_status: 1, booking_status: 5 },
      { payment_response: 0, is_rated: 0, additional_note: 0 }
    )
      .populate("user", "full_name country_code mobile_number email")
      .populate("service_category", "category_name category_image")
      .populate({
        path: "service_id",
        model: "serviceProviderServices",
        select: "service_image serviceProvider price experience description",
        populate: [
          {
            path: "serviceProvider",
            model: "serviceProvider",
            select:
              "first_name last_name country_code mobile_number email location",
          },
        ],
      })
      .populate("address")
      .sort({ created_at: -1 })
      .lean();

    let bookedHostServices = await HostServiceBookingModel.find(
      { payment_status: 1, booking_status: 5 },
      { payment_response: 0, is_rated: 0, additional_note: 0 }
    )
      .populate("host", "first_name last_name country_code mobile_number email")
      .populate("service_category", "category_name category_image")
      .populate({
        path: "service_id",
        model: "serviceProviderServices",
        select: "service_image serviceProvider price experience description",
        populate: [
          {
            path: "serviceProvider",
            model: "serviceProvider",
            select:
              "first_name last_name country_code mobile_number email location",
          },
        ],
      })
      .populate("address")
      .sort({ created_at: -1 })
      .lean();

    let allBookings = [...bookedUserServices, ...bookedHostServices];
    allBookings = _.orderBy(allBookings, (item) => item.created_at, ["desc"]);

    // let commission = await CommissionModel.findOne().lean();
    if (allBookings.length > 0) {
      for (let i = 0; i < allBookings.length; i++) {
        let rating = await ServiceOrderRatingModel.findOne(
          {
            $or: [
              { "booking.user_booking": allBookings[i]._id },
              { "booking.host_booking": allBookings[i]._id },
            ],
          },
          { rating_point: 1, review: 1 }
        ).lean();
        // let netAmount = allBookings[i].service_id ? allBookings[i].service_id.price : 0;
        let netAmount = allBookings[i].total_amount;
        let commission = allBookings[i].commissionPercent? allBookings[i].commissionPercent : 0;
        let commissionAmount =  (Number(commission) * Number(netAmount)) / 100;
        allBookings[i]["commission"] = (Math.round(commissionAmount * 100) / 100).toFixed(2);
        allBookings[i]["payableAmount"] = (Math.round((Number(netAmount) - Number(commissionAmount)) * 100) / 100).toFixed(2);
        allBookings[i]["rating"] = rating ? rating : null;
      }
    }

    let dataToSend = {
      paymentList: allBookings,
    };
    if (allBookings) {
      return {
        status: 1,
        data: dataToSend,
        message: "Service order payment list fetched successfully",
      };
    } else {
      return {
        status: 0,
        message: "No booking found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getNewPackageBookingList = async () => {
  try {
    var date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    let todaydate = Date.parse(date);

    let getBooking = await PackageBookingModel.find(
      {
        service_date: { $lt: todaydate },
        booking_status: 1,
        payment_status: 1,
      },
      {
        payment_status: 0,
        payment_response: 0,
      }
    )
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
      .populate(
        "host_id",
        "first_name last_name country_code mobile_number email profile_pic location"
      )
      .populate(
        "pet_id",
        "package_name pet_name pet_dob pet_height pet_weight pet_gender pet_special_care treatment pet_pic"
      )
      .populate(
        "coupon",
        "couponCode discount usageLimit uptoDiscount orderValueLimit"
      )
      .populate("user", "full_name")
      .lean();

    if (!getBooking) {
      return {
        status: 0,
        message: "No booking found",
      };
    }
    if (getBooking.length > 0) {
      for (let i = 0; i < getBooking.length; i++) {
        let address = await HostAddressModel.findOne({
          host: mongoose.Types.ObjectId(getBooking[i].host_id._id),
          primaryAddress: true,
        }).lean();
        getBooking[i]["hostAddress"] = address ? address : null;
      }
    }
    let dataToSend = {
      newPackageBookings: getBooking,
    };

    return {
      status: 1,
      data: dataToSend,
      message: "New package booking list fetched successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getOngoingPackageBookingList = async () => {
  try {
    var date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    let todaydate = Date.parse(date);

    let getBooking = await PackageBookingModel.find(
      {
        service_date: { $gte: todaydate },
        $or: [{ booking_status: 2 }, { booking_status: 3 }],
        payment_status: 1,
      },
      {
        payment_status: 0,
        payment_response: 0,
      }
    )
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
      .populate(
        "host_id",
        "first_name last_name country_code mobile_number email profile_pic location"
      )
      .populate(
        "pet_id",
        "package_name pet_name pet_dob pet_height pet_weight pet_gender pet_special_care treatment pet_pic"
      )
      .populate(
        "coupon",
        "couponCode discount usageLimit uptoDiscount orderValueLimit"
      )
      .populate("user", "full_name")
      .lean();

    if (!getBooking) {
      return {
        status: 0,
        message: "No booking found",
      };
    }
    if (getBooking.length > 0) {
      for (let i = 0; i < getBooking.length; i++) {
        let address = await HostAddressModel.findOne({
          host: mongoose.Types.ObjectId(getBooking[i].host_id._id),
          primaryAddress: true,
        }).lean();
        getBooking[i]["hostAddress"] = address ? address : null;
      }
    }
    let dataToSend = {
      ongoingPackageBookings: getBooking,
    };

    return {
      status: 1,
      data: dataToSend,
      message: "Ongoing package booking list fetched successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getPastPackageBookingList = async () => {
  try {
    let getBooking = await PackageBookingModel.find(
      {
        $or: [{ booking_status: 4 }, { booking_status: 5 }],
        payment_status: 1,
      },
      {
        payment_response: 0,
      }
    )
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
      .populate(
        "host_id",
        "first_name last_name country_code mobile_number email profile_pic location"
      )
      .populate(
        "pet_id",
        "package_name pet_name pet_dob pet_height pet_weight pet_gender pet_special_care treatment pet_pic"
      )
      .populate(
        "coupon",
        "couponCode discount usageLimit uptoDiscount orderValueLimit"
      )
      .populate("user", "full_name")
      .lean();

    if (!getBooking) {
      return {
        status: 0,
        message: "No booking found",
      };
    }
    if (getBooking.length > 0) {
      for (let i = 0; i < getBooking.length; i++) {
        let address = await HostAddressModel.findOne({
          host: mongoose.Types.ObjectId(getBooking[i].host_id._id),
          primaryAddress: true,
        }).lean();
        getBooking[i]["hostAddress"] = address ? address : null;
      }
    }
    let dataToSend = {
      pastPackageBookings: getBooking,
    };

    return {
      status: 1,
      data: dataToSend,
      message: "Past package booking list fetched successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getHostPackageList = async () => {
  try {
    let hostPackage = await HostPackageModel.find()

      .populate("host", "first_name last_name")
      .populate("breed", "subCategoryName")
      .sort({ created_at: -1 })
      .lean();
    if (!hostPackage) {
      return {
        status: 0,
        message: "List Not Found",
      };
    } else {
      return {
        status: 1,
        message: "Host Package List fetch Successfully",
        data: hostPackage,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getSettingData = async () => {
  try {
    let setting = await SettingModel.findOne({}, { _id: 0 }).lean();
    if (setting) {
      return {
        message: "Setting fetch successfully",
        data: setting,
      };
    } else {
      return {
        status: 0,
        message: "Something went wrong",
      };
    }
  } catch (err) {
    return {
      status: 0,
      message: err.message,
    };
  }
};

exports.updateSettingData = async (data) => {
  try {
    let type = parseInt(data.type);
    let setting;
    if (type == 1) {
      //aboutus
      setting = await SettingModel.findOneAndUpdate(
        {},
        { $set: { about_us: data.content } },
        { new: true }
      );
    } else if (type == 2) {
      // term & condition
      setting = await SettingModel.findOneAndUpdate(
        {},
        { $set: { term_condition: data.content } },
        { new: true }
      );
    } else if (type == 3) {
      // contact us
      setting = await SettingModel.findOneAndUpdate(
        {},
        { $set: { contact_us: data.content } },
        { new: true }
      );
    } else if (type == 4) {
      // privacy policy
      setting = await SettingModel.findOneAndUpdate(
        {},
        { $set: { privacy_policy: data.content } },
        { new: true }
      );
    } else if (type == 5) {
      // Help
      setting = await SettingModel.findOneAndUpdate(
        {},
        { $set: { help: data.content } },
        { new: true }
      );
    } else if (type == 6) {
      // FAQ
      setting = await SettingModel.findOneAndUpdate(
        {},
        { $set: { faq: data.content } },
        { new: true }
      );
    }

    if (setting) {
      setting = JSON.parse(JSON.stringify(setting));

      return {
        message: "Setting updated successfully",
        data: setting,
      };
    } else {
      return {
        status: 0,
        message: "Something went wrong",
      };
    }
  } catch (err) {
    return {
      status: 0,
      message: err.message,
    };
  }
};

exports.addNewFaq = async (data) => {
  try {
    if (!data.type || data.type == "")
      return { status: 0, message: "Type is required" };
    if (!data.question || data.question == "")
      return { status: 0, message: "Question is required" };
    if (!data.answer || data.answer == "")
      return { status: 0, message: "Answer is required" };

    let faq = await FaqModel.findOne({ question: data.question });
    if (!faq) {
      let dataToSave = {
        type: data.type,
        question: data.question,
        answer: data.answer,
        created_on: new Date().getTime(),
      };
      let faqData = new FaqModel(dataToSave);
      let savefaq = await faqData.save();
      if (!savefaq) {
        return {
          status: 0,
          message: "something went wrong try after sometime",
        };
      }
      return { message: "FAQ added successfully", status: 1 };
    } else {
      return { status: 0, message: "FAQ already created" };
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getFaqData = async () => {
  try {
    let faqList = await FaqModel.find({}).lean(true);
    let dataToSend = {
      faqList: faqList,
    };
    return { data: dataToSend, message: "FAQ fetched successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getHostSettingData = async () => {
  try {
    let setting = await HostSettingModel.findOne({}, { _id: 0 }).lean();
    if (setting) {
      return {
        message: "Setting fetch successfully",
        data: setting,
      };
    } else {
      return {
        status: 0,
        message: "Something went wrong",
      };
    }
  } catch (err) {
    return {
      status: 0,
      message: err.message,
    };
  }
};

exports.updateHostSettingData = async (data) => {
  try {
    let type = parseInt(data.type);
    // console.log(data.type)
    let setting;
    if (type == 1) {
      //aboutus
      setting = await HostSettingModel.findOneAndUpdate(
        {},
        { $set: { about_us: data.content } },
        { new: true }
      );
    } else if (type == 2) {
      // term & condition
      setting = await HostSettingModel.findOneAndUpdate(
        {},
        { $set: { term_condition: data.content } },
        { new: true }
      );
    } else if (type == 3) {
      // contact us
      setting = await HostSettingModel.findOneAndUpdate(
        {},
        { $set: { contact_us: data.content } },
        { new: true }
      );
    } else if (type == 4) {
      // privacy policy
      setting = await HostSettingModel.findOneAndUpdate(
        {},
        { $set: { privacy_policy: data.content } },
        { new: true }
      );
    } else if (type == 5) {
      // privacy policy
      setting = await HostSettingModel.findOneAndUpdate(
        {},
        { $set: { help: data.content } },
        { new: true }
      );
    } else if (type == 6) {
      // privacy policy
      setting = await HostSettingModel.findOneAndUpdate(
        {},
        { $set: { faq: data.content } },
        { new: true }
      );
    }  
    else {
      return {
        status: 0,
        message: "Please select correct type",
      };
    }
    console.log(setting);
    if (setting) {
      setting = JSON.parse(JSON.stringify(setting));

      return {
        message: "Setting updated successfully",
        data: setting,
      };
    } else {
      return {
        status: 0,
        message: "Something went wrong",
      };
    }
  } catch (err) {
    return {
      status: 0,
      message: err.message,
    };
  }
};

exports.getSellerSettingData = async () => {
  try {
    let setting = await SellerSettingModel.findOne({}, { _id: 0 }).lean();
    if (setting) {
      return {
        message: "Setting fetch successfully",
        data: setting,
      };
    } else {
      return {
        status: 0,
        message: "Something went wrong",
      };
    }
  } catch (err) {
    return {
      status: 0,
      message: err.message,
    };
  }
};

exports.updateSellerSettingData = async (data) => {
  try {
    let type = parseInt(data.type);
    // console.log(data.type)
    let setting;
    if (type == 1) {
      //aboutus
      setting = await SellerSettingModel.findOneAndUpdate(
        {},
        { $set: { about_us: data.content } },
        { new: true }
      );
    } else if (type == 2) {
      // term & condition
      setting = await SellerSettingModel.findOneAndUpdate(
        {},
        { $set: { term_condition: data.content } },
        { new: true }
      );
    } else if (type == 3) {
      // contact us
      setting = await SellerSettingModel.findOneAndUpdate(
        {},
        { $set: { contact_us: data.content } },
        { new: true }
      );
    } else if (type == 4) {
      // privacy policy
      setting = await SellerSettingModel.findOneAndUpdate(
        {},
        { $set: { privacy_policy: data.content } },
        { new: true }
      );
    } else if (type == 5) {
      // privacy policy
      setting = await SellerSettingModel.findOneAndUpdate(
        {},
        { $set: { help: data.content } },
        { new: true }
      );
    }
      else if (type == 6) {
        // FAQ
        setting = await SellerSettingModel.findOneAndUpdate(
          {},
          { $set: { faq: data.content } },
          { new: true }
        );
    } else {
      return {
        status: 0,
        message: "Please select correct type",
      };
    }
    console.log(setting);
    if (setting) {
      setting = JSON.parse(JSON.stringify(setting));

      return {
        message: "Setting updated successfully",
        data: setting,
      };
    } else {
      return {
        status: 0,
        message: "Something went wrong",
      };
    }
  } catch (err) {
    return {
      status: 0,
      message: err.message,
    };
  }
};

exports.getServiceSettingData = async () => {
  try {
    let setting = await ServiceSettingModel.findOne({}, { _id: 0 }).lean();
    if (setting) {
      return {
        message: "Setting fetch successfully",
        data: setting,
      };
    } else {
      return {
        status: 0,
        message: "Something went wrong",
      };
    }
  } catch (err) {
    return {
      status: 0,
      message: err.message,
    };
  }
};

exports.updateServiceSettingData = async (data) => {
  try {
    let type = parseInt(data.type);
    // console.log(data.type)
    let setting;
    if (type == 1) {
      //aboutus
      setting = await ServiceSettingModel.findOneAndUpdate(
        {},
        { $set: { about_us: data.content } },
        { new: true }
      );
    } else if (type == 2) {
      // term & condition
      setting = await ServiceSettingModel.findOneAndUpdate(
        {},
        { $set: { term_condition: data.content } },
        { new: true }
      );
    } else if (type == 3) {
      // contact us
      setting = await ServiceSettingModel.findOneAndUpdate(
        {},
        { $set: { contact_us: data.content } },
        { new: true }
      );
    } else if (type == 4) {
      // privacy policy
      setting = await ServiceSettingModel.findOneAndUpdate(
        {},
        { $set: { privacy_policy: data.content } },
        { new: true }
      );
    } else if (type == 5) {
      // privacy policy
      setting = await ServiceSettingModel.findOneAndUpdate(
        {},
        { $set: { help: data.content } },
        { new: true }
      );
    }
    else if (type == 6) {
      // privacy policy
      setting = await ServiceSettingModel.findOneAndUpdate(
        {},
        { $set: { faq: data.content } },
        { new: true }
      );
    } else {
      return {
        status: 0,
        message: "Please select correct type",
      };
    }
    console.log(setting);
    if (setting) {
      setting = JSON.parse(JSON.stringify(setting));

      return {
        message: "Setting updated successfully",
        data: setting,
      };
    } else {
      return {
        status: 0,
        message: "Something went wrong",
      };
    }
  } catch (err) {
    return {
      status: 0,
      message: err.message,
    };
  }
};

exports.addHostNewFaq = async (data) => {
  try {
    if (!data.type || data.type == "")
      return { status: 0, message: "Type is required" };
    if (!data.question || data.question == "")
      return { status: 0, message: "Question is required" };
    if (!data.answer || data.answer == "")
      return { status: 0, message: "Answer is required" };

    let faq = await HostFaqModel.findOne({ question: data.question });
    if (!faq) {
      let dataToSave = {
        type: data.type,
        question: data.question,
        answer: data.answer,
        created_on: new Date().getTime(),
      };
      let faqData = new HostFaqModel(dataToSave);
      let savefaq = await faqData.save();
      if (!savefaq) {
        return {
          status: 0,
          message: "something went wrong try after sometime",
        };
      }
      return { message: "FAQ added successfully", status: 1, data: savefaq };
    } else {
      return { status: 0, message: "FAQ already created" };
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getHostFaqData = async () => {
  try {
    let faqList = await HostFaqModel.find({})
      .lean(true)
      .sort({ created_on: -1 });
    let dataToSend = {
      faqList: faqList,
    };
    return { data: dataToSend, message: "FAQ fetched successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.addSellerNewFaq = async (data) => {
  try {
    if (!data.type || data.type == "")
      return { status: 0, message: "Type is required" };
    if (!data.question || data.question == "")
      return { status: 0, message: "Question is required" };
    if (!data.answer || data.answer == "")
      return { status: 0, message: "Answer is required" };

    let faq = await SellerFaqModel.findOne({ question: data.question });
    if (!faq) {
      let dataToSave = {
        type: data.type,
        question: data.question,
        answer: data.answer,
        created_on: new Date().getTime(),
      };
      let faqData = new SellerFaqModel(dataToSave);
      let savefaq = await faqData.save();
      if (!savefaq) {
        return {
          status: 0,
          message: "something went wrong try after sometime",
        };
      }
      return { message: "FAQ added successfully", status: 1, data: savefaq };
    } else {
      return { status: 0, message: "FAQ already created" };
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getSellerFaqData = async () => {
  try {
    let faqList = await SellerFaqModel.find({})
      .lean(true)
      .sort({ created_on: -1 });
    let dataToSend = {
      faqList: faqList,
    };
    return { data: dataToSend, message: "FAQ fetched successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.addServiceFaq = async (data) => {
  try {
    if (!data.type || data.type == "")
      return { status: 0, message: "Type is required" };
    if (!data.question || data.question == "")
      return { status: 0, message: "Question is required" };
    if (!data.answer || data.answer == "")
      return { status: 0, message: "Answer is required" };

    let faq = await ServiceFaqModel.findOne({ question: data.question });
    if (!faq) {
      let dataToSave = {
        type: data.type,
        question: data.question,
        answer: data.answer,
        created_on: new Date().getTime(),
      };
      let faqData = new ServiceFaqModel(dataToSave);
      let savefaq = await faqData.save();
      if (!savefaq) {
        return {
          status: 0,
          message: "something went wrong try after sometime",
        };
      }
      return { message: "FAQ added successfully", status: 1, data: savefaq };
    } else {
      return { status: 0, message: "FAQ already created" };
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getServiceFaqData = async () => {
  try {
    let faqList = await ServiceFaqModel.find({})
      .lean(true)
      .sort({ created_on: -1 });
    let dataToSend = {
      faqList: faqList,
    };
    return { data: dataToSend, message: "FAQ fetched successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getUserList = async () => {
  try {
    let userList = await UserModel.find({ is_blocked: false }, {full_name : 1})
      .sort({ createdAt: -1 })
      .lean();

    if (!userList) {
      return {
        status: 0, 
        message: "No user list found" };
    }else {
      return {
        status : 1,
        message : "User list fetch successfully",
        data : userList
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getHostList = async () => {
  try {
    let hostList = await HostModel.find({ is_blocked: false }, {first_name : 1, last_name : 1})
      .sort({ createdAt: -1 })
      .lean();

    if (!hostList) {
      return {
        status: 0, 
        message: "No host list found" };
    }else {
      return {
        status : 1,
        message : "Host list fetch successfully",
        data : hostList
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getSellerList = async () => {
  try {
    let sellerList = await SellerModel.find({ is_blocked: false }, {first_name : 1, last_name : 1})
      .sort({ createdAt: -1 })
      .lean();

    if (!sellerList) {
      return {
        status: 0, 
        message: "No Seller list found" };
    }else {
      return {
        status : 1,
        message : "Seller list fetch successfully",
        data : sellerList
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getServiceProviderList = async () => {
  try {
    let serviceList = await ServiceProviderModel.find({ is_blocked: false }, {first_name : 1, last_name : 1})
      .sort({ createdAt: -1 })
      .lean();

    if (!serviceList) {
      return {
        status: 0, 
        message: "No service provider list found" };
    }else {
      return {
        status : 1,
        message : "Service provider list fetch successfully",
        data : serviceList
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.sendNotification = async ( body ) => {
  try {  
      if( body.userId.length > 0){
        // console.log(userId);
          for( let x=0; x<body.userId.length; x++ ){
              let userDetail = await UserModel.findOne({_id:body.userId[x]}).lean()
              // console.log(userDetail, "Type one");
              let notify = {
                title: body.title,
                body: body.description,
                "color": "#f95b2c",
                "sound": true
              }
              let fcm = new FCM('AAAAR1d6NMY:APA91bGYkT7piYXQCSs4AkuOc_2nFYyEdFvs8tqxPQs5Z5CWgRYBw9swrbCK1beTizxzuwuGgyE3nj_xAeqj1XZFN2_2pSH-E3Grp9MLCO4aTdoZ1uPHe3DniXOAEM8fONnLmjUrwvsk');
              let message = {
                  to: userDetail.device_token,
                  collapse_key: 'your_collapse_key',
                  notification: notify,
                  data: {
                      title:body.title,
                      description:body.description
                  },
              };
              // console.log( "message - ",  message)
              fcm.send(message, function (err, response) {
                  if (err) {
                      console.log(null, err);
                  } else {
                      console.log(null, response)
                  }
              });
              let dataToSave = {
                  title: body.title,
                  body: body.description,
                  uniqe_id : {user_id: body.userId[x]},
                  type: body.type
              }
              let saveNotification = await NotificationModel.create( dataToSave )
              saveNotification.save()
              
          }

          // return {
          //     status:1,
          //     message:'Notification sent and saved',
          // }
      }
      if( body.sellerId.length > 0){
        console.log("lllllll");
          for( let x=0; x<body.sellerId.length; x++ ){
              let userDetail = await SellerModel.findOne({_id:body.sellerId[x]}).lean()
              // console.log(userDetail, "Type 2");

              let notify = {
                title: body.title,
                body: body.description,
                "color": "#f95b2c",
                "sound": true
              }
              let fcm = new FCM('AAAAR1d6NMY:APA91bGYkT7piYXQCSs4AkuOc_2nFYyEdFvs8tqxPQs5Z5CWgRYBw9swrbCK1beTizxzuwuGgyE3nj_xAeqj1XZFN2_2pSH-E3Grp9MLCO4aTdoZ1uPHe3DniXOAEM8fONnLmjUrwvsk');
              let message = {
                  to: userDetail.device_token,
                  collapse_key: 'your_collapse_key',
                  notification: notify,
                  data: {
                      title:body.title,
                      description:body.description
                  },
              };
              // console.log( "message - ",  message)
              fcm.send(message, function (err, response) {
                  if (err) {
                      console.log(null, err);
                  } else {
                      console.log(null, response)
                  }
              });
              // let sellerID = uniqe_id.seller_id
              let dataToSave = {
                title: body.title,
                body: body.description,
                uniqe_id:{seller_id : body.sellerId[x]},
                type: body.type
              }
              console.log(dataToSave, "llllllllll");
              let saveNotification = await NotificationModel.create( dataToSave )
              saveNotification.save()
          }
          // return {
          //     status:1,
          //     message:'Notification sent and saved',
          // }
      }
      if( body.serviceId.length > 0){
        for( let x=0; x<body.serviceId.length; x++ ){
            let userDetail = await ServiceProviderModel.findOne({_id:body.serviceId[x]}).lean()
            // console.log(userDetail, "Type 3");
            let notify = {
              title: body.title,
              body: body.description,
              "color": "#f95b2c",
              "sound": true
            }
            let fcm = new FCM('AAAAR1d6NMY:APA91bGYkT7piYXQCSs4AkuOc_2nFYyEdFvs8tqxPQs5Z5CWgRYBw9swrbCK1beTizxzuwuGgyE3nj_xAeqj1XZFN2_2pSH-E3Grp9MLCO4aTdoZ1uPHe3DniXOAEM8fONnLmjUrwvsk');
            let message = {
                to: userDetail.device_token,
                collapse_key: 'your_collapse_key',
                notification: notify,
                data: {
                    title:body.title,
                    description:body.description
                },
            };
            // console.log( "message - ",  message)
            fcm.send(message, function (err, response) {
                if (err) {
                    console.log(null, err);
                } else {
                    console.log(null, response)
                }
            });

            let dataToSave = {
              title: body.title,
              body: body.description,
              uniqe_id: {service_id: body.serviceId[x]},
              type: body.type
            }
            let saveNotification = await NotificationModel.create( dataToSave )
            saveNotification.save()
        }
        // return {
        //     status:1,
        //     message:'Notification sent and saved',
        // }
      }
      if( body.hostId.length > 0 ){
        for( let x=0; x<body.hostId.length; x++ ){
            let userDetail = await HostModel.findOne({_id:body.hostId[x]}).lean()
            // console.log(userDetail, "Type 4");
            let notify = {
              title: body.title,
              body: body.description,
              "color": "#f95b2c",
              "sound": true
            }
            let fcm = new FCM('AAAAR1d6NMY:APA91bGYkT7piYXQCSs4AkuOc_2nFYyEdFvs8tqxPQs5Z5CWgRYBw9swrbCK1beTizxzuwuGgyE3nj_xAeqj1XZFN2_2pSH-E3Grp9MLCO4aTdoZ1uPHe3DniXOAEM8fONnLmjUrwvsk');
            let message = {
                to: userDetail.device_token,
                collapse_key: 'your_collapse_key',
                notification: notify,
                data: {
                    title:body.title,
                    description:body.description
                },
            };
            // console.log( "message - ",  message)
            fcm.send(message, function (err, response) {
                if (err) {
                    console.log(null, err);
                } else {
                    console.log(null, response)
                }
            });

            let dataToSave = {
              title: body.title,
              body: body.description,
              uniqe_id: {provider_id: body.hostId[x]},
              type: body.type
            }
            let saveNotification = await NotificationModel.create( dataToSave )
            saveNotification.save()
        }
      //   return {
      //     status:1,
      //     message:'Notification sent and saved',
      // }
      }
      return {
        status:1,
        message:'Notification sent and saved',
    }
    } catch (error) {
      throw new Error(error.message)
    }
}

exports.getHostRefundList = async (data) => {
  try {
    if (!data.sortType || data.sortType == "")
      return { status: 0, message: "Sort type is required" };

    var commission = await CommissionModel.findOne({}).lean();
    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    let todayStart = Date.parse(start);
    let weekStart = todayStart - 7 * 86400000;
    let monthStart = todayStart - 30 * 86400000;

    var productQuery = { paymentStatus: 1, $or: [{ orderStatus: 1 }, { orderStatus: 6 }] }
    var serviceQuery = { payment_status: 1, $or: [{ booking_status: 2 }, { booking_status: 6 }] }

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

    var hostOrder = await HostOrderModel.find( productQuery , { order_id: 1, totalAmount:1, created_at:1, cart_id:1, host:1, is_refunded: 1 })
      .populate('host', 'first_name last_name country_code mobile_number email profile_pic').lean();
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

    var hostService = await HostServiceBookingModel.find( serviceQuery , { booking_id: 1, total_amount:1, created_at:1, service_provider:1, host:1, is_refunded: 1 })
        .populate('host', 'first_name last_name country_code mobile_number email profile_pic')
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
      data: allData,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.refundHostOrder = async (data) => {
  try {
    if (!data.orderId || data.orderId == "")
      return { status: 0, message: "Order id is required" };

    var hostOrder = await HostOrderModel.findOne({  _id: mongoose.Types.ObjectId(data.orderId) }).lean();
    if(hostOrder){
      var updateOrder = await HostOrderModel.findOneAndUpdate({  _id: mongoose.Types.ObjectId(data.orderId) },{ $set: { is_refunded: true }}, { new: true }).lean();
    }else{
      var hostService = await HostServiceBookingModel.findOne({  _id: mongoose.Types.ObjectId(data.orderId) }).lean();
      if(hostService){
        var updateServiceOrder = await HostServiceBookingModel.findOneAndUpdate({  _id: mongoose.Types.ObjectId(data.orderId) },{ $set: { is_refunded: true }}, { new: true }).lean();
      }else{
        return { status: 0, message: "Order not found" };
      }
    }

    return {
      status: 1,
      message: "Order refunded successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getUserRefundList = async (data) => {
  try {
    if (!data.sortType || data.sortType == "")
      return { status: 0, message: "Sort type is required" };

    var commission = await CommissionModel.findOne({}).lean();
    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    let todayStart = Date.parse(start);
    let weekStart = todayStart - 7 * 86400000;
    let monthStart = todayStart - 30 * 86400000;

    var productQuery = { paymentStatus: 1, $or: [{ orderStatus: 1 }, { orderStatus: 6 }] }
    var serviceQuery = { payment_status: 1, $or: [{ booking_status: 2 }, { booking_status: 6 }] }
    var packageQuery = { payment_status: 1, $or: [{ booking_status: 5 }] }

    if(data.sortType == 0){
      productQuery = { ...productQuery }
      serviceQuery = { ...serviceQuery }
      packageQuery = { ...packageQuery }
    }else if(data.sortType == 1){
      productQuery = { ...productQuery, created_at: { $gte : todayStart } }
      serviceQuery = { ...serviceQuery, created_at: { $gte : todayStart } }
      packageQuery = { ...packageQuery, created_at: { $gte : todayStart } }
    }else if(data.sortType == 2){
      productQuery = { ...productQuery, created_at: { $gte : weekStart } }
      serviceQuery = { ...serviceQuery, created_at: { $gte : weekStart } }
      packageQuery = { ...packageQuery, created_at: { $gte : weekStart } }
    }else if(data.sortType == 3){
      productQuery = { ...productQuery, created_at: { $gte : monthStart } }
      serviceQuery = { ...serviceQuery, created_at: { $gte : monthStart } }
      packageQuery = { ...packageQuery, created_at: { $gte : monthStart } }
    }else if(data.sortType == 4){
      if (!data.startDate || data.startDate == "")
        return { status: 0, message: "Start date is required" };
      if (!data.endDate || data.endDate == "")
        return { status: 0, message: "End date is required" };

      productQuery = { ...productQuery, $and: [ { created_at: { $gte : data.startDate } }, { created_at: { $lte : data.endDate } }]}
      serviceQuery = { ...serviceQuery, $and: [ { created_at: { $gte : data.startDate } }, { created_at: { $lte : data.endDate } }]}
      packageQuery = { ...packageQuery, $and: [ { created_at: { $gte : data.startDate } }, { created_at: { $lte : data.endDate } }]}
    }

    var userOrder = await UserOrderModel.find( productQuery , { order_id: 1, totalAmount:1, created_at:1, cart_id:1, user:1, is_refunded: 1 })
      .populate('user', 'full_name country_code mobile_number email').lean();
    if(userOrder.length > 0){
      for(let i=0; i< userOrder.length; i++){
        let cartData = await UserCartModel.findOne({ _id: mongoose.Types.ObjectId(userOrder[i].cart_id) },{ seller: 1 })
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

    var userService = await UserServiceBookingModel.find( serviceQuery , { booking_id: 1, total_amount:1, created_at:1, service_provider:1, user:1, is_refunded: 1 })
        .populate('user', 'full_name country_code mobile_number email')
        .populate('service_provider', 'first_name last_name country_code mobile_number email profile_pic').lean();

    if(userService.length > 0){
      for(let j=0; j< userService.length; j++){
        userService[j].commission = commission ? commission.commission_percent : 0;
        let discountAmount = (commission.commission_percent * userService[j].total_amount) / 100;
        let remainingAmount = Number(userService[j].total_amount) - Number(discountAmount);
        userService[j]['payoutAmount'] = (Math.round(remainingAmount * 100) / 100).toFixed(2);
      }
    }

    var userPackage = await PackageBookingModel.find( packageQuery , { booking_id: 1, payable_amount:1, created_at:1, host_id:1, user:1, is_refunded: 1 })
      .populate('user', 'full_name country_code mobile_number email')
      .populate('host_id', 'first_name last_name country_code mobile_number email profile_pic').lean();

    if(userPackage.length > 0){
      for(let j=0; j< userPackage.length; j++){
        userPackage[j].commission = commission ? commission.commission_percent : 0;
        let discountAmount = (commission.commission_percent * userPackage[j].payable_amount) / 100;
        let remainingAmount = Number(userPackage[j].payable_amount) - Number(discountAmount);
        userPackage[j]['payoutAmount'] = (Math.round(remainingAmount * 100) / 100).toFixed(2);
      }
    }

    let allData = [...userOrder, ...userService, ...userPackage]
    if(allData.length > 0){
      allData = _.orderBy(allData, (item) => item.created_at, ["desc"]);
    }

    return {
      status: 1,
      message: "Refund list fetched successfully",
      data: allData,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.refundUserOrder = async (data) => {
  try {
    if (!data.orderId || data.orderId == "")
      return { status: 0, message: "Order id is required" };

    let bookingType = 0;
    let transactionAmount = 0;
    let userId = "";
    var hostOrder = await UserOrderModel.findOne({  _id: mongoose.Types.ObjectId(data.orderId) }).lean();
    if(hostOrder){
      bookingType = 1;
      transactionAmount = hostOrder.totalAmount;
      userId = hostOrder.user;
      var updateOrder = await UserOrderModel.findOneAndUpdate({  _id: mongoose.Types.ObjectId(data.orderId) },{ $set: { is_refunded: true }}, { new: true }).lean();
    }else{
      var hostService = await UserServiceBookingModel.findOne({  _id: mongoose.Types.ObjectId(data.orderId) }).lean();
      if(hostService){
        bookingType = 2;
        transactionAmount = hostService.total_amount;
        userId = hostService.user;
        var updateServiceOrder = await UserServiceBookingModel.findOneAndUpdate({  _id: mongoose.Types.ObjectId(data.orderId) },{ $set: { is_refunded: true }}, { new: true }).lean();
      }else{
        var hostPackage = await PackageBookingModel.findOne({  _id: mongoose.Types.ObjectId(data.orderId) }).lean();
        if(hostPackage){
          bookingType = 3;
          transactionAmount = hostPackage.payable_amount;
          userId = hostPackage.user;
          var updatePackageOrder = await PackageBookingModel.findOneAndUpdate({  _id: mongoose.Types.ObjectId(data.orderId) },{ $set: { is_refunded: true }}, { new: true }).lean();
        }else{
          return { status: 0, message: "Order not found" };
        }
      }
    }

    var commission = await CommissionModel.findOne({}).lean();
    let discountAmount = (commission.commission_percent * Number(transactionAmount)) / 100;
    let remainingAmount = Number(transactionAmount) - Number(discountAmount);
    let walletAmount = (Math.round(remainingAmount * 100) / 100).toFixed(2);

    let dataToSave = {
      user: userId,
      transaction_id: generateUniqueId({ length: 7,useLetters: true }).toUpperCase(),
      transaction_type: 1,
      transaction_amount: Number(walletAmount),
      booking_type: bookingType,
      booking: {
        user_cart_booking : data.orderId,
        user_service_booking: data.orderId,
        package_booking: data.orderId
      },
      transaction_at: new Date().getTime()
    };

    let myData = new UserWalletTransactionModel(dataToSave);
    let save = await myData.save();

    var userWallet = await UserWalletModel.findOne({  user: mongoose.Types.ObjectId(userId) }).lean();
    if(userWallet){
      let totalSum = Number(userWallet.wallet_amount) + Number(walletAmount)
      let dataToUpdate = {
        transaction_type: 1,
        wallet_amount: totalSum,
        modified_at: new Date().getTime()
      }
      var updateWallet = await UserWalletModel.findOneAndUpdate({  _id: mongoose.Types.ObjectId(userWallet._id) },{ $set: dataToUpdate }, { new: true }).lean();
    }else{
      let data_to_save = {
        user: userId,
        transaction_type: 1,
        wallet_amount: Number(walletAmount),
        created_at: new Date().getTime(),
        modified_at: new Date().getTime(),
      };
      let my_data = new UserWalletModel(data_to_save);
      let saveWallet = await my_data.save();
    }

    return {
      status: 1,
      message: "Order refunded successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getSupportList  = async()=>{
  try {
    let supportData = await ReportTicketModel.find({})

    .populate("uniqid.user_id",'full_name')
    .populate("booking.user_cart_booking", 'order_id')
    .populate("booking.user_service_booking",'booking_id')
    .populate("booking.package_booking", 'booking_id') 
    .sort({created_at : -1})
    .lean()

    if(!supportData){
      return { status : 0, message : " No List found"}
    }

    let dataToSend = {
      supportList : supportData
    }

      return {
        status : 1, 
        message : "List Fetch Successfully",
        data : dataToSend
      }
    
  } catch (error) {
    throw new Error(error.message)
  }
};

exports.updateSupport  = async(data)=>{
  try {
    
    if (!data._id || data._id == "") {
      throw new Error("unsufficient Parameters");
    }

    let updateSupport = await ReportTicketModel.findByIdAndUpdate({_id : data._id},
      {$set : {
        ticket_status : data.status
      }}
      )

    .populate("uniqid.user_id",'full_name')
    .populate("booking.user_cart_booking", 'order_id')
    .populate("booking.user_service_booking",'booking_id')
    .populate("booking.package_booking", 'booking_id') 
    .sort({created_at : -1})
    .lean()

    if(!updateSupport){
      return { status : 0, message : "Can't update"}
    }

    let dataToSend = {
      supportList : updateSupport
    }

      return {
        status : 1, 
        message : "Status Update Successfully",
        data : dataToSend
      }
    
  } catch (error) {
    throw new Error(error.message)
  }
}

exports.getPackagePayment = async () => {
  try {
    let getBooking = await PackageBookingModel.find(
      {
        $or: [{ booking_status: 4 }],
        payment_status: 1,
      },
      {
        payment_response: 0,
      }
    )
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
      .populate(
        "host_id",
        "first_name last_name country_code mobile_number email profile_pic location"
      )
      .populate(
        "pet_id",
        "package_name pet_name pet_dob pet_height pet_weight pet_gender pet_special_care treatment pet_pic"
      )
      .populate(
        "coupon",
        "couponCode discount usageLimit uptoDiscount orderValueLimit"
      )
      .populate("user", "full_name")
      .lean();

    if (!getBooking) {
      return {
        status: 0,
        message: "No booking found",
      };
    }

    // let commission = await CommissionModel.findOne().lean();
    if (getBooking.length > 0) {
      for (let i = 0; i < getBooking.length; i++) {
        let address = null;
        if(getBooking[i].host_id){
          address = await HostAddressModel.findOne({
            host: mongoose.Types.ObjectId(getBooking[i].host_id._id)
          }).lean();
        }
        getBooking[i]["hostAddress"] = address ? address : null;
        let netAmount = getBooking[i].payable_amount ? getBooking[i].payable_amount: 0;
        let commission = getBooking[i].commissionPercent ? getBooking[i].commissionPercent: 0;

        if(Number(netAmount) > 0){
          let commissionAmount = (Number(commission) * Number(netAmount)) / 100;
          getBooking[i]['commissionAmount'] = (Math.round(commissionAmount * 100) / 100).toFixed(2);
          getBooking[i]['commissionPercent'] = commission.commission_percent;
          getBooking[i]['payableAmount'] = (Math.round((netAmount - commissionAmount) * 100) / 100).toFixed(2);
        }
      }
    }
    let dataToSend = {
      pastPackageBookings: getBooking,
    };

    return {
      status: 1,
      data: dataToSend,
      message: "Past package payment list fetched successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.notificationList = async()=>{
  try {
    let data = await NotificationModel.find({},{title : 1,body: 1, created_at :1 , is_blocked : 1})
    .sort({created_at :-1})
    .lean()
    if (!data){
      return {
        status : 0,
        message : "No Notification List Found"
      }
    }else{
      return{
        status : 1,
        message : "Notification list fetch Successfully",
        data : data
      }
    }
  } catch (error) {
    throw new error(error.message)
  }
}

exports.blockUnblockNotification = async(data) => {

  try {
    let blockStatus = await NotificationModel.findByIdAndUpdate({_id : data._id},
      {
        is_blocked : data.status
      },
      {new : true})
  
      if(!blockStatus){
        return{
          status : -1,
          message : "Notification not found"
        }
      }
  
      let stat = data.status == "1" ? "blocked" : "unblocked"
  
      return {
        status : 1,
        message : `Notificaton ${stat} sccessfully`
      }
  } catch (error) {
      throw new Error(error.message)   
  }
}

exports.deleteNotification = async(data) => {

  try {
    let checkId = await NotificationModel.findById(data._id);
    if (!checkId) {
      return {
        status: -1,
        message: "Notification does not exist",
      };
    } else {
      let deleteData = await NotificationModel.findByIdAndDelete(
        checkId._id
      );
      if (deleteData) {
        return {
          status: 1,
          message: "Notification deleted successfully",
        };
      } else {
        return {
          status: 2,
          message: "Notification not deleted",
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
}


exports.setHealthGoalPoint = async(data) => {

  try {

    if (!data._id || data._id == "")
      return { status: 0, message: "Health goal ID is required" };

    if (!data.health_goal_point || data.health_goal_point == "")
      return { status: 0, message: "Health goal point is required" };

    let setHealthData = await HealthGoalPointModel.findByIdAndUpdate({ _id : data._id},
      { $set : {
          health_goal_point : data.health_goal_point
      }}, {new : true})

    if (setHealthData) {
      return {
        message: "Health goal point set successfully",
        status: 1,
        data : setHealthData
      };
    } else {
      return {
        message: "Sorry unable to add Health goal",
        status: 0,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

exports.setUsageLimitPurchage = async(data) => {

  try {

    if (!data._id || data._id == "")
      return { status: 0, message: "ID is required" };

    if (!data.usage_limit_purchase || data.usage_limit_purchase == "")
      return { status: 0, message: "Usage limit is required" };

    let setHealthData = await UsageLimitPurchaseModel.findByIdAndUpdate({ _id : data._id},
      { $set : {
          usage_limit_purchase : data.usage_limit_purchase
      }}, {new : true})

    if (setHealthData) {
      return {
        status : 1,
        message: "Usage limit purchase update successfully",
        data : setHealthData
      };
    } else {
      return {
        message: "Sorry unable to add Health goal",
        status: 0,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

exports.getSmileHealthPoints = async(data)=>{
  try {
    
    let healthData = await HealthGoalPointModel.findOne({}).lean();
    let usageData = await UsageLimitPurchaseModel.findOne({}).lean();

    dataToSend = {
      health_goal_point : healthData,
      usage_limit_purchase : usageData
    }
    
    return {
      status : 1,
      message : "Smile health point fetch successfully",
      data : dataToSend 
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

// exports.changePassword = async (data) => {
//   try {
//       let {
//           current_password,
//           new_password,
//           confirm_new_password,
//       } = data;

//       // const schema = Joi.object().keys({
//       //     current_password: Joi.string().required().error(e => "Current password is required"),
//       //     new_password: Joi.string().required().error(e => 'New password is required'),
//       //     confirm_new_password: Joi.string().required().error(e => 'Confirm new password is required'),
//       // })

//       // const result = Joi.validate(req.body, schema, { abortEarly: true });
//       // if (result.error) {
//       //     if (result.error.details && result.error.details[0].message) {
//       //         res.status(400).json({ message: result.error.details[0].message });
//       //     } else {
//       //         res.status(400).json({ message: result.error.message });
//       //     }
//       //     return;
//       // }

//       if(new_password === confirm_new_password){
//           let find_user = await AdminModel.findOne({}).lean();
//           if (find_user) {
//               if(current_password == find_user.password){
//                   let update_user = await AdminModel.findOneAndUpdate({
//                       email: find_user.email
//                   }, {
//                       $set: {
//                           password: confirm_new_password
//                       }
//                   }, {
//                       new: true
//                   })
//                   if (update_user) {
//                       return {
//                         status : 1, 
//                         message : "password update successfully"
//                       }
//                   } else {
//                       throw new Error("password not updated")
//                   }
//               }else{
//                 return {
//                   status : 0, 
//                   message : "current password is not valid"
//                   }
//                 }
//           } else {
//               return {
//                 status : 0, 
//                 message : " This email is not registered with us !!!!"
//               }
//           }
//       }else{
//           return {
//             status : 0, 
//             message : "New password and confirm new password should be same !!!"
//           }
//       }
//   } catch (error) {
//       throw new Error(error.message)
//     }
// }


exports.updateServiceCharge = async (data) => {
  try {
    if (!data.service_charge || data.service_charge == "")
      return { status: 0, message: "Service charge is required" };
    /*
        // code for add commission
        let dataToSave = {
          service_charge : data.service_charge,
          modified_at: new Date().getTime()
        };
    
        let myData = new ServiceChargeModel(dataToSave);
        let save = await myData.save();
      */
    let serviceChargeData = await ServiceChargeModel.findById(
      mongoose.Types.ObjectId(data._id)
    );
    if (serviceChargeData) {
      let dataToUpdate = {
        service_charge: data.service_charge,
        modified_at: new Date().getTime(),
      };
      let serviceCharge = await ServiceChargeModel.findByIdAndUpdate(
        data._id,
        dataToUpdate,
        { new: true }
      );
      if (!serviceCharge) {
        return { status: 0, message: "Something went Wrong,Please try later." };
      }
      return {
        status: 1,
        message: "Service charge updated successfully",
        data: serviceCharge,
      };
    } else {
      return { status: 0, message: "Service charge does not exist" };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getServiceCharge = async () => {
  try {
    let serviceCharge = await ServiceChargeModel.findOne().lean();
    if (serviceCharge) {
      return {
        status: 1,
        data: serviceCharge,
        message: "Service charge fetched successfully",
      };
    } else {
      return {
        status: 0,
        message: "No Service charge found ",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};