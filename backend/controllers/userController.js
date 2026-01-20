const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/userModel");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const generateToken = require("../utils/generateToken");
const APIFeatures = require("../utils/apiFeatures");

const getAllUsers = asyncWrapper(async(req, res, next) => {
    // تجهيز البحث (الاسم أو الإيميل)
    let filter = {};
    if (req.query.search) {
        const keyword = req.query.search.trim();
        filter = {
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { email: { $regex: keyword, $options: 'i' } }
            ]
        };
    }

    // استخدام APIFeatures للترتيب والصفحات
    const features = new APIFeatures(User.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // تنفيذ الكويري
    const users = await features.query.select('-password'); // أمان: مش عايزين الباسورد يرجع
    
    // حساب العدد الكلي (عشان الـ Pagination في الفرونت)
    const total = await User.countDocuments(filter);

    res.json({
        status: httpStatusText.SUCCESS,
        results: users.length,
        total: total,
        paginationResult: { 
            currentPage: req.query.page * 1 || 1,
            limit: req.query.limit * 1 || 10,
            numberOfPages: Math.ceil(total / (req.query.limit * 1 || 10))
        },
        data: { users }
    });
});
const updateUserByAdmin = asyncWrapper(async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        // هنا المربط الفرس: السماح بتغيير حالة الأدمن
        if (req.body.isAdmin !== undefined) {
            user.isAdmin = req.body.isAdmin;
        }

        const updatedUser = await user.save();

        res.json({
            status: httpStatusText.SUCCESS,
            data: {
                user: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    isAdmin: updatedUser.isAdmin,
                }
            }
        });
    } else {
        const error = appError.create('User not found', 404, httpStatusText.FAIL);
        return next(error);
    }
});
const deleteUser = asyncWrapper(async(req, res, next)=>{
    await User.findByIdAndDelete(req.params.id);
    res.json({
        status: httpStatusText.SUCCESS,
        data: null
    });
})
const updateUserProfile = asyncWrapper(async(req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        const error = appError.create('User not found', 404, httpStatusText.FAIL);
        return next(error);
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    if (req.body.password) {
        user.password = req.body.password;
    }
    if (req.file) {
        user.profileImg = req.file.path;
    }
    const updatedUser = await user.save();

    const token = generateToken({ 
        email: updatedUser.email, 
        id: updatedUser._id, 
        role: updatedUser.isAdmin ? 'admin' : 'user' 
    });
    res.json({
        status: httpStatusText.SUCCESS,
        data: {
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: token,
                profileImg: updatedUser.profileImg 
            }
        }
    })
});
const register = asyncWrapper(async(req, res, next)=>{

    const {name, email, password} = req.body;
    let profileImgUrl ='';
    if(req.file){
        profileImgUrl = req.file.path;
    }
    const userExists =await User.findOne({email})
    if(userExists){
        const error = appError.create('User already exists', 400, httpStatusText.FAIL)
        return next(error)
    }
    const user = await User.create({
        name,
        email,
        password,
        profileImg:profileImgUrl ||undefined
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
                token: token ,
                profileImg:profileImgUrl ||undefined
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
                    token: token,
                    profileImg: user.profileImg
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
const logOut = asyncWrapper(async(req, res, next)=>{
    res.json({
        status: httpStatusText.SUCCESS,
        data: null
    });
})

module.exports ={
    register,
    login,
    getUserProfile,
    getAllUsers,
    deleteUser,
    updateUserProfile,
    logOut,
    updateUserByAdmin
}