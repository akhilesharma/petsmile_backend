const router = require('express').Router();

const adminRoute = require('./admin.routes');
const hostRoute = require('./host.routes');
const sellerRoute = require('./seller.routes');
const serviceRoute = require('./service.routes');
const userRoute = require('./user.routes');
const commonRoute = require('./common.routes');


router.use('/admin',adminRoute);
router.use('/host',hostRoute);
router.use('/seller',sellerRoute);
router.use('/service',serviceRoute);
router.use('/user',userRoute);
router.use('/common',commonRoute);


module.exports = router;