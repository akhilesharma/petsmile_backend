const router = require("express").Router();
const adminController = require("../controller/admin.controller");
const auth = require("../middlewares/authentication");
const s3Bucket = require("../middlewares/aws-s3")
const admin = require('../middlewares/authentication');
const uploadFiles  = require("../middlewares/aws-s3");

router.route("/upload_file").post(uploadFiles.uploadFiles,adminController.uploadFile);

router.route("/signUp").post(adminController.registerAdmin);
router.route("/login").post(adminController.loginAdmin);
router.route("/forgetPassword").post(adminController.forgetPassword);
router.route("/verifyOTP").post(adminController.verifyOTP);
router.route("/resetPassword").post(adminController.resetPassword);
router.route("/allUser").get(adminController.allUser);
router.route("/blockUnblockUser").post(adminController.blockUser);
router.route("/allHosts").get(adminController.allHost);
router.route("/acceptRejectHost").post(adminController.acceptRejectHost);
router.route("/blockUnblockHost").post(adminController.blockUnblockHost);
router.route("/allSeller").get(adminController.allSeller);
router.route("/acceptRejectSeller").post(adminController.acceptRejectSeller);
router.route("/blockUnblockSeller").post(adminController.blockUnblockSeller);
router.route("/allService").get(adminController.allService);
router.route("/acceptRejectService").post(adminController.acceptRejectService);
router.route("/blockUnblockService").post(adminController.blockUnblockService);
router.route("/createCategory").post(s3Bucket.uploadAdminFiles, adminController.createCategory);
router.route("/categoryList").get(adminController.categoryList);
router.route("/editCategory").post(s3Bucket.uploadAdminFiles, adminController.editCategory);
router.route("/deleteCategory").post(adminController.deleteCategory);
router.route("/addSubCategory").post(adminController.addSubCategory);
router.route("/productSubCatList").get(adminController.productSubCatList);
router.route("/editProductSubCat").post(adminController.editProductSubCat);
router.route("/subCatDelete").post(adminController.subCatDelete);
router.route("/addTrackingDevice").post(admin.verifyAdminToken, s3Bucket.uploadAdminFiles, adminController.addTrackingDevice);
router.route("/editTrackingDevice").post(admin.verifyAdminToken, s3Bucket.uploadAdminFiles, adminController.editTrackingDevice);
router.route("/trackingDeviceList").get(adminController.trackingDeviceList);
router.route("/deleteTrackingDevice").post(adminController.deleteTrackingDevice);
router.route("/blockUnblockTrackingDevice").post(adminController.blockUnblockTrackingDevice);
router.route("/productMainCategory").post(s3Bucket.uploadAdminFiles, adminController.productMainCategory);
router.route("/mainCategoryList").get(adminController.mainCategoryList);
router.route("/editMainCategory").post(s3Bucket.uploadAdminFiles, adminController.editMainCategory);
router.route("/deleteMainCategory").post(adminController.deleteMainCategory);
router.route("/addInventory").post(adminController.addInventory);
router.route("/InventoryList").get(adminController.InventoryList);
router.route("/updateInventoryStatus").post(adminController.updateInventoryStatus);
router.route("/addPromocode").post(adminController.addPromocode);
router.route("/editPromocode").post(adminController.editPromocode);
router.route("/promocodeList").get(adminController.promocodeList);
router.route("/deletePromocode").post(adminController.deletePromocode);
router.route("/blockPromocode").post(adminController.blockPromocode);
router.route("/showToUser").post(adminController.showToUser);
router.route("/showToHost").post(adminController.showToHost);
router.route("/sellerOrderHostUserList").get(adminController.sellerOrderHostUserList);
router.route("/trackingOrderist").get(adminController.trackingOrderList);
router.route("/trackingUserOrderAcceptReject").post(adminController.trackingUserOrderAcceptReject);
router.route("/trackingHostOrderAcceptReject").post(adminController.trackingHostOrderAcceptReject);
router.route("/onGoingStatusForUser").post(adminController.onGoingStatusForUser);
router.route("/onGoingStatusForHost").post(adminController.onGoingStatusForHost);
router.route("/updateTrackingUserOrderStatus").post(adminController.updateTrackingUserOrderStatus);
router.route("/updateTrackingHostOrderStatus").post(adminController.updateTrackingHostOrderStatus);

//M5
router.route("/addAdvertisement",admin).post(adminController.addAdvertisement);
router.route("/editAdvertisement").post(adminController.editAdvertisement);
router.route("/deleteAdvertisement").post(adminController.deleteAdvertisement);
router.route("/getAdvertisement").get(adminController.getAdvertisement);
router.route("/blockUnblockAdverisement").post(adminController.blockUnblockAdverisement);

router.route("/allAdminProductReviews").post(adminController.getAllAdminProductReviews);
router.route("/viewOrderRatingReview").post(adminController.viewOrderAllRatingReview);

router.route("/addServiceCategory").post(adminController.addServiceCategory);
router.route("/editServiceCategory").post(adminController.editServiceCategory);
router.route("/deleteServiceCategory").post(adminController.deleteServiceCategory);
router.route("/getServiceCategory").get(adminController.getServiceCategoryList);
router.route("/blockUnblockServiceCategory").post(adminController.blockUnblockServiceCategory);

router.route("/updateCommission").post(adminController.updateCommission);
router.route("/getCommission").get(adminController.getCommission);
router.route("/trackingOrderPaymentList").get(adminController.trackingOrderPaymentList);
router.route("/sellerOrderPaymentList").get(adminController.sellerOrderPaymentList);

router.route("/addSubAdmin").post(adminController.addSubAdmin);
router.route("/editSubAdmin").post(adminController.editSubAdmin);
router.route("/getSubAdminList").get(adminController.getSubAdminList);
router.route("/blockUnblockSubAdmin").post(adminController.blockUnblockSubAdmin);

//M7
router.route("/getNewBookedServices").get(adminController.getNewBookedServices);
router.route("/getOngoingBookedServices").get(adminController.getOngoingBookedServices);
router.route("/getPastBookedServices").get(adminController.getPastBookedServices);

//M8
router.route("/getBookedServicesPayment").get(adminController.getBookedServicesPayment);

//M10
router.route("/getHostPackageList").get(adminController.getHostPackageList);

//M11
router.route("/newPackageBookingList").get(adminController.getNewPackageBookingList);
router.route("/ongoingPackageBookingList").get(adminController.getOngoingPackageBookingList);
router.route("/pastPackageBookingList").get(adminController.getPastPackageBookingList);

//M12
router.route("/get_setting_data").get(adminController.getSettingData);
router.route("/update_setting_data").post(adminController.updateSettingData);
router.route("/add_faq").post(adminController.addNewFaq);
router.route("/get_faq").get(adminController.getFaqData);

router.route("/get_host_setting_data").get(adminController.getHostSettingData);
router.route("/update_host_setting_data").post(adminController.updateHostSettingData);
router.route("/add_host_faq").post(adminController.addHostNewFaq);
router.route("/get_host_faq").get(adminController.getHostFaqData);

router.route("/get_seller_setting_data").get(adminController.getSellerSettingData);
router.route("/update_seller_setting_data").post(adminController.updateSellerSettingData);
router.route("/add_seller_faq").post(adminController.addSellerNewFaq);
router.route("/get_seller_faq").get(adminController.getSellerFaqData);


router.route("/get_service_setting_data").get(adminController.getServiceSettingData);
router.route("/update_service_setting_data").post(adminController.updateServiceSettingData);
router.route("/add_service_faq").post(adminController.addServiceFaq);
router.route("/get_service_faq").get(adminController.getServiceFaqData);

router.route("/get_user_list").get(adminController.getUserList);
router.route("/get_host_list").get(adminController.getHostList);
router.route("/get_seller_list").get(adminController.getSellerList);
router.route("/get_serviceProvider_list").get(adminController.getServiceProviderList);


router.route("/send_notification").post(adminController.sendNotification);

router.route("/host_refund_list").post(adminController.getHostRefundList);
router.route("/refund_host_order").post(adminController.refundHostOrder);
router.route("/user_refund_list").post(adminController.getUserRefundList);
router.route("/refund_user_order").post(adminController.refundUserOrder);

router.route("/get_support_list").get(adminController.getSupportList);
router.route("/update_support").post(adminController.updateSupport);

router.route("/get_packages_payment").get(adminController.getPackagePayment);

router.route("/get_notification_list").get(adminController.notificationList);
router.route("/block_unblock_notification").post(adminController.blockUnblockNotification);
router.route("/delete_notification").post(adminController.deleteNotification);

router.route("/set_health_goal_point").post(adminController.setHealthGoalPoint)
router.route("/set_usage_limit").post(adminController.setUsageLimitPurchage)
router.route("/get_smile_health_points").get(adminController.getSmileHealthPoints);
// router.route("/change_password").post(adminController.changePassword );
router.route("/updateServiceCharge").post(adminController.updateServiceCharge);
router.route("/getServiceCharge").get(adminController.getServiceCharge);


module.exports = router;