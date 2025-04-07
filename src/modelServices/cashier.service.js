const CustomError = require('../classUtils/customErrorClass');
const pool = require('../config/database.config');

const helperFunction = require('../helpers/transformers/user.helpers')
const orderFunction = require('../helpers/transformers/orders.helper');
const salesFunction = require('../helpers/transformers/sale.helper')

const allCashiersService = async(storeID) => {
    try {
        const cashierSql = `SELECT * FROM users WHERE Secret_Key = ?`

        const [users] = await pool.query(cashierSql, [storeID])

          let staffs ;
         
        if(users.length === 0){
            staffs = []
        }else{
            staffs = users.map(data => helperFunction.sanitizeProfileData(data));
        }

        return staffs
    } catch (error) {
        console.error("Error fetching top selling products:", error);
        throw error;   
    }
}


const overview = async (storeID, userEmail, String_Date) => {
    try {
        let query = `
            SELECT 
                SUM(Amount_Due) AS Total, 
                SUM(CASE WHEN Payment_Platform = 'Cash' THEN Amount_Due ELSE 0 END) AS Cash_Total,
                SUM(CASE WHEN Payment_Platform = 'Credit' THEN Amount_Due ELSE 0 END) AS Credit_Total,
                SUM(CASE WHEN Payment_Platform = 'Momo' THEN Amount_Due ELSE 0 END) AS Momo_Total,
                COUNT(id) AS Total_Orders
            FROM bulksales 
            WHERE Secret_Key = ? AND userEmail = ? AND String_Date = ?
        `;

        const [[results]] = await pool.query(query, [storeID, userEmail, String_Date]);

        return {
            totalSale: results.Total || 0,
            cashTotal: results.Cash_Total || 0,
            creditTotal: results.Credit_Total || 0,
            momoTotal: results.Momo_Total || 0,
            totalOrders: results.Total_Orders || 0
        }

    } catch (error) {
        console.error("Error fetching overview:", error);
        throw error;
    }
};


const fetchSales = async(storeID, userEmail, String_Date) => {
  try {
    let query = `
    SELECT 
        SUM(Amount_Due) AS Total, 
        SUM(CASE WHEN Payment_Platform = 'Cash' THEN Amount_Due ELSE 0 END) AS Cash_Total,
        SUM(CASE WHEN Payment_Platform = 'Credit' THEN Amount_Due ELSE 0 END) AS Credit_Total,
        SUM(CASE WHEN Payment_Platform = 'Momo' THEN Amount_Due ELSE 0 END) AS Momo_Total,
        COUNT(id) AS Total_Orders
    FROM bulksales 
    WHERE Secret_Key = ? AND userEmail = ? AND String_Date = ?
   `;

    const orderSql = `SELECT * FROM bulksales WHERE Secret_Key = ? AND userEmail = ? AND String_Date = ?`

    const saleSql = `SELECT * FROM salestable WHERE Secret_Key = ? AND userEmail = ? AND String_Date = ?`

    let transformedSales;
    let transformedOrders;

    const [sales] = await pool.query(saleSql, [storeID, userEmail, String_Date]);

    const [orders] = await pool.query(orderSql, [storeID, userEmail, String_Date]);

    const [[results]] = await pool.query(query, [storeID, userEmail, String_Date]);

    if(sales.length === 0){
        transformedSales = []
    }else{
        transformedSales = sales.map(data => salesFunction.sanitizeProductData(data));
    }

    if(orders.length === 0){
        transformedOrders = []
    }else{
        transformedOrders = sales.map(data => orderFunction.orderData(data))
    }

    const data = {
        orders: transformedOrders,
        saleHistory: transformedSales,
        saleData: {
            totalSale: results.Total || 0,
            cashTotal: results.Cash_Total || 0,
            creditTotal: results.Credit_Total || 0,
            momoTotal: results.Momo_Total || 0,
            totalOrders: results.Total_Orders || 0
        }
    }

    return data

  } catch (error) {
    console.error("Error fetching overview:", error);
    throw error;
  }
}


module.exports = {
    allCashiersService,
    overview,
    fetchSales
}