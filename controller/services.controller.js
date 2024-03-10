const serviceProviderService = require("../services/serviceProviderService");

exports.uploadFile = async (req, res) => {
  try {
    let serviceProviderData = await serviceProviderService.uploadFile(req);
    if (serviceProviderData.status == -1) {
      throw new Error(serviceProviderData.message);
    } else if (serviceProviderData.status == 0) {
      return res.status(403).json({ message: serviceProviderData.message });
    } else {
      res
        .status(200)
        .json({
          response: serviceProviderData.data,
          message: serviceProviderData.message,
        });
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

exports.registerServiceProvider = async (req, res) => {
  try {
    // {
    //     "country_code":"+91",
    //     "mobile_number":"1212121212",
    //     "first_name":"Sparsh",
    //     "last_name":"Katiyar",
    //     "device_token":"abcd",
    //     "device_type":"1"
    // }

    let serviceProviderRegisterData =
      await serviceProviderService.registerServiceProvider(req.body);
    if (serviceProviderRegisterData.status == 1) {
      res.status(200).json({
        message: serviceProviderRegisterData.message,
        reponse: serviceProviderRegisterData.response,
      });
    } else if (serviceProviderRegisterData.status == 0) {
      res.status(400).json({
        message: serviceProviderRegisterData.message,
      });
    } else {
      res.status(400).json({ message: "Something Went Wrong" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    let serviceProviderRegisterData = await serviceProviderService.VerifyOtp(
      req.body,
      req.servicesData
    );
    if (serviceProviderRegisterData.status == 1) {
      res.status(200).json({
        message: serviceProviderRegisterData.message,
        reponse: serviceProviderRegisterData.response,
      });
    } else if (serviceProviderRegisterData.status == 0) {
      res.status(400).json({
        message: serviceProviderRegisterData.message,
      });
    } else {
      res.status(400).json({ message: "Something Went Wrong" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    let serviceProviderRegisterData = await serviceProviderService.resendOtp(
      req.servicesData
    );
    if (serviceProviderRegisterData.status == 1) {
      res.status(200).json({
        message: serviceProviderRegisterData.message,
        reponse: serviceProviderRegisterData.response,
      });
    } else if (serviceProviderRegisterData.status == 0) {
      res.status(400).json({
        message: serviceProviderRegisterData.message,
      });
    } else {
      res.status(400).json({ message: "Something Went Wrong" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeProfile = async (req, res) => {
  try {
    // {
    // email
    // store_name
    // address1
    // address2
    // address3
    // idProof
    // shopLicense
    // }

    let serviceProviderRegisterData =
      await serviceProviderService.completeProfile(req.body, req.servicesData);
    if (serviceProviderRegisterData.status == 1) {
      res.status(200).json({
        message: serviceProviderRegisterData.message,
        reponse: serviceProviderRegisterData.response,
      });
    } else if (serviceProviderRegisterData.status == 0) {
      res.status(400).json({
        message: serviceProviderRegisterData.message,
      });
    } else {
      res.status(400).json({ message: "Something Went Wrong" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bankSecurityAdd = async (req, res) => {
  try {
    // {
    // accountHolderName
    // accountNumber
    // bankCard
    // password
    // }

    let serviceProviderRegisterData =
      await serviceProviderService.bankSecurityAdd(req.body, req.servicesData);
    if (serviceProviderRegisterData.status == 1) {
      res.status(200).json({
        message: serviceProviderRegisterData.message,
        reponse: serviceProviderRegisterData.response,
      });
    } else if (serviceProviderRegisterData.status == 0) {
      res.status(400).json({
        message: serviceProviderRegisterData.message,
      });
    } else {
      res.status(400).json({ message: "Something Went Wrong" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    // {
    // country_code
    // mobile_number
    // }

    let serviceProviderRegisterData =
      await serviceProviderService.forgotPassword(req.body);
    if (serviceProviderRegisterData.status == 1) {
      res.status(200).json({
        message: serviceProviderRegisterData.message,
        response: serviceProviderRegisterData.data,
      });
    } else if (serviceProviderRegisterData.status == 0) {
      res.status(400).json({
        message: serviceProviderRegisterData.message,
      });
    } else {
      res.status(400).json({ message: "Something Went Wrong" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    // {
    // newPassword
    // confirmPassword
    // }

    let serviceProviderRegisterData =
      await serviceProviderService.resetPassword(req.body, req.servicesData);
    if (serviceProviderRegisterData.status == 1) {
      res.status(200).json({
        message: serviceProviderRegisterData.message,
        reponse: serviceProviderRegisterData.response,
      });
    } else if (serviceProviderRegisterData.status == 0) {
      res.status(400).json({
        message: serviceProviderRegisterData.message,
      });
    } else {
      res.status(400).json({ message: "Something Went Wrong" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    // {
    // mobile_number
    // country_code
    // password
    // }

    let serviceProviderRegisterData = await serviceProviderService.login(
      req.body
    );
    if (serviceProviderRegisterData.status == 1) {
      res.status(200).json({
        message: serviceProviderRegisterData.message,
        reponse: serviceProviderRegisterData.data,
      });
    } else if (serviceProviderRegisterData.status == 0) {
      res.status(400).json({
        message: serviceProviderRegisterData.message,
      });
    } else {
      res.status(400).json({ message: "Something Went Wrong" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    let serviceProviderRegisterData = await serviceProviderService.logout(
      req.servicesData
    );
    if (serviceProviderRegisterData.status == -1) {
      throw new Error(serviceProviderRegisterData.message);
    }
    if (serviceProviderRegisterData.status == 0) {
      return res
        .status(403)
        .json({ message: serviceProviderRegisterData.message });
    }
    res
      .status(200)
      .json({
        message: serviceProviderRegisterData.message,
        response: serviceProviderRegisterData.data,
      });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.editProfile = async (req, res) => {
  try {
    let serviceProviderRegisterData = await serviceProviderService.editProfile(
      req.servicesData,
      req.body
    );
    if (serviceProviderRegisterData.status == -1) {
      throw new Error(serviceProviderRegisterData.message);
    }
    if (serviceProviderRegisterData.status == 0) {
      return res
        .status(403)
        .json({ message: serviceProviderRegisterData.message });
    }
    res
      .status(200)
      .json({
        message: serviceProviderRegisterData.message,
        response: serviceProviderRegisterData.data,
      });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.editAddress = async (req, res) => {
  try {
    let serviceProviderRegisterData = await serviceProviderService.editAddress(
      req.servicesData,
      req.body
    );
    if (serviceProviderRegisterData.status == -1) {
      throw new Error(serviceProviderRegisterData.message);
    }
    if (serviceProviderRegisterData.status == 0) {
      return res
        .status(403)
        .json({ message: serviceProviderRegisterData.message });
    }
    res
      .status(200)
      .json({
        message: serviceProviderRegisterData.message,
        response: serviceProviderRegisterData.data,
      });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    let serviceProviderRegisterData =
      await serviceProviderService.changePassword(req.servicesData, req.body);
    if (serviceProviderRegisterData.status == -1) {
      throw new Error(serviceProviderRegisterData.message);
    } else if (serviceProviderRegisterData.status == 0) {
      return res
        .status(403)
        .json({ message: serviceProviderRegisterData.message });
    } else {
      res
        .status(200)
        .json({
          response: serviceProviderRegisterData.data,
          message: serviceProviderRegisterData.message,
        });
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    let data = await serviceProviderService.getProfile(
      req.servicesData,
      req.body
    );
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
    }
    res.status(200).json({
      message: data.message,
      getProfile: data.response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addServices = async (req, res) => {
  try {
    // console.log(req.servicesData);
    let addServices = await serviceProviderService.addServices(
      req.servicesData,
      req.body
    );
    if (addServices.status == -1) {
      throw new Error(addServices.message);
    }
    if (addServices.status == 0) {
      return res.status(403).json({ message: addServices.message });
    }
    res.status(200).json({
      message: addServices.message,
      response: addServices.response,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getServicesList = async (req, res) => {
  try {
    // console.log(req.servicesData);
    let getServicesList = await serviceProviderService.getServicesList(
      req.servicesData
    );
    if (getServicesList.status == -1) {
      throw new Error(getServicesList.message);
    }
    if (getServicesList.status == 0) {
      return res.status(403).json({ message: getServicesList.message });
    }
    res.status(200).json({
      message: getServicesList.message,
      response: getServicesList.response,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getServicesCategory = async (req, res) => {
  try {
    // console.log(req.servicesData);
    let getServicesCategory = await serviceProviderService.getServicesCategory(
      req.servicesData
    );
    if (getServicesCategory.status == -1) {
      throw new Error(getServicesCategory.message);
    }
    if (getServicesCategory.status == 0) {
      return res.status(403).json({ message: getServicesCategory.message });
    }
    res.status(200).json({
      message: getServicesCategory.message,
      response: getServicesCategory.response,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.editServices = async (req, res) => {
  try {
    // console.log(req.servicesData);
    let data = await serviceProviderService.editServices(
      req.servicesData,
      req.body
    );
    if (data.status == -1) {
      throw new Error(data.message);
    }
    if (data.status == 0) {
      return res.status(403).json({ message: data.message });
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getNewServiceOrder = async (req, res) => {
  try {
    let getNewServiceOrder = await serviceProviderService.getNewServiceOrder(
      req.servicesData
    );
    if (getNewServiceOrder.status == -1) {
      throw new Error(getNewServiceOrder.message);
    }
    if (getNewServiceOrder.status == 0) {
      return res.status(403).json({ message: getNewServiceOrder.message });
    }
    res.status(200).json({
      message: getNewServiceOrder.message,
      response: getNewServiceOrder.response,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
exports.getOngoingServiceOrder = async (req, res) => {
  try {
    let getOngoingServiceOrder =
      await serviceProviderService.getOngoingServiceOrder(req.servicesData);
    if (getOngoingServiceOrder.status == -1) {
      throw new Error(getOngoingServiceOrder.message);
    }
    if (getOngoingServiceOrder.status == 0) {
      return res.status(403).json({ message: getOngoingServiceOrder.message });
    }
    res.status(200).json({
      message: getOngoingServiceOrder.message,
      response: getOngoingServiceOrder.response,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getPastServiceOrder = async (req, res) => {
  try {
    let getPastServiceOrder = await serviceProviderService.getPastServiceOrder(
      req.servicesData
    );
    if (getPastServiceOrder.status == -1) {
      throw new Error(getPastServiceOrder.message);
    }
    if (getPastServiceOrder.status == 0) {
      return res.status(403).json({ message: getPastServiceOrder.message });
    }
    res.status(200).json({
      message: getPastServiceOrder.message,
      response: getPastServiceOrder.response,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    let getDashboardData = await serviceProviderService.getDashboardData(
      req.servicesData,
      req.body
    );
    if (getDashboardData.status == -1) {
      throw new Error(getDashboardData.message);
    }
    if (getDashboardData.status == 0) {
      return res.status(403).json({ message: getDashboardData.message });
    }
    res.status(200).json({
      message: getDashboardData.message,
      response: getDashboardData.response,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getNotificationList = async (req, res) => {
  try {
    let getNotificationList = await serviceProviderService.getNotificationList(
      req.servicesData,
      req.body
    );
    if (getNotificationList.status == -1) {
      throw new Error(getNotificationList.message);
    }
    if (getNotificationList.status == 0) {
      return res.status(403).json({ message: getNotificationList.message });
    }
    res.status(200).json({
      message: getNotificationList.message,
      response: getNotificationList.response,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.viewOrder = async (req, res) => {
  try {
    let viewOrder = await serviceProviderService.viewOrder(
      req.servicesData,
      req.body
    );
    if (viewOrder.status == -1) {
      throw new Error(viewOrder.message);
    }
    if (viewOrder.status == 0) {
      return res.status(403).json({ message: viewOrder.message });
    }
    res.status(200).json({
      message: viewOrder.message,
      response: viewOrder.response,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
};

exports.updateServiceOrderStatus = async (req, res) => {
  try {
    let updateServiceOrderStatus =
      await serviceProviderService.updateServiceOrderStatus(
        req.servicesData,
        req.body
      );
    if (updateServiceOrderStatus.status == -1) {
      throw new Error(updateServiceOrderStatus.message);
    }
    if (updateServiceOrderStatus.status == 0) {
      return res
        .status(403)
        .json({ message: updateServiceOrderStatus.message });
    }
    res.status(200).json({
      message: updateServiceOrderStatus.message,
      response: updateServiceOrderStatus.response,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
};

exports.cancelService = async (req, res) => {
  try {
    let cancleService =
      await serviceProviderService.cancelService(
        req.servicesData,
        req.body
      );
    if (cancleService.status == -1) {
      throw new Error(cancleService.message);
    }
    if (cancleService.status == 0) {
      return res
        .status(403)
        .json({ message: cancleService.message, success: false });
    }
    res.status(200).json({
      message: cancleService.message,
      response: cancleService.response,
      success : true
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
};

exports.readAllNotification = async (req, res) => {
  try {
    let readAllNotification =
      await serviceProviderService.readAllNotification(
        req.servicesData,
        req.body
      );
    if (readAllNotification.status == -1) {
      throw new Error(readAllNotification.message);
    }
    if (readAllNotification.status == 0) {
      return res
        .status(403)
        .json({ message: readAllNotification.message, success: false });
    }
    res.status(200).json({
      message: readAllNotification.message,
      response: readAllNotification.response,
      success : true
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
};

exports.paymentList = async (req, res) => {
  try {
    let paymentList =
      await serviceProviderService.paymentList(
        req.servicesData,
      );
    if (paymentList.status == -1) {
      throw new Error(paymentList.message);
    }
    if (paymentList.status == 0) {
      return res
        .status(403)
        .json({ message: paymentList.message, success: false });
    }
    res.status(200).json({
      message: paymentList.message,
      total_revenue: paymentList.total_revenue,
      pending_payments: paymentList.pending_payments,
      response: paymentList.response,
      success : true
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
};


exports.filterPaymentList = async (req, res) => {
  try {
    let filterPaymentList =
      await serviceProviderService.filterPaymentList(
        req.servicesData,
        req.body
      );
    if (filterPaymentList.status == -1) {
      throw new Error(filterPaymentList.message);
    }
    if (filterPaymentList.status == 0) {
      return res
        .status(403)
        .json({ message: filterPaymentList.message, success: false });
    }
    res.status(200).json({
      message: filterPaymentList.message,
      total_revenue: filterPaymentList.total_revenue,
      pending_payments: filterPaymentList.pending_payments,
      response: filterPaymentList.response,
      success : true
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
};

exports.getServiceOrderReportList = async (req, res) => {
  try {
    let service = {
      otp_info: { otp: null, expTime: null },
      documents: {
        idProof: 'https://petsworldbucket.s3.sa-east-1.amazonaws.com/1658310830991/1658310830.jpeg'
      },
      location: {
        address1: 'test',
        address2: 'test',
        address3: 'test',
        coordinates: []
      },
      bankDetails: {
        accountHolderName: 'test',
        accountNumber: '0987654321',
        bankCard: 'test'
      },
      _id:"62d7d09bedb25702ec2397dd",
      first_name: 'gourav',
      last_name: 'sha',
      country_code: '+51',
      mobile_number: '9876543210',
      email: 'g@g.com',
      password: '$2b$10$31To4KG/skhiGi1LGZpzpeXQW30IVp0T983emWJXnTqgGUrC.bBaS',
      is_verified_by_admin: 0,
      is_blocked: false,
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJhY2Nlc3MtIiwiaWF0IjoxNjU5NjkzOTE3fQ.IvFZrlbO1B4R1QntYNGM3f2A2nG_0UsypYksv54ob9g',
      device_type: 1,
      device_token: 'c8Fsop1aXkUWgdaaFPlPun:APA91bF2zwHL0AcdRXuRzHrNtVDfAWJZJw1lB2n3wBLvAo9Mmj-0SMZnQjN32GDDjjANSHz8sVz-f9qI3NoZ_B628KnPOfJXr87414pyVOA1UwmPaSj-ox4wk7WPi8A2VODPUcH_mFgP',
      is_active: false,
      profile_pic: 'https://petsworldbucket.s3.sa-east-1.amazonaws.com/1658812239612/1658812237.jpeg',
      is_otp_verified: true,
      is_profile_created: true,
      is_bank_details_added: true,
      createdAt: "2022-07-20T09:53:31.727Z",
      updatedAt: "2022-08-05T10:05:17.674Z"
    }
    let serviceOrderReport =
      await serviceProviderService.getServiceOrderReportList(
        // req.servicesData,
        service,
        req.query
      );
    if (serviceOrderReport?.status == -1) {
      throw new Error(serviceOrderReport.message);
    }
    if (serviceOrderReport?.status == 0) {
      return res
        .status(403)
        .json({ message: serviceOrderReport.message, success: false });
    }
    res.status(200).send(serviceOrderReport);


    // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    // serviceOrderReport.data.xlsx.write(res)
    //     .then(function (data) {
    //       console.log(data,"Succes");
    //         res.end();
    //         console.log('File write done........');
    //     }).catch((err)=>{
    //       console.log("ddddddddddddddddddddddddddddd/n",err);
    //     })

  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
};

exports.getTermCondition = async (req, res) => {
  try {
    let data = await serviceProviderService.getTermCondition();
    
    res.status(200).send(data);

  } catch (error) {
    res.status(500).json({ message: error.message,err:error });
  }
};

exports.getPrivacyPolicy = async (req, res) => {
  try {
    let data = await serviceProviderService.getPrivacyPolicy();
   
    res.status(200).send(data);
    
  } catch (error) {
    res.status(500).json({ message: error.message,err:error });
  }
};

exports.getAboutUs = async (req, res) => {
  try {
    let data = await serviceProviderService.getAboutUs();
   
    res.status(200).send(data);
    
  } catch (error) {
    res.status(500).json({ message: error.message,err:error });
  }
};

exports.getLegal = async (req, res) => {
  try {
    let data = await serviceProviderService.getLegal();
   
    res.status(200).send(data);
    
  } catch (error) {
    res.status(500).json({ message: error.message,err:error });
  }
};

exports.getCancelOrderReasonList = async (req, res) => {
  try {
    let getCancelOrderReasonList =
      await serviceProviderService.getCancelOrderReasonList(
        req.servicesData,
      );
    if (getCancelOrderReasonList.status == -1) {
      throw new Error(getCancelOrderReasonList.message);
    }
    if (getCancelOrderReasonList.status == 0) {
      return res
        .status(403)
        .json({ message: getCancelOrderReasonList.message, success: false });
    }
    res.status(200).json({
      message: getCancelOrderReasonList.message,
      response: getCancelOrderReasonList.response,
      success : true
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
};

exports.getAllAdvertisements = async (req, res) => {
  try {
    let advData = await serviceProviderService.getAllAdvertisements(
      req.servicesData,
    );
    if (advData.status == -1) {
      throw new Error(advData.message);
    }
    if (advData.status == 0) {
      return res.status(403).json({ message: advData.message });
    }
    res.status(200).json({
      message: advData.message,
      response: advData.response,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getServiceReport = async (req, res) => {
  try {
    let filterPaymentList =
      await serviceProviderService.getServiceReport(
        req.servicesData,
        req.body
      );
    if (filterPaymentList.status == -1) {
      throw new Error(filterPaymentList.message);
    }
    if (filterPaymentList.status == 0) {
      return res
        .status(403)
        .json({ message: filterPaymentList.message, success: false });
    }
    return res.status(200).json({
      message: filterPaymentList.message,
      response: filterPaymentList.response,
      url: filterPaymentList.url,
      success : true
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    let advData = await serviceProviderService.deleteAccount(
      req.servicesData,
    );
    if (advData.status == -1) {
      throw new Error(advData.message);
    }
    if (advData.status == 0) {
      return res.status(403).json({ message: advData.message });
    }
    res.status(200).json({
      message: advData.message,
      response: advData.response,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.updateServiceData = async (req, res) => {
  try {
    let advData = await serviceProviderService.updateServiceData(
      req.servicesData, req.body
    );
    if (advData.status == -1) {
      throw new Error(advData.message);
    }
    if (advData.status == 0) {
      return res.status(403).json({ message: advData.message });
    }
    res.status(200).json({
      message: advData.message,
      response: advData.response,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
