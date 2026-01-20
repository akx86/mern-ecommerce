const asyncWrapper = require("../middlewares/asyncWrapper");
const Cart = require("../models/cartModel");
const httpStatusText = require("../utils/httpStatusText");
const Product = require("../models/productModel");


const getCart = asyncWrapper(
    async (req, res) => {
        const cart = await Cart.findOne({user:req.user._id})
        if(cart){
            await cart.populate("items.product");
            
        }
        res.json({status:httpStatusText.SUCCESS,data:{cart}})
    }
)
const addToCart = asyncWrapper(
    async (req, res) => {
        const {productId,quantity} = req.body;
        const product = await Product.findById(productId);
        if(!product || product.stock <= 0){
            const error = appError.create('Product not found or out of stock', 404, httpStatusText.FAIL);
            return next(error);
        }
        let cart = await Cart.findOne({user:req.user._id});
        if(!cart){
             cart = new Cart({
                user:req.user._id,
                items:[{
                    product:productId,
                    quantity
                }],
                totalPrice:quantity*product.price
            })
            
        }else {
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if(itemIndex > -1){
                cart.items[itemIndex].quantity += quantity;
                cart.totalPrice += product.price * quantity;
            }else{
                cart.items.push({ product: productId, quantity });
                cart.totalPrice += product.price * quantity;
            }
        }
            await cart.save();
            await cart.populate("items.product");
            res.json({status:httpStatusText.SUCCESS,data:{cart}})
    }
)
const mergeCart = asyncWrapper(
    async (req, res) => {
        const {localItems} = req.body;
        if (!localItems || !Array.isArray(localItems)) {
            return res.status(400).json({ status: httpStatusText.FAIL, message: "localItems must be an array" });
        }
        let cart = await Cart.findOne({user:req.user._id});
        if(!cart){
            cart = new Cart({ user: req.user.id, items: localItems });
        }else{
            localItems.forEach(localItem => {
                const existingItemIndex = cart.items.findIndex(
                    dbItem => dbItem.product.toString() === localItem.product
                )
                if (existingItemIndex > -1) {
                    cart.items[existingItemIndex].quantity += localItem.quantity;
                } else {
                    cart.items.push(localItem);
                }
            });
        }
        await cart.populate('items.product');
        let total = 0;
        cart.items.forEach(item => {
            if (item.product) {
                total += item.quantity * item.product.price;
            }
        });
        cart.totalPrice = total;
        await cart.save();
        res.status(200).json({status:httpStatusText.SUCCESS,data:{cart}});
    }
)
const removeFromCart = asyncWrapper(
    async (req, res) => {
        const {productId} = req.body;
        const cart = await Cart.findOne({user:req.user._id});
        if(cart){
            cart.items = cart.items.filter(item => item.product.toString() !== productId);
            await cart.save();
            res.status(200).json({status:httpStatusText.SUCCESS,data:{cart}});
        }
    }
)
const clearCart = asyncWrapper(
    async (req, res) => {
        const cart = await Cart.findOne({user:req.user._id});
        if(cart){
            cart.items = [];
            await cart.save();
            res.status(200).json({status:httpStatusText.SUCCESS,data:{cart}});
        }
    }
)
const updateItemQuantity = asyncWrapper(async (req, res, next) => {
    const { productId, quantity } = req.body;
    
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) {
        const error = appError.create('Cart not found', 404, httpStatusText.FAIL);
        return next(error);
    }

    const itemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);

    if (itemIndex > -1) {
        if (quantity > 0) {
            cart.items[itemIndex].quantity = quantity;
        } else {
            cart.items.splice(itemIndex, 1);
        }

        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + (item.quantity * item.product.price);
        }, 0);

        await cart.save();
        res.status(200).json({ status: httpStatusText.SUCCESS, data: { cart } });
    } else {
        const error = appError.create('Item not found in cart', 404, httpStatusText.FAIL);
        return next(error);
    }
});
module.exports = {
    getCart,
    addToCart,
    mergeCart,
    removeFromCart,
    clearCart,
    updateItemQuantity
}