const userService = require("../services/userServices")

exports.uploadFile = async (req, res) => {
  try {
    let userData = await userService.uploadFile(req);
    if (userData.status == -1) {
      throw new Error(userData.message);
    } else if (userData.status == 0) {
      return res.status(403).json({ message: userData.message });
    } else {
      res.status(200).json({ response: userData.data, message: userData.message });
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
}



exports.registerUser = async (req, res) => {

  try {
    let userRegisterData = await userService.registerUser(req.body);
    if (userRegisterData.status == 1) {
      res.status(200).json({
        message: userRegisterData.message,
        reponse: userRegisterData.response
      })
    }
    else {
      res.status(400).json({
        message: userRegisterData.message
      })
    }

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}



exports.VerifyOtp = async (req, res) => {
  try {
    let userRegisterData = await userService.VerifyOtp(req.body, req.userData);
    if (userRegisterData.status == 1) {
      res.status(200).json({
        message: userRegisterData.message,
        reponse: userRegisterData.response
      })
    } else {
      res.status(400).json({
        message: userRegisterData.message
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error
    })
  }
}



exports.comleteProfile = async (req, res) => {
  try {
    let userRegisterData = await userService.comleteProfile(req.body, req.userData);
    if (userRegisterData.status == 1) {
      res.status(200).json({
        message: userRegisterData.message,
        reponse: userRegisterData.response
      })
    } else {
      res.status(400).json({
        message: userRegisterData.message
      })
    }
  } catch (error) {

  }
}

exports.resendOtp = async (req, res) => {
  try {
    let userRegisterData = await userService.resendOtp(req.userData);
    if (userRegisterData.status == 1) {
      res.status(200).json({
        message: userRegisterData.message,
        reponse: userRegisterData.response,
        data: userRegisterData.data
      })
    } else {
      res.status(400).json({
        message: userRegisterData.message
      })
    }
  } catch (error) {

  }
}

exports.loginUser = async (req, res) => {
  try {
    let userRegisterData = await userService.loginUser(req.body);
    if (userRegisterData.status == 1) {
      res.status(200).json({
        message: userRegisterData.message,
        data: userRegisterData?.data
      })
    } else {
      res.status(400).json({
        message: userRegisterData.message,
        data: userRegisterData?.data
      })
    }

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    let userRegisterData = await userService.forgotPassword(req.body);
    if (userRegisterData.status == 1) {
      res.status(200).json({
        message: userRegisterData.message,
        reponse: userRegisterData.response,
        data: userRegisterData.data
      })
    } else {
      res.status(400).json({
        message: userRegisterData.message
      })
    }
  } catch (error) {

  }
}

exports.resetPassword = async (req, res) => {
  try {
    let userRegisterData = await userService.resetPassword(req.body, req.userData);
    if (userRegisterData.status == 1) {
      res.status(200).json({
        message: userRegisterData.message,
        reponse: userRegisterData.response,
        data: userRegisterData.data
      })
    } else {
      res.status(400).json({
        message: userRegisterData.message
      })
    }
  } catch (error) {

  }
}

exports.logout = async (req, res) => {
  try {
    let user = await userService.logout(req.userData);
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

exports.changePassword = async (req, res) => {
  try {
    let userData = await userService.changePassword(
      req.userData,
      req.body
    );
    if (userData.status == -1) {
      throw new Error(userData.message);
    } else if (userData.status == 0) {
      return res.status(403).json({ message: userData.message });
    } else {
      res
        .status(200)
        .json({
          response: userData.data,
          message: userData.message,
        });
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

exports.editProfile = async (req, res) => {
  try {

    let user = await userService.editProfile(req.userData, req.body);
    if (user.status == -1) {
      throw new Error(user.message);
    }
    if (user.status == 0) {
      return res.status(403).json({ message: user.message })
    }
    res.status(200).json({ message: user.message, response: user.data });

  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

exports.VerifyEmailOtp = async (req, res) => {
  try {
    let user = await userService.VerifyEmailOtp(req.body, req.userData);
    if (user.status == 1) {
      res.status(200).json({
        message: user.message,
        reponse: user.response
      })
    } else if (user.status == 2) {
      res.status(400).json({
        message: user.message
      })
    } else {
      res.status(400).json({ message: "Something Went Wrong" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.resendEmailOtp = async (req, res) => {
  try {
    // let user = await userService.resendEmailOtp(req.body, req.userData);
    // if (user.status == 1) {
    //     res.status(200).json({
    //         message: user.message,
    //         reponse: user.response
    //     })
    // } else if (user.status == 2) {
    //     res.status(400).json({
    //         message: user.message
    //     })
    // } else {
    //     res.status(400).json({ message: "Something Went Wrong" })
    // }
    let user = await userService.resendOtp(req.body, req.userData);
    if (user.status == 1) {
      res.status(200).json({
        message: user.message,
        reponse: user.response,
        data: user.data
      })
    } else {
      res.status(400).json({
        message: user.message
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.addPet = async (req, res) => {
  try {
    let user = await userService.addPet(req.userData, req.body);

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
}

exports.productCatList = async (req, res) => {
  try {
    let data = await userService.productCatList();
    if (data.status == 0) {
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

exports.petsList = async (req, res) => {
  try {
    let data = await userService.petsList(req.userData);
    if (data.status == 0) {
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

exports.editPets = async (req, res) => {
  try {
    let user = await userService.editPets(req.userData, req.body);
    if (user.status == -1) {
      throw new Error(user.message);
    }
    if (user.status == 0) {
      return res.status(403).json({ message: user.message });
    }
    res.status(200).json({
      message: user.message,
      response: user.data,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    let data = await userService.getProfile(req.userData, req.body);
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
    let data = await userService.getMainProductCat();
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
    let data = await userService.getProductCategory();
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
    let data = await userService.getProducts(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
    }
    res.status(200).json({
      message: data.message,
      response: data.response
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    let data = await userService.addToCart(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return
    }
    if (data.status == -1) {
      res.status(400).json({
        message: data.message,
      });
      return
    }
    res.status(200).json({
      message: data.message,
      success: true,
      response: data.response
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getCartData = async (req, res) => {
  try {
    let data = await userService.getCartData(req.userData);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      cartValues: data.cartValues
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    let data = await userService.addToWishlist(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getWishlistData = async (req, res) => {
  try {
    let data = await userService.getWishlistData(req.userData);
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
    let data = await userService.removeFromWishlist(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return
    }
    res.status(200).json({
      message: data.message,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    let data = await userService.removeFromCart(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.removeCartData = async (req, res) => {
  try {
    let data = await userService.removeCartData(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.removeAllFromCart = async (req, res) => {
  try {
    let data = await userService.removeAllFromCart(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return
    }
    res.status(200).json({
      message: data.message,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    let data = await userService.getAllProducts(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

//  #################    #################

exports.addAddress = async (req, res) => {
  try {
    let data = await userService.addAddress(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.editAddress = async (req, res) => {
  try {
    let data = await userService.editAddress(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getAddress = async (req, res) => {
  try {
    let data = await userService.getAddress(req.userData);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    let data = await userService.deleteAddress(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.makeAddressPrimary = async (req, res) => {
  try {
    let data = await userService.makeAddressPrimary(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.coupenList = async (req, res) => {
  try {
    let data = await userService.coupenList(req.userData);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    let data = await userService.applyCoupon(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.removeCoupon = async (req, res) => {
  try {
    let data = await userService.removeCoupon(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.proceedToPay = async (req, res) => {
  try {
    let data = await userService.proceedToPay(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    let data = await userService.placeOrder(req.userData, req.body);
    if (data && data.status == 0) {
      res.status(403).json({
        message: data.message,
        response: data.response ? data.response : {},
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getTrackingDeviceProducts = async (req, res) => {
  try {
    let data = await userService.getTrackingDeviceProducts(req.userData);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    let data = await userService.cancelOrder(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getCancelOrderReasonList = async (req, res) => {
  try {
    let data = await userService.getCancelOrderReasonList(req.userData);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getOngoingOrderList = async (req, res) => {
  try {
    let data = await userService.getOngoingOrderList(req.userData);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getPastOrderList = async (req, res) => {
  try {
    let data = await userService.getPastOrderList(req.userData);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    let data = await userService.getOrderDetails(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.addOrderRating = async (req, res) => {
  try {
    let data = await userService.addOrderRating(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getAllRatings = async (req, res) => {
  try {
    let data = await userService.getAllRatings(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getAllAdvertisements = async (req, res) => {
  try {
    let data = await userService.getAllAdvertisements();
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getServiceCategoryList = async (req, res) => {
  try {
    let data = await userService.getServiceCategoryList();
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getServiceProviderServicesList = async (req, res) => {
  try {
    let data = await userService.getServiceProviderServicesList(req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getServiceDetails = async (req, res) => {
  try {
    let data = await userService.getServiceDetails(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.bookService = async (req, res) => {
  try {
    let data = await userService.bookService(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.filterServices = async (req, res) => {
  try {
    let data = await userService.filterServices(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.confirmPaypalBooking = async (req, res) => {
  try {
    let data = await userService.confirmPaypalBooking(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getNotificationList = async (req, res) => {
  try {
    let data = await userService.getNotificationList(req.userData);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.readNotification = async (req, res) => {
  try {
    let data = await userService.readNotification(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getOngoingServiceOrderList = async (req, res) => {
  try {
    let data = await userService.getOngoingServiceOrderList(req.userData);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getPastServiceOrderList = async (req, res) => {
  try {
    let data = await userService.getPastServiceOrderList(req.userData);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.cancelServiceOrder = async (req, res) => {
  try {
    let data = await userService.cancelServiceOrder(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getServiceOrderDetails = async (req, res) => {
  try {
    let data = await userService.getServiceOrderDetails(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.addServiceOrderRating = async (req, res) => {
  try {
    let data = await userService.addServiceOrderRating(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    if (data.status == 2) {
      res.status(400).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getServiceRatings = async (req, res) => {
  try {
    let data = await userService.getServiceRatings(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getCancelServiceOrderReasonList = async (req, res) => {
  try {
    let data = await userService.getCancelServiceOrderReasonList(req.userData);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getPackageList = async (req, res) => {
  try {
    let data = await userService.getPackageList();
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.viewPackage = async (req, res) => {
  try {
    let data = await userService.viewPackage(req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.viewPackageWithToken = async (req, res) => {
  try {
    let data = await userService.viewPackageWithToken(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.bookPackage = async (req, res) => {
  try {
    let data = await userService.bookPackage(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.filterPackage = async (req, res) => {
  try {
    let data = await userService.filterPackage(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.confirmPaypalPackageBooking = async (req, res) => {
  try {
    let data = await userService.confirmPaypalPackageBooking(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.activePackageBookingList = async (req, res) => {
  try {
    let data = await userService.activePackageBookingList(req.userData);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.closedPackageBookingList = async (req, res) => {
  try {
    let data = await userService.closedPackageBookingList(req.userData);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getProductList = async (req, res) => {
  try {
    let data = await userService.getProductList(req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
    }
    res.status(200).json({
      message: data.message,
      response: data.response
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProductList = async (req, res) => {
  try {
    let data = await userService.getAllProductList(req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
    }
    res.status(200).json({
      message: data.message,
      response: data.response
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTrackingDeviceProductList = async (req, res) => {
  try {
    let data = await userService.getTrackingDeviceProductList();
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getServiceDetailsSkip = async (req, res) => {
  try {
    let data = await userService.getServiceDetailsSkip(req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.packageBookingDetails = async (req, res) => {
  try {
    let data = await userService.packageBookingDetails(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.cancelPackageBooking = async (req, res) => {
  try {
    let data = await userService.cancelPackageBooking(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.addPackageBookingRating = async (req, res) => {
  try {
    let data = await userService.addPackageBookingRating(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getPackageRatings = async (req, res) => {
  try {
    let data = await userService.getPackageRatings(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getCancelPackageBookingReasonList = async (req, res) => {
  try {
    let data = await userService.getCancelPackageBookingReasonList();
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getTermCondition = async (req, res) => {
  try {
    let data = await userService.getTermCondition();

    res.status(200).send(data);

  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getAboutUsPage = async (req, res) => {
  try {
    let data = await userService.getAboutUsPage();

    res.status(200).send(data);

  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getContactUsPage = async (req, res) => {
  try {
    let data = await userService.getContactUsPage();

    res.status(200).send(data);

  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getPrivacyPolicy = async (req, res) => {
  try {
    let data = await userService.getPrivacyPolicy();

    res.status(200).send(data);

  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getFaqList = async (req, res) => {
  try {
    let data = await userService.getFaqList();

    res.status(200).send(data);

  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getFaqPage = async (req, res) => {
  try {
    let data = await userService.getFaqPage();

    res.status(200).send(data);

  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.generateTicket = async (req, res) => {
  try {
    let data = await userService.generateTicket(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getOrderId = async (req, res) => {
  try {
    let data = await userService.getOrderId(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getTicketList = async (req, res) => {
  try {
    let data = await userService.getTicketList(req.userData);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getWalletTransactions = async (req, res) => {
  try {
    let data = await userService.getWalletTransactions(req.userData);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getRefundList = async (req, res) => {
  try {
    let data = await userService.getRefundList(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.userLikeProduct = async (req, res) => {
  try {
    let data = await userService.userLikeProduct(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.userUnlikeProduct = async (req, res) => {
  try {
    let data = await userService.userUnlikeProduct(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.userLikePackage = async (req, res) => {
  try {
    let data = await userService.userLikePackage(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.userUnlikePackage = async (req, res) => {
  try {
    let data = await userService.userUnlikePackage(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.userLikeService = async (req, res) => {
  try {
    let data = await userService.userLikeService(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.userUnlikeService = async (req, res) => {
  try {
    let data = await userService.userUnlikeService(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.filterAllProducts = async (req, res) => {
  try {
    let data = await userService.filterAllProducts(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    let data = await userService.filterProducts(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.searchAllProducts = async (req, res) => {
  try {
    let data = await userService.searchAllProducts(req.userData, req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.searchPackageList = async (req, res) => {
  try {
    let data = await userService.searchPackageList(req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.searchServiceProviderServicesList = async (req, res) => {
  try {
    let data = await userService.searchServiceProviderServicesList(req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.searchProductGlobally = async (req, res) => {
  try {
    let data = await userService.searchProductGlobally(req.body);
    if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.topupWallet = async (req, res) => {
  try {
    let data = await userService.topupWallet(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        response: data.response
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.loginWithSocialAccount = async (req, res) => {
  try {
    let data = await userService.loginWithSocialAccount(req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        response: data.response
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.getRedeemTransactions = async (req, res) => {
  try {
    let data = await userService.getRedeemTransactions(req.userData);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.redeemPoint = async (req, res) => {
  try {
    let data = await userService.redeemPoint(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    let data = await userService.deleteAccount(req.userData);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.calculateServiceCharge = async (req, res) => {
  try {
    let data = await userService.calculateServiceCharge(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.calculateDeliveryCharge = async (req, res) => {
  try {
    let data = await userService.calculateDeliveryCharge(req.userData, req.body);
    if (data.status == 0) {
      res.status(403).json({
        message: data.message,
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.sendOtpToVerifyMobileNumber = async (req, res) => {
  try {
    let userRegisterData = await userService.sendOtpToVerifyMobileNumber(req.userData, req.body);
    if (userRegisterData.status == 1) {
      res.status(200).json({
        message: userRegisterData.message,
        reponse: userRegisterData.response,
        data: userRegisterData.data
      })
    } else {
      res.status(400).json({
        message: userRegisterData.message
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
}

exports.verifyMobileNumber = async (req, res) => {
  try {
    let userRegisterData = await userService.verifyMobileNumber(req.body, req.userData);
    if (userRegisterData.status == 1) {
      res.status(200).json({
        message: userRegisterData.message,
        reponse: userRegisterData.response
      })
    } else {
      res.status(400).json({
        message: userRegisterData.message
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error
    })
  }
}
