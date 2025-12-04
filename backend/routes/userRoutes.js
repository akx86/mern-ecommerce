const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowedTo');
const upload = require('../middlewares/uploadImage');

router.post('/register',upload.single('profileImg'), userController.register);
router.post('/login', userController.login);

router.route('/profile')
.get(verifyToken, userController.getUserProfile)
.patch(verifyToken,userController.updateUserProfile)

router.route('/')
.get(verifyToken, allowedTo('admin'),userController.getAllUsers)

router.route('/:id')
.delete(verifyToken, allowedTo('admin'), userController.deleteUser)

module.exports=router;
