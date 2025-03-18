const express = require('express');

const router = express.Router();

const productController = require('../controllers/products.controller')

router.get('/all-items/:storeID', productController.getAllItems);

router.patch('/quantity/:storeID', productController.productQuantity);

router.patch('/price/:storeID', productController.productPrice);

router.delete('/items/:storeID', productController.deleteProduct);

router.get('/outofstocks-items/:storeID', productController.outOfStocksProducts);

router.get('/expiry-items/:storeID', productController.getExpiryProducts)


module.exports = router