const router = require("express").Router();

const { celebrate } = require("celebrate");
const hostController = require("../controller/host.controller");
const hostService = require("../services/host.services");

const { requiresHostLogin } = require("../modules/auth");
const {
  CREATEHOST,
  VERIFYOTP,
  CREATEHOSTPROFILE,
  LOGIN,
  FORGETPASSWORD,
  CREATENEWPASSWORD,
  EDITPROFILE,
  CHANGEPASSWORD,
  APPLYCOUPON,
  REMOVECOUPON,
  ADDTOCART,
  ADDTOWISHLIST,
  PROCEEDTOPAY,
  PLACEORDER,
  ADDPACKAGE,
  EDITPACKAGE,
  VIEWPACKAGEDETAILS
} = require("../validation/hostValidation");
const { uploadFiles } = require("../middlewares/aws-s3");

// const authentication = require("../middlewares/authentication");
// const s3bucket = require("../modules/aws-s3");

router.post(
  "/upload_file",
  // hostController.registerHost,
  uploadFiles,
  hostController.uploadFile
);

router.post(
  "/sign_up",
  celebrate(
    {
      body: CREATEHOST,
    },
    {
      abortEarly: false,
    }
  ),
  hostController.registerHost
);

router.post(
  "/verify_otp",
  celebrate(
    {
      body: VERIFYOTP,
    },
    {
      abortEarly: false,
    }
  ),
  requiresHostLogin,
  hostController.verifyOtp
);

router.post(
  "/createHostProfile",
  celebrate(
    {
      body: CREATEHOSTPROFILE,
    },
    {
      abortEarly: false,
    }
  ),
  requiresHostLogin,
  hostController.createHostProfile
);

router.post(
  "/login",
  celebrate(
    {
      body: LOGIN,
    },
    {
      abortEarly: false,
    }
  ),
  hostController.login
);

router.post(
  "/forgetPassword",
  celebrate(
    {
      body: FORGETPASSWORD,
    },
    {
      abortEarly: false,
    }
  ),
  hostController.forgetPassword
);

router.post(
  "/createNewPassword",
  celebrate(
    {
      body: CREATENEWPASSWORD,
    },
    {
      abortEarly: false,
    }
  ),
  requiresHostLogin,
  hostController.createNewPassword
);

router.get(
      "/resendOtp", 
      requiresHostLogin, 
      hostController.resendOtp
);

router.get(
    "/getCountryList", 
    requiresHostLogin, 
    hostController.sendCountries
);

router.post(
    "/logout", 
    requiresHostLogin, 
    hostController.logout
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
  requiresHostLogin,
  hostController.editProfile
);

router.post(
  "/change_password",
  celebrate(
    {
      body : CHANGEPASSWORD,
    },
    {
      abortEarly: false,
    }
  ),
  requiresHostLogin,
  hostController.changePassword
);

router.get(
  "/get_profile",
  requiresHostLogin,
  hostController.getProfile
);

// M3
router.get(
  "/get_main_product_cat",
  requiresHostLogin,
  hostController.getMainProductCat
);

router.get(
  "/get_product_cat",
  requiresHostLogin,
  hostController.getProductCategory
);

router.post(
  "/get_products",
  requiresHostLogin,
  hostController.getProducts
);

router.post(
  "/add_to_cart",
  celebrate({ body: ADDTOCART }, { abortEarly: false }),
  requiresHostLogin,
  hostController.addToCart
);

router.get(
  "/get_cart_list",
  requiresHostLogin,
  hostController.getCartData
);

router.post(
  "/add_to_wishlist",
  celebrate({ body: ADDTOWISHLIST }, { abortEarly: false }),
  requiresHostLogin,
  hostController.addToWishlist
);

router.get(
  "/get_wishlist",
  requiresHostLogin,
  hostController.getWishlistData
);

router.post(
  "/remove_from_wishlist",
  requiresHostLogin,
  hostController.removeFromWishlist
);

router.post(
  "/remove_from_cart",
  requiresHostLogin,
  hostController.removeFromCart
);

router.post(
  "/removeAll_from_cart",
  requiresHostLogin,
  hostController.removeAllFromCart
);

router.post(
  "/decrease_cart_data",
  requiresHostLogin,
  hostController.decreaseCartData
);

router.post(
  "/get_all_product",
  requiresHostLogin,
  hostController.getAllProducts
);

router.post(
  "/add_address",
  requiresHostLogin,
  hostController.addAdress
);

router.post(
  "/edit_address",
  requiresHostLogin,
  hostController.editAdress
);

router.get(
  "/get_address_list",
  requiresHostLogin,
  hostController.getAdressList
);

router.post(
  "/delete_address",
  requiresHostLogin,
  hostController.deleteAddress
);

router.post(
  "/mark_address_primary",
  requiresHostLogin,
  hostController.makePrimaryAddress
);

router.get(
  "/coupon_list",
  requiresHostLogin,
  hostController.coupenList
);

router.post("/apply_coupon", celebrate({ body: APPLYCOUPON }, { abortEarly: false }), requiresHostLogin, hostController.applyCoupon);
router.post("/remove_coupon", celebrate({ body: REMOVECOUPON }, { abortEarly: false }), requiresHostLogin, hostController.removeCoupon);
router.post("/proceed_to_pay", celebrate({ body: PROCEEDTOPAY }, { abortEarly: false }), requiresHostLogin, hostController.proceedToPay);
router.post("/place_order", celebrate({ body: PLACEORDER }, { abortEarly: false }), requiresHostLogin, hostController.placeOrder);
router.get("/tracking_device_products", requiresHostLogin, hostController.getTrackingDeviceProducts);

// M5
router.post("/cancel_order",  requiresHostLogin, hostController.cancelOrder);
router.get("/cancel_order_reasons", requiresHostLogin, hostController.getCancelOrderReasonList);
router.get("/ongoing_order_list", requiresHostLogin, hostController.getOngoingOrderList);
router.get("/past_order_list", requiresHostLogin, hostController.getPastOrderList);
router.post("/get_order_details",  requiresHostLogin, hostController.getOrderDetails);
router.post("/add_rating",  requiresHostLogin, hostController.addOrderRating);
router.post("/get_all_ratings",  requiresHostLogin, hostController.getAllRatings);
router.get("/get_all_advertisements", requiresHostLogin, hostController.getAllAdvertisements);

// M6
router.get("/get_service_category", requiresHostLogin, hostController.getServiceCategoryList);
router.post("/get_service_provider_services", requiresHostLogin, hostController.getServiceProviderServicesList);
router.post("/get_service_details", requiresHostLogin, hostController.getServiceDetails);
router.post("/book_service", requiresHostLogin, hostController.bookService);
router.post("/filter_services", requiresHostLogin, hostController.filterServices);

// M7
router.post("/confirm_paypal_booking", requiresHostLogin, hostController.confirmPaypalBooking);
router.get("/notification_list", requiresHostLogin, hostController.getNotificationList);
router.post("/read_notification", requiresHostLogin, hostController.readNotification);

// M8
router.get("/ongoing_service_orders", requiresHostLogin, hostController.getOngoingServiceOrderList);
router.get("/past_service_orders", requiresHostLogin, hostController.getPastServiceOrderList);
router.post("/cancel_service_order", requiresHostLogin, hostController.cancelServiceOrder);
router.post("/service_order_details", requiresHostLogin, hostController.getServiceOrderDetails);
router.post("/add_service_rating", requiresHostLogin, hostController.addServiceOrderRating);
router.post("/get_service_ratings", requiresHostLogin, hostController.getServiceRatings);
router.get("/cancel_service_order_reasons", requiresHostLogin, hostController.getCancelServiceOrderReasonList);


// M9
  
router.post("/add_package",celebrate({ body: ADDPACKAGE }, { abortEarly: false }), requiresHostLogin, hostController.addPackage);
router.post("/edit_package",celebrate({ body: EDITPACKAGE }, { abortEarly: false }), requiresHostLogin, hostController.editPackage);
router.get("/get_package_list", requiresHostLogin, hostController.getPackage);
router.get("/get_breed_list", requiresHostLogin, hostController.getBreedList);
router.post("/view_package", requiresHostLogin, hostController.viewPackge);
router.post("/delete_package", requiresHostLogin, hostController.deletePackage);

// M11

router.get("/new_services_list", requiresHostLogin, hostController.newServicesList);
router.post("/view_services_details", requiresHostLogin,celebrate({ body: VIEWPACKAGEDETAILS }, { abortEarly: false }), hostController.viewPackgeDetails);
router.get("/active_services_list", requiresHostLogin, hostController.activeServicesList);
router.get("/past_services_list", requiresHostLogin, hostController.pastServicesList);
router.post("/update_package_status", requiresHostLogin, hostController.updateServicesStatus);

// M12

router.get("/packages_payment", requiresHostLogin, hostController.packagesPayment);
router.post("/packages_payment_filter", requiresHostLogin, hostController.filterPackagePaymentList);
router.post("/pending_payout", requiresHostLogin, hostController.pendingPayout);
router.get("/host_term_condition",  hostController.hostTermCondition);
router.get("/host_about_us",  hostController.hostAboutUs);
router.get("/host_contact_us",  hostController.hostContactUs);
router.get("/host_privacy_policy",  hostController.hostPrivacyPolicy);
router.get("/host_faq",  hostController.getHostFaqList);
router.get("/faq",  hostController.getHostFaq);
router.post("/dashboard", requiresHostLogin, hostController.getDashboardData);
router.post("/get_refund_list", requiresHostLogin, hostController.getRefundList);

// CR 
router.post("/host_like_product", requiresHostLogin, hostController.hostLikeProduct);
router.post("/host_unlike_product", requiresHostLogin, hostController.hostUnlikeProduct);

router.post("/host_like_service", requiresHostLogin, hostController.hostLikeService);
router.post("/host_unlike_service", requiresHostLogin, hostController.hostUnlikeService);
router.post("/filter_all_products", requiresHostLogin, hostController.filterAllProducts);
router.post("/filter_products", requiresHostLogin, hostController.filterProducts);
router.post("/search_all_product", requiresHostLogin, hostController.searchAllProducts);
router.post("/search_package_list", requiresHostLogin, hostController.searchPackage);
router.post("/search_service_provider_services", requiresHostLogin, hostController.searchServiceProviderServicesList);
router.post("/search_product_global", hostController.searchProductGlobally);
router.get("/delete_account", requiresHostLogin, hostController.deleteAccount);
router.post("/calculate_service_charge", requiresHostLogin, hostController.calculateServiceCharge);
router.post("/update_host_data", requiresHostLogin, hostController.updateHostData);


module.exports = router;