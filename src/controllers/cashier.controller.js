const SuccessResponse = require('../classUtils/CustomResponseClass');
const CustomError = require('../classUtils/customErrorClass');


const cashierController = require('../modelServices/cashier.service')

const validatorFunction = require('../helpers/validators/validators.helpers')

const fetchAllCashiers = async (req, res, next) => {
    try {
        if(!req.params.storeID.trim()){
            throw new CustomError(400, 'StoreID is not provided !!');
        }

        const storeID = (req.params.storeID).trim()
        let String_Date = new Date().toLocaleDateString().split(",")[0];

        const users = await cashierController.allCashiersService(storeID);

        // Fetch store sales concurrently
        const userLists = await Promise.all(
            users.map(async (data) => {
                const cashierSale = await cashierController.overview(storeID, data.email, String_Date);
                return {
                    cashierName: data.name,
                    store: data.store,
                    userEmail: data.email,
                    storeID: data.storeID,
                    salesData: cashierSale
                };
            })
        );

        const response = new SuccessResponse(200, 'success', userLists);
        return response.sendResponse(res);

    } catch (error) {
        return next(error);
    }
};

const getSaleHistory = async(req, res, next) => {
    try {
        const storeID = validatorFunction.getStoreID(req)

        if(!req.params.userEmail.trim()){
            throw new CustomError(400, 'userEmail is not provided !!');
        }

        const userEmail = (req.params.userEmail).trim()

        let String_Date = new Date().toLocaleDateString().split(",")[0];

        const sales = await cashierController.fetchSales(storeID, userEmail, String_Date);

        const response = new SuccessResponse(200, 'success', sales);
        return response.sendResponse(res);


    } catch (error) {
        return next(error); 
    }
}




module.exports = {
    fetchAllCashiers,
    getSaleHistory

}