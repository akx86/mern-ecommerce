const { validationResult } = require('express-validator');
const asyncWrapper = require('../middlewares/asyncWrapper');
const Product =require('../models/productModel');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const APIFeatures = require('../utils/apiFeatures');
const { uploadToCloudinary } = require('../utils/cloudinary');
const fs = require('fs');

const getProducts = asyncWrapper(
        async (req, res, next) => {  
        const features = new APIFeatures(Product.find(),req.query)
        .filter()
        .search()
        .sort()
        .limitFields()
        .paginate()
        const products = await features.query;
        res.json({
        status: httpStatusText.SUCCESS,
        results: products.length,
        data: { products }
    });
        
})
const getProductById = asyncWrapper(
    async(req, res, next) => {
        const product = req.product;
        return res.json({status:httpStatusText.SUCCESS,data:{product}})  
})
const createProduct=asyncWrapper (
    async(req, res, next)=>{
        if (!req.file) {
        const error = appError.create('Image is required', 400, httpStatusText.FAIL);
        return next(error)
        }
        const result = await uploadToCloudinary(req.file, 'products');
        req.body.image = result.secure_url
        fs.unlinkSync(req.file.path);

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = appError.create(errors.array()[0].msg,400,httpStatusText.FAIL);
        return next(error);
    }
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({status:httpStatusText.SUCCESS, product:{newProduct}})
})
const editProduct=asyncWrapper(
    async(req, res, next)=>{
        const product = req.product;

        Object.assign(product,req.body);
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
