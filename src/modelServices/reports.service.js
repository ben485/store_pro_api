const CustomError = require('../classUtils/customErrorClass');
const pool = require('../config/database.config');


const dailySales = async(month) => {
    try {
        const sql = `
            SELECT String_Date,
               SUM(Amount_Due) as total_sales,
               SUM(CASE WHEN Payment_Platform = 'Cash' THEN Amount_Due ELSE 0 END) AS Cash_Total,
               SUM(CASE WHEN Payment_Platform = 'Credit' THEN Amount_Due ELSE 0 END) AS Credit_Total,
               SUM(CASE WHEN Payment_Platform = 'Momo' THEN Amount_Due ELSE 0 END) AS Momo_Total,
               COUNT(id) AS Total_Orders
                FROM bulksales WHERE Month = ?
                GROUP BY String_Date
            `
            const [data] = await pool.query(sql, [month]);
            console.log(data)
            return data
    } catch (error) {
        console.error("Error fetching top selling products:", error);
        throw error;   
    }
}


const storeDailySale = async(month, storeID) => {
    try {
        const sql = `
            SELECT String_Date,
               SUM(Amount_Due) as total_sales,
               SUM(CASE WHEN Payment_Platform = 'Cash' THEN Amount_Due ELSE 0 END) AS Cash_Total,
               SUM(CASE WHEN Payment_Platform = 'Credit' THEN Amount_Due ELSE 0 END) AS Credit_Total,
               SUM(CASE WHEN Payment_Platform = 'Momo' THEN Amount_Due ELSE 0 END) AS Momo_Total,
               COUNT(id) AS Total_Orders
               FROM bulksales WHERE Secret_Key = ? AND Month = ?
               GROUP BY String_Date
            `
            const [data] = await pool.query(sql, [storeID, month]);
            console.log(data)
            return data
    } catch (error) {
        console.error("Error fetching top selling products:", error);
        throw error;   
    }
}

const cashierDailySale = async(storeID, userEmail, month) => {
    try {
        const sql = `
        SELECT String_Date,
           SUM(Amount_Due) as total_sales,
           SUM(CASE WHEN Payment_Platform = 'Cash' THEN Amount_Due ELSE 0 END) AS Cash_Total,
           SUM(CASE WHEN Payment_Platform = 'Credit' THEN Amount_Due ELSE 0 END) AS Credit_Total,
           SUM(CASE WHEN Payment_Platform = 'Momo' THEN Amount_Due ELSE 0 END) AS Momo_Total,
           COUNT(id) AS Total_Orders
           FROM bulksales WHERE Secret_Key = ? AND userEmail = ? AND Month = ?
           GROUP BY String_Date
        `

        const [data] = await pool.query(sql, [storeID, userEmail, month]);
         console.log(data)
         return data
    } catch (error) {
        console.error("Error fetching top selling products:", error);
        throw error;     
    }
}
module.exports = {
    dailySales,
    storeDailySale,
    cashierDailySale

}