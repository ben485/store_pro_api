const CustomError = require('../classUtils/customErrorClass');
const pool = require('../config/database.config');

const helperFunction = require('../helpers/transformers/user.helpers')

const totalSale = async (String_Date) => {
    try {
        let sumsql = `SELECT COALESCE(SUM(Amount_Due), 0) AS TotalSale FROM bulksales WHERE String_Date = ?`;
        let profitsql = `SELECT COALESCE(SUM(Profit_Earn), 0) AS TotalProfit FROM bulksales WHERE String_Date = ?`;
        let orderSql = `SELECT (id) AS TotalOrders FROM bulksales WHERE String_Date = ?`;
        const countStaff = `SELECT COUNT(id) AS Total FROM users`

        const [[sum]] = await pool.query(sumsql, [String_Date]);  
        const [[profit]] = await pool.query(profitsql, [String_Date]);
        const [[orders]] = await pool.query(orderSql, [String_Date])

        const data = {
            totalSale: sum.TotalSale || 0,  
            totalProfit: profit.TotalProfit || 0,
            totalOrders: orders.TotalOrders || 0,
            totalStaffs: countStaff.Total || 0

        };

        return data
    } catch (error) {
        throw error; 
    }
};


const inventories = async() => {
    try {
        const countSql = `SELECT COUNT(id) AS Total FROM retaildrugs WHERE Left_Quantity > ?`
        const sumSql = `SELECT SUM(Left_Quantity) AS Total FROM retaildrugs WHERE Left_Quantity > ?`
        const amountSql = `SELECT SUM(Selling_price * Left_Quantity) AS Total FROM retaildrugs WHERE Left_Quantity > ?`;

        const [productCount] = await pool.query(countSql, [0])
        const [totalCount] = await pool.query(sumSql, [0]);
        const [amounts] = await pool.query(amountSql, [0])

        const data = {
            items: productCount[0].Total || 0,
            stock: totalCount[0].Total || 0,
            amount: amounts[0].Total || 0
        }

        return data
    } catch (error) {
        throw error
    }
}


const staffs = async () => {
    try {
        const count = `SELECT COUNT(id) AS Total FROM users`

        const userSql = `SELECT * FROM users`

        const [usersNumber] = await pool.query(count, []);

        const [users] = await pool.query(userSql, [])

        let staffs ;

       
        if(users.length === 0){
          staffs = []
        }
  
        staffs = users.map(data => helperFunction.sanitizeProfileData(data));


        const data = {
            staffNumbers: usersNumber[0].Total || 0,
            staffs: staffs,
        }

        return data
    } catch (error) {
        throw error
    }
}

const overviewService = async (String_Date) => {
    try {
        let Date_Expiry = new Date().toISOString().split("T")[0]; // Ensure it's in YYYY-MM-DD format
        let Left_Quantity = 0;

        // Define queries
        const sumsql = `SELECT COALESCE(SUM(Amount_Due), 0) AS TotalSale FROM bulksales WHERE String_Date = ?`;
        const profitsql = `SELECT COALESCE(SUM(Profit_Earn), 0) AS TotalProfit FROM bulksales WHERE String_Date = ?`;
        const orderSql = `SELECT COUNT(id) AS TotalOrders FROM bulksales WHERE String_Date = ?`;
        const countStaffSql = `SELECT COUNT(id) AS Total FROM users`;

        const amountSql = `SELECT SUM(Selling_price * Left_Quantity) AS Total FROM retaildrugs WHERE Left_Quantity > ?`;
        const countSql = `SELECT COUNT(id) AS Total FROM retaildrugs WHERE Left_Quantity > ?`;
        const sumSql = `SELECT SUM(Left_Quantity) AS Total FROM retaildrugs WHERE Left_Quantity > ?`;
        const outOfStockSql = `SELECT COALESCE(SUM(Left_Quantity), 0) AS Total FROM retaildrugs WHERE Left_Quantity < ?`;

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
            pool.query(sumsql, [String_Date]),
            pool.query(profitsql, [String_Date]),
            pool.query(orderSql, [String_Date]),
            pool.query(countStaffSql),
            pool.query(countSql, [0]),
            pool.query(sumSql, [0]),
            pool.query(amountSql, [0]),
            pool.query(outOfStockSql, [0])
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
    totalSale,
    inventories,
    staffs,
    overviewService
}
