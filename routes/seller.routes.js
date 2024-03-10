const router = require("express").Router();
const { celebrate } = require("celebrate");
const sellerController = require("../controller/seller.controller");
const seller = require("../middlewares/authentication");
const { uploadFiles } = require("../middlewares/aws-s3");

const {
  REGISTERSELLER,
  OTP,
  COMPLETEPROFILE,
  BANKSECUTITY,
  FORGETPASSWORD,
  RESETPASSWORD,
  LOGIN,

  EDITPROFILE,
  EDITADDRESS,
  CHANGEPASSWORD,
  ADDPRODUCT,
  DELETEPRODUCT,

  UPDATEPRODUCTQUANTITY,
  UPDATESKULMINLIMIT,
  UPDATEPRODUCTSTATUS,
  PENDINGORDERS,
  UPDATEORDERSTATUS,
  GENERATEINVOICE,
} = require("../validation/sellerValidation");


router.post(
  "/upload_file",
  seller.verifySellerToken,
  uploadFiles,
  sellerController.uploadFile
);

router.post(
  "/registerSeller",
  celebrate({ body: REGISTERSELLER }, { abortEarly: false }),
  sellerController.registerSeller
);

router.post(
  "/verifyOtp",
  celebrate({ body: OTP }, { abortEarly: false }),
  seller.verifySellerToken,
  sellerController.verifyOtp
);

router.post(
  "/comleteProfile",
  celebrate({ body: COMPLETEPROFILE }, { abortEarly: false }),
  seller.verifySellerToken,
  sellerController.comleteProfile
);

router.get("/resendOtp", seller.verifySellerToken, sellerController.resendOtp);

router.post(
  "/bankSecurityAdd",
  celebrate({ body: BANKSECUTITY }, { abortEarly: false }),
  seller.verifySellerToken,
  sellerController.bankSecurityAdd
);

router.post(
  "/forgetPassword",
  celebrate({ body: FORGETPASSWORD }, { abortEarly: false }),
  sellerController.forgotPassword
);

router.post(
  "/resetPassword",
  celebrate({ body: RESETPASSWORD }, { abortEarly: false }),
  seller.verifySellerToken,
  sellerController.resetPassword
);

router.post(
  "/login",
  celebrate({ body: LOGIN }, { abortEarly: false }),
  sellerController.login
);

router.post(
  "/logout",
  seller.verifySellerToken,
  sellerController.logout
);

router.post(
  "/edit_profile",
  celebrate(
    {
      body: EDITPROFILE,
    },
    {
      abortEarly: false,
    }
  ),
  seller.verifySellerToken,
  sellerController.editProfile
);

router.post(
  "/edit_address",
  celebrate(
    {
      body: EDITADDRESS,
    },
    {
      abortEarly: false,
    }
  ),
  seller.verifySellerToken,
  sellerController.editAddress
);

router.post(
  "/change_password",
  celebrate(
    {
      body: CHANGEPASSWORD,
    },
    {
      abortEarly: false,
    }
  ),
  seller.verifySellerToken,
  sellerController.changePassword
);

router.get(
  "/product_cat_List",
  seller.verifySellerToken,
  sellerController.productCatList
);

router.post(
  "/product_sub_cat_List",
  seller.verifySellerToken,
  sellerController.productSubCatList
);

router.post(
  "/add_seller_product",
  celebrate(
    {
      body: ADDPRODUCT,
    },
    {
      abortEarly: false,
    }
  ),
  seller.verifySellerToken,
  sellerController.addSellerProduct
);

router.get(
  "/seller_product_list",
  seller.verifySellerToken,
  sellerController.sellerAllProductList
);

router.post(
  "/edit_seller_product",
  seller.verifySellerToken,
  sellerController.editSellerProduct
)

router.post(
  "/delete_seller_product",
  celebrate(
    {
      body: DELETEPRODUCT,
    },
    {
      abortEarly: false,
    }
  ),
  seller.verifySellerToken,
  sellerController.deleteSellerProduct
);

router.get(
  "/get_profile",
  seller.verifySellerToken,
  sellerController.getProfile
);

router.get(
  "/get_main_product_list",
  seller.verifySellerToken,
  sellerController.productMainCat
);
router.post(
  "/update_seller_product_quantity",
  celebrate(
    {
      body: UPDATEPRODUCTQUANTITY,
    },
    {
      abortEarly: false,
    }
  ),
  seller.verifySellerToken,
  sellerController.updateSellerProductQuantity
);

router.post(
  "/update_sku_min_limit",
  celebrate(
    {
      body: UPDATESKULMINLIMIT,
    },
    {
      abortEarly: false,
    }
  ),
  seller.verifySellerToken,
  sellerController.updateSkuMinLimit
);

router.post(
  "/update_product_status",
  celebrate(
    {
      body: UPDATEPRODUCTSTATUS,
    },
    {
      abortEarly: false,
    }
  ),
  seller.verifySellerToken,
  sellerController.updateProductStatus
);

router.post(
  "/get_orders",
  celebrate(
    {
      body: PENDINGORDERS,
    },
    {
      abortEarly: false,
    }
  ),
  seller.verifySellerToken,
  sellerController.getOrders
);

router.post(
  "/update_order_status",
  celebrate(
    {
      body: UPDATEORDERSTATUS,
    },
    {
      abortEarly: false,
    }
  ),
  seller.verifySellerToken,
  sellerController.updateOrderStatus
);

router.get(
  "/generate_invoice/:id",
  seller.verifySellerToken,
  sellerController.generateInvoice
);

//============================> M5 <============================

router.get(
  "/paymentList",
  seller.verifySellerToken,
  sellerController.getPaymentList
);

router.post(
  "/filter_payment_list",
  seller.verifySellerToken,
  sellerController.filterPayment
);

router.post(
  "/dashboard",
  seller.verifySellerToken,
  sellerController.getDashboardData
);

router.get(
  "/notification_list",
  seller.verifySellerToken,
  sellerController.getNotificationList
);

//============================> M8 <============================

router.get(
  "/read_all_notification",
  seller.verifySellerToken,
  sellerController.readAllNotification
)

//============================> M12 <============================
router.get(
  "/seller_term_condition",
  sellerController.getTermCondition
)

router.get(
  "/seller_privacy_policy",
  sellerController.getPrivacyPolicy
)

router.get(
  "/seller_about_us",
  sellerController.getAboutUs
)

router.get(
  "/seller_legal",
  sellerController.getLegal
)

router.get(
  "/get_adv_list",
  sellerController.getAllAdvertisements
);

router.post(
  "/get_seller_report",
  seller.verifySellerToken,
  sellerController.getSellerReport
)

router.get(
  "/delete_account",
  seller.verifySellerToken,
  sellerController.deleteAccount
)

router.post(
  "/update_seller_data",
  seller.verifySellerToken,
  sellerController.updateSellerData
)

router.post(
  "/get_order_details",
  seller.verifySellerToken,
  sellerController.getOrderDetails
)

module.exports = router;
