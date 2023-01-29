

let express = require('express');
let purchaseController = require('../controllers/purchase');
let middleware = require('../middleware/auth');

let router = express.Router();

router.get('/premiummembership' , middleware.authenticate ,purchaseController.purchasePremium);

router.post('/updatetransactionstatus', middleware.authenticate , purchaseController.updateTransactionStatus);

module.exports = router ; 