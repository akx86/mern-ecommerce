const Order = require('../models/orderModel');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');

const addOrderItems = asyncWrapper(async (req, res, next) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        } = req.body;
    if (orderItems && orderItems.length === 0) {
        const error = appError.create('No order items', 400, httpStatusText.FAIL);
        return next(error);
    }
    const order = new Order({
        orderItems,
        user: req.user._id, 
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { order: createdOrder }
    });
})
const getOrderById = asyncWrapper(async(req, res, next)=>{
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    )
    if (!order) {
        const error = appError.create('Order not found', 404, httpStatusText.FAIL);
        return next(error);
    }
    res.json({
        status: httpStatusText.SUCCESS,
        data: { order }
    });
})
const getMyOrders = asyncWrapper(async (req, res, next) => {
    const orders =await Order.find({user:req.user._id});

    res.json({
        status: httpStatusText.SUCCESS,
        data: { orders }
    });
})
const getOrders = asyncWrapper(async (req, res, next) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json({
        status: httpStatusText.SUCCESS,
        data: { orders }
    });
})
const updateOrderToPaid = asyncWrapper(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(order){
        const { id, status, update_time, email_address } = req.body;
        if (status !== 'COMPLETED') {
             const error = appError.create('Payment not completed', 400, httpStatusText.FAIL);
             return next(error);
        }
        order.isPaid = true;
        order.paidAt = Date.now();
        
        order.paymentResult = {
            id,
            status,
            update_time,
            email_address,
        };

        const updatedOrder = await order.save();

        res.json({
            status: httpStatusText.SUCCESS,
            data: { order: updatedOrder }
        });
      
    } else {
        const error = appError.create('Order not found', 404, httpStatusText.FAIL);
        return next(error);
    }
})
const updateOrderToDelivered = asyncWrapper(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(order){
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json({
            status: httpStatusText.SUCCESS,
            data: { order: updatedOrder }
        });
    }else {
        const error = appError.create('Order not found', 404, httpStatusText.FAIL);
        return next(error);
    }
})
const updateBulkDelivered = asyncWrapper(async (req, res, next) => {
    const {ordersIds} =req.body;
   await Order.updateMany(
        { _id: { $in: ordersIds } }, 
        { 
            $set: { 
                isDelivered: true, 
                deliveredAt: Date.now() 
            } 
        }
        
    );
    res.json({ status: httpStatusText.SUCCESS, message: 'All selected orders updated'});
})

module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderToPaid,
    updateOrderToDelivered,
    updateBulkDelivered,
}