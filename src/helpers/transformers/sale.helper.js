const sanitizeProductData = (storeData) => {
    console.log(storeData)
    if (!storeData) return null;

    return {
        item_name: storeData.Drug_name || '',
        type: storeData.Drug_Type || '',
        quantity: storeData.Left_Quantity || 0,
        units: storeData.Unit_measure || 0,
        cost_price: storeData.Cost_price  || 0,
        selling_price: storeData.Selling_price || 0,
        amount: storeData.Amount_Sold || 0 ,
        profit: storeData.Profit || 0,
        customer: storeData.customer_Name || '',
        vendor_name: storeData.Vender_name || '',
        Drug_Reff: storeData.Drug_Reff || '',
        Vendor_Reff: storeData.Vendor_Reff || '',
        storeID : storeData.Publick_Key || '',
        transactionID: storeData.Transaction_ID || ''
    };
};


module.exports = {
    sanitizeProductData
}