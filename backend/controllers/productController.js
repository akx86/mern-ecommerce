const { validationResult } = require('express-validator');
const asyncWrapper = require('../middlewares/asyncWrapper');
const Product =require('../models/productModel');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');

const getProducts = asyncWrapper(
        async (req, res, next) => {  
        const products = await Product.find({})
        if(!products){
            const error = appError.create('Products Not Found',404,httpStatusText.FAIL);
            return next(error);
        }
        res.json({status:httpStatusText.SUCCESS,data:products}) 
})
const getProductById = asyncWrapper(
    async(req, res, next) => {
        const product = req.product;
        return res.json({status:httpStatusText.SUCCESS,data:{product}})  
})
const createProduct=asyncWrapper (
    async(req, res, next)=>{
        console.log('data =>',req.body);
        
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = appError.create(errors.array()[0].msg,400,httpStatusText.FAIL);
        return next(error);
    }
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({status:httpStatusText.SUCCESS,data:{newProduct}})
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
