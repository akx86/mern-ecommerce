const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
             required:true,
            ref: 'User'
        },
        title:{
            type:String,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category',
            required:true
        },
        price:{
            type:Number,
            required:true,
            default:0
        },
        countInStock:{
            type:Number,
            required:true,
            default:0
        }
    },
    {
        timestamps:true,
    }
);

const Product =mongoose.model('Product',productSchema);
module.exports = Product;
