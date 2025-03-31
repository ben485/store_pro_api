const express = require('express');

const router = express.Router();

const storeController = require('../controllers/stores.controller')

router.get('/stores/all', storeController.fetchAllStores);

router.get('/stores/inventory/:storeID', storeController.getStoreInventories);

router.get('/stores/sale-orders/:storeID', storeController.getOrders)

router.get('/stores/employees/:storeID', storeController.getEmployees)


module.exports = router