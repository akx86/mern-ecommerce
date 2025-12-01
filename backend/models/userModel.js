const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'name is required']
        },
        email:{
            type:String,
            required:[true,'email is required'],
            unique:true,
            lowercase:true,
            validate:[validator.isEmail,'Please provide a valid email']
        },
        password:{
            type:String,
            required:[true,'password is required'],
            minlength :6
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
    },
    {
        timestamps:true,
    }
)

userSchema.pre('save',async function(){
    if(!this.isModified('password')) return;

    const salt= await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    
})

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

const User = mongoose.model('User',userSchema);
module.exports = User;