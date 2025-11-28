const dotenv = require('dotenv');
const colors = require('colors');
const users = require('./data/users');
const products = require('./data/products');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const connectDB = require('./config/db'); 
const bcrypt = require('bcryptjs');

dotenv.config();

connectDB()

const importData = async ()=>{
try{
    await Product.deleteMany()
    await User.deleteMany()

    const createUsers = await Promise.all(users.map(async(user)=>{
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password,salt);
        return user;

    }));

    const insertedUsers = await User.insertMany(createUsers);

    const adminUser = insertedUsers[0]._id;

    const sampleProducts = products.map((product) => {
        return {...product, user:adminUser}
    })

    await Product.insertMany(sampleProducts)

    console.log('Data Imported!'.green.inverse);
    process.exit()
}catch (error){
    console.error(`${error}`.red.inverse)
    process.exit(1)
}
}
const destroyData = async ()=>{
    try{
        await Product.deleteMany()
        await User.deleteMany()
        console.log('Data Destroyed'.red.inverse);
        process.exit()
    }catch (erorr){
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
};
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}