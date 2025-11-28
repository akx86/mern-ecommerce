const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            rqeuired:true,
            ref: 'User'
        },
        name:{
            type:String,
            rqeuired:true
        },
        image:{
            type:String,
            rqeuired:true
        },
        description:{
            type:String,
            rqeuired:true
        },
        brand:{
            type:String,
            rqeuired:true
        },
        category:{
            type:String,
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
