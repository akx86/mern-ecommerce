const User = require("../models/userModel");
const asyncWrapper = require("./asyncWrapper");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

const jwt = require('jsonwebtoken')
const verifyToken =asyncWrapper(async(req, res, next)=>{
    const authHeader = req.headers['Authorization'] ||req.headers['authorization'];
    if(!authHeader){
        const error = appError.create('Token is required', 401, httpStatusText.FAIL);
        return next(error);
    }
    const token =authHeader.split(' ')[1];
    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password')
        next();
    }catch(err){
        console.log("🔥 ERROR DETAILS:", err.message); 
        console.log("🔥 FULL ERROR:", err);
        const error = appError.create('Invalid token', 401, httpStatusText.FAIL);
        return next(error);
    }
})
module.exports= verifyToken;