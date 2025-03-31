const orderData = (storeData) => {
    console.log(storeData)
    if (!storeData) return null;

    return {
        customer_Name: storeData.customer_Name || '',
        amount: storeData.Amount_Due || 0,
        profit: storeData.Profit_Earn || 0,
        quantity: storeData.Qty_Sold || 0,
        pieces: storeData.Drug_Total  || 0,
        paymentType: storeData.Payment_Type || '',
        discount: storeData.Discount || 0,
        vat: storeData.VatValue || 0,
        storeID: storeData.Secret_Key || '',
        transactionID : storeData.Transaction_ID || '',
        date: storeData.Word_Date,
    };
};


module.exports = {
    orderData
}