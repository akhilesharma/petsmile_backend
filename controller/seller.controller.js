const { truncate } = require("lodash");
const sellerService = require("../services/sellerService");


exports.uploadFile = async (req, res) => {
  try {
    let sellerData = await sellerService.uploadFile(req);
    if (sellerData.status == -1) {
      throw new Error(sellerData.message);
    } else if (sellerData.status == 0) {
      return res.status(403).json({ message: sellerData.message });
    } else {
      res.status(200).json({ response: sellerData.data, message: sellerData.message });
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
}

exports.registerSeller = async (req, res) => {
  try {
    // {
    //     "country_code":"+91",
    //     "mobile_number":"1212121212",
    //     "first_name":"Aditya",
    //     "last_name":"Singh",
    //     "device_token":"abcd",
    //     "device_type":"1"
    // }

    let sellerRegisterData = await sellerService.registerSeller(req.body);
    if (sellerRegisterData.status == 1) {
      res.status(200).json({
        message: sellerRegisterData.message,
        reponse: sellerRegisterData.response,
      });
    } else if (sellerRegisterData.status == 0) {
      res.status(400).json({
        message: sellerRegisterData.message,
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
    let sellerRegisterData = await sellerService.VerifyOtp(
      req.body,
      req.sellerData
    );
    if (sellerRegisterData.status == 1) {
      res.status(200).json({
        message: sellerRegisterData.message,
        reponse: sellerRegisterData.response,
      });
    } else if (sellerRegisterData.status == 0) {
      res.status(400).json({
        message: sellerRegisterData.message,
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
    let sellerRegisterData = await sellerService.resendOtp(
      req.sellerData
    );
    if (sellerRegisterData.status == 1) {
      res.status(200).json({
        message: sellerRegisterData.message,
        reponse: sellerRegisterData.response,
      });
    } else if (sellerRegisterData.status == 0) {
      res.status(400).json({
        message: sellerRegisterData.message,
      });
    } else {
      res.status(400).json({ message: "Something Went Wrong" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.comleteProfile = async (req, res) => {
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

    let sellerRegisterData = await sellerService.comleteProfile(
      req.body,
      req.sellerData
    );
    if (sellerRegisterData.status == 1) {
      res.status(200).json({
        message: sellerRegisterData.message,
        reponse: sellerRegisterData.response,
      });
    } else if (sellerRegisterData.status == 0) {
      res.status(400).json({
        message: sellerRegisterData.message,
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

    let sellerRegisterData = await sellerService.bankSecurityAdd(
      req.body,
      req.sellerData
    );
    if (sellerRegisterData.status == 1) {
      res.status(200).json({
        message: sellerRegisterData.message,
        reponse: sellerRegisterData.response,
      });
    } else if (sellerRegisterData.status == 0) {
      res.status(400).json({
        message: sellerRegisterData.message,
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

    let sellerRegisterData = await sellerService.forgotPassword(req.body);
    if (sellerRegisterData.status == 1) {
      res.status(200).json({
        message: sellerRegisterData.message,
        response: sellerRegisterData.data,
      });
    } else if (sellerRegisterData.status == 0) {
      res.status(400).json({
        message: sellerRegisterData.message,
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

    let sellerRegisterData = await sellerService.resetPassword(
      req.body,
      req.sellerData
    );
    if (sellerRegisterData.status == 1) {
      res.status(200).json({
        message: sellerRegisterData.message,
        reponse: sellerRegisterData.response,
      });
    } else if (sellerRegisterData.status == 0) {
      res.status(400).json({
        message: sellerRegisterData.message,
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

    let sellerRegisterData = await sellerService.login(req.body);
    if (sellerRegisterData.status == 1) {
      res.status(200).json({
        message: sellerRegisterData.message,
        reponse: sellerRegisterData.data,
      });
    } else if (sellerRegisterData.status == 0) {
      res.status(400).json({
        message: sellerRegisterData.message,
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
    let user = await sellerService.logout(req.sellerData);
    if (user.status == -1) {
      throw new Error(user.message);
    }
    if (user.status == 0) {
      return res.status(403).json({ message: user.message });
    }
    res.status(200).json({ message: user.message, response: user.data });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.editProfile = async (req, res) => {
  try {
    let sellerRegisterData = await sellerService.editProfile(
      req.sellerData,
      req.body
    );
    if (sellerRegisterData.status == -1) {
      throw new Error(sellerRegisterData.message);
    }
    if (sellerRegisterData.status == 0) {
      return res.status(403).json({ message: sellerRegisterData.message });
    }
    res
      .status(200)
      .json({
        message: sellerRegisterData.message,
        response: sellerRegisterData.data,
      });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.editAddress = async (req, res) => {
  try {
    let sellerRegisterData = await sellerService.editAddress(
      req.sellerData,
      req.body
    );
    if (sellerRegisterData.status == -1) {
      throw new Error(sellerRegisterData.message);
    }
    if (sellerRegisterData.status == 0) {
      return res.status(403).json({ message: sellerRegisterData.message });
    }
    res
      .status(200)
      .json({
        message: sellerRegisterData.message,
        response: sellerRegisterData.data,
      });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    let sellerRegisterData = await sellerService.changePassword(
      req.sellerData,
      req.body
    );
    if (sellerRegisterData.status == -1) {
      throw new Error(sellerRegisterData.message);
    } else if (sellerRegisterData.status == 0) {
      return res.status(403).json({ message: sellerRegisterData.message });
    } else {
      res
        .status(200)
        .json({
          response: sellerRegisterData.data,
          message: sellerRegisterData.message,
        });
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

exports.productCatList = async (req, res) => {
  try {
    let data = await sellerService.productCatList();
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
    }
    res.status(200).json({
      message: data.message,
      ProductCatList: data.response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.productSubCatList = async (req, res) => {
  try {
    let data = await sellerService.productSubCatList(req.sellerData,
      req.body
    );
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
      });
    }
    res.status(200).json({
      message: data.message,
      ProductSubCatList: data.response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addSellerProduct = async (req, res) => {
  try {
    let data = await sellerService.addSellerProduct(req.sellerData, req.body);

    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
      });
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.sellerAllProductList = async (req, res) => {
  try {
    let data = await sellerService.sellerAllProductList(req.sellerData);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
      });
    }
    res.status(200).json({
      message: data.message,
      AllProductList: data.response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editSellerProduct = async (req, res) => {
  try {
    let editSellerProduct = await sellerService.editSellerProduct(
      req.sellerData,
      req.body
    );
    if (editSellerProduct.status == -1) {
      throw new Error(editSellerProduct.message);
    }
    if (editSellerProduct.status == 0) {
      return res.status(403).json({ message: editSellerProduct.message });
    }
    res.status(200).json({
      message: editSellerProduct.message,
      response: editSellerProduct.data,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.deleteSellerProduct = async (req, res) => {

  try {
    let seller = await sellerService.deleteSellerProduct(req.sellerData, req.body);
    if (seller.status == -1) {
      throw new Error(seller.message);
    }
    if (seller.status == 2) {
      return res.status(403).json({ message: seller.message });
    }
    res.status(200).json({
      message: seller.message,
      response: seller.data,
    });
  } catch (error) {

  }
};

exports.getProfile = async (req, res) => {
  try {
    let data = await sellerService.getProfile(req.sellerData, req.body);
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

exports.productMainCat = async (req, res) => {
  try {
    let data = await sellerService.productMainCat();
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
    }
    res.status(200).json({
      message: data.message,
      ProductMainList: data.response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSellerProductQuantity = async (req, res) => {
  try {
    let editSellerProduct = await sellerService.updateSellerProductQuantity(
      req.sellerData,
      req.body
    );
    if (editSellerProduct.status == -1) {
      throw new Error(editSellerProduct.message);
    }
    if (editSellerProduct.status == 0) {
      return res.status(403).json({ message: editSellerProduct.message });
    }
    res.status(200).json({
      message: editSellerProduct.message,
      response: editSellerProduct.data,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.updateSkuMinLimit = async (req, res) => {
  try {
    let editSellerProduct = await sellerService.updateSkuMinLimit(
      req.sellerData,
      req.body
    );
    if (editSellerProduct.status == -1) {
      throw new Error(editSellerProduct.message);
    }
    if (editSellerProduct.status == 0) {
      return res.status(403).json({ message: editSellerProduct.message });
    }
    res.status(200).json({
      message: editSellerProduct.message,
      response: editSellerProduct.data,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.updateProductStatus = async (req, res) => {
  try {
    let editSellerProduct = await sellerService.updateProductStatus(
      req.sellerData,
      req.body
    );
    if (editSellerProduct.status == -1) {
      throw new Error(editSellerProduct.message);
    }
    if (editSellerProduct.status == 0) {
      return res.status(403).json({ message: editSellerProduct.message });
    }
    res.status(200).json({
      message: editSellerProduct.message,
      response: editSellerProduct.data,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    let getOrders = await sellerService.getOrders(
      req.sellerData,
      req.body
    );
    if (getOrders.status == -1) {
      throw new Error(getOrders.message);
    }
    if (getOrders.status == 0) {
      return res.status(403).json({ message: getOrders.message });
    }
    res.status(200).json({
      message: getOrders.message,
      response: getOrders.data,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    let updateOrderStatus = await sellerService.updateOrderStatus(
      req.sellerData,
      req.body
    );
    if (updateOrderStatus.status == -1) {
      throw new Error(updateOrderStatus.message);
    }
    if (updateOrderStatus.status == 0) {
      return res.status(403).json({ message: updateOrderStatus.message });
    }
    res.status(200).json({
      message: updateOrderStatus.message,
      response: updateOrderStatus.data,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.generateInvoice = async (req, res) => {
  try {
    let invoiceData = await sellerService.generateInvoice(
      req.sellerData,
      req.params
    );
    if (invoiceData.status == -1) {
      throw new Error(invoiceData.message);
    }
    if (invoiceData.status == 0) {
      return res.status(403).json({ message: invoiceData.message });
    }
    res.status(200).json({
      message: invoiceData.message,
      response: invoiceData.data,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};



exports.getPaymentList = async (req, res) => {
  try {
    let paymentList = await sellerService.getPaymentList(
      req.sellerData,
    );
    if (paymentList.status == -1) {
      throw new Error(paymentList.message);
    }
    if (paymentList.status == 0) {
      return res.status(403).json({ message: paymentList.message });
    }
    res.status(200).json({
      message: paymentList.message,
      total_revenue: paymentList.total_revenue,
      pending_payments: paymentList.pending_payments,
      response: paymentList.response,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.filterPayment = async (req, res) => {
  try {
    let filterData = await sellerService.filterPayment(
      req.sellerData, req.body
    );
    if (filterData.status == -1) {
      throw new Error(filterData.message);
    }
    if (filterData.status == 0) {
      return res.status(403).json({ message: filterData.message });
    }
    res.status(200).json({
      message: filterData.message,
      response: filterData.response,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    let searchData = await sellerService.getDashboardData(
      req.sellerData, req.body
    );
    if (searchData.status == -1) {
      throw new Error(searchData.message);
    }
    if (searchData.status == 0) {
      return res.status(403).json({ message: searchData.message });
    }
    res.status(200).json({
      message: searchData.message,
      response: searchData.response,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getNotificationList = async (req, res) => {
  try {
    let searchData = await sellerService.getNotificationList(
      req.sellerData
    );
    if (searchData.status == -1) {
      throw new Error(searchData.message);
    }
    if (searchData.status == 0) {
      return res.status(403).json({ message: searchData.message });
    }
    res.status(200).json({
      message: searchData.message,
      response: searchData.response,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.readAllNotification = async (req, res) => {
  try {
    let readAllNotification =
      await sellerService.readAllNotification(
        req.sellerData,
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

exports.getTermCondition = async (req, res) => {
  try {
    let data = await sellerService.getTermCondition();
    
    res.status(200).send(data);

  } catch (error) {
    res.status(500).json({ message: error.message,err:error });
  }
};

exports.getPrivacyPolicy = async (req, res) => {
  try {
    let data = await sellerService.getPrivacyPolicy();
   
    res.status(200).send(data);
    
  } catch (error) {
    res.status(500).json({ message: error.message,err:error });
  }
};

exports.getAboutUs = async (req, res) => {
  try {
    let data = await sellerService.getAboutUs();
   
    res.status(200).send(data);
    
  } catch (error) {
    res.status(500).json({ message: error.message,err:error });
  }
};

exports.getLegal = async (req, res) => {
  try {
    let data = await sellerService.getLegal();
   
    res.status(200).send(data);
    
  } catch (error) {
    res.status(500).json({ message: error.message,err:error });
  }
};

exports.getAllAdvertisements = async (req, res) => {
  try {
    let searchData = await sellerService.getAllAdvertisements(
      req.sellerData
    );
    if (searchData.status == -1) {
      throw new Error(searchData.message);
    }
    if (searchData.status == 0) {
      return res.status(403).json({ message: searchData.message });
    }
    res.status(200).json({
      message: searchData.message,
      response: searchData.response,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getSellerReport = async (req, res) => {
  try {
    let searchData = await sellerService.getSellerReport(
      req.sellerData, req.body
    );
    if (searchData.status == -1) {
      throw new Error(searchData.message);
    }
    if (searchData.status == 0) {
      return res.status(403).json({ message: searchData.message });
    }
    res.status(200).json({
      message: searchData.message,
      response: searchData.response,
      url: searchData.url,
      success : true
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    let searchData = await sellerService.deleteAccount(
      req.sellerData
    );
    if (searchData.status == -1) {
      throw new Error(searchData.message);
    }
    if (searchData.status == 0) {
      return res.status(403).json({ message: searchData.message });
    }
    res.status(200).json({
      message: searchData.message,
      response: searchData.response,
      url: searchData.url,
      success : true
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.updateSellerData = async (req, res) => {
  try {
    let searchData = await sellerService.updateSellerData(
      req.sellerData, req.body
    );
    if (searchData.status == -1) {
      throw new Error(searchData.message);
    }
    if (searchData.status == 0) {
      return res.status(403).json({ message: searchData.message });
    }
    res.status(200).json({
      message: searchData.message,
      success : true
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    let searchData = await sellerService.getOrderDetails(
      req.sellerData, req.body
    );
    if (searchData.status == -1) {
      throw new Error(searchData.message);
    }
    if (searchData.status == 0) {
      return res.status(403).json({ message: searchData.message });
    }
    res.status(200).json({
      message: searchData.message,
      success : true,
      response: searchData.data
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};