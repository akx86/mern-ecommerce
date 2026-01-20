const {body} = require('express-validator');
const validationSchema =
     [
        body('title').notEmpty().withMessage('title is required'),
        body('price').notEmpty().withMessage('Price is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('category').notEmpty().withMessage('Category is required'),
        body('image').custom((value, { req }) => {
          if (!req.file) {
            throw new Error('Image is required');
            }
         return true; // لو الملف موجود، كمل يا وحش
        }),
    ]

module.exports = validationSchema;
