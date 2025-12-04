const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadToCloudinary = async(file, folderName)=>{
    return cloudinary.uploader.upload(file.path, {
        folder:folderName,
        resource_type: 'auto'
    })
}
module.exports = {
    cloudinary,
    uploadToCloudinary
};