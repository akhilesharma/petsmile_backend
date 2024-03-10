const router = require("express").Router();
const userController = require("../controller/user.controller");
const user = require("../middlewares/authentication");
const { celebrate } = require("celebrate");
const { uploadFiles } = require("../middlewares/aws-s3");

const {
// REGISTERSELLER,
// OTP,
// COMPLETEPROFILE,
// BANKSECUTITY,
// FORGETPASSWORD,
// RESETPASSWORD,
LOGIN,
// EDITPROFILE,
// EDITADDRESS,
CHANGEPASSWORD,
EDITPROFILE,
ADDPET,
EDITPET,
ADDTOCART,
ADDADDRESS,
DELETEADDRESS,
EDITADDRESS,
PROCEEDTOPAY,
PLACEORDER,
APPLYCOUPON,
REMOVECOUPON,
PRIMARYADDRESS,
BOOKPACKAGE,
SENDOTPTOVERIFYMOBILENUMBER,
VERIFYMOBILENUMBER
} = require("../validation/userValidation");

router.post("/upload_file",user.verifyUserToken,uploadFiles,userController.uploadFile);
router.post("/registerUser", userController.registerUser);

router.post("/VerifyOtp", user.verifyUserToken, userController.VerifyOtp);

router.post("/comleteProfile",user.verifyUserToken,userController.comleteProfile);

router.post("/resendOtp", user.verifyUserToken, userController.resendOtp);


router.post(
  "/loginUser",
  celebrate({ body: LOGIN }, { abortEarly: false }),
  userController.loginUser
);


router.post("/forgotPassword", userController.forgotPassword);

router.post(
  "/resetPassword",
  user.verifyUserToken,
  userController.resetPassword
);

router.post("/logout", user.verifyUserToken, userController.logout);

router.post(
  "/change_password",
  celebrate({ body: CHANGEPASSWORD }, { abortEarly: false }),
  user.verifyUserToken,
  userController.changePassword
);

router.get("/pets_list", user.verifyUserToken, userController.petsList);

router.post(
  "/add_pet_details",
  celebrate({ body: ADDPET }, { abortEarly: false }),
  user.verifyUserToken,
  userController.addPet
);

router.post(
  "/edit_pet_details",
  celebrate({ body: EDITPET }, { abortEarly: false }),
  user.verifyUserToken,
  userController.editPets
);

router.get(
  "/product_cat_List",
  // user.verifyUserToken,
  userController.productCatList
);

router.post(
  "/edit_profile",
  celebrate({ body: EDITPROFILE }, { abortEarly: false }),
  user.verifyUserToken,
  userController.editProfile
);

router.post(
  "/verify_email_otp",
  // celebrate({ body: EDITPROFILE }, { abortEarly: false }),
  user.verifyUserToken,
  userController.VerifyEmailOtp
);

router.get(
  "/resend_email_otp",
  user.verifyUserToken,
  userController.resendEmailOtp
);

router.get(
  "/get_profile",
  user.verifyUserToken,
  userController.getProfile
);

// ======== M3 ==========
router.get(
  "/get_main_product_cat",
  // user.verifyUserToken,
  userController.getMainProductCat
);
router.get(
  "/get_product_cat",
  // user.verifyUserToken,
  userController.getProductCategory
);
router.post(
  "/get_products",
  user.verifyUserToken,
  userController.getProducts
);

router.post(
  "/add_to_cart",
  celebrate({ body: ADDTOCART }, { abortEarly: false }),
  user.verifyUserToken,
  userController.addToCart
);

router.get(
  "/get_cart_data",
  user.verifyUserToken,
  userController.getCartData
);


router.post(
  "/add_to_wishlist",
  // celebrate({ body: ADDTOCART }, { abortEarly: false }),
  user.verifyUserToken,
  userController.addToWishlist
);

router.get(
  "/get_wishlist_data",
  user.verifyUserToken,
  userController.getWishlistData
);

router.post(
  "/remove_from_wishlist",
  user.verifyUserToken,
  userController.removeFromWishlist
);

router.post(
  "/remove_from_cart",
  user.verifyUserToken,
  userController.removeFromCart
);

router.post(
  "/remove_cart_data",
  user.verifyUserToken,
  userController.removeCartData
);

router.post(
  "/removeAll_from_cart",
  user.verifyUserToken,
  userController.removeAllFromCart
);

router.post(
  "/get_all_product",
  user.verifyUserToken,
  userController.getAllProducts
);


// ###########  M4 Pet Smile User API's List   ############

// 1. Get Saved Address API           ====  Done 
// 2. Add Address API                 ====  Done
// 3. Delete Address API              ====  Done
// 4. Make Address Primary API        ====  Done
// 5. Order Checkout(Post) API        ====  
// 6. Get Notification List API       ====  
// 7. Get Coupon List API             ====  Done
// 8. Apply Coupon API                ====  Done
// 9. Remove Coupon                   ====  
// 9. Edit Address                    ====  

router.post(
  "/add_address",
  celebrate({ body: ADDADDRESS }, { abortEarly: false }),
  user.verifyUserToken,
  userController.addAddress
);

router.post(
  "/edit_address",
  celebrate({ body: EDITADDRESS }, { abortEarly: false }),
  user.verifyUserToken,
  userController.editAddress
);

router.get(
  "/get_address",
  user.verifyUserToken,
  userController.getAddress
);

router.post(
  "/delete_address",
  celebrate({ body: DELETEADDRESS }, { abortEarly: false }),
  user.verifyUserToken,
  userController.deleteAddress
);

router.post(
  "/make_address_primary",
  celebrate({ body: PRIMARYADDRESS }, { abortEarly: false }),
  user.verifyUserToken,
  userController.makeAddressPrimary
);

router.get(
  "/coupon_list",
  user.verifyUserToken,
  userController.coupenList
);

router.post(
  "/apply_coupon",
  celebrate({ body: APPLYCOUPON }, { abortEarly: false }),
  user.verifyUserToken,
  userController.applyCoupon
);

router.post("/remove_coupon", celebrate({ body: REMOVECOUPON }, { abortEarly: false }), user.verifyUserToken, userController.removeCoupon);

router.post(
  "/proceed_to_pay",
  celebrate({ body: PROCEEDTOPAY }, { abortEarly: false }),
  user.verifyUserToken,
  userController.proceedToPay
);

router.post(
  "/place_order",
  celebrate({ body: PLACEORDER }, { abortEarly: false }),
  user.verifyUserToken,
  userController.placeOrder
);

router.get(
  "/tracking_device_products",
  user.verifyUserToken,
  userController.getTrackingDeviceProducts
);

//M5
router.post("/cancel_order", user.verifyUserToken, userController.cancelOrder);
router.get("/cancel_order_reasons", user.verifyUserToken, userController.getCancelOrderReasonList);
router.get("/ongoing_order_list", user.verifyUserToken, userController.getOngoingOrderList);
router.get("/past_order_list", user.verifyUserToken, userController.getPastOrderList);
router.post("/get_order_details", user.verifyUserToken, userController.getOrderDetails);
router.post("/add_rating", user.verifyUserToken, userController.addOrderRating);
router.post("/get_all_ratings", user.verifyUserToken, userController.getAllRatings);
router.get("/get_all_advertisements", userController.getAllAdvertisements);

//M6
router.get("/get_service_category", userController.getServiceCategoryList);
router.post("/get_service_provider_services", userController.getServiceProviderServicesList);
router.post("/get_service_details", user.verifyUserToken, userController.getServiceDetails);
router.post("/book_service", user.verifyUserToken, userController.bookService);
router.post("/filter_services", user.verifyUserToken, userController.filterServices);

//M7
router.post("/confirm_paypal_booking", user.verifyUserToken, userController.confirmPaypalBooking);
router.get("/notification_list", user.verifyUserToken, userController.getNotificationList);
router.post("/read_notification", user.verifyUserToken, userController.readNotification);

//M8
router.get("/ongoing_service_orders", user.verifyUserToken, userController.getOngoingServiceOrderList);
router.get("/past_service_orders", user.verifyUserToken, userController.getPastServiceOrderList);
router.post("/cancel_service_order", user.verifyUserToken, userController.cancelServiceOrder);
router.post("/service_order_details", user.verifyUserToken, userController.getServiceOrderDetails);
router.post("/add_service_rating", user.verifyUserToken, userController.addServiceOrderRating);
router.post("/get_service_ratings", user.verifyUserToken, userController.getServiceRatings);
router.get("/cancel_service_order_reasons", user.verifyUserToken, userController.getCancelServiceOrderReasonList);

//M10
router.post("/get_product_list", userController.getProductList);
router.post("/get_all_product_list", userController.getAllProductList);
router.get("/tracking_device_product_list", userController.getTrackingDeviceProductList);
router.post("/get_service_details_skip", userController.getServiceDetailsSkip);

// M11
router.get("/get_package_list", userController.getPackageList);
router.post("/view_package", userController.viewPackage);
router.post("/view_package_with_token", user.verifyUserToken, userController.viewPackageWithToken);
router.post("/book_package", celebrate({ body: BOOKPACKAGE }, { abortEarly: false }), user.verifyUserToken, userController.bookPackage);
router.post("/filter_package", user.verifyUserToken, userController.filterPackage);
router.post("/confirm_paypal_package_booking", user.verifyUserToken, userController.confirmPaypalPackageBooking);
router.get("/active_package_bookings", user.verifyUserToken, userController.activePackageBookingList);
router.get("/closed_package_bookings", user.verifyUserToken, userController.closedPackageBookingList);
router.post("/package_booking_details", user.verifyUserToken, userController.packageBookingDetails);

router.post("/cancel_package_booking", user.verifyUserToken, userController.cancelPackageBooking);
router.post("/add_package_rating", user.verifyUserToken, userController.addPackageBookingRating);
router.post("/get_package_ratings", user.verifyUserToken, userController.getPackageRatings);
router.get("/cancel_package_booking_reasons", userController.getCancelPackageBookingReasonList);

router.get("/term_condition", userController.getTermCondition);
router.get("/about_us", userController.getAboutUsPage);
router.get("/contact_us", userController.getContactUsPage);
router.get("/privacy_policy", userController.getPrivacyPolicy);
router.get("/get_faq_list", userController.getFaqList);
router.get("/faq", userController.getFaqPage);
router.post("/generate_ticket", user.verifyUserToken, userController.generateTicket);
router.post("/get_order_id", user.verifyUserToken, userController.getOrderId);
router.get("/get_ticket_list", user.verifyUserToken, userController.getTicketList);

//M12
router.get("/wallet_transactions", user.verifyUserToken, userController.getWalletTransactions);
router.post("/get_refund_list", user.verifyUserToken, userController.getRefundList);

// CR 
router.post("/user_like_product", user.verifyUserToken, userController.userLikeProduct);
router.post("/user_unlike_product", user.verifyUserToken, userController.userUnlikeProduct);

router.post("/user_like_package", user.verifyUserToken, userController.userLikePackage);
router.post("/user_unlike_package", user.verifyUserToken, userController.userUnlikePackage);

router.post("/user_like_service", user.verifyUserToken, userController.userLikeService);
router.post("/user_unlike_service", user.verifyUserToken, userController.userUnlikeService);
router.post("/filter_all_products", user.verifyUserToken, userController.filterAllProducts);
router.post("/filter_products", user.verifyUserToken, userController.filterProducts);

router.post("/search_all_product", user.verifyUserToken, userController.searchAllProducts);
router.post("/search_package_list", userController.searchPackageList);
router.post("/search_service_provider_services", userController.searchServiceProviderServicesList);
router.post("/search_product_global", userController.searchProductGlobally);
router.post("/topup_wallet", user.verifyUserToken, userController.topupWallet);
router.post("/login_with_social_account", userController.loginWithSocialAccount);
router.get("/redeem_transactions", user.verifyUserToken, userController.getRedeemTransactions);
router.post("/redeem_point", user.verifyUserToken, userController.redeemPoint);
router.get("/delete_account", user.verifyUserToken, userController.deleteAccount);
router.post("/calculate_service_charge", user.verifyUserToken, userController.calculateServiceCharge);
router.post("/calculate_delivery_charge", user.verifyUserToken, userController.calculateDeliveryCharge);

router.post("/send_otp_to_verify_mobile_number", user.verifyUserToken, celebrate({ body: SENDOTPTOVERIFYMOBILENUMBER }, { abortEarly: false }), userController.sendOtpToVerifyMobileNumber);
router.post("/verify_mobile_number", user.verifyUserToken, celebrate({ body: VERIFYMOBILENUMBER }, { abortEarly: false }), userController.verifyMobileNumber);

module.exports = router;
