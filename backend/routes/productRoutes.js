const express = require('express');
const router = express.Router();
const validationSchema = require('../middlewares/validationSchema');
const productController = require('../controllers/productController');
const verifyProductExist = require('../middlewares/verifyProductExist');


router.route('/')
.get(productController.getProducts)
.post(validationSchema,productController.createProduct)

router.route('/:id')
.get(verifyProductExist,productController.getProductById)
.put(verifyProductExist,productController.editProduct)
.delete(verifyProductExist,productController.deleteProduct)


module.exports = router;