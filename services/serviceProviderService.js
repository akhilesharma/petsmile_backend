const { ServiceProviderModel } = require("../models/servicesModel");

const bcrypt = require("bcrypt");
var _ = require("lodash");
const authentication = require("../middlewares/authentication");
const utils = require("../modules/utils");
const { default: mongoose } = require("mongoose");
const ExcelJS = require('exceljs');
const Excel = require('exceljs');
const config = require("../config/config");
var aws = require('aws-sdk');
//==============================================================

const { ServiceProviderServicesModel } = require("../models/servicesProviderServicesModel");
const { ServiceCategoryModel } = require("../models/serviceCategoryModel");
const { HostServiceBookingModel } = require("../models/hostServiceBookingModel");
const { UserServiceBookingModel } = require("../models/userServiceBookingModel");
const { NotificationModel } = require("../models/notificationModel");
const { UserModel } = require("../models/userModel");
const { HostModel } = require("../models/hostModel");
const { ServiceOrderRatingModel } = require("../models/serviceOrderRatingModel");
const { ServiceSettingModel } = require("../models/serviceSettingModel");
const { userLikeModel } = require("../models/likeModel");
const { AdvertisementModel } = require("../models/AdvertisementModel");

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

let sendOtp = async (ServicesData) => {
  try {
    let otp = await utils.randomStringGenerator();
    let otpExpTime = new Date(Date.now() + config.defaultOTPExpireTime);
    ServicesData.otp_info = {
      otp: otp,
      expTime: otpExpTime,
    };

    let mobileNumber = ServicesData.country_code + ServicesData.mobile_number;
    //Send message via Twillio
    let send = await utils.sendotp(ServicesData.otp_info.otp, mobileNumber);
    return {
      status: 1,
      message: "OTP sent Successfully",
      data: ServicesData,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};


exports.registerServiceProvider = async (data) => {
  try {
    // const data  = req.body;

    const checkExist = await ServiceProviderModel.findOne({
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

      let saveFirstInfo = await ServiceProviderModel.create(details);
      let result = await saveFirstInfo.save();

      if (result) {
        let resOtp = await sendOtp(result);
        let otpInfo = resOtp.data.otp_info;
        let update = await ServiceProviderModel.findOneAndUpdate(
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
    let userData1 = await ServiceProviderModel.findById({ _id: user._id });
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
      let update = await ServiceProviderModel.findOneAndUpdate(
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
    // throw new Error("Something went wrong");
    throw new Error(error.message);
  }
};

exports.resendOtp = async (user) => {
  try {
    const checkExist = await ServiceProviderModel.findOne({ country_code: user.country_code, mobile_number: user.mobile_number });

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

      // let result = await checkExist.save();
      let result =  await ServiceProviderModel.findOneAndUpdate({ _id: checkExist._id }, { $set: checkExist },{ new:true }).lean();

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

exports.completeProfile = async (data, user) => {
  try {
    // console.log(user);
    let checkExist = await ServiceProviderModel.findOne({ _id: user._id });

    if (!checkExist) {
      return {
        message: "User does not exist",
        status: 0,
      };
    } else {
      checkExist.email = data.email;
      checkExist.location = {
        address1: data.address1,
        // }, {
        address2: data.address2,
        // }, {
        address3: data.address3,
      };
      checkExist.documents = {
        idProof: data.idProof,
      };

      checkExist.is_profile_created = true;
      checkExist.latitude = data.latitude;
      checkExist.longitude = data.longitude;

      // let update = await ServiceProviderModel.findOneAndUpdate(user._id, checkExist, {
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
    let checkExist = await ServiceProviderModel.findOne({ _id: user._id });

    if (!checkExist) {
      return {
        message: "User does not exist",
        status: 0,
      };
    } else {
      checkExist.bankDetails = {
        bankAccountName : data.bankAccountName,
        accountHolderName: data.accountHolderName,
        accountNumber: data.accountNumber,
        bankCard: data.bankCard,
      };
      let pass = await bcrypt.hash(data.password, 10);
      // console.log(pass);
      checkExist.password = pass;
      checkExist.is_bank_details_added = true;

      // let update = await ServiceProviderModel.findOneAndUpdate(user._id, checkExist, {
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

    let services = await ServiceProviderModel.findOne({
      $and: [{
        country_code: data.country_code
      }, {
        mobile_number: data.mobile_number  
      }]
    }).exec();
    if (!services) {
      return { status: 0, message: "Mobile number does not exist" };
    }

    let send_otp = await sendOtp(services);

    let recruiter = await ServiceProviderModel.findOneAndUpdate(
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
      return { status: 0, message: "Service Provider does not exist" };
    }

    if (data.newPassword == data.confirmPassword) {
      let password = await bcrypt.hash(data.newPassword, 10);
      userData.password = password;
      // user.link_token = '' //remove
      let serviceprovider = userData;
      let saveuser = serviceprovider.save();
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

    let findProfile = await ServiceProviderModel.findOne({
      mobile_number: data.mobile_number,
      country_code: data.country_code,
    });
    if (!findProfile) {
      return {
        message: "Service Provider not Found",
        status: 0,
      };
    }
    // console.log(findProfile);
    if (!findProfile?.password) {
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
    let findProfile1 = await ServiceProviderModel.findOneAndUpdate(
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

exports.logout = async (service) => {
  try {
    if (!service._id || service._id == "")
      return { status: 0, message: "Service Provider does not exist" };

    let updateService = await ServiceProviderModel.findOneAndUpdate(
      { _id: service._id },
      { $set: { access_token: "" } },
      { new: true }
    );

    if (!updateService) {
      return { status: 0, message: "Something went Wrong" };
    }
    return { status: 1, message: "Logout successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.editProfile = async (service, data) => {
  try {
    let result = await ServiceProviderModel.findByIdAndUpdate(
      { _id: service._id },
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

exports.editAddress = async (service, data) => {
  try {
    let result = await ServiceProviderModel.findByIdAndUpdate(
      { _id: service._id },
      {
        $set: {
          idProof: data.idProof,
          location: {
            address1: data.address1,
            // }, {
            address2: data.address2,
            // }, {
            address3: data.address3,
          },
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

exports.changePassword = async (service, data) => {
  try {
    let compare = await bcrypt.compare(data.old_password, service.password);
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

    let result = await ServiceProviderModel.findByIdAndUpdate(
      { _id: service._id },
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

exports.getProfile = async (service, data) => {
  try {
    let serviceProfile = await ServiceProviderModel.findById({
      _id: service._id,
    });
    if (serviceProfile) {
      return {
        status: 1,
        response: serviceProfile,
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

//============================> M6 <============================

exports.addServices = async (service, body) => {
  try {
    let serviceCategory = await ServiceCategoryModel.findOne({
      _id: body.serviceCategory,
    });
    if (!serviceCategory) {
      return {
        message: "Services Not Found",
        status: 0,
      };
    }
    let services = new ServiceProviderServicesModel();

    (services.service_image = body.service_image),
      (services.serviceCategory = body.serviceCategory);
    services.serviceProvider = service._id;
    services.price = body.price;
    (services.experience = body.experience),
      (services.description = body.description);
    services.workingDaysHours = body.workingDaysHours;

    let result = await services.save();
    if (!result) {
      return {
        message: "Something Wrong",
        status: 0,
      };
    }
    console.log(serviceCategory);
    result.serviceCategory = serviceCategory;
    // result.serviceProvider = service
    return {
      message: "Success",
      status: 1,
      response: result,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getServicesList = async (service) => {
  try {
    let SerivceList = await ServiceProviderServicesModel.find({
      serviceProvider: service._id,
    })
      .populate("serviceCategory", "_id category_name category_image")
      .lean()
      .sort({ createdAt: -1 });

      if(SerivceList.length > 0){
        for(let i=0; i < SerivceList.length; i++){
          let likedData = await userLikeModel.findOne({ "service.service_provider_services": SerivceList[i]._id }).lean();
          SerivceList[i]['totalLike'] = likedData ? (Number(likedData.user.length) + Number(likedData.host.length)) : 0
        }
      }

    if (!SerivceList) {
      return {
        status: 0,
        message: "Service provider list not found",
      };
    } else {
      return {
        status: 1,
        message: "Service Provider List Fetch",
        response: SerivceList,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getServicesCategory = async (service) => {
  try {
    let serviceCategoryList = await ServiceCategoryModel.find(
      { is_blocked: 0 },
      { is_blocked: 0, created_at: 0, modified_at: 0 }
    )
      .lean()
      .sort({ createdAt: -1 });
    if (!serviceCategoryList) {
      return {
        status: 0,
        message: "Service category list not found",
      };
    } else {
      return {
        status: 1,
        message: "Service category List Fetch",
        response: serviceCategoryList,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.editServices = async (service, body) => {
  try {
    console.log(body);
    let serviceCategory = await ServiceCategoryModel.findOne({
      _id: body.serviceCategory,
    });
    if (!serviceCategory) {
      return {
        message: "Services Not Found",
        status: 0,
      };
    }
    let result = await ServiceProviderServicesModel.findByIdAndUpdate(
      { _id: body._id },
      {
        $set: {
          service_image: body.service_image,
          serviceCategory: body.serviceCategory,
          serviceProvider: service._id,
          price: body.price,
          experience: body.experience,
          description: body.description,
          workingDaysHours: body.workingDaysHours,
        },
      },
      {
        new: true,
      }
    );
    if (!result) {
      return { status: 0, message: "Something went Wrong" };
    }
    result.serviceCategory = serviceCategory;
    //   result.serviceProvider = service;
    return {
      status: 1,
      message: "Service edit successfully",
      response: result,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

//============================> M7 <============================

exports.getNewServiceOrder = async (service) => {
  try {
    let hostNewOrder = await HostServiceBookingModel.find({
      serviceProvider: service._id,
      booking_status: 1,
      payment_status: 1,
    })

      .populate(
        "host",
        "first_name last_name country_code mobile_number email profile_pic is_verified_by_admin location is_active"
      )
      .populate("service_category", "category_name category_image")
      .populate("service_id")
      .populate("address")
      .sort({ createdAt: 0 })
      .lean();

    // .populate('address', "full_name mobile_number street locality city country state postal_code primaryAddress" ).sort({createdAt : 0 }).lean();

    let userNewOrder = await UserServiceBookingModel.find({
      serviceProvider: service._id,
      booking_status: 1,
      payment_status: 1,
    })

      .populate(
        "user",
        "full_name country_code mobile_number email gender location"
      )
      .populate("service_category", "category_name category_image")
      .populate("service_id")
      .populate("address")
      .sort({ createdAt: 0 })
      .lean();

    // .populate('address', "full_name mobile_number street locality city country state postal_code primaryAddress" ).sort({createdAt : 0 }).lean();

    let result = hostNewOrder.concat(userNewOrder).sort(
      function (a, b) {
        return b.created_at - a.created_at;
      },
      { created_at: -1 }
    );

    if (!result) {
      return {
        status: 0,
        message: "New Service Order list not found",
      };
    } else {
      return {
        status: 1,
        message: "New Service Order  List Fetch",
        response: result,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getOngoingServiceOrder = async (service) => {
  try {
    let hostNewOrder = await HostServiceBookingModel.find({
      serviceProvider: service._id,
      booking_status: { $in: [3, 4] },
      payment_status: 1,
    })

      .populate(
        "host",
        "first_name last_name country_code mobile_number email profile_pic is_verified_by_admin location is_active"
      )
      .populate("service_category", "category_name category_image")
      .populate("service_id")
      .populate("address")
      .sort({ createdAt: 0 })
      .lean();

    //   .populate('address', "full_name mobile_number street locality city country state postal_code", {primaryAddress : true }).sort({createdAt : 0 }).lean();

    let userNewOrder = await UserServiceBookingModel.find({
      serviceProvider: service._id,
      booking_status: { $in: [3, 4] },
      payment_status: 1,
    })

      .populate(
        "user",
        "full_name country_code mobile_number email gender location"
      )
      .populate("service_category", "category_name category_image")
      .populate("service_id")
      .populate("address")
      .sort({ createdAt: 0 })
      .lean();

    //   .populate('address', "full_name mobile_number street locality city country state postal_code", {primaryAddress : true } ).sort({createdAt : 0 }).lean();

    let result = hostNewOrder.concat(userNewOrder).sort(
      function (a, b) {
        return b.created_at - a.created_at;
      },
      { created_at: -1 }
    );

    if (!result) {
      return {
        status: 0,
        message: "Ongoing Service Order list not found",
      };
    } else {
      return {
        status: 1,
        message: "Ongoing Service Order  List Fetch",
        response: result,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getPastServiceOrder = async (service) => {
  try {
    let hostNewOrder = await HostServiceBookingModel.find({
      serviceProvider: service._id,
      booking_status: { $in: [2, 5, 6] },
      payment_status: 1,
    })

      .populate(
        "host",
        "first_name last_name country_code mobile_number email profile_pic is_verified_by_admin location is_active"
      )
      .populate("service_category", "category_name category_image")
      .populate("service_id")
      .populate("address")
      .sort({ created_at: -1 })
      .lean();

    //   .populate('address', "full_name mobile_number street locality city country state postal_code", {primaryAddress : true }).sort({createdAt : 0 }).lean();

    let userNewOrder = await UserServiceBookingModel.find({
      serviceProvider: service._id,
      booking_status: { $in: [2, 5, 6] },
      payment_status: 1,
    })

      .populate(
        "user",
        "full_name country_code mobile_number email gender location"
      )
      .populate("service_category", "category_name category_image")
      .populate("service_id")
      .populate("address")
      .sort({ created_at: -1 })
      .lean();

    //   .populate('address', "full_name mobile_number street locality city country state postal_code", {primaryAddress : true } ).sort({createdAt : 0 }).lean();

    let result = hostNewOrder.concat(userNewOrder).sort(
      function (a, b) {
        return b.modified_at - a.modified_at;
      },
      { modified_at: -1 }
    );

    
    if(result.length > 0){
      for(let i=0; i < result.length; i++){
        let ratingId = result[i].service_rating ? result[i].service_rating : null;
        if(ratingId != null){
          let  allRatings = await ServiceOrderRatingModel.findOne({ _id: mongoose.Types.ObjectId(ratingId) },{ uniqid: 0, booking: 0, service_provider_id: 0 }).lean();
          result[i]['rating'] = allRatings ? allRatings : null;
        }else{
          result[i]['rating'] = null
        }
      }
    }

    if (!result) {
      return {
        status: 0,
        message: "Past Service booking list not found",
      };
    } else {
      return {
        status: 1,
        message: "Past Service Order List Fetched successfully",
        response: result,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.viewOrder = async (service, data) => {
  try {
    let result = await HostServiceBookingModel.findOne({ _id: data._id })
      .populate(
        "host",
        "first_name last_name country_code mobile_number email profile_pic is_verified_by_admin location is_active"
      )
      .populate("service_category", "category_name category_image")
      .populate("service_id")
      .populate("address")
      .lean();
    if (!result) {
      result = await UserServiceBookingModel.findOne({ _id: data._id })
        .populate(
          "user",
          "full_name country_code mobile_number email gender location"
        )
        .populate("service_category", "category_name category_image")
        .populate("service_id")
        .populate("address")
        .lean();
    }

    if (!result) {
      return {
        status: 0,
        message: "Not found",
      };
    }
    if(result.service_rating){
      let  allRatings = await ServiceOrderRatingModel.findOne({ _id: mongoose.Types.ObjectId(result.service_rating) },{ uniqid: 0, booking: 0, service_provider_id: 0 }).lean();
      result.rating = allRatings ? allRatings : null;
    }else{
      result.rating = null
    }

    return {
      status: 1,
      message: "View Success",
      response: result,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getDashboardData = async (service, data) => {
  try {
    if (!data.sortType || data.sortType == "")
      return { status: 0, message: "Sort type is required" };

    if (data.sortType == "4") {
      if (!data.startDate || data.startDate == "")
        return { status: 0, message: "Start date is required" };
      if (!data.endDate || data.endDate == "")
        return { status: 0, message: "End date is required" };
    }

    //   var totalProductAdded = 0;
    var totalOrders = 0;
    var newOrders = 0;
    var ongoingOrders = 0;
    var completedOrders = 0;
    var totalRevenue = 0;
    var notificationCount = 0;

    //   var commission = await CommissionModel.findOne({}, { commission_percent: 1 }).lean();

    // ALL DATA
    if (data.sortType == "0") {
      // totalProductAdded = await ProductCatModel.countDocuments({ seller: mongoose.Types.ObjectId(seller._id) }).lean();

      // let hostOrders = await HostServiceBookingModel.countDocuments({ "service": service._id, booking_status: { $ne: 0 } }).lean();
      // let userOrders = await UserServiceBookingModel.countDocuments({ "service": service._id, booking_status: { $ne: 0 } }).lean();
      // totalOrders = (hostOrders + userOrders);

      let hostNewOrders = await HostServiceBookingModel.countDocuments({
        service: service._id,
        booking_status: 1,
      }).lean();
      let userNewOrders = await UserServiceBookingModel.countDocuments({
        service: service._id,
        booking_status: 1,
      }).lean();
      newOrders = hostNewOrders + userNewOrders;

      let hostCompletedOrders = await HostServiceBookingModel.countDocuments({
        service: service._id,
        $or: [
          { booking_status: 2 },
          { booking_status: 5 },
          { booking_status: 6 },
        ],
      }).lean();
      let userCompletedOrders = await UserServiceBookingModel.countDocuments({
        service: service._id,
        $or: [
          { booking_status: 2 },
          { booking_status: 5 },
          { booking_status: 6 },
        ],
      }).lean();
      completedOrders = hostCompletedOrders + userCompletedOrders;

      let hostOngoingOrders = await HostServiceBookingModel.countDocuments({
        service: service._id,
        booking_status: { $in: [3, 4] },
      }).lean();
      let userOngoingOrders = await UserServiceBookingModel.countDocuments({
        service: service._id,
        booking_status: { $in: [3, 4] },
      }).lean();
      ongoingOrders = hostOngoingOrders + userOngoingOrders;

      totalOrders = newOrders + completedOrders + ongoingOrders;

      notification = await NotificationModel.countDocuments({
        "uniqe_id.provider_id": service._id,
        is_read: 0,
      }).lean();
      notificationCount = notification;

      // let hostOrdersPrice = await HostServiceBookingModel.find({ "service": service._id, booking_status: 6 }, { price: 1 }).lean();
      // let userOrdersPrice = await UserServiceBookingModel.find({ "service": service._id, booking_status: 6 }, { price: 1 }).lean();

      // let hostAmountAfterCommission = 0;
      // let userAmountAfterCommission = 0;
      // if (hostOrdersPrice.length > 0) {
      //   let sum = hostOrdersPrice.reduce((accumulator, object) => {
      //     return accumulator + object.price;
      //   }, 0);
      //   hostAmountAfterCommission = (sum - ((sum * commission.commission_percent) / 100));
      // }
      // if (userOrdersPrice.length > 0) {
      //   let sum = userOrdersPrice.reduce((accumulator, object) => {
      //     return accumulator + object.price;
      //   }, 0);
      //   userAmountAfterCommission = (sum - ((sum * commission.commission_percent) / 100));
      // }
      // totalRevenue = (hostAmountAfterCommission + userAmountAfterCommission).toFixed(2);
    }
    totalRevenue = 4346;

    let dataToSend = {
      total_no_bookings: totalOrders,
      new_orders: newOrders,
      ongoing_orders: ongoingOrders,
      completed_orders: completedOrders,
      total_revenue: totalRevenue,
      notificationCount: notificationCount,
    };
    if (!dataToSend) {
      return {
        status: 0,
        message: "Past Service Provider list not found",
      };
    } else {
      return {
        status: 1,
        message: "Dashboard details fectched successfully",
        response: dataToSend,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getNotificationList = async (service) => {
  try {
    // let notificationsupdate = await NotificationModel.updateMany(
    //   // { "uniqe_id.provider_id": mongoose.Types.ObjectId(service._id) },
    //   {},
    //   {is_read: 1 },
    //   {new:true}
    // )

    let updateNotification = await NotificationModel.updateMany(
      { "uniqe_id.provider_id": service._id, is_read: 0 },
      { $set: { is_read: 1 } },
      { new: true }
    ).lean();

    let notifications = await NotificationModel.find(
      { "uniqe_id.provider_id": mongoose.Types.ObjectId(service._id) },
      { uniqe_id: 0 },
    )
      .sort({ created_at: -1 })
      .lean();

      let unreadNotifications = await NotificationModel.countDocuments(
        { "uniqe_id.provider_id": mongoose.Types.ObjectId(service._id), is_read: 0
      }).lean();

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

exports.updateServiceOrderStatus = async (service, data) => {
  try {
    let modified_at = new Date().getTime();
    let result = await HostServiceBookingModel.findByIdAndUpdate(
      { _id: data._id },
      {
        $set: { booking_status: Number(data.status), modified_at: modified_at },
      },
      { new: true }
    ).lean();

    if (!result) {
      result = await UserServiceBookingModel.findByIdAndUpdate(
        { _id: data._id },
        {
          $set: {
            booking_status: Number(data.status),
            modified_at: modified_at,
          },
        },
        { new: true }
      ).lean();
    }

    if (!result) {
      return {
        status: 0,
        message: "Something went Wrong",
      };
    } else {
      let userId = result.user ? result.user : result.host;
      let utilStatus = utils.getServiceOrderStatus(Number(data.status));
      /* Code for notification start */
      let title = "Service order status updated";
      let Notificationbody =
        "Status for orderId " +
        result.booking_id +
        " has been updated. Status:- " +
        utilStatus;
      let device_token = "";
      let device_type = "";
      if (result.user) {
        let user = await UserModel.findOne(
          { _id: mongoose.Types.ObjectId(result.user) },
          { device_type: 1, device_token: 1 }
        ).lean();
        device_token = user.device_token;
        device_type = user.device_type;
      } else {
        let host = await HostModel.findOne(
          { _id: mongoose.Types.ObjectId(result.host) },
          { device_type: 1, device_token: 1 }
        ).lean();
        device_token = host.device_token;
        device_type = host.device_type;
      }
      let notification = {
        uniqe_id: {
          user_id: userId,
          host_id: userId,
        },
        title: title,
        body: Notificationbody,
        order_id: {
          user_service: data._id,
          host_service: data._id,
        },
        notification_type: Number(data.status) + 7,
        type: result.user ? 1 : 2,
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
      if (device_token) {
        utils.sendPushNotification(device_token, device_type, payload, notify);
      }
      /* Code for notification end */

      return {
        status: 1,
        message: "Status updated successfully",
        response: result,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.cancelService = async (service, data) => {
  try {
    if (!service || service._id == "")
      return {
        status: 0,
        message: "Login first to cancle order",
      };

    if (!data || data._id == "") {
      return {
        status: 0,
        message: "Order id is required",
      };
    }

    let orderDetails = await HostServiceBookingModel.findOne({
      _id: data._id,
    }).lean();
    if (!orderDetails) {
      let userorderDetails = await UserServiceBookingModel.findOne({
        _id: data._id,
      }).lean();
      if (!userorderDetails) {
        return {
          status: 0,
          message: "Order not found",
        };
      }
    }

    let orderUpdate = await HostServiceBookingModel.findOneAndUpdate(
      { _id: data._id },
      {
        $set: {
          booking_status: 6,
          cancel_reason: data.cancel_reason,
          modified_at: new Date().getTime(),
        },
      },
      { new: true }
    ).lean();
    if (!orderUpdate) {
      orderUpdate = await UserServiceBookingModel.findOneAndUpdate(
        { _id: data._id },
        {
          $set: {
            booking_status: 6,
            cancel_reason: data.cancel_reason,
            modified_at: new Date().getTime(),
          },
        },
        { new: true }
      ).lean();
    }

    if (!orderUpdate) {
      return {
        status: 0,
        message: "Unable to update cancle order",
      };
    } else {
      let userId = orderUpdate.user ? orderUpdate.user : orderUpdate.host;
      /* Code for notification start */
      let title = "Service order cancelled";
      let Notificationbody =
        "Service for orderId " + orderUpdate.booking_id + " has been cancelled";
      let device_token = "";
      let device_type = "";
      if (orderUpdate.user) {
        let user = await UserModel.findOne(
          { _id: mongoose.Types.ObjectId(orderUpdate.user) },
          { device_type: 1, device_token: 1 }
        ).lean();
        device_token = user.device_token;
        device_type = user.device_type;
      } else {
        let host = await HostModel.findOne(
          { _id: mongoose.Types.ObjectId(orderUpdate.host) },
          { device_type: 1, device_token: 1 }
        ).lean();
        device_token = host.device_token;
        device_type = host.device_type;
      }
      let notification = {
        uniqe_id: {
          user_id: userId,
          host_id: userId,
        },
        title: title,
        body: Notificationbody,
        order_id: {
          user_service: data._id,
          host_service: data._id,
        },
        notification_type: 13,
        type: orderUpdate.user ? 1 : 2,
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
      if (device_token) {
        utils.sendPushNotification(device_token, device_type, payload, notify);
      }
      /* Code for notification end */
      return {
        status: 1,
        message: "Order Cancel Successfully",
        response: orderUpdate,
      };
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.readAllNotification = async (service) => {
  try {
    if (!service || service._id == "")
      return {
        status: 0,
        message: "Login first to read Notification",
      };

    let updateNotification = await NotificationModel.updateMany(
      { "uniqe_id.provider_id": service._id, is_read: 0 },
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

exports.paymentList = async (service) => {
  try {

    let total_revenue = '0'
    let pending_payments= '0'

    let hostPayment = await HostServiceBookingModel.find({
      service: service._id,
      payment_status: 1,
    })
    .populate('host', "first_name last_name")
    .lean();

    let userPayment = await UserServiceBookingModel.find({
      service: service._id,
      payment_status: 1,
    })
    .populate('user', "full_name")
    .lean();

    let result = hostPayment.concat(userPayment).sort(
      function (a, b) {
        return b.created_at - a.created_at;
      },
      { created_at: -1 }
    );

     total_revenue = "2184"
     pending_payments = "257"

    if (!result) {
      return {
        status: 0,
        message: "No pyament list found",
      };
    } else {
      return {
        status: 1,
        message: "Payment List fetch successfully",
        response: result,total_revenue,pending_payments,
        count : result.length
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.filterPaymentList = async(service, data)=>{
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

    let hostPayment = await HostServiceBookingModel.find({
      service: service._id,
      payment_status: 1,
    })
    .populate('host', "first_name last_name")
    .lean();

    let userPayment = await UserServiceBookingModel.find({
      service: service._id,
      payment_status: 1,
    })
    .populate('user', "full_name")
    .lean();

    let result = hostPayment.concat(userPayment).sort(
      function (a, b) {
        return b.created_at - a.created_at;
      },
      { created_at: -1 }
    );
     total_revenue = "1531"
     pending_payments = "325"

    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    let todayStart = Date.parse(start);
    let weekStart = todayStart - 7 * 86400000;
    let monthStart = todayStart - 30 * 86400000;

    if (data.sortType == 0) {
      result = _.filter(result, (item) => item.created_at > todayStart);
    } else if (data.sortType == 1) {
      result = _.filter(result, (item) => item.created_at > weekStart);
    } else if (data.sortType == 2) {
      result = _.filter(result, (item) => item.created_at > monthStart);
    } else if (data.sortType == 3) {
      result = _.filter(result, (item) => ((item.created_at >= data.startDate) && (item.created_at <= data.endDate)));
    } else {
      result = result;
    }

    if (result) {
      return {
        status: 1,
        response: result,total_revenue,pending_payments,
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

exports.getServiceOrderReportList = async(service, data)=>{
  try {
    console.log(data);
    // console.log(service);
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
    let workbook = new ExcelJS.Workbook();
    let ongoingSheet;
    let cancelSheet;
    let completeSheet;
    let allOrdersSheet;

    if(data.ongoing == "1"){
      ongoingSheet = workbook.addWorksheet('Ongoing Orders Sheet');
      let hostPayment = await HostServiceBookingModel.find({
        service_provider: service._id,
        payment_status: 1,
        $or: [{ booking_status: 1 },{ booking_status: 3 },{ booking_status: 4 }]
      })
      .populate('host', "first_name last_name country_code mobile_number email profile_pic")
      .populate('service_category','category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description",
      })
      .populate('address')
      .sort({created_at : -1}).lean();
  
      let userPayment = await UserServiceBookingModel.find({
        service_provider: service._id,
        payment_status: 1,
        $or: [{ booking_status: 1 },{ booking_status: 3 },{ booking_status: 4 }]
      })
      .populate('user', "full_name country_code mobile_number email profile_pic")
      .populate('service_category','category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description"
      })
      .populate('address')
      .sort({created_at : -1}).lean();
  
      ongoingOrders = hostPayment.concat(userPayment).sort(
        function (a, b) {
          return b.created_at - a.created_at;
        },
        { created_at: -1 }
      );
    }
    if(data.cancelled == "1"){
      cancelSheet = workbook.addWorksheet('Cancelled Orders Sheet');
      let hostPayment = await HostServiceBookingModel.find({
        service_provider: service._id,
        payment_status: 1,
        booking_status: 6
      })
      .populate('host', "first_name last_name country_code mobile_number email profile_pic")
      .populate('service_category','category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description",
      })
      .populate('address')
      .sort({created_at : -1}).lean();
  
      let userPayment = await UserServiceBookingModel.find({
        service_provider: service._id,
        payment_status: 1,
        booking_status: 6
      })
      .populate('user', "full_name country_code mobile_number email profile_pic")
      .populate('service_category','category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description"
      })
      .populate('address')
      .sort({created_at : -1}).lean();
  
      cancelledOrders = hostPayment.concat(userPayment).sort(
        function (a, b) {
          return b.created_at - a.created_at;
        },
        { created_at: -1 }
      );
    }
    if(data.completed == "1"){
      completeSheet = workbook.addWorksheet('Complete Orders Sheet');
      let hostPayment = await HostServiceBookingModel.find({
        service_provider: service._id,
        payment_status: 1,
        booking_status: 5
      })
      .populate('host', "first_name last_name country_code mobile_number email profile_pic")
      .populate('service_category','category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description",
      })
      .populate('address')
      .sort({created_at : -1}).lean();
  
      let userPayment = await UserServiceBookingModel.find({
        service_provider: service._id,
        payment_status: 1,
        booking_status: 5
      })
      .populate('user', "full_name country_code mobile_number email profile_pic")
      .populate('service_category','category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description"
      })
      .populate('address')
      .sort({created_at : -1}).lean();
  
      completedOrders = hostPayment.concat(userPayment).sort(
        function (a, b) {
          return b.created_at - a.created_at;
        },
        { created_at: -1 }
      );
    }
    if(data.all == "1"){
      allOrdersSheet = workbook.addWorksheet('All Orders Sheet');
      let hostPayment = await HostServiceBookingModel.find({
        service_provider: service._id,
        payment_status: 1,
      })
      .populate('host', "first_name last_name country_code mobile_number email profile_pic")
      .populate('service_category','category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description",
      })
      .populate('address')
      .sort({created_at : -1}).lean();

      let userPayment = await UserServiceBookingModel.find({
        service_provider: service._id,
        payment_status: 1,
      })
      .populate('user', "full_name country_code mobile_number email profile_pic")
      .populate('service_category','category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description"
      })
      .populate('address')
      .sort({created_at : -1}).lean();

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
      { header: 'Booking Date', key: 'booking_date', width: 15 },
      { header: 'Payment Status', key: 'payment_status', width: 15 },
      { header: 'Payment Option', key: 'payment_option', width: 15 },

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

    if(data.ongoing == "1"){
      ongoingSheet.columns = columns;
      for (let index = 0; index < dataToSend.ongoingOrderList.length; index++) {
        let setDataInExcel = {};
        setDataInExcel.srNo = index+1;
        setDataInExcel.booking_id = dataToSend.ongoingOrderList[index]?.booking_id;
        setDataInExcel.user_name = getUserName(index,'ongoingOrderList');
        setDataInExcel.mobile_number = getContactNumber(index,'ongoingOrderList');
        setDataInExcel.house_no = (dataToSend.ongoingOrderList[index]?.address?.house_no)?dataToSend.ongoingOrderList[index]?.address.house_no:'';
        setDataInExcel.street = (dataToSend.ongoingOrderList[index]?.address?.street)?dataToSend.ongoingOrderList[index]?.address.street:'';
        setDataInExcel.locality = (dataToSend.ongoingOrderList[index]?.address?.locality)?dataToSend.ongoingOrderList[index]?.address.locality:'';
        setDataInExcel.city = (dataToSend.ongoingOrderList[index]?.address?.city)?dataToSend.ongoingOrderList[index]?.address.city:'';
        setDataInExcel.state = (dataToSend.ongoingOrderList[index]?.address?.state)?dataToSend.ongoingOrderList[index]?.address.state:'';
        setDataInExcel.country = (dataToSend.ongoingOrderList[index]?.address?.country)?dataToSend.ongoingOrderList[index]?.address.country:'';
        setDataInExcel.currency = (dataToSend.ongoingOrderList[index]?.currency) ? dataToSend.ongoingOrderList[index]?.currency:''; 
        setDataInExcel.total_amount = (dataToSend.ongoingOrderList[index]?.total_amount) ? dataToSend.ongoingOrderList[index]?.total_amount:'';
        setDataInExcel.booking_date = (dataToSend.ongoingOrderList[index]?.booking_date) ? dataToSend.ongoingOrderList[index]?.booking_date:'';
        setDataInExcel.payment_status = (dataToSend.ongoingOrderList[index]?.payment_status) ? dataToSend.ongoingOrderList[index]?.payment_status:'';
        setDataInExcel.payment_option = (dataToSend.ongoingOrderList[index]?.payment_option) ? dataToSend.ongoingOrderList[index]?.payment_option:'';
        ongoingSheet.addRow(setDataInExcel);
      }
    }
    if(data.cancelled == "1"){
      cancelSheet.columns = columns;
      for (let index = 0; index < dataToSend.cancelledOrderList.length; index++) {
        let setDataInExcel = {};
        setDataInExcel.srNo = index+1;
        setDataInExcel.booking_id = dataToSend.cancelledOrderList[index]?.booking_id;
        setDataInExcel.user_name = getUserName(index,'cancelledOrderList');
        setDataInExcel.mobile_number = getContactNumber(index,'cancelledOrderList');
        setDataInExcel.house_no = (dataToSend.cancelledOrderList[index]?.address?.house_no)?dataToSend.cancelledOrderList[index]?.address.house_no:'';
        setDataInExcel.street = (dataToSend.cancelledOrderList[index]?.address?.street)?dataToSend.cancelledOrderList[index]?.address.street:'';
        setDataInExcel.locality = (dataToSend.cancelledOrderList[index]?.address?.locality)?dataToSend.cancelledOrderList[index]?.address.locality:'';
        setDataInExcel.city = (dataToSend.cancelledOrderList[index]?.address?.city)?dataToSend.cancelledOrderList[index]?.address.city:'';
        setDataInExcel.state = (dataToSend.cancelledOrderList[index]?.address?.state)?dataToSend.cancelledOrderList[index]?.address.state:'';
        setDataInExcel.country = (dataToSend.cancelledOrderList[index]?.address?.country)?dataToSend.cancelledOrderList[index]?.address.country:'';
        setDataInExcel.currency = (dataToSend.cancelledOrderList[index]?.currency) ? dataToSend.cancelledOrderList[index]?.currency:''; 
        setDataInExcel.total_amount = (dataToSend.cancelledOrderList[index]?.total_amount) ? dataToSend.cancelledOrderList[index]?.total_amount:'';
        setDataInExcel.booking_date = (dataToSend.cancelledOrderList[index]?.booking_date) ? dataToSend.cancelledOrderList[index]?.booking_date:'';
        setDataInExcel.payment_status = (dataToSend.cancelledOrderList[index]?.payment_status) ? dataToSend.cancelledOrderList[index]?.payment_status:'';
        setDataInExcel.payment_option = (dataToSend.cancelledOrderList[index]?.payment_option) ? dataToSend.cancelledOrderList[index]?.payment_option:'';
        cancelSheet.addRow(setDataInExcel);
      }
    }
    if(data.completed == "1"){
      completeSheet.columns = columns;
      for (let index = 0; index < dataToSend.completedOrderList.length; index++) {
        let setDataInExcel = {};
        setDataInExcel.srNo = index+1;
        setDataInExcel.booking_id = dataToSend.completedOrderList[index]?.booking_id;
        setDataInExcel.user_name = getUserName(index,'completedOrderList');
        setDataInExcel.mobile_number = getContactNumber(index,'completedOrderList');
        setDataInExcel.house_no = (dataToSend.completedOrderList[index]?.address?.house_no)?dataToSend.completedOrderList[index]?.address.house_no:'';
        setDataInExcel.street = (dataToSend.completedOrderList[index]?.address?.street)?dataToSend.completedOrderList[index]?.address.street:'';
        setDataInExcel.locality = (dataToSend.completedOrderList[index]?.address?.locality)?dataToSend.completedOrderList[index]?.address.locality:'';
        setDataInExcel.city = (dataToSend.completedOrderList[index]?.address?.city)?dataToSend.completedOrderList[index]?.address.city:'';
        setDataInExcel.state = (dataToSend.completedOrderList[index]?.address?.state)?dataToSend.completedOrderList[index]?.address.state:'';
        setDataInExcel.country = (dataToSend.completedOrderList[index]?.address?.country)?dataToSend.completedOrderList[index]?.address.country:'';
        setDataInExcel.currency = (dataToSend.completedOrderList[index]?.currency) ? dataToSend.completedOrderList[index]?.currency:''; 
        setDataInExcel.total_amount = (dataToSend.completedOrderList[index]?.total_amount) ? dataToSend.completedOrderList[index]?.total_amount:'';
        setDataInExcel.booking_date = (dataToSend.completedOrderList[index]?.booking_date) ? dataToSend.completedOrderList[index]?.booking_date:'';
        setDataInExcel.payment_status = (dataToSend.completedOrderList[index]?.payment_status) ? dataToSend.completedOrderList[index]?.payment_status:'';
        setDataInExcel.payment_option = (dataToSend.completedOrderList[index]?.payment_option) ? dataToSend.completedOrderList[index]?.payment_option:'';
        completeSheet.addRow(setDataInExcel);
      }
    }
    if(data.all == "1"){
      allOrdersSheet.columns = columns
      for (let index = 0; index < dataToSend.allOrderList.length; index++) {
        let setDataInExcel = {};
        setDataInExcel.srNo = index+1;
        setDataInExcel.booking_id = dataToSend.allOrderList[index]?.booking_id;
        setDataInExcel.user_name = getUserName(index,'allOrderList');
        setDataInExcel.mobile_number = getContactNumber(index,'allOrderList');
        setDataInExcel.house_no = (dataToSend.allOrderList[index]?.address?.house_no)?dataToSend.allOrderList[index]?.address.house_no:'';
        setDataInExcel.street = (dataToSend.allOrderList[index]?.address?.street)?dataToSend.allOrderList[index]?.address.street:'';
        setDataInExcel.locality = (dataToSend.allOrderList[index]?.address?.locality)?dataToSend.allOrderList[index]?.address.locality:'';
        setDataInExcel.city = (dataToSend.allOrderList[index]?.address?.city)?dataToSend.allOrderList[index]?.address.city:'';
        setDataInExcel.state = (dataToSend.allOrderList[index]?.address?.state)?dataToSend.allOrderList[index]?.address.state:'';
        setDataInExcel.country = (dataToSend.allOrderList[index]?.address?.country)?dataToSend.allOrderList[index]?.address.country:'';
        setDataInExcel.currency = (dataToSend.allOrderList[index]?.currency) ? dataToSend.allOrderList[index]?.currency:''; 
        setDataInExcel.total_amount = (dataToSend.allOrderList[index]?.total_amount) ? dataToSend.allOrderList[index]?.total_amount:'';
        setDataInExcel.booking_date = (dataToSend.allOrderList[index]?.booking_date) ? dataToSend.allOrderList[index]?.booking_date:'';
        setDataInExcel.payment_status = (dataToSend.allOrderList[index]?.payment_status) ? dataToSend.allOrderList[index]?.payment_status:'';
        setDataInExcel.payment_option = (dataToSend.allOrderList[index]?.payment_option) ? dataToSend.allOrderList[index]?.payment_option:'';
        allOrdersSheet.addRow(setDataInExcel);
      }
    }

    // sheet.addRow({ id: 1, name: 'John Doe', dob: new Date(1970, 1, 1) });
    // sheet.addRow({ id: 1, name: 'Akash', dob: new Date(1970, 1, 1) });
    // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    // workbook.xlsx.write(res)
    //     .then(function (data) {
    //         res.end();
    //         console.log('File write done........');
    //     })
    // workbook.xlsx.writeFile('order.xlsx').then(()=>{
    //   return {
    //     status: 1,
    //     response: dataToSend,
    //     // data : workbook,
    //     message: "Order list fetched successfully",
    //   }
    //   }).catch(err=>{
    //     return {
    //       status: 0,
    //       // data : workbook,
    //       message: "Excel Generate Failed",
    //     } 
    //   })
    return new Promise((resolve,reject)=>{
      workbook.xlsx.writeBuffer({useSharedStrings:true,filename:`${service.first_name}.xlxs`}).then(res=>{
        console.log(res);
        // resolve({
        //     status: 1,
        //     response: res,
        //     // data : workbook,
        //     message: "Order list fetched successfully",
        // })
        resolve(res)

      }).catch(err=>{
        reject({
          status:0,
          message:"Excel Generate Failed"
        })
      });
    })



  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getTermCondition = async () => {
  try {
    var getTerm = await ServiceSettingModel.findOne().lean();

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
      var getTerm = await ServiceSettingModel.findOne().lean();

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
      var getTerm = await ServiceSettingModel.findOne().lean();

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
      var getTerm = await ServiceSettingModel.findOne().lean();

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

exports.getCancelOrderReasonList = async (service) => {
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
      
    return { message: "Order cancel reason list fetched successfully", status: 1, response: dataToSend };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getAllAdvertisements = async () => {
  try {
    let currentDate = new Date().getTime();
    let allAds = await AdvertisementModel.find({ is_service : true, is_active: true, is_blocked : 0, $and: [{ start_date: { $lte: currentDate }},{ end_date: { $gte: currentDate }} ] }).sort({date_created : -1}).limit(5).lean();

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

exports.getServiceReport = async(service, data)=>{
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
      // ongoingSheet = workbook.addWorksheet('Ongoing Orders Sheet');
      worksheet = workbook.addWorksheet('Ongoing Orders Sheet');

      let hostPayment = await HostServiceBookingModel.find({
        service_provider: service._id,
        payment_status: 1,
        $or: [{ booking_status: 1 },{ booking_status: 3 },{ booking_status: 4 }]
      })
      .populate('host', "first_name last_name country_code mobile_number email profile_pic")
      .populate('service_category','category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description",
      })
      .populate('address')
      .sort({created_at : -1}).lean();
  
      let userPayment = await UserServiceBookingModel.find({
        service_provider: service._id,
        payment_status: 1,
        $or: [{ booking_status: 1 },{ booking_status: 3 },{ booking_status: 4 }]
      })
      .populate('user', "full_name country_code mobile_number email profile_pic")
      .populate('service_category','category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description"
      })
      .populate('address')
      .sort({created_at : -1}).lean();
  
      ongoingOrders = hostPayment.concat(userPayment).sort(
        function (a, b) {
          return b.created_at - a.created_at;
        },
        { created_at: -1 }
      );
    }else if(data.cancelled == "1"){
      worksheet = workbook.addWorksheet('Cancelled Orders Sheet');
      let hostPayment = await HostServiceBookingModel.find({
        service_provider: service._id,
        payment_status: 1,
        booking_status: 6
      })
      .populate('host', "first_name last_name country_code mobile_number email profile_pic")
      .populate('service_category','category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description",
      })
      .populate('address')
      .sort({created_at : -1}).lean();
  
      let userPayment = await UserServiceBookingModel.find({
        service_provider: service._id,
        payment_status: 1,
        booking_status: 6
      })
      .populate('user', "full_name country_code mobile_number email profile_pic")
      .populate('service_category','category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description"
      })
      .populate('address')
      .sort({created_at : -1}).lean();
  
      cancelledOrders = hostPayment.concat(userPayment).sort(
        function (a, b) {
          return b.created_at - a.created_at;
        },
        { created_at: -1 }
      );
    }else if(data.completed == "1"){
      worksheet = workbook.addWorksheet('Completed Orders Sheet');
      let hostPayment = await HostServiceBookingModel.find({
        service_provider: service._id,
        payment_status: 1,
        booking_status: 5
      })
      .populate('host', "first_name last_name country_code mobile_number email profile_pic")
      .populate('service_category','category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description",
      })
      .populate('address')
      .sort({created_at : -1}).lean();
  
      let userPayment = await UserServiceBookingModel.find({
        service_provider: service._id,
        payment_status: 1,
        booking_status: 5
      })
      .populate('user', "full_name country_code mobile_number email profile_pic")
      .populate('service_category','category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description"
      })
      .populate('address')
      .sort({created_at : -1}).lean();
  
      completedOrders = hostPayment.concat(userPayment).sort(
        function (a, b) {
          return b.created_at - a.created_at;
        },
        { created_at: -1 }
      );
    }else if(data.all == "1"){
      worksheet = workbook.addWorksheet('All Orders Sheet');

      let hostPayment = await HostServiceBookingModel.find({
        service_provider: service._id,
        payment_status: 1,
      })
      .populate('host', "first_name last_name country_code mobile_number email profile_pic")
      .populate('service_category','category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description",
      })
      .populate('address')
      .sort({created_at : -1}).lean();

      let userPayment = await UserServiceBookingModel.find({
        service_provider: service._id,
        payment_status: 1,
      })
      .populate('user', "full_name country_code mobile_number email profile_pic")
      .populate('service_category','category_name category_image')
      .populate({
        path: 'service_id', model: "serviceProviderServices", select: "service_image serviceProvider price experience  description"
      })
      .populate('address')
      .sort({created_at : -1}).lean();

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
        if(dataToSend[arrayName][index].booking_status){
           return utils.getServiceOrderStatus(Number(dataToSend[arrayName][index].booking_status))
        }else{
          return "";
        }
    }

    function getPaymentStatus(index,arrayName){
        if(dataToSend[arrayName][index].payment_status){
           return `${utils.getServicePaymentStatus(Number(dataToSend[arrayName][index].payment_status))}`
        }else{
          return "";
        }
    }

    function getConvertedDate(index,arrayName){
        if(dataToSend[arrayName][index].booking_date){
           return `${(new Date(Number(dataToSend[arrayName][index].booking_date)))}`
        }else{
          return "";
        }
    }

    if(data.ongoing == "1"){
      worksheet.columns = columns;
      for (let index = 0; index < dataToSend.ongoingOrderList.length; index++) {
        let setDataInExcel = {};
        setDataInExcel.srNo = index+1;
        setDataInExcel.booking_id = dataToSend.ongoingOrderList[index]?.booking_id;
        setDataInExcel.user_name = getUserName(index,'ongoingOrderList');
        setDataInExcel.mobile_number = getContactNumber(index,'ongoingOrderList');
        setDataInExcel.house_no = (dataToSend.ongoingOrderList[index]?.address?.house_no)?dataToSend.ongoingOrderList[index]?.address.house_no:'';
        setDataInExcel.street = (dataToSend.ongoingOrderList[index]?.address?.street)?dataToSend.ongoingOrderList[index]?.address.street:'';
        setDataInExcel.locality = (dataToSend.ongoingOrderList[index]?.address?.locality)?dataToSend.ongoingOrderList[index]?.address.locality:'';
        setDataInExcel.city = (dataToSend.ongoingOrderList[index]?.address?.city)?dataToSend.ongoingOrderList[index]?.address.city:'';
        setDataInExcel.state = (dataToSend.ongoingOrderList[index]?.address?.state)?dataToSend.ongoingOrderList[index]?.address.state:'';
        setDataInExcel.country = (dataToSend.ongoingOrderList[index]?.address?.country)?dataToSend.ongoingOrderList[index]?.address.country:'';
        setDataInExcel.currency = (dataToSend.ongoingOrderList[index]?.currency) ? dataToSend.ongoingOrderList[index]?.currency:''; 
        setDataInExcel.total_amount = (dataToSend.ongoingOrderList[index]?.total_amount) ? dataToSend.ongoingOrderList[index]?.total_amount:'';
        setDataInExcel.booking_date =  getConvertedDate(index,'ongoingOrderList');
        setDataInExcel.payment_status =  getPaymentStatus(index,'ongoingOrderList');
        setDataInExcel.payment_option = (dataToSend.ongoingOrderList[index]?.payment_option) ? dataToSend.ongoingOrderList[index]?.payment_option:'';
        setDataInExcel.booking_status =  getBookingStatus(index,'ongoingOrderList');
        worksheet.addRow(setDataInExcel);
      }
    }else if(data.cancelled == "1"){
      worksheet.columns = columns;
      for (let index = 0; index < dataToSend.cancelledOrderList.length; index++) {
        let setDataInExcel = {};
        setDataInExcel.srNo = index+1;
        setDataInExcel.booking_id = dataToSend.cancelledOrderList[index]?.booking_id;
        setDataInExcel.user_name = getUserName(index,'cancelledOrderList');
        setDataInExcel.mobile_number = getContactNumber(index,'cancelledOrderList');
        setDataInExcel.house_no = (dataToSend.cancelledOrderList[index]?.address?.house_no)?dataToSend.cancelledOrderList[index]?.address.house_no:'';
        setDataInExcel.street = (dataToSend.cancelledOrderList[index]?.address?.street)?dataToSend.cancelledOrderList[index]?.address.street:'';
        setDataInExcel.locality = (dataToSend.cancelledOrderList[index]?.address?.locality)?dataToSend.cancelledOrderList[index]?.address.locality:'';
        setDataInExcel.city = (dataToSend.cancelledOrderList[index]?.address?.city)?dataToSend.cancelledOrderList[index]?.address.city:'';
        setDataInExcel.state = (dataToSend.cancelledOrderList[index]?.address?.state)?dataToSend.cancelledOrderList[index]?.address.state:'';
        setDataInExcel.country = (dataToSend.cancelledOrderList[index]?.address?.country)?dataToSend.cancelledOrderList[index]?.address.country:'';
        setDataInExcel.currency = (dataToSend.cancelledOrderList[index]?.currency) ? dataToSend.cancelledOrderList[index]?.currency:''; 
        setDataInExcel.total_amount = (dataToSend.cancelledOrderList[index]?.total_amount) ? dataToSend.cancelledOrderList[index]?.total_amount:'';
        setDataInExcel.booking_date =  getConvertedDate(index,'cancelledOrderList');
        setDataInExcel.payment_status =  getPaymentStatus(index,'cancelledOrderList');
        setDataInExcel.payment_option = (dataToSend.cancelledOrderList[index]?.payment_option) ? dataToSend.cancelledOrderList[index]?.payment_option:'';
        setDataInExcel.booking_status =  getBookingStatus(index,'cancelledOrderList');
        worksheet.addRow(setDataInExcel);
      }
    }else if(data.completed == "1"){
      worksheet.columns = columns;
      for (let index = 0; index < dataToSend.completedOrderList.length; index++) {
        let setDataInExcel = {};
        setDataInExcel.srNo = index+1;
        setDataInExcel.booking_id = dataToSend.completedOrderList[index]?.booking_id;
        setDataInExcel.user_name = getUserName(index,'completedOrderList');
        setDataInExcel.mobile_number = getContactNumber(index,'completedOrderList');
        setDataInExcel.house_no = (dataToSend.completedOrderList[index]?.address?.house_no)?dataToSend.completedOrderList[index]?.address.house_no:'';
        setDataInExcel.street = (dataToSend.completedOrderList[index]?.address?.street)?dataToSend.completedOrderList[index]?.address.street:'';
        setDataInExcel.locality = (dataToSend.completedOrderList[index]?.address?.locality)?dataToSend.completedOrderList[index]?.address.locality:'';
        setDataInExcel.city = (dataToSend.completedOrderList[index]?.address?.city)?dataToSend.completedOrderList[index]?.address.city:'';
        setDataInExcel.state = (dataToSend.completedOrderList[index]?.address?.state)?dataToSend.completedOrderList[index]?.address.state:'';
        setDataInExcel.country = (dataToSend.completedOrderList[index]?.address?.country)?dataToSend.completedOrderList[index]?.address.country:'';
        setDataInExcel.currency = (dataToSend.completedOrderList[index]?.currency) ? dataToSend.completedOrderList[index]?.currency:''; 
        setDataInExcel.total_amount = (dataToSend.completedOrderList[index]?.total_amount) ? dataToSend.completedOrderList[index]?.total_amount:'';
        setDataInExcel.booking_date =  getConvertedDate(index,'completedOrderList');
        setDataInExcel.payment_status =  getPaymentStatus(index,'completedOrderList');
        setDataInExcel.payment_option = (dataToSend.completedOrderList[index]?.payment_option) ? dataToSend.completedOrderList[index]?.payment_option:'';
        setDataInExcel.booking_status =  getBookingStatus(index,'completedOrderList');
        worksheet.addRow(setDataInExcel);
      }
    }else if(data.all == "1"){
      worksheet.columns = columns;
      for (let index = 0; index < dataToSend.allOrderList.length; index++) {
        let setDataInExcel = {};
        setDataInExcel.srNo = index+1;
        setDataInExcel.booking_id = dataToSend.allOrderList[index]?.booking_id;
        setDataInExcel.user_name = getUserName(index,'allOrderList');
        setDataInExcel.mobile_number = getContactNumber(index,'allOrderList');
        setDataInExcel.house_no = (dataToSend.allOrderList[index]?.address?.house_no)?dataToSend.allOrderList[index]?.address.house_no:'';
        setDataInExcel.street = (dataToSend.allOrderList[index]?.address?.street)?dataToSend.allOrderList[index]?.address.street:'';
        setDataInExcel.locality = (dataToSend.allOrderList[index]?.address?.locality)?dataToSend.allOrderList[index]?.address.locality:'';
        setDataInExcel.city = (dataToSend.allOrderList[index]?.address?.city)?dataToSend.allOrderList[index]?.address.city:'';
        setDataInExcel.state = (dataToSend.allOrderList[index]?.address?.state)?dataToSend.allOrderList[index]?.address.state:'';
        setDataInExcel.country = (dataToSend.allOrderList[index]?.address?.country)?dataToSend.allOrderList[index]?.address.country:'';
        setDataInExcel.currency = (dataToSend.allOrderList[index]?.currency) ? dataToSend.allOrderList[index]?.currency:''; 
        setDataInExcel.total_amount = (dataToSend.allOrderList[index]?.total_amount) ? dataToSend.allOrderList[index]?.total_amount:'';
        setDataInExcel.booking_date =  getConvertedDate(index,'allOrderList');
        setDataInExcel.payment_status =  getPaymentStatus(index,'allOrderList');
        setDataInExcel.payment_option = (dataToSend.allOrderList[index]?.payment_option) ? dataToSend.allOrderList[index]?.payment_option:'';
        setDataInExcel.booking_status =  getBookingStatus(index,'allOrderList');
        worksheet.addRow(setDataInExcel);
      }
    }

    // for uploading file to local server
    // excelFile = await workbook.xlsx.writeFile('./upload/' + service._id + '_Analytics.xlsx');
    // let url = config.HOSTBACK + '/upload/' + service._id + '_Analytics.xlsx';
 
    // for uploading file to aws server
    let randomNumber = await utils.randomReportStringGenerator();
    const buffer = await workbook.xlsx.writeBuffer();
    const params = {
      Key: service._id+"_"+ randomNumber +"_Analytics.xlsx",
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
  
    var deleteUser = await ServiceProviderModel.findOneAndDelete({  _id: mongoose.Types.ObjectId(user._id) }).lean();
        
    return {  message: "Account deleted successfully", status: 1  };

  } catch (err) {
    throw new Error(err.message);
  }
};

exports.updateServiceData = async (service, data) => {
  try {
    let { unique_id, evidence_id } = data;

    let result = await ServiceProviderModel.findOneAndUpdate({ _id: service._id },{ $set: { unique_id: unique_id, evidence_id: evidence_id } },{ new: true }).lean();
    if(!result){
      return { status: 0, message: "Unable to update data" };
    }
    return {  message: "Data updated successfully", status: 1 };

  } catch (err) {
    throw new Error(err.message);
  }
};