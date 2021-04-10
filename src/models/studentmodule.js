const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    enroll:{
        type:Number,
        required : true,
        unique :true,
        index: true,
    },
    name:{
        type:String,
        required:true,    
    },
    address:{
        type:String,
        required:true,    
    },
    phone:{
            type:Number,
            required:true,
            unique:true,
    },
    email:{
        type:String,
        required:true,   
        unique:true, 
    },
    password:{
        type:String,
        required : true
    },
    cpassword:{
        type:String,
        required : true
    } 
})

//now we need to create a collection (table)

const Student = new mongoose.model("Student",studentSchema);


module.exports = Student;