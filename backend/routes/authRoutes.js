const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadImage');
const userController = require('../controllers/userController'); 

router.post('/register',upload.single('profileImg'), userController.register);

router.post('/login', userController.login);
router.post('/logout', userController.logOut);

module.exports = router;    