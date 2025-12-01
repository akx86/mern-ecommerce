const appError = require("../utils/appError");
const httpStatusText = require('../utils/httpStatusText')
module.exports = (... roles)=>{
    return (req, res, next)=>{
        const userRole = req.user.isAdmin? 'admin':'user'
        if(!roles.includes(userRole)){
            const error = appError.create('Not authorized to access this route', 403, httpStatusText.FAIL);
            return next(error);
        }
        next();

    }
}