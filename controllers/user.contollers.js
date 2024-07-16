import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fileUpload from "express-fileupload";
import ErrorHandler from "../middlewares/error.js";
import { errorMiddleware } from "../middlewares/error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import cloudinary from "cloudinary";

export const userRegister = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, phone, dob, gender } = req.body;
  if (!email || !name || !password || !phone || !dob || !gender) {
    return next(new ErrorHandler("Fill All Credentials", 400));
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new ErrorHandler("User already exist, Please Login", 400));
  }

  const { avatar } = req.files;
  const allowedFormats = ["image/png", "image/jpg", "image/webp", "image/avif"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(
      new ErrorHandler(
        "Please provide image in png, jpg, webp or avif format",
        400
      )
    );
  }

  // To upload image to cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(
    avatar.tempFilePath
  );

  if (!cloudinaryResponse || cloudinary.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown cloudinary error!"
    );
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({
    name,
    email,
    phone,
    dob,
    gender,
    password: hashedPassword,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  await user.save();
  res.status(200).json({
    success: true,
    message: "User successfully registered",
  });

});

export const userLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Fill all Credentials", 400));
  }
  const userPresent = await User.findOne({ email });
  if (!userPresent) {
    return next(new ErrorHandler("User does not exist", 400));
  }
  const isPasswordCorrect = bcrypt.compareSync(password, userPresent.password);
  if (!isPasswordCorrect) {
    return next(new ErrorHandler("Please enter correct password", 400));
  }
  const token = jwt.sign(
    {
      id: userPresent._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
  userPresent.token = token;
  res
    .cookie("userToken", token, {
      expiresIn: process.env.COOKIE_EXPIRE,
    })
    //httpOnly:true
    .status(200)
    .json({
      sucess: true,
      message: "user LoggedIn sucessfully",
    });
});

export const userLogout = catchAsyncErrors(async (req, res, next) => {
  res
  .status(200)
  .cookie("token", "",{
    expires: new Date(Date.now()),
    httpOnly:true,
  })
  .json({
    message: "user Logged Out",
    success:true,
  });
});

// export const updateUser = catchAsyncErrors(async(req,res,next)=>{
//   const user = req.user;
//   let findUser = await User.findById(user._id);
//   if(!findUser){
//     return next(new ErrorHandler("cannot find user",400))
//   }
//   findUser = await User.findByIdAndUpdate(user._id,{
//     name:req.body.name,
//     gender:req.body.gender,
//     email:req.body.email,
//     phone:req.body.phone,
//     dob:req.body.dob

//   },{
//     runValidators:true,
//     modify:false
//   })
//   res.status(200).json({message:"user details updated",success:true})
// })

// const deleteUser = catchAsyncErrors(async(req,res)=>{
//   const user = req.user;
//   let findUser = await User.findById(user._id);
//   if(!findUser){
//     return next(new ErrorHandler("cannot find user",400))
//   }
//   findUser.deleteOne();
//   res.status(200).json({message:"user deleted",success:true}).cookie("token","",{
//     expiresIn: new Date(Date.now())
//   })
// })



export const myProfile = catchAsyncErrors(async(req,res,next)=>{
    const user = req.user;
    res.status(200)
    .json({
        success:true,
        user,
    }) 
})