const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid')

const SuccessResponse = require('../classUtils/CustomResponseClass');

const authService = require('../modelServices/auth.service')
const helperFunction = require('../helpers/transformers/user.helpers')

const auth = require('../middlewares/auth.middleware')

const login  = async (req, res, next) => {
  try {
    const email = req.body.email
    const password = req.body.password

    const user = await authService.findUser(email, password);

    // Generate an access token
    const token = auth.generateAccessKey({
      publick_Key: user.Publick_Key,
      secret_Key: user.Secret_Key,
      username: user.Username,
      role: user.role,
    });

  const transformedUserData = helperFunction.sanitizeStaffData(user, token)
    
  const response = new SuccessResponse(200, 'success', transformedUserData);
  return response.sendResponse(res)

  } catch (error) {
    next(error)
  }
}


const profile = async(req, res, next) => {
  try {
    const email = (req.params.email).trim()
    const user = await authService.profile(email)
    const transformedUserData = helperFunction.sanitizeProfileData(user)

    const response = new SuccessResponse(200, 'success', transformedUserData);
    return response.sendResponse(res)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  profile
}



 