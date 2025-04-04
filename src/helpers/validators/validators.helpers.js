
const validator = require('validator')

const CustomError = require('../../classUtils/customErrorClass'); 

const validateOrganizationID = (organizationID) => {

  if (!organizationID || !organizationID.trim()) {
    throw new CustomError(400, 'Bad request, organizationID is missing. Check to see if the user is properly loggedin or the organizationID was sent along the request');
  }

  return organizationID.trim();
};

/////////////Email validation/////////////
const validateEmail = (email) => {

  if (!email || !email.trim()) {
    throw new CustomError(400, 'Bad request, Email is required');
  }

  if(!validator.isEmail(email)){
    throw new CustomError(400, 'Bad request, Provide a valid email address')
  }

  return email.trim();
};



const validateStaffID = (staffID) => {

  if (!staffID || !staffID.trim()) {
    throw new CustomError(400, 'Bad request, staffID/ProviderID is missing');
  }

  return staffID.trim();
};

const validateQueryString = (string) => {
  
  if (!string || !string.trim()) {
    throw new CustomError(400, 'Bad request, query parameter not supplied');
  }

  return string.trim();
}


const getStoreID = (req) => {
  console.log(req.user)
  if (!req || !req.user || !req.user.data|| !req.user.data.secret_Key){
    throw new CustomError(400, 'Bad request, Loggedin user data cannot be extracted. Login neeeded');
  }

  return (req.user.data.secret_Key).trim()
}


const validateUserID = (userID) => {

  if (!userID || !userID.trim()) {
    throw new CustomError(400, 'Bad request, userID is missing');
  }

  return userID.trim();
};


const compareProviderID = (req, providerID) => {
  if (!providerID || !providerID.trim()) {
    throw new CustomError(400, 'Bad request, providerID is missing');
  }

  if (!req || !req.user || !req.user.data|| !req.user.data.userID){
    throw new CustomError(400, 'Bad request, Loggedin user data cannot be extracted. Login neeeded');
  }

  const userProviderID =  (req.user.data.userID).trim()

  if(providerID !== userProviderID){
    return false
  }

  return true
}


module.exports = {
    validateOrganizationID,
    validateEmail,
    validateStaffID,
    validateQueryString,
    getStoreID,
    validateUserID,
    compareProviderID

}