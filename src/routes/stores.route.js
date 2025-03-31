const express = require('express');

const router = express.Router();

const storeController = require('../controllers/stores.controller')

router.get('/all', storeController.fetchAllStores);

router.get('/inventory/:storeID', storeController.getStoreInventories);

router.get('/sale-orders/:storeID', storeController.getOrders)

router.get('/employees/:storeID', storeController.getEmployees);

router.get('/top-selling-products/:storeID', storeController.topSellingProducts);

router.get('/overview/:storeID', storeController.getOverview);


module.exports = router