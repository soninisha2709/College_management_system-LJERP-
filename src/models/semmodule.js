const mongoose = require('mongoose');
const semSchema = new mongoose.Schema({
    sid:{
        type:String,
        required : true,
        index : true,
        unique : true
    },
    semname:{
        type:String,
        required : true
    }
    
})

//now we need to create a collection (table)

const Semester = new mongoose.model("Semester",semSchema);

module.exports = Semester;