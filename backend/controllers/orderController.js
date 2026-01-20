const Order = require('../models/orderModel');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/userModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const addOrderItems = asyncWrapper(async (req, res, next) => {
   
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid, 
        paidAt,
        paymentResult
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
        isPaid: isPaid || false, 
        paidAt: paidAt || null,
        paymentResult: paymentResult || {},
    });
    const createdOrder = await order.save();
    if(createdOrder){
        await Promise.all(orderItems.map(async (item) => {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { countInStock: -item.quantity } 
            });
        }));
        await Cart.findOneAndDelete({ user: req.user._id });
    }
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
    

    let filter = {};
    if (req.query.search) {
        const keyword = req.query.search.trim();
        if (require('mongoose').Types.ObjectId.isValid(keyword)) {
            filter = { _id: keyword };
        } else {
 
            filter = { _id: null }; 
        }
    }

    const features = new APIFeatures(Order.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    // 3. Populate User Data
    features.query = features.query.populate('user', 'id name email')
    .populate({
        path: 'orderItems.product', 
        select: 'name image ' 
    });;


    const orders = await features.query;

    const total = await Order.countDocuments(filter);

    res.json({
        status: httpStatusText.SUCCESS,
        results: orders.length,
        total: total,
        paginationResult: { 
            currentPage: req.query.page * 1 || 1,
            limit: req.query.limit * 1 || 10, // أو القيمة الافتراضية اللي عندك
            numberOfPages: Math.ceil(total / (req.query.limit * 1 || 10))
        },
        data: { orders }
    });
});
const updateOrderToPaid = asyncWrapper(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    
    if(order){
        order.isPaid = true;
        order.paidAt = Date.now();
        
        // التعديل هنا: بنحط قيم افتراضية لو الـ Body فاضي (عشان الآدمن)
        order.paymentResult = {
            id: req.body.id || 'Admin_Manual_Payment', 
            status: req.body.status || 'COMPLETED',
            update_time: req.body.update_time || Date.now(),
            email_address: req.body.email_address || 'Admin@System',
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
const cancelOrder = asyncWrapper(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(appError.create('Order not found', 404));
    }

    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return next(appError.create('Not authorized to cancel this order', 401));
    }

    if (order.isPaid || order.isDelivered) {
        return next(appError.create('Cannot cancel a paid or delivered order', 400));
    }

    for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { countInStock: item.quantity }
        });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        message: 'Order cancelled successfully'
    });
});
const getDashboardStats = asyncWrapper(async (req, res, next) => {
    const { range } = req.query; 
    
    let days = 7;
    if (range === '30days') days = 30;
    if (range === '1year') days = 365;


    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const salesStats = await Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } } 
    ]);

    const ordersCount = await Order.countDocuments();
    const productsCount = await Product.countDocuments();
    const usersCount = await User.countDocuments();

    const salesChart = await Order.aggregate([
        { 
            $match: { 
               
                createdAt: { $gte: startDate } 
            } 
        },
        {
            $group: {
           
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                sales: { $sum: "$totalPrice" } 
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: {
            totalSales: salesStats.length > 0 ? salesStats[0].totalSales : 0,
            totalOrders: ordersCount,
            totalProducts: productsCount,
            totalUsers: usersCount,
            salesChart: salesChart 
        }
    });
});
const createPaymentIntent = asyncWrapper(async (req, res ,next) => {
    const itemIds = req.body.orderItems.map(item => item._id)
    const products = await Product.find({ _id: { $in : itemIds }})

    const totalPrice =products.reduce((acc, product) => {
        const requestItem = req.body.orderItems.find(
            item => item._id.toString() === product._id.toString()
        );
        const  quantity = requestItem? requestItem.quantity : 0
        return acc + (product.price * quantity)
    },0)
    const finalAmount = Math.round(totalPrice * 100);

    const paymentIntent = await stripe.paymentIntents.create({
        amount : finalAmount,
        currency : 'usd',
        automatic_payment_methods :{ enabled: true }
    });
    res.json({
        status: httpStatusText.SUCCESS,
        data: {clientSecret: paymentIntent.client_secret }
    });

})

module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderToPaid,
    updateOrderToDelivered,
    updateBulkDelivered,
    cancelOrder,
    getDashboardStats,
    createPaymentIntent
}