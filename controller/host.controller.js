const hostService = require("../services/host.services");
var csc = require("country-state-city").default; // Returns an array of country names.
var _ = require("lodash");

exports.uploadFile = async (req, res) => {
  try {
    let hostData = await hostService.uploadFile(req);
    if (hostData.status == -1) {
      throw new Error(hostData.message);
    } else if (hostData.status == 0) {
      return res.status(403).json({ message: hostData.message });
    } else {
      res
        .status(200)
        .json({ response: hostData.data, message: hostData.message });
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

exports.registerHost = async (req, res) => {
  try {
    let hostData = await hostService.registerHost(req);
    if (hostData.status == -1) {
      throw new Error(hostData.message);
    } else if (hostData.status == 0) {
      return res.status(403).json({ message: hostData.message });
    } else {
      res
        .status(200)
        .json({ response: hostData.data, message: hostData.message });
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    let hostData = await hostService.verifyOtp(req);
    if (hostData.status == -1) {
      throw new Error(hostData.message);
    } else if (hostData.status == 0) {
      return res.status(403).json({ message: hostData.message });
    } else {
      res
        .status(200)
        .json({ response: hostData.data, message: hostData.message });
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

exports.createHostProfile = async (req, res) => {
  try {
    let hostData = await hostService.createHostProfile(req);
    if (hostData.status == -1) {
      throw new Error(hostData.message);
    } else if (hostData.status == 0) {
      return res.status(403).json({ message: hostData.message });
    } else {
      res
        .status(200)
        .json({ response: hostData.data, message: hostData.message });
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    let hostData = await hostService.login(req);
    if (hostData.status == -1) {
      throw new Error(hostData.message);
    } else if (hostData.status == 0) {
      return res.status(403).json({ message: hostData.message });
    } else if (hostData.status == 2) {
      console.log(hostData)
      return res.status(402).json({ message: hostData.message, data: hostData.data });
    } else {
      res.status(200)
        .json({ response: hostData.data, message: hostData.message });
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    let hostData = await hostService.forgetPassword(req);
    if (hostData.status == -1) {
      throw new Error(hostData.message);
    } else if (hostData.status == 0) {
      return res.status(403).json({ message: hostData.message });
    } else {
      res
        .status(200)
        .json({ response: hostData.data, message: hostData.message });
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

exports.createNewPassword = async (req, res) => {
  try {
    let hostData = await hostService.createNewPassword(req);
    if (hostData.status == -1) {
      throw new Error(hostData.message);
    } else if (hostData.status == 0) {
      return res.status(403).json({ message: hostData.message });
    } else {
      res
        .status(200)
        .json({ response: hostData.data, message: hostData.message });
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

exports.sendCountries = async (req, res) => {
  try {
    let country = await csc.getAllCountries();
    // console.log(country);
    let dataToSend = {
      countryList: country,
    };
    res
      .status(200)
      .json({ response: dataToSend, message: "All countries fetch" });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    let hostData = await hostService.resendOtp(req.userData);
    if (hostData.status == 1) {
      res.status(200).json({
        message: hostData.message,
        reponse: hostData.response,
      });
    } else if (hostData.status == 0) {
      res.status(400).json({
        message: hostData.message,
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
    let hostData = await hostService.logout(req.userData);
    if (hostData.status == -1) {
      throw new Error(hostData.message);
    }
    if (hostData.status == 0) {
      return res.status(403).json({ message: hostData.message });
    }
    res
      .status(200)
      .json({ message: hostData.message, response: hostData.data });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.editProfile = async (req, res) => {
  try {
    let hostData = await hostService.editProfile(req.userData, req.body);
    if (hostData.status == -1) {
      throw new Error(hostData.message);
    }
    if (hostData.status == 0) {
      return res.status(403).json({ message: hostData.message });
    }
    res
      .status(200)
      .json({ message: hostData.message, response: hostData.data });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    let hostData = await hostService.changePassword(req.userData, req.body);
    if (hostData.status == -1) {
      throw new Error(hostData.message);
    } else if (hostData.status == 0) {
      return res.status(403).json({ message: hostData.message });
    } else {
      res
        .status(200)
        .json({ response: hostData.data, message: hostData.message });
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    let data = await hostService.getProfile(req.userData, req.body);
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

exports.getMainProductCat = async (req, res) => {
  try {
    let data = await hostService.getMainProductCat(req.userData);
    if (data.status == 2) {
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
};

exports.getProductCategory = async (req, res) => {
  try {
    let data = await hostService.getProductCategory(req.userData);
    if (data.status == 2) {
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
};

exports.getProducts = async (req, res) => {
  try {
    let data = await hostService.getProducts(req.userData, req.body);
    if (data.status == 2) {
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
};

exports.addToCart = async (req, res) => {
  try {
    let data = await hostService.addToCart(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    if (data.status == -1) {
      res.status(400).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      success: true,
      response: data.response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getCartData = async (req, res) => {
  try {
    let data = await hostService.getCartData(req.userData);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      cartValues: data.cartValues,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    let data = await hostService.addToWishlist(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getWishlistData = async (req, res) => {
  try {
    let data = await hostService.getWishlistData(req.userData);
    if (data.status == 2) {
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
};

exports.removeFromWishlist = async (req, res) => {
  try {
    let data = await hostService.removeFromWishlist(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    let data = await hostService.removeFromCart(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.decreaseCartData = async (req, res) => {
  try {
    let data = await hostService.decreaseCartData(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      success: true,
      response: data.response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.removeAllFromCart = async (req, res) => {
  try {
    let data = await hostService.removeAllFromCart(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    let data = await hostService.getAllProducts(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.addAdress = async (req, res) => {
  try {
    let data = await hostService.addAdress(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.editAdress = async (req, res) => {
  try {
    let data = await hostService.editAdress(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getAdressList = async (req, res) => {
  try {
    let data = await hostService.getAdressList(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    let data = await hostService.deleteAddress(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.makePrimaryAddress = async (req, res) => {
  try {
    let data = await hostService.makePrimaryAddress(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.coupenList = async (req, res) => {
  try {
    let data = await hostService.coupenList(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    let data = await hostService.applyCoupon(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.removeCoupon = async (req, res) => {
  try {
    let data = await hostService.removeCoupon(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.proceedToPay = async (req, res) => {
  try {
    let data = await hostService.proceedToPay(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    let data = await hostService.placeOrder(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getTrackingDeviceProducts = async (req, res) => {
  try {
    let data = await hostService.getTrackingDeviceProducts(req.userData);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    let data = await hostService.cancelOrder(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getCancelOrderReasonList = async (req, res) => {
  try {
    let data = await hostService.getCancelOrderReasonList(req.userData);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getOngoingOrderList = async (req, res) => {
  try {
    let data = await hostService.getOngoingOrderList(req.userData);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getPastOrderList = async (req, res) => {
  try {
    let data = await hostService.getPastOrderList(req.userData);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    let data = await hostService.getOrderDetails(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.addOrderRating = async (req, res) => {
  try {
    let data = await hostService.addOrderRating(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getAllRatings = async (req, res) => {
  try {
    let data = await hostService.getAllRatings(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getAllAdvertisements = async (req, res) => {
  try {
    let data = await hostService.getAllAdvertisements(req.userData);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getServiceCategoryList = async (req, res) => {
  try {
    let data = await hostService.getServiceCategoryList(req.userData);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getServiceProviderServicesList = async (req, res) => {
  try {
    let data = await hostService.getServiceProviderServicesList(req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getServiceDetails = async (req, res) => {
  try {
    let data = await hostService.getServiceDetails(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.bookService = async (req, res) => {
  try {
    let data = await hostService.bookService(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.filterServices = async (req, res) => {
  try {
    let data = await hostService.filterServices(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.confirmPaypalBooking = async (req, res) => {
  try {
    let data = await hostService.confirmPaypalBooking(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getNotificationList = async (req, res) => {
  try {
    let data = await hostService.getNotificationList(req.userData);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.readNotification = async (req, res) => {
  try {
    let data = await hostService.readNotification(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getOngoingServiceOrderList = async (req, res) => {
  try {
    let data = await hostService.getOngoingServiceOrderList(req.userData);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getPastServiceOrderList = async (req, res) => {
  try {
    let data = await hostService.getPastServiceOrderList(req.userData);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.cancelServiceOrder = async (req, res) => {
  try {
    let data = await hostService.cancelServiceOrder(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getServiceOrderDetails = async (req, res) => {
  try {
    let data = await hostService.getServiceOrderDetails(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.addServiceOrderRating = async (req, res) => {
  try {
    let data = await hostService.addServiceOrderRating(req.userData, req.body);
    if (data.status == 2) {
      res.status(400).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getServiceRatings = async (req, res) => {
  try {
    let data = await hostService.getServiceRatings(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getCancelServiceOrderReasonList = async (req, res) => {
  try {
    let data = await hostService.getCancelServiceOrderReasonList(req.userData);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.addPackage = async (req, res) => {
  try {
    let data = await hostService.addPackage(req.userData, req.body);
    if (data.status == 2) {
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
};

exports.getPackage = async (req, res) => {
  try {
    let data = await hostService.getPackage(req.userData);
    if (data.status == 2) {
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
};

exports.getBreedList = async (req, res) => {
  try {
    let data = await hostService.getBreedList(req.userData);
    if (data.status == 2) {
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
};

exports.editPackage = async (req, res) => {
  try {
    let data = await hostService.editPackage(req.userData,req.body);
    if (data.status == 2) {
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
};

exports.viewPackge = async (req, res) => {
  try {
    let data = await hostService.viewPackge(req.userData,req.body);
    if (data.status == 2) {
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
};

exports.deletePackage = async (req, res) => {
  try {
    let data = await hostService.deletePackage(req.userData,req.body);
    if (data.status == 2) {
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
};

exports.newServicesList = async (req, res) => {
  try {
    let data = await hostService.newServicesList(req.userData);
    if (data.status == 2) {
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
};

exports.viewPackgeDetails = async (req, res) => {
  try {
    let data = await hostService.viewPackgeDetails(req.userData,req.body);
    if (data.status == 2) {
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
};

exports.activeServicesList = async (req, res) => {
  try {
    let data = await hostService.activeServicesList(req.userData);
    if (data.status == 2) {
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
};

exports.pastServicesList = async (req, res) => {
  try {
    let data = await hostService.pastServicesList(req.userData);
    if (data.status == 2) {
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
};

exports.updateServicesStatus = async (req, res) => {
  try {
    let data = await hostService.updateServicesStatus(req.userData,req.body);
    if (data.status == 2) {
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
};

exports.packagesPayment = async (req, res) => {
  try {
    let data = await hostService.packagesPayment(req.userData);
    if (data.status == 2) {
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
};

exports.filterPackagePaymentList = async (req, res) => {
  try {
    let data = await hostService.filterPackagePaymentList(req.userData,req.body);
    if (data.status == 2) {
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
};

exports.hostTermCondition = async (req, res) => {
  try {
      let data = await hostService.hostTermCondition();

      res.status(200).send(data);
      
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
};

exports.hostAboutUs = async (req, res) => {
  try {
      let data = await hostService.hostAboutUs();

      res.status(200).send(data);
      
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
};

exports.hostContactUs = async (req, res) => {
  try {
      let data = await hostService.hostContactUs();

      res.status(200).send(data);
      
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
};

exports.hostPrivacyPolicy = async (req, res) => {
  try {
      let data = await hostService.hostPrivacyPolicy();

      res.status(200).send(data);
      
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
};

exports.getHostFaqList = async (req, res) => {
  try {
    let data = await hostService.getHostFaqList(req.userData);
    if (data.status == 2) {
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
};


exports.getHostFaq = async (req, res) => {
  try {
      let data = await hostService.getHostFaq();

      res.status(200).send(data);
      
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
};

exports.pendingPayout = async (req, res) => {
  try {
    let data = await hostService.pendingPayout(req.userData, req.body);
    if (data.status == 2) {
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
};

exports.getDashboardData = async (req, res) => {
  try {
    let data = await hostService.getDashboardData(req.userData, req.body);
    if (data.status == 2) {
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
};

exports.getRefundList = async (req, res) => {
  try {
    let data = await hostService.getRefundList(req.userData, req.body);
    if (data.status == 2) {
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
};

exports.hostLikeProduct = async (req, res) => {
  try {
    let data = await hostService.hostLikeProduct(req.userData, req.body);
    if (data.status == 2) {
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
};

exports.hostUnlikeProduct = async (req, res) => {
  try {
    let data = await hostService.hostUnlikeProduct(req.userData, req.body);
    if (data.status == 2) {
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
};


exports.hostLikeService = async (req, res) => {
  try {
    let data = await hostService.hostLikeService(req.userData, req.body);
    if (data.status == 2) {
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
};

exports.hostUnlikeService = async (req, res) => {
  try {
    let data = await hostService.hostUnlikeService(req.userData, req.body);
    if (data.status == 2) {
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
};

exports.filterAllProducts = async (req, res) => {
  try {
    let data = await hostService.filterAllProducts(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success:false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success:true
    });
  } catch (error) {
    res.status(500).json({ message: error.message,err:error });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    let data = await hostService.filterProducts(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success:false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success:true
    });
  } catch (error) {
    res.status(500).json({ message: error.message,err:error });
  }
};

exports.searchAllProducts = async (req, res) => {
  try {
    let data = await hostService.searchAllProducts(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.searchPackage = async (req, res) => {
  try {
    let data = await hostService.searchPackage(req.userData, req.body);
    if (data.status == 2) {
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
};

exports.searchServiceProviderServicesList = async (req, res) => {
  try {
    let data = await hostService.searchServiceProviderServicesList(req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.searchProductGlobally = async (req, res) => {
  try {
    let data = await hostService.searchProductGlobally(req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    let data = await hostService.deleteAccount(req.userData);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.calculateServiceCharge = async (req, res) => {
  try {
    let data = await hostService.calculateServiceCharge(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.updateHostData = async (req, res) => {
  try {
    let data = await hostService.updateHostData(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
      });
      return;
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

