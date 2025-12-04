const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db')
const app =express();
const PORT =process.env.PORT;
const httpStatusText = require('./utils/httpStatusText');
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const orderRoutes = require('./routes/orderRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

connectDB();

app.use(express.json());
app.use(cors());
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: 'Too many accounts created from this IP, please try again after 15 minutes'
});
app.use('/api',limiter);
app.use(express.json({limit:'10kb'}));
app.use(mongoSanitize());
app.use(xss());
app.use('/api/products',productRoutes)
app.use('/api/users',userRoutes)
app.use('/api/orders',orderRoutes)
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