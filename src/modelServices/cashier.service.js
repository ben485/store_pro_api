const CustomError = require('../classUtils/customErrorClass');
const pool = require('../config/database.config');

const helperFunction = require('../helpers/transformers/user.helpers')
const orderFunction = require('../helpers/transformers/orders.helper');
const salesFunction = require('../helpers/transformers/sale.helper')

const allCashiersService = async(storeID) => {
    try {
        const cashierSql = `SELECT * users WHERE Secret_Key = ?`

        const [users] = await pool.query(cashierSql, [storeID])

          let staffs ;
         
        if(users.length === 0){
            staffs = []
        }else{
            staffs = users.map(data => helperFunction.sanitizeProfileData(data));
        }

        return users
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

        const [results] = await pool.query(query, [storeID, userEmail, String_Date]);

        console.log(results)

        return results

    } catch (error) {
        console.error("Error fetching overview:", error);
        throw error;
    }
};




const fetchSales = async(storeID, userEmail, String_Date) => {
  try {
    const orderSql = `SELECT * FROM bulksales Secret_Key = ? AND userEmail = ? AND String_Date = ?`

    const saleSql = `SELECT * FROM salestable Secret_Key = ? AND userEmail = ? AND String_Date = ?`

    let transformedSales;
    let transformedOrders;

    const [sales] = await pool.query(saleSql, [storeID, userEmail, String_Date]);

    const [orders] = await pool.query(orderSql, [storeID, userEmail, String_Date])

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
        saleHistory: transformedSales
    }

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