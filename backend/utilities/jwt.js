const jwt = require('jsonwebtoken');

const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only over HTTPS in production
        sameSite: 'none', // Required for cross-site cookies
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
