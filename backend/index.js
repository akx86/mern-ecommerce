const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db')
const app =express();
const PORT =process.env.PORT;
connectDB();

const productRoutes = require('./routes/productRoutes')

app.use(express.json());
app.use(cors());

app.get('/',(req, res)=>{
    res.send('api is running...')
})

app.use('/api/products',productRoutes)



    app.listen(PORT,()=>{
    console.log(`server listen in port ${PORT}`);
    
})