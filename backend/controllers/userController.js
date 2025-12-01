const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/userModel");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const generateToken = require("../utils/generateToken");

const getAllUsers = asyncWrapper(async(req, res, next)=>{
    const users = await User.find().select('-password');
    res.json({
        status: httpStatusText.SUCCESS,
        data: {users}
    });
})
const deleteUser = asyncWrapper(async(req, res, next)=>{
    await User.findByIdAndDelete(req.params.id);
    res.json({
        status: httpStatusText.SUCCESS,
        data: null
    });
})
const updateUserProfile = asyncWrapper(async(req, res, next)=>{
    const user = await User.findById(req.user.id);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password){
            user.password = req.body.password;
        }
        const updateUser= await user.save();
        const token = generateToken({ email: updatedUser.email, id: updatedUser._id, role: updatedUser.isAdmin ? 'admin' : 'user' })
        res.json({
            status: httpStatusText.SUCCESS,
            data: {
                user: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    isAdmin: updatedUser.isAdmin,
                    token: token
                }
            }
        })
    } else {
        const error = appError.create('User not found', 404, httpStatusText.FAIL);
        return next(error);
    }

})

const register = asyncWrapper(async(req, res, next)=>{
    const {name, email, password} = req.body;

    const userExists =await User.findOne({email})
    if(userExists){
        const error = appError.create('User already exists', 400, httpStatusText.FAIL)
        return next(error)
    }
    const user = await User.create({
        name,
        email,
        password
    })
    const token = await generateToken({email:user.email,id:user._id,role:user.isAdmin?'admin': 'user'})
    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: token 
            }
        }
    });
})

const login = asyncWrapper(async(req, res, next)=>{
    const {email, password} = req.body;
    const user =await User.findOne({email})
    if(user && (await user.matchPassword(password))){
        const token = generateToken({ email: user.email, id: user._id, role: user.isAdmin ? 'admin' : 'user' });
        res.json({
            status: httpStatusText.SUCCESS,
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: token
                }
            }
        });
    } else {
        const error = appError.create('Invalid email or password', 401, httpStatusText.FAIL);
        return next(error);
    }
})
const getUserProfile = asyncWrapper(async(req, res, next)=>{
    const user = await User.findById(req.user._id)
    if(user){
        res.json({
            status: httpStatusText.SUCCESS,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            }
        });
    } else {
        const error = appError.create('User not found', 404, httpStatusText.FAIL);
        return next(error);
    }
})

module.exports ={
    register,
    login,
    getUserProfile,
    getAllUsers,
    deleteUser,
    updateUserProfile
}