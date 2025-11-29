const {body} = require('express-validator');
const validationSchema =
     [
        body('name').notEmpty().withMessage('Name is required'),
        body('price').notEmpty().withMessage('Price is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('category').notEmpty().withMessage('Category is required'),
        // body('image').notEmpty().withMessage('Image is required'),
    ]

module.exports = validationSchema;
