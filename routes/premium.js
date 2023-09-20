const express = require('express');

const premiumController = require('../controller/premiumcont')
const userauthentication = require('../middleware/auth')

const router = express.Router();

router.get('/', userauthentication.authenticate,  premiumController.getpremium );

module.exports = router;