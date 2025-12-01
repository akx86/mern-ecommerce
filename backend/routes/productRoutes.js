const express = require('express');
const router = express.Router();
const validationSchema = require('../middlewares/validationSchema');
const productController = require('../controllers/productController');
const verifyProductExist = require('../middlewares/verifyProductExist');
const verifyToken = require('../middlewares/verifyToken')
const allowedTo = require('../middlewares/allowedTo')

router.route('/')
.get(productController.getProducts)
.post(verifyToken,allowedTo('admin'),validationSchema,productController.createProduct)

router.route('/:id')
.get(verifyProductExist,productController.getProductById)
.patch(verifyToken, allowedTo('admin') , verifyProductExist,productController.editProduct)
.delete(verifyToken, allowedTo('admin') , verifyProductExist,productController.deleteProduct)


module.exports = router;