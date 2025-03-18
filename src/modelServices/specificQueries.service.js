const CustomError = require('../classUtils/customErrorClass');
const pool = require('../config/database.config');

const totalSale = async (String_Date) => {
    try {
        let sumsql = `SELECT COALESCE(SUM(Amount_Due), 0) AS TotalSale FROM bulksales WHERE String_Date = ?`;
        let profitsql = `SELECT COALESCE(SUM(Profit_Earn), 0) AS TotalProfit FROM bulksales WHERE String_Date = ?`;

        const [[sum]] = await pool.query(sumsql, [String_Date]);  
        const [[profit]] = await pool.query(profitsql, [String_Date]);

        const data = {
            totalSale: sum.TotalSale || 0,  
            totalProfit: profit.TotalProfit || 0
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

        const data = {
            staffNumbers: usersNumber[0].Total || 0,
            staffs: users,
        }

        return data
    } catch (error) {
        throw error
    }
}

module.exports = {
    totalSale,
    inventories,
    staffs
}
