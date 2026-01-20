const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const  verifyToken  = require('../middlewares/verifyToken');

router.get('/',verifyToken,cartController.getCart);
router.post('/',verifyToken,cartController.addToCart);
router.post('/merge',verifyToken,cartController.mergeCart);
router.delete('/remove',verifyToken,cartController.removeFromCart);
router.delete('/clear',verifyToken,cartController.clearCart);
router.patch('/update', verifyToken, cartController.updateItemQuantity);
module.exports = router;