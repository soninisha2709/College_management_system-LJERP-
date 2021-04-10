const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    
    email:{
        type:String,
        required : true,
        unique :true
    },
    
    password:{
        type:String,
        required : true
    }
    
})

//now we need to create a collection (table)

const Admin = new mongoose.model("Admin",adminSchema);

module.exports = Admin;