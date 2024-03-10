const adminService = require("../services/adminService");

exports.uploadFile = async (req, res) => {
  try {
      let data = await adminService.uploadFile(req);
      if (data.status == -1) {
          throw new Error(data.message);
      } else if (data.status == 0) {
          return res.status(403).json({ message: data.message });
      } else {
          res.status(200).json({ response: data.data, message: data.message });
      }
  } catch (error) {
      res.status(403).json({ message: error.message });
  }
}


exports.registerAdmin = async (req, res) => {
  try {
    let data = await adminService.registerAdmin(req.body);

    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else if (data.status == 2) {
      res.status(400).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    let data = await adminService.loginAdmin(req.body);

    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
    } else if (data.status == -1) {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    let data = await adminService.forgetPassword(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else if (data.status == 2) {
      res.status(403).json({
        message: data.message,
      });
    } else if (data.status == 3) {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    let data = await adminService.verifyOTP(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    let adminData = await adminService.resetPassword(req.body);
    if (adminData.status == 1) {
      res.status(200).json({
        message: adminData.message,
        reponse: adminData.response,
        data: adminData.data,
      });
    } else {
      res.status(400).json({
        message: adminData.message,
      });
    }
  } catch (error) {}
};

exports.allUser = async (req, res) => {
  try {
    let data = await adminService.allUser();
    if (data.status == 1) {
      res.status(200).json({
        response: data.response,
        message: data.message,
      });
    }
    res.status(403).json({ message: data.message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    let data = await adminService.blockUser(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    }
    if (data.status == 2) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.allHost = async (req, res) => {
  try {
    let data = await adminService.allHost();
    if (data.status == 1) {
      res.status(200).json({
        response: data.response,
        message: data.message,
      });
    }
    res.status(403).json({ message: data.message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptRejectHost = async (req, res) => {
  try {
    let data = await adminService.acceptRejectHost(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    }
    if (data.status == 2) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.blockUnblockHost = async (req, res) => {
  try {
    let data = await adminService.blockUnblockHost(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    }
    if (data.status == 2) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.allSeller = async (req, res) => {
  try {
    let data = await adminService.allSeller();
    if (data.status == 1) {
      res.status(200).json({
        response: data.response,
        message: data.message,
      });
    }
    res.status(403).json({ message: data.message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptRejectSeller = async (req, res) => {
  try {
    let data = await adminService.acceptRejectSeller(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    }
    if (data.status == 2) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.blockUnblockSeller = async (req, res) => {
  try {
    let data = await adminService.blockUnblockSeller(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    }
    if (data.status == 2) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.allService = async (req, res) => {
  try {
    let data = await adminService.allService();
    if (data.status == 1) {
      res.status(200).json({
        response: data.response,
        message: data.message,
      });
    }
    res.status(403).json({ message: data.message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptRejectService = async (req, res) => {
  try {
    let data = await adminService.acceptRejectService(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    }
    if (data.status == 2) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.blockUnblockService = async (req, res) => {
  try {
    let data = await adminService.blockUnblockService(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    }
    if (data.status == 2) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    let data = await adminService.createCategory(req.body, req.files);

    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.categoryList = async (req, res) => {
  try {
    let data = await adminService.categoryList();

    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editCategory = async (req, res) => {
  try {
    let data = await adminService.editCategory(req.body, req.files);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    let data = await adminService.deleteCategory(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addSubCategory = async (req, res) => {
  try {
    let data = await adminService.addSubCategory(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.productSubCatList = async (req, res) => {
  try {
    let data = await adminService.productSubCatList(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editProductSubCat = async (req, res) => {
  try {
    let data = await adminService.editProductSubCat(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.subCatDelete = async (req, res) => {
  try {
    let data = await adminService.subCatDelete(req.body);

    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(400).json({
        message: data.message,
      });
    }
  } catch (error) {}
};

exports.addTrackingDevice = async (req, res) => {
  try {
    let data = await adminService.addTrackingDevice(req.body, req.files);

    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editTrackingDevice = async (req, res) => {
  try {
    let data = await adminService.editTrackingDevice(req.body, req.files);

    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackingDeviceList = async (req, res) => {
  try {
    let data = await adminService.trackingDeviceList(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTrackingDevice = async (req, res) => {
  try {
    let data = await adminService.deleteTrackingDevice(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(400).json({
        message: data.message,
      });
    }
  } catch (error) {}
};

exports.blockUnblockTrackingDevice = async (req, res) => {
  try {
    let data = await adminService.blockUnblockTrackingDevice(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(400).json({
        message: data.message,
      });
    }
  } catch (error) {}
};

exports.productMainCategory = async (req, res) => {
  try {
    let data = await adminService.productMainCategory(req.body, req.files);

    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.mainCategoryList = async (req, res) => {
  try {
    let data = await adminService.mainCategoryList();

    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editMainCategory = async (req, res) => {
  try {
    let data = await adminService.editMainCategory(req.body, req.files);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMainCategory = async (req, res) => {
  try {
    let data = await adminService.deleteMainCategory(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addInventory = async (req, res) => {
  try {
    let data = await adminService.addInventory(req.body);

    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.addPromocode = async (req, res) => {
  try {
    let data = await adminService.addPromocode(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.editPromocode = async (req, res) => {
  try {
    let data = await adminService.editPromocode(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.promocodeList = async (req, res) => {
  try {
    let data = await adminService.promocodeList(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deletePromocode = async (req, res) => {
  try {
    let data = await adminService.deletePromocode(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.blockPromocode = async (req, res) => {
  try {
    let data = await adminService.blockPromocode(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else if (data.status == 2) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.InventoryList = async (req, res) => {
  try {
    let data = await adminService.InventoryList(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateInventoryStatus = async (req, res) => {
  try {
    let data = await adminService.updateInventoryStatus(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else if (data.status == 2) {
      res.status(200).json({
        response: data.response,
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// showUser

exports.showToUser = async (req, res) => {
  try {
    let data = await adminService.showToUser(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    }
    res.status(403).json({
      message: data.message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// showToHost

exports.showToHost = async (req, res) => {
  try {
    let data = await adminService.showToHost(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    }
    res.status(403).json({
      message: data.message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sellerOrderHostUserList = async (req, res) => {
  try {
    let data = await adminService.sellerOrderHostUserList(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.trackingOrderList = async (req, res) => {
  try {
    let data = await adminService.trackingOrderList();
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.trackingUserOrderAcceptReject = async (req, res) => {
  try {
    let data = await adminService.trackingUserOrderAcceptReject(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.trackingHostOrderAcceptReject = async (req, res) => {
  try {
    let data = await adminService.trackingHostOrderAcceptReject(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.onGoingStatusForUser = async (req, res) => {
  try {
    let data = await adminService.onGoingStatusForUser(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.onGoingStatusForHost = async (req, res) => {
  try {
    let data = await adminService.onGoingStatusForHost(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateTrackingUserOrderStatus = async (req, res) => {
  try {
    let data = await adminService.updateTrackingUserOrderStatus(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateTrackingHostOrderStatus = async (req, res) => {
  try {
    let data = await adminService.updateTrackingHostOrderStatus(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.addAdvertisement = async (req, res) => {
  try {
    let data = await adminService.addAdvertisement(req.body);
    if (data.status == 1) {
      res.status(200).json({
        message: data.message,
        response: data.response,
      });
    } else {
      res.status(403).json({
        message: data.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.editAdvertisement = async (req, res) => {
  try {
    let userData = await adminService.editAdvertisement(req.body);
    if (userData.status == -1) {
      throw new Error(userData.message);
    }
    if (userData.status == 0) {
      return res.status(403).json({ message: userData.message });
    }
    res
      .status(200)
      .json({ message: userData.message, response: userData.data });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

exports.deleteAdvertisement = async (req, res) => {
    try {
        let data = await adminService.deleteAdvertisement(req.body);
        if (data.status == 1) {
          res.status(200).json({
            message: data.message,
            response: data.response,
          });
        } else {
          res.status(403).json({
            message: data.message,
          });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

exports.getAdvertisement = async (req, res) => {
    try {
        let data = await adminService.getadvertisement();
        if (data.status == 1) {
          res.status(200).json({
            response: data.response,
            message: data.message,
          });
        }
        res.status(403).json({ message: data.message });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

exports.blockUnblockAdverisement = async (req, res) =>{
    try {
        let userData = await adminService.blockUnblockAdverisement(req.body);
        if (userData.status == -1) {
            throw new Error(userData.message);
        }
        if (userData.status == 0) {
            return res.status(403).json({ message: userData.message });
        }
        res.status(200).json({ message: userData.message  });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

exports.getAllAdminProductReviews = async (req, res) =>{
  try {
      let userData = await adminService.getAllAdminProductReviews(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.viewOrderAllRatingReview = async (req, res) =>{
  try {
      let userData = await adminService.viewOrderAllRatingReview(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.addServiceCategory = async (req, res) =>{
  try {
      let userData = await adminService.addServiceCategory(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.editServiceCategory = async (req, res) =>{
  try {
      let userData = await adminService.editServiceCategory(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.deleteServiceCategory = async (req, res) =>{
  try {
      let userData = await adminService.deleteServiceCategory(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getServiceCategoryList = async (req, res) =>{
  try {
      let userData = await adminService.getServiceCategoryList();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.blockUnblockServiceCategory = async (req, res) =>{
  try {
      let userData = await adminService.blockUnblockServiceCategory(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.updateCommission = async (req, res) =>{
  try {
      let userData = await adminService.updateCommission(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getCommission = async (req, res) =>{
  try {
      let userData = await adminService.getCommission();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.trackingOrderPaymentList = async (req, res) =>{
  try {
      let userData = await adminService.trackingOrderPaymentList();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.sellerOrderPaymentList = async (req, res) =>{
  try {
      let userData = await adminService.sellerOrderPaymentList();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.addSubAdmin = async (req, res) =>{
  try {
      let userData = await adminService.addSubAdmin(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.editSubAdmin = async (req, res) =>{
  try {
      let userData = await adminService.editSubAdmin(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getSubAdminList = async (req, res) =>{
  try {
      let userData = await adminService.getSubAdminList();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.blockUnblockSubAdmin = async (req, res) =>{
  try {
      let userData = await adminService.blockUnblockSubAdmin(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getNewBookedServices = async (req, res) =>{
  try {
      let userData = await adminService.getNewBookedServices();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getOngoingBookedServices = async (req, res) =>{
  try {
      let userData = await adminService.getOngoingBookedServices();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getPastBookedServices = async (req, res) =>{
  try {
      let userData = await adminService.getPastBookedServices();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getBookedServicesPayment = async (req, res) =>{
  try {
      let userData = await adminService.getBookedServicesPayment();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}


exports.getNewPackageBookingList = async (req, res) =>{
  try {
      let userData = await adminService.getNewPackageBookingList();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getOngoingPackageBookingList = async (req, res) =>{
  try {
      let userData = await adminService.getOngoingPackageBookingList();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getPastPackageBookingList = async (req, res) =>{
  try {
      let userData = await adminService.getPastPackageBookingList();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getHostPackageList = async (req, res) =>{
  try {
      let userData = await adminService.getHostPackageList();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getSettingData = async (req, res) =>{
  try {
      let userData = await adminService.getSettingData();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.updateSettingData = async (req, res) =>{
  try {
      let userData = await adminService.updateSettingData(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.addNewFaq = async (req, res) =>{
  try {
      let userData = await adminService.addNewFaq(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getFaqData = async (req, res) =>{
  try {
      let userData = await adminService.getFaqData();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getHostSettingData = async (req, res) =>{
  try {
      let userData = await adminService.getHostSettingData();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.updateHostSettingData = async (req, res) =>{
  try {
      let userData = await adminService.updateHostSettingData(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getSellerSettingData = async (req, res) =>{
  try {
      let userData = await adminService.getSellerSettingData();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.updateSellerSettingData = async (req, res) =>{
  try {
      let userData = await adminService.updateSellerSettingData(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getServiceSettingData = async (req, res) =>{
  try {
      let userData = await adminService.getServiceSettingData();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.updateServiceSettingData = async (req, res) =>{
  try {
      let userData = await adminService.updateServiceSettingData(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.addHostNewFaq = async (req, res) =>{
  try {
      let userData = await adminService.addHostNewFaq(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getHostFaqData = async (req, res) =>{
  try {
      let userData = await adminService.getHostFaqData();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.addSellerNewFaq = async (req, res) =>{
  try {
      let userData = await adminService.addSellerNewFaq(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getSellerFaqData = async (req, res) =>{
  try {
      let userData = await adminService.getSellerFaqData();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.addServiceFaq = async (req, res) =>{
  try {
      let userData = await adminService.addServiceFaq(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getServiceFaqData = async (req, res) =>{
  try {
      let userData = await adminService.getServiceFaqData();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getUserList = async (req, res) =>{
  try {
      let userData = await adminService.getUserList();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getHostList = async (req, res) =>{
  try {
      let userData = await adminService.getHostList();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getSellerList = async (req, res) =>{
  try {
      let userData = await adminService.getSellerList();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getServiceProviderList = async (req, res) =>{
  try {
      let userData = await adminService.getServiceProviderList();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.sendNotification = async (req,res) =>{
  try {
      let userData = await adminService.sendNotification(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getHostRefundList = async (req, res) =>{
  try {
      let userData = await adminService.getHostRefundList(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.refundHostOrder = async (req, res) =>{
  try {
      let userData = await adminService.refundHostOrder();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getSupportList = async (req, res) =>{
  try {
      let userData = await adminService.getSupportList();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.updateSupport = async (req, res) =>{
  try {
      let userData = await adminService.updateSupport(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getUserRefundList = async (req, res) =>{
  try {
      let userData = await adminService.getUserRefundList(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.refundUserOrder = async (req, res) =>{
  try {
      let userData = await adminService.refundUserOrder(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getPackagePayment = async (req, res) =>{
  try {
      let userData = await adminService.getPackagePayment();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.notificationList = async (req, res) =>{
  try {
      let userData = await adminService.notificationList();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.blockUnblockNotification = async (req, res) =>{
  try {
      let userData = await adminService.blockUnblockNotification(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.deleteNotification = async (req, res) =>{
  try {
      let userData = await adminService.deleteNotification(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}


exports.setHealthGoalPoint = async (req, res) =>{
  try {
      let userData = await adminService.setHealthGoalPoint(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.setUsageLimitPurchage = async (req, res) =>{
  try {
      let userData = await adminService.setUsageLimitPurchage(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getSmileHealthPoints = async (req, res) =>{
  try {
      let userData = await adminService.getSmileHealthPoints(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}
// exports.changePassword = async (req, res) =>{
//   try {
//       let userData = await adminService.changePassword(req.body);
//       if (userData.status == -1) {
//           throw new Error(userData.message);
//       }
//       if (userData.status == 0) {
//           return res.status(403).json({ message: userData.message });
//       }
//       res.status(200).json({ message: userData.message  });
//   } catch (error) {
//       res.status(401).json({ message: error.message });
//   }
// }

exports.updateServiceCharge = async (req, res) =>{
  try {
      let userData = await adminService.updateServiceCharge(req.body);
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}

exports.getServiceCharge = async (req, res) =>{
  try {
      let userData = await adminService.getServiceCharge();
      if (userData.status == -1) {
          throw new Error(userData.message);
      }
      if (userData.status == 0) {
          return res.status(403).json({ message: userData.message });
      }
      res.status(200).json({ message: userData.message, response: userData.data  });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
}