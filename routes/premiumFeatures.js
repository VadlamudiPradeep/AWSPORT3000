let express  = require('express');
let router = express.Router();

let middleware = require('../middleware/auth');
let premiumFeaturesControllers = require('../controllers/premiumFeatures');

router.get('/showLeaderBoard' , middleware.authenticate , premiumFeaturesControllers.GetUserLeaderBoard);

module.exports = router ;