const express = require('express');

const router = express.Router();

const cashierController = require('../controllers/cashier.controller')

router.get('/all', cashierController.fetchAllCashiers);

router.get('/sales/:storeID', cashierController.getSaleHistory);



module.exports = router