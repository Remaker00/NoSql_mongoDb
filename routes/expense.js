const express = require('express');

const expenseController = require('../controller/expense')
const userauthentication = require('../middleware/auth')

const router = express.Router();

router.post('/', userauthentication.authenticate,  expenseController.insertExp );
router.get('/', userauthentication.authenticate,  expenseController.getAllExp );
router.delete('/:id', userauthentication.authenticate,  expenseController.deleteExp );

module.exports = router;