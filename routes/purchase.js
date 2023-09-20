const express = require('express');
const router = express.Router();
const purchaseController = require('../controller/purchasecont');
const userauthentication = require('../middleware/auth');

router.get('/', userauthentication.authenticate,purchaseController.getpayment);
router.post('/', userauthentication.authenticate,purchaseController.updatepayment);

module.exports = router;