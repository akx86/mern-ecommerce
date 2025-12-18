const asyncWrapper = require("../middlewares/asyncWrapper");
const Cart = require("../models/cartModel");
const httpStatusText = require("../utils/httpStatusText");

const getCart = asyncWrapper(
    async (req, res) => {
        const cart = await Cart.findOne({user:req.user._id}).populate('items.product');
        res.json({status:httpStatusText.SUCCESS,data:{cart}})
    }
)
const addToCart = asyncWrapper(
    async (req, res) => {
        const {productId,quantity} = req.body;
        const cart = await Cart.findOne({user:req.user._id});
        if(!cart){
            const newCart = new Cart({
                user:req.user._id,
                items:[{
                    product:productId,
                    quantity
                }],
                totalPrice:quantity*req.product.price
            })
            await newCart.save();
            res.json({status:httpStatusText.SUCCESS,data:{newCart}})
        }
    }
)
const mergeCart = asyncWrapper(
    async (req, res) => {
        const {localItems} = req.body;
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
module.exports = {
    getCart,
    addToCart,
    mergeCart,
    removeFromCart,
    clearCart
}