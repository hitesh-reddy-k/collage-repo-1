const jwt = require('jsonwebtoken');

const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    const options = {
        expiresIn: '140d',
        httpOnly: true,
    };

    res.status(statusCode)
       .cookie("token", token, options)
       .json({
        success: true,
        token,
        role: user.role,
        userId: user._id,
        user: {
            role: user.role,
            id: user._id, 
        },
        });
};

module.exports = sendToken;
