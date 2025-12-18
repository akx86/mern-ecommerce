const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const  verifyToken  = require('../middlewares/verifyToken');

router.get('/cart',verifyToken,cartController.getCart);
router.post('/cart',verifyToken,cartController.addToCart);
router.post('/cart/merge',verifyToken,cartController.mergeCart);
router.post('/cart/remove',verifyToken,cartController.removeFromCart);
router.post('/cart/clear',verifyToken,cartController.clearCart);

module.exports = router;