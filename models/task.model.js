import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    status:{
        type:String,
        enum:["completed","incomplete"],
    },
    archived:{
        type:Boolean,
        default:false,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
},{
    timestamps:true,
})

const task = mongoose.model('Task',taskSchema);
export default task;