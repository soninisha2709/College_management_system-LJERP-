const mongoose = require('mongoose');
const staffSchema = new mongoose.Schema({
    fid:{
        type:String,
        required:true,
        unique:true,
        index:true
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

const Staff = new mongoose.model("Staff",staffSchema);


module.exports = Staff;