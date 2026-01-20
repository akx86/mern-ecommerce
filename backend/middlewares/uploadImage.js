const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce-products', 
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(appError.create('Not an image! Please upload only images.', 400, httpStatusText.FAIL), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

module.exports = upload;