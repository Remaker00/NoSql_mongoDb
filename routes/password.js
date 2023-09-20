const express = require('express');
const router = express.Router();
const passCont = require('../controller/password');

router.post('/', passCont.sendTransactionalEmail);

module.exports = router;