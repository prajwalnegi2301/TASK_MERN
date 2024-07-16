import mongoose from 'mongoose'
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter name"],
    },
    email:{
        type:String,
        validate:[validator.isEmail, "Please Enter valid email" ],
    },
    phone:{
        type:String,
        required:true,
        minLength:[10, "Phone number must contain 10 digit"],
    },
    dob:{
        type:Date,
        required:true,
    },
    password:{
        type:String,
        minLength:[8, "Password must contain atleast 8 characters"],
    },
    gender:{
        type:String,
        enum:["Male", "Female", "Other"],
    },
    avatar:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },
    },
    token:{
        type:String,
    }
},{
    timestamps:true,
});

const user = mongoose.model("User",userSchema);
export default user;