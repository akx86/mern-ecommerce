const Product = require('../models/productModel'); 
const appError = require('../utils/appError'); 
const httpStatusText = require('../utils/httpStatusText'); 
const asyncWrapper = require('../middlewares/asyncWrapper'); 

const verifyProductExist = asyncWrapper(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        const error = appError.create('Product Not Found', 404, httpStatusText.FAIL);
        return next(error);
    }
    req.product = product; 
    next();
});
module.exports = verifyProductExist;