const router = require("express").Router();
const { celebrate } = require("celebrate");
const servicesController = require("../controller/services.controller");
const services = require("../middlewares/authentication");
const { uploadFiles } = require("../middlewares/aws-s3");

const {
  REGISTERSERVICEPROVIDER,
  OTP,
  COMPLETEPROFILE,
  BANKSECUTITY,
  FORGETPASSWORD,
  RESETPASSWORD,
  LOGIN,
  EDITPROFILE,
  EDITADDRESS,
  CHANGEPASSWORD,
  ADDSERVICES,
  EDITSERVICES,
} = require("../validation/serviceProviderValidaton");


//===================================================================================

router.post(
  "/upload_file",
  services.verifyServicesToken,
  uploadFiles,
  servicesController.uploadFile
);

router.post(
  "/registerServiceProvider",
  celebrate({ body: REGISTERSERVICEPROVIDER }, { abortEarly: false }),
  servicesController.registerServiceProvider
);

router.post(
  "/verifyOtp",
  celebrate({ body: OTP }, { abortEarly: false }),
  services.verifyServicesToken,
  servicesController.verifyOtp
);

router.post(
  "/completeProfile",
  celebrate({ body: COMPLETEPROFILE }, { abortEarly: false }),
  services.verifyServicesToken,
  servicesController.completeProfile
);

router.get(
  "/resendOtp",
  services.verifyServicesToken,
  servicesController.resendOtp
);

router.post(
  "/bankSecurityAdd",
  celebrate({ body: BANKSECUTITY }, { abortEarly: false }),
  services.verifyServicesToken,
  servicesController.bankSecurityAdd
);

router.post(
  "/forgetPassword",
  celebrate({ body: FORGETPASSWORD }, { abortEarly: false }),
  servicesController.forgotPassword
);

router.post(
  "/resetPassword",
  celebrate({ body: RESETPASSWORD }, { abortEarly: false }),
  services.verifyServicesToken,
  servicesController.resetPassword
);

router.post(
  "/login",
  celebrate({ body: LOGIN }, { abortEarly: false }),
  servicesController.login
);

router.post(
  "/logout",
  services.verifyServicesToken,
  servicesController.logout
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
  services.verifyServicesToken,
  servicesController.editProfile
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
  services.verifyServicesToken,
  servicesController.editAddress
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
  services.verifyServicesToken,
  servicesController.changePassword
);

router.get(
  "/get_profile",
  services.verifyServicesToken,
  servicesController.getProfile
);

router.post(
  "/add_services",
  celebrate(
    {
      body: ADDSERVICES,
    },
    {
      abortEarly: false,
    }
  ),
  services.verifyServicesToken,
  servicesController.addServices
);

router.get(
  "/get_services_list",
  services.verifyServicesToken,
  servicesController.getServicesList
);


router.get(
  "/get_service_category",
  services.verifyServicesToken,
  servicesController.getServicesCategory
);

router.post(
  "/edit_services",
  celebrate(
    {
      body: EDITSERVICES,
    },
    {
      abortEarly: false,
    }
  ),
  services.verifyServicesToken,
  servicesController.editServices
);

router.get(
  "/get_new_service_order",
  services.verifyServicesToken,
  servicesController.getNewServiceOrder
);

router.get(
  "/get_ongoing_service_order",
  services.verifyServicesToken,
  servicesController.getOngoingServiceOrder
);

router.get(
  "/get_past_service_order",
  services.verifyServicesToken,
  servicesController.getPastServiceOrder
);

router.post(
  "/dashboard",
  services.verifyServicesToken,
  servicesController.getDashboardData
);

router.get(
  "/get_notification",
  services.verifyServicesToken,
  servicesController.getNotificationList
);

router.post(
  "/view_order",
  services.verifyServicesToken,
  servicesController.viewOrder
);

router.post(
  "/update_service_order_status",
  services.verifyServicesToken,
  servicesController.updateServiceOrderStatus
);

router.post(
  "/cancel_service",
  services.verifyServicesToken,
  servicesController.cancelService
);

router.get(
  "/read_all_notification",
  services.verifyServicesToken,
  servicesController.readAllNotification
);

router.get(
  "/payment_list",
  services.verifyServicesToken,
  servicesController.paymentList
);

router.post(
  "/filter_payment_list",
  services.verifyServicesToken,
  servicesController.filterPaymentList
);

router.get(
  "/service_order_report",
  // services.verifyServicesToken,
  servicesController.getServiceOrderReportList
);

//============================> M12 <============================
router.get(
  "/service_term_condition",
  servicesController.getTermCondition
)

router.get(
  "/service_privacy_policy",
  servicesController.getPrivacyPolicy
)

router.get(
  "/service_about_us",
  servicesController.getAboutUs
)
router.get(
  "/service_legal",
  servicesController.getLegal
)
router.get(
  "/cancle_order_list",
  services.verifyServicesToken, 
  servicesController.getCancelOrderReasonList
);

router.get(
  "/get_adv_list",
  servicesController.getAllAdvertisements
);

router.post(
  "/get_service_report",
  services.verifyServicesToken,
  servicesController.getServiceReport
);

router.get(
  "/delete_account",
  services.verifyServicesToken,
  servicesController.deleteAccount
);

router.post(
  "/update_service_data",
  services.verifyServicesToken,
  servicesController.updateServiceData
);


module.exports = router;
