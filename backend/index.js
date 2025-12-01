const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db')
const app =express();
const httpStatusText = require('./utils/httpStatusText');
const PORT =process.env.PORT;
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/products',productRoutes)
app.use('/api/users',userRoutes)

app.use((err, req, res, next)=>{
    res.status(err.statusCode || 500)
        .json({status:err.statusText ||httpStatusText.ERROR,
        message :err.message,
        code:err.statusCode||500,
        data:null})
})

app.listen(PORT,()=>{
    console.log(`server listen in port ${PORT}`);
    
})