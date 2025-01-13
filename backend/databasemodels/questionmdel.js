const mongoose = require("mongoose");



const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    Username: {
        type: String,
    },
    comment: {
        type: String,
    },
    likes: {
        type: Number,
    },
    replies:[{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        Username: {
            type: String,
        },
        comment: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const questionsSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Please Enter Post Name"],
        trim: true,
    },
    img: {
        data: Buffer,
        contentType: String,
    },
    level:{
        type: String,
    },
    solution:{
        type: String,
    },
    likesAndComments: [commentSchema],
    likedBy: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model("question", questionsSchema);
