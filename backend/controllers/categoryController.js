const Category = require('../models/categoryModel');
const asyncWrapper = require('../middlewares/asyncWrapper');
const httpStatusText = require('../utils/httpStatusText');

const getCategories = asyncWrapper(async (req, res, next) => {
    const categories = await Category.find();

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        results: categories.length,
        data: { categories }
    });
});

const createCategory = asyncWrapper(async (req, res, next) => {
    const newCategory = await Category.create(req.body);
    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { category: newCategory }
    });
});

module.exports = {
    getCategories,
    createCategory
};