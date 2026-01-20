const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema(
    {
        profileImg: {
        type: String,
        default: 'https://imgs.search.brave.com/RPOW_sdHZ8RTfU390t3iQJCmmNVAlIeN40QkCylhTLc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjYv/NjE5LzE0Mi9zbWFs/bC9kZWZhdWx0LWF2/YXRhci1wcm9maWxl/LWljb24tb2Ytc29j/aWFsLW1lZGlhLXVz/ZXItcGhvdG8taW1h/Z2UtdmVjdG9yLmpw/Zw' 
        },
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