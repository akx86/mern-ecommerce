const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.route('/')
    .get(categoryController.getCategories)
    .post(categoryController.createCategory); 

module.exports = router;