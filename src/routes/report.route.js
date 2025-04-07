const express = require('express');

const router = express.Router();

const reportsController = require('../controllers/reports.controller')

router.get('/general', reportsController.getDailySale);

router.get('/store', reportsController.getStoreDailySales);

router.get('/cashier', reportsController.getCashierSales);



module.exports = router