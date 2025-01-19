const mongoose = require('mongoose')

const User = require("../databasemodels/usermodel")


const clubsShema = new mongoose.Schema(
    {
        clubs:{
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            clubName: {
                type: String,
                required: true,
            },
            post:{
                type: String,
            }
        }
    }
)

module.exports = mongoose.model("clubsShema", clubsShema)