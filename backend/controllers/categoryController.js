const Category = require('../models/categoryModel');
const asyncWrapper = require('../middlewares/asyncWrapper');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const Product = require('../models/productModel');

const getCategories = asyncWrapper(async (req, res, next) => {
    let filter = {};

    if (req.query.search) {
        const keyword = req.query.search;
        if (require('mongoose').mongoose.Types.ObjectId.isValid(keyword)) {
            filter = { 
                $or: [
                    { _id: keyword }, 
                    { title: { $regex: keyword, $options: 'i' } } 
                ]
            };
        } else {
            filter = { title: { $regex: keyword, $options: 'i' } };
        }
    }
    
    const features = new APIFeatures(Category.find(filter), req.query)
        .sort()
        .limitFields()
        .paginate();
    const categories = await features.query;
    const categoriesWithCount = await Promise.all(
        categories.map(async(cat)=>{
            const count = await Product.countDocuments({ category: cat._id });
            return {
                ...cat.toObject(),
                productsCount: count
            }
        })

    )
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        results: categories.length,
        paginationResult: features.paginationResult,
        data: { categories: categoriesWithCount }
    });
});

const createCategory = asyncWrapper(async (req, res, next) => {

    const {title} = req.body;
    const categoryExist = await Category.findOne({title});
    if(categoryExist) { 
        
        const error = appError.create('Category already exist', 400, httpStatusText.FAIL);
        return next(error);
    }

    const ImgUrl = req.file ? req.file.path : '';
    const category = await Category.create({
        title,
        image: ImgUrl
    });

    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { category }
    });
});

const editCategory =asyncWrapper(async(req, res, next) =>{
    const { id } = req.params;
    const category = await Category.findById(id); 

    if(!category) {
        const error = appError.create('Category not found', 404, httpStatusText.FAIL);
        return next(error);
    }
    Object.assign(category,req.body);
     if (req.file) {
            category.image = req.file.path;
            }
    await category.save();
    res.status(200).json({status:httpStatusText.SUCCESS,data:{category}})
})
const getCategoryById = asyncWrapper(async(req, res, next)=>{
    const { id } = req.params;
    const category = await Category.findById(id);
    if(!category) {
        const error = appError.create('Category not found', 404, httpStatusText.FAIL);
        return next(error);
    }
    res.status(200).json({status:httpStatusText.SUCCESS,data:{category}})
})
const deleteCategory = asyncWrapper(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
        const error = appError.create('Category not found', 404, httpStatusText.FAIL);
        return next(error);
    }
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { category }
    });
});

module.exports = {
    getCategories,
    createCategory,
    editCategory,
    deleteCategory,
    getCategoryById
};