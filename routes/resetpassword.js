

let express = require('express');

let ForgotOrResetPasswordController = require('../controllers/resetpassword');

let router = express.Router();
router.get('/resetpassword/:id' , ForgotOrResetPasswordController.resetpassword)


router.use('/forgotpassword',  ForgotOrResetPasswordController.forgotpassword);

module.exports = router ;