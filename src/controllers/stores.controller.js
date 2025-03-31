const SuccessResponse = require('../classUtils/CustomResponseClass');
const CustomError = require('../classUtils/customErrorClass');

const helperFunction = require('../helpers/transformers/product.helper')

const storeServices = require('../modelServices/stores.services')


const fetchAllStores = async (req, res, next) => {
    try {
        let String_Date = new Date().toLocaleDateString().split(",")[0];

        const stores = await storeServices.getAllStores();

        // Fetch store sales concurrently
        const storeLists = await Promise.all(
            stores.map(async (data) => {
                const storeSales = await storeServices.getStoreSales(data.Secret_Key, String_Date);
                return {
                    storeName: data.name,
                    storeID: data.Secret_Key,
                    totalSale: storeSales
                };
            })
        );

        // Sort stores by totalSale in descending order
        storeLists.sort((a, b) => b.totalSale - a.totalSale);

        const response = new SuccessResponse(200, 'success', storeLists);
        return response.sendResponse(res);

    } catch (error) {
        return next(error);
    }
};


const getStoreInventories = async (req, res, next) => {
    try {
        
        if(!req.params.storeID.trim()){
            throw new CustomError(400, 'StoreID is not provided !!');
        }

        const storeID = (req.params.storeID).trim()

        const itemData = storeServices.storeInventories(storeID);

        const {numberOfProducts, totalItems, items} = itemData
        let responseData;

        if(items.length === 0){
            responseData = {
                numberOfProducts,
                totalItems,
                items
            }

            const response = new SuccessResponse(200, 'success', responseData);
            return response.sendResponse(res) 
        }

        const formattedItems = items.map(data => helperFunction.sanitizeProductData(data));

        responseData = {
            numberOfProducts,
            totalItems,
            items: formattedItems
        }

        const response = new SuccessResponse(200, 'success', responseData);
        return response.sendResponse(res) 
    } catch (error) {
        return next(error);
    }
}


const getOrders = async(req, res, next) => {
    try {
        if(!req.params.storeID.trim()){
            throw new CustomError(400, 'StoreID is not provided !!');
        }

        const storeID = (req.params.storeID).trim()

        let String_Date = new Date().toLocaleDateString().split(",")[0];

        const orderData = await storeServices.ordersServices(storeID, String_Date)

        const response = new SuccessResponse(200, 'success', orderData);
        return response.sendResponse(res) 
    } catch (error) {
        return next(error);
    }
}


const getEmployees = async(req, res, next) => {
    try {
        if(!req.params.storeID.trim()){
            throw new CustomError(400, 'StoreID is not provided !!');
        }

        const storeID = (req.params.storeID).trim()

        const staffs = await storeServices.employeeServices(storeID)
        const response = new SuccessResponse(200, 'success', staffs);
        return response.sendResponse(res) 
    } catch (error) {
        return next(error); 
    }
}


module.exports = {
    fetchAllStores,
    getStoreInventories,
    getOrders,
    getEmployees
}