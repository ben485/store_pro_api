const bcrypt = require('bcryptjs');

const CustomError = require('../classUtils/customErrorClass');
const pool = require('../config/database.config');

async function findUser(email, password) {
    try {
        const sql = `SELECT * FROM users WHERE userEmail = ?`

        const [users] = await pool.query(sql, [email])

        if(users.length === 0){
            throw new CustomError(400, 'The email is not registered');
        }

        const oneUser = users[0]

        // Compare provided password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, oneUser.password);
        if (!isPasswordValid) {
            throw new CustomError(400, 'Invalid password/email');
        }

         return oneUser

    } catch (error) {
        console.log(error)
        throw error
    }
}


const profile = async(email) => {
    try {
        const sql = `SELECT * FROM users WHERE userEmail = ?`

        const [users] = await pool.query(sql, [email])

        if(users.length === 0){
            throw new CustomError(400, 'User not found');
        }

        const oneUser = users[0]
        return oneUser
    } catch (error) {
        console.log(error)  
        throw error
    }
}



module.exports = {
 findUser,
 profile
}