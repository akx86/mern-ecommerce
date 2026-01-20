const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Category required'],
        unique: [true, 'Category must be unique'],
        minLength: [3, 'Too short category name'],
        maxLength: [32, 'Too long category name'],
    },
    image: String, 
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;