const SuccessResponse = require('../classUtils/CustomResponseClass');
const CustomError = require('../classUtils/customErrorClass');

const productServices = require('../modelServices/products.service')

const helperFunction = require('../helpers/transformers/product.helper')


const getAllItems = async(req, res, next) => {
    try {

        if(!req.params.storeID.trim()){
            throw new CustomError(400, 'StoreID is not provided !!');
        }

        const storeID = (req.params.storeID).trim()

        const items = await productServices.allProducts(storeID);
  
        const transformedItems = items.map(data => helperFunction.sanitizeProductData(data));

        
        const response = new SuccessResponse(200, 'success', transformedItems);
        return response.sendResponse(res)

    } catch (error) {
        next(error)
    }
}


const productQuantity = async (req, res, next) => {
    try {
        if(!req.params.storeID.trim()){
            throw new CustomError(400, 'StoreID is not provided !!');
        }

        const storeID = (req.params.storeID).trim()

        const {Drug_Reff, Vender_Reff, quantity} = req.body

        if(!Drug_Reff || !Vender_Reff || !quantity){
            throw new CustomError(400, 'Drug_Reff or Vender_Reff or quantity is not provided');
        }
        const responseData = await productServices.editProductQuantity(storeID, Drug_Reff, Vender_Reff, quantity);

        const response = new SuccessResponse(200, 'success', responseData);
        return response.sendResponse(res)
    } catch (error) {
        next(error)  
    }
}


const productPrice = async (req, res, next) => {
    try {
        if(!req.params.storeID.trim()){
            throw new CustomError(400, 'StoreID is not provided !!');
        }

        const storeID = (req.params.storeID).trim()

        const {Drug_Reff, Vender_Reff, cost_price, selling_price, wholesale_price} = req.body

        if(!Drug_Reff || !Vender_Reff || !cost_price || !selling_price || !wholesale_price){
            throw new CustomError(400, 'Drug_Reff or Vender_Reff or cost_price or selling_price or wholesale_price is not provided');
        }

        const responseData = await productServices.editProductPrice(storeID, Drug_Reff, Vender_Reff, cost_price, selling_price, wholesale_price)

        const response = new SuccessResponse(200, 'success', responseData);
        return response.sendResponse(res)

    } catch (error) {
        next(error)
    }
}


const deleteProduct = async(req, res, next) => {
    try {
        if(!req.params.storeID.trim()){
            throw new CustomError(400, 'StoreID is not provided !!');
        }

        const {Drug_Reff, Vender_Reff} = req.body

        if(!Drug_Reff || !Vender_Reff){
            throw new CustomError(400, 'Drug_Reff or Vender_Reff is not provided');
        }

        const responseData = await productServices.deleteProduct(storeID, Drug_Reff, Vender_Reff)

        const response = new SuccessResponse(200, 'success', responseData);
        return response.sendResponse(res)
    } catch (error) {
        next(error) 
    }
}


const outOfStocksProducts = async(req, res, next) => {
    try {
        if(!req.params.storeID.trim()){
            throw new CustomError(400, 'StoreID is not provided !!');
        }

        const storeID = (req.params.storeID).trim()

        const items = await productServices.outofStockProducts(storeID);

        const transformedItems = items.map(data => helperFunction.sanitizeProductData(data));

        const response = new SuccessResponse(200, 'success', transformedItems);
        return response.sendResponse(res)

    } catch (error) {
        next(error) 
    }
}


const getExpiryProducts = async(req, res, next) => {
    try {
        if(!req.params.storeID.trim()){
            throw new CustomError(400, 'StoreID is not provided !!');
        }

        const storeID = (req.params.storeID).trim()

        const items = await productServices.expiryProducts(storeID);

        const transformedItems = items.map(data => helperFunction.sanitizeProductData(data));

        const response = new SuccessResponse(200, 'success', transformedItems);
        return response.sendResponse(res)
        
    } catch (error) {
        next(error) 
    }
}

module.exports = {
    getAllItems,
    productQuantity,
    productPrice,
    deleteProduct,
    outOfStocksProducts,
    getExpiryProducts
}