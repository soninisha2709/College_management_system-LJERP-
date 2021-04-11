const mongoose = require('mongoose');
const studentDetailsSchema = new mongoose.Schema({
    enroll:{
        type:Number,
        required : true,
        index: true,
    },
    cid:{
        type:String,
        required:true,    
    },
    couid:{
        type:String,
        required:true,    
    },
    sid:{
            type:Number,
            required:true
    } 
})

//now we need to create a collection (table)

const StudentDetails = new mongoose.model("StudentDetails",studentDetailsSchema);


module.exports = StudentDetails;