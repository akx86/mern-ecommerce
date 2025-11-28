const Product =require('../models/productModel');

const getProducts = async (req, res) => {
    try{
        const products = await Product.find({})
        res.json(products)
    }catch (err){
        res.status(500).json({message : 'server error'})
    }
}
const getProductById = async(req, res) => {
    try{
        const product = await Product.findByID(req.params.id);

        if(product){
            res.json(product)
        } else {
            res.status(404).json({message : 'Product Not Found'})
        }
    } catch (err) {
        res.status(500).json({message:'Server Error'})
    }
}
module.exports = {
    getProducts,
    getProductById
}
