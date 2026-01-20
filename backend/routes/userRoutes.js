const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowedTo');
const upload = require('../middlewares/uploadImage');



router.route('/profile')
.get(verifyToken, userController.getUserProfile)
.put(verifyToken,upload.single('profileImg'),userController.updateUserProfile)

router.route('/')
.get(verifyToken, allowedTo('admin'),userController.getAllUsers)

router.route('/:id')
.delete(verifyToken, allowedTo('admin'), userController.deleteUser)
.put(verifyToken, allowedTo('admin'), userController.updateUserByAdmin);
module.exports=router;
