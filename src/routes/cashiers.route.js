const express = require('express');

const router = express.Router();

const cashierController = require('../controllers/cashier.controller')

router.get('/all/:storeID', cashierController.fetchAllCashiers);

router.get('/sales/:userEmail', cashierController.getSaleHistory);



module.exports = router