const CustomError = require('../classUtils/customErrorClass');
const pool = require('../config/database.config');

const ordershelperFunction = require('../helpers/transformers/orders.helper');
const saleshelperFunction = require('../helpers/transformers/sale.helper');
const userhelperFunction = require('../helpers/transformers/user.helpers');

const getAllStores = async() => {
    try {
         const sql = `SELECT * FROM stores`
        const [stores] = await pool.query(sql, []);

        return stores || []
    } catch (error) {
        throw error
    }
}


const getStoreSales = async(Secret_key, String_Date) => {
    try {
        let sumsql = `SELECT COALESCE(SUM(Amount_Due), 0) AS TotalSale FROM bulksales WHERE Secret_Key = ? AND  String_Date = ?`;

        const [[sum]] = await pool.query(sumsql, [Secret_key, String_Date])

        return sum.TotalSale || 0
    } catch (error) {
        throw error
    }
}


const storeInventories = async(storeID) => {
    try {
        const sql = 'SELECT * FROM retaildrugs WHERE Secret_Key = ?';
       const sumsql =  `SELECT COALESCE(SUM(Quantity), 0) AS TotalItems FROM retaildrugs WHERE Secret_Key = ?`

        const [items] = await pool.query(sql, [storeID]);
        const [[sum]] = await pool.query(sumsql, [storeID])

        return {
            numberOfProducts : items.length || 0,
            totalItems: sum.TotalItems || 0,
            items: items

        }
    } catch (error) {
        throw error
    }
}

const ordersServices = async(storeID, String_Date) => {
    try {
        const sql = 'SELECT * FROM bulksales WHERE Secret_Key = ? AND String_Date';
        const sumsql =  `SELECT COALESCE(SUM(Amount_Due), 0) AS TotalSum FROM bulksales WHERE Secret_Key = ? AND String_Date = ?`
        const itemsql = `SELECT * FROM salestable WHERE Secret_Key = ? AND String_Date = ?`
        const sumSalesSql =  `SELECT COALESCE(SUM(Quantity), 0) AS TotalSum FROM salestable WHERE Secret_Key = ? AND String_Date = ?`

        const [orders] = await pool.query(sql, [storeID, String_Date]);
        const [[sum]] = await pool.query(sumsql, [storeID, String_Date]);
        const [items] = await pool.query(itemsql, [storeID, String_Date]);
        const [[soldItems]] = await pool.query(sumSalesSql, [storeID, String_Date])

        let transformOrders ;
        let transformedItems 
        if(orders.length === 0){
            transformOrders = []
        }else{
            transformOrders = orders.map(data => ordershelperFunction.orderData(data));
        }
        
        if(items.length === 0){
            transformedItems = []
        }else{
            transformedItems = items.map(data => saleshelperFunction.sanitizeProductData(data))
        }

        const data = {
            OrderSum : sum.TotalSum || 0,
            orderNumber: orders.length || 0,
            orders: transformOrders,
            saleItems: transformedItems,
            soldItems: soldItems.TotalSum || 0
        }


        return data
    } catch (error) {
        
    }
}

const employeeServices = async(storeID) => {
    try {
        const sql = `SELECT * FROM users WHERE Secret_Key = ?`

        const [staff] = await pool.query(sql, [storeID])

        let staffList;

        if(staff.length === 0){
             staffList = []
        }else{
            staffList = staff
        }

        return {
            staffNumber: staff.length,
            staffs: staffList
        }
    } catch (error) {
        throw error 
    }
}

const topSellingProductServices = async (Secret_Key, month) => {
    try {
        const sqlItems = `
            SELECT 
                Drug_name, 
                Vender_name, 
                Drug_Type, 
                Selling_price, 
                Profit, 
                Quantity, 
                Drug_Reff, 
                Vendor_Reff, 
                SUM(Quantity) AS total_quantity
            FROM salestable
            WHERE Secret_Key = ? AND Month = ?
            GROUP BY Drug_Reff, Vendor_Reff
            ORDER BY total_quantity DESC
            LIMIT 100;
        `;

        const sqlAmount = `
            SELECT 
                Drug_name, 
                Vender_name, 
                Drug_Type, 
                Selling_price, 
                Profit, 
                Quantity, 
                Drug_Reff, 
                Vendor_Reff, 
                SUM(Amount_Sold) AS total_amount
            FROM salestable
            WHERE Secret_Key = ? AND Month = ?
            GROUP BY Drug_Reff, Vendor_Reff
            ORDER BY total_amount DESC
            LIMIT 100;
        `;

        const sqlProfit = `
            SELECT 
                Drug_name, 
                Vender_name, 
                Drug_Type, 
                Selling_price, 
                Profit, 
                Quantity, 
                Drug_Reff, 
                Vendor_Reff, 
                SUM(Profit) AS total_profit
            FROM salestable
            WHERE Secret_Key = ? AND Month = ?
            GROUP BY Drug_Reff, Vendor_Reff
            ORDER BY total_profit DESC
            LIMIT 100;
        `;

        // Execute queries
        const [itemQuantity] = await pool.query(sqlItems, [Secret_Key, month]);
        const [itemAmount] = await pool.query(sqlAmount, [Secret_Key, month]);
        const [itemProfit] = await pool.query(sqlProfit, [Secret_Key, month]);
        return {
            quantityBased: itemQuantity,
            revenueBased: itemAmount,
            profitBased: itemProfit
        };
    } catch (error) {
        console.error("Error fetching top selling products:", error);
        throw error;  
    }
};


const overviewService = async (storeID, String_Date) => {
    try {
          // Define queries
          const sumsql = `SELECT COALESCE(SUM(Amount_Due), 0) AS TotalSale FROM bulksales WHERE Secret_Key = ? AND String_Date = ?`;
          const profitsql = `SELECT COALESCE(SUM(Profit_Earn), 0) AS TotalProfit FROM bulksales  Secret_Key = ? AND String_Date = ?`;
          const orderSql = `SELECT COUNT(id) AS TotalOrders FROM bulksales WHERE Secret_Key = ? AND String_Date = ?`;
          const countStaffSql = `SELECT COUNT(id) AS Total FROM users WHERE Secret_Key = ?`;
  
          const amountSql = `SELECT SUM(Selling_price * Left_Quantity) AS Total FROM retaildrugs WHERE Secret_Key = ? AND Left_Quantity > ?`;
          const countSql = `SELECT COUNT(id) AS Total FROM retaildrugs WHERE Secret_Key AND Left_Quantity > ?`;
          const sumSql = `SELECT SUM(Left_Quantity) AS Total FROM retaildrugs WHERE Secret_Key AND Left_Quantity > ?`;
          const outOfStockSql = `SELECT COALESCE(SUM(Left_Quantity), 0) AS Total FROM retaildrugs Secret_Key AND WHERE Left_Quantity < ?`;
  
          // Execute queries concurrently
          const [
              [[sum]],
              [[profit]],
              [[orders]],
              [[staffCount]],
              [productCount],
              [totalCount],
              [amounts],
              [outOfStock],
          ] = await Promise.all([
              pool.query(sumsql, [storeID, String_Date]),
              pool.query(profitsql, [storeID, String_Date]),
              pool.query(orderSql, [storeID, String_Date]),
              pool.query(countStaffSql, [storeID]),
              pool.query(countSql, [storeID, 0]),
              pool.query(sumSql, [storeID, 0]),
              pool.query(amountSql, [storeID, 0]),
              pool.query(outOfStockSql, [storeID, 0])
          ]);
  
          // Return formatted data
          return {
              totalSale: sum.TotalSale || 0,
              totalProfit: profit.TotalProfit || 0,
              totalOrders: orders.TotalOrders || 0,
              totalStaffs: staffCount.Total || 0,
              items: productCount[0].Total || 0,
              stockQuantity: totalCount[0].Total || 0,
              amount: amounts[0].Total || 0,
              outOfStock: outOfStock[0]?.Total || 0,
          };
      } catch (error) {
          console.error("Error in overviewService:", error);
          throw error;
      }
};

module.exports = {
    getAllStores,
    getStoreSales,
    storeInventories,
    ordersServices,
    employeeServices,
    topSellingProductServices,
    overviewService
}