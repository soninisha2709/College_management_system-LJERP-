const mongoose = require('mongoose');

const classTableSchema = new mongoose.Schema({
    
    class_id:{
        type:String,
        required : true,
    },
    
    className:{
        type:String,
        required : true
    }
    
})

//now we need to create a collection (table)

const ClassTable = new mongoose.model("ClassTable",classTableSchema);

module.exports = ClassTable;