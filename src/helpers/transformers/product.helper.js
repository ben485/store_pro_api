

const sanitizeProductData = (storeData) => {
    if (!storeData) return null;

    return {
        item_name: storeData.Drug_name || '',
        type: storeData.Drug_Type || '',
        quantity: storeData.Left_Quantity || 0,
        units: storeData.Unit_measure || 0,
        cost_price: storeData.Cost_price  || 0,
        selling_price: storeData.Selling_price || 0,
        wholesale_price: storeData.wholesale_price || 0,
        vendor_name: storeData.Vender_name || '',
        out_of_stock_limit: storeData.outofstocklimit || '',
        expiry_date : storeData.Expiry_Date || '',
        Drug_Reff: storeData.Drug_Reff,
        Vendor_Reff: storeData.Vendor_Reff
    };
};


module.exports = {
    sanitizeProductData
}