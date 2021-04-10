const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
    cid:{
        type:String,
        required : true,
        index : true,
        unique : true
    },
    cname:{
        type:String,
        required : true
    }
    
})

//now we need to create a collection (table)

const Course = new mongoose.model("Course",courseSchema);

module.exports = Course;