
const sanitizeStaffData = (storeData, token) => {
    if (!storeData) return null;

    return {
        store: storeData.Pharmacy_name || '',
        email: storeData.email || '',
        physicalAddress: storeData.physicalAddress || '',
        printer: storeData.printer || '',
        telephone: storeData.Telephone || '',
        location: storeData.Location || '',
        username: storeData.Username || '',
        name: storeData.Name || '',
        storeID: storeData.Publick_Key,
        token
    };
};


const sanitizeProfileData = (storeData) => {
    if (!storeData) return null;

    return {
        store: storeData.Pharmacy_name || '',
        email: storeData.email || '',
        physicalAddress: storeData.physicalAddress || '',
        printer: storeData.printer || '',
        telephone: storeData.Telephone || '',
        location: storeData.Location || '',
        username: storeData.Username || '',
        name: storeData.Name || '',
        storeID: storeData.Publick_Key,
    };
};


module.exports = {
    sanitizeStaffData,
    sanitizeProfileData
};
