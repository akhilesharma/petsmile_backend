const router = require("express").Router();

const commonController = require("../controller/common.controller");
const { STATELIST, CITYLIST } = require("../validation/commonValidation");

const { celebrate } = require("celebrate");

router.get(
  "/country_list",
  commonController.countryList
);

router.post(
  "/state_list",
  celebrate(
    {
      body: STATELIST,
    },
    {
      abortEarly: false,
    }
  ),
  commonController.stateList
);

router.post(
    "/city_list",
    celebrate(
      {
        body: CITYLIST,
      },
      {
        abortEarly: false,
      }
    ),
    commonController.cityList
  );

module.exports = router;
