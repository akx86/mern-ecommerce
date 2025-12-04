const multer = require('multer');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const path = require('path');

const storage = multer.diskStorage({
    destination : function (req, file, cb){
        cb(null,path.join(__dirname,'../uploads'))
    },
    filename: function(req, file, cb){
        const ext = file.mimetype.split('/')[1];
        const fileName = `product-${Date.now()}.${ext}`;
        cb(null, fileName)
    }
})

const multerFilter =(req, file, cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    } else{
        cb(appError.create('Not an image! Please upload only images.', 400, httpStatusText.FAIL), false);
    }
}
const upload = multer({
    storage:storage,
    fileFilter:multerFilter
})
module.exports = upload;