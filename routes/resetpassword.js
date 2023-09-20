const express = require('express');
const router = express.Router();
const passCont = require('../controller/resetpassword');

router.post('/', passCont.resetpass);

module.exports = router;