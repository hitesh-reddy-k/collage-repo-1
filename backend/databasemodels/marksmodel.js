const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true

    },
    rollNumber:{
        type: String,
        ref: 'User',
        required: true
    },
    semester: {
       type:Number,
       required: true
    },
    img:{
        data: Buffer,
        contentType: String,
        },
    reserversId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
    
}, {timestamps: true});

module.exports = mongoose.model("Marks", marksSchema);
