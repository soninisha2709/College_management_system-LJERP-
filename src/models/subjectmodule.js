const mongoose = require('mongoose');
const course = require('../models/coursemodule');
const sem = require('../models/semmodule');
const subjectSchema = new mongoose.Schema({
    subid:{
        type:String,
        required : true,
        index : true,
        unique : true
    },
    subname:{
        type:String,
        required : true
    },
    cid:{
        type:String,
        required : true
    },
    sid:{
        type : Number,
         required : true
        }
    
})

//now we need to create a collection (table)

const Subject = new mongoose.model("Subject",subjectSchema);

module.exports = Subject;