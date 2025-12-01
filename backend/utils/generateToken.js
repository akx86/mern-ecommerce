const jwt = require('jsonwebtoken');
const { model } = require('mongoose');

module.exports = (payload)=>{
    const token =  jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '30d' });

    return token;
}