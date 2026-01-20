const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowedTo');

router.route('/')
.post(verifyToken, orderController.addOrderItems)
.get(verifyToken, allowedTo('admin'), orderController.getOrders)

router.route('/myorders')
    .get(verifyToken, orderController.getMyOrders);

router.route('/deliver-bulk') 
    .put(verifyToken, allowedTo('admin'), orderController.updateBulkDelivered);
router.route('/dashboard-stats')
.get(verifyToken, allowedTo('admin'), orderController.getDashboardStats)
router.route('/create-payment-intent')
.post(verifyToken, orderController.createPaymentIntent)
router.route('/:id')
    .get(verifyToken, orderController.getOrderById)
    .delete(verifyToken, orderController.cancelOrder)

router.route('/:id/pay')
    .put(verifyToken, orderController.updateOrderToPaid);

router.route('/:id/deliver')
    .put(
        verifyToken, 
        allowedTo('admin'),
        orderController.updateOrderToDelivered
    );

module.exports = router;