const CustomError = require('../classUtils/customErrorClass');
const pool = require('../config/database.config');

const allProducts = async (Secret_Key) => {
    try {
        const sql = `SELECT * FROM retaildrugs WHERE Secret_Key = ?`

        const [items] = await pool.query(sql, [Secret_Key]);

        return items
    } catch (error) {
        console.log(error)
        throw error
    }
}

const editProductQuantity = async(Secret_Key, Drug_Reff, Vendor_Reff, quantity) => {
    try {
        const sql = `UPDATE retaildrugs SET Quantity = ?, Ini_Quantity = ?, Left_Quantity = ?, Overall_Quantity = ?, WHERE Secret_Key = ? AND Drug_Reff = ? AND Vendor_Reff = ?`

        const [savedb] = await pool.query(sql, [quantity, quantity, quantity, quantity, Secret_Key, Drug_Reff, Vendor_Reff]);

        return savedb[0]
    } catch (error) {
        console.log(error)
        throw error
    }
}



const editProductPrice = async(Secret_Key, Drug_Reff, Vendor_Reff, Cost_price, Selling_price, wholesale_price) => {
    try {
        const sql = `UPDATE retaildrugs SET Cost_price = ?, Selling_price = ?, wholesale_price = ? WHERE Secret_Key = ? AND Drug_Reff = ? AND Vendor_Reff = ?`

        const [savedb] = await pool.query(sql, [Cost_price, Selling_price, wholesale_price, Secret_Key, Drug_Reff, Vendor_Reff]);

        return savedb[0]
    } catch (error) {
        console.log(error)
        throw error
    }
}


const deleteProduct = async(Secret_Key, Drug_Reff, Vendor_Reff) => {
    try {
        const sql = `DELETE FROM retaildrugs WHERE Secret_Key = ? AND Drug_Reff = ? AND Vendor_Reff = ?`

        const [savedb] = await pool.query(sql, [Secret_Key, Drug_Reff, Vendor_Reff]);

        return savedb[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}


const outofStockProducts = async (Secret_Key) => {
    try {
        const sql = `SELECT * FROM retaildrugs WHERE Secret_Key = ? AND Stock_Limit >= Left_Quantity`

        const [items] = await pool.query(sql, [Secret_Key])

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


const expiryProducts = async(Secret_Key) => {
    try {
        let Date_Expiry = new Date().getTime()
        let Left_Quantity  = 0

        let sql = `SELECT * FROM  retaildrugs WHERE Secret_Key = ? AND Date_Expiry <= ? AND Left_Quantity > ? AND NOT Date_Expiry < ?`

        const [items] = await pool.query(sql, [Secret_Key, Date_Expiry, Left_Quantity, 1]);

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

