const CustomError = require('../classUtils/customErrorClass');
const pool = require('../config/database.config');

const allProducts = async (Publick_Key) => {
    try {
        const sql = `SELECT * FROM retaildrugs WHERE Publick_Key = ?`

        const items = await pool.query(sql, [Publick_Key]);

        return items
    } catch (error) {
        console.log(error)
        throw error
    }
}

const editProductQuantity = async(Publick_Key, Drug_Reff, Vendor_Reff, quantity) => {
    try {
        const sql = `UPDATE retaildrugs SET Quantity = ?, Ini_Quantity = ?, Left_Quantity = ?, Overall_Quantity = ?, WHERE Publick_Key = ? AND Drug_Reff = ? AND Vendor_Reff = ?`

        const [savedb] = await pool.query(sql, [quantity, quantity, quantity, quantity, Publick_Key, Drug_Reff, Vendor_Reff]);

        return savedb[0]
    } catch (error) {
        console.log(error)
        throw error
    }
}



const editProductPrice = async(Publick_Key, Drug_Reff, Vendor_Reff, Cost_price, Selling_price, wholesale_price) => {
    try {
        const sql = `UPDATE retaildrugs SET Cost_price = ?, Selling_price = ?, wholesale_price = ? WHERE Publick_Key = ? AND Drug_Reff = ? AND Vendor_Reff = ?`

        const [savedb] = await pool.query(sql, [Cost_price, Selling_price, wholesale_price, Publick_Key, Drug_Reff, Vendor_Reff]);

        return savedb[0]
    } catch (error) {
        console.log(error)
        throw error
    }
}


const deleteProduct = async(Publick_Key, Drug_Reff, Vendor_Reff) => {
    try {
        const sql = `DELETE FROM retaildrugs WHERE Publick_Key = ? AND Drug_Reff = ? AND Vendor_Reff = ?`

        const [savedb] = await pool.query(sql, [Publick_Key, Drug_Reff, Vendor_Reff]);

        return savedb[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}


const outofStockProducts = async (Publick_Key) => {
    try {
        const sql = `SELECT * FROM retaildrugs WHERE Publick_Key = ? AND Stock_Limit >= Left_Quantity`

        const [items] = await pool.query(sql, [Publick_Key])

        const itemNumber = items.length

        const data = {
            itemNumber,
            items
        }

        return data
    } catch (error) {
        console.log(error)
        throw error
    }
}


const expiryProducts = async(Publick_Key) => {
    try {
        let Date_Expiry = new Date().getTime()
        let Left_Quantity  = 0

        let sql = `SELECT * FROM  retaildrugs WHERE Publick_Key = ? AND Date_Expiry <= ? AND Left_Quantity > ? AND NOT Date_Expiry < ?`

        const [items] = await pool.query(sql, [Publick_Key, Date_Expiry, Left_Quantity, 1]);

       const itemNumber = items.length

       const data = {
        itemNumber,
        items
       }

       return data

    } catch (error) {
        console.log(error)
        throw error
    }
}



module.exports = {
    allProducts,
    editProductQuantity,
    editProductPrice,
    deleteProduct,
    outofStockProducts,
    expiryProducts
}

