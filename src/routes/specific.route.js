const express = require('express');

const router = express.Router();

const specificQueriesController = require('../controllers/specificQueries.controller')

router.get('/sales', specificQueriesController.getTotalSales);

router.get('/inventories', specificQueriesController.getInventories);

router.get('/staffs', specificQueriesController.getStaff)

router.get('/overview', specificQueriesController.getOverview)


module.exports = router