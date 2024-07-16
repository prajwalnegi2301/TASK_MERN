import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Task from "../models/task.model.js";

export const createTask = catchAsyncErrors(async (req, res, next) => {
  const { title, description, archived, status } = req.body;
  if (!title || !description || !archived || !status) {
    return next(new ErrorHandler("Fill all the credentials", 400));
  }
  const user = req.user._id;
  const task = await Task.create({
    title,
    description,
    status,
    archived,
    createdBy,
  });
  res.status(200).json({
    sucess: true,
    task,
    message: "Task created",
  });
});

export const updateTask = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const task = await Task.findById(id);
  if (!task) {
    return next(new ErrorHandler("Task Not Found"));
  }
  task = await Task.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndMOdify: false,
  });
  res.status(200).json({
    sucess: true,
    message: "Task Updated",
  });
});

export const deleteTask = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) {
    return next(new ErrorHandler("Cannot find task", 400));
  }
  await task.deleteOne();
  res.status(200).json({
    sucess: true,
    message: "Task Deleted",
  });
});


export const getMyTask = catchAsyncErrors(async (req, res, next) => {
  const user = req.user._id;
  const { id } = req.params;
  const task = await Task.find({
    createdBy: user,
  });
  if (!task) {
    return next(new ErrorHandler("Cannot find task", 400));
  }
  res.status(200).json({
    message: "here is the task",
    success: true,
  });
});


export const getSingleTask  =(catchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params;
    const task = await task.findById(id);
    if(!task){
        return next(new ErrorHandler("cannot find task",400));
    }
    res.status(200).json({message:"Task Found",success:true});
}));