const SuccessResponse = require('../classUtils/CustomResponseClass');

const specificQueriesService = require('../modelServices/specificQueries.service')

const helperFunction = require('../helpers/transformers/user.helpers')


const getTotalSales = async(req, res, next) => {
    try {
        let String_Date = new Date().toLocaleDateString().split(",")[0]; 

        let saleData = await specificQueriesService.totalSale(String_Date)

        const response = new SuccessResponse(200, 'success', saleData);
        return response.sendResponse(res)
    } catch (error) {
        next(error)
    }
}


const getInventories = async(req, res, next) => {
    try {
        const itemsData = await specificQueriesService.inventories()

        const response = new SuccessResponse(200, 'success', itemsData);
        return response.sendResponse(res)

    } catch (error) {
        next(error) 
    }
}


const getStaff = async(req, res, next) => {
    try {
        const staffData = await specificQueriesService.staffs();

        const staffs = helperFunction.sanitizeProfileData(staffData)

        const response = new SuccessResponse(200, 'success', staffs);
        return response.sendResponse(res)
    } catch (error) {
        next(error)  
    }
}


module.exports = {
    getTotalSales,
    getInventories,
    getStaff
}