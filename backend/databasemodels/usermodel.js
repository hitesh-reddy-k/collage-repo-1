const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true
    },
    RollNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    conformpassword: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        unique: true,
        required: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    PhoneNumber: {
        type: Number,
        unique: true,
        required: true
    },
    role: {
        type: String,
        
    },
    description:{
        type:String,
    },
    Github:{
        type:String
    },
    instagram:{
        type:String
    },
    linkedIn:{
        type:String
    },
    Studentrole:{
        type:String
    },
    Branch:{
        type:String,
    },
    Attendance: {
        type: Number,
        default: 0 // Default attendance percentage
    }
}, { timestamps: true });

// Validation: Check if password and confirmpassword match
UserSchema.pre("validate", function(next) {
    if (this.isNew && this.password !== this.conformpassword) {
        this.invalidate('conformpassword', 'Passwords do not match');
    }
    next();
});

// Hash password before saving
UserSchema.pre("save", async function(next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        this.password = await bcrypt.hash(this.password, 10);
        // Clear conformpassword after validation - no need to store it
        this.conformpassword = undefined;
        next();
    } catch (error) {
        return next(error);
    }
});

UserSchema.methods.getJWTToken = function() {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

UserSchema.methods.comparePassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        return false;
    }
};

module.exports = mongoose.model("User", UserSchema);
