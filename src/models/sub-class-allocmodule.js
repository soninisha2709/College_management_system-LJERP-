const staff = require('./staffmodule');
const sub = require('./subjectmodule');
const mongoose = require('mongoose');

const subClassAllocSchema = new mongoose.Schema({
    classid:{
        type:String,
        required : true
    },
    fid:{
        type:String,
        required:true,
        ref:staff
    },
    subid:{
        type:String,
        required:true,
        ref:sub
    }
    
})

//now we need to create a collection (table)

const SubClassAlloc = new mongoose.model("SubClassAlloc",subClassAllocSchema);

module.exports = SubClassAlloc;