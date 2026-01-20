const express = require('express');
const categoryController = require('../controllers/categoryController');
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowedTo');
const upload = require('../middlewares/uploadImage');
const router = express.Router();

router.route('/')
    .get(categoryController.getCategories)
    .post(verifyToken,allowedTo('admin'),upload.single('image'),categoryController.createCategory); 

router.route('/:id')
    .get(categoryController.getCategoryById)
    .delete(verifyToken,allowedTo('admin'),categoryController.deleteCategory)
    .patch(verifyToken,allowedTo('admin'),upload.single('image'),categoryController.editCategory);
    
module.exports = router;