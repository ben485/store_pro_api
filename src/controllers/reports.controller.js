const SuccessResponse = require('../classUtils/CustomResponseClass');
const CustomError = require('../classUtils/customErrorClass');

const reportServices = require('../modelServices/reports.service')

const getDailySale = async(req, res, next) => {
    try {
        const month = req.query.month;
        if(!month){
            throw new CustomError(400, 'Month is required');
        }

        const data = await reportServices.dailySales(month)

        const response = new SuccessResponse(200, 'success', data);
        return response.sendResponse(res) 
    } catch (error) {
        return next(error); 
    }
}


const getStoreDailySales = async(req, res, next) => {
    try {
        const month = req.query.month;
        const storeID = req.query.storeID
        if(!month || !storeID){
            throw new CustomError(400, 'Month or StoreID is required');
        }

        const data = await reportServices.storeDailySale(month, storeID);

        const response = new SuccessResponse(200, 'success', data);
        return response.sendResponse(res) 

    } catch (error) {
        return next(error); 
    }
}


const getCashierSales = async(req, res, next) => {
    try {
        const month = req.query.month;
        const storeID = req.query.storeID
        const userEmail = req.query.userEmail
        if(!month || !storeID || !userEmail){
            throw new CustomError(400, 'Month or storeID or userEmail is required');
        }

        const data = await reportServices.cashierDailySale(storeID, userEmail, month);

        const response = new SuccessResponse(200, 'success', data);
        return response.sendResponse(res) 

    } catch (error) {
        return next(error); 
    }
}



module.exports = {
    getDailySale,
    getStoreDailySales,
    getCashierSales
}