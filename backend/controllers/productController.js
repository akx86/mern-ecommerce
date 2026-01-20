const { validationResult } = require('express-validator');
const asyncWrapper = require('../middlewares/asyncWrapper');
const Product =require('../models/productModel');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const APIFeatures = require('../utils/apiFeatures');


const getProducts = asyncWrapper(async (req, res,next) => { 
    let queryObj = { ...req.query };
    if (queryObj.maxPrice) {
        queryObj.price = { lte: queryObj.maxPrice };
    }
    
    if (queryObj.minPrice) {
      
        queryObj.price = { ...queryObj.price, gte: queryObj.minPrice };
    }


    const features = new APIFeatures(Product.find(), queryObj) 
        .filter()
        .search()
        .sort()
        .limitFields();
   
    const countQuery = features.query.clone(); 
    const totalSearchResults = await countQuery.countDocuments();
    
    features.paginate();
     features.query = features.query.populate('category');
    const products = await features.query;
    
    res.json({
        status: httpStatusText.SUCCESS,
        results: products.length,
        total: totalSearchResults,
        data: { products }
    });
});
const getProductById = asyncWrapper(
    async(req, res, next) => {
        const product = await Product.findById(req.params.id).populate('category');
        if(!product){
            const error = appError.create('Product not found', 404, httpStatusText.FAIL);
            return next(error);
        }
        return res.json({status:httpStatusText.SUCCESS,data:{product}})  
})
const createProduct=asyncWrapper (
    async(req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = appError.create(errors.array()[0].msg, 400, httpStatusText.FAIL);
        return next(error);
    }

    if (!req.file) {
        const error = appError.create('Image is required', 400, httpStatusText.FAIL);
        return next(error);
    }
    req.body.image = req.file.path;
    req.body.user = req.user._id;
    const newProduct = new Product(req.body);
    await newProduct.save();

    res.status(201).json({ 
        status: httpStatusText.SUCCESS, 
        data: { newProduct }
    });
})
const editProduct=asyncWrapper(
    async(req, res, next)=>{
        const { id } = req.params;
        const product = await Product.findById(id); 
        if(!product) {
            const error = appError.create('Product not found', 404, httpStatusText.FAIL);
            return next(error);
        }
        Object.assign(product,req.body);
        if (req.file) {
            product.image=req.file.path
        }
        await product.save();

        res.status(200).json({status:httpStatusText.SUCCESS,data:{product}})
})
const deleteProduct=asyncWrapper(
    async(req, res, next)=>{
       await req.product.deleteOne();
       res.status(200).json({status:httpStatusText.SUCCESS,data:null})
})

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    editProduct,
    deleteProduct
}
